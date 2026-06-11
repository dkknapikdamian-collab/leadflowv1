# STAGE231D0C/R6 - Client Detail Workspace Layout Baseline

Date: 2026-06-11 Europe/Warsaw

## Scan
Read: AGENTS.md, _project, UI Dictionary, ClientDetail, ClientListCard guard, ClientDetail CSS.

## Scope
Compact active case card in ClientDetail, compact top tiles, compact notes, UI Dictionary update.

## Exclusions
SQL, costs, charts, Google Calendar, LeadListCard runtime, CaseDetail.

## Risk sweep
R6 avoids brittle exact LF-only source tokens and inserts compact active branch by regex after getCaseCompleteness.
