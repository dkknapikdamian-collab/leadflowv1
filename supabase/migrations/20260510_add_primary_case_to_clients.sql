-- CLOSEFLOW_ETAP7_CLIENT_PRIMARY_CASE
-- Jedna główna sprawa klienta. Wybór jest właściwością klienta, nie sprawy.

alter table clients
add column if not exists primary_case_id uuid null;

do $$
begin
  alter table clients
    add constraint clients_primary_case_id_fkey
    foreign key (primary_case_id)
    references cases(id)
    on delete set null;
exception
  when duplicate_object then null;
end $$;

comment on column clients.primary_case_id is 'Jedna główna sprawa klienta. ON DELETE SET NULL czyści wskazanie po usunięciu sprawy.';
