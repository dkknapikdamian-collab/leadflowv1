# STAGE216M_R15_R2_CLIENT_NOTES_SOURCE_TRUTH_ACTUAL_REPAIR_20260602

## Cel
Naprawa realnego problemu notatek klienta po fałszywie zamkniętym R15/R15-R1.

## Fakty
- R15 nie zmienił `src/pages/ClientDetail.tsx`.
- R15-R1 nie zastosował patcha przez zbyt kruchy anchor importu.
- Dyktowanie notatki klienta wpadało do edycji danych klienta.
- Centralna sekcja notatek nie miała prostego tekstowego dodania notatki.

## Zakres R15-R2
- Dodano `clientNoteDraft`.
- Dodano `handleAddClientNote`.
- Notatka zapisuje się jako aktywność `client_note_added`.
- Dyktowanie wpisuje do `clientNoteDraft`, nie do `form.notes`.
- Usunięto pole `Notatka` z edycji danych klienta.
- Dodano CSS dla centralnego kompozytora notatek.

## Czego nie ruszano
- API routes.
- Supabase SQL.
- Płatności.
- Prawa szyna finansów.
- Stage216D.

## Testy
- `node tests/stage216m-r15-r2-client-notes-source-truth-actual-repair-contract.test.cjs`
- `git diff --check`
- `npm run build`
