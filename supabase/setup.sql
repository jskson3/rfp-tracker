-- RFP Tracker: database setup for Supabase.
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.
-- Safe to run more than once.

-- One row per RFP. Column names match the app and the CSV exports.
create table if not exists public.rfps (
  "RFPID"            text primary key,
  "Title"            text not null check (length("Title") <= 200),
  "Sponsor"          text check (length("Sponsor") <= 200),
  "Department"       text check (length("Department") <= 100),
  "Problem"          text check (length("Problem") <= 4000),
  "Category"         text,
  "Budget"           numeric,
  "NeededBy"         date,
  "PurchaseType"     text,
  "Justification"    text check (length("Justification") <= 4000),
  "DataAccess"       text,
  "CriticalService"  text,
  "ClientOrInvestor" text,
  "Path"             text,
  "RiskTier"         text,
  "Stage"            text,
  "Status"           text,
  "Created"          timestamptz default now(),
  "StageSince"       timestamptz default now(),
  "Approvals"        jsonb not null default '{}'::jsonb,
  "Notes"            jsonb not null default '[]'::jsonb
);

-- The approval and audit log. Deleting an RFP deletes its log entries.
create table if not exists public.activity_log (
  "LogID"  uuid primary key,
  "RFPID"  text not null references public.rfps("RFPID") on delete cascade,
  "When"   timestamptz not null default now(),
  "Who"    text,
  "Action" text,
  "Detail" text check (length("Detail") <= 4000)
);
create index if not exists activity_log_rfpid on public.activity_log("RFPID");

-- Row level security. This is a public demo with made-up data and no logins yet,
-- so anyone with the public key may read and change rows. Logins come in a later step.
alter table public.rfps         enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "demo full access" on public.rfps;
create policy "demo full access" on public.rfps
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "demo full access" on public.activity_log;
create policy "demo full access" on public.activity_log
  for all to anon, authenticated using (true) with check (true);

grant select, insert, update, delete on public.rfps, public.activity_log to anon, authenticated;
