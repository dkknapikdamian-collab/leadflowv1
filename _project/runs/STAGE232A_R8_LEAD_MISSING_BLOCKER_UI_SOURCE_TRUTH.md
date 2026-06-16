# STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH

- data i godzina: 2026-06-16 06:55 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: runtime/UI hotfix closure after partial R8-R4
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Problem
R8-R4 zapisal LeadDetail i ContextActionDialogs, ale nie domknal data-contract/task-route/guardow/dokumentacji.

## Audyt
Powiazane etapy:
- STAGE227C3A: LeadDetail Brak quick action opens shared missing modal.
- STAGE228R12: ContextActionDialogs owns Brak/blocker action.
- STAGE228R13/R15/R17/R19R2: resolve/delete/active source truth for Braki.
- STAGE232A_R4/R5/R6: metadata, visual source, active list/top card.
- STAGE232A_R7: case_items item_order fallback.

## Test reczny
Hard refresh + dodanie nowej Blokady R8 + sprawdzenie zoltego akordeonu, top card Blokada i Najblizsze dzialania.


## STAGE232A_R8_R6_R6_GUARD_COMPAT_CLOSURE

- data i godzina: 2026-06-16 07:10 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: guard compatibility closure

### Problem
R8-R5 zatrzymal sie na starym R6 guardzie. Kod R8 jest kierunkowo poprawny: aktywne Braki nadal wychodza z linkedTasks, ale przez wrapper R8 i render timeline.

### Zmiana
Stary R6 guard/test akceptuje R8 successor helper i alias:
- activeMissingItemEntriesStage232AR6 = activeMissingItemEntriesStage232AR8
- activeMissingItemEntriesStage228R19R2 = activeMissingItemEntriesStage232AR8
