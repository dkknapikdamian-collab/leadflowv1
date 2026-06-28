# LF-UI-SOT-002 - Guard na plastry UI

Status: DONE / GUARD_ADDED / NO_UI_REFACTOR
Date: 2026-06-27 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch checked: dev-rollout-freeze
Scope: guard przeciw dokladaniu kolejnych runtime/CSS/UI plastrow

## LF-UI-SOT-002R2 - UI patch guard widening policy

Status: LOCAL_R2_VERIFY_PASS / GUARD_PASS / TEST_PASS / ROUTES_GUARD_PASS / BUILD_PASS / VERIFY_QUIET_BLOCKED_BY_UNRELATED_DIRTY_WORKSPACE
Date: 2026-06-28 02:30 Europe/Warsaw

## Decyzja R2

Jezeli przy weryfikacji etapu pojawia sie proba plastra UI, nie wdrazac dalej.
Najpierw poszerzyc istniejacy guard, zeby ten typ plastra byl lapany automatycznie.
Nie tworzyc drugiego guarda obok starego.

Existing guard:

```txt
scripts/check-ui-patch-layers.cjs
tests/ui-patch-layers-guard.test.cjs
```

## Co R2 dodaje do guarda

Guard nadal blokuje stare kontrakty:

- `querySelector` / `querySelectorAll` runtime UI patches;
- `replaceChildren` DOM rewrites;
- inline style na action/icon/delete controls;
- inline `display:none` / `z-index` workarounds;
- lokalne delete button/action components;
- direct `Trash2`;
- nowe stacked `stage` / `source-truth` CSS imports;
- nowe `stage` / `source-truth` className usage.

R2 rozszerza polityke o:

- `RAW_BUTTON_ALLOWLIST` - nowe surowe `<button>` w `src/pages` i `src/components` poza jawna allowlista;
- `LUCIDE_REACT_IMPORT_ALLOWLIST` - nowe bezposrednie importy z `lucide-react`;
- `APP_STYLES_IMPORT_MAX` - nowe globalne importy CSS w `src/App.tsx` ponad baseline;
- `LOCAL_ICON_BUTTON_CLONE_ALLOWLIST` - lokalne `IconButton` / `ActionIcon` / `ActionButton` / `DangerButton` clones;
- `LOCAL_COLOR_MAP_ALLOWLIST` - lokalne mapy status/badge/priority color/tone oraz label helpers;
- `ROUTE_LITERAL_ALLOWLIST` - reczne route literals dla case/lead/client tam, gdzie powinny isc helpery;
- broad inline `style={{` w pages/components;
- `CSS_SCAN_ROOTS` / `CSS_PATCH_ALLOWLIST` - skan plikow `.css` pod `display:none`, `z-index`, `!important`, `position: fixed`, `position: absolute`;
- szerszy kontrakt na `display:none` / `z-index` / `!important` jako workaround.

## Wynik lokalny po ostatniej poprawce baseline

Damian odpalil lokalnie po `git pull --ff-only origin dev-rollout-freeze`:

```txt
npm run guard:ui:patch-layers: PASS
node --test tests/ui-patch-layers-guard.test.cjs: PASS 5/5
npm run guard:routes:canonical: PASS
npm run build: PASS
npm run verify:closeflow:quiet: RED przez unrelated dirty workspace CF-RUNTIME-00
git diff --check: tylko LF/CRLF warnings w src/lib/cases.ts i src/lib/options.ts
```

Known debt po zielonym guardzie:

```txt
domPatchFiles: 16
directTrash2Files: 15
styleLayerFiles: 32
stageClassFiles: 35
rawButtonFiles: 40
lucideImportFiles: 56
inlineStyleFiles: 12
displayStackImportantFiles: 8
cssPatchFiles: 238
appStyleImportFiles: 0
localIconButtonCloneFiles: 5
localColorMapFiles: 0
routeLiteralFiles: 9
```

## Interpretacja allowlist

Allowlisty nie sa zgoda na nowe plastry.
One zamrazaja istniejacy dlug, zeby guard przeszedl na obecnym baseline i blokowal nowe miejsca/patterny.

Zwiekszenie allowlisty wymaga osobnego wpisu etapu i uzasadnienia.

## Czego nie zrobiono w R2

- nie usunieto starego dlugu UI;
- nie refaktorowano UI;
- nie poprawiano wygladu;
- nie dodano CSS;
- nie ruszono runtime UI, SQL, API, Supabase/Firebase.

## Komendy verify

Etap R2 technicznie przeszedl guard/test/build. Full `verify:closeflow:quiet` zostaje zablokowany przez lokalne zmiany spoza zakresu.

Do kolejnego sprzatania lokalnego workspace:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git status --short --branch
git diff --name-only
git diff --stat
npm run verify:closeflow:quiet
```

## Status po R2

```txt
LF-UI-SOT-002:
DONE / GUARD_ADDED / BASELINE_PROTECTS_AGAINST_SOME_PATCHES

LF-UI-SOT-002R2:
LOCAL_R2_VERIFY_PASS / GUARD_PASS / TEST_PASS / ROUTES_GUARD_PASS / BUILD_PASS / VERIFY_QUIET_BLOCKED_BY_UNRELATED_DIRTY_WORKSPACE
```

## Ryzyko

`verify:closeflow:quiet` jest czerwony przez dirty workspace spoza tego etapu. Tego nie mieszac z R2.

Nastepny bezpieczny etap:

```txt
LF-LOCAL-DIRTY-WORKTREE-SEGREGATION
```

## Zapis

- data i godzina: 2026-06-28 02:30 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- files touched:
  - `scripts/check-ui-patch-layers.cjs`
  - `tests/ui-patch-layers-guard.test.cjs`
  - `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md`
  - `_project/runs/LF-UI-SOT-002R2_UI_PATCH_GUARD_WIDENING_POLICY.md`
  - `_project/obsidian_updates/2026-06-28_LF-UI-SOT-002R2_UI_PATCH_GUARD_WIDENING_POLICY.md`
- runtime UI: nietkniete
- CSS/layout: nietkniete
- SQL/API/Supabase: nietkniete
