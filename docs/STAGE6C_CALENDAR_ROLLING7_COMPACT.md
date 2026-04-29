# ETAP 6C — Calendar rolling 7-day + compact rows/actions

## Cel

Kalendarz tygodniowy ma pokazywać rolling 7 dni od dzisiaj, a nie sztywny tydzień poniedziałek-niedziela. Wpisy mają być zwarte, czytelne i operacyjne.

## Zakres zmian

- `src/pages/Calendar.tsx`
- bez zmian w API, Supabase, auth, billing, workspace, routingu i modelu danych

## Co zmienia patch

- tydzień liczony jako: dzisiaj + następne 6 dni,
- etykiety tygodniowe przygotowane pod pierwszy dzień jako `Dzisiaj`,
- kompaktowy wiersz wpisu z typem: `Zadanie` / `Wydarzenie`,
- widoczne powiązanie: Lead / Sprawa / Klient, jeśli istnieje,
- małe akcje o szerokości dopasowanej do tekstu:
  - Edytuj,
  - +1D,
  - +1W,
  - +1H,
  - Zrobione / Przywróć,
  - Usuń,
- miesiąc korzysta z tych samych lekkich akcji na liście wpisów wybranego dnia.

## Weryfikacja lokalna

Skrypt uruchamia:

```powershell
npm.cmd run build
```

Jeżeli w repo istnieje checker mojibake, skrypt próbuje uruchomić go dodatkowo.

## Kryterium zakończenia

- `/calendar` działa,
- tryb tygodniowy zaczyna się od bieżącego dnia,
- widok pokazuje 7 kolejnych dni,
- wpisy nie są rozlanymi kartami,
- przyciski są małe i konkretne,
- akcje zostały zachowane,
- build przechodzi.
