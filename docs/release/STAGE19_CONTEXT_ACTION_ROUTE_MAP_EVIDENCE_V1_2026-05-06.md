# Stage19 â€” context action route map evidence

Marker: STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1

## Cel

Stage19 dokumentuje mapÄ™ tras i miejsc wywoĹ‚ania wspĂłlnego hosta akcji kontekstowych dla task/event/note.

## Mapa routingu akcji

- `src/lib/context-action-contract.ts` â€” centralny kontrakt typĂłw `task`, `event`, `note`, targetĂłw zapisu i relacji.
- `src/components/ContextActionDialogs.tsx` â€” jeden host dialogĂłw, obsĹ‚uga explicit trigger i legacy fallback.
- `src/pages/LeadDetail.tsx` â€” routing akcji przez `openContextQuickAction`, bez bezpoĹ›rednich importĂłw task/event dialogĂłw.
- `src/pages/ClientDetail.tsx` â€” routing akcji przez `openContextQuickAction`, bez bezpoĹ›rednich importĂłw task/event dialogĂłw.
- `src/pages/CaseDetail.tsx` â€” routing akcji przez `openContextQuickAction`, bez bezpoĹ›rednich importĂłw task/event dialogĂłw.

## DowĂłd runtime contract

- task zapisuje przez `TaskCreateDialog` / `insertTaskToSupabase`.
- event zapisuje przez `EventCreateDialog` / `insertEventToSupabase`.
- note zapisuje przez `ContextNoteDialog` do `activities` z relacjami kontekstowymi.

## Kryterium

Nie ma osobnych fizycznych dialogĂłw task/event na stronach detail. Wszystkie strony idÄ… przez jeden host i jeden kontrakt.
