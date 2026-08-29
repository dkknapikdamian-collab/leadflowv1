begin;

alter table if exists public.cases
  add column if not exists owner_id uuid;

create index if not exists closeflow_cases_owner_id_idx
  on public.cases (owner_id);

comment on column public.cases.owner_id is
  'FRT-031 assigned owner; API enforces auth.users.id workspace scope.';

commit;
