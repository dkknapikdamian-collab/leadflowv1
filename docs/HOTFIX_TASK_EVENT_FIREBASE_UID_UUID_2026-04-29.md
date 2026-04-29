# Hotfix: task/event UUID guard — 2026-04-29

## Problem

Przy dodawaniu zadania Supabase zwracał błąd:

```text
invalid input syntax for type uuid: "dMtwyA5kx9b1hDhknwfIIet44n02"
```

Wartość `dMtwyA5kx9b1hDhknwfIIet44n02` jest Firebase UID, a nie UUID. Nie może trafiać do kolumn typu `uuid`.

## Zakres poprawki

Poprawka zabezpiecza API tasków i eventów przed zapisem nie-UUID do pól:

- `created_by_user_id`,
- `lead_id`,
- `case_id`,
- `client_id`.

Jeśli wartość nie jest UUID, API zapisuje `null` zamiast przepychać błędny identyfikator do Supabase.

## Pliki

- `api/tasks.ts`
- `api/events.ts`
- `scripts/check-task-event-api-uuid-safe.cjs`

## Weryfikacja

```powershell
node scripts/check-task-event-api-uuid-safe.cjs
npm.cmd run build
```

## Uwaga

Błąd `401` na `api/system?kind=ai-drafts` jest osobnym problemem dostępu/workspace dla szkiców AI.
