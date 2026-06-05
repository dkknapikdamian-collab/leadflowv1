# CloseFlow / LeadFlow - Stage223 R2AB Calendar delete button JSX syntax hotfix

Data: 2026-06-05
Typ wpisu: build syntax hotfix / Calendar delete button
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2AB Calendar delete button JSX syntax hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2AA mass scan OK.
- Build padł na błędzie składni w `Calendar.tsx`.
- R2AB naprawia `onClick` w delete buttonie i zachowuje `data-cf-destructive-source`.

## DECYZJE

- Nie cofać wcześniejszych batch hotfixów.
- Nie usuwać trash source markerów.
- Nie pushować bez zielonego build/verify/diff.

## TESTY

```powershell
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Po deployu sprawdzić usuwanie wpisów w Calendar.

## NASTĘPNY KROK

Po zielonym build/verify: push całego Stage223.
