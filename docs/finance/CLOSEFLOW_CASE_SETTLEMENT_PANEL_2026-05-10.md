# CloseFlow FIN-5 — Case settlement panel

Status: wdrożenie panelu rozliczenia sprawy.
Marker: `FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1`

## Cel

Sprawa jest głównym miejscem rozliczeń. Lead może mieć wartość potencjalną, ale finalna praca operacyjna i rozliczenie mają żyć w `CaseDetail`.

FIN-5 wykorzystuje wcześniejsze etapy:

- FIN-1: typy, normalizacja i obliczenia domeny finansów,
- FIN-2: kontrakt bazy i `/api/payments`,
- FIN-3: wspólna warstwa komponentów i CSS `cf-finance-*`.

## Dodane / zmienione pliki

Dodane:

- `src/components/finance/CaseSettlementPanel.tsx`
- `docs/finance/CLOSEFLOW_CASE_SETTLEMENT_PANEL_2026-05-10.md`
- `scripts/check-closeflow-case-settlement-panel.cjs`

Zmieniane przez patch:

- `src/pages/CaseDetail.tsx`
- `src/styles/finance/closeflow-finance.css`
- `package.json`

## Panel

Panel w `CaseDetail` pokazuje minimum produktu:

```text
Rozliczenie sprawy
Wartość transakcji: 105 000 PLN
Prowizja: 2,5%
Prowizja należna: 2 625 PLN
Wpłacono od klienta: 40 000 PLN
Pozostało: 65 000 PLN
Prowizja opłacona: 0 PLN
Prowizja do zapłaty: 2 625 PLN
```

## Zasada jednego źródła prawdy

FIN-5 nie tworzy osobnego systemu wizualnego. Komponent używa:

- `src/lib/finance/finance-types.ts`,
- `src/lib/finance/finance-calculations.ts`,
- `src/lib/finance/finance-normalize.ts`,
- `src/styles/finance/closeflow-finance.css`.

Nie wolno tworzyć lokalnych paneli finansowych poza `src/components/finance/*`, jeśli panel ma dotyczyć rozliczeń.

## Zachowanie

Panel:

- pokazuje wartość transakcji,
- liczy prowizję procentową albo stałą,
- rozdziela wpłaty klienta od płatności prowizji,
- pozwala dodać wpłatę klienta,
- pozwala dodać płatność prowizji,
- pozwala edytować wartość transakcji i prowizję,
- odświeża tylko płatności po mutacji,
- nie robi pełnego reloadu ekranu.

## Czego FIN-5 nie robi

- Nie robi pełnej księgowości.
- Nie dodaje faktur.
- Nie usuwa starych danych historycznych.
- Nie zmienia modelu planów i billingów aplikacji.
- Nie zmienia lead value UX z FIN-4.

## Kryterium zakończenia

Etap jest zakończony, gdy:

- `CaseSettlementPanel` istnieje,
- `CaseDetail` importuje i renderuje `CaseSettlementPanel`,
- panel używa `fetchPaymentsFromSupabase`, `createPaymentInSupabase` i `updateCaseInSupabase`,
- widoczne są wszystkie wymagane etykiety panelu,
- CSS jest dopisany do `closeflow-finance.css`,
- guard `check:closeflow-case-settlement-panel` przechodzi.
