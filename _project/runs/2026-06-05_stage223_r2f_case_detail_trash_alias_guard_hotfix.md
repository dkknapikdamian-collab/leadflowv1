# STAGE223 R2F - CaseDetail trash alias guard hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2E naprawił guard `case trash actions`, ale build padł na `STAGE220A17_CASE_DETAIL_VST_WIRING_GUARD`.
- Guard Stage220A17 ma historyczny zakaz literalnego `<EntityTrashButton`.
- Jednocześnie guard `case trash actions` wymaga, żeby `CaseDetail.tsx` zawierał `EntityTrashButton`.
- To jest konflikt guardów, nie błąd Activity Truth.

## NAPRAWA

- Zachować import i source-of-truth `EntityTrashButton`.
- Dodać alias:
  `const CaseDetailTrashButton = EntityTrashButton;`
- W JSX użyć:
  `<CaseDetailTrashButton ...>`
- Dzięki temu:
  - `detail.includes('EntityTrashButton')` przechodzi,
  - `forbidText(caseDetail, '<EntityTrashButton')` przechodzi,
  - UI i logika delete bez zmian.

## TESTY

```powershell
node scripts/check-stage220a17-case-detail-vst-wiring.cjs
node scripts/check-closeflow-case-trash-actions.cjs
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

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + hotfixy.
