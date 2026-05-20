-- Stage12: stabilize Supabase data-contract columns used by API/DTO.
-- This reduces schema-fallback branching in runtime code.

alter table if exists public.leads
  add column if not exists summary text,
  add column if not exists notes text,
  add column if not exists partial_payments jsonb,
  add column if not exists next_action_title text,
  add column if not exists next_action_at timestamptz,
  add column if not exists next_action_item_id uuid,
  add column if not exists linked_case_id uuid,
  add column if not exists service_profile_id uuid,
  add column if not exists accepted_at timestamptz,
  add column if not exists case_eligible_at timestamptz,
  add column if not exists case_started_at timestamptz,
  add column if not exists moved_to_service_at timestamptz,
  add column if not exists lead_visibility text,
  add column if not exists sales_outcome text,
  add column if not exists billing_status text,
  add column if not exists billing_model_snapshot text,
  add column if not exists start_rule_snapshot text,
  add column if not exists win_rule_snapshot text,
  add column if not exists closed_at timestamptz,
  add column if not exists is_at_risk boolean default false;

alter table if exists public.cases
  add column if not exists service_profile_id uuid,
  add column if not exists billing_status text,
  add column if not exists billing_model_snapshot text,
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists last_activity_at timestamptz,
  add column if not exists created_from_lead boolean default false,
  add column if not exists service_started_at timestamptz;

alter table if exists public.clients
  add column if not exists notes text,
  add column if not exists tags text[],
  add column if not exists source_primary text,
  add column if not exists last_activity_at timestamptz,
  add column if not exists archived_at timestamptz;

alter table if exists public.activities
  add column if not exists owner_id uuid,
  add column if not exists actor_id text,
  add column if not exists actor_type text,
  add column if not exists event_type text,
  add column if not exists payload jsonb,
  add column if not exists lead_id uuid,
  add column if not exists case_id uuid,
  add column if not exists workspace_id uuid,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();
