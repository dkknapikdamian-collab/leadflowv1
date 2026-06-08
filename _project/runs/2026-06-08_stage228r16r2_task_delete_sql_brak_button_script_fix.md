# Stage228R16R2 - Task delete SQL and Brak button script fix

- date: 2026-06-08 22:30 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Status wejściowy

SQL został wykonany w Supabase:
- public.leads.next_action_title is_nullable = YES
- default = ''::text

Stage228R16 apply failed before changing repo because the generated patch script had invalid JS quoting.

## Fix

R16R2 replaces the broken apply packaging and applies the intended runtime fix:
- deleteTaskFromSupabase soft-deletes with PATCH status=deleted, not DELETE /api/tasks.
- LeadDetail generic task delete soft-deletes and updates UI optimistically.
- LeadDetail gets an explicit Brak button.
- ClientDetail Brak button opens on pointerdown and click.
- SQL file is committed for traceability.

## SQL

Required and already confirmed by Damian:
- sql/001_stage228r16_leads_next_action_title_nullable.sql

## Tests

- R11/R12/R13/R14/R15/R16R2 guards
- npm run build
- git diff --check

## Risk audit

- SQL was a schema compatibility fix; no RLS/GRANT change.
- Soft-deleted tasks stay in DB as status=deleted.
- If Brak still does not open after deploy, inspect ContextActionDialogsHost mounting in App/Layout.
