# CloseFlow - CaseDetail history visual P1 Repair4 - 2026-05-13

## Powod

Repair3 doszedl do builda, ale verify:closeflow:quiet wywrocil sie na natywnym crashu Windows/Node:
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), src/win/async.c.

Build przed verify przeszedl, wiec to nie byl blad TSX/CSS, tylko sposob uruchamiania production build wewnatrz quiet gate przez npm.cmd z Node.

## Naprawa

- CaseDetail history fix zostaje.
- Quiet gate uruchamia production build przez scripts/closeflow-vite-build-runner.mjs.
- Usunieto zaleznosc od nested npm.cmd run build w closeflow-release-check-quiet.cjs.
- Dodano guard i test.

## Weryfikacja

- node scripts/check-case-detail-history-visual-p1-repair4-2026-05-13.cjs
- node --test tests/case-detail-history-visual-p1-repair4-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
