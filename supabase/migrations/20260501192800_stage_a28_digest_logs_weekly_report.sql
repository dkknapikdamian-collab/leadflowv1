-- STAGE_A28_DIGEST_LOGS_WEEKLY_REPORT
-- Jeden log dla digestu i raportu tygodniowego. Supabase-first, bez Firestore.

create table if not exists public.digest_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  profile_id text null,
  profile_email text not null,
  report_type text not null default 'daily',
  sent_for_date date not null,
  sent_at timestamptz not null default now(),
  status text not null default 'sent',
  error text null,
  summary_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.digest_logs add column if not exists workspace_id uuid null;
alter table public.digest_logs add column if not exists profile_id text null;
alter table public.digest_logs add column if not exists profile_email text;
alter table public.digest_logs add column if not exists report_type text not null default 'daily';
alter table public.digest_logs add column if not exists sent_for_date date;
alter table public.digest_logs add column if not exists sent_at timestamptz not null default now();
alter table public.digest_logs add column if not exists status text not null default 'sent';
alter table public.digest_logs add column if not exists error text null;
alter table public.digest_logs add column if not exists summary_json jsonb not null default '{}'::jsonb;
alter table public.digest_logs add column if not exists created_at timestamptz not null default now();

update public.digest_logs
set report_type = 'daily'
where report_type is null or trim(report_type) = '';

create index if not exists digest_logs_workspace_sent_idx
  on public.digest_logs (workspace_id, report_type, sent_for_date desc, sent_at desc);

create index if not exists digest_logs_email_sent_idx
  on public.digest_logs (profile_email, report_type, sent_for_date desc, sent_at desc);

create unique index if not exists digest_logs_one_report_per_day_idx
  on public.digest_logs (coalesce(workspace_id::text, ''), coalesce(profile_email, ''), report_type, sent_for_date);

alter table public.digest_logs enable row level security;

-- Użytkownik może czytać logi tylko w swoim workspace. Service role i tak omija RLS.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'digest_logs'
      and policyname = 'digest_logs_select_workspace_member'
  ) then
    create policy digest_logs_select_workspace_member on public.digest_logs
      for select
      using (
        workspace_id is not null
        and exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = digest_logs.workspace_id
            and wm.user_id = auth.uid()
        )
      );
  end if;
end $$;
