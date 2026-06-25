# STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

<!-- STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS -->

## 2026-06-22 Europe/Warsaw — STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

Status: STATUS_SYNC_APPLIED / TECH_PASS / WAITING_OWNER_MANUAL_FINANCE_SMOKE.

Zakres:
- commissionStatus jest wyliczany z opłaconych wpłat prowizji, nie z ręcznego pola legacy,
- edytor finansów nie pokazuje aktywnego selecta statusu prowizji,
- buildCaseFinancePatch nie utrwala ręcznego paid/partially_paid,
- lista Lista wpłat prowizji dostaje tylko płatności type=commission,
- label brzmi Pozostało prowizji do zapłaty.

Nie dotykano: SQL/RLS, Braki/Blokady, MissingItemsManagerDialog, Owner Control, Google Calendar, billing/trial, Node_RED_Kabelki.

## 2026-06-25 Europe/Warsaw — STATUS SYNC PO LOGU DAMIANA

Status techniczny: PASS.
Status zamknięcia: nie oznaczać jako CLOSED bez manual smoke finansów w UI.

Potwierdzone z lokalnego logu Damiana:
- `node scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs`: PASS.
- `node --test tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs`: 10/10 PASS.
- `npm run build`: PASS.
- `npm run verify:closeflow:quiet`: PASS.
- `git diff --check`: PASS.
- `git status --short --branch`: clean, `dev-rollout-freeze...origin/dev-rollout-freeze`.

Manual smoke finansów wymagany przed CLOSED:
1. Sprawa z wartością transakcji 100000 PLN i prowizją 3% pokazuje prowizję należną 3000, wpłacono 0, pozostało 3000.
2. Opłacona wpłata prowizji 1000 PLN zmienia wpłacono na 1000, pozostało 2000 i status na częściowo opłacona.
3. Druga opłacona wpłata prowizji 2000 PLN zmienia wpłacono na 3000, pozostało 0 i status na opłacona.
4. Zwykła wpłata klienta / zaliczka nie zmienia wpłaconej prowizji.
5. Planowana/pending wpłata prowizji nie liczy się jako wpłacona.
6. Po F5 wartości pozostają stabilne.

Decyzja statusowa:
- Stary status `APPLIED_PENDING_TEST_OR_PUSH` jest nieaktualny po logu testów.
- Aktualny status etapu to `TECH_PASS / WAITING_OWNER_MANUAL_FINANCE_SMOKE`.
- Nie zaczynać nowej poprawki finansów bez błędu ze smoke.

Następny krok:
- Po manual smoke PASS można zmienić status na `PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK` w tym run report oraz w Obsidianie.
