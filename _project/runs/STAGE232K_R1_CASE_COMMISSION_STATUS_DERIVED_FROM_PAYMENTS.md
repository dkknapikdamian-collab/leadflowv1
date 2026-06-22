# STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

<!-- STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS -->

## 2026-06-22 Europe/Warsaw — STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

Status: APPLIED_PENDING_TEST_OR_PUSH.

Zakres:
- commissionStatus jest wyliczany z opłaconych wpłat prowizji, nie z ręcznego pola legacy,
- edytor finansów nie pokazuje aktywnego selecta statusu prowizji,
- buildCaseFinancePatch nie utrwala ręcznego paid/partially_paid,
- lista Lista wpłat prowizji dostaje tylko płatności type=commission,
- label brzmi Pozostało prowizji do zapłaty.

Nie dotykano: SQL/RLS, Braki/Blokady, MissingItemsManagerDialog, Owner Control, Google Calendar, billing/trial, Node_RED_Kabelki.


## Testy wymagane

- node scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs
- node --test tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
