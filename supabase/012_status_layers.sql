-- ETAP 4: oddzielenie statusow sprzedazowych i operacyjnych

-- 1) Migracja danych leadow (status sprzedazowy)
update public.leads
set status = case status
  when 'waiting' then 'proposal_sent'
  when 'followup_needed' then 'follow_up'
  when 'meeting_scheduled' then 'qualification'
  when 'ready_to_start' then 'won'
  else status
end
where status in ('waiting', 'followup_needed', 'meeting_scheduled', 'ready_to_start');

-- 2) Migracja danych spraw (statusy sprzedazowe + operacyjne)
update public.cases
set sales_status = case sales_status
  when 'waiting' then 'proposal_sent'
  when 'followup_needed' then 'follow_up'
  when 'meeting_scheduled' then 'qualification'
  when 'ready_to_start' then 'won'
  else sales_status
end
where sales_status in ('waiting', 'followup_needed', 'meeting_scheduled', 'ready_to_start');

update public.cases
set operational_status = case operational_status
  when 'intake' then 'not_started'
  when 'active' then 'in_progress'
  when 'waiting_client' then 'waiting_for_client'
  when 'done' then 'closed'
  when 'canceled' then 'closed'
  else operational_status
end
where operational_status in ('intake', 'active', 'waiting_client', 'done', 'canceled');

-- 3) Migracja statusow checklisty i prosb
update public.case_items
set status = case status
  when 'todo' then 'none'
  when 'in_progress' then 'request_sent'
  when 'done' then 'approved'
  when 'blocked' then 'needs_fix'
  else status
end
where status in ('todo', 'in_progress', 'done', 'blocked');

update public.approvals
set status = case status
  when 'pending' then 'sent'
  when 'approved' then 'responded'
  when 'rejected' then 'responded'
  when 'expired' then 'overdue'
  else status
end
where status in ('pending', 'approved', 'rejected', 'expired');

-- 4) Constrainty statusow
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads drop constraint if exists leads_status_v2_check;
alter table public.leads add constraint leads_status_v2_check
  check (status in ('new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'won', 'lost'));

alter table public.cases drop constraint if exists cases_sales_status_check;
alter table public.cases drop constraint if exists cases_sales_status_v2_check;
alter table public.cases add constraint cases_sales_status_v2_check
  check (sales_status in ('new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'won', 'lost'));

alter table public.cases drop constraint if exists cases_operational_status_check;
alter table public.cases drop constraint if exists cases_operational_status_v2_check;
alter table public.cases add constraint cases_operational_status_v2_check
  check (operational_status in ('not_started', 'collecting_materials', 'waiting_for_client', 'for_review', 'ready_to_start', 'in_progress', 'blocked', 'closed'));

alter table public.case_items alter column status set default 'none';
alter table public.case_items drop constraint if exists case_items_status_check;
alter table public.case_items drop constraint if exists case_items_status_v2_check;
alter table public.case_items add constraint case_items_status_v2_check
  check (status in ('none', 'request_sent', 'submitted', 'for_review', 'needs_fix', 'approved', 'not_applicable'));

alter table public.approvals alter column status set default 'not_sent';
alter table public.approvals drop constraint if exists approvals_status_check;
alter table public.approvals drop constraint if exists approvals_status_v2_check;
alter table public.approvals add constraint approvals_status_v2_check
  check (status in ('not_sent', 'sent', 'reminder_sent', 'responded', 'overdue'));

-- 5) Funkcja przejscia lead -> case: tylko status sprzedazowy "won"
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

  if v_lead.status <> 'won' then
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
    'not_started',
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
