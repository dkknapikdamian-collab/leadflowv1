-- 2026-04-29_work_items_due_at_client_id_hotfix.sql
-- Fix for PostgREST/PGRST204 errors while creating tasks/events:
--   Could not find the 'due_at' column of 'work_items' in the schema cache
-- Earlier related symptom:
--   Could not find the 'client_id' column of 'work_items' in the schema cache
-- Run this in Supabase SQL Editor for the project used by the deployed app.

alter table public.work_items
  add column if not exists due_at timestamptz;

alter table public.work_items
  add column if not exists client_id text;

alter table public.work_items
  add column if not exists scheduled_at timestamptz;

alter table public.work_items
  add column if not exists reminder_at timestamptz;

alter table public.work_items
  add column if not exists recurrence_rule text;

alter table public.work_items
  add column if not exists linked_case_id text;

comment on column public.work_items.due_at is 'Task/event due datetime used by CloseFlow API compatibility layer.';
comment on column public.work_items.client_id is 'Optional linked client id. Kept as text for compatibility with uuid/string ids during rollout.';

select pg_notify('pgrst', 'reload schema');
