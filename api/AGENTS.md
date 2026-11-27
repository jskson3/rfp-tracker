# From AI assistant to AI agent

The app has seven AI helpers, one per stage. Most of them are **assistants**: you click a button, the app sends one prompt to Gemini, and you get one draft back. That's useful, but the AI doesn't decide anything or look anything up.

The **Vendor research agent** ([`_research-agent.js`](_research-agent.js)) is a real **agent**. The difference is five things:

| | Assistant (one prompt) | Agent |
|---|---|---|
| **Goal** | "Write this draft" | "Propose a sourced shortlist of vendors worth inviting" |
| **Tools** | None | Functions it can call: `read_rfp`, `search_vendors`, `get_vendor_profile`, `screen_vendor`, `submit_shortlist` |
| **Loop** | One call | Ask Gemini what to do next, run that tool, give it the result, repeat |
| **Stop condition** | After one answer | When it submits a shortlist the code accepts, or after 8 Gemini calls |
| **Person in the loop** | Reads the draft | Ticks the vendors to keep and approves; nothing is saved before that |

## How a run works

1. On an RFP at the **Vendor list** stage, click **Run the Vendor research agent**.
2. The page sends the intake answers to [`research.js`](research.js) on Vercel. The Gemini key stays there.
3. The server runs the loop. Gemini chooses the tools; the server runs them and sends each step back to the page as it happens.
4. `screen_vendor` is plain code, not AI: sanctions, breaches in the last 3 years, financial health, Canadian hosting (if data is involved), SOC 2 or ISO 27001, and SOC 1 for client or investor services. So the facts can't be made up.
5. `submit_shortlist` is checked by code too: every vendor must have been screened, and none may fail a must-have. If the agent breaks a rule, the code sends it back with the reason and the agent fixes it.
6. The page shows the shortlist with each vendor's reason, screening result and source. A signed-in editor unticks any they don't want and clicks **Approve and save shortlist**. Guests can watch, but can't approve.

## Guardrails

- It never scores, ranks or picks the winner. People do that in the Evaluate stage.
- It never contacts vendors. A person sends every invitation.
- It only knows a **made-up sample vendor directory** ([`_vendors.js`](_vendors.js)). No real companies, and no web search, so it can't pick up wrong or harmful content from the internet.
- At most 8 Gemini calls per run, to stay inside the free quota.
- The approval and the run are written to the audit log.

## Tests

`node --test tests/*.test.js` runs the loop with a scripted, fake Gemini, so tests are free and need no key. GitHub runs them on every pull request.

## What could come next

- **Coordinator agent:** each morning, look across open RFPs for overdue sign-offs and stalled stages, and draft reminders for the Process Owner to send. Same pattern: tools (`list_open_rfps`, `pending_signoffs`, `draft_reminder`), a step limit, and a person who sends.
- **The internal Microsoft version:** in Copilot Studio, the same agent is a Copilot Studio agent with *actions* (its tools: Power Automate flows that read the SharePoint RFP list and the vendor list, and run the screening checks). Its *instructions* hold the goal and rules above, and the shortlist goes to an approval in Teams before it is written to SharePoint.
