# 2026-06-22 — STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR

canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status
R1B i R1C zostały wypchnięte mimo czerwonych guardów. R1D jest naprawą scope/allowlist dla CF-RUNTIME-00.

## Zakres
- STAGE232K_R1 logika finansów zostaje,
- CF-RUNTIME-00 dostaje jawny zakres legalnych zmian finansowych,
- dodano guard/test R1D.

## Nie dotykano
- SQL / RLS,
- Braki / Blokady,
- MissingItemsManagerDialog,
- Owner Control,
- Google Calendar,
- billing / trial,
- Node_RED_Kabelki,
- lokalny Obsidian vault.
