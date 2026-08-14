-- C2 - one Supabase Auth workspace bootstrap source
-- Reconciles the historical Stage01 and A22 trigger names into one live trigger.
-- The migration is idempotent and keeps Supabase Auth as the only identity owner.

begin;

-- Stage01 and A22 both installed an auth.users trigger in different migrations.
-- Remove both names before installing the one canonical trigger below.
drop trigger if exists on_auth_user_created_closeflow on auth.users;
drop trigger if exists closeflow_bootstrap_user_after_auth_insert on auth.users;

create or replace function public.closeflow_bootstrap_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  display_name text;
  existing_profile_id uuid;
  existing_workspace_id uuid;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email, 'Użytkownik');

  -- A retried or previously-created profile is repaired in place. A new
  -- Supabase user cannot silently receive a second profile by email.
  select p.id, p.workspace_id
    into existing_profile_id, existing_workspace_id
    from public.profiles p
   where p.auth_user_id = new.id
      or p.auth_uid = new.id
      or p.id = new.id
      or (new.email is not null and p.email = new.email)
   order by case when p.id = new.id then 0 else 1 end
   limit 1;

  if existing_profile_id is null then
    insert into public.profiles (
      id,
      auth_user_id,
      firebase_uid,
      auth_uid,
      external_auth_uid,
      email,
      full_name,
      workspace_id,
      role,
      is_admin,
      created_at,
      updated_at
    ) values (
      new.id,
      new.id,
      null,
      new.id,
      new.id,
      new.email,
      coalesce(display_name, ''),
      null,
      'member',
      false,
      now(),
      now()
    );
    existing_profile_id := new.id;
  else
    update public.profiles
       set auth_user_id = coalesce(auth_user_id, new.id),
           auth_uid = coalesce(auth_uid, new.id),
           external_auth_uid = coalesce(external_auth_uid, new.id),
           email = coalesce(new.email, email),
           full_name = coalesce(nullif(full_name, ''), display_name),
           updated_at = now()
     where id = existing_profile_id;
  end if;

  new_workspace_id := existing_workspace_id;

  if new_workspace_id is null then
    insert into public.workspaces (
      owner_user_id,
      owner_id,
      created_by_user_id,
      name,
      plan_id,
      subscription_status,
      trial_ends_at,
      billing_provider,
      timezone,
      daily_digest_enabled,
      daily_digest_hour,
      daily_digest_timezone,
      daily_digest_recipient_email,
      created_at,
      updated_at
    ) values (
      new.id,
      new.id,
      new.id,
      coalesce(nullif(display_name, ''), 'Moj') || ' Workspace',
      'trial_14d',
      'trial_active',
      now() + interval '14 days',
      'manual',
      'Europe/Warsaw',
      true,
      7,
      'Europe/Warsaw',
      new.email,
      now(),
      now()
    ) returning id into new_workspace_id;

    update public.profiles
       set workspace_id = new_workspace_id,
           updated_at = now()
     where id = existing_profile_id;
  end if;

  insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
  values (new_workspace_id, new.id, 'owner', now(), now())
  on conflict (workspace_id, user_id) do update set
    role = 'owner',
    updated_at = now();

  return new;
end;
$$;

create trigger closeflow_bootstrap_user_after_auth_insert
  after insert on auth.users
  for each row execute function public.closeflow_bootstrap_user();

commit;
