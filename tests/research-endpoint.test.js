// Tests the /api/research web address end to end, with Gemini faked. Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert");

function fakeRes() {
  const r = { code: 0, headers: {}, body: "", ended: false };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.status = c => { r.code = c; return r; };
  r.json = o => { r.body = JSON.stringify(o); r.ended = true; return r; };
  r.write = t => { r.body += t; };
  r.end = () => { r.ended = true; };
  return r;
}
const reply = (name, args) => ({ ok: true, status: 200, json: async () => ({ candidates: [{ content: { role: "model", parts: [{ functionCall: { name, args } }] } }] }) });

test("streams steps then the shortlist", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  const replies = [reply("read_rfp", {}), reply("screen_vendor", { vendor_id: "V-301" }),
    reply("submit_shortlist", { summary: "One fits.", vendors: [{ vendor_id: "V-301", reason: "Canadian backup." }] })];
  global.fetch = async (url, opt) => { assert.equal(opt.headers["x-goog-api-key"], "test-key"); return replies.shift(); };
  const handler = require("../api/research.js");
  const res = fakeRes();
  await handler({ method: "POST", body: { RFPID: "RFP-005", Title: "Cloud backup storage", Category: "Cloud and hosting", DataAccess: "internal", Stage: "Vendor list", Budget: 45000 } }, res);
  const lines = res.body.trim().split("\n").map(l => JSON.parse(l));
  assert.equal(res.code, 200);
  assert.equal(lines.filter(l => l.type === "step").length, 3);
  const done = lines.at(-1);
  assert.equal(done.type, "done");
  assert.equal(done.shortlist[0].name, "Borealis Cloud Vault");
  assert.ok(res.ended);
});

test("reports a used-up quota in plain English", async () => {
  global.fetch = async () => ({ ok: false, status: 429, json: async () => ({}) });
  const res = fakeRes();
  await require("../api/research.js")({ method: "POST", body: { Title: "x" } }, res);
  const last = JSON.parse(res.body.trim().split("\n").at(-1));
  assert.equal(last.type, "error");
  assert.match(last.error, /quota/);
});

test("refuses requests without an RFP", async () => {
  const res = fakeRes();
  await require("../api/research.js")({ method: "POST", body: {} }, res);
  assert.equal(res.code, 400);
});
