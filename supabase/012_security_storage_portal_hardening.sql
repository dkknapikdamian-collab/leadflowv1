-- ETAP 15: Security hardening for storage + portal + audit support.

create or replace function public.can_access_workspace_attachment(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.file_attachments fa
    where fa.storage_path = object_name
      and public.is_workspace_member(fa.workspace_id)
  );
$$;

revoke all on function public.can_access_workspace_attachment(text) from public;
grant execute on function public.can_access_workspace_attachment(text) to authenticated;

insert into storage.buckets (id, name, public)
values ('clientpilot-private', 'clientpilot-private', false)
on conflict (id) do update
set public = excluded.public;

-- Explicitly block unauthenticated access.
drop policy if exists "cp_private_no_anon_select" on storage.objects;
create policy "cp_private_no_anon_select"
on storage.objects
for select
to anon
using (false);

drop policy if exists "cp_private_member_select" on storage.objects;
create policy "cp_private_member_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'clientpilot-private'
  and public.can_access_workspace_attachment(name)
);

drop policy if exists "cp_private_member_insert" on storage.objects;
create policy "cp_private_member_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'clientpilot-private'
  and public.can_access_workspace_attachment(name)
);

drop policy if exists "cp_private_member_update" on storage.objects;
create policy "cp_private_member_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'clientpilot-private'
  and public.can_access_workspace_attachment(name)
)
with check (
  bucket_id = 'clientpilot-private'
  and public.can_access_workspace_attachment(name)
);

drop policy if exists "cp_private_member_delete" on storage.objects;
create policy "cp_private_member_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'clientpilot-private'
  and public.can_access_workspace_attachment(name)
);

create index if not exists idx_activity_log_workspace_type_created
  on public.activity_log (workspace_id, activity_type, created_at desc);

