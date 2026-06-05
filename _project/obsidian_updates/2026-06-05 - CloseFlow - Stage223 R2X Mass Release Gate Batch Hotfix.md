# CloseFlow / LeadFlow - Stage223 R2X Mass release gate batch hotfix

Data: 2026-06-05
Typ wpisu: batch hotfix / release gate mass sweep
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2X Mass release gate batch hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2W mass scan wykazał 14 failing gates.
- R2X naprawia je batchowo:
  - Today mutation bus,
  - Calendar week-plan/modal/hard-refresh/CSS,
  - Dialog accessibility,
  - LeadDetail section copy,
  - Cases trash source truth,
  - Leads right rail width,
  - activities system route.

## DECYZJE

- Nie wyłączać testów.
- Nie pushować bez zielonego `verify:closeflow:quiet`.
- Kolejne faile naprawiać batchowo, nie pojedynczo.

## TESTY

```powershell
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Calendar i delete actions wymagają ręcznego obejrzenia po deployu.
- `/api/activities` wymaga ręcznego testu notatek/aktywności.
- Dialogi z `aria-describedby={undefined}` są technicznie poprawnym escape, ale docelowo lepiej dodać prawdziwe opisy.

## NASTĘPNY KROK

Uruchomić R2X i wkleić raport mass scan, jeśli zostaną faile.
