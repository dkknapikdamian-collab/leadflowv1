# CloseFlow / LeadFlow - STAGE230C R8 mass panel region rewrite

Data: 2026-06-09 Europe/Warsaw
Status: DO_APPLY_LOCAL_ONLY_AND_TEST
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY
- R8 is a repair of local Stage230C R2-R7 visibility/debug hotfix series.
- It replaces the whole quick capture panel region with clean JSX.
- It keeps trace local and optional.

## TESTY
- Stage230B regression
- Stage230C regression
- Stage230C-R2/R8 visibility guard/test
- build
- git diff --check

## RYZYKA
- Manual mobile UI check remains required before push.
- Do not proceed to deduplication until trace is copied and analyzed.
