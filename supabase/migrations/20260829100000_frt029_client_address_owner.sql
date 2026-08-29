-- FRT-029: durable client address and workspace-scoped assignment fields.
-- owner_id stores the canonical auth.users.id identity; API writes enforce workspace scope.
begin;

alter table if exists public.clients
  add column if not exists address text,
  add column if not exists owner_id uuid;

create index if not exists closeflow_clients_workspace_owner_id_idx
  on public.clients (workspace_id, owner_id);

comment on column public.clients.address is 'FRT-029 client postal/contact address.';
comment on column public.clients.owner_id is 'FRT-029 assigned owner; canonical identity is auth.users.id and API enforces workspace scope.';

commit;
