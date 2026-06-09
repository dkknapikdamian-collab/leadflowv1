
-- Stage228R46 / CloseFlow
-- Purpose: allow runtime soft-delete status for task/event work_items.
-- Where: Supabase SQL Editor for the production CloseFlow project.
-- Order: run once before relying on status='deleted' soft delete.
-- Manual verification:
--   1. Run the SELECT at the bottom.
--   2. The returned constraint_definition must contain 'deleted'.
--   3. In app: create CF_DEL_TEST_3, delete, refresh. It must not return.

BEGIN;

ALTER TABLE public.work_items
  DROP CONSTRAINT IF EXISTS work_items_status_domain_check;

ALTER TABLE public.work_items
  ADD CONSTRAINT work_items_status_domain_check
  CHECK (
    status IS NULL
    OR status IN (
      'todo',
      'scheduled',
      'in_progress',
      'done',
      'canceled',
      'deleted'
    )
  );

COMMIT;

SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.work_items'::regclass
  AND conname = 'work_items_status_domain_check';
