# CLOSEFLOW FIN-8 / ETAP 8 — poprawne finanse klienta

## Cel

Kafelek `Podsumowanie finansów` na karcie klienta ma pokazywać prawdziwe kwoty z jednego helpera domenowego, bez lokalnego zgadywania w UI.

## Decyzja produktu

Po ETAP7 klient może mieć `primaryCaseId`. Dlatego domyślna reguła finansów klienta jest taka:

1. Jeśli klient ma główną sprawę, kafelek finansów pokazuje finanse tej głównej sprawy.
2. Jeśli klient nie ma głównej sprawy, kafelek pokazuje sumę aktywnych spraw.
3. Górne kafelki klienta jako relacji pozostają globalne tam, gdzie opisują całą relację. Ten etap dotyczy tylko kafelka finansowego.

## Helper

Nowy helper:

```ts
calculateClientFinanceSummary(input: {
  client: unknown;
  cases: unknown[];
  payments: unknown[];
  mode?: 'primary_case_first' | 'all_active_cases';
})
```

Zwraca:

```ts
{
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  settlementsCount: number;
  source: 'primary_case' | 'all_active_cases' | 'all_cases';
}
```

## Reguły liczenia

- `totalValue`: wartość sprawy albo suma wartości aktywnych spraw.
- `paidValue`: suma realnych wpłat klienta ze statusami płatnymi, w tym `paid`, `confirmed`, `deposit_paid`, `partially_paid`, `fully_paid`.
- `remainingValue`: `max(totalValue - paidValue, 0)`.
- `settlementsCount`: liczba realnych opłaconych wpłat klienta, nie liczba losowych wpisów UI.

## Etykiety UI

Kafelek pokazuje:

- Wartość
- Opłacone
- Do domknięcia
- Rozliczenia

## Przykład kontrolny

Dane:

- Sprawa A: 20 625 PLN
- Wpłaty: 4 500 PLN i 3 500 PLN

Oczekiwane:

- Wartość: 20 625 PLN
- Opłacone: 8 000 PLN
- Do domknięcia: 12 625 PLN
- Rozliczenia: 2

## Zakres negatywny

Ten etap nie dodaje faktur, walut, cenników ani nowego modelu płatności. Nie zmienia `CaseDetail`, jeśli nie jest to konieczne.
