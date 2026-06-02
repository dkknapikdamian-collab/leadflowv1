# STAGE216M-R16-R1 Client note modal source truth repair

## Cel
Ujednolicić UX notatek klienta z LeadDetail: przycisk `Dodaj notatkę` oraz `Dyktuj notatkę` mają otwierać to samo okno notatki. Notatka nie może pojawiać się w panelu danych klienta.

## Fakty
- R15-R5 naprawił zapis notatek klienta przez `client_note_added`.
- Po R15-R5 UX nadal był rozjechany: klient miał inline composer, a lead używał modala.
- R16 nie wszedł, ponieważ patch szukał kruchego anchora importu dialogu.

## Zmiany
- Dodano stan `clientNoteModalOpen`.
- Dodano `openClientNoteModal` i `closeClientNoteModal`.
- `Dodaj notatkę` otwiera modal.
- `Dyktuj notatkę` otwiera ten sam modal i wpisuje tekst do pola notatki.
- Usunięto inline composer z centrum klienta.
- Nie ruszano API, Supabase SQL, płatności ani prawej szyny.

## Testy
- `node tests/stage216m-r16-r1-client-note-modal-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Test ręczny
1. Wejdź w klienta.
2. Kliknij `Dodaj notatkę`.
3. Sprawdź, czy otwiera się modal.
4. Kliknij `Dyktuj notatkę`.
5. Sprawdź, czy otwiera się ten sam modal i tekst wpada do pola notatki.
6. Sprawdź, czy pole `Notatka` nie wraca do danych klienta.
