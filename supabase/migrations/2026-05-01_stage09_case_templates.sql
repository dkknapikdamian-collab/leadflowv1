create table if not exists public.case_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  name text not null,
  items jsonb not null default '[]'::jsonb,
  archived_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_case_templates_workspace
  on public.case_templates(workspace_id, updated_at desc);
