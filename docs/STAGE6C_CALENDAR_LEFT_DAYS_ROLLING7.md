# ETAP 6C — Calendar left rail rolling days fix

## Cel

Lewa karta `Najbliższe 7 dni` ma realnie pokazywać 7 dni w obiegu od aktualnego dnia, zamiast pustej dekoracji.

## Zakres zmian

- `src/pages/Calendar.tsx`
- bez zmian w API, Supabase, auth, billing, workspace, routingu i modelu danych

## Co zmienia patch

- w lewej karcie pokazuje widoczne przyciski dni,
- pierwszy dzień to zawsze aktualny dzień, opisany jako `Dzisiaj`,
- kolejne dni lecą po kolei przez pełne 7 dni, np. środa → czwartek → piątek → sobota → niedziela → poniedziałek → wtorek,
- każdy dzień pokazuje datę i liczbę rzeczy,
- kliknięcie w dzień ustawia aktywny dzień w prawym panelu,
- aktywny dzień ma wyraźny, ale lekki stan wizualny.

## Weryfikacja lokalna

Skrypt uruchamia:

```powershell
npm.cmd run build
```

Jeżeli istnieje checker mojibake, skrypt uruchamia go dodatkowo.

## Kryterium zakończenia

- karta `Najbliższe 7 dni` nie jest pusta,
- dni zaczynają się od dnia aktualnego,
- widocznych jest 7 dni,
- kliknięcie w dzień zmienia aktywny dzień,
- build przechodzi.
