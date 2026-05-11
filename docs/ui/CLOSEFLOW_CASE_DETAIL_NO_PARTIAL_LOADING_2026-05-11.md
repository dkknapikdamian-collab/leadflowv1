# CloseFlow — Case Detail no partial loading — 2026-05-11

## Problem

Podczas przejścia z kartoteki klienta do sprawy użytkownik widział częściowo załadowany panel sprawy: finanse, przyciski płatności i wartości domyślne typu `0 PLN`, a pod spodem stan `Ładowanie sprawy...`.

To jest błąd UX, bo wygląda jak uszkodzone dane albo niedokończony ekran.

## Decyzja

`CaseDetail` nie może renderować paneli biznesowych, dopóki trwa ładowanie rekordu sprawy.

## Zakres poprawki

W zakresie:

- `src/pages/CaseDetail.tsx`,
- neutralny loading state,
- guard przed głównym renderem sprawy,
- test regresyjny.

Poza zakresem:

- logika finansów,
- liczenie prowizji,
- model płatności,
- flow lead -> klient -> sprawa,
- redesign CaseDetail,
- przebudowa routingu.

## Kryterium zakończenia

W trakcie ładowania sprawy niedozwolone są:

- `FIN-5`,
- `Dodaj wpłatę`,
- `Dodaj płatność prowizji`,
- `Edytuj prowizję`,
- `0 PLN` jako tymczasowe dane,
- puste panele płatności.

Dozwolone są:

- czysty loader,
- skeleton bez danych biznesowych,
- pełna sprawa dopiero po załadowaniu.
