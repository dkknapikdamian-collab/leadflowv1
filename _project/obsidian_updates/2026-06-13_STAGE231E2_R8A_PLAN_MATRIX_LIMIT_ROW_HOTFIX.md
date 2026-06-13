# STAGE231E2_R8A_PLAN_MATRIX_LIMIT_ROW_HOTFIX â€” Obsidian payload

- data i godzina: 2026-06-13 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: matrix/guard hotfix
- status: ZIP FIX2 local-only, push only after PASS
- problem: R8 guard fail po commicie/pushu R8, bo matrix nie zawieral `activeTasksAndEvents`; pierwszy R8A mial zbyt dokladny anchor.
- zmiana: dopisano `activeTasksAndEvents` do centralnej matrycy planow przez odporny patch.
- testy: R8 guard, R7/R5 guard chain, build, git diff --check.
- ryzyka: brak runtime risk; docs/matrix only.
- czego nie ruszano: SQL, Stripe, Google Calendar, billing runtime, Stage231D.
- nastÄ™pny krok: PASS + commit/push R8A, potem reczny test sidebar.