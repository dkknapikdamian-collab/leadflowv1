# CLOSEFLOW_ADMIN_FEEDBACK_2026_05_11_GUARD

## Cel

Dodać lekki guard tekstowy pod feedback administracyjny z 2026-05-11.

Guard sprawdza:

- Today: sekcje, focus/expand wiring i aria/data state.
- Clients: szeroki layout i `cf-client-next-action-panel`.
- Cases: akcja `Usuń`.
- Cases: brak renderowania `x% kompletności`.
- Cases: brak generatora technicznego sufiksu tytułu.
- Źródła: brak mojibake `obs...` z uszkodzonym znakiem.

## Komenda

`npm run check:closeflow-admin-feedback-2026-05-11`

## Poprawka safe-final

Wcześniejsze paczki wywracały się, bo repair script generował guard wewnątrz template literal i Node próbował interpolować `${String(client?...`. Ta wersja kopiuje guard jako gotowy plik i repair script nie zawiera wygenerowanych template literal.
