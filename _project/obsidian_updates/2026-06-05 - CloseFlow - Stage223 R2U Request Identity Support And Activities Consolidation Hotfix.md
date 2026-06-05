# CloseFlow / LeadFlow - Stage223 R2U Request identity support + activities consolidation hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / request identity + Vercel Hobby function budget
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2U Request identity support + activities consolidation hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2U_REQUEST_IDENTITY_SUPPORT_AND_ACTIVITIES_CONSOLIDATION_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2T przeszedł Vercel Hobby function budget, ale usunięcie `api/support.ts` złamało request identity compatibility gate.
- R2U przywraca `api/support.ts`.
- Aby utrzymać limit 12 funkcji, R2U konsoliduje `api/activities.ts` do `src/server/activities-handler.ts` i `api/system?kind=activities`.

## DECYZJE

- Nie usuwać `api/daily-digest.ts`, bo testy daily digest czytają go bezpośrednio.
- Nie zostawiać 13 funkcji API.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/request-identity-vercel-api-signature.test.cjs
node --test tests/vercel-hobby-function-budget.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Ryzyko: `/api/activities` przechodzi przez rewrite do `api/system`. Po deployu sprawdzić dodawanie/odczyt aktywności.
- Ryzyko: stary gate wymusza istnienie `api/support.ts`, mimo że runtime ma rewrite do system route.

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
