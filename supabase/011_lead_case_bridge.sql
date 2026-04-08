create extension if not exists pgcrypto;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  )
$$;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  normalized_email text not null default '',
  normalized_phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_workspace_id on public.contacts (workspace_id);
create index if not exists idx_contacts_workspace_company on public.contacts (workspace_id, company);
create unique index if not exists uq_contacts_workspace_normalized_email
  on public.contacts (workspace_id, normalized_email)
  where normalized_email <> '';
create unique index if not exists uq_contacts_workspace_normalized_phone
  on public.contacts (workspace_id, normalized_phone)
  where normalized_phone <> '';

alter table public.leads
  add column if not exists contact_id uuid references public.contacts(id) on delete set null,
  add column if not exists case_id uuid;

create table if not exists public.case_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  code text not null default '',
  title text not null,
  description text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_case_templates_workspace_code
  on public.case_templates (workspace_id, code)
  where code <> '';
create index if not exists idx_case_templates_workspace_id on public.case_templates (workspace_id);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete restrict,
  source_lead_id uuid references public.leads(id) on delete set null,
  template_id uuid references public.case_templates(id) on delete set null,
  created_by_user_id uuid references auth.users(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null default '',
  operational_status text not null default 'not_started' check (operational_status in ('not_started', 'collecting_materials', 'waiting_for_client', 'under_review', 'ready_to_start', 'in_progress', 'blocked', 'closed')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  value numeric(12, 2) not null default 0,
  start_at timestamptz,
  due_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cases_workspace_id on public.cases (workspace_id);
create index if not exists idx_cases_workspace_status on public.cases (workspace_id, operational_status);
create index if not exists idx_cases_contact_id on public.cases (contact_id);
create index if not exists idx_cases_source_lead_id on public.cases (source_lead_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_case_id_fkey'
  ) then
    alter table public.leads
      add constraint leads_case_id_fkey
      foreign key (case_id) references public.cases(id) on delete set null;
  end if;
end;
$$;

create unique index if not exists uq_leads_case_id_not_null
  on public.leads (case_id)
  where case_id is not null;
create index if not exists idx_leads_contact_id on public.leads (contact_id);

create table if not exists public.template_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  template_id uuid not null references public.case_templates(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  sort_order integer not null default 100,
  item_kind text not null default 'task' check (item_kind in ('task', 'checklist', 'milestone', 'document', 'approval')),
  title text not null,
  description text not null default '',
  required boolean not null default true,
  default_due_offset_days integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_template_items_workspace_id on public.template_items (workspace_id);
create index if not exists idx_template_items_template_sort on public.template_items (template_id, sort_order);

create table if not exists public.case_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  template_item_id uuid references public.template_items(id) on delete set null,
  created_by_user_id uuid references auth.users(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete set null,
  sort_order integer not null default 100,
  item_kind text not null default 'task' check (item_kind in ('task', 'checklist', 'milestone', 'document', 'approval')),
  title text not null,
  description text not null default '',
  status text not null default 'none' check (status in ('none', 'request_sent', 'delivered', 'under_review', 'needs_correction', 'accepted', 'not_applicable')),
  required boolean not null default true,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_case_items_workspace_id on public.case_items (workspace_id);
create index if not exists idx_case_items_case_sort on public.case_items (case_id, sort_order);
create index if not exists idx_case_items_status on public.case_items (workspace_id, status);

create table if not exists public.file_attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  case_item_id uuid references public.case_items(id) on delete cascade,
  attachment_scope text not null default 'case' check (attachment_scope in ('case', 'case_item')),
  uploaded_by_user_id uuid references auth.users(id) on delete set null,
  file_name text not null,
  file_type text not null default 'application/octet-stream',
  file_size_bytes bigint not null default 0,
  storage_path text not null,
  created_at timestamptz not null default now(),
  constraint chk_file_attachments_owner check (
    (case_id is not null and case_item_id is null and attachment_scope = 'case')
    or (case_item_id is not null and attachment_scope = 'case_item')
  )
);

create index if not exists idx_file_attachments_workspace_id on public.file_attachments (workspace_id);
create index if not exists idx_file_attachments_case_id on public.file_attachments (case_id);
create index if not exists idx_file_attachments_case_item_id on public.file_attachments (case_item_id);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  case_item_id uuid references public.case_items(id) on delete cascade,
  requested_by_user_id uuid references auth.users(id) on delete set null,
  reviewer_user_id uuid references auth.users(id) on delete set null,
  reviewer_contact_id uuid references public.contacts(id) on delete set null,
  status text not null default 'not_sent' check (status in ('not_sent', 'sent', 'reminder_sent', 'answered', 'overdue')),
  title text not null,
  description text not null default '',
  due_at timestamptz,
  decided_at timestamptz,
  decision_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_approvals_owner check (case_id is not null or case_item_id is not null)
);

create index if not exists idx_approvals_workspace_id on public.approvals (workspace_id);
create index if not exists idx_approvals_case_id on public.approvals (case_id);
create index if not exists idx_approvals_case_item_id on public.approvals (case_item_id);
create index if not exists idx_approvals_status on public.approvals (workspace_id, status);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  case_item_id uuid references public.case_items(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  channel text not null default 'in_app' check (channel in ('in_app', 'email', 'sms')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'read', 'dismissed')),
  title text not null,
  body text not null default '',
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notifications_workspace_id on public.notifications (workspace_id);
create index if not exists idx_notifications_scheduled on public.notifications (workspace_id, scheduled_at);
create index if not exists idx_notifications_status on public.notifications (workspace_id, status);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_contact_id uuid references public.contacts(id) on delete set null,
  activity_source text not null check (activity_source in ('sales', 'operations', 'system')),
  activity_type text not null,
  lead_id uuid references public.leads(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  case_item_id uuid references public.case_items(id) on delete cascade,
  attachment_id uuid references public.file_attachments(id) on delete set null,
  approval_id uuid references public.approvals(id) on delete set null,
  notification_id uuid references public.notifications(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_log_workspace_id on public.activity_log (workspace_id);
create index if not exists idx_activity_log_created_at on public.activity_log (workspace_id, created_at desc);
create index if not exists idx_activity_log_lead_case on public.activity_log (lead_id, case_id);

create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  token_hash text not null unique,
  created_by_user_id uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_client_portal_tokens_workspace_id on public.client_portal_tokens (workspace_id);
create index if not exists idx_client_portal_tokens_case_id on public.client_portal_tokens (case_id);
create index if not exists idx_client_portal_tokens_expires_at on public.client_portal_tokens (expires_at);

drop trigger if exists trg_contacts_updated_at on public.contacts;
create trigger trg_contacts_updated_at
before update on public.contacts
for each row
execute function public.set_updated_at();

drop trigger if exists trg_case_templates_updated_at on public.case_templates;
create trigger trg_case_templates_updated_at
before update on public.case_templates
for each row
execute function public.set_updated_at();

drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at
before update on public.cases
for each row
execute function public.set_updated_at();

drop trigger if exists trg_template_items_updated_at on public.template_items;
create trigger trg_template_items_updated_at
before update on public.template_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_case_items_updated_at on public.case_items;
create trigger trg_case_items_updated_at
before update on public.case_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_approvals_updated_at on public.approvals;
create trigger trg_approvals_updated_at
before update on public.approvals
for each row
execute function public.set_updated_at();

drop trigger if exists trg_notifications_updated_at on public.notifications;
create trigger trg_notifications_updated_at
before update on public.notifications
for each row
execute function public.set_updated_at();

drop trigger if exists trg_client_portal_tokens_updated_at on public.client_portal_tokens;
create trigger trg_client_portal_tokens_updated_at
before update on public.client_portal_tokens
for each row
execute function public.set_updated_at();

alter table public.contacts enable row level security;
alter table public.case_templates enable row level security;
alter table public.cases enable row level security;
alter table public.template_items enable row level security;
alter table public.case_items enable row level security;
alter table public.file_attachments enable row level security;
alter table public.approvals enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_log enable row level security;
alter table public.client_portal_tokens enable row level security;

drop policy if exists "contacts_select_member" on public.contacts;
create policy "contacts_select_member"
on public.contacts
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_insert_member" on public.contacts;
create policy "contacts_insert_member"
on public.contacts
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_update_member" on public.contacts;
create policy "contacts_update_member"
on public.contacts
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_delete_member" on public.contacts;
create policy "contacts_delete_member"
on public.contacts
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "case_templates_select_member" on public.case_templates;
create policy "case_templates_select_member"
on public.case_templates
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "case_templates_insert_member" on public.case_templates;
create policy "case_templates_insert_member"
on public.case_templates
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "case_templates_update_member" on public.case_templates;
create policy "case_templates_update_member"
on public.case_templates
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "case_templates_delete_member" on public.case_templates;
create policy "case_templates_delete_member"
on public.case_templates
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "cases_select_member" on public.cases;
create policy "cases_select_member"
on public.cases
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "cases_insert_member" on public.cases;
create policy "cases_insert_member"
on public.cases
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "cases_update_member" on public.cases;
create policy "cases_update_member"
on public.cases
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "cases_delete_member" on public.cases;
create policy "cases_delete_member"
on public.cases
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "template_items_select_member" on public.template_items;
create policy "template_items_select_member"
on public.template_items
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "template_items_insert_member" on public.template_items;
create policy "template_items_insert_member"
on public.template_items
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "template_items_update_member" on public.template_items;
create policy "template_items_update_member"
on public.template_items
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "template_items_delete_member" on public.template_items;
create policy "template_items_delete_member"
on public.template_items
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "case_items_select_member" on public.case_items;
create policy "case_items_select_member"
on public.case_items
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "case_items_insert_member" on public.case_items;
create policy "case_items_insert_member"
on public.case_items
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "case_items_update_member" on public.case_items;
create policy "case_items_update_member"
on public.case_items
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "case_items_delete_member" on public.case_items;
create policy "case_items_delete_member"
on public.case_items
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "file_attachments_select_member" on public.file_attachments;
create policy "file_attachments_select_member"
on public.file_attachments
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "file_attachments_insert_member" on public.file_attachments;
create policy "file_attachments_insert_member"
on public.file_attachments
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "file_attachments_update_member" on public.file_attachments;
create policy "file_attachments_update_member"
on public.file_attachments
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "file_attachments_delete_member" on public.file_attachments;
create policy "file_attachments_delete_member"
on public.file_attachments
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "approvals_select_member" on public.approvals;
create policy "approvals_select_member"
on public.approvals
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "approvals_insert_member" on public.approvals;
create policy "approvals_insert_member"
on public.approvals
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "approvals_update_member" on public.approvals;
create policy "approvals_update_member"
on public.approvals
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "approvals_delete_member" on public.approvals;
create policy "approvals_delete_member"
on public.approvals
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "notifications_select_member" on public.notifications;
create policy "notifications_select_member"
on public.notifications
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "notifications_insert_member" on public.notifications;
create policy "notifications_insert_member"
on public.notifications
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "notifications_update_member" on public.notifications;
create policy "notifications_update_member"
on public.notifications
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "notifications_delete_member" on public.notifications;
create policy "notifications_delete_member"
on public.notifications
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "activity_log_select_member" on public.activity_log;
create policy "activity_log_select_member"
on public.activity_log
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "activity_log_insert_member" on public.activity_log;
create policy "activity_log_insert_member"
on public.activity_log
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "activity_log_update_member" on public.activity_log;
create policy "activity_log_update_member"
on public.activity_log
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "activity_log_delete_member" on public.activity_log;
create policy "activity_log_delete_member"
on public.activity_log
for delete
using (public.is_workspace_member(workspace_id));

drop policy if exists "client_portal_tokens_select_member" on public.client_portal_tokens;
create policy "client_portal_tokens_select_member"
on public.client_portal_tokens
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "client_portal_tokens_insert_member" on public.client_portal_tokens;
create policy "client_portal_tokens_insert_member"
on public.client_portal_tokens
for insert
with check (public.is_workspace_member(workspace_id));

drop policy if exists "client_portal_tokens_update_member" on public.client_portal_tokens;
create policy "client_portal_tokens_update_member"
on public.client_portal_tokens
for update
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "client_portal_tokens_delete_member" on public.client_portal_tokens;
create policy "client_portal_tokens_delete_member"
on public.client_portal_tokens
for delete
using (public.is_workspace_member(workspace_id));
