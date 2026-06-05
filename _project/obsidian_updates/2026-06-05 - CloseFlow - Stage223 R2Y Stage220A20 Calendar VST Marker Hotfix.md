# CloseFlow / LeadFlow - Stage223 R2Y Stage220A20 Calendar VST marker hotfix

Data: 2026-06-05
Typ wpisu: build guard hotfix / compatibility marker
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2Y Stage220A20 Calendar VST marker hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2X mass scan OK.
- Build padł na Stage220A20 guard.
- R2Y dodaje wymagany literalny string poza `ScheduleEntryCard`, żeby nie złamać Stage100/104/99.

## DECYZJE

- Nie cofać R2X.
- Nie przywracać legacy combo do renderowanego week-plan card.
- Nie pushować bez zielonego build/verify/diff.

## TESTY

```powershell
node scripts/check-stage220a20-calendar-status-vst.cjs
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Marker nie zmienia UI, ale jest technicznym kompromisem między sprzecznymi starymi gate’ami.
- Po deployu obejrzeć `/calendar`.

## NASTĘPNY KROK

Po zielonym build/verify: push całego Stage223.
