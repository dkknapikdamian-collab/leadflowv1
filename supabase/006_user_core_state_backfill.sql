create or replace function public.build_initial_app_snapshot(
  target_user_id uuid,
  target_workspace_id uuid
)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'context',
    jsonb_build_object(
      'userId', target_user_id,
      'workspaceId', target_workspace_id,
      'accessStatus', 'trial_active',
      'billingStatus', 'trial'
    )
  )
$$;

create or replace function public.ensure_user_core_state(target_user_id uuid)
returns table (workspace_id uuid)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  auth_user_record record;
  legacy_access public.account_access%rowtype;
  workspace_uuid uuid;
  resolved_email text;
  resolved_name text;
  resolved_provider text;
  resolved_signup_source text;
  default_trial_start timestamptz := now();
  default_trial_end timestamptz := now() + interval '7 days';
begin
  select
    u.id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data,
    u.raw_app_meta_data
  into auth_user_record
  from auth.users u
  where u.id = target_user_id
  limit 1;

  if auth_user_record.id is null then
    return;
  end if;

  select *
  into legacy_access
  from public.account_access aa
  where aa.user_id = target_user_id
  limit 1;

  resolved_email := public.normalize_email(auth_user_record.email);
  resolved_name := coalesce(
    nullif(trim(auth_user_record.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(auth_user_record.raw_user_meta_data ->> 'name'), ''),
    split_part(resolved_email, '@', 1),
    'Twoje konto'
  );
  resolved_provider := coalesce(
    nullif(trim(auth_user_record.raw_app_meta_data ->> 'provider'), ''),
    'unknown'
  );
  resolved_signup_source := case when resolved_provider = 'google' then 'google' else 'email_password' end;

  insert into public.profiles (
    user_id,
    normalized_email,
    email,
    display_name,
    auth_provider,
    timezone,
    is_email_verified,
    signup_source
  )
  values (
    target_user_id,
    resolved_email,
    auth_user_record.email,
    resolved_name,
    resolved_provider,
    'Europe/Warsaw',
    auth_user_record.email_confirmed_at is not null,
    resolved_signup_source
  )
  on conflict (user_id) do update
    set normalized_email = excluded.normalized_email,
        email = coalesce(excluded.email, public.profiles.email),
        display_name = case
          when nullif(trim(coalesce(public.profiles.display_name, '')), '') is null then excluded.display_name
          else public.profiles.display_name
        end,
        auth_provider = case
          when nullif(trim(coalesce(public.profiles.auth_provider, '')), '') is null then excluded.auth_provider
          else public.profiles.auth_provider
        end,
        timezone = coalesce(public.profiles.timezone, excluded.timezone),
        is_email_verified = coalesce(public.profiles.is_email_verified, false) or excluded.is_email_verified,
        signup_source = case
          when coalesce(public.profiles.signup_source, 'unknown') = 'unknown' then excluded.signup_source
          else public.profiles.signup_source
        end
  where public.profiles.normalized_email is distinct from excluded.normalized_email
     or public.profiles.email is distinct from excluded.email
     or nullif(trim(coalesce(public.profiles.display_name, '')), '') is null
     or nullif(trim(coalesce(public.profiles.auth_provider, '')), '') is null
     or public.profiles.timezone is null
     or (coalesce(public.profiles.is_email_verified, false) = false and excluded.is_email_verified = true)
     or coalesce(public.profiles.signup_source, 'unknown') = 'unknown';

  insert into public.workspaces (owner_user_id, name)
  values (target_user_id, 'ClientPilot')
  on conflict (owner_user_id) do nothing;

  select id into workspace_uuid
  from public.workspaces
  where owner_user_id = target_user_id
  limit 1;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (workspace_uuid, target_user_id, 'owner')
  on conflict (user_id) do update
    set workspace_id = excluded.workspace_id,
        role = excluded.role
  where public.workspace_members.workspace_id is distinct from excluded.workspace_id
     or public.workspace_members.role is distinct from excluded.role;

  insert into public.access_status (
    workspace_id,
    user_id,
    access_status,
    trial_start,
    trial_end,
    paid_until,
    billing_customer_id,
    billing_subscription_id,
    plan_name,
    trial_used,
    signup_source
  )
  values (
    workspace_uuid,
    target_user_id,
    coalesce(legacy_access.status, 'trial_active'),
    coalesce(legacy_access.trial_started_at, default_trial_start),
    coalesce(legacy_access.trial_ends_at, default_trial_end),
    legacy_access.current_period_ends_at,
    legacy_access.stripe_customer_id,
    legacy_access.stripe_subscription_id,
    'Solo',
    coalesce(legacy_access.trial_used, true),
    resolved_signup_source
  )
  on conflict (user_id) do update
    set workspace_id = excluded.workspace_id,
        user_id = excluded.user_id,
        trial_start = coalesce(public.access_status.trial_start, excluded.trial_start),
        trial_end = coalesce(public.access_status.trial_end, excluded.trial_end),
        paid_until = coalesce(public.access_status.paid_until, excluded.paid_until),
        billing_customer_id = coalesce(public.access_status.billing_customer_id, excluded.billing_customer_id),
        billing_subscription_id = coalesce(public.access_status.billing_subscription_id, excluded.billing_subscription_id),
        plan_name = coalesce(nullif(public.access_status.plan_name, ''), excluded.plan_name),
        signup_source = coalesce(nullif(public.access_status.signup_source, ''), excluded.signup_source),
        trial_used = coalesce(public.access_status.trial_used, excluded.trial_used),
        updated_at = now()
  where public.access_status.workspace_id is distinct from excluded.workspace_id
     or public.access_status.user_id is distinct from excluded.user_id
     or public.access_status.trial_start is null
     or public.access_status.trial_end is null
     or (public.access_status.paid_until is null and excluded.paid_until is not null)
     or (public.access_status.billing_customer_id is null and excluded.billing_customer_id is not null)
     or (public.access_status.billing_subscription_id is null and excluded.billing_subscription_id is not null)
     or nullif(public.access_status.plan_name, '') is null
     or nullif(public.access_status.signup_source, '') is null;

  insert into public.settings (
    workspace_id,
    user_id,
    workspace_name,
    timezone
  )
  values (
    workspace_uuid,
    target_user_id,
    'ClientPilot',
    'Europe/Warsaw'
  )
  on conflict (workspace_id) do update
    set user_id = excluded.user_id,
        workspace_name = case
          when nullif(trim(coalesce(public.settings.workspace_name, '')), '') is null then excluded.workspace_name
          else public.settings.workspace_name
        end,
        timezone = case
          when nullif(trim(coalesce(public.settings.timezone, '')), '') is null then excluded.timezone
          else public.settings.timezone
        end,
        updated_at = now()
  where public.settings.user_id is distinct from excluded.user_id
     or nullif(trim(coalesce(public.settings.workspace_name, '')), '') is null
     or nullif(trim(coalesce(public.settings.timezone, '')), '') is null;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'app_snapshots'
  ) then
    insert into public.app_snapshots (
      user_id,
      workspace_id,
      snapshot_json
    )
    values (
      target_user_id,
      workspace_uuid,
      public.build_initial_app_snapshot(target_user_id, workspace_uuid)
    )
    on conflict (user_id) do update
      set workspace_id = excluded.workspace_id,
          snapshot_json = case
            when public.app_snapshots.snapshot_json is null or public.app_snapshots.snapshot_json = '{}'::jsonb then excluded.snapshot_json
            else public.app_snapshots.snapshot_json
          end,
          updated_at = now()
    where public.app_snapshots.workspace_id is distinct from excluded.workspace_id
       or public.app_snapshots.snapshot_json is null
       or public.app_snapshots.snapshot_json = '{}'::jsonb;
  end if;

  return query
  select workspace_uuid;
end;
$$;

revoke all on function public.ensure_user_core_state(uuid) from public;
revoke all on function public.ensure_user_core_state(uuid) from anon;
revoke all on function public.ensure_user_core_state(uuid) from authenticated;
grant execute on function public.ensure_user_core_state(uuid) to service_role;

create or replace function public.bootstrap_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.ensure_user_core_state(new.id);
  return new;
end;
$$;

