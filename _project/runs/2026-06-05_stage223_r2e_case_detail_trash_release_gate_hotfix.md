# STAGE223 R2E - CaseDetail trash release gate hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2D naprawił marker kosza na liście spraw.
- Guard `case trash actions` przeszedł dalej i zatrzymał się na:
  `Szczegół sprawy nie używa EntityTrashButton`.
- `scripts/check-closeflow-case-trash-actions.cjs` wymaga:
  - `CaseDetail.tsx` zawiera `EntityTrashButton`,
  - `data-case-detail-delete-action="true"`,
  - `data-case-detail-delete-confirm="true"`,
  - `deleteCaseWithRelations`,
  - `navigate('/cases')`.
- `CaseDetail.tsx` miał zwykły `Button` z markerem delete, ale nie wspólny `EntityTrashButton`.

## ZAKRES

- Zmienić delete button w `src/pages/CaseDetail.tsx` z `Button` na `EntityTrashButton`.
- Dodać import `EntityTrashButton` i `trashActionIconClass`.
- Zachować:
  - `data-case-detail-delete-action="true"`,
  - stare stage markery,
  - `deleteCaseWithRelations`,
  - confirm dialog,
  - `navigate('/cases')`.
- Nie zmieniać UI intencjonalnie.
- Nie zmieniać Activity Truth.

## TESTY

```powershell
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

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B/R2C/R2D/R2E.
