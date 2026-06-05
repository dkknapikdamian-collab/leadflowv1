# CloseFlow / LeadFlow - Stage223 R2G Stage98 mojibake release gate hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / mojibake hard gate
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2G Stage98 mojibake release gate hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Stage223 R2F jest zielony do builda.
- Quiet verify blokuje Stage98 mojibake hard gate.
- R2G usuwa BOM i normalizuje mojibake w `src/tests/scripts`.
- Literalne złe znaki w guardach/testach są zamieniane na unicode escapes, żeby guardy dalej mogły opisywać zakazane znaki.

## DECYZJE

- Nie wyłączać Stage98.
- Nie obchodzić release gate.
- Nie robić push bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
