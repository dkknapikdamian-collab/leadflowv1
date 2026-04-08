create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  source_lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  description text not null default '',
  sales_status text not null default 'won',
  operational_status text not null default 'intake' check (operational_status in ('intake','active','waiting_client','blocked','done','canceled')),
  value numeric(12,2) not null default 0,
  started_at timestamptz,
  due_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads
  add column if not exists contact_id uuid references public.contacts(id) on delete set null,
  add column if not exists case_id uuid references public.cases(id) on delete set null;

create table if not exists public.case_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  description text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.template_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  template_id uuid not null references public.case_templates(id) on delete cascade,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  template_item_id uuid references public.template_items(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo','in_progress','done','blocked')),
  sort_order integer not null default 0,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.file_attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  case_item_id uuid references public.case_items(id) on delete cascade,
  uploaded_by_user_id uuid references auth.users(id) on delete set null,
  file_name text not null,
  mime_type text not null default 'application/octet-stream',
  file_size_bytes bigint not null default 0,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  case_item_id uuid references public.case_items(id) on delete cascade,
  requested_by_user_id uuid references auth.users(id) on delete set null,
  requested_to_email text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  note text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  case_item_id uuid references public.case_items(id) on delete set null,
  event_scope text not null check (event_scope in ('sales','operations','system')),
  event_type text not null,
  event_title text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null default 'in_app' check (channel in ('in_app','email')),
  title text not null,
  message text not null default '',
  related_lead_id uuid references public.leads(id) on delete set null,
  related_case_id uuid references public.cases(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contacts_workspace on public.contacts (workspace_id);
create index if not exists idx_cases_workspace on public.cases (workspace_id);
create index if not exists idx_cases_source_lead on public.cases (source_lead_id);
create index if not exists idx_leads_case_id on public.leads (case_id);
create index if not exists idx_template_items_template on public.template_items (template_id);
create index if not exists idx_case_items_case on public.case_items (case_id);
create index if not exists idx_activity_workspace_created on public.activity_log (workspace_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_contacts_updated_at on public.contacts;
create trigger trg_contacts_updated_at before update on public.contacts for each row execute function public.touch_updated_at();
drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at before update on public.cases for each row execute function public.touch_updated_at();
drop trigger if exists trg_case_templates_updated_at on public.case_templates;
create trigger trg_case_templates_updated_at before update on public.case_templates for each row execute function public.touch_updated_at();
drop trigger if exists trg_template_items_updated_at on public.template_items;
create trigger trg_template_items_updated_at before update on public.template_items for each row execute function public.touch_updated_at();
drop trigger if exists trg_case_items_updated_at on public.case_items;
create trigger trg_case_items_updated_at before update on public.case_items for each row execute function public.touch_updated_at();
drop trigger if exists trg_approvals_updated_at on public.approvals;
create trigger trg_approvals_updated_at before update on public.approvals for each row execute function public.touch_updated_at();

alter table public.contacts enable row level security;
alter table public.cases enable row level security;
alter table public.case_templates enable row level security;
alter table public.template_items enable row level security;
alter table public.case_items enable row level security;
alter table public.file_attachments enable row level security;
alter table public.approvals enable row level security;
alter table public.activity_log enable row level security;
alter table public.notifications enable row level security;
alter table public.client_portal_tokens enable row level security;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.create_case_from_lead(
  p_workspace_id uuid,
  p_lead_id uuid,
  p_actor_user_id uuid default auth.uid()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead record;
  v_contact_id uuid;
  v_case_id uuid;
begin
  select l.*
  into v_lead
  from public.leads l
  where l.id = p_lead_id
    and l.workspace_id = p_workspace_id
  limit 1;

  if v_lead is null then
    raise exception 'Lead not found in workspace';
  end if;

  if v_lead.case_id is not null then
    return v_lead.case_id;
  end if;

  if v_lead.status not in ('won', 'ready_to_start') then
    raise exception 'Lead status is not eligible for case creation';
  end if;

  select c.id
  into v_contact_id
  from public.contacts c
  where c.workspace_id = p_workspace_id
    and (
      (nullif(trim(v_lead.email), '') is not null and lower(c.email) = lower(v_lead.email))
      or (nullif(trim(v_lead.phone), '') is not null and c.phone = v_lead.phone)
      or (
        nullif(trim(v_lead.name), '') is not null
        and nullif(trim(v_lead.company), '') is not null
        and lower(c.full_name) = lower(v_lead.name)
        and lower(c.company) = lower(v_lead.company)
      )
    )
  order by c.created_at asc
  limit 1;

  if v_contact_id is null then
    insert into public.contacts (
      workspace_id,
      created_by_user_id,
      full_name,
      company,
      email,
      phone,
      notes
    )
    values (
      p_workspace_id,
      p_actor_user_id,
      coalesce(v_lead.name, ''),
      coalesce(v_lead.company, ''),
      coalesce(v_lead.email, ''),
      coalesce(v_lead.phone, ''),
      coalesce(v_lead.notes, '')
    )
    returning id into v_contact_id;
  end if;

  insert into public.cases (
    workspace_id,
    created_by_user_id,
    contact_id,
    source_lead_id,
    title,
    description,
    sales_status,
    operational_status,
    value,
    started_at
  )
  values (
    p_workspace_id,
    p_actor_user_id,
    v_contact_id,
    v_lead.id,
    coalesce(nullif(trim(v_lead.company), ''), v_lead.name) || ' - start realizacji',
    coalesce(v_lead.summary, ''),
    v_lead.status,
    'intake',
    coalesce(v_lead.value, 0),
    now()
  )
  returning id into v_case_id;

  update public.leads
  set case_id = v_case_id,
      contact_id = coalesce(contact_id, v_contact_id),
      updated_at = now()
  where id = v_lead.id
    and workspace_id = p_workspace_id;

  insert into public.activity_log (
    workspace_id,
    actor_user_id,
    lead_id,
    case_id,
    event_scope,
    event_type,
    event_title,
    event_payload
  )
  values
  (
    p_workspace_id,
    p_actor_user_id,
    v_lead.id,
    v_case_id,
    'sales',
    'lead_to_case_transition',
    'Lead przeszedl do sprawy operacyjnej',
    jsonb_build_object('lead_status', v_lead.status)
  ),
  (
    p_workspace_id,
    p_actor_user_id,
    v_lead.id,
    v_case_id,
    'operations',
    'case_created_from_lead',
    'Utworzono sprawe z leada',
    jsonb_build_object('contact_id', v_contact_id, 'source_lead_id', v_lead.id)
  );

  return v_case_id;
end;
$$;

drop policy if exists "contacts_member_all" on public.contacts;
create policy "contacts_member_all" on public.contacts for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "cases_member_all" on public.cases;
create policy "cases_member_all" on public.cases for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "case_templates_member_all" on public.case_templates;
create policy "case_templates_member_all" on public.case_templates for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "template_items_member_all" on public.template_items;
create policy "template_items_member_all" on public.template_items for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "case_items_member_all" on public.case_items;
create policy "case_items_member_all" on public.case_items for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "file_attachments_member_all" on public.file_attachments;
create policy "file_attachments_member_all" on public.file_attachments for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "approvals_member_all" on public.approvals;
create policy "approvals_member_all" on public.approvals for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "activity_log_member_all" on public.activity_log;
create policy "activity_log_member_all" on public.activity_log for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "notifications_member_all" on public.notifications;
create policy "notifications_member_all" on public.notifications for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists "portal_tokens_member_all" on public.client_portal_tokens;
create policy "portal_tokens_member_all" on public.client_portal_tokens for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
