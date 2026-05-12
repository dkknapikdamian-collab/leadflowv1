# CloseFlow FIN-11 — właściwy panel finansów w sprawie

Data: 2026-05-12  
Branch: `dev-rollout-freeze`

## Cel

FIN-11 naprawia właściwy, widoczny prawy panel sprawy: `section.right-card.case-detail-right-card` z `data-case-finance-panel="true"`.

W tym panelu pojawiają się akcje:

- `Edytuj wartość/prowizję`,
- `Dodaj wpłatę`,
- `Dodaj płatność prowizji`.

## Decyzja

Nie przenosimy tej logiki do leada i nie tworzymy osobnych finansów klienta. Wartość i konfiguracja prowizji są zapisywane na sprawie. Płatności są zapisywane jako rekordy `payments`.

## Modal

Tytuł:

```text
Wartość sprawy i prowizja
```

Pola:

- Wartość sprawy / transakcji,
- Waluta,
- Model prowizji: Brak / Procent od wartości / Kwota stała,
- Procent prowizji,
- Kwota prowizji,
- Status prowizji.

Podgląd:

- Prowizja należna,
- Po wpłatach klienta pozostaje,
- Do zapłaty prowizji.

## Weryfikacja

```powershell
npm.cmd run check:fin11
npm.cmd run test:fin11
npm.cmd run check:fin10
npm.cmd run test:fin10
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

## Manual smoke

1. Wejdź na `/cases/:id` lub `/case/:id`, jeśli route istnieje.
2. W prawym panelu `Rozliczenie sprawy` kliknij `Edytuj wartość/prowizję`.
3. Ustaw wartość sprawy `100000`, walutę `PLN`, prowizję `3%`.
4. Zapisz.
5. Odśwież stronę i sprawdź, czy wartość oraz prowizja zostały.
6. Dodaj wpłatę klienta.
7. Dodaj płatność prowizji.
8. Sprawdź, czy podsumowania liczą się z FIN-10 source.
