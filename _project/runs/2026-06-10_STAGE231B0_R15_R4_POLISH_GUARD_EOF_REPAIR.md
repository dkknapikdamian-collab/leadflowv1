# STAGE231B0-R15-R4 — Polish guard EOF repair

Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL

## Problem
R15-R4 batch repaired the source files, but the run report itself contained literal examples of damaged encoding sequences. The Polish guard scans stage documentation as well, so it correctly failed on the run report.

## Repair
- Continue from expected dirty R2/R3/R4 state.
- Repair damaged Polish characters in ClientDetail, CSS and stage docs.
- Do not write literal examples of damaged encoding into active stage documentation.
- Keep stage documentation inside the Polish guard scope.
- Polish guard checks current ClientDetail phrases and blocks encoding damage with line evidence.
- Width guard remains active.

## Required close condition
PASS:
- width guard
- Polish guard
- R15-R2 guard
- R13/R11 regressions
- Stage231B0 archive/finance
- delete-flow R25/R41
- build
- git diff --check
