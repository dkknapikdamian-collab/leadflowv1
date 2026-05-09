# CLOSEFLOW VS-7 Repair 6 — soft-delete lead conflict path

## Cel

Domknąć czerwony release gate po VS-7 bez cofania zmian kolorów i bez przywracania hard-delete.

## Problem

`tests/panel-delete-actions-v1.test.cjs` wymaga, aby `src/pages/Leads.tsx` nie zawierał `deleteLeadFromSupabase`. To jest poprawny kontrakt produktu: panel leadów i ścieżki poboczne mają używać kosza/archiwizacji, nie trwałego kasowania.

## Zmiana

- usunięto import `deleteLeadFromSupabase` z `Leads.tsx`,
- usunięto import `deleteClientFromSupabase` z `Leads.tsx`,
- ścieżkę konfliktu duplikatu przepięto na soft archive:
  - lead: `status: 'archived'`, `leadVisibility: 'trash'`, `salesOutcome: 'archived'`, `closedAt`,
  - client: `archivedAt`,
- zachowano możliwość usunięcia kandydata z lokalnej listy konfliktów po operacji.

## Nie zmienia

- VS-7 semantic metric tones,
- runtime kolorów,
- głównego soft-trash na liście leadów,
- API, Supabase schema, RLS, billing, auth.

## Kryterium

- `node --test tests/panel-delete-actions-v1.test.cjs` green,
- `npm.cmd run verify:closeflow:quiet` green,
- `npm.cmd run test:raw` green,
- `npm.cmd run build` green.
