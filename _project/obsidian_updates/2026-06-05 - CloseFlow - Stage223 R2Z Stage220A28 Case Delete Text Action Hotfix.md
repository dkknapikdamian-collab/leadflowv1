# CloseFlow / LeadFlow - Stage223 R2Z Stage220A28 case delete text action hotfix

Data: 2026-06-05
Typ wpisu: build guard hotfix / Stage220A28 forbidden token
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2Z Stage220A28 case delete text action hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2Z_STAGE220A28_CASE_DELETE_TEXT_ACTION_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2Y mass scan OK.
- Build padł na Stage220A28, bo w `Cases.tsx` został zakazany tekst starej akcji kasowania.
- R2Z usuwa zakazany tekst i zachowuje wspólne źródło `EntityTrashButton`.

## DECYZJE

- Nie cofać R2X/R2Y.
- Nie przywracać starej tekstowej akcji usuwania w wierszu spraw.
- Nie pushować bez zielonego build/verify/diff.

## TESTY

```powershell
node scripts/check-stage220a28-modal-focus-trash.cjs
node --test tests/stage95-destructive-action-visual-source.test.cjs
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Po deployu sprawdzić listę spraw: otwieranie, kosz/usuwanie, dialog potwierdzenia i styl akcji.
- Forbidden token nie może wrócić nawet w komentarzu.

## NASTĘPNY KROK

Po zielonym build/verify: push całego Stage223.
