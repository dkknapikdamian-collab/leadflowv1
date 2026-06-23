# STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME

Data: 2026-06-23 13:35 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel
Naprawić Vercel TypeScript blocker w `api/work-items.ts` po R1E:

- TS2339: `blocksProgress` on narrowed object type.
- TS2304: bare `existing` identifier.

## Zakres
- `api/work-items.ts`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- guard/test/run report/Obsidian payload
- centralne pliki `_project` i `00_START`

## Testy
- `node scripts/check-stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.cjs`
- `node --test tests/stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npx tsc --noEmit --pretty false`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Ryzyka
Vite build nie jest wystarczającym odpowiednikiem Vercel/API TypeScript check. R2 wymusza `tsc --noEmit` przed pushem.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R3_ALLOWLIST_RESUME
- Data: 2026-06-23 14:25 Europe/Warsaw
- Cel: naprawa CF_RUNTIME_00 allowlist po R1E1/R2, bez zmiany zakresu funkcjonalnego.
- Powód: R2 naprawił api/work-items.ts, ale guard zakresu nie znał wszystkich plików hotfixu.
- Wymagane testy: R2 guard/test, CF_RUNTIME_00, tsc --noEmit, build, verify, diff-check.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R6_COMPLEX_BLOCKSPROGRESS_RESUME
- Data: 2026-06-23 17:25 Europe/Warsaw
- Cel: domknięcie R1E1 po R5: naprawa pozostałego złożonego odczytu .blocksProgress w api/work-items.ts.
- Zakres: api/work-items.ts + dopisek walidacyjny w istniejących raportach R2.
- Test: R1E1 R2 guard/test, CF_RUNTIME_00, scoped TypeScript noEmit, build, verify:closeflow:quiet, diff-check.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R7_SYNTAX_REPAIR_RESUME
- Data: 2026-06-23 17:35 Europe/Warsaw
- Cel: naprawa składni po R6, gdzie marker R6 został błędnie wstawiony w deklarację markera R2 w api/work-items.ts.
- Zakres: api/work-items.ts + dopisek walidacyjny w istniejących raportach R2.
- Test: R1E1 R2 guard/test, CF_RUNTIME_00, scoped TypeScript noEmit, build, verify:closeflow:quiet, diff-check.
