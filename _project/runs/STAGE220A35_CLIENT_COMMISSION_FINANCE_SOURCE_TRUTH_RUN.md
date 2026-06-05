# STAGE220A35 — Client Commission Finance Source Truth — RUN

Data: 2026-06-05 21:05 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## CEL
Rozdzielić wartość transakcji/sprawy od prowizji w ClientDetail i kartach spraw klienta.

## ZMIANY
- Client finance top tile pokazuje prowizję należną, wpłaconą i do zapłaty.
- Client right rail finance pokazuje prowizje zamiast traktować wartość transakcji jako do domknięcia prowizji.
- Karta sprawy w kliencie bierze prowizję z getCaseFinanceSummary.
- CaseFinanceEditorDialog doprecyzowuje, że wartość transakcji jest podstawą procentu, a kwota stała jest gotową prowizją.

## TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

Generated at: 2026-06-05T18:58:59.121Z
