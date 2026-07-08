---
typ: source_truth_path_repair
status: DO_POTWIERDZENIA
scope: CloseFlow / LeadFlow
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
stage: LF-PROD-SOT-005C-PATH-R2_LOCAL_WINDOWS_REAL_PATH_REPAIR_DO_POTWIERDZENIA
created: 2026-07-08 Europe/Warsaw
---

# LF-PROD-SOT-005C-PATH-R2_LOCAL_WINDOWS_REAL_PATH_REPAIR_DO_POTWIERDZENIA

## Cel

Naprawa dokumentacyjna po R17: aktualna lokalna sciezka repo i vaultu Obsidian ma byc jedna, jawna i zgodna z realnym folderem Windows.

## Poprawne sciezki PATH-R2

```txt
Repo local path real:
C:\Users\malim\Desktop\biznesy_ai\2.closeflow

Obsidian vault local path real:
C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT

Obsidian canonical folder:
10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
```

## Status po R17

```txt
STAGE: LF-PROD-SOT-005C-R17
STATUS: PASS_AFTER_R17_R1
REPO: dkknapikdamian-collab/leadflowv1
BRANCH: dev-rollout-freeze
COMMIT: d13f7aac5a4844cac075e4933e3b35f7ea0349b8
PUSH: YES
```

## Testy / guardy z R17

```txt
npm.cmd run verify:lf-prod-sot-005c-r15 => PASS
npm.cmd run build => PASS
git diff --check => PASS
R17 GitHub verification => PASS
Obsidian verification => PASS
```

## Finding

Obsidian path byl stale. Przed R18 wymagany jest PATH-R2 repair, zeby kolejny etap nie pracowal na starym `PATH-R1/SYNC` albo `CloseFlow_LeadFlow` markerze.

## Zapis do Obsidiana

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
risk audit: stale PATH-R1/SYNC path still may exist in older historical notes; do not use old marker as active source of truth
next step: confirm PATH-R2 repair, then R18
```

## Zakres tej naprawy

- Dotkniete tylko dokumenty source-of-truth / Obsidian mirror.
- Runtime, UI, SQL, env i testy aplikacji nie sa zmieniane.
- R18 nie jest startowany w tym etapie.

## KONIEC ETAPU

PATH-R2 repair note zapisany w kanonicznym folderze Obsidiana w repo. Lokalny vault wymaga zaciagniecia zmian z GitHub/sync.