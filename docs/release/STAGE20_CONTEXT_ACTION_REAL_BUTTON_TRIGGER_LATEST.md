# Stage20 â€” context action real button trigger

Marker: STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_V1

## Cel

Stage20 potwierdza, ze realne przyciski/akcje w detail pages nie otwieraja juz lokalnych dialogow task/event, tylko ida przez jeden host ContextActionDialogs i jawny request `openContextQuickAction` albo explicit trigger.

## Sprawdzone elementy

- `ContextActionDialogs.tsx` ma event bus, explicit `data-context-action-kind`, legacy fallback i jeden host task/event/note.
- `LeadDetail.tsx`, `ClientDetail.tsx`, `CaseDetail.tsx` uzywaja `openContextQuickAction`.
- Detail pages nie importuja bezposrednio `TaskCreateDialog` ani `EventCreateDialog`.
- Lead i Case maja realne wywolania task/event/note przez kontekstowy trigger.
- Zapisy task/event nadal ida przez Supabase insert helpers.

## Kryterium

Klikniecia z detail pages przechodza przez jeden wspolny tor akcji kontekstowych. Nie ma bocznych lokalnych modalow task/event na kartach rekordu.
