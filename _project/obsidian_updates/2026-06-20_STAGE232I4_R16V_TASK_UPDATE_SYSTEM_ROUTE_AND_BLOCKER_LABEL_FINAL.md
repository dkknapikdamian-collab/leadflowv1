# CloseFlow / LeadFlow — STAGE232I4_R16V_TASK_UPDATE_SYSTEM_ROUTE_AND_BLOCKER_LABEL_FINAL

- date/time: 2026-06-20 12:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- stage: STAGE232I4_R16V_TASK_UPDATE_SYSTEM_ROUTE_AND_BLOCKER_LABEL_FINAL

## Powód
Smoke po R16T pokazał, że widok jest prawie zaakceptowany, ale checkbox blokady dalej zwraca runtime `existing is not defined`, a przy checkboxie brakuje jawnego tekstu `Blokuje`.

## Zmiana
- Utrzymać zatwierdzony compact layout managera.
- Dodać widoczny tekst `Blokuje` obok checkboxa.
- Przełączyć `updateTaskInSupabase` na `/api/system?apiRoute=tasks`, zgodnie z aktualną ścieżką odczytu tasków i konsolidacją api/system.

## Testy
Guard, node test, build, diff check.

## Ryzyko
`updateTaskInSupabase` jest globalnym helperem tasków, więc po wdrożeniu sprawdzić również zwykłą edycję taska poza managerem braków.

## Status
Payload prepared in ZIP. App push pending. Obsidian GitHub/local sync pending after PASS.
