# CloseFlow / LeadFlow - Stage223 R2Q Daily digest API contract hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / daily digest API contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2Q Daily digest API contract hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2Q_DAILY_DIGEST_API_CONTRACT_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Quiet release gate blokuje `daily-digest-email-runtime.test.cjs`.
- Brakuje `api/daily-digest.ts`.
- Canonical runtime istnieje jako `src/server/daily-digest-handler.ts`.
- R2Q dodaje wrapper `api/daily-digest.ts`, który deleguje do canonical handlera.

## DECYZJE

- Nie wyłączać daily digest testu.
- Nie zmieniać crona w `vercel.json`.
- Nie duplikować prawdziwej logiki wysyłki.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/daily-digest-email-runtime.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
