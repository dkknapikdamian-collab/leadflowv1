-- Stage11: Access model hardening
-- Single source of truth: workspaces.subscription_status + billing fields.

alter table if exists public.workspaces
  alter column subscription_status set default 'trial_active';

update public.workspaces
set
  plan_id = 'trial_21d',
  trial_ends_at = coalesce(trial_ends_at, (now() + interval '21 days'))
where coalesce(plan_id, '') in ('', 'trial_14d')
  and coalesce(subscription_status, 'trial_active') in ('trial_active', 'trial_ending');

update public.workspaces
set subscription_status = 'free_active'
where coalesce(subscription_status, '') = 'trial_expired';
