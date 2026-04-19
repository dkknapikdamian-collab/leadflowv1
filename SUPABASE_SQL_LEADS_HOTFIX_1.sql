-- LEADS HOTFIX 1
-- Additive patch for Supabase schema drift.
-- Safe to run multiple times.

alter table public.leads
  add column if not exists workspace_id uuid null,
  add column if not exists created_by_user_id uuid null,
  add column if not exists company text not null default '',
  add column if not exists email text not null default '',
  add column if not exists phone text not null default '',
  add column if not exists source text not null default 'other',
  add column if not exists value numeric not null default 0,
  add column if not exists partial_payments jsonb not null default '[]'::jsonb,
  add column if not exists summary text not null default '',
  add column if not exists notes text not null default '',
  add column if not exists priority text not null default 'medium',
  add column if not exists is_at_risk boolean not null default false,
  add column if not exists next_action_title text not null default '',
  add column if not exists next_action_at timestamptz null,
  add column if not exists next_action_item_id text null,
  add column if not exists linked_case_id uuid null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_leads_updated_at_hotfix on public.leads(updated_at desc);
create index if not exists idx_leads_next_action_at_hotfix on public.leads(next_action_at);
create index if not exists idx_leads_linked_case_id_hotfix on public.leads(linked_case_id);

select 'ok' as status;
