# STAGE227E5 — Work Center + Blockers Source of Truth

Status: local-only, bez pushu.

## Cel

LeadDetail ma mieć jedno centralne miejsce pracy dla działań:
- Najbliższe działania,
- Braki i blokady,
- Wszystkie aktywne.

Prawy rail nie może dublować listy najbliższych działań. Prawy rail zostaje dla szybkich akcji i finansów.

## Zasady

- Nie przywracać Kontekstu sprzedażowego.
- Nie ruszać SQL/Supabase.
- Nie ruszać modelu notatek i historii w tym etapie.
- Nie usuwać handlerów: edycja, jutro, zrobione, usuń.
- Nie tworzyć drugiego źródła prawdy dla działań leada.

## Guard

- `check:stage227e5-work-center-blockers-source-of-truth`

## Test

- `test:stage227e5-work-center-blockers-source-of-truth`
