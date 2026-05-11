# CloseFlow — FIN-1 Finance domain contract

Data: 2026-05-09  
Status: wdrożenie kontraktu domenowego bez podpinania do UI/API  
Zakres: `src/lib/finance/*`, dokumentacja i guard statyczny

## Cel

FIN-1 tworzy jedno miejsce prawdy dla podstawowych pojęć finansowych w CloseFlow.

Ten etap nie wdraża jeszcze płatności jako pełnego modułu. To jest fundament: typy, normalizacja i czyste obliczenia, które później można bezpiecznie podpiąć pod `/api/payments`, widoki spraw, leadów, klientów i rozliczeń.

## Pliki dodane

- `src/lib/finance/finance-types.ts`
- `src/lib/finance/finance-calculations.ts`
- `src/lib/finance/finance-normalize.ts`
- `docs/finance/CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_2026-05-09.md`
- `scripts/check-closeflow-finance-domain-contract.cjs`

## Model domeny

### CommissionMode

Dozwolone wartości:

```ts
none | percent | fixed
```

Znaczenie:

- `none` — brak prowizji,
- `percent` — prowizja procentowa,
- `fixed` — prowizja kwotowa.

### CommissionBase

Dozwolone wartości:

```ts
contract_value | paid_amount | custom
```

Znaczenie:

- `contract_value` — prowizja liczona od wartości umowy / sprawy,
- `paid_amount` — prowizja liczona od faktycznie opłaconej kwoty,
- `custom` — prowizja liczona od ręcznie podanej podstawy.

### CommissionStatus

Dozwolone wartości:

```ts
not_set | expected | due | partially_paid | paid | overdue
```

Znaczenie:

- `not_set` — brak prowizji albo prowizja nieustawiona,
- `expected` — prowizja oczekiwana, ale jeszcze niewymagalna,
- `due` — prowizja wymagalna,
- `partially_paid` — prowizja częściowo zapłacona,
- `paid` — prowizja zapłacona,
- `overdue` — prowizja po terminie.

### PaymentType

Dozwolone wartości:

```ts
deposit | partial | final | commission | refund | other
```

Znaczenie:

- `deposit` — zaliczka,
- `partial` — płatność częściowa,
- `final` — płatność końcowa,
- `commission` — prowizja,
- `refund` — zwrot,
- `other` — inna płatność.

### PaymentStatus

Dozwolone wartości:

```ts
planned | due | paid | cancelled
```

Znaczenie:

- `planned` — zaplanowana,
- `due` — wymagalna,
- `paid` — zapłacona,
- `cancelled` — anulowana.

## Co istnieje po FIN-1

### Istnieje

- stały typ `CommissionMode`,
- stały typ `CommissionBase`,
- stały typ `CommissionStatus`,
- stały typ `PaymentType`,
- stały typ `PaymentStatus`,
- typ `FinancePayment`,
- typ `CommissionConfig`,
- typ `FinanceSummary`,
- normalizacja pojedynczej płatności,
- normalizacja listy płatności,
- normalizacja konfiguracji prowizji,
- obliczanie wartości umowy / kontraktu,
- obliczanie kwoty zapłaconej,
- obliczanie kwoty planowanej,
- obliczanie kwoty wymagalnej,
- obliczanie kwoty zwrotów,
- obliczanie kwoty pozostałej,
- obliczanie prowizji procentowej i kwotowej,
- rozstrzyganie statusu prowizji,
- zbiorczy `buildFinanceSummary()`.

### Częściowo istnieje

- powiązanie finansów z leadem, klientem i sprawą przez `leadId`, `clientId`, `caseId`,
- zgodność z wcześniejszymi polami typu `expectedRevenue`, `paidAmount`, `remainingAmount`, `amount`, `value`,
- obsługa starych statusów typu `pending`, `awaiting_payment`, `done`, `completed`, `settled`, `canceled` przez normalizację.

### Brakuje

- endpointu `/api/payments`,
- migracji Supabase dla tabeli `payments`,
- testów CRUD dla płatności,
- podpięcia nowego kontraktu do `src/lib/data-contract.ts`,
- podpięcia nowego kontraktu do `src/lib/supabase-fallback.ts`,
- podpięcia nowego kontraktu do `CaseDetail`, `LeadDetail`, `ClientDetail`,
- walidacji backendowej prowizji,
- panelu rozliczeń i prowizji.

### Nie ruszać w FIN-1

- nie tworzyć `/api/payments.ts`,
- nie zmieniać migracji Supabase,
- nie zmieniać widoków operatora,
- nie zmieniać `CaseDetail.tsx`,
- nie zmieniać `LeadDetail.tsx`,
- nie zmieniać `ClientDetail.tsx`,
- nie zmieniać cennika subskrypcji aplikacji,
- nie mieszać finansów klienta z billingiem SaaS CloseFlow.

## Zasady obliczeń

### Paid amount

`paidAmount` liczy tylko płatności klienta o statusie `paid`:

- `deposit`,
- `partial`,
- `final`,
- `other`.

Płatność typu `refund` odejmuje się od sumy zapłaconej.

Płatność typu `commission` nie zwiększa `paidAmount` sprawy, bo prowizja jest osobną warstwą rozliczenia.

### Remaining amount

```text
remainingAmount = max(contractValue - paidAmount, 0)
```

### Commission amount

Dla `none`:

```text
0
```

Dla `fixed`:

```text
fixedAmount
```

Dla `percent`:

```text
baseAmount * percent / 100
```

Gdzie `baseAmount` zależy od `CommissionBase`:

- `contract_value` — wartość umowy,
- `paid_amount` — zapłacona kwota,
- `custom` — ręczna podstawa.

## Kryterium zakończenia FIN-1

Etap jest zakończony, jeśli:

1. istnieją trzy pliki domenowe w `src/lib/finance`,
2. wszystkie wymagane union type mają dokładne wartości z modelu,
3. istnieją czyste funkcje obliczeń,
4. istnieją funkcje normalizacji,
5. dokument jasno mówi: `istnieje`, `częściowo istnieje`, `brakuje`, `nie ruszać`,
6. guard `scripts/check-closeflow-finance-domain-contract.cjs` przechodzi.

## Następny etap

Najkrótszy sensowny kolejny etap:

```text
FIN-2 — Payments backend contract
```

Zakres FIN-2:

- `api/payments.ts`,
- migracja Supabase `payments`,
- normalizacja API → finance domain,
- workspace scope,
- CRUD smoke guard,
- brak zmian wizualnych poza minimalnym użyciem danych, jeśli potrzebne.
