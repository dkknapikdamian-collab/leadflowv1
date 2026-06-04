# STAGE221_OWNER_CONTROL_ROADMAP_2026_06_04

## Cel

Dopiąć do realnej listy etapów CloseFlow nową roadmapę owner-control po deep research CRM i po analizie konkurencji.

## Scan proof

Przeczytane / zweryfikowane źródła:

- `README.md` na branchu `dev-rollout-freeze`.
- `AGENTS.md` na branchu `dev-rollout-freeze`.
- `_project/00_PROJECT_STATUS.md`.
- `_project/03_CURRENT_STAGE.md`.
- `_project/04_DECISIONS.md`.
- `_project/06_GUARDS_AND_TESTS.md`.
- `_project/07_NEXT_STEPS.md`.
- `package.json`.
- `src/App.tsx`.
- upload użytkownika: `deep-research-report (2).md`.

## Fakty

- Repo działa według pamięci projektu na branchu `dev-rollout-freeze`.
- `README.md` potwierdza produkt jako system pilnowania leadów/follow-upów/zadań/wydarzeń/spraw.
- `src/App.tsx` potwierdza istnienie głównych widoków: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, AiDrafts, Billing, Support, Notifications, Templates.
- `package.json` ma już `verify:closeflow:quiet`, `check:no-next-step-ui`, `test:nearest-action` i wiele guardów.
- `_project/07_NEXT_STEPS.md` jest właściwym miejscem dopięcia etapów, ale jest obciążony starszą historią i mojibake. Nie porządkujemy go w tym etapie, żeby nie skasować kontekstu.

## Decyzje Damiana

- Dodać nowe etapy do istniejącej listy etapów w repo.
- Nie wymyślać na ślepo; sprawdzić realny stan.
- Etapy mają być szczegółowe i w logicznej kolejności.
- Przygotować ZIP i komendy push/Obsidian.
- Nie używać `git add .`.

## Hipotezy AI

- Stage221 powinien być dokumentacyjnym etapem spinającym roadmapę; runtime UI należy ruszać dopiero w kolejnych etapach.
- Pierwszym realnym etapem produktowym powinien być A35 Readiness Audit, a nie AI/szkice.

## Zmiany przygotowane w ZIP

- Append do `_project/07_NEXT_STEPS.md`.
- Append do `_project/04_DECISIONS.md`.
- Append do `_project/06_GUARDS_AND_TESTS.md`.
- Append do `_project/08_CHANGELOG_AI.md`.
- Append do `_project/12_IMPLEMENTATION_LEDGER.md`.
- Append do `_project/13_TEST_HISTORY.md`.
- Nowy plik roadmapy w `_project/roadmaps/`.
- Nowy run report w `_project/runs/`.
- Nowy guard w `scripts/`.
- Nowy manifest Obsidiana i plik do skopiowania do vaulta.

## Testy / guardy

Po apply uruchomić:

```powershell
node scripts/check-stage221-owner-control-roadmap-memory.cjs
git diff --check
```

Runtime tests: SKIP, bo etap nie zmienia runtime UI/API.

## Następny krok

Po zatwierdzeniu Stage221 przejść do A35 Readiness Audit jako pierwszego realnego etapu produktowego.
