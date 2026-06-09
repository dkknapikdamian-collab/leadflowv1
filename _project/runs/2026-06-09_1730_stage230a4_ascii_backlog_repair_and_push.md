# Stage230A4 - ASCII backlog repair and push

- data i godzina: 2026-06-09 17:30 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: roadmap repair / backlog update / risk audit
- status: prepared by ZIP runner

## Powod

Stage230A3 zatrzymal sie na bledzie parsera PowerShell przez znaki nie-ASCII w skrypcie. Stage230A4 uzywa ASCII-only markerow i dopisuje backlog bez zmiany runtime.

## Dopisane do backlogu

- dokumenty / zalaczniki do leadow,
- koszty / pozycje kosztowe,
- uproszczenie edycji wydarzen i zadan,
- poprawa ekranu startowego przed produkcja,
- Smart Prospecting / AI Opportunity Finder jako modul CloseFlow, nie osobna aplikacja.

## Testy

- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check
- git diff --cached --check

## Audyt ryzyk

- Smart Prospecting ma byc pozniejszym modulem po stabilizacji CRM, a nie nowa osobna aplikacja.
- Dokumenty, koszty, edycja wydarzen/zadan i start screen wymagaja osobnych etapow i guardow.
- Skrypty PowerShell w paczkach powinny unikac nie-ASCII w logice warunkow.
