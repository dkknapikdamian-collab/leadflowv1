# STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

Status: PASS_TECHNICAL_PUSH_READY / MANUAL_UI_REQUIRED
Date: 2026-06-14 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## R1B_CLOSEOUT_RUNTIME_REPAIR

This closeout fixes the gap left after `28dd373e`: the local `CaseDetail.tsx` finance editor path was patched, but the shared `src/components/finance/CaseFinanceEditorDialog.tsx` still treated contract value as percent-only transaction basis.

## Runtime repairs

1. Fake dictation remains disabled and honest: `Notatka głosowa — wkrótce`.
2. `nextAction` fallback remains task/event only; `missing` remains a blocker, not operational next action.
3. Payment modal copy remains honest: `Ostatnie 8 wpłat i korekt`.
4. Full case history uses sorted full `casePayments`, not the visible 8-row subset.
5. CaseFinanceEditorDialog shared finance path fixed:
   - contract value input is always editable,
   - fixed/none commission no longer zeroes `contractValue`,
   - fixed commission keeps `commissionAmount` separate from contract value,
   - none commission keeps `contractValue` and sets commission to zero.

## case_item source truth decision: two UI entries, one case_items contract

Decision for now: `Szybkie akcje -> Brak` and `Checklisty i braki -> Dodaj brak` may remain as two UI entries, but they must write to the same `case_items` contract. Required persisted fields: `caseId`, `title`, `description`, `type`, `status`, `isRequired`, `dueDate` when used, and ordering field when used. This remains guarded/documented, but deeper unification of UI flows is left for a dedicated R1C/R1D UX stage.

## Costs

cost lifecycle left as R1C. This stage does not claim edit/delete for costs. If add/list/edit/delete is incomplete, it must stay in `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` and become a separate runtime stage.

SQL: NOT_TOUCHED.

## Tests required

```powershell
node scripts/check-stage231h-r1-case-detail-function-mapping-audit.cjs
node --test tests/stage231h-r1-case-detail-function-mapping-audit.test.cjs
node scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs
node --test tests/stage231h-r1b-case-detail-runtime-repair.test.cjs
npm run build
git diff --check
```

## Manual test required before final product PASS

- ustaw wartość sprawy przy prowizji Brak -> refresh -> zostaje,
- ustaw wartość sprawy przy prowizji Kwota stała -> refresh -> zostaje,
- ustaw prowizję stałą -> wartość sprawy nie znika,
- ustaw prowizję procentową -> wartość sprawy liczy prowizję,
- dodaj case_item z description -> refresh -> description zostaje,
- zmień status case_item -> refresh -> status zostaje,
- dodaj koszt -> refresh -> koszt wpływa na summary,
- jeśli kosztu nie da się edytować/usunąć, zostaje R1C.

## Risk audit after stage

- Shared finance path was the real missing piece after R1B; guard now covers both `CaseDetail.tsx` and `CaseFinanceEditorDialog.tsx`.
- Two UI entries for case_item are accepted only as one storage contract, not as two different data models.
- Cost edit/delete is deliberately not claimed.
- Manual UI test still required before product-level closeout.
