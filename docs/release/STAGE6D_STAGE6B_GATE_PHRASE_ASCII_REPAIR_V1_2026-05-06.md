# STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Naprawić Stage6C, który nie wystartował, bo PowerShell próbował sparsować tekst Markdown i polskie znaki jako kod.

## Naprawa

- PowerShell ASCII-safe: skrypt `.ps1` ma wyłącznie proste komunikaty ASCII.
- No Markdown inside PowerShell code: dokumenty są kopiowane jako pliki payload, a nie wklejane w skrypt.
- Stage6B release doc dostaje dokładną frazę wymaganą przez test: `buildem, commitem i pushem`.
- Stage6B check/test są uruchamiane ponownie przed buildem, commitem i pushem.

## Kryterium zakończenia

- Stage6 check przechodzi.
- Stage6 test przechodzi.
- Stage6B check przechodzi.
- Stage6B test przechodzi.
- Stage6D check przechodzi.
- Stage6D test przechodzi.
- Build przechodzi.
- Commit/push idą dopiero po zielonych bramkach.
