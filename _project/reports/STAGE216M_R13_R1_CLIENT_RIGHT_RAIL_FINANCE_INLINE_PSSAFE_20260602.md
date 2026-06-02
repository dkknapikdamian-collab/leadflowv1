# STAGE216M-R13-R1 Client right rail finance inline PS-safe repair

## Cel
Naprawić aplikator R13 po błędzie parsera PowerShell i wdrożyć widoczne finanse klienta jako mini-kafelek wewnątrz karty `Główna sprawa`.

## Fakty
- R12 przeszedł technicznie, ale UI dalej nie pokazywał finansów klienta stabilnie po prawej stronie.
- R13 pierwsza paczka miała błąd ścieżki, a druga błąd parsera PowerShell przez niepoprawne escapowanie `\"true\"` w stringach.

## Zakres
- `ClientDetail.tsx`: usunięcie zbędnych opisów i wstawienie inline card finansów do widocznej karty głównej sprawy.
- CSS R13: styl mini-kafelka finansów i defensywne ukrycie starego duplikatu.
- Guard R13-R1: sprawdza marker inline card, brak starych tekstów i import CSS.

## Czego nie ruszano
API, Supabase, backend płatności, dane, Stage216D.

## Testy
- `node tests/stage216m-r13-r1-client-right-rail-finance-inline-pssafe-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Next step
Po deployu sprawdzić prawą szynę ClientDetail: finanse klienta powinny być widoczne w karcie `Główna sprawa`.
