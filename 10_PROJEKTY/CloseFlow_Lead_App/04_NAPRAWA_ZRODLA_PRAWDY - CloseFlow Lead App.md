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

---

## 2026-07-08 - LF-PROD-SOT-005C-PATH-R2 local Windows real path repair

Status: DO_POTWIERDZENIA.

Poprawne aktywne sciezki:

```txt
Repo local path real:
C:\Users\malim\Desktop\biznesy_ai\2.closeflow

Obsidian vault local path real:
C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

Obsidian canonical folder:
10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
```

Status po R17:

```txt
STAGE: LF-PROD-SOT-005C-R17
STATUS: PASS_AFTER_R17_R1
REPO: dkknapikdamian-collab/leadflowv1
BRANCH: dev-rollout-freeze
COMMIT: d13f7aac5a4844cac075e4933e3b35f7ea0349b8
PUSH: YES
```

Testy / guardy z R17:

```txt
npm.cmd run verify:lf-prod-sot-005c-r15 => PASS
npm.cmd run build => PASS
git diff --check => PASS
R17 GitHub verification => PASS
Obsidian verification => PASS
```

Finding:

- Obsidian path byl stale.
- Przed R18 wymagany jest PATH-R2 repair.
- Stary marker `10_PROJEKTY\CloseFlow_LeadFlow` nie jest aktywnym miejscem dla nowych napraw SOT.

Zapis:

```txt
save status: GITHUB_OBSIDIAN_MIRROR_UPDATED
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path real: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian vault local path real: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
Obsidian GitHub sync: READ_VERIFIED
Obsidian local sync: LOCAL_SYNC_NOT_EXECUTED
next step: confirm PATH-R2 repair, then R18
```

KONIEC ETAPU