---
typ: project_source_truth_repair
status: ACTIVE
scope: CloseFlow / LeadFlow
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
created: 2026-06-28 00:14 Europe/Warsaw
---

# 04_NAPRAWA_ZRODLA_PRAWDY - CloseFlow Lead App

## Cel

To jest dashboard note dla obszaru `Naprawa zrodla prawdy`.

Ma stac obok obszaru `04 - Etapy i kierunek`, bo dotyczy decyzji o tym, gdzie jest aktywne zrodlo prawdy przed kolejnymi etapami UI/runtime.

## Aktywne miejsce repo

- `_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md`
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`

## Przeniesiony raport

Stary adres:

- `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`

Status starego adresu:

- stub/przekierowanie tylko dla starych linkow;
- nie traktowac jako pelne zrodlo prawdy.

Nowy adres canonical:

- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`

## Zasada

Przed kolejnymi zmianami UI trzeba najpierw sprawdzic:

1. aktywny route/page,
2. aktywny template/component,
3. aktywny CSS/design system,
4. legacy candidates,
5. anti-patch risks,
6. wymagany guard/test.

Bez tego nie wolno dokladac kolejnej warstwy CSS ani poprawiac UI w ciemno.

## Następny rekomendowany etap

`LF-UI-SOT-001 — Global CSS layer source-of-truth audit`.

Zakres:

- rozpisac globalne importy CSS z `src/App.tsx`;
- oznaczyc aktywne tokeny/systemy, hotfix stage, legacy, disabled;
- nie usuwac nic na oko;
- przygotowac guard anty-plastrowy.

## Zapis do Obsidiana

- data i godzina: 2026-06-28 00:14 Europe/Warsaw
- save status: dashboard note zapisana w projekcie
- runtime/UI: nietkniete
- Obsidian local sync: LOCAL_SYNC_PENDING
