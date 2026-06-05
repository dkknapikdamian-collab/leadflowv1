# STAGE220A36-R2 — Commission Modal Field Order — RUN

Data: 2026-06-05 22:00 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## CEL
Uporządkować kolejność pól w modalu prowizji, żeby użytkownik najpierw wybierał sposób liczenia prowizji, a dopiero potem podawał procent/prowizję/podstawę.

## ZMIANY
- CaseFinanceEditorDialog: układ top row: rodzaj prowizji, stawka procentowa, wartość prowizji.
- Podstawa procentu przeniesiona niżej jako osobne pole.
- CSS: 3-kolumnowy układ na szerokim modalu, responsywny fallback.
- Guard i test R2.

## STATUS
Do testu lokalnego i push po PASS.
