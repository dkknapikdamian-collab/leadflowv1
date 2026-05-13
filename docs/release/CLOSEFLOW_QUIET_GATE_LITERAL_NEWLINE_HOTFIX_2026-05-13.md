# CloseFlow - Quiet gate literal newline hotfix - 2026-05-13

## Problem

Commit 811758f dopisal test do scripts/closeflow-release-check-quiet.cjs z literalnym tokenem \\n zamiast prawdziwego nowego wiersza.

Efekt: quiet gate przestal sie parsowac jako JavaScript.

## Naprawa

- literalny \\n zamieniony na prawdziwy nowy wiersz,
- entry tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs zostaje w requiredTests,
- dodany node --check przed verify, ĹĽeby taki bĹ‚Ä…d nie przeszedĹ‚ do commita.

## Weryfikacja

- node --check scripts/closeflow-release-check-quiet.cjs
- node scripts/check-case-detail-history-workrow-leak-fix-2026-05-13.cjs
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet