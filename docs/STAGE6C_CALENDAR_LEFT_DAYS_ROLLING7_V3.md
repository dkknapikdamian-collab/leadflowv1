# ETAP 6C — Calendar left rail visible rolling 7 days V3

## Cel

Lewa karta `Najbliższe 7 dni` ma pokazywać realne, widoczne dni od aktualnego dnia.

## Problem naprawiony

Poprzednia paczka v1 miała błąd w patcherze JS i nie zmieniła `src/pages/Calendar.tsx`.
Paczka v2 zatrzymała się na kroku wejścia do repo. V3 używa prostszego skryptu PowerShell bez wrappera, więc krok `Go to repo` jest odporniejszy.

## Zakres zmian

- `src/pages/Calendar.tsx`
- bez zmian w API, Supabase, auth, billing, workspace, routingu i modelu danych

## Co zmienia patch

- dodaje widoczną listę 7 dni w lewej karcie,
- pierwszy dzień to zawsze aktualny dzień,
- kolejne dni lecą w pełnym obiegu 7 dni,
- każdy dzień ma datę i licznik rzeczy,
- kliknięcie w dzień ustawia aktywny dzień,
- stary/pusty blok listy zostaje ukryty, żeby nie zostawiał pustej przestrzeni ani duplikatu.

## Weryfikacja

Skrypt uruchamia:

```powershell
npm.cmd run build
```

Jeżeli istnieje checker mojibake, uruchamia go dodatkowo.
