# STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

- data: 2026-06-14 22:30 Europe/Warsaw
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: MASS_GUARD_SYNC_CONTINUATION

## Cel

Zamknąć klasę błędów ujawnioną przez R9D2: legacy guardy R1D2/R4 wymagają historycznych markerów w centralnych ledgerach. R9E dopisuje brakujące markery masowo, bez kolejnego kruchego patchowania `CaseDetail.tsx`.

## Zakres

- utrzymanie pełnej naprawy runtime z R9,
- centralny R1G2 product-pass sync,
- legacy R4 marker sync w 04/06/08/10/13,
- R9/R9D/R9E guard chain,
- build i diff-check.

## Nie ruszano

SQL, Google Calendar backend, billing/trial, AI Drafts, R1E.
