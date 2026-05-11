# CloseFlow Finance Domain Contract

Marker: `CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1`  
Data dokumentu: 2026-05-09  
Etap: FIN-1 â€” Finance domain contract  
Tryb: domenowy kontrakt finansowy bez UI, bez migracji DB, bez panelu prowizji

## Cel

FIN-1 ustala jeden model prowizji, wartoĹ›ci i wpĹ‚at, z ktĂłrego pĂłĹşniej majÄ… korzystaÄ‡ Lead, Client i Case.

To nie jest etap UI. To nie jest etap Supabase migration. To nie jest panel finansĂłw. To jest kontrakt domenowy, ĹĽeby nie mieszaÄ‡ wartoĹ›ci leada, wartoĹ›ci sprawy, wpĹ‚at klienta i prowizji operatora.

## GĹ‚Ăłwna decyzja modelowa

| PojÄ™cie | Znaczenie | ĹąrĂłdĹ‚o docelowe |
|---|---|---|
| `contractValue` | wartoĹ›Ä‡ kontraktu/sprawy; kwota bazowa, niekoniecznie pobrana | Case albo przeniesiony lead |
| `paidAmount` | realnie zapĹ‚acone przez klienta wpĹ‚aty typu `deposit`, `partial`, `final`, `other` o statusie `paid`, pomniejszone o refundy | Payments |
| `remainingAmount` | `contractValue - paidAmount`, minimum `0` | funkcja `calculateRemainingAmount` |
| `commissionAmount` | prowizja naleĹĽna operatorowi/licencjobiorcy | funkcja `calculateCommissionAmount` |
| `commissionPaidAmount` | suma pĹ‚atnoĹ›ci typu `commission` ze statusem `paid` | Payments |
| `commissionRemainingAmount` | `commissionAmount - commissionPaidAmount`, minimum `0` | funkcja `calculateRemainingAmount` |

## Typy minimum

```ts
type CommissionMode = 'none' | 'percent' | 'fixed';
```

```ts
type CommissionBase =
 | 'contract_value'
 | 'paid_amount'
 | 'custom';
```

```ts
type CommissionStatus =
 | 'not_set'
 | 'expected'
 | 'due'
 | 'partially_paid'
 | 'paid'
 | 'overdue';
```

```ts
type PaymentType =
 | 'deposit'
 | 'partial'
 | 'final'
 | 'commission'
 | 'refund'
 | 'other';
```

```ts
type PaymentStatus =
 | 'planned'
 | 'due'
 | 'paid'
 | 'cancelled';
```

## Pliki kontraktu

- `src/lib/finance/finance-types.ts`
- `src/lib/finance/finance-normalize.ts`
- `src/lib/finance/finance-calculations.ts`

## Funkcje publiczne

| Funkcja | Rola |
|---|---|
| `calculateCommissionAmount` | liczy prowizjÄ™ wedĹ‚ug `CommissionMode` i `CommissionBase` |
| `calculatePaidAmount` | liczy realnie zapĹ‚acone wpĹ‚aty klienta, z pominiÄ™ciem prowizji i odjÄ™ciem refundĂłw |
| `calculateRemainingAmount` | liczy pozostaĹ‚Ä… kwotÄ™, zawsze minimum `0` |
| `calculateCommissionPaidAmount` | liczy zapĹ‚acone prowizje z payments typu `commission` |
| `buildFinanceSnapshot` | buduje jeden snapshot finansowy dla Lead/Client/Case |

## Zasady liczenia

### CommissionMode

| Tryb | Znaczenie |
|---|---|
| `none` | prowizja wyĹ‚Ä…czona, kwota prowizji = `0` |
| `percent` | prowizja liczona procentem od bazy |
| `fixed` | prowizja jako rÄ™czna staĹ‚a kwota |

### CommissionBase

| Baza | Znaczenie |
|---|---|
| `contract_value` | procent od wartoĹ›ci kontraktu/sprawy |
| `paid_amount` | procent od faktycznie wpĹ‚aconych pieniÄ™dzy klienta |
| `custom` | procent od rÄ™cznie podanej bazy |

### PaymentType

| Typ pĹ‚atnoĹ›ci | Czy wchodzi do `paidAmount` klienta? | Czy wchodzi do `commissionPaidAmount`? |
|---|---:|---:|
| `deposit` | tak, jeĹ›li status `paid` | nie |
| `partial` | tak, jeĹ›li status `paid` | nie |
| `final` | tak, jeĹ›li status `paid` | nie |
| `other` | tak, jeĹ›li status `paid` | nie |
| `refund` | odejmuje od `paidAmount`, jeĹ›li status `paid` | nie |
| `commission` | nie | tak, jeĹ›li status `paid` |

## Nie ruszaÄ‡ w FIN-1

- Nie tworzyÄ‡ panelu finansĂłw.
- Nie tworzyÄ‡ UI prowizji.
- Nie tworzyÄ‡ migracji DB.
- Nie zmieniaÄ‡ `api/payments.ts`.
- Nie zmieniaÄ‡ `api/cases.ts`, `api/leads.ts`, `api/clients.ts`.
- Nie zmieniaÄ‡ `src/pages/LeadDetail.tsx`, `src/pages/ClientDetail.tsx`, `src/pages/CaseDetail.tsx`.
- Nie przepinaÄ‡ jeszcze `relation-value.ts`, `data-contract.ts` ani `supabase-fallback.ts` na nowy model.

## Dlaczego bez UI

UI finansĂłw teraz byĹ‚by przedwczesny. Najpierw trzeba mieÄ‡ jednÄ… prawdÄ™ domenowÄ…. Inaczej panel pokaĹĽe Ĺ‚adne cyfry, ale kaĹĽda karta bÄ™dzie liczyÄ‡ je inaczej. To jest ksiÄ™gowy goblin, nie feature.

## Minimalny przykĹ‚ad

```ts
const snapshot = buildFinanceSnapshot({
  contractValue: 10000,
  payments: [
    { type: 'deposit', status: 'paid', amount: 2500 },
    { type: 'commission', status: 'paid', amount: 500 },
  ],
  commission: {
    mode: 'percent',
    base: 'contract_value',
    rate: 10,
  },
});

snapshot.contractValue; // 10000
snapshot.paidAmount; // 2500
snapshot.remainingAmount; // 7500
snapshot.commissionAmount; // 1000
snapshot.commissionPaidAmount; // 500
snapshot.commissionRemainingAmount; // 500
```

## Kryterium zakoĹ„czenia FIN-1

FIN-1 jest zakoĹ„czony, gdy:

1. istniejÄ… trzy pliki `src/lib/finance/*`,
2. typy minimum sÄ… zdefiniowane w jednym miejscu,
3. funkcje obliczeniowe istniejÄ…,
4. dokument mĂłwi, ĹĽe nie tworzymy UI ani migracji DB,
5. check przechodzi,
6. build przechodzi.
