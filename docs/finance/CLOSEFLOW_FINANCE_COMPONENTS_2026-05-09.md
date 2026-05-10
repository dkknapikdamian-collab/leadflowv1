# CloseFlow FIN-3 — Finance components

Status: wdrożenie komponentów UI, bez automatycznego podpinania do ekranów.
Marker: `FIN-3_CLOSEFLOW_FINANCE_COMPONENTS_V1`

## Cel

Dodać pierwszą warstwę prezentacji rozliczeń, która korzysta z kontraktu FIN-1 i backendowego kontraktu FIN-2, ale nie zmienia jeszcze przepływu pracy użytkownika.

FIN-3 ma dać gotowe klocki do użycia na `CaseDetail`, `LeadDetail` albo w przyszłym panelu rozliczeń.

## Dodane pliki

- `src/components/finance/FinanceSnapshot.tsx`
- `src/components/finance/FinanceMiniSummary.tsx`
- `src/components/finance/PaymentList.tsx`
- `src/components/finance/PaymentFormDialog.tsx`
- `src/components/finance/CommissionFormDialog.tsx`
- `src/styles/finance/closeflow-finance.css`
- `scripts/check-closeflow-finance-components.cjs`
- `docs/finance/CLOSEFLOW_FINANCE_COMPONENTS_2026-05-09.md`

## Widok minimum

Komponent `FinanceSnapshot` ma pokazać operatorowi minimum:

```text
Rozliczenie
Wartość: 105 000 PLN
Prowizja: 2,5% = 2 625 PLN
Wpłacono: 40 000 PLN
Pozostało: 65 000 PLN
Status prowizji: należna
[Dodaj wpłatę] [Edytuj prowizję]
```

## Co istnieje po FIN-3

### `FinanceSnapshot`

Główny komponent agregujący:

- podsumowanie finansowe,
- listę wpłat,
- przycisk `Dodaj wpłatę`,
- przycisk `Edytuj prowizję`,
- dialog dodawania wpłaty,
- dialog edycji prowizji.

Komponent nie zapisuje danych sam z siebie. Wymaga przekazania callbacków:

- `onAddPayment`,
- `onEditCommission`.

To jest celowe. FIN-3 nie ma jeszcze decydować, czy zapis idzie do sprawy, leada, klienta czy osobnego panelu.

### `FinanceMiniSummary`

Czytelny, read-only summary box:

- wartość kontraktu,
- prowizja,
- wpłacono,
- pozostało,
- status prowizji.

### `PaymentList`

Lekka lista wpłat:

- typ płatności,
- status,
- kwota,
- termin albo data wpłaty,
- notatka.

### `PaymentFormDialog`

Dialog formularza wpłaty. Zwraca dane przez `onSubmit`, ale nie wykonuje bezpośrednio API calla.

### `CommissionFormDialog`

Dialog edycji prowizji. Zwraca dane przez `onSubmit`, ale nie wykonuje bezpośrednio API calla.

## Czego FIN-3 nie robi

- Nie podłącza jeszcze komponentów do `CaseDetail`.
- Nie zmienia routingu.
- Nie zmienia `api/payments.ts`.
- Nie zmienia migracji.
- Nie robi pełnego panelu księgowego.
- Nie ukrywa ani nie usuwa istniejących elementów finansowych w `CaseDetail`.

## Zasady bezpieczeństwa UX

1. Komponenty są scoped klasami `cf-finance-*`.
2. Nie używają globalnych klas koloru spoza systemu.
3. Nie tworzą finalnych rekordów bez callbacka z ekranu nadrzędnego.
4. Dialogi są gotowe do podpięcia pod istniejące funkcje z `src/lib/supabase-fallback.ts`.
5. `readonly=true` ukrywa akcje i zostawia tylko podgląd.

## Kryterium zakończenia

Etap jest zakończony, gdy:

- wszystkie pliki FIN-3 istnieją,
- `FinanceSnapshot` pokazuje minimum rozliczenia,
- `PaymentFormDialog` i `CommissionFormDialog` są osobnymi komponentami,
- CSS jest odseparowany w `src/styles/finance/closeflow-finance.css`,
- guard `scripts/check-closeflow-finance-components.cjs` przechodzi.

## Następny etap

FIN-4 powinien być dopiero etapem integracyjnym:

- podpiąć `FinanceSnapshot` w `CaseDetail`,
- pobierać `payments` przez `fetchPaymentsFromSupabase({ caseId })`,
- zapisywać wpłatę przez `createPaymentInSupabase`,
- edytować prowizję przez `updateCaseInSupabase`,
- odświeżać tylko rozliczenia po mutacji, bez reloadu całego ekranu.
