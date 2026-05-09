# CloseFlow — Lead hidden duplicate restore v1

## Problem

Jeżeli lead został kiedyś przeniesiony do klienta/sprawy albo kosza, a potem użytkownik próbuje dodać ponownie ten sam kontakt, system mógł zwrócić błąd duplikatu. Rekord nie pojawiał się na aktywnej liście, bo lista ukrywa archiwalne i przeniesione leady.

## Decyzja

Nie wolno blokować użytkownika komunikatem, który wskazuje rekord niewidoczny na liście. Przy tworzeniu leada API sprawdza ukryte/historyczne rekordy po e-mailu, telefonie albo nazwie.

## Zachowanie po poprawce

- Jeżeli ukryty rekord nie ma powiązanej sprawy, API przywraca go jako aktywnego leada i aktualizuje danymi z formularza.
- Jeżeli rekord ma powiązaną sprawę, API nie niszczy historii i zwraca czytelny błąd: LEAD_DUPLICATE_IN_HISTORY_OPEN_RECORD.
- UI pokazuje wtedy komunikat, że kontakt istnieje w historii/obsłudze i trzeba go przywrócić zamiast tworzyć duplikat.

## Guard

Sprawdzenie: npm run check:closeflow-lead-hidden-duplicate-restore-v1
