# 00_START_NAPRAWA_ZRODLA_PRAWDY

Data: 2026-06-28 00:10 Europe/Warsaw
Status: ACTIVE / SOURCE_TRUTH_REPAIR_INDEX / DOCS_ONLY
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
canonical_name: CloseFlow / LeadFlow

## Cel

To jest indeks miejsca `Naprawa_Zrodla_Prawdy`.

Tu trafiaja audyty i mapy, ktore maja naprawiac zrodlo prawdy przed kolejnymi zmianami runtime/UI, zeby nie powstawaly plastry, duplikaty ani poprawki w zlym pliku.

## Aktywne pliki

- `LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md` - mapa UI/routes: aktywne routes, aktywne pages, legacy kandydaci, CSS layers, anti-patch scan.
- `LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md` - canonical routing: route SOT, aliasy, helpery tras i guard `guard:routes:canonical`.
- `LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md` - guard na plastry UI: blokada nowych runtime/CSS/delete-action obejsc.
- `LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH.md` - centralny config statusow, badge'y, funnel/risk/work-item labels i guard `guard:config:status-source-of-truth`.

## Rejestr SOT-000..SOT-006

Ten rejestr jest uzupełnieniem istniejącego indeksu; nie tworzy drugiego indeksu.

| ID | Artifact | Status | Provenance / classification |
|---|---|---|---|
| SOT-000 | `LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md` | EXISTS / HISTORICAL | repo-local artifact |
| SOT-001 | `LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md` | EXISTS / HISTORICAL | repo-local artifact |
| SOT-002 | `LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md` | EXISTS / HISTORICAL | repo-local artifact |
| SOT-003 | `LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH.md` | EXISTS / HISTORICAL | repo-local artifact |
| SOT-004 | `LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md` | EXISTS / CLOSED | repo-local artifact and recorded completion evidence |
| SOT-005 | no canonical artifact found in current tree or Git history search | MISSING / NOT_FABRICATED | historical reference only; no provenance invented |
| SOT-006 | `LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md` | EXISTS / DONE / GUARD_ONLY | canonical provenance is this exact repo-local file and its listed guard/test commits; it is not silently attributed to a missing SOT-005 artifact |

SOT-006's historical sentence that it replaced an SOT-005 audit is retained as
history. The missing SOT-005 artifact is not recreated from that sentence.

## Zasada uzycia

Przed kazdym kolejnym etapem UI dotyczacym Today, Leads, Clients, Cases, CaseDetail, ClientDetail, Layout, modalow, CSS albo wizualnego source-of-truth trzeba sprawdzic ten katalog.

## Link do dodania w glownym spisie tresci

Dokument repo-local jest indeksowany przez kanoniczny binding projektu:

`10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI.md`

Historyczny dashboard `00_START - CloseFlow Lead App.md` nie jest technicznym routerem.

```md
- `_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md` - indeks miejsca Naprawa zrodla prawdy.
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md` - mapa UI/routes/source-of-truth; czytac przed kolejnymi zmianami UI.
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md` - mapa canonical routing i guard tras.
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md` - guard na plastry UI i jawny baseline dlugu.
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH.md` - centralny config statusow i guard spojnosc mappingow.
```

## Zapis do Obsidiana

- data i godzina: 2026-06-28 00:10 Europe/Warsaw
- save status: indeks zapisany w repo aplikacji
- runtime/UI: nietkniete
- glowny Obsidian start: canonical binding jest wskazany w repo; lokalny Vault nie zawiera potwierdzonego pliku o tej nazwie, dlatego nie tworzono go automatycznie
- Obsidian local sync: LOCAL_SYNC_PENDING

## 2026-06-28 15:35 Europe/Warsaw - LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT completion

<!-- LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT_COMPLETION_R2 -->

Status: DONE / CSS_MATRIX_COMPLETED / DOCS_ONLY.

Artifacts:
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
- _project/runs/LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
- _project/obsidian_updates/2026-06-28_LF-UI-SOT-004_GLOBAL_CSS_LAYER_SOURCE_OF_TRUTH_AUDIT.md
