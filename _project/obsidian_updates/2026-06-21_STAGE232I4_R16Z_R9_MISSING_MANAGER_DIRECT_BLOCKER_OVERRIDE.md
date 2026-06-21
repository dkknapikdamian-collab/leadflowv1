# Zapis do Obsidiana - STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE

Data: 2026-06-21 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

TECH_APPLIED_LOCAL / OWNER_SMOKE_REQUIRED / PUSH_PENDING

## Przyczyna

Po R8 LeadDetail zapisywal priority/status/payload, ale wspolny MissingItemsManagerDialog nadal mogl uznac brak za blokujacy przez stare
aw.status albo
aw.priority z activity bridge. Jawne locksProgress=false nie mialo pierwszenstwa nad tym fallbackiem.

## Naprawa

MissingItemsManagerDialog.isManagerItemBlocker ma teraz kolejnosc:
1. jawne item.isBlocker/item.blocksProgress/item.blocks_progress,
2. jawne
aw/payload.blocksProgress,
3. dopiero fallback status === blocking_missing_item albo priority === high.

## Testy

- R9 guard/test
- R8 regression
- R16Z_R5 close regression
- build
- verify:closeflow:quiet
- git diff --check

## Ryzyko

Nie zamykac STAGE232I4 jako CLOSED bez manual smoke Damiana na LeadDetail po F5.
