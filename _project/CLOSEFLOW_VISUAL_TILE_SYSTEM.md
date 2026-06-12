# CloseFlow Visual Tile System

Status:
ACTIVE SOURCE OF TRUTH

Stage:
STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS

Created:
2026-06-12 20:10 Europe/Warsaw

Baseline:
STAGE231D0F-R13 — Funnel visual color density

Canonical component:
CloseFlowMetricTileV2

Derived from:
FunnelMetricTileR13

## Decyzja Damiana

Lejek po STAGE231D0F-R13 jest wizualnie zaakceptowany i zamrożony jako najlepszy wzorzec kafelków w aplikacji.

Nie przepinać innych widoków lokalnymi patchami bez mapy. Najpierw atlas, potem fale migracji.

## CloseFlowMetricTileV2 — zasady

- subtle color side/surface accent,
- color icon,
- color value,
- semantic tone map,
- no rainbow,
- no local per-page hex patches,
- filters use SharedFilterStrip,
- record cards use RecordListCard,
- right rails use RightRailCard,
- finance uses FinanceMetricTile / CaseSettlementRailCardLean.

## CloseFlowMetricToneMap

blue:
ruch, aktywne, lead, informacja, etap

amber:
brak kroku, oczekiwanie, blokada, do decyzji

purple:
sprawa, historia, cisza, operacja

red:
ryzyko, zagrożenie, zaległość, usunięcie

green:
pieniądze, prowizja, wpłata, sukces

neutral:
dane kontekstowe, liczniki pomocnicze

## Source truth files

- `src/styles/closeflow-metric-tiles.css`
- `src/styles/closeflow-record-list-source-truth.css`
- `src/styles/closeflow-right-rail-source-truth.css`
- `src/styles/closeflow-modal-visual-system.css`
- `_project/UI_DICTIONARY_STAGE231D0A.md`
- `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`
- `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`

## Frozen baseline

FunnelMetricTileR13:
- source page: `src/pages/SalesFunnel.tsx`
- source CSS: `src/styles/closeflow-metric-tiles.css`
- layout CSS: `src/styles/sales-funnel-stage231d0f-visual-alignment.css`
- tones: blue / amber / purple / red / green
- key data attrs: `data-eliteflow-metric-tone`, `data-cf-metric-value-kind`, `data-cf-signal-tone`
- status: FROZEN BASELINE

## Migration rule

Do not rebuild all pages at once.

Wave 1:
- `/leads`
- `/clients`
- `/cases`
- `/case/:caseId`
- `/clients/:clientId`

Wave 2:
- `/today`
- `/tasks`
- `/calendar`
- `/billing`
- `/activity`
- `/notifications`

Wave 3:
- `/templates`
- `/response-templates`
- `/settings`
- `/settings/ai`
- `/support`
