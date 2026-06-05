# CloseFlow / LeadFlow - Stage223 R2S Daily digest cron auth contract hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / daily digest cron auth contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2S Daily digest cron auth contract hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Quiet release gate blokuje `daily-digest-cron-auth.test.cjs`.
- Brakuje literalnego kontraktu `x-vercel-cron` w `api/daily-digest.ts`.
- R2S dodaje kontrakt cron auth i zostawia wrapper delegujący do canonical handlera.

## DECYZJE

- Nie wyłączać daily digest cron auth testu.
- Nie zmieniać crona w `vercel.json`.
- Nie duplikować prawdziwej logiki wysyłki.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/daily-digest-cron-auth.test.cjs
node --test tests/daily-digest-diagnostics.test.cjs
node --test tests/daily-digest-email-runtime.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
