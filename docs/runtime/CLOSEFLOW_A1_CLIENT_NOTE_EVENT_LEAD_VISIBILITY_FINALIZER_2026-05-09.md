# CloseFlow A1 - Client note / event modal / lead visibility finalizer

## Zakres

Ten etap domyka P1 runtime i dane:

- notatki klienta sa zapisywane jako client_note,
- stare typy notatek klienta pozostaja obslugiwane,
- activities API i frontendowy helper obsluguja clientId,
- notatki klienta moga byc usuwane przez deleteActivityFromSupabase,
- modal wydarzenia ma czytelny styl zapisu,
- nowy lead po dodaniu nie dziedziczy clientId / linkedCaseId i resetuje filtry listy.

## Nie ruszano

- finansow,
- visual systemu jako migracji,
- routingu,
- migracji bazy,
- starych typow activity.

## Check

- npm run check:a1-client-note-event-lead-visibility-finalizer
- npm run check:polish-mojibake
- npm run build

## Manualny smoke test po wdrozeniu

1. Wejdz w klienta.
2. Dodaj notatke przez akcje kontekstowa / dyktowanie.
3. Sprawdz, czy widac ja w historii jak zwykla notatke.
4. Usun notatke i sprawdz, ze nie ma ReferenceError.
5. Z klienta dodaj wydarzenie i sprawdz, ze modal ma widoczny tekst oraz przycisk "Zapisz wydarzenie".
6. Wejdz w Leady, ustaw wyszukiwanie lub filtr, dodaj nowego leada.
7. Po zapisie lista ma pokazac nowego leada bez recznego czyszczenia filtra.
