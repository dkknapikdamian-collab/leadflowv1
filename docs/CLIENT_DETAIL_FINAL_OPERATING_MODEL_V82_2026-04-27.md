# Client Detail V82: finalny model operacyjny klienta

## Cel

Widok klienta ma być kartoteką zbiorczą, nie drugim kokpitem pracy. Po wejściu w klienta użytkownik ma w kilka sekund wiedzieć:
- kto to jest,
- czy ma otwarte sprawy,
- co wymaga ruchu,
- gdzie kliknąć dalej.

## Zasada główna

Nie usuwamy funkcji z aplikacji. Usuwamy je tylko z głównego widoku klienta, jeśli robią chaos. Funkcje pracy trafiają do sprawy, funkcje pozyskania do aktywnego leada, terminy do zadań i kalendarza.

## Zakładki klienta

Zostają tylko cztery zakładki:
1. Podsumowanie
2. Sprawy
3. Kontakt
4. Historia

Nie dodajemy osobnej głównej zakładki Leady.

## Menu Więcej

Menu jest drugorzędne i zawiera:
- Nowy temat do pozyskania,
- Scal duplikat,
- Archiwizuj klienta,
- Eksportuj historię.

## Test

`tests/client-detail-final-operating-model.test.cjs` pilnuje, że klient pozostaje prostym widokiem: cztery zakładki, brak zakładki Leady, praca przeniesiona do sprawy, a lead źródłowy jest historią pozyskania.