-- Stage A27 - Response templates in Supabase
-- Response templates are lightweight workspace-scoped user data.
-- They are not hardcoded AI answers and they do not send email automatically.

create extension if not exists pgcrypto;

create table if not exists public.response_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  name text not null,
  category text null default '',
  tags text[] not null default '{}'::text[],
  body text not null,
  variables text[] not null default '{}'::text[],
  archived_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.response_templates add column if not exists workspace_id uuid;
alter table public.response_templates add column if not exists name text;
alter table public.response_templates add column if not exists category text;
alter table public.response_templates add column if not exists tags text[] not null default '{}'::text[];
alter table public.response_templates add column if not exists body text;
alter table public.response_templates add column if not exists variables text[] not null default '{}'::text[];
alter table public.response_templates add column if not exists archived_at timestamptz;
alter table public.response_templates add column if not exists created_at timestamptz not null default now();
alter table public.response_templates add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'response_templates'
      and column_name = 'tags'
      and data_type = 'jsonb'
  ) then
    alter table public.response_templates
      alter column tags drop default,
      alter column tags type text[] using coalesce(array(select jsonb_array_elements_text(tags)), '{}'::text[]),
      alter column tags set default '{}'::text[];
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'response_templates'
      and column_name = 'variables'
      and data_type = 'jsonb'
  ) then
    alter table public.response_templates
      alter column variables drop default,
      alter column variables type text[] using coalesce(array(select jsonb_array_elements_text(variables)), '{}'::text[]),
      alter column variables set default '{}'::text[];
  end if;
end $$;

update public.response_templates
set
  tags = coalesce(tags, '{}'::text[]),
  variables = coalesce(variables, '{}'::text[]),
  category = coalesce(category, ''),
  updated_at = coalesce(updated_at, created_at, now())
where true;

create index if not exists response_templates_workspace_active_idx
  on public.response_templates (workspace_id, updated_at desc)
  where archived_at is null;

create index if not exists response_templates_workspace_archive_idx
  on public.response_templates (workspace_id, archived_at desc)
  where archived_at is not null;

create index if not exists response_templates_workspace_category_idx
  on public.response_templates (workspace_id, category);

create or replace function public.set_response_templates_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_response_templates_updated_at on public.response_templates;

create trigger trg_response_templates_updated_at
before update on public.response_templates
for each row
execute function public.set_response_templates_updated_at();

alter table public.response_templates enable row level security;
