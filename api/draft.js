// Vercel serverless function: drafts with Google Gemini, as the AI agent for the RFP's current stage (see agents.js).
// The Gemini key lives in Vercel's environment variables (GEMINI_API_KEY), never in the page.
// The page sends only the intake answers; the prompt is built here, so this can't be used
// as a general-purpose Gemini proxy. Sample data only: free-tier inputs may be used by Google.

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const { buildPrompt: agentPrompt, STAGE_AGENT } = require("../agents.js");
const PATHS = ["Quick quote", "Light RFP", "Full RFP"];
const TIERS = ["Low", "Medium", "High"];

// Keep text short and on one line, so a field can't smuggle in extra instructions.
const clean = (v, max) => String(v ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max);
const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);
const yesNo = v => (v === "yes" ? "yes" : "no");

function buildPrompt(r) {
  const budget = Math.max(0, Math.min(1e9, Number(r.Budget) || 0));
  return agentPrompt({
    Title: clean(r.Title, 200), Problem: clean(r.Problem, 1500), Category: clean(r.Category, 60),
    NeededBy: clean(r.NeededBy, 10), Path: pick(r.Path, PATHS, "Light RFP"), RiskTier: pick(r.RiskTier, TIERS, "Medium"),
    Stage: pick(r.Stage, Object.keys(STAGE_AGENT), "Requirements"), DataAccess: pick(r.DataAccess, ["none", "internal", "customer"], "none"),
    CriticalService: yesNo(r.CriticalService), ClientOrInvestor: yesNo(r.ClientOrInvestor)
  }, "$" + budget.toLocaleString("en-CA"), true);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // the GitHub Pages copy calls this too
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: "AI drafting isn't switched on yet." });

  let r = req.body;
  if (typeof r === "string") { try { r = JSON.parse(r); } catch (e) { r = null; } }
  if (!r || typeof r !== "object" || !clean(r.Title, 200)) return res.status(400).json({ error: "Send the RFP's intake answers." });

  try {
    const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(r) }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
      })
    });
    const d = await g.json().catch(() => ({}));
    if (!g.ok) {
      console.error("Gemini error", g.status, JSON.stringify(d).slice(0, 500));
      const busy = g.status === 429;
      return res.status(busy ? 429 : 502).json({ error: busy ? "The free AI quota is used up for now. Try again in a minute." : "The AI service returned an error. Try again later." });
    }
    const text = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
    if (!text) return res.status(502).json({ error: "The AI returned an empty answer. Try again." });
    return res.status(200).json({ text, model: MODEL });
  } catch (e) {
    console.error("Gemini call failed", e);
    return res.status(502).json({ error: "Could not reach the AI service. Try again later." });
  }
};

module.exports.buildPrompt = buildPrompt;
