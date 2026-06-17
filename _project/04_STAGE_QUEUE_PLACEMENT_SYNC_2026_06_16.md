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


## 2026-06-17 00:15 Europe/Warsaw - STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH

Status: RUNTIME_VISUAL_FIX / MIRRORED_TO_PROJECT_04

Placement:
- Mikroetap naprawczy po negatywnym smoke R10-R1.
- Zakres: realny visual polish sekcji Dzialania leada i grup accordion.
- Nie zmienia kolejki duzych etapow.


## 2026-06-17 02:05 Europe/Warsaw - STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR / STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX

Status: HOTFIX_BEFORE_STAGE232D / VISUAL_SOURCE_TRUTH_REPAIR

Placement:
- STAGE232D_R1 pozostaje nastepnym runtime etapem Owner Control.
- Przed nim wykonujemy waski R11-R1, bo pierwsza paczka R11 zatrzymala sie na kotwicy i nie zapisala zmian.


## 2026-06-17 03:30 Europe/Warsaw - STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_REPAIR

Problem:
- Damian pokazal screenshot: Brak po R11 jest jasny, a Nowy lead jest ciemny.
- R11 wybral zle zrodlo prawdy: statyczny jasny lead-form-vnext zamiast realnego ciemnego runtime +Lead modal.
- R12 deprecjonuje R11 light interpretation i ustawia aktywne zrodlo: dark Nowy lead modal match.

Zakres:
- MissingItemQuickActionModal const markers.
- stage232a-missing-item-visual-source.css dark shell/section/white fields/blue CTA.
- R10/R11 compatibility guard/test rewrite.
- R12 guard/test.

Ryzyka:
- To celowo odwraca R11. Manualny smoke musi porownac Brak z Nowy lead.
