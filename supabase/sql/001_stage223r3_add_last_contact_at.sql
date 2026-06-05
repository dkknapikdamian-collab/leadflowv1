-- STAGE223R3-A — Last Contact Intake
-- Run in Supabase SQL Editor before relying on last_contact_at persistence.
-- Purpose: store explicit last contact date for leads and clients so 7/14 day silence badges do not treat created_at/updated_at as contact truth.

alter table public.leads
  add column if not exists last_contact_at timestamptz;

alter table public.clients
  add column if not exists last_contact_at timestamptz;

comment on column public.leads.last_contact_at is
  'Explicit last customer contact date captured during lead intake. Used by CloseFlow activity truth and silence badges.';

comment on column public.clients.last_contact_at is
  'Explicit last customer contact date captured during client intake. Used by CloseFlow activity truth and silence badges.';

-- Guard check:
-- select column_name from information_schema.columns
-- where table_schema = 'public'
--   and table_name in ('leads', 'clients')
--   and column_name = 'last_contact_at'
-- order by table_name;
