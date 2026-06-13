-- Restore the case_items columns used by the canonical CloseFlow API contract.
-- This migration is additive and safe when the columns already exist.

alter table if exists public.case_items add column if not exists description text not null default '';
alter table if exists public.case_items add column if not exists is_required boolean not null default false;
alter table if exists public.case_items add column if not exists due_date timestamptz;
alter table if exists public.case_items add column if not exists response text;
alter table if exists public.case_items add column if not exists file_url text;
alter table if exists public.case_items add column if not exists file_name text;
alter table if exists public.case_items add column if not exists approved_at timestamptz;
alter table if exists public.case_items add column if not exists sort_order integer not null default 0;
alter table if exists public.case_items add column if not exists payload jsonb not null default '{}'::jsonb;
alter table if exists public.case_items add column if not exists created_at timestamptz not null default now();
alter table if exists public.case_items add column if not exists updated_at timestamptz not null default now();

notify pgrst, 'reload schema';
