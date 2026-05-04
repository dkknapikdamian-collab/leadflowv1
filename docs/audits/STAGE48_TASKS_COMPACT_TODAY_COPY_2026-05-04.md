# Stage48 v2 - Tasks compact cards + Today copy cleanup

## Status
Patched.

## Scope
- Real route: `src/pages/TasksStable.tsx`
- Real route: `src/pages/TodayStable.tsx`
- CSS safety net: `src/styles/tasks-header-stage45b-cleanup.css`

## Changes
- Task page max width reduced.
- Task list width clamped.
- Task card padding reduced.
- Task due date moved beside title.
- Task actions `Zrobione/Przywróć`, `Edytuj`, `Usuń` get explicit visible contrast classes.
- Today helper copy removed:
  `Stabilny widok operatora: zaległe i dzisiejsze zadania, leady bez następnego kroku, wydarzenia oraz szkice AI.`

## Guard
`npm run verify:tasks-compact-stage48`
