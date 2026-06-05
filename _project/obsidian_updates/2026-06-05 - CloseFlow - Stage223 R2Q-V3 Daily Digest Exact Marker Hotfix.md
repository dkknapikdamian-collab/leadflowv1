# CloseFlow / LeadFlow - Stage223 R2Q-V3 Daily digest exact marker hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / daily digest exact marker
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2Q-V3 Daily digest exact marker hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2Q-V2 nie wykonał patcha przez błąd składni helpera.
- Test wymaga dokładnego nieescapowanego tokena `selfTestMode === 'workspace-test'`.
- R2Q-V3 dodaje dokładny token jako komentarz-kontrakt i zostawia wrapper delegujący do canonical handlera.

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
