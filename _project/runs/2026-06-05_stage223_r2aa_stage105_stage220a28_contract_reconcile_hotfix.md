# STAGE223 R2AA - Stage105 / Stage220A28 case delete contract reconcile hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2Z patcher zatrzymał się na własnym checku `btn ghost`, ale realne testy pokazały:
  - Stage220A28 OK,
  - Stage95 OK.
- Mass scan został z jednym błędem:
  `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`
- Przyczyna:
  Stage105 wymagał `className="cf-case-row-delete-text-action"`, ale Stage220A28 zabrania `cf-case-row-delete-text-action` w `Cases.tsx`.
- To jest sprzeczność kontraktów.

## ZAKRES

- Utrzymać w `Cases.tsx` zakaz `cf-case-row-delete-text-action`.
- Zachować w `Cases.tsx`:
  - `EntityTrashButton`,
  - `data-case-row-delete-action="true"`,
  - `data-cf-destructive-source="trash-action-source"`,
  - `trashActionIconClass("h-4 w-4")`,
  - Stage220A28 markers.
- Zaktualizować `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`, żeby sprawdzał obecny canonical contract zamiast starego forbidden tokena.

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

- Zmieniamy test, nie dlatego że test przeszkadza, tylko dlatego że stary Stage105 był sprzeczny z nowszym Stage220A28.
- Po deployu ręcznie sprawdzić `Cases`: ikona kosza, subtelny styl, dialog potwierdzenia.
