# 2026-06-22 — STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

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


## Zapis do centralnych plików Obsidiana

Dopisać do 02_AKTUALNY_STAN, 04_KIERUNEK_DO_WDROZENIA, 08_HISTORIA_ZMIAN, 09_TESTY_DO_WYKONANIA_I_WYNIKI, 10_ZIPY_WDROZENIA_PUSH, 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY i 13_SQL_LEDGER_I_MIGRACJE po PASS/push.
