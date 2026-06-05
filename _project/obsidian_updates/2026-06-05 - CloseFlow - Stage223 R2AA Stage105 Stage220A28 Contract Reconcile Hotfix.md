# CloseFlow / LeadFlow - Stage223 R2AA Stage105/Stage220A28 contract reconcile hotfix

Data: 2026-06-05
Typ wpisu: release gate conflict resolution / test contract update
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2AA Stage105/Stage220A28 contract reconcile hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Stage105 i Stage220A28 mają sprzeczny wymóg wobec `cf-case-row-delete-text-action`.
- Stage220A28 to nowszy prebuild guard i zakazuje starej tekstowej akcji.
- R2AA aktualizuje Stage105 do canonical trash action contract.

## DECYZJE

- Nie przywracać `cf-case-row-delete-text-action`.
- Nie oszukiwać stringiem w komentarzu.
- Zaktualizować stary test, bo wymuszał zakazany token.
- Nie pushować bez zielonego build/verify/diff.

## TESTY

```powershell
node --test tests/stage105-calendar-modal-no-dark-inputs.test.cjs
node scripts/check-stage220a28-modal-focus-trash.cjs
node --test tests/stage95-destructive-action-visual-source.test.cjs
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Zmiana testu musi być traktowana jako rozwiązanie sprzeczności kontraktów, nie jako omijanie quality gate.
- Po deployu sprawdzić Cases delete UI.
