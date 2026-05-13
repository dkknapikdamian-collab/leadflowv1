# CloseFlow - CaseDetail history visual P1 - 2026-05-13

## Zgloszenie

- Historia sprawy miala dwa rozne style wizualne w jednej zakladce.
- Pod Szybkimi akcjami sprawy byl opis: Dodaj operacyjny ruch bez starego kafelka formularza.

## Decyzja

Nie przebudowujemy CaseDetail. To jest poprawka wizualnego source of truth:

- usuwamy opis spod Szybkich akcji,
- wymuszamy kompaktowy ledger-style dla historii sprawy w sekcji z data-case-history-summary.

## Zmienione pliki

- src/components/CaseQuickActions.tsx
- src/styles/closeflow-case-history-visual-source-truth.css
- scripts/check-p1-case-detail-history-quick-actions-visual-2026-05-13.cjs
- tests/p1-case-detail-history-quick-actions-visual-2026-05-13.test.cjs
- scripts/closeflow-release-check-quiet.cjs

## Weryfikacja

- node scripts/check-p1-case-detail-history-quick-actions-visual-2026-05-13.cjs
- node --test tests/p1-case-detail-history-quick-actions-visual-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet