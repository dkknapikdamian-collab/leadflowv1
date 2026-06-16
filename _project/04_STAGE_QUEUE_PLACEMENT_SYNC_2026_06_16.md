# 04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16

Status: ACTIVE / DOCS_ONLY / QUEUE_PLACEMENT_RULE
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja Damiana

Od teraz etapy nie moga zostawac tylko w czacie, payloadzie, run reportcie ani pojedynczym pliku `10_PROJEKTY/.../04_STAGE...`.

Aktywne etapy maja byc wpisywane w obszarze `04` i mirrorowane do centralnej kolejki projektu.

## Regula placementu

Nowy etap musi trafic do:

1. `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` albo jawnie oznaczonego pliku queue-sync w `_project/04...`,
2. `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`, jesli zmienia kierunek produktu,
3. `_project/06_GUARDS_AND_TESTS.md`, jesli ma guard/test,
4. `_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md`, jesli ma testy,
5. `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md`, jesli dodaje ryzyko/bug,
6. `_project/08_CHANGELOG_AI.md`, jesli zmienia kolejke albo status,
7. `_project/obsidian_updates/...` jako payload,
8. `10_PROJEKTY/CloseFlow_Lead_App/...` tylko jako dashboard note, nie jako jedyne aktywne zrodlo prawdy.

## Status rozproszonych etapow po sync

- `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX` - zapisany w `10_PROJEKTY/.../04_STAGE232D_I...`; ma byc traktowany jako aktywny etap 04 po `STAGE232J_R1`.
- `STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT` - zapisany w `10_PROJEKTY/.../04_STAGE232D_I...`; aktywny etap 04 po kontakt/cisza albo szybciej, jesli Damian wybierze Braki w sprawach/klientach.
- `STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX` - zapisany w `10_PROJEKTY/.../04_STAGE232J...` i payloadzie; najblizszy runtime stage.
- Bug prowizji nie moze uzywac numeru `STAGE232C`, bo `STAGE232C` jest juz zajety przez etap klientow/relacji. Nowa nazwa: `STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH`.

## Aktualna rekomendowana kolejnosc

1. `STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX`
2. `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX`
3. `STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT`
4. `STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH`
5. `STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH`
6. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`

## Guard mentalny dla operatora

Jesli nowy etap jest tylko w `10_PROJEKTY/.../04_STAGE*.md`, oznacz:

`DO_PRZENIESIENIA_DO_CENTRALNEGO_04`

Nie rozpisuj runtime z pliku rozproszonego, dopoki nie ma mirroru do `_project/04...` albo tego queue-sync.

## Nastepny krok

Przy najblizszym ZIP runtime `STAGE232J_R1` wykonac tez pelny update centralnej kolejki `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, jesli lokalne narzedzie moze bezpiecznie zrobic patch na dlugim pliku bez utraty historii.


## 2026-06-16 23:45 Europe/Warsaw - STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE

Status: RUNTIME_VISUAL_FIX / MIRRORED_TO_PROJECT_04

Placement:
- Ten etap jest dopisany do centralnych _project/04... i nie zostaje tylko w czacie ani payloadzie.
- Zakres: korekta koloru wewnetrznego kafelka/empty state i wierszy w grupie Braki i blokady po screenshocie Damiana.
- Nie zmienia kolejki glownych duzych etapow; jest mikroetap naprawczy po R10.
