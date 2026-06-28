# LF-UI-SOT-002 - Guard na plastry UI

Status: DONE / GUARD_ADDED / NO_UI_REFACTOR
Date: 2026-06-27 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch checked: dev-rollout-freeze
Scope: guard przeciw dokladaniu kolejnych runtime/CSS/UI plastrow

## LF-UI-SOT-002R2 - UI patch guard widening policy

Status: IMPLEMENTED_IN_REPO / GUARD_WIDENED / NO_UI_REFACTOR / NEEDS_LOCAL_VERIFY
Date: 2026-06-28 01:35 Europe/Warsaw

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

- `RAW_PAGE_BUTTON_ALLOWLIST` - nowe surowe `<button>` w `src/pages` poza jawna allowlista;
- `LUCIDE_REACT_IMPORT_ALLOWLIST` - nowe bezposrednie importy z `lucide-react`;
- `APP_STYLES_IMPORT_MAX` - nowe globalne importy CSS w `src/App.tsx` ponad baseline;
- `LOCAL_ICON_BUTTON_CLONE_ALLOWLIST` - lokalne `IconButton` / `ActionIcon` / podobne klony;
- `LOCAL_COLOR_MAP_ALLOWLIST` - lokalne mapy status/badge/priority color/tone;
- `ROUTE_LITERAL_ALLOWLIST` - reczne route literals dla case/lead/client tam, gdzie powinny isc helpery;
- szerszy kontrakt na `display:none` / `z-index` / `!important` jako workaround.

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

Do uruchomienia lokalnie:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Status po R2

```txt
LF-UI-SOT-002:
DONE / GUARD_ADDED / BASELINE_PROTECTS_AGAINST_SOME_PATCHES

LF-UI-SOT-002R2:
IMPLEMENTED_IN_REPO / POSZERZENIE_GUARDA / BEZ_UI_REFACTORU / NEEDS_LOCAL_VERIFY
```

## Ryzyko

`verify:closeflow:quiet` moze nadal byc czerwony lokalnie przez dirty workspace spoza tego etapu. Tego nie mieszac z R2.

## Zapis

- data i godzina: 2026-06-28 01:35 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- files touched:
  - `scripts/check-ui-patch-layers.cjs`
  - `tests/ui-patch-layers-guard.test.cjs`
  - `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md`
- runtime UI: nietkniete
- CSS/layout: nietkniete
- SQL/API/Supabase: nietkniete
- Obsidian: wymaga wpisu centralnego w vault
