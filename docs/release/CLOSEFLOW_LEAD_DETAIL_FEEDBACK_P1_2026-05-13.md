# CloseFlow — Lead Detail feedback P1 — 2026-05-13

## Cel

Naprawa zgłoszeń z eksportu admin feedback dla widoku szczegółów leada:

- usunięcie hałaśliwego kafelka AI wsparcia / centrum pracy leada z prawej kolumny,
- usunięcie nadmiarowego kafelka statusowego „Lead aktywny”,
- podpięcie historii kontaktu pod wspólny formatter activity timeline,
- wymuszenie, żeby historia pokazywała konkretną treść: notatkę, zadanie, wydarzenie, status albo kwotę wpłaty.

## Zmienione pliki

- `src/pages/LeadDetail.tsx`
- `src/lib/activity-timeline.ts`
- `scripts/check-lead-detail-feedback-p1-2026-05-13.cjs`
- `tests/lead-detail-feedback-p1-2026-05-13.test.cjs`
- `package.json`

## Weryfikacja

`npm.cmd run check:lead-detail-feedback-p1`
`npm.cmd run test:lead-detail-feedback-p1`
`npm.cmd run lint`
`npm.cmd run build`
`npm.cmd run verify:closeflow:quiet`

## Ręczny smoke test

1. Wejść na dowolny `/leads/:id`.
2. Sprawdzić, że prawa kolumna nie zawiera kafelków „AI wsparcie / Centrum pracy leada” ani „Lead aktywny”.
3. Dodać notatkę do leada.
4. Dodać zadanie i wydarzenie powiązane z leadem.
5. Zmienić status leada.
6. Sprawdzić, czy historia pokazuje konkretne treści, a nie pusty opis typu „Aktywność”.

## Ryzyko

Jeżeli lokalny plik `LeadDetail.tsx` różni się istotnie od brancha `dev-rollout-freeze`, patch przerwie pracę zamiast maskować problem.
