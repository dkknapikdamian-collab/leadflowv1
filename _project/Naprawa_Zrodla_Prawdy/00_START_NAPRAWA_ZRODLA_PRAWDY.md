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

## Zasada uzycia

Przed kazdym kolejnym etapem UI dotyczacym Today, Leads, Clients, Cases, CaseDetail, ClientDetail, Layout, modalow, CSS albo wizualnego source-of-truth trzeba sprawdzic ten katalog.

## Link do dodania w glownym spisie tresci

Dopisac pod sekcja `04 - Etapy i kierunek` w:

`10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`

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
- glowny Obsidian start: do recznego dopisania przez maly blok, bo connector zablokowal pelne nadpisanie `00_START - CloseFlow Lead App.md`
- Obsidian local sync: LOCAL_SYNC_PENDING
