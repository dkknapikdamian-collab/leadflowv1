# CloseFlow Stage171 — Remove Modal Helper Copy

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal helper copy removal

## FAKTY

- Po Stage170 build przeszedł lokalnie.
- W modalach zostały pomocnicze teksty, które Damian chce usunąć.
- W Calendar.tsx występują m.in. opis dialogu wydarzenia oraz sekcja `Od do`.
- DialogDescription trzeba zachować w formie ukrytej dla dostępności.

## DECYZJE DAMIANA

- Kasujemy wskazane teksty wszędzie:
  - `Ustaw termin...`
  - `Od do`
  - `Najpierw ustaw start i koniec...`
  - `Możesz zostawić brak...`
  - `Na końcu ustaw...`
  - `Wpisz minimum danych...`
  - `Najważniejsze pola...`
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Najbezpieczniej usuwać konkretne widoczne teksty, a nie całe sekcje formularzy.
- Dla Radix `DialogDescription` użyć hidden copy zamiast usunięcia elementu.

## TESTY

```powershell
node scripts/check-stage171-remove-modal-helper-copy.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `+ Wydarzenie`, `+ Lead`, globalne `+ Zadanie`.
