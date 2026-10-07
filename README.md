# RFP Tracker

A lightweight tool for running IT vendor RFPs (requests for proposal), from intake through vendor evaluation and approval.

**Live demo:** https://jskson3.github.io/rfp-tracker

## About

This is a personal portfolio project. I'm designing an RFP process framework from scratch and building the app with AI coding tools.

- Uses only made-up sample data.
- Saves to a shared Supabase (Postgres) database, with the browser's own storage as an offline fallback. Without a database configured it runs entirely in the browser. Setup: [supabase/SETUP.md](supabase/SETUP.md).
- Single-file web app (HTML, CSS and JavaScript), with no install needed.
- Generates a draft RFP document and a ready-to-paste AI prompt from each request, tailored by category, data access and risk tier.

## Roadmap

- [x] Clickable prototype with sample data
- [x] Shared database (Supabase)
- [ ] Logins and roles (Supabase Auth)
- [ ] AI assistants for drafting RFPs and summarizing vendor responses
- [ ] Reporting dashboard
