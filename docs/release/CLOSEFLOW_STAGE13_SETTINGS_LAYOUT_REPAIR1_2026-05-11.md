# CloseFlow Stage 13 Settings layout repair1 2026-05-11

## Cel

Naprawa regresji po przebudowie `/settings` na taby.

Problem po Stage 13:
- header ustawien wygladal jak osobna karta i byl zbyt waski,
- cala sekcja ustawien wygladala jak rozjechana wyspa,
- prawy rail danych konta byl ciemny i malo czytelny,
- wartosci konta wygladaly jak puste pola albo byly slabo widoczne,
- data okresu planu byla pokazana jako surowy timestamp.

## Zakres

- przebudowa `src/pages/Settings.tsx` na bezpieczniejszy layout vnext repair1,
- zostawienie tabow: Plany, Konto, Bezpieczenstwo, Workspace, Powiadomienia, Integracje,
- zachowanie `Plany` jako domyslnej zakladki,
- usuniecie `right-card` z karty danych konta,
- nowy czytelny rail `Dane konta`,
- lepsze fallbacki dla Email / Workspace / Plan / Status,
- formatowanie daty okresu planu do `pl-PL`,
- mocniejsze CSS z jednym kontenerem i przewidywalna siatka 1fr + 320px.

## Poza zakresem

- brak zmian w billing API,
- brak zmian w auth,
- brak zmian w workspace backend,
- brak przenoszenia calego Billing do Settings,
- brak nowych funkcji bezpieczenstwa.

## Weryfikacja

- `npm.cmd run check:settings-tabs-layout`
- `npm.cmd run check:settings-layout-repair1`
- `npm.cmd run build`
