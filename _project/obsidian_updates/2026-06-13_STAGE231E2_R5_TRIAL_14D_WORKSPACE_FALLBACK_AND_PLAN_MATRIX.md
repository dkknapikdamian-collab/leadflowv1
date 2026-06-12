# Obsidian payload — STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK_AND_PLAN_MATRIX

- data i godzina: 2026-06-13 00:40 Europe/Warsaw
- nazwa / alias wejściowy: Trial pokazuje 18 dni mimo decyzji 14 dni
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow — DO_POTWIERDZENIA formalne ID
- idea_id: nie dotyczy
- report_id: 2026-06-13_STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK_AND_PLAN_MATRIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: _project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md
- ściąga plików: src/lib/plans.ts, src/lib/workspace.ts, src/hooks/useWorkspace.ts, src/lib/access.ts, src/pages/Billing.tsx, src/pages/Login.tsx, api/me.ts
- typ wpisu: bugfix / trial duration / plan entitlement audit
- docelowa ścieżka: 04_KIERUNEK_DO_WDROZENIA, 08_HISTORIA_ZMIAN, 09_TESTY_DO_WYKONANIA_I_WYNIKI, 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status zapisu: payload w ZIP local-only
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: guard trial contract, guard matrix, R2/R3/R4 guards, build, git diff --check
- audyt ryzyk po etapie: stare workspace w bazie mogą mieć legacy `trial_ends_at`; nie przycinano SQL-em
- czego nie ruszano: Google Calendar runtime, AI runtime, Stripe, SQL, Visual Tile Wave, mobile readability
- następny krok: lokalny apply, guardy, build, ręczny test świeżego konta, potem selektywny push po PASS

## Tekst do centralnych plików projektu

2026-06-13 00:40 Europe/Warsaw — STAGE231E2_R5 zamyka aktywne tworzenie triala 21 dni w lokalnym fallbacku i dopina matrix planów. Aktywny produktowy trial to 14 dni. `trial_21d` zostaje tylko jako legacy alias w `plans.ts` dla starych danych. Nie wykonano SQL i nie przycinano istniejących workspace bez decyzji Damiana.
