-- B4 remediation: bind approved records to their draft and make confirmation
-- claims recoverable. The server remains the only confirmation writer.

alter table if exists public.leads
  add column if not exists ai_draft_id text;

alter table if exists public.work_items
  add column if not exists ai_draft_id text;

alter table if exists public.activities
  add column if not exists ai_draft_id text;

create unique index if not exists leads_workspace_ai_draft_id_uidx
  on public.leads (workspace_id, ai_draft_id)
  where ai_draft_id is not null;

create unique index if not exists work_items_workspace_ai_draft_id_uidx
  on public.work_items (workspace_id, ai_draft_id)
  where ai_draft_id is not null;

create unique index if not exists activities_workspace_ai_draft_id_uidx
  on public.activities (workspace_id, ai_draft_id)
  where ai_draft_id is not null;

alter table if exists public.ai_draft_confirmation_claims
  add column if not exists expires_at timestamptz;

update public.ai_draft_confirmation_claims
   set expires_at = coalesce(expires_at, created_at + interval '10 minutes')
 where expires_at is null;

create index if not exists ai_draft_confirmation_claims_expiry_idx
  on public.ai_draft_confirmation_claims (expires_at);

create or replace function public.claim_ai_draft_confirmation(
  p_draft_id text,
  p_workspace_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.ai_draft_confirmation_claims
   where expires_at is not null and expires_at <= now();

  insert into public.ai_draft_confirmation_claims (draft_id, workspace_id, expires_at)
  values (p_draft_id, p_workspace_id, now() + interval '10 minutes')
  on conflict (draft_id) do nothing;

  return found;
end;
$$;

revoke execute on function public.claim_ai_draft_confirmation(text, text) from public, anon, authenticated;
grant execute on function public.claim_ai_draft_confirmation(text, text) to service_role;
