# CloseFlow / LeadFlow - Stage216M-R15-R5 Client notes source truth final repair

## FAKTY
- R15-R1/R15-R2/R15-R3/R15-R4 nie weszły przez błędne anchory patchy.
- R15-R5 naprawia notatki klienta bez zmiany API i Supabase SQL.

## DECYZJE DAMIANA
- Notatki klienta mają być w centrum pracy.
- Nie ma być duplikatu pola notatki w danych klienta.
- Dyktowanie ma wpisywać do roboczej notatki, nie do danych klienta.

## ZAKRES
- ClientDetail notes source truth.
- Composer tekstowy + dyktowanie + zapis aktywności.

## TESTY
- Guard R15-R5.
- git diff --check.
- npm run build.

## NASTĘPNY KROK
Po pushu sprawdzić w UI: wpis tekstowy, Dodaj notatkę, dyktowanie, brak pola Notatka w Edytuj dane.
