begin;

update public.leads
set next_action_title = ''
where next_action_title is null;

alter table public.leads
alter column next_action_title set default '';

commit;
