# STAGE223 R2D - Case trash release gate hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- Stage223 R2C:
  - Stage113 test OK
  - Stage223 guard OK
  - Stage223 runtime tests 3/3 OK
  - Stage222 guard OK
  - Stage222 node tests 3/3 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na `case trash actions`.
- Błąd: `Brak ikony kosza przy sprawie na liście`.
- Guard `scripts/check-closeflow-case-trash-actions.cjs` wymaga literalnie:
  - `EntityTrashButton`
  - `data-case-row-delete-action="true"`
  - `setCaseToDelete(record)`
  - `ConfirmDialog`
  - `deleteCaseWithRelations`
- W `Cases.tsx` kosz istnieje, ale ma marker `data-stage220a28-case-row-delete-icon="true"`, nie marker wymagany przez guard.

## ZAKRES

- Dodać do `EntityTrashButton` w `src/pages/Cases.tsx`:
  `data-case-row-delete-action="true"`
- Nie zmieniać UI.
- Nie zmieniać logiki usuwania.
- Nie zmieniać Activity Truth.
- Nie zmieniać release gate.

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

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D.
