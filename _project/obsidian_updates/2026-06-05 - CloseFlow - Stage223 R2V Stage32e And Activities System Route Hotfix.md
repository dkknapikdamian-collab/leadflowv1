# CloseFlow / LeadFlow - Stage223 R2V Stage32e + activities system route hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / Stage32e + activities route consolidation
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2V Stage32e + activities system route hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2U przeszedł request identity i Vercel budget, ale jego helper zatrzymał się przed pełnym route `activities` w `api/system`.
- Quiet release gate blokuje `stage32e-relation-rail-copy-compat`.
- Brakuje literalnego `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `Leads.tsx`.
- R2V kończy route `/api/activities` przez `api/system?kind=activities` i dopina kontrakt Stage32e.

## DECYZJE

- Nie cofać `api/support.ts`.
- Nie przywracać `api/activities.ts` jako osobnej funkcji.
- Nie przywracać starego długiego copy w right rail.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/stage32e-relation-rail-copy-compat.test.cjs
node --test tests/request-identity-vercel-api-signature.test.cjs
node --test tests/vercel-hobby-function-budget.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Ryzyko: `/api/activities` zmienił fizyczny entrypoint. Po deployu sprawdzić notatki/aktywności w leadach, klientach i sprawach.
- Ryzyko: Stage32e wymusza literalny marker copy, który nie musi odpowiadać bieżącemu UI.

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
