# CloseFlow Leads + TasksStable status contract Stage13 - 2026-05-08

## Cel

Etap 13 porzadkuje jednoznaczne lokalne kolory status/progress w Leads i TasksStable, bez przebudowy ekranow i bez zmiany logiki ladowania, filtrowania, edycji, usuwania, follow-upow, statusow ani done/restore.

## Klasyfikacja

### Leads

- Sklasyfikowane lokalne miejsca red/rose/amber: 3
- STATUS_OPTIONS: cieple klasy statusowe zostaly przeniesione do pola tone.
- Kafel Zagrozone: metric tile, nie status wiersza.

### TasksStable

- Sklasyfikowane lokalne miejsca red/rose/amber: 1
- Status Zalegle w badge zadania: status/progress, nie osobny alert panel.

## Co przepieto

- Leads: metadata statusow uzywa tone zamiast lokalnych color bg/text.
- Leads: kafel Zagrozone uzywa StatShortcutCard tone risk.
- TasksStable: status zadania uzywa cf-status-pill + data-cf-status-tone.

## Liczby

- Leads red/rose/amber sklasyfikowane: 3
- TasksStable red/rose/amber sklasyfikowane: 1
- Przepiete na status/progress: 4
- Przepiete na alert/severity: 0

## Wyjatki

- Leads akcje kosza i przywracania zostaja akcjami UI, nie statusem/progressem.
- Leads lista nie dostaje sztucznego nowego badge tylko po to, aby zaspokoic guard; status metadata jest gotowa do kontraktu bez przebudowy listy.
- TasksStable kafel Zalegle zostaje w StatShortcutCard tone red, bo ton metryk kontroluje osobny kontrakt.

## Co zostaje na Etap 14

Etap 14 powinien objac TodayStable status/severity pass jako osobny maly zakres. Today.tsx zostawic na osobny etap, bo ma duzo legacy alert/status powierzchni i wieksze ryzyko regresji.
