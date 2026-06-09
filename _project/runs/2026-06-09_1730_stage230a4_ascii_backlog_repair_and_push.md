# Stage230A4 - backlog repair and push

- data i godzina: 2026-06-09 17:30 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: roadmap repair / backlog update / risk audit
- status: prepared by ZIP runner

## Dopisane do backlogu

- dokumenty / załączniki do leadów,
- koszty / pozycje kosztowe,
- uproszczenie edycji wydarzeń i zadań,
- poprawa ekranu startowego przed produkcją,
- Smart Prospecting / AI Opportunity Finder jako moduł CloseFlow, nie osobna aplikacja.

## Testy

- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check
- git diff --cached --check

## Audyt ryzyk

- Smart Prospecting ma być późniejszym modułem po stabilizacji CRM, a nie nową osobną aplikacją.
- Dokumenty, koszty, edycja wydarzeń/zadań i start screen wymagają osobnych etapów i guardów.
