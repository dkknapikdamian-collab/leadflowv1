# STAGE223 R2C - Stage113 logo test release gate hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- Stage223 R2B:
  - Stage223 guard OK
  - Stage223 runtime tests 3/3 OK
  - Stage222 guard OK
  - Stage222 tests 3/3 OK
  - build OK
- `npm run verify:closeflow:quiet` padł na:
  `Missing required test: tests/stage113-closeflow-logo-source-contract.test.cjs`
- Quiet release gate wymaga tego pliku w `requiredTests`.
- Brak testu Stage113 jest release-gate blockerem niezależnym od Activity Truth.

## ZAKRES

- Dodać brakujący test:
  `tests/stage113-closeflow-logo-source-contract.test.cjs`
- Test sprawdza:
  - inline `brand-logo`,
  - tekst `CF`,
  - `<strong>CloseFlow</strong>`,
  - aria-label brandu,
  - brak zewnętrznych `logo.svg/logo.png/<img`.
- Nie zmieniać UI ani logiki aplikacji.

## TESTY

```powershell
node --test tests/stage113-closeflow-logo-source-contract.test.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, można zrobić jeden commit/push dla całego Stage223 R2 + R2B + R2C.
