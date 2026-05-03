# CloseFlow Stage02B — CaseDetail write access gate

Data: 2026-05-03
Branch: dev-rollout-freeze

## Cel

Zamknąć jedyny warning z Stage02A: `src/pages/CaseDetail.tsx` nie miał jawnego śladu access/workspace gate.

## Zakres

Dodano jawny gate w `CaseDetail`:

- `useWorkspace()`,
- `hasAccess`,
- `access.status`,
- lokalny `guardCaseDetailWriteAccess()`,
- blokada operacji zapisujących po braku dostępu,
- komunikat dla `trial_expired`: dane zostają do podglądu, ale nowe akcje są zablokowane.

## Ważne

Odczyt sprawy zostaje dostępny. Ten etap blokuje wyłącznie akcje operatora, które tworzą lub zmieniają dane sprawy.

## Weryfikacja

- `node tests/case-detail-write-access-gate-stage02b.test.cjs`
- `npm.cmd run check:access-billing-source-of-truth-stage02a`
- `npm.cmd run verify:closeflow:quiet`
