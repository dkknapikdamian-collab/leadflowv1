# Stage28A — Case finance core

## Cel

Dodać pierwszy realny moduł finansów zgodnie z decyzją produktową:

- lead = potencjał,
- sprawa = prawdziwe rozliczenie,
- klient = agregat w kolejnym etapie.

## Zrobione

W `CaseDetail` dodano panel `Finanse sprawy`:

- wartość sprawy,
- wpłacono,
- pozostało,
- status płatności,
- pasek postępu,
- historia wpłat,
- przycisk `Dodaj wpłatę`.

Dodano dialog `Dodaj wpłatę do sprawy`:

- kwota,
- status,
- typ wpłaty,
- notatka,
- zapis przez `createPaymentInSupabase`,
- wpis w aktywnościach `payment_added`.

## Świadoma decyzja

Nie dodajemy pełnych finansów klienta w Stage28A. Klient ma być agregatem z danych spraw, więc najpierw sprawa musi być źródłem prawdy.

## Dodatkowo

Stage28A zawiera mały compatibility fix dla listenera notatek klienta, żeby nie budować finansów na runtime crashu `id is not defined`.
