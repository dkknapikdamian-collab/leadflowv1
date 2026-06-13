# 07 SCIAGA PLIKOW - CloseFlow / LeadFlow

project_id: closeflow_lead_app
canonical_name: CloseFlow / LeadFlow
Obsidian: `10_PROJEKTY/CloseFlow_Lead_App`

## CLOSEFLOW_CLIENT_CASE_URGENT_FIX (ID: DO_POTWIERDZENIA)
- `src/lib/cases/create-client-case.ts` - wspolny zapis starterowej sprawy klienta.
- `src/components/CreateClientCaseDialog.tsx` - modal nazwy sprawy i przekierowanie do finansow.
- `src/pages/ClientDetail.tsx` - przycisk, modal i kolejnosc spraw.
- `src/pages/CaseDetail.tsx` - saldo prowizji, auto-open finansow i Cofnij.
- `src/lib/owner-control/owner-risk-rules.ts` - wartosc sprawy dla badge.
- `src/lib/owner-control/owner-control-baseline.ts` - wartosc sprawy dla `/today`.
- `scripts/check-closeflow-client-case-urgent-regressions.cjs` - guard.
- `tests/closeflow-client-case-urgent-regressions.test.cjs` - test guarda.

## CLOSEFLOW_CASE_FINANCE_UI_REPAIR (ID: DO_POTWIERDZENIA)
- `src/server/task-route-stage124f.ts`, `src/server/event-route-stage124f.ts` - filtrowanie po `case_id` i pelny minimalny select relacji.
- `src/pages/CaseDetail.tsx` - jawny blad, optimistic insert, grupy dzialan, notatki i rozliczenie.
- `src/styles/finance/closeflow-finance.css` - jedyne zrodlo semantycznych kolorow finansow.
- `supabase/migrations/20260613143500_restore_case_items_canonical_columns.sql` - naprawa kontraktu `case_items`.
- `scripts/check-closeflow-case-finance-ui-repair.cjs` i test - dedykowany guard.
