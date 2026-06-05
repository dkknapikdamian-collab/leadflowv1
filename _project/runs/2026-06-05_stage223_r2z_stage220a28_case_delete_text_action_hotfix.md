# STAGE223 R2Z - Stage220A28 case delete text action hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2Y:
  - Stage220A20 OK,
  - mass scan 178 testów OK.
- Build zatrzymał się na:
  `scripts/check-stage220a28-modal-focus-trash.cjs`
- Fail:
  `old text delete action removed forbidden: cf-case-row-delete-text-action`
- Guard Stage220A28 wymaga w `Cases.tsx`:
  - `STAGE220A28_CASE_ROW_ACTIONS_SOURCE_TRUTH`,
  - `data-stage220a28-case-row-open-icon="true"`,
  - `data-stage220a28-case-row-delete-icon="true"`,
  - `cf-case-row-actions-stage220a28`,
  - brak `cf-case-row-delete-text-action`.
- Stage95 wymaga:
  - `EntityTrashButton`,
  - `data-cf-destructive-source="trash-action-source"`,
  - `trashActionIconClass("h-4 w-4")`.

## ZAKRES

- Dotknąć:
  - `src/pages/Cases.tsx`,
  - centralne `_project/*` memory files,
  - `_project/runs`,
  - `_project/obsidian_updates`.
- Usunąć wszystkie wystąpienia:
  `cf-case-row-delete-text-action`
- Zachować:
  - `EntityTrashButton`,
  - `data-case-row-delete-action="true"`,
  - `data-cf-destructive-source="trash-action-source"`,
  - `trashActionIconClass("h-4 w-4")`.
- Nie zmieniać Stage223, Calendar, Today, Supabase, daily digest ani `/api/activities`.

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

- Po deployu ręcznie sprawdzić listę spraw i akcję usuwania/przenoszenia do kosza.
- Nie dodawać zakazanego tekstu nawet jako komentarza, bo Stage220A28 działa po zwykłym `text.includes`.

## NASTĘPNY KROK

Jeśli `build`, `verify:closeflow:quiet` i `git diff --check` przejdą, wykonać push całego Stage223.
