# 2026-06-07 - Stage227G1R1 Today Reason and Shift Visibility Repair run report

## Status
LOCAL_ONLY_READY after script if all guards/build pass.

## FAKTY
- Poprawka usuwa runtime copy "Powód:" z TodayStable.
- WorkItemCard sanitizuje helper, żeby "Powód:" nie wrócił z innej ścieżki.
- +1D/+3D/+1W zostają wymagane dla Today task/event/upcoming work-item cards.

## AUDYT RYZYK
- Jeżeli użytkownik patrzy na Vercel production zamiast lokalnego 127.0.0.1, zmiany nie będą widoczne bez push/deploy.
- Manualny test musi być wykonany w lokalnym dev serverze po odświeżeniu hard refresh.
## G1R1-R2 — test regex repair
- data i godzina: 2026-06-07 18:10 Europe/Warsaw
- naprawiono: test G1R1 oczekiwał dokładnego jednowierszowego JSX shiftActions={buildTodayRescheduleActionsStage227G1(...)}
- decyzja: test ma sprawdzać realny kontrakt runtime: brak Powód:, obecność shiftActions, obecność task/event/upcoming i CSS
- zakres: test-only repair, bez zmian runtime UI
## G1R1-R3 — test marker repair
- data i godzina: 2026-06-07 18:15 Europe/Warsaw
- naprawiono: test G1R1 sprawdzał stary marker data-stage227g1-shift-action
- decyzja: obowiązujący runtime marker to data-stage227g1-today-reschedule-action
- zakres: test-only repair, bez zmian runtime UI
## G1R1-R4 — CSS marker test repair
- data i godzina: 2026-06-07 18:20 Europe/Warsaw
- naprawiono: test G1R1 szukał nieistniejącego markera CSS STAGE227G1R1_TODAY_REASON_SHIFT_VISIBILITY
- decyzja: obowiązujący marker CSS to STAGE227G1R1_TODAY_SHIFT_VISIBILITY_REPAIR
- zakres: test-only repair, bez zmian runtime UI
## G1R1-R5 — shift CSS class test repair
- data i godzina: 2026-06-07 18:25 Europe/Warsaw
- naprawiono: test G1R1 szukał nieistniejącej klasy CSS cf-work-item-card-shift-action
- decyzja: obowiązująca klasa CSS przycisków przesunięcia to cf-work-item-card-shift
- zakres: test-only repair, bez zmian runtime UI