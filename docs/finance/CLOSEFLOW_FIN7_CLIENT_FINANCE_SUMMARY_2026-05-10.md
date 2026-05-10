# CLOSEFLOW FIN-7 — Client finance summary — 2026-05-10

## Cel

Dodać do klienta lekki panel finansowy bez robienia pełnej księgowości klienta.

## Zakres

Widok klienta pokazuje sekcję `Finanse relacji` z czterema wartościami:

- `Suma spraw` — suma wartości spraw powiązanych z klientem.
- `Prowizja należna` — suma prowizji wynikająca z danych spraw.
- `Wpłacono` — suma wpłat klienta, bez płatności prowizji.
- `Pozostało` — suma pozostałej wartości do zapłaty.

## Źródło prawdy

Obliczenia są w `src/lib/finance/finance-client-summary.ts`.

Komponent widoku jest eksportowany z `src/components/finance/FinanceMiniSummary.tsx` jako `ClientFinanceRelationSummary`.

## Nie zmieniamy

- Nie dodajemy pełnej księgowości klienta.
- Nie usuwamy FIN-5 panelu rozliczenia sprawy.
- Nie zmieniamy API-0.
- Nie zmieniamy modelu DB.

## Guard

`npm run check:closeflow-fin7-client-finance-summary`
