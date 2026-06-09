# STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

Data: 2026-06-09 02:50 Europe/Warsaw

## Status

Final validation/push stage after failed local R26-R40 guard/patcher chain.

## Facts

- R36/R37 runner and mass node --check path proved PowerShell runner is stable.
- R39 diagnostic showed calendar bundle lines already use filterActiveCalendarTaskRows/filterActiveCalendarEventRows.
- R40 showed bundle filter tokens are present and failed only on brittle exact Polish toast text.
- R41 removes brittle toast wording checks and validates behavior by structural tokens: local prune, unsupported-kind error, success toast, event/task branches and hidden-row filters.

## Tests required by script

- mass node --check for stage228 scripts/tests
- R18 guard
- R25 guard
- R41 guard
- node --test R25/R41
- npm run build
- git diff --check

## Manual production tests after Vercel deploy

1. Calendar event add -> delete -> hard refresh -> does not return.
2. Calendar task/reminder add -> delete -> hard refresh -> does not return.
3. TasksStable task add -> delete -> hard refresh -> does not return.
4. LeadDetail Brak add -> delete -> hard refresh -> does not return.
5. ClientDetail Brak add -> delete -> hard refresh -> does not return.
6. Console/network: delete response must be ok/verified/hidden or a clear error.