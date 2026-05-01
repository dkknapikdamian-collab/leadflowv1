# Stage A27B - Response templates in Supabase

## Cel

Szablony odpowiedzi są lekkim modułem wartości i normalnymi danymi użytkownika w Supabase.

Użytkownik tworzy, edytuje, wyszukuje, kopiuje i archiwizuje własne szablony odpowiedzi.

## Zakres

Dodano i ustabilizowano:

- endpoint `/api/response-templates`,
- backend `src/server/response-templates-handler.ts`,
- migrację `supabase/migrations/20260501_a27_response_templates_supabase.sql`,
- wejście w menu: `Odpowiedzi`,
- guard `scripts/check-a27b-response-templates-supabase.cjs`.

## Tabela

`response_templates`

Pola:

```text
id
workspace_id
name
category
tags
body
variables
archived_at
created_at
updated_at
```

## CRUD

Obsługiwane akcje:

- lista,
- wyszukiwanie,
- dodawanie,
- edycja,
- archiwizacja,
- kopiowanie treści w UI.

## Nie zmienia

- brak automatycznej wysyłki maila,
- brak mieszania z AI Drafts,
- brak Firestore templates jako źródła prawdy,
- brak gotowych tekstów zaszytych w AI.

## AI

AI może później korzystać z wybranego szablonu użytkownika, ale nie ma mieć zaszytych stałych odpowiedzi w kodzie.

## Weryfikacja

Skrypt wdrożeniowy odpala:

```text
node scripts/check-a27b-response-templates-supabase.cjs
npm.cmd run check:polish-mojibake
npm.cmd run test:critical
npm.cmd run build
```
