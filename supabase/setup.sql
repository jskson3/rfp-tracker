-- RFP Tracker: database setup for Supabase.
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.
-- Safe to run more than once: running it again updates the security rules and keeps your data.

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

-- Row level security: who may do what.
-- Anyone with the public key may read (it's a public demo with made-up data).
-- Only signed-in editors may add, change or delete RFPs.
-- The audit log can only be added to, never edited, so the approval history can't be rewritten.
-- (Deleting an RFP still removes its log entries, because the cascade is part of the table design.)
alter table public.rfps         enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "demo full access"       on public.rfps;
drop policy if exists "anyone can read"        on public.rfps;
drop policy if exists "editors can add"        on public.rfps;
drop policy if exists "editors can change"     on public.rfps;
drop policy if exists "editors can delete"     on public.rfps;
create policy "anyone can read"    on public.rfps for select to anon, authenticated using (true);
create policy "editors can add"    on public.rfps for insert to authenticated with check (true);
create policy "editors can change" on public.rfps for update to authenticated using (true) with check (true);
create policy "editors can delete" on public.rfps for delete to authenticated using (true);

drop policy if exists "demo full access"       on public.activity_log;
drop policy if exists "anyone can read"        on public.activity_log;
drop policy if exists "editors can add"        on public.activity_log;
create policy "anyone can read" on public.activity_log for select to anon, authenticated using (true);
create policy "editors can add" on public.activity_log for insert to authenticated with check (true);

-- Table permissions match the policies above.
revoke all on public.rfps, public.activity_log from anon, authenticated;
grant select                         on public.rfps, public.activity_log to anon;
grant select, insert, update, delete on public.rfps                     to authenticated;
grant select, insert                 on public.activity_log             to authenticated;
