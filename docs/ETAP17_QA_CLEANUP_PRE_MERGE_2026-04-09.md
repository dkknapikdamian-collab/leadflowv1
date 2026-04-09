# ETAP 17

Cel:
Domknac branch dev-rollout-freeze przed merge do main.

Pliki do sprawdzenia:
- lib/store.tsx
- lib/data/actions.ts
- lib/data/repository.ts
- lib/snapshot.ts
- app/api/app/snapshot/route.ts
- lib/domain/lead-state.ts
- lib/domain/lead-case.ts
- lib/domain/cases-dashboard.ts
- lib/today.ts
- components/today-page-view.tsx
- components/views.tsx
- components/cases-page-view.tsx
- components/client-portal-view.tsx
- app/today/page.tsx
- app/leads/page.tsx
- app/cases/page.tsx
- app/tasks/page.tsx
- app/calendar/page.tsx
- app/portal/[token]/page.tsx
- app/api/client-portal/[token]/route.ts
- app/api/client-portal/[token]/attachments/[attachmentId]/route.ts
- app/api/system/workflow-notifications/route.ts
- lib/mail/workflow-planner.ts
- tests/today.test.ts
- tests/lead-state.test.ts
- tests/lead-case-bridge.test.ts
- tests/cases-dashboard.test.ts
- tests/case-automation.test.ts
- tests/client-portal-token.test.ts
- tests/portal-token-security.test.ts
- tests/workflow-planner.test.ts
- tests/workflow-stage-integration.test.ts
- tests/workflow-runtime-stage-usage.test.ts
- docs/MAIN_RULES_DEV_ROLLOUT_FREEZE_2026-04-09.md
- tmp-test-doc.txt

Zmien:
1. Zrob manual QA flow lead -> won -> case -> ready_to_start -> in_progress.
2. Sprawdz zgodnosc store, actions, repository, snapshot i API z nowa domena.
3. Sprawdz portal klienta, tokeny, uploady i akceptacje.
4. Sprawdz workflow notifications i brak duplikatow.
5. Usun pliki testowe:
   - docs/MAIN_RULES_DEV_ROLLOUT_FREEZE_2026-04-09.md
   - tmp-test-doc.txt
6. Przed merge do main potwierdz:
   - npm test
   - npm run build
   - manual QA
   - brak smieciowych plikow

Nie zmieniaj:
- nie wracaj do modelu dwoch osobnych aplikacji
- nie cofaj Today do starego modelu
- nie usuwaj domeny lead -> case
- nie mergeuj do main przed domknieciem etapu

Po wdrozeniu sprawdz:
- npm test
- npm run build
- reczne przeklikanie ekranow
- cleanup repo

Kryterium zakonczenia:
Branch dev-rollout-freeze jest zielony, czysty i gotowy do merge.
