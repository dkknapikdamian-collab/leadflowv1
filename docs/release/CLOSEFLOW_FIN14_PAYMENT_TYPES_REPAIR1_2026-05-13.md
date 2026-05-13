# CloseFlow FIN-14 REPAIR1 — payment types and red gate cleanup

Data: 2026-05-13  
Branch: `dev-rollout-freeze`

## Cel

Naprawa FIN-14 po uruchomieniu paczki, która lokalnie przygotowała część zmian, ale nie dodała ich do commita.

## Naprawia

- brakujący plik `src/components/finance/CaseFinancePaymentDialog.tsx`,
- mapowanie przycisków:
  - `Dodaj zaliczkę` -> `deposit`,
  - `Dodaj wpłatę` -> `partial`,
  - `Dodaj płatność prowizji` -> `commission`,
- etykiety listy płatności:
  - `Wpłata klienta`,
  - `Zaliczka`,
  - `Prowizja`,
- czerwony test `cases-page-helper-copy-cleanup.test.cjs`, który nadal oczekiwał starego lokalnego `<h1>` zamiast aktualnego headera V2,
- czerwony guard PWA, jeśli w service workerze brakuje jawnego `url.pathname.startsWith('/api/')`.

## Ważna reguła

Płatność prowizji nie zwiększa `Wpłacono od klienta`. Zmienia tylko `Prowizja opłacona` i `Prowizja do zapłaty`.
