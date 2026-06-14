# STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Data: 2026-06-14 22:00 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel
Naprawa masowa po serii kruchych patchy R6/R7/R8. Etap nie używa anchorów w runtime. Zastępuje `src/pages/CaseDetail.tsx` kompletną wersją z naprawionym source map dla notatek/follow-upów.

## Audyt przed etapem
- R6/R7/R8 padały na brakujących anchorach albo błędach skryptu.
- Aktualny problem produktowy: notatka zapisana przez dyktowanie jest aktywnością, ale follow-up po notatce musi być realnym taskiem.
- Modal wszystkich notatek nie ma CRUD.
- W dyktowaniu istniała błędna normalizacja `replace(/s+/g, ' ')`.

## Zakres
- Notatka = `activities/operator_note`.
- Follow-up po notatce = `tasks/follow_up`.
- Follow-up dostaje `workspaceId`, `caseId`, `clientId`, `leadId`, `scheduledAt`, `dueAt`, `reminderAt`, `date`.
- Po zapisie task dopina się lokalnie do `tasks`.
- Modal `Wszystkie notatki sprawy` dostaje `Edytuj`, `Usuń`, `Zapisz`.
- CRUD notatek używa `updateActivityInSupabase` i `deleteActivityFromSupabase`.

## Pliki
- `src/pages/CaseDetail.tsx`
- `scripts/check-stage231h-r1d2-r6-r9-case-note-followup-notes-crud-mass-repair.cjs`
- `tests/stage231h-r1d2-r6-r9-case-note-followup-notes-crud-mass-repair.test.cjs`
- `_project/*` centralne ledgery

## Testy
- R1D2 guard/test
- R1D2 R4 guard/test
- R1D2 R6 R9 guard/test
- `npm run build`
- `git diff --check`

## Audyt po etapie
Do uzupełnienia po apply/push.
