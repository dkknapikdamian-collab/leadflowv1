# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw
Ostatnia regulacja kolejki: 2026-06-14 20:05 Europe/Warsaw
Status: ACTIVE / CANONICAL
Typ: centralna kolejnoĹ›Ä‡ etapĂłw rozwoju aplikacji
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdraĹĽamy teraz, co pĂłĹşniej i w jakiej kolejnoĹ›ci?
```

To jest **jedyne aktywne ĹşrĂłdĹ‚o prawdy dla kolejki etapĂłw**.
Run reporty w `_project/runs/` i payloady w `_project/obsidian_updates/` sÄ… szczegĂłĹ‚ami etapu, dowodami skanu, testami i historiÄ…, ale **nie zastÄ™pujÄ… tej kolejki**.

Nie wdraĹĽaÄ‡ etapĂłw z luĹşnej rozmowy, jeĹ›li nie sÄ… wpisane albo potwierdzone w tym pliku.

## PowiÄ…zane pliki centralne

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardĂłw/testĂłw,
- `_project/08_CHANGELOG_AI.md` - historia zmian,
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu,
- `_project/13_TEST_HISTORY.md` - wyniki testĂłw,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testĂłw SQL,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy; nie powinien byÄ‡ jedynÄ… kolejkÄ….

## Zasada etapĂłw

KaĹĽdy etap musi mieÄ‡:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje juĹĽ czÄ™Ĺ›ciowo,
- zakres,
- czego nie ruszaÄ‡,
- guard/test,
- test rÄ™czny dla Damiana,
- audyt po etapie,
- update `_project` i Obsidiana albo payload do synchronizacji,
- selektywny commit/push po PASS.

Statusy dopuszczalne:

- DO_WDROZENIA,
- W_TRAKCIE,
- LOCAL_ONLY,
- PASS_LOCAL,
- TECH_PUSHED,
- PRODUCT_PASS,
- PASS_WITH_EXPLICIT_RISK,
- BLOCKED,
- ODLOZONE,
- ZAMKNIETE.

## AKTUALNA KANONICZNA KOLEJKA - od 2026-06-14 20:05 Europe/Warsaw

### 0. STAGE231L_STAGE_QUEUE_CANONICAL_SYNC

Status: WYKONANE_W_TYM_COMMICIE / DOCS_ONLY

Cel: uporzÄ…dkowaÄ‡ wszystkie ostatnie etapy w tym jednym centralnym pliku.
Zakres: kolejka etapĂłw, bez runtime, bez SQL, bez UI.
Warunek zamkniÄ™cia: ten plik zawiera aktualnÄ… kolejnoĹ›Ä‡; przyszĹ‚e etapy nie mogÄ… byÄ‡ tylko w run reports albo payloadach.

---

### 1. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Status: NAJBLIĹ»SZY ETAP DO WDROĹ»ENIA

Cel: przywrĂłciÄ‡ realne dyktowanie notatki w CaseDetail.

Kontrakt:

- przycisk `Dyktuj notatkÄ™` nie moĹĽe byÄ‡ disabled ani `wkrĂłtce`,
- uĹĽywa SpeechRecognition / webkitSpeechRecognition,
- transkrypcja trafia do notatki sprawy,
- autosave po okoĹ‚o 2 sekundach ciszy,
- zapis jako activity/note z `caseId`,
- po hard refresh notatka zostaje,
- nie zapisuje pustych notatek,
- nie tworzy duplikatĂłw autosave,
- brak wsparcia przeglÄ…darki / odmowa mikrofonu ma jasny komunikat.

Nie ruszaÄ‡:

- Google Calendar,
- SQL,
- billing/trial,
- AI Drafts,
- koszty zwrĂłcone R1E,
- global layout.

Run decision: `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`
WĹ‚aĹ›ciwy etap runtime do utworzenia: `_project/runs/STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md`

---

### 2. STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Status: PO R1D2

Cel: dodaÄ‡ lekkÄ… akcjÄ™ oznaczania kosztu jako zwrĂłcony / czÄ™Ĺ›ciowo zwrĂłcony bez tworzenia duĹĽego nowego menu.

Kontrakt UX:

- akcja przy konkretnym koszcie, np. `Oznacz zwrot`,
- domyĹ›lna kwota = pozostaĹ‚o do zwrotu,
- obsĹ‚uga peĹ‚nego i czÄ™Ĺ›ciowego zwrotu,
- data zwrotu domyĹ›lnie dziĹ›,
- notatka opcjonalna,
- zapis aktualizuje `reimbursedAmount`, `reimbursedAt`, status `partially_reimbursed` / `reimbursed`,
- summary aktualizuje `Koszty zwrĂłcone`, `Koszty do zwrotu`, `Razem do pobrania`.

Nie ruszaÄ‡:

- SQL bez wczeĹ›niejszego schema check,
- Google Calendar,
- AI Drafts,
- global finance rewrite.

Run decision/payload: `_project/obsidian_updates/2026-06-14_STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING.md`

---

### 3. STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Status: PO R1E ALBO WCZEĹšNIEJ, JEĹšLI SZKICE BLOKUJÄ„ PRACÄ

Cel: rozdzieliÄ‡ `Szybki szkic` od `Szkicu AI`.

Decyzja produktu:

- `Szybki szkic` = zwykĹ‚a notatka/raw capture, wpisana albo dyktowana, zapis bez AI i bez `fullAi`,
- `Szkic AI` = osobna funkcja AI, ktĂłra analizuje tekst i proponuje akcjÄ™ do zatwierdzenia,
- uĹĽytkownik nie moĹĽe dostawaÄ‡ `WORKSPACE_AI_ACCESS_REQUIRED` przy zwykĹ‚ym szybkim szkicu,
- surowy tekst typu `DzwoniĹ‚ Piotrek, jutro kontakt w sprawie umowy` ma zostaÄ‡ zapisany jako notatka/szkic,
- dopiero funkcja AI moĹĽe zaproponowaÄ‡ task/follow-up/lead/event do zatwierdzenia.

Miejsca do audytu:

- `/ai-drafts`,
- Today,
- LeadDetail,
- ClientDetail,
- CaseDetail,
- shared quick actions,
- backend `/api/system?kind=ai-drafts`.

Run decision: `_project/runs/STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT.md`

---

### 4. STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT

Status: PO UI/DETAIL CLOSEOUT I PO PILNYCH SZKICACH

Cel: naprawiÄ‡ i potwierdziÄ‡ Google Calendar dla wielu uĹĽytkownikĂłw.

Problem:

- backend jest czÄ™Ĺ›ciowo user-scoped,
- ale task/event create moĹĽe nadal nie nadawaÄ‡ ownership fields,
- outbound sync moĹĽe pomijaÄ‡ rekordy przez `personalScopeSkipped`,
- trzeba potwierdziÄ‡ dziaĹ‚anie na drugim koncie, nie tylko Damiana.

Zakres:

- `google_calendar_connections` per user,
- task/event ownership fields,
- outbound sync bez fallbacku do konta Damiana,
- UI Settings pokazuje connected/user_not_connected/skipped/created/failed,
- manualny test drugiego konta.

Run decision: `_project/runs/2026-06-14_STAGE_ORDER_UI_THEN_GOOGLE_CALENDAR_AUDIT.md`

---

### 5. STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION

Status: PO GOOGLE CALENDAR ALBO WCZEĹšNIEJ, JEĹšLI PRODUKCJA MAILI BLOKUJE RELEASE

Cel: zaĹ‚oĹĽyÄ‡/podpiÄ…Ä‡ domenÄ™ i realny fundament maila.

Zakres:

- domena produkcyjna,
- DNS,
- realny sender / dostawca maila,
- SPF / DKIM / DMARC / MX,
- env i diagnostyka konfiguracji,
- test wysyĹ‚ki,
- brak silent fail.

Run decision: `_project/runs/STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN.md`

---

### 6. STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS

Status: PO K1

Cel: wdroĹĽyÄ‡ maile systemowe.

Zakres:

- reset hasĹ‚a,
- potwierdzenie zmiany maila,
- potwierdzenie rejestracji,
- potwierdzenie pĹ‚atnoĹ›ci,
- bĹ‚Ä…d/status pĹ‚atnoĹ›ci,
- podstawowe powiadomienia systemowe,
- log/outbox i test renderu.

---

### 7. STAGE231K3_OWNER_DIGEST_EMAILS_DAILY_AND_WEEKLY

Status: PO K2

Cel: poranny digest i tygodniowe podsumowanie na e-mail.

Zakres:

- daily digest jako lista decyzji i ryzyk,
- weekly report jako podsumowanie tygodnia,
- brak newsletterowego lania wody,
- brak wysyĹ‚ki bez realnego mail foundation,
- guard przed duplikatami.

---

### 8. STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING

Status: PO K2/K3

Cel: produkcyjna zakĹ‚adka Pomoc / Support.

Zakres:

- formularz zgĹ‚oszenia,
- routing do realnego support mailbox / outbox,
- mail potwierdzajÄ…cy przyjÄ™cie zgĹ‚oszenia,
- status zgĹ‚oszenia dla uĹĽytkownika,
- brak martwego support tab.

---

### 9. CODEX-AUTO-CONTEXT-001

Status: TECH BACKLOG / PO PILNYCH ETAPACH

Cel: dodaÄ‡ staĹ‚y kontekst dla Codexa i AI developerĂłw.

Zakres:

- `_project/CODEX_CONTEXT_INDEX.md`,
- `scripts/codex-context-pack.ps1`,
- `.codex/skills/*` scan-first skills,
- skrĂłcenie skanĂłw i ograniczenie chaosu.

PowĂłd: w repo nie znaleziono jeszcze `_project/CODEX_CONTEXT_INDEX.md` ani `scripts/codex-context-pack.ps1`.

## ZamkniÄ™te / aktualnie uznane za domkniÄ™te etapy UI/detail

### LeadDetail

- `STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT` - technicznie domkniÄ™ty dla potencjaĹ‚u, next action i gĹ‚Ăłwnego missing_item guardu.
- `STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX` - closeout starej Ĺ›cieĹĽki Brak, delete missing_item overflow i CSS work-row.
- `STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT` - wzmocnienie ukĹ‚adu work-row.

Nie traktowaÄ‡ jako otwarte, chyba ĹĽe test regresji pokaĹĽe bĹ‚Ä…d.

### CaseDetail finance/cost closeout chain

Status zbiorczy: PRODUCT_PASS / MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / TECH_PUSHED dla Ĺ‚aĹ„cucha finansĂłw i kosztĂłw, z wyjÄ…tkiem nowych osobnych etapĂłw R1D2 i R1E.

ZamkniÄ™te albo objÄ™te manualnym PASS:

- `STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT` - contractValue/prowizja,
- `STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL` - korekta/usuwanie kosztĂłw,
- `STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION` - peĹ‚na korekta wpĹ‚at i kosztĂłw,
- `STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR` - naprawa czerwonych guardĂłw i zapisu pĹ‚atnoĹ›ci,
- `STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG` - koszt `Inny` + checkbox `Koszt do zwrotu`,
- `STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC` - porzÄ…dek ledgerĂłw,
- `STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS` - manualny PASS Damiana.

Nadal otwarte:

- `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`,
- `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`.

## Backlog produktowy po stabilizacji detail views

### STAGE-A35-OWNER-CONTROL-BASELINE

Status: PO PILNYCH DETAIL/MAIL/CALENDAR LUB JAKO RĂ“WNOLEGĹY PRODUCT SPRINT

Cel: owner-control audit: co ruszyÄ‡, czego nie przegapiÄ‡, ktĂłre leady/sprawy stojÄ….

Zakres:

- leady bez nastÄ™pnego kroku,
- leady bez kontaktu 7+ dni,
- leady bez kontaktu 14+ dni,
- sprawy bez ruchu,
- sprawy z wartoĹ›ciÄ…/pieniÄ™dzmi, ale bez nastÄ™pnego kroku,
- rekordy bez odpowiedzialnego,
- rekordy z notatkÄ…, ale bez zadania/follow-upu.

### STAGE-A35B-MANDATORY-NEXT-STEP-CONTRACT

Status: PO A35

Cel: kaĹĽdy aktywny lead/sprawa ma mieÄ‡ jasny nastÄ™pny krok albo Ĺ›wiadomy status `brak kolejnego kroku`.

### STAGE231A2_DOCUMENT_BLOCKERS_LITE

Status: PO A35B ALBO RĂ“WNOLEGLE JAKO MAĹY ETAP

Cel: dokumenty/braki jako element kontroli procesu, nie martwe zaĹ‚Ä…czniki.

### STAGE-A41-CONTACT-CADENCE-GRID

Status: PO A35B / PO DOCUMENT_BLOCKERS_LITE

Cel: siatka kontaktu: dziĹ›, 1d, 2d, 3d, 5d, 7d, 14d.

### STAGE-A42-LOST-LEAD-RESCUE

Status: PO A41

Cel: ekran `Do odzyskania` dla leadĂłw z ciszÄ…, brakiem kroku i ryzykiem utraty.

### STAGE-A46-SALES-FUNNEL_MOVEMENT_VIEW

Status: PO A41 LUB PO A42

Cel: lejek pokazuje ruch, ciszÄ™, brak kroku, ryzyko i pieniÄ…dze, nie tylko etap.

### STAGE-A45-FINANCE-WATCHLIST

Status: PO A42/A46

Cel: lista pieniÄ™dzy do ruszenia, nie ksiÄ™gowoĹ›Ä‡.

### STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT

Status: PO A35/A41/A42/A45 ORAZ PO STAGE231K1/K2, JEĹšLI MA IĹšÄ† MAILEM

Cel: dzienny/tygodniowy raport wĹ‚aĹ›ciciela jako lista decyzji i ryzyk.

### STAGE-A36-DRAFTS-REBUILD

Status: PO STAGE231J2 / NIE JAKO PIERWSZY WYRĂ“Ĺ»NIK

Cel: jedna skrzynka szkicĂłw: rÄ™czny szkic, wklejony tekst, dyktowanie, parser, AI; zatwierdzanie jako lead/task/event/notatka/follow-up.

### STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER

Status: WYSOKA WARTOĹšÄ† / PĂ“ĹąNIEJ, po stabilizacji podstawowego CRM i owner-control core

Cel: znajdowaÄ‡ okazje sprzedaĹĽowe po problemie/sygnale, nie budowaÄ‡ pustej bazy firm.

Podetapy:

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

### STAGE-A47-CONTROL-SPRINT-OFFER

Status: PO A35 DEMO / MOĹ»E IĹšÄ† JAKO ETAP BIZNESOWY RĂ“WNOLEGLE

Cel: spiÄ…Ä‡ produkt z usĹ‚ugÄ… wdroĹĽeniowÄ… `CloseFlow Control Sprint`.

## Etapy techniczne / safety backlog

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Status: P1 / TECHNICAL SAFETY / DO WYKONANIA PRZED SZERSZYM TESTEM

ZablokowaÄ‡ publiczne preview routes w produkcji, jeĹĽeli pokazujÄ… prototyp albo dane wyglÄ…dajÄ…ce jak realne kontakty.

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Status: PO 232A

SprawdziÄ‡, czy statyczne importy LeadDetail/ClientDetail sÄ… nadal potrzebne i czy lazy/chunk boundary jest stabilny.

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Status: PO 232B

Auth/env ma fail-closed w produkcji i nie maskowaÄ‡ zĹ‚ej konfiguracji service-role fallbackiem.

### STAGE232D_DOCS_ENCODING_SWEEP

Status: PO APP CORE

NaprawiÄ‡ aktywne README/.env/docs z mojibake bez przepisywania caĹ‚ej historycznej lawiny.

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Status: PO 232D

RozdzieliÄ‡ runtime guard od docs/project-memory guard.

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Status: PO 232E

UstaliÄ‡ jeden gĹ‚Ăłwny release gate i uporzÄ…dkowaÄ‡ runner pod Windows/Linux.

## Warunek aktualizacji tego pliku

Po kaĹĽdym zatwierdzonym etapie zmieniÄ‡ status w tym pliku.
Nie zostawiaÄ‡ kolejnoĹ›ci tylko w czacie, run reportach albo payloadach Obsidiana.
JeĹĽeli powstaje nowy etap, jego ID i kolejnoĹ›Ä‡ muszÄ… trafiÄ‡ tutaj.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuÄąâ€ž/Zapisz. Etap zastĂ„â„˘puje runtime file bez kruchych anchorÄ‚Ĺ‚w po bÄąâ€šĂ„â„˘dach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1G2 central product-pass sync for legacy R1D2 guard

Status: PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED
PowÄ‚Ĺ‚d wpisu: historyczny guard scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs wymaga dokÄąâ€šadnej frazy PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED w centralnym pliku etapÄ‚Ĺ‚w. R1G2 wczeÄąâ€şniej byÄąâ€š potwierdzony manualnie i wypchniĂ„â„˘ty, ale po syncu kolejki etapÄ‚Ĺ‚w fraza nie byÄąâ€ša obecna w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuÄąâ€ž/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON legacy guard sync

Status: TECH_PUSHED / REQUIRED_BY_LEGACY_GUARD / SOURCE_SYNC
PowÄ‚Ĺ‚d wpisu: legacy guard R1D2 R4 wymaga obecnoÄąâ€şci markera STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON w centralnych ledgerach 04/06/08/10/13 oraz w run/Obsidian payload. Ten wpis nie zmienia runtime; synchronizuje ÄąĹźrÄ‚Ĺ‚dÄąâ€šo prawdy po wczeÄąâ€şniejszych etapach R6-R9.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniĂ„â„˘cie klasy bÄąâ€šĂ„â„˘dÄ‚Ĺ‚w legacy markerÄ‚Ĺ‚w. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peÄąâ€šny chain guardÄ‚Ĺ‚w/testÄ‚Ĺ‚w/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bÄąâ€šĂ„â„˘du guardÄ‚Ĺ‚w R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieĂ„â€ˇ podwÄ‚Ĺ‚jnie escapowany backslash. Bez tego guard szuka bÄąâ€šĂ„â„˘dnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bÄąâ€šĂ„â„˘du guardÄ‚Ĺ‚w R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moÄąÄ˝e wymagaĂ„â€ˇ nieistniejĂ„â€¦cej skÄąâ€šadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujÄ… do 5 wpisĂłw, majÄ… tooltip peĹ‚nej treĹ›ci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaĹ‚aniach pokazuje treĹ›Ä‡ notatki jako opis.
- guard: scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs

## STAGE231H_R1D2_R12D_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINAL_ANCHORLESS

- data: 2026-06-15 Europe/Warsaw
- status: DO_APPLY / final anchorless repair
- zakres: CaseQuickActions explicit case scope, ContextNoteDialog handoff order, CaseDetail quick note local append + prompt, ClientDetail action dedupe
- guard: scripts/check-stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.cjs
- test: tests/stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.test.cjs
- SQL: nie dotyczy

## STAGE231H_R1D2_R14F_NOTE_DELETE_LINKED_FOLLOWUP_EXPANDED_PANEL_ARROW_SAFE

- Data: 2026-06-15T11:25:01.568Z
- Typ: CaseDetail notes panel / linked follow-up delete / guard
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiązanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY
