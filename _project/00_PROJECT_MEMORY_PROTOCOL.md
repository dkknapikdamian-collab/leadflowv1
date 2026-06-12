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
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW__FOUND_PROBLEMS_ADDENDUM.md`
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`
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
- `10_PROJEKTY/CloseFlow_Lead_App/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`, if synced
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

## Mandatory pre-stage audit

Before every stage, the operator must write `AUDYT PRZED ETAPEM`.

It must include:
- stage name and goal,
- visual place in the application where Damian will verify the result,
- affected routes/screens/components/data sources,
- current implementation map,
- whether the stage already exists fully or partially,
- similar places to inspect,
- real adjacent problems found, if any,
- problems intentionally not touched,
- regression risks,
- guard/test plan,
- manual test plan for Damian,
- source-of-truth conflicts.

The audit should look for real problems only: wrong bindings, unfinished work, duplicated patterns, broken gating, stale data flows, fallback masking, missing guard coverage and documentation drift. It must not turn into random repo-wide cleanup.

## Mandatory found-problems ledger

`_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` is the central ledger for real problems found during audits that are not already in the current stage, repair stages or active development direction.

This file is not a stage list. It is a decision queue for Damian.

During every stage, the operator/developer must:
- read the found-problems ledger before planning or implementing,
- check whether the touched module already has open entries,
- add evidence-based problems found during pre-stage or post-stage audit,
- not fix them silently unless they block the stage or Damian includes them in scope,
- report either `Znalezione problemy: brak nowych` or list the new IDs added to the ledger.

Examples that belong there: inconsistent buttons for the same action, duplicated visual source of truth, different colors or components for one pattern, stale data source, unfinished wiring, public/private route drift, missing class-level guard, docs/code conflict or workaround comments in touched modules.

## Mandatory post-stage audit

After every stage, the operator must write `AUDYT PO ETAPIE`.

It must include:
- what changed,
- whether the original cause was fixed,
- whether similar places were checked,
- what could have regressed,
- what additional real problems were found,
- what was intentionally not touched,
- guard/test result,
- manual verification instructions,
- `_project` and Obsidian update status,
- next best step.

A stage is not closed if pre-stage and post-stage audit sections are missing.

## Required report baskets

Each meaningful run report must separate:
- FAKTY Z KODU / PLIKOW
- DECYZJE DAMIANA
- HIPOTEZY / PROPOZYCJE AI
- DO POTWIERDZENIA
- AUDYT PRZED ETAPEM
- ZNALEZIONE PROBLEMY
- TESTY AUTOMATYCZNE
- GUARDY
- TESTY RECZNE
- AUDYT PO ETAPIE
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
