create table if not exists public.system_email_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  dedupe_key text not null unique,
  recipient_email text not null,
  subject text not null,
  provider text not null,
  provider_message_id text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_system_email_events_workspace_id
  on public.system_email_events (workspace_id);

create index if not exists idx_system_email_events_user_id
  on public.system_email_events (user_id);

alter table public.system_email_events enable row level security;

drop policy if exists "system_email_events_select_own" on public.system_email_events;
create policy "system_email_events_select_own"
on public.system_email_events
for select
using (auth.uid() = user_id);
