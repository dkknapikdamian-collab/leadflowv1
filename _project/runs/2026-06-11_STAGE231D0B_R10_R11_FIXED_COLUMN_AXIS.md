# STAGE231D0B-R10/R11 - fixed column axis for ClientListCard

Data: 2026-06-11 HH:mm Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Routing
- canonical_name: CloseFlow / LeadFlow
- project_id: CloseFlow / LeadFlow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- TOC prefix: 09 tests, 08 history, 11 risks, 10 ZIP/push

## Problem
R10/R10 used one grid but still allowed content-sensitive column widths. Result: column starts could shift between client cards when text lengths differed.

## Fix
R10/R11 sets deterministic CSS variable columns for name, phone, email, finance and status slots.

## Tests to run
- D0B guard
- D0B node test
- git diff --check
- build

## Manual QA
Open /clients, Ctrl+F5. Check every card:
- client name and company start on one axis,
- phone and cases start on one axis,
- email and nearest action start on one axis,
- active commission and lifetime earned start on one axis,
- long text ellipsizes and does not overlap.
