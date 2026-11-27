// Vercel serverless function: runs the Vendor research agent (see _research-agent.js) for one RFP.
// It streams each step back as it happens, one JSON object per line, so the app can show the agent working.
// Lines: {"type":"step",...} for each step, then one {"type":"done",...} or {"type":"error",...}.
// Like draft.js, the page sends only the intake answers and the Gemini key stays on the server.
// Nothing is saved here: the app saves the shortlist only after a signed-in person approves it.

const { cleanRfp, clean, MODEL } = require("./draft.js");
const { runAgent } = require("./_research-agent.js");

class GeminiError extends Error {}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // the GitHub Pages copy calls this too
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: "AI isn't switched on yet." });

  let r = req.body;
  if (typeof r === "string") { try { r = JSON.parse(r); } catch (e) { r = null; } }
  if (!r || typeof r !== "object" || !clean(r.Title, 200)) return res.status(400).json({ error: "Send the RFP's intake answers." });
  const rfp = { RFPID: clean(r.RFPID, 20), ...cleanRfp(r) };

  res.status(200);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const send = o => res.write(JSON.stringify(o) + "\n");

  const callGemini = async body => {
    const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body)
    });
    const d = await g.json().catch(() => ({}));
    if (!g.ok) {
      console.error("Gemini error", g.status, JSON.stringify(d).slice(0, 500));
      throw new GeminiError(g.status === 429 ? "The free AI quota is used up for now. Try again in a minute." : "The AI service returned an error. Try again later.");
    }
    return d;
  };

  try {
    const out = await runAgent(rfp, callGemini, s => send({ type: "step", ...s }));
    send(out.ok ? { type: "done", shortlist: out.shortlist, summary: out.summary, turns: out.turns, model: MODEL }
                : { type: "error", error: out.reason });
  } catch (e) {
    if (!(e instanceof GeminiError)) console.error("Research agent failed", e);
    send({ type: "error", error: e instanceof GeminiError ? e.message : "Could not reach the AI service. Try again later." });
  }
  res.end();
};
