-- ETAP 05 — Supabase data contract canonical columns
-- Safe additive migration. It does not delete legacy columns or data.
-- Run manually in Supabase production if CLI is not connected.

begin;

create or replace function public.closeflow_stage05_add_column_if_table_exists(
  table_name text,
  column_definition text
) returns void
language plpgsql
as $$
begin
  if to_regclass('public.' || table_name) is not null then
    execute format('alter table public.%I add column if not exists %s', table_name, column_definition);
  end if;
end;
$$;

-- leads canonical support
select public.closeflow_stage05_add_column_if_table_exists('leads', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'client_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'linked_case_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'name text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'company text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'email text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'phone text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'source text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'status text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'deal_value numeric');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'priority text');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'moved_to_service_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('leads', 'updated_at timestamptz');

-- clients canonical support
select public.closeflow_stage05_add_column_if_table_exists('clients', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'name text');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'company text');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'email text');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'phone text');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'notes text');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'tags jsonb default ''[]''::jsonb');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'source_primary text');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'last_activity_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'archived_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('clients', 'updated_at timestamptz');

-- cases canonical support
select public.closeflow_stage05_add_column_if_table_exists('cases', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'client_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'lead_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'title text');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'client_name text');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'status text');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'completeness_percent integer default 0');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'portal_ready boolean default false');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'started_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('cases', 'updated_at timestamptz');

-- work_items canonical support for Task/Event
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'title text');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'status text');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'type text');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'priority text');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'scheduled_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'start_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'end_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'lead_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'case_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'client_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'reminder_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'recurrence_rule text default ''none''');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('work_items', 'updated_at timestamptz');

-- activities canonical support
select public.closeflow_stage05_add_column_if_table_exists('activities', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'case_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'lead_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'client_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'owner_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'actor_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'actor_type text');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'event_type text');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'payload jsonb default ''{}''::jsonb');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('activities', 'updated_at timestamptz');

-- payments canonical support
select public.closeflow_stage05_add_column_if_table_exists('payments', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'client_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'lead_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'case_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'type text');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'status text');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'amount numeric default 0');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'currency text default ''PLN''');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'paid_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'due_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'note text');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('payments', 'updated_at timestamptz');

-- ai_drafts canonical support
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'type text');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'status text');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'raw_text text');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'provider text');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'source text');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'parsed_draft jsonb');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'parsed_data jsonb');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'linked_record_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'linked_record_type text');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'confirmed_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'converted_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'cancelled_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('ai_drafts', 'updated_at timestamptz');

-- response_templates canonical support
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'name text');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'title text');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'body text');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'category text');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'channel text');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'is_archived boolean default false');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('response_templates', 'updated_at timestamptz');

-- case_items canonical support
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'workspace_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'case_id uuid');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'title text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'description text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'type text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'status text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'is_required boolean default false');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'sort_order integer default 0');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'response text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'file_url text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'file_name text');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'due_date timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'approved_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'created_at timestamptz');
select public.closeflow_stage05_add_column_if_table_exists('case_items', 'updated_at timestamptz');

drop function if exists public.closeflow_stage05_add_column_if_table_exists(text, text);

commit;
