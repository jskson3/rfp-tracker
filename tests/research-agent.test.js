// Tests for the Vendor research agent. Run with: node --test tests/
// Gemini is replaced by a script of replies, so these run offline and free.
const test = require("node:test");
const assert = require("node:assert");
const { runAgent, screen, search, MAX_TURNS } = require("../api/_research-agent.js");
const { VENDORS } = require("../api/_vendors.js");

const RFP = { RFPID: "RFP-001", Title: "Help desk ticketing tool", Problem: "Requests get lost in email.", Category: "Software / SaaS",
  Budget: 60000, NeededBy: "2027-01-31", Path: "Light RFP", RiskTier: "Medium", Stage: "Vendor list", DataAccess: "internal", CriticalService: "no", ClientOrInvestor: "no" };

const call = (name, args, text) => ({ candidates: [{ content: { role: "model", parts: [...(text ? [{ text }] : []), { functionCall: { name, args } }] } }] });
const scripted = replies => { const sent = []; return { sent, fn: async body => { sent.push(JSON.parse(JSON.stringify(body))); return replies.shift(); } }; };

test("runs the loop: reads, searches, screens, then submits a sourced shortlist", async () => {
  const g = scripted([
    call("read_rfp", {}, "First I'll read the RFP."),
    call("search_vendors", { category: "Software / SaaS", keywords: "help desk ticketing" }),
    { candidates: [{ content: { role: "model", parts: [{ functionCall: { name: "screen_vendor", args: { vendor_id: "V-101" } } }, { functionCall: { name: "screen_vendor", args: { vendor_id: "V-103" } } }] } }] },
    call("submit_shortlist", { summary: "Two fit.", vendors: [{ vendor_id: "V-101", reason: "Canadian ticketing tool.", open_questions: ["Pricing?"] }, { vendor_id: "V-103", reason: "Full ITSM." }] })
  ]);
  const seen = [];
  const out = await runAgent(RFP, g.fn, s => seen.push(s));
  assert.equal(out.ok, true);
  assert.equal(out.turns, 4);
  assert.deepEqual(out.shortlist.map(v => v.vendor_id), ["V-101", "V-103"]);
  assert.match(out.shortlist[0].source, /Sample vendor directory/);
  assert.equal(out.shortlist[1].screening, "clear with 1 flag for vendor risk"); // the 2025 breach
  assert.equal(seen[0].kind, "thought");
  assert.equal(seen.filter(s => s.kind === "tool").length, 5);
  // Each tool result goes back to Gemini, and the RFP reaches it only through read_rfp.
  assert.equal(g.sent[1].contents.at(-1).parts[0].functionResponse.response.Title, RFP.Title);
});

test("sends back a shortlist with an unscreened or failing vendor, and the agent corrects it", async () => {
  const g = scripted([
    call("screen_vendor", { vendor_id: "V-105" }),
    call("submit_shortlist", { summary: "x", vendors: [{ vendor_id: "V-105", reason: "cheap" }, { vendor_id: "V-102", reason: "simple" }] }),
    call("screen_vendor", { vendor_id: "V-101" }),
    call("submit_shortlist", { summary: "x", vendors: [{ vendor_id: "V-101", reason: "fits" }] })
  ]);
  const out = await runAgent(RFP, g.fn);
  assert.equal(out.ok, true);
  assert.deepEqual(out.shortlist.map(v => v.vendor_id), ["V-101"]);
  const reply = g.sent[2].contents.at(-1).parts[0].functionResponse.response;
  assert.equal(reply.accepted, false);
  assert.match(reply.problems.join(" "), /fails a must-have/);
  assert.match(reply.problems.join(" "), /not screened/);
});

test("stops when it runs out of steps, and forces a submit on the last one", async () => {
  const g = scripted(Array.from({ length: MAX_TURNS }, () => call("search_vendors", { keywords: "laptop" })));
  const out = await runAgent(RFP, g.fn);
  assert.equal(out.ok, false);
  assert.equal(g.sent.length, MAX_TURNS);
  assert.equal(g.sent.at(-1).toolConfig.functionCallingConfig.mode, "ANY");
  assert.deepEqual(g.sent.at(-1).toolConfig.functionCallingConfig.allowedFunctionNames, ["submit_shortlist"]);
});

test("stops if the model answers in text without using a tool", async () => {
  const out = await runAgent(RFP, async () => ({ candidates: [{ content: { role: "model", parts: [{ text: "Here are some vendors..." }] } }] }));
  assert.equal(out.ok, false);
  assert.match(out.reason, /without proposing/);
});

test("screening checklist rules", () => {
  const v = id => VENDORS.find(x => x.id === id);
  assert.equal(screen(v("V-204"), RFP).outcome, "fails a must-have");        // sanctions
  assert.equal(screen(v("V-102"), RFP).outcome, "fails a must-have");        // no Canadian hosting, data involved
  assert.equal(screen(v("V-102"), { ...RFP, DataAccess: "none" }).outcome, "clear");
  assert.equal(screen(v("V-101"), { ...RFP, ClientOrInvestor: "yes" }).outcome, "clear with 1 flag for vendor risk"); // no SOC 1
});

test("search matches keywords and category", () => {
  assert.ok(search({ keywords: "backup storage" }).some(v => v.vendor_id === "V-301"));
  assert.equal(search({ category: "IT hardware or equipment", keywords: "backup" }).length, 0);
});

test("the sample vendors are clearly made up and unique", () => {
  assert.equal(new Set(VENDORS.map(v => v.id)).size, VENDORS.length);
  assert.ok(VENDORS.every(v => v.id && v.name && v.category));
});
