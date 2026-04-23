-- CloseFlow V1 domain model
-- Idempotent migration: clients + service_profiles + payments + lead/case model expansion

create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text not null default '',
  company text null,
  email text null,
  phone text null,
  notes text null,
  tags text[] not null default '{}'::text[],
  source_primary text null default 'other',
  last_activity_at timestamptz null,
  archived_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_profiles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text not null default '',
  description text null default '',
  start_rule text not null default 'on_acceptance',
  win_rule text not null default 'manual',
  billing_model text not null default 'manual',
  case_creation_mode text not null default 'suggested',
  is_default boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  client_id uuid null,
  lead_id uuid null,
  case_id uuid null,
  type text not null default 'partial',
  status text not null default 'not_started',
  amount numeric not null default 0,
  currency text not null default 'PLN',
  paid_at timestamptz null,
  due_at timestamptz null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads
  add column if not exists client_id uuid null,
  add column if not exists service_profile_id uuid null,
  add column if not exists accepted_at timestamptz null,
  add column if not exists case_eligible_at timestamptz null,
  add column if not exists case_started_at timestamptz null,
  add column if not exists billing_status text not null default 'not_started',
  add column if not exists billing_model_snapshot text null default 'manual',
  add column if not exists start_rule_snapshot text null default 'on_acceptance',
  add column if not exists win_rule_snapshot text null default 'manual',
  add column if not exists closed_at timestamptz null;

alter table public.cases
  add column if not exists service_profile_id uuid null,
  add column if not exists billing_status text not null default 'not_started',
  add column if not exists billing_model_snapshot text null default 'manual',
  add column if not exists started_at timestamptz null,
  add column if not exists completed_at timestamptz null,
  add column if not exists last_activity_at timestamptz null;

create index if not exists idx_leads_workspace_status_next_action
  on public.leads(workspace_id, status, next_action_at);
create index if not exists idx_leads_workspace_client
  on public.leads(workspace_id, client_id);
create index if not exists idx_leads_workspace_billing_status
  on public.leads(workspace_id, billing_status);

create index if not exists idx_cases_workspace_client
  on public.cases(workspace_id, client_id);
create index if not exists idx_cases_workspace_billing_status
  on public.cases(workspace_id, billing_status);
create index if not exists idx_cases_workspace_last_activity
  on public.cases(workspace_id, last_activity_at desc);

create index if not exists idx_clients_workspace_name
  on public.clients(workspace_id, name);
create index if not exists idx_clients_workspace_email
  on public.clients(workspace_id, email);
create index if not exists idx_clients_workspace_phone
  on public.clients(workspace_id, phone);

create index if not exists idx_service_profiles_workspace_default
  on public.service_profiles(workspace_id, is_default);

create index if not exists idx_payments_workspace_status
  on public.payments(workspace_id, status);
create index if not exists idx_payments_workspace_client
  on public.payments(workspace_id, client_id);
create index if not exists idx_payments_workspace_lead
  on public.payments(workspace_id, lead_id);
create index if not exists idx_payments_workspace_case
  on public.payments(workspace_id, case_id);

-- legacy status migration
update public.leads
set status = 'waiting_response'
where status = 'follow_up';

-- seed baseline service profiles
insert into public.service_profiles (
  workspace_id, name, description, start_rule, win_rule, billing_model, case_creation_mode, is_default, is_archived
)
select w.id, seeded.name, seeded.description, seeded.start_rule, seeded.win_rule, seeded.billing_model, seeded.case_creation_mode,
  case when seeded.rank = 1 then true else false end,
  false
from public.workspaces w
cross join (
  values
    (1, 'Pośrednictwo sprzedaży', 'Lead startuje po akceptacji, wygrana po prowizji.', 'on_acceptance', 'on_commission_received', 'success_fee', 'auto_on_start_rule'),
    (2, 'Pośrednictwo najmu', 'Obsługa aktywna po akceptacji, prowizja po sukcesie.', 'on_acceptance', 'on_commission_received', 'success_fee', 'auto_on_start_rule'),
    (3, 'Usługa z zaliczką', 'Start po zaliczce.', 'on_deposit', 'manual', 'deposit_then_rest', 'suggested'),
    (4, 'Projekt płatny z góry', 'Start po pełnej płatności.', 'on_full_payment', 'on_full_payment', 'upfront_full', 'auto_on_start_rule'),
    (5, 'Usługa płatna po wykonaniu', 'Płatność po realizacji.', 'on_acceptance', 'on_case_completed', 'after_completion', 'suggested'),
    (6, 'Abonament', 'Model cykliczny.', 'on_acceptance', 'manual', 'recurring', 'suggested')
) as seeded(rank, name, description, start_rule, win_rule, billing_model, case_creation_mode)
where not exists (
  select 1
  from public.service_profiles sp
  where sp.workspace_id = w.id
    and sp.name = seeded.name
);

-- ensure exactly one default profile per workspace (best effort)
with default_per_workspace as (
  select workspace_id, min(created_at) as min_created
  from public.service_profiles
  group by workspace_id
)
update public.service_profiles sp
set is_default = case when sp.created_at = d.min_created then true else false end
from default_per_workspace d
where sp.workspace_id = d.workspace_id
  and not exists (
    select 1
    from public.service_profiles sp2
    where sp2.workspace_id = sp.workspace_id
      and sp2.is_default = true
  );

-- backfill clients from leads (email/phone then name)
insert into public.clients (workspace_id, name, company, email, phone, source_primary, created_at, updated_at, last_activity_at)
select
  l.workspace_id,
  coalesce(nullif(trim(l.name), ''), nullif(trim(l.company), ''), 'Klient'),
  nullif(trim(l.company), ''),
  nullif(trim(l.email), ''),
  nullif(trim(l.phone), ''),
  coalesce(nullif(trim(l.source), ''), 'other'),
  coalesce(l.created_at, now()),
  coalesce(l.updated_at, now()),
  l.updated_at
from public.leads l
where l.workspace_id is not null
  and not exists (
    select 1
    from public.clients c
    where c.workspace_id = l.workspace_id
      and (
        (coalesce(nullif(lower(c.email), ''), '__') = coalesce(nullif(lower(l.email), ''), '__')
         and coalesce(nullif(lower(l.email), ''), '__') <> '__')
        or
        (coalesce(nullif(c.phone, ''), '__') = coalesce(nullif(l.phone, ''), '__')
         and coalesce(nullif(l.phone, ''), '__') <> '__')
        or
        (
          coalesce(nullif(lower(c.name), ''), '__') = coalesce(nullif(lower(l.name), ''), '__')
          and coalesce(nullif(lower(l.name), ''), '__') <> '__'
          and coalesce(nullif(lower(l.email), ''), '__') = '__'
          and coalesce(nullif(l.phone, ''), '__') = '__'
        )
      )
  );

-- backfill client_id on leads
update public.leads l
set client_id = c.id
from public.clients c
where l.client_id is null
  and c.workspace_id = l.workspace_id
  and (
    (coalesce(nullif(lower(c.email), ''), '__') = coalesce(nullif(lower(l.email), ''), '__')
      and coalesce(nullif(lower(l.email), ''), '__') <> '__')
    or
    (coalesce(nullif(c.phone, ''), '__') = coalesce(nullif(l.phone, ''), '__')
      and coalesce(nullif(l.phone, ''), '__') <> '__')
    or
    (
      coalesce(nullif(lower(c.name), ''), '__') = coalesce(nullif(lower(l.name), ''), '__')
      and coalesce(nullif(lower(l.name), ''), '__') <> '__'
      and coalesce(nullif(lower(l.email), ''), '__') = '__'
      and coalesce(nullif(l.phone, ''), '__') = '__'
    )
  );

-- backfill client_id on cases through lead then own data
update public.cases cs
set client_id = l.client_id
from public.leads l
where cs.client_id is null
  and cs.lead_id = l.id
  and l.client_id is not null;

update public.cases cs
set client_id = c.id
from public.clients c
where cs.client_id is null
  and c.workspace_id = cs.workspace_id
  and (
    (coalesce(nullif(lower(c.email), ''), '__') = coalesce(nullif(lower(cs.client_email), ''), '__')
      and coalesce(nullif(lower(cs.client_email), ''), '__') <> '__')
    or
    (coalesce(nullif(c.phone, ''), '__') = coalesce(nullif(cs.client_phone, ''), '__')
      and coalesce(nullif(cs.client_phone, ''), '__') <> '__')
    or
    (
      coalesce(nullif(lower(c.name), ''), '__') = coalesce(nullif(lower(cs.client_name), ''), '__')
      and coalesce(nullif(lower(cs.client_name), ''), '__') <> '__'
    )
  );

-- assign default service profile snapshots on leads
update public.leads l
set
  service_profile_id = sp.id,
  billing_model_snapshot = coalesce(nullif(l.billing_model_snapshot, ''), sp.billing_model),
  start_rule_snapshot = coalesce(nullif(l.start_rule_snapshot, ''), sp.start_rule),
  win_rule_snapshot = coalesce(nullif(l.win_rule_snapshot, ''), sp.win_rule),
  billing_status = coalesce(nullif(l.billing_status, ''), 'not_started')
from public.service_profiles sp
where l.workspace_id = sp.workspace_id
  and sp.is_default = true
  and l.service_profile_id is null;

-- assign service profile snapshots on cases
update public.cases cs
set
  service_profile_id = coalesce(cs.service_profile_id, l.service_profile_id, sp.id),
  billing_model_snapshot = coalesce(nullif(cs.billing_model_snapshot, ''), l.billing_model_snapshot, sp.billing_model),
  billing_status = coalesce(nullif(cs.billing_status, ''), l.billing_status, 'not_started')
from public.leads l
left join public.service_profiles sp on sp.workspace_id = l.workspace_id and sp.is_default = true
where cs.lead_id = l.id
  and (cs.service_profile_id is null or cs.billing_model_snapshot is null or cs.billing_status is null);

-- migrate legacy partial_payments -> payments
insert into public.payments (
  workspace_id, client_id, lead_id, case_id, type, status, amount, currency, paid_at, due_at, note, created_at, updated_at
)
select
  l.workspace_id,
  l.client_id,
  l.id,
  l.linked_case_id,
  case when row_number() over (partition by l.id order by coalesce(paid_at_raw, created_at_raw)) = 1 then 'deposit' else 'partial' end as type,
  'paid',
  amount_raw,
  'PLN',
  paid_at_raw,
  null,
  'Migrated from leads.partial_payments',
  coalesce(created_at_raw, now()),
  now()
from (
  select
    l.id as lead_id_inner,
    l.workspace_id,
    l.client_id,
    l.id,
    l.linked_case_id,
    (entry->>'amount')::numeric as amount_raw,
    nullif(entry->>'paidAt', '')::timestamptz as paid_at_raw,
    coalesce(nullif(entry->>'createdAt', '')::timestamptz, now()) as created_at_raw
  from public.leads l
  cross join lateral jsonb_array_elements(coalesce(l.partial_payments, '[]'::jsonb)) entry
) expanded
where amount_raw is not null
  and amount_raw > 0
  and not exists (
    select 1
    from public.payments p
    where p.lead_id = expanded.id
      and p.amount = expanded.amount_raw
      and coalesce(p.paid_at, '1900-01-01'::timestamptz) = coalesce(expanded.paid_at_raw, '1900-01-01'::timestamptz)
      and p.note = 'Migrated from leads.partial_payments'
  );

select 'ok' as status;
