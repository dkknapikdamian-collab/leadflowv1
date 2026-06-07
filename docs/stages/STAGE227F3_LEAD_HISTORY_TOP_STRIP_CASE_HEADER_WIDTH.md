# Stage227F3 — Lead History Top Strip + Case Header Width

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

- LeadDetail: historia aktywności nie może siedzieć pod notatkami.
- LeadDetail: górny pasek 3 skrótów pokazuje Działania / Braki / Historia.
- CaseDetail: header, top grid, tab wrapper i shell mają trzymać pełną szerokość shared canvasu.

## Zakres

- Bez SQL.
- Bez Supabase.
- Bez zmiany modelu danych.
- Bez zmiany logiki C2.

## Testy wymagane

- check:stage227f3-lead-history-top-strip-case-header-width
- test:stage227f3-lead-history-top-strip-case-header-width
- regresje C2, F2R1, F2
- npm run build
- git diff --check

## Audyt ryzyk

Visual check po deployu: LeadDetail top strip, lewy rail historii, brak historii pod notatkami, CaseDetail pełna szerokość headera i zakładek.
