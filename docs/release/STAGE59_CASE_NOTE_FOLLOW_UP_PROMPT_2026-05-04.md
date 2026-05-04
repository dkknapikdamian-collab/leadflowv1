# STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Po zapisaniu notatki w sprawie użytkownik dostaje lekki prompt do ustawienia follow-upu bez przechodzenia do osobnego formularza zadań.

## Zakres

- Dodano prompt po zapisie notatki w `CaseDetail`.
- Dodano szybkie wybory: Dziś, Jutro, Za 2 dni, Za tydzień, Własny termin.
- Tworzony task ma typ `follow_up` i jest powiązany z `caseId`, `clientId` oraz `leadId`, jeśli sprawa je posiada.
- Dodano aktywność `case_note_follow_up_added`.
- Nie dodano AI, nie zmieniono modelu danych i nie zmieniono endpointów.

## Testy

- `npm.cmd run check:stage59-case-note-follow-up-prompt`
- `npm.cmd run test:stage59-case-note-follow-up-prompt`
- `npm.cmd run verify:case-operational-ui`
- `npm.cmd run build`

## Kryterium zakończenia

Użytkownik może zapisać notatkę w sprawie i jednym kliknięciem ustawić kolejny follow-up przypięty do tej samej sprawy.
