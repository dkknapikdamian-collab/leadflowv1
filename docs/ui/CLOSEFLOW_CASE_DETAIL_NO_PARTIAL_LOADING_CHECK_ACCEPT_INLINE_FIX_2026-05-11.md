# CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_ACCEPT_INLINE_FIX_2026-05-11

## Cel

Naprawia guard testowy po usunięciu błędnego bloku runtime z CaseDetail.

## Problem

Poprzedni check wymagał starego markera i dokładnego zwrotu `<CaseDetailLoadingState />`, mimo że runtime fix usunął błędny blok z niewłaściwego scope. To blokowało `verify:closeflow:quiet` pomimo poprawnego kierunku runtime.

## Zasada po poprawce

Check nie wymaga starego markera. Sprawdza realne warunki bezpieczeństwa:

- `loading` jest lokalnym stanem w `CaseDetail`,
- `if (loading)` występuje tylko w komponencie i przed głównym return JSX,
- loader nie renderuje paneli biznesowych, finansów, `0 PLN` ani akcji płatności,
- po głównym return nie istnieje drugie `if (loading)`, które mogłoby wypaść poza scope,
- `verify:closeflow:quiet` zachowuje oryginalny kontrakt w `package.json`.

## Ręczny test

Po deployu sprawdzić klient -> sprawa. Nie może być crasha `loading is not defined` i nie może mignąć częściowy panel finansów.
