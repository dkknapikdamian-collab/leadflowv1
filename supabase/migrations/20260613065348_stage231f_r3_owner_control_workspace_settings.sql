-- STAGE231F_R3_OWNER_CONTROL_BASELINE
-- Workspace-wide owner control thresholds used by Today, leads, clients and cases.

alter table if exists public.workspaces
  add column if not exists owner_control_warning_days integer not null default 7,
  add column if not exists owner_control_critical_days integer not null default 14,
  add column if not exists owner_control_high_value_threshold_pln integer not null default 5000;

alter table if exists public.workspaces
  drop constraint if exists workspaces_owner_control_warning_days_check,
  drop constraint if exists workspaces_owner_control_critical_days_check,
  drop constraint if exists workspaces_owner_control_threshold_order_check,
  drop constraint if exists workspaces_owner_control_high_value_threshold_check;

alter table if exists public.workspaces
  add constraint workspaces_owner_control_warning_days_check
    check (owner_control_warning_days between 1 and 365),
  add constraint workspaces_owner_control_critical_days_check
    check (owner_control_critical_days between 1 and 365),
  add constraint workspaces_owner_control_threshold_order_check
    check (owner_control_critical_days > owner_control_warning_days),
  add constraint workspaces_owner_control_high_value_threshold_check
    check (owner_control_high_value_threshold_pln >= 0);
