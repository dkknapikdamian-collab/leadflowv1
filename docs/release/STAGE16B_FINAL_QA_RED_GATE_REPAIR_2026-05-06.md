# Stage16B — Final QA red gate repair — 2026-05-06

## Cel
Naprawić czerwone elementy z finalnego release candidate gate bez ruszania funkcji produktowych szerzej niż potrzeba.

## Naprawiane błędy
- `verify:closeflow:quiet` zatrzymany na `tests/lead-service-mode-v1.test.cjs`.
- `test:critical` zatrzymany na A13 critical regression guard.
- `check:plan-access-gating` zatrzymany na brakach w backend feature gate, Billing matrix i GlobalQuickActions AI plan gate.

## Zakres zmian
- `LeadDetail.tsx`: po starcie obsługi kieruje do `/case/:id`.
- `_access-gate.ts`: dodaje/utrzymuje `assertWorkspaceFeatureAllowed`, `AI_NOT_AVAILABLE_ON_PLAN`, `GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN`.
- `Billing.tsx`: dodaje jawne markery/macierz Google Calendar i pełnego AI.
- `GlobalQuickActions.tsx`: pełny asystent AI gated po `access?.features?.ai || access?.features?.fullAi`, z czytelną kopią blokady.
- `App.tsx`: utrzymuje aliasy `/today` i `/support`.
- `package.json`: utrzymuje alias `check:plan-access-gating` i release audit command.

## Nie zmienia
- danych,
- billing flow,
- AI runtime,
- Google Calendar runtime,
- Supabase schema,
- push/commit.

## Testy
- `verify:closeflow:quiet`
- `test:critical`
- `check:plan-access-gating`
- `check:a13-critical-regressions`
- opcjonalnie pełny `audit:release-candidate`
