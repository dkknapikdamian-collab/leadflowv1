# 2026-06-07 - Stage227G1R1 Today Reason and Shift Visibility Repair

- data i godzina: 2026-06-07 18:15 Europe/Warsaw
- nazwa / alias wejściowy: Stage227G1R1 — Today Reason Copy + Shift Visibility Repair
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: ZIP local-only
- testy: G1R1/G1/build/diff-check
- audyt ryzyk po etapie: sprawdzić lokalnie, nie produkcję; upewnić się, że +1D/+3D/+1W są widoczne i nie ma Powód:
- czego nie ruszano: SQL, RLS, Supabase schema, braki C3, finanse
- następny krok: manual check; potem ewentualny push G1+G1R1
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