# 00_PROJECT_MEMORY_PROTOCOL - CloseFlow / LeadFlow

Status: ACTIVE
Date: 2026-05-16

## Purpose

This file is the short, active project-memory protocol for CloseFlow / LeadFlow.
It does not replace older project-memory blocks in `AGENTS.md`. It gives the next AI developer a compact source of truth for how to start, document and close each stage.

## Sources of truth

- Application repo: source of truth for code, tests, guards, `_project/`, technical run reports and implementation history.
- Obsidian vault: dashboard for high-level status, decisions, manual tests, confirmations, risks, next steps and direction.
- Chat: working surface only. Important facts must be written into repo and/or Obsidian.

## Mandatory scan-first

Before any meaningful stage, scan and read:

Application repo:
- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/STAGE_TEMPLATE_MINIMAL.md`
- full `_project/`
- newest `_project/runs/` reports
- `package.json`
- `scripts/`
- `tests/`, if present
- `docs/`, if present
- files touched by the planned change

Obsidian:
- `START.md`
- `00_START_TUTAJ.md`
- `PROJECTS.md`
- `00_INSTRUKCJA_OBSIDIAN_DLA_AI.md`
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- remaining notes in `10_PROJEKTY/CloseFlow_Lead_App/`

## Mandatory scan proof

Each run report must include:
- scan method
- folders found
- folders missing
- repo files read
- `_project/` files read
- Obsidian notes read
- source-of-truth map
- conflicts between chat, repo and Obsidian

Without scan proof, the stage is invalid.

## Required report baskets

Each meaningful run report must separate:
- FAKTY Z KODU / PLIKOW
- DECYZJE DAMIANA
- HIPOTEZY / PROPOZYCJE AI
- DO POTWIERDZENIA
- TESTY AUTOMATYCZNE
- GUARDY
- TESTY RECZNE
- POTWIERDZENIA DAMIANA
- BRAKI I RYZYKA
- WPLYW NA OBSIDIANA
- WPLYW NA KIERUNEK ROZWOJU
- NASTEPNY KROK
- GIT / ZIP STATUS

## Manual test status

Do not claim manual testing unless Damian confirmed it.
Use one of:
- `TEST RECZNY POTWIERDZONY PRZEZ DAMIANA`
- `TEST RECZNY DO WYKONANIA`
- `BRAK POTWIERDZONEGO TESTU RECZNEGO`

## Guards and tests

Every feature, logic change, UI flow change, data change or regression fix needs a test or guard, or a clear entry:

`BRAK DEDYKOWANEGO TESTU / GUARDA` with reason and risk.

Organizational stages may use presence checks for files, markers and Obsidian dashboard entries.

## Git / ZIP closure

Push mode requires:
- app repo pushed to `dev-rollout-freeze`, or explicit SKIP with reason
- Obsidian repo pushed to `main`, or explicit SKIP with reason
- post-work status/check notes in run report

ZIP mode requires:
- app changes
- `_project/` changes
- Obsidian update files
- run report
- tests/guards result
- changelog/next steps
- implementation instruction

## Hard boundary for organizational stages

For project-memory / Obsidian-mapping stages, do not change runtime UI, routing, product logic, styles or architecture.
