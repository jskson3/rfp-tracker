# RFP Tracker

A lightweight tool for running IT vendor RFPs (requests for proposal), from intake through vendor evaluation and approval.

**Live demo:** https://rfp-tracker-swart.vercel.app (also on GitHub Pages: https://jskson3.github.io/rfp-tracker)

**Case study:** [how the process and the app were designed and built](https://rfp-tracker-swart.vercel.app/case-study.html) (source: [case-study.html](case-study.html))

## About

This is a personal portfolio project. I'm designing an RFP process framework from scratch and building the app with AI coding tools.

- Uses only made-up sample data.
- Saves to a shared Supabase (Postgres) database, with the browser's own storage as an offline fallback. Without a database configured it runs entirely in the browser. Setup: [supabase/SETUP.md](supabase/SETUP.md).
- Anyone can try it as a guest (changes stay in their browser); only signed-in editors save to the database. Setup: [supabase/LOGINS.md](supabase/LOGINS.md).
- Single-file web app (HTML, CSS and JavaScript), with no install needed.
- Drafts with Google Gemini in one click, as the AI agent for each stage (Intake, Requirements, Vendor research, Vendor liaison, Evaluation assistant) (setup: [api/GEMINI.md](api/GEMINI.md)).
- Generates a draft RFP document and a ready-to-paste AI prompt from each request, tailored by category, data access and risk tier.

## Roadmap

- [x] Clickable prototype with sample data
- [x] Shared database (Supabase)
- [x] Logins: visitors try it as guests, signed-in editors save (Supabase Auth and row level security)
- [x] Hosting on Vercel (ready for server code that keeps API keys out of the browser)
- [ ] Roles linked to accounts
- [x] AI drafting by a different agent at each stage (Google Gemini, called from a Vercel serverless function so the key stays secret)
- [ ] AI summaries of vendor responses
- [ ] Reporting dashboard
- [x] Case study write-up
