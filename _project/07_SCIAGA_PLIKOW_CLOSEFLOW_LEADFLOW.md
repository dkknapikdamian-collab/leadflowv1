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
