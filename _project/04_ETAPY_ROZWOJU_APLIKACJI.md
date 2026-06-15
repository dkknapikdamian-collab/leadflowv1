# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw
Ostatnia regulacja kolejki: 2026-06-14 20:05 Europe/Warsaw
Status: ACTIVE / CANONICAL
Typ: centralna kolejnoÄąâ€şĂ„â€ˇ etapÄ‚Ĺ‚w rozwoju aplikacji
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdraÄąÄ˝amy teraz, co pÄ‚Ĺ‚ÄąĹźniej i w jakiej kolejnoÄąâ€şci?
```

To jest **jedyne aktywne ÄąĹźrÄ‚Ĺ‚dÄąâ€šo prawdy dla kolejki etapÄ‚Ĺ‚w**.
Run reporty w `_project/runs/` i payloady w `_project/obsidian_updates/` sĂ„â€¦ szczegÄ‚Ĺ‚Äąâ€šami etapu, dowodami skanu, testami i historiĂ„â€¦, ale **nie zastĂ„â„˘pujĂ„â€¦ tej kolejki**.

Nie wdraÄąÄ˝aĂ„â€ˇ etapÄ‚Ĺ‚w z luÄąĹźnej rozmowy, jeÄąâ€şli nie sĂ„â€¦ wpisane albo potwierdzone w tym pliku.

## PowiĂ„â€¦zane pliki centralne

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardÄ‚Ĺ‚w/testÄ‚Ĺ‚w,
- `_project/08_CHANGELOG_AI.md` - historia zmian,
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu,
- `_project/13_TEST_HISTORY.md` - wyniki testÄ‚Ĺ‚w,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testÄ‚Ĺ‚w SQL,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy; nie powinien byĂ„â€ˇ jedynĂ„â€¦ kolejkĂ„â€¦.

## Zasada etapÄ‚Ĺ‚w

KaÄąÄ˝dy etap musi mieĂ„â€ˇ:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje juÄąÄ˝ czĂ„â„˘Äąâ€şciowo,
- zakres,
- czego nie ruszaĂ„â€ˇ,
- guard/test,
- test rĂ„â„˘czny dla Damiana,
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

Cel: uporzĂ„â€¦dkowaĂ„â€ˇ wszystkie ostatnie etapy w tym jednym centralnym pliku.
Zakres: kolejka etapÄ‚Ĺ‚w, bez runtime, bez SQL, bez UI.
Warunek zamkniĂ„â„˘cia: ten plik zawiera aktualnĂ„â€¦ kolejnoÄąâ€şĂ„â€ˇ; przyszÄąâ€še etapy nie mogĂ„â€¦ byĂ„â€ˇ tylko w run reports albo payloadach.

---

### 1. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Status: NAJBLIÄąÂ»SZY ETAP DO WDROÄąÂ»ENIA

Cel: przywrÄ‚Ĺ‚ciĂ„â€ˇ realne dyktowanie notatki w CaseDetail.

Kontrakt:

- przycisk `Dyktuj notatkĂ„â„˘` nie moÄąÄ˝e byĂ„â€ˇ disabled ani `wkrÄ‚Ĺ‚tce`,
- uÄąÄ˝ywa SpeechRecognition / webkitSpeechRecognition,
- transkrypcja trafia do notatki sprawy,
- autosave po okoÄąâ€šo 2 sekundach ciszy,
- zapis jako activity/note z `caseId`,
- po hard refresh notatka zostaje,
- nie zapisuje pustych notatek,
- nie tworzy duplikatÄ‚Ĺ‚w autosave,
- brak wsparcia przeglĂ„â€¦darki / odmowa mikrofonu ma jasny komunikat.

Nie ruszaĂ„â€ˇ:

- Google Calendar,
- SQL,
- billing/trial,
- AI Drafts,
- koszty zwrÄ‚Ĺ‚cone R1E,
- global layout.

Run decision: `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`
WÄąâ€šaÄąâ€şciwy etap runtime do utworzenia: `_project/runs/STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md`

---

### 2. STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Status: PO R1D2

Cel: dodaĂ„â€ˇ lekkĂ„â€¦ akcjĂ„â„˘ oznaczania kosztu jako zwrÄ‚Ĺ‚cony / czĂ„â„˘Äąâ€şciowo zwrÄ‚Ĺ‚cony bez tworzenia duÄąÄ˝ego nowego menu.

Kontrakt UX:

- akcja przy konkretnym koszcie, np. `Oznacz zwrot`,
- domyÄąâ€şlna kwota = pozostaÄąâ€šo do zwrotu,
- obsÄąâ€šuga peÄąâ€šnego i czĂ„â„˘Äąâ€şciowego zwrotu,
- data zwrotu domyÄąâ€şlnie dziÄąâ€ş,
- notatka opcjonalna,
- zapis aktualizuje `reimbursedAmount`, `reimbursedAt`, status `partially_reimbursed` / `reimbursed`,
- summary aktualizuje `Koszty zwrÄ‚Ĺ‚cone`, `Koszty do zwrotu`, `Razem do pobrania`.

Nie ruszaĂ„â€ˇ:

- SQL bez wczeÄąâ€şniejszego schema check,
- Google Calendar,
- AI Drafts,
- global finance rewrite.

Run decision/payload: `_project/obsidian_updates/2026-06-14_STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING.md`

---

### 3. STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Status: PO R1E ALBO WCZEÄąĹˇNIEJ, JEÄąĹˇLI SZKICE BLOKUJĂ„â€ž PRACĂ„Â

Cel: rozdzieliĂ„â€ˇ `Szybki szkic` od `Szkicu AI`.

Decyzja produktu:

- `Szybki szkic` = zwykÄąâ€ša notatka/raw capture, wpisana albo dyktowana, zapis bez AI i bez `fullAi`,
- `Szkic AI` = osobna funkcja AI, ktÄ‚Ĺ‚ra analizuje tekst i proponuje akcjĂ„â„˘ do zatwierdzenia,
- uÄąÄ˝ytkownik nie moÄąÄ˝e dostawaĂ„â€ˇ `WORKSPACE_AI_ACCESS_REQUIRED` przy zwykÄąâ€šym szybkim szkicu,
- surowy tekst typu `DzwoniÄąâ€š Piotrek, jutro kontakt w sprawie umowy` ma zostaĂ„â€ˇ zapisany jako notatka/szkic,
- dopiero funkcja AI moÄąÄ˝e zaproponowaĂ„â€ˇ task/follow-up/lead/event do zatwierdzenia.

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

Cel: naprawiĂ„â€ˇ i potwierdziĂ„â€ˇ Google Calendar dla wielu uÄąÄ˝ytkownikÄ‚Ĺ‚w.

Problem:

- backend jest czĂ„â„˘Äąâ€şciowo user-scoped,
- ale task/event create moÄąÄ˝e nadal nie nadawaĂ„â€ˇ ownership fields,
- outbound sync moÄąÄ˝e pomijaĂ„â€ˇ rekordy przez `personalScopeSkipped`,
- trzeba potwierdziĂ„â€ˇ dziaÄąâ€šanie na drugim koncie, nie tylko Damiana.

Zakres:

- `google_calendar_connections` per user,
- task/event ownership fields,
- outbound sync bez fallbacku do konta Damiana,
- UI Settings pokazuje connected/user_not_connected/skipped/created/failed,
- manualny test drugiego konta.

Run decision: `_project/runs/2026-06-14_STAGE_ORDER_UI_THEN_GOOGLE_CALENDAR_AUDIT.md`

---

### 5. STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION

Status: PO GOOGLE CALENDAR ALBO WCZEÄąĹˇNIEJ, JEÄąĹˇLI PRODUKCJA MAILI BLOKUJE RELEASE

Cel: zaÄąâ€šoÄąÄ˝yĂ„â€ˇ/podpiĂ„â€¦Ă„â€ˇ domenĂ„â„˘ i realny fundament maila.

Zakres:

- domena produkcyjna,
- DNS,
- realny sender / dostawca maila,
- SPF / DKIM / DMARC / MX,
- env i diagnostyka konfiguracji,
- test wysyÄąâ€ški,
- brak silent fail.

Run decision: `_project/runs/STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN.md`

---

### 6. STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS

Status: PO K1

Cel: wdroÄąÄ˝yĂ„â€ˇ maile systemowe.

Zakres:

- reset hasÄąâ€ša,
- potwierdzenie zmiany maila,
- potwierdzenie rejestracji,
- potwierdzenie pÄąâ€šatnoÄąâ€şci,
- bÄąâ€šĂ„â€¦d/status pÄąâ€šatnoÄąâ€şci,
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
- brak wysyÄąâ€ški bez realnego mail foundation,
- guard przed duplikatami.

---

### 8. STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING

Status: PO K2/K3

Cel: produkcyjna zakÄąâ€šadka Pomoc / Support.

Zakres:

- formularz zgÄąâ€šoszenia,
- routing do realnego support mailbox / outbox,
- mail potwierdzajĂ„â€¦cy przyjĂ„â„˘cie zgÄąâ€šoszenia,
- status zgÄąâ€šoszenia dla uÄąÄ˝ytkownika,
- brak martwego support tab.

---

### 9. CODEX-AUTO-CONTEXT-001

Status: TECH BACKLOG / PO PILNYCH ETAPACH

Cel: dodaĂ„â€ˇ staÄąâ€šy kontekst dla Codexa i AI developerÄ‚Ĺ‚w.

Zakres:

- `_project/CODEX_CONTEXT_INDEX.md`,
- `scripts/codex-context-pack.ps1`,
- `.codex/skills/*` scan-first skills,
- skrÄ‚Ĺ‚cenie skanÄ‚Ĺ‚w i ograniczenie chaosu.

PowÄ‚Ĺ‚d: w repo nie znaleziono jeszcze `_project/CODEX_CONTEXT_INDEX.md` ani `scripts/codex-context-pack.ps1`.

## ZamkniĂ„â„˘te / aktualnie uznane za domkniĂ„â„˘te etapy UI/detail

### LeadDetail

- `STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT` - technicznie domkniĂ„â„˘ty dla potencjaÄąâ€šu, next action i gÄąâ€šÄ‚Ĺ‚wnego missing_item guardu.
- `STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX` - closeout starej Äąâ€şcieÄąÄ˝ki Brak, delete missing_item overflow i CSS work-row.
- `STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT` - wzmocnienie ukÄąâ€šadu work-row.

Nie traktowaĂ„â€ˇ jako otwarte, chyba ÄąÄ˝e test regresji pokaÄąÄ˝e bÄąâ€šĂ„â€¦d.

### CaseDetail finance/cost closeout chain

Status zbiorczy: PRODUCT_PASS / MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / TECH_PUSHED dla Äąâ€šaÄąâ€žcucha finansÄ‚Ĺ‚w i kosztÄ‚Ĺ‚w, z wyjĂ„â€¦tkiem nowych osobnych etapÄ‚Ĺ‚w R1D2 i R1E.

ZamkniĂ„â„˘te albo objĂ„â„˘te manualnym PASS:

- `STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT` - contractValue/prowizja,
- `STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL` - korekta/usuwanie kosztÄ‚Ĺ‚w,
- `STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION` - peÄąâ€šna korekta wpÄąâ€šat i kosztÄ‚Ĺ‚w,
- `STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR` - naprawa czerwonych guardÄ‚Ĺ‚w i zapisu pÄąâ€šatnoÄąâ€şci,
- `STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG` - koszt `Inny` + checkbox `Koszt do zwrotu`,
- `STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC` - porzĂ„â€¦dek ledgerÄ‚Ĺ‚w,
- `STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS` - manualny PASS Damiana.

Nadal otwarte:

- `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`,
- `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`.

## Backlog produktowy po stabilizacji detail views

### STAGE-A35-OWNER-CONTROL-BASELINE

Status: PO PILNYCH DETAIL/MAIL/CALENDAR LUB JAKO RÄ‚â€śWNOLEGÄąÂY PRODUCT SPRINT

Cel: owner-control audit: co ruszyĂ„â€ˇ, czego nie przegapiĂ„â€ˇ, ktÄ‚Ĺ‚re leady/sprawy stojĂ„â€¦.

Zakres:

- leady bez nastĂ„â„˘pnego kroku,
- leady bez kontaktu 7+ dni,
- leady bez kontaktu 14+ dni,
- sprawy bez ruchu,
- sprawy z wartoÄąâ€şciĂ„â€¦/pieniĂ„â„˘dzmi, ale bez nastĂ„â„˘pnego kroku,
- rekordy bez odpowiedzialnego,
- rekordy z notatkĂ„â€¦, ale bez zadania/follow-upu.

### STAGE-A35B-MANDATORY-NEXT-STEP-CONTRACT

Status: PO A35

Cel: kaÄąÄ˝dy aktywny lead/sprawa ma mieĂ„â€ˇ jasny nastĂ„â„˘pny krok albo Äąâ€şwiadomy status `brak kolejnego kroku`.

### STAGE231A2_DOCUMENT_BLOCKERS_LITE

Status: PO A35B ALBO RÄ‚â€śWNOLEGLE JAKO MAÄąÂY ETAP

Cel: dokumenty/braki jako element kontroli procesu, nie martwe zaÄąâ€šĂ„â€¦czniki.

### STAGE-A41-CONTACT-CADENCE-GRID

Status: PO A35B / PO DOCUMENT_BLOCKERS_LITE

Cel: siatka kontaktu: dziÄąâ€ş, 1d, 2d, 3d, 5d, 7d, 14d.

### STAGE-A42-LOST-LEAD-RESCUE

Status: PO A41

Cel: ekran `Do odzyskania` dla leadÄ‚Ĺ‚w z ciszĂ„â€¦, brakiem kroku i ryzykiem utraty.

### STAGE-A46-SALES-FUNNEL_MOVEMENT_VIEW

Status: PO A41 LUB PO A42

Cel: lejek pokazuje ruch, ciszĂ„â„˘, brak kroku, ryzyko i pieniĂ„â€¦dze, nie tylko etap.

### STAGE-A45-FINANCE-WATCHLIST

Status: PO A42/A46

Cel: lista pieniĂ„â„˘dzy do ruszenia, nie ksiĂ„â„˘gowoÄąâ€şĂ„â€ˇ.

### STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT

Status: PO A35/A41/A42/A45 ORAZ PO STAGE231K1/K2, JEÄąĹˇLI MA IÄąĹˇĂ„â€  MAILEM

Cel: dzienny/tygodniowy raport wÄąâ€šaÄąâ€şciciela jako lista decyzji i ryzyk.

### STAGE-A36-DRAFTS-REBUILD

Status: PO STAGE231J2 / NIE JAKO PIERWSZY WYRÄ‚â€śÄąÂ»NIK

Cel: jedna skrzynka szkicÄ‚Ĺ‚w: rĂ„â„˘czny szkic, wklejony tekst, dyktowanie, parser, AI; zatwierdzanie jako lead/task/event/notatka/follow-up.

### STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER

Status: WYSOKA WARTOÄąĹˇĂ„â€  / PÄ‚â€śÄąÄ…NIEJ, po stabilizacji podstawowego CRM i owner-control core

Cel: znajdowaĂ„â€ˇ okazje sprzedaÄąÄ˝owe po problemie/sygnale, nie budowaĂ„â€ˇ pustej bazy firm.

Podetapy:

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

### STAGE-A47-CONTROL-SPRINT-OFFER

Status: PO A35 DEMO / MOÄąÂ»E IÄąĹˇĂ„â€  JAKO ETAP BIZNESOWY RÄ‚â€śWNOLEGLE

Cel: spiĂ„â€¦Ă„â€ˇ produkt z usÄąâ€šugĂ„â€¦ wdroÄąÄ˝eniowĂ„â€¦ `CloseFlow Control Sprint`.

## Etapy techniczne / safety backlog

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Status: P1 / TECHNICAL SAFETY / DO WYKONANIA PRZED SZERSZYM TESTEM

ZablokowaĂ„â€ˇ publiczne preview routes w produkcji, jeÄąÄ˝eli pokazujĂ„â€¦ prototyp albo dane wyglĂ„â€¦dajĂ„â€¦ce jak realne kontakty.

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Status: PO 232A

SprawdziĂ„â€ˇ, czy statyczne importy LeadDetail/ClientDetail sĂ„â€¦ nadal potrzebne i czy lazy/chunk boundary jest stabilny.

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Status: PO 232B

Auth/env ma fail-closed w produkcji i nie maskowaĂ„â€ˇ zÄąâ€šej konfiguracji service-role fallbackiem.

### STAGE232D_DOCS_ENCODING_SWEEP

Status: PO APP CORE

NaprawiĂ„â€ˇ aktywne README/.env/docs z mojibake bez przepisywania caÄąâ€šej historycznej lawiny.

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Status: PO 232D

RozdzieliĂ„â€ˇ runtime guard od docs/project-memory guard.

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Status: PO 232E

UstaliĂ„â€ˇ jeden gÄąâ€šÄ‚Ĺ‚wny release gate i uporzĂ„â€¦dkowaĂ„â€ˇ runner pod Windows/Linux.

## Warunek aktualizacji tego pliku

Po kaÄąÄ˝dym zatwierdzonym etapie zmieniĂ„â€ˇ status w tym pliku.
Nie zostawiaĂ„â€ˇ kolejnoÄąâ€şci tylko w czacie, run reportach albo payloadach Obsidiana.
JeÄąÄ˝eli powstaje nowy etap, jego ID i kolejnoÄąâ€şĂ„â€ˇ muszĂ„â€¦ trafiĂ„â€ˇ tutaj.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĂ„Ä…Ă˘â‚¬Ĺľ/Zapisz. Etap zastÄ‚â€žĂ˘â€žËpuje runtime file bez kruchych anchorĂ„â€šÄąâ€šw po bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1G2 central product-pass sync for legacy R1D2 guard

Status: PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED
PowĂ„â€šÄąâ€šd wpisu: historyczny guard scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs wymaga dokĂ„Ä…Ă˘â‚¬Ĺˇadnej frazy PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED w centralnym pliku etapĂ„â€šÄąâ€šw. R1G2 wczeĂ„Ä…Ă˘â‚¬Ĺźniej byĂ„Ä…Ă˘â‚¬Ĺˇ potwierdzony manualnie i wypchniÄ‚â€žĂ˘â€žËty, ale po syncu kolejki etapĂ„â€šÄąâ€šw fraza nie byĂ„Ä…Ă˘â‚¬Ĺˇa obecna w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĂ„Ä…Ă˘â‚¬Ĺľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON legacy guard sync

Status: TECH_PUSHED / REQUIRED_BY_LEGACY_GUARD / SOURCE_SYNC
PowĂ„â€šÄąâ€šd wpisu: legacy guard R1D2 R4 wymaga obecnoĂ„Ä…Ă˘â‚¬Ĺźci markera STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON w centralnych ledgerach 04/06/08/10/13 oraz w run/Obsidian payload. Ten wpis nie zmienia runtime; synchronizuje Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo prawdy po wczeĂ„Ä…Ă˘â‚¬Ĺźniejszych etapach R6-R9.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ‚â€žĂ˘â€žËcie klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdĂ„â€šÄąâ€šw legacy markerĂ„â€šÄąâ€šw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĂ„Ä…Ă˘â‚¬Ĺˇny chain guardĂ„â€šÄąâ€šw/testĂ„â€šÄąâ€šw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu guardĂ„â€šÄąâ€šw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‚â€žĂ˘â‚¬Ë‡ podwĂ„â€šÄąâ€šjnie escapowany backslash. Bez tego guard szuka bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu guardĂ„â€šÄąâ€šw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĂ„Ä…Ă„Ëťe wymagaÄ‚â€žĂ˘â‚¬Ë‡ nieistniejÄ‚â€žĂ˘â‚¬Â¦cej skĂ„Ä…Ă˘â‚¬Ĺˇadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujĂ„â€¦ do 5 wpisÄ‚Ĺ‚w, majĂ„â€¦ tooltip peÄąâ€šnej treÄąâ€şci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaÄąâ€šaniach pokazuje treÄąâ€şĂ„â€ˇ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiÄ…zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiązanie notatka/follow-up, ostrzeżenie przy kasowaniu follow-upu z działań i hierarchię tekstu w karcie działania.
