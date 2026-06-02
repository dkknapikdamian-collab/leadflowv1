# STAGE216M-R16-R3 Client note modal portal hard lock

## Cel
Naprawić sytuację, w której w ClientDetail kliknięcie `Dyktuj notatkę` uruchamiało dyktowanie bez widocznego modala i użytkownik widział stary panel notatki pod danymi klienta.

## Diagnoza
- R15-R5 naprawił zapis notatki jako `client_note_added`.
- R16-R2 dodał modal, ale renderował go wewnątrz legacy layoutu ClientDetail.
- Ekran użytkownika pokazał, że przy dyktowaniu modal nie jest widoczny, a stary panel edycji danych klienta nadal może dominować percepcyjnie.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/stage216m-r16-r3-client-note-modal-portal-lock.css`
- `src/styles/page-adapters/page-adapters.css`
- guard kontraktowy R16-R3

## Zmiana
- Modal notatki klienta renderowany przez `createPortal(..., document.body)`.
- `Dyktuj notatkę` zamyka edycję danych klienta i otwiera modal.
- Modal renderuje się także wtedy, gdy aktywne jest dyktowanie.
- Usunięto `notes` ze stanu danych klienta jako defensywę przed powrotem starego pola `Notatka`.
- Dodano CSS hard lock dla widoczności przycisków i modala.

## Czego nie ruszano
API, Supabase SQL, płatności, prawa szyna finansów, Stage216D.

## Testy
- `node tests/stage216m-r16-r3-client-note-modal-portal-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`
