# CloseFlow / LeadFlow - Stage216M-R16 client note modal source truth

## FAKTY
- R15-R5 naprawił zapis notatek klienta jako aktywność `client_note_added`.
- Test UI pokazał, że notatki klienta nadal powinny zachowywać się jak notatki leada: przycisk otwiera modal dodawania notatki.

## DECYZJE DAMIANA
- Notatki klienta mają działać jak w leadzie.
- `Dyktuj notatkę` ma otwierać istniejący model dodawania notatki, a nie pokazywać pole w karcie danych klienta.
- Trzeba dodać `Dodaj notatkę` w sekcji notatek klienta.

## ZAKRES R16
- Dodanie modalnego source of truth dla notatek klienta.
- Usunięcie inline composera z centrum klienta.
- Dyktowanie wpisuje do `clientNoteDraft` w modalu.
- Panel danych klienta pozostaje bez pola `Notatka`.

## TESTY
- Guard R16.
- Build Vite.
- Test ręczny: dodaj notatkę, dyktuj notatkę, sprawdź panel danych.

## NASTĘPNY KROK
Po deployu sprawdzić UI klienta i porównać z LeadDetail.
