# STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR

Data/czas: 2026-06-22 Europe/Warsaw
Status: DO_TESTU

## Cel
Naprawić czerwony stan po R1C: logika finansów i testy STAGE232K_R1 przechodzą, ale globalny CF-RUNTIME-00 blokuje etap, bo nie zna legalnego zakresu zmian finansowych.

## Zakres
- dopisanie zakresu STAGE232K do allowlisty CF-RUNTIME-00,
- dodanie guarda R1D,
- dodanie testu R1D,
- brak zmian SQL/RLS/Braki/Owner Control/Calendar/billing.

## Wymagane testy
- node scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs
- node --test tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs
- node scripts/check-stage232k-r1d-cf-runtime-allowlist-repair.cjs
- node --test tests/stage232k-r1d-cf-runtime-allowlist-repair.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
