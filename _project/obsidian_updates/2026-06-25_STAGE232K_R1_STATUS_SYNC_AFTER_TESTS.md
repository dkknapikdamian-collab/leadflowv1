# 2026-06-25_STAGE232K_R1_STATUS_SYNC_AFTER_TESTS

canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS po logu Damiana:

TECH_PASS / WAITING_OWNER_MANUAL_FINANCE_SMOKE

Nie oznaczac jeszcze jako CLOSED, bo w czacie nie ma potwierdzonego manual smoke finansow w UI.

## Dowody techniczne z lokalnego logu Damiana

- guard K_R1: PASS.
- node test K_R1: 10/10 PASS.
- npm run build: PASS.
- npm run verify:closeflow:quiet: PASS.
- git diff --check: PASS.
- git status: clean, dev-rollout-freeze...origin/dev-rollout-freeze.

## Wpisy do centralnych plikow Obsidiana

Dopisac do:
- 02_AKTUALNY_STAN
- 08_HISTORIA_ZMIAN
- 09_TESTY_DO_WYKONANIA_I_WYNIKI
- 10_ZIPY_WDROZENIA_PUSH
- 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

## Rekomendowany wpis statusowy

2026-06-25 Europe/Warsaw - STAGE232K_R1 status-sync po testach.
Status: TECH_PASS / WAITING_OWNER_MANUAL_FINANCE_SMOKE.

Potwierdzone: K_R1 guard PASS, node test 10/10 PASS, build PASS, verify quiet PASS, git diff --check PASS, app repo clean na dev-rollout-freeze.

Nie zamykac jako CLOSED bez manual smoke finansow: 100000 PLN plus 3 procent rowna sie 3000 prowizji, commission payment 1000 daje czesciowo oplacona i 2000 pozostalo, kolejna commission payment 2000 daje oplacona i 0 pozostalo, zwykla wplata klienta nie zmienia prowizji, pending/planned commission payment nie liczy sie jako wplacona, F5 nie cofa wartosci.

Runtime nie byl ruszany w status-sync.

## Ryzyko

Glowne ryzyko to przedwczesne oznaczenie finansow jako CLOSED bez sprawdzenia UI. Testy jednostkowe i guard potwierdzaja logike, ale manual smoke nadal jest wymagany do pelnego zamkniecia etapu.
