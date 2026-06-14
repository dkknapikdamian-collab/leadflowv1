# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw  
Ostatnia regulacja kolejki: 2026-06-14 20:05 Europe/Warsaw  
Status: ACTIVE / CANONICAL  
Typ: centralna kolejność etapów rozwoju aplikacji  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdrażamy teraz, co później i w jakiej kolejności?
```

To jest **jedyne aktywne źródło prawdy dla kolejki etapów**.  
Run reporty w `_project/runs/` i payloady w `_project/obsidian_updates/` są szczegółami etapu, dowodami skanu, testami i historią, ale **nie zastępują tej kolejki**.

Nie wdrażać etapów z luźnej rozmowy, jeśli nie są wpisane albo potwierdzone w tym pliku.

## Powiązane pliki centralne

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardów/testów,
- `_project/08_CHANGELOG_AI.md` - historia zmian,
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu,
- `_project/13_TEST_HISTORY.md` - wyniki testów,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testów SQL,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy; nie powinien być jedyną kolejką.

## Zasada etapów

Każdy etap musi mieć:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje już częściowo,
- zakres,
- czego nie ruszać,
- guard/test,
- test ręczny dla Damiana,
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

Cel: uporządkować wszystkie ostatnie etapy w tym jednym centralnym pliku.  
Zakres: kolejka etapów, bez runtime, bez SQL, bez UI.  
Warunek zamknięcia: ten plik zawiera aktualną kolejność; przyszłe etapy nie mogą być tylko w run reports albo payloadach.

---

### 1. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Status: NAJBLIŻSZY ETAP DO WDROŻENIA

Cel: przywrócić realne dyktowanie notatki w CaseDetail.

Kontrakt:

- przycisk `Dyktuj notatkę` nie może być disabled ani `wkrótce`,
- używa SpeechRecognition / webkitSpeechRecognition,
- transkrypcja trafia do notatki sprawy,
- autosave po około 2 sekundach ciszy,
- zapis jako activity/note z `caseId`,
- po hard refresh notatka zostaje,
- nie zapisuje pustych notatek,
- nie tworzy duplikatów autosave,
- brak wsparcia przeglądarki / odmowa mikrofonu ma jasny komunikat.

Nie ruszać:

- Google Calendar,
- SQL,
- billing/trial,
- AI Drafts,
- koszty zwrócone R1E,
- global layout.

Run decision: `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`  
Właściwy etap runtime do utworzenia: `_project/runs/STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md`

---

### 2. STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Status: PO R1D2

Cel: dodać lekką akcję oznaczania kosztu jako zwrócony / częściowo zwrócony bez tworzenia dużego nowego menu.

Kontrakt UX:

- akcja przy konkretnym koszcie, np. `Oznacz zwrot`,
- domyślna kwota = pozostało do zwrotu,
- obsługa pełnego i częściowego zwrotu,
- data zwrotu domyślnie dziś,
- notatka opcjonalna,
- zapis aktualizuje `reimbursedAmount`, `reimbursedAt`, status `partially_reimbursed` / `reimbursed`,
- summary aktualizuje `Koszty zwrócone`, `Koszty do zwrotu`, `Razem do pobrania`.

Nie ruszać:

- SQL bez wcześniejszego schema check,
- Google Calendar,
- AI Drafts,
- global finance rewrite.

Run decision/payload: `_project/obsidian_updates/2026-06-14_STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING.md`

---

### 3. STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Status: PO R1E ALBO WCZEŚNIEJ, JEŚLI SZKICE BLOKUJĄ PRACĘ

Cel: rozdzielić `Szybki szkic` od `Szkicu AI`.

Decyzja produktu:

- `Szybki szkic` = zwykła notatka/raw capture, wpisana albo dyktowana, zapis bez AI i bez `fullAi`,
- `Szkic AI` = osobna funkcja AI, która analizuje tekst i proponuje akcję do zatwierdzenia,
- użytkownik nie może dostawać `WORKSPACE_AI_ACCESS_REQUIRED` przy zwykłym szybkim szkicu,
- surowy tekst typu `Dzwonił Piotrek, jutro kontakt w sprawie umowy` ma zostać zapisany jako notatka/szkic,
- dopiero funkcja AI może zaproponować task/follow-up/lead/event do zatwierdzenia.

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

Cel: naprawić i potwierdzić Google Calendar dla wielu użytkowników.

Problem:

- backend jest częściowo user-scoped,
- ale task/event create może nadal nie nadawać ownership fields,
- outbound sync może pomijać rekordy przez `personalScopeSkipped`,
- trzeba potwierdzić działanie na drugim koncie, nie tylko Damiana.

Zakres:

- `google_calendar_connections` per user,
- task/event ownership fields,
- outbound sync bez fallbacku do konta Damiana,
- UI Settings pokazuje connected/user_not_connected/skipped/created/failed,
- manualny test drugiego konta.

Run decision: `_project/runs/2026-06-14_STAGE_ORDER_UI_THEN_GOOGLE_CALENDAR_AUDIT.md`

---

### 5. STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION

Status: PO GOOGLE CALENDAR ALBO WCZEŚNIEJ, JEŚLI PRODUKCJA MAILI BLOKUJE RELEASE

Cel: założyć/podpiąć domenę i realny fundament maila.

Zakres:

- domena produkcyjna,
- DNS,
- realny sender / dostawca maila,
- SPF / DKIM / DMARC / MX,
- env i diagnostyka konfiguracji,
- test wysyłki,
- brak silent fail.

Run decision: `_project/runs/STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN.md`

---

### 6. STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS

Status: PO K1

Cel: wdrożyć maile systemowe.

Zakres:

- reset hasła,
- potwierdzenie zmiany maila,
- potwierdzenie rejestracji,
- potwierdzenie płatności,
- błąd/status płatności,
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
- brak wysyłki bez realnego mail foundation,
- guard przed duplikatami.

---

### 8. STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING

Status: PO K2/K3

Cel: produkcyjna zakładka Pomoc / Support.

Zakres:

- formularz zgłoszenia,
- routing do realnego support mailbox / outbox,
- mail potwierdzający przyjęcie zgłoszenia,
- status zgłoszenia dla użytkownika,
- brak martwego support tab.

---

### 9. CODEX-AUTO-CONTEXT-001

Status: TECH BACKLOG / PO PILNYCH ETAPACH

Cel: dodać stały kontekst dla Codexa i AI developerów.

Zakres:

- `_project/CODEX_CONTEXT_INDEX.md`,
- `scripts/codex-context-pack.ps1`,
- `.codex/skills/*` scan-first skills,
- skrócenie skanów i ograniczenie chaosu.

Powód: w repo nie znaleziono jeszcze `_project/CODEX_CONTEXT_INDEX.md` ani `scripts/codex-context-pack.ps1`.

## Zamknięte / aktualnie uznane za domknięte etapy UI/detail

### LeadDetail

- `STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT` - technicznie domknięty dla potencjału, next action i głównego missing_item guardu.
- `STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX` - closeout starej ścieżki Brak, delete missing_item overflow i CSS work-row.
- `STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT` - wzmocnienie układu work-row.

Nie traktować jako otwarte, chyba że test regresji pokaże błąd.

### CaseDetail finance/cost closeout chain

Status zbiorczy: PRODUCT_PASS / MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / TECH_PUSHED dla łańcucha finansów i kosztów, z wyjątkiem nowych osobnych etapów R1D2 i R1E.

Zamknięte albo objęte manualnym PASS:

- `STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT` - contractValue/prowizja,
- `STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL` - korekta/usuwanie kosztów,
- `STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION` - pełna korekta wpłat i kosztów,
- `STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR` - naprawa czerwonych guardów i zapisu płatności,
- `STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG` - koszt `Inny` + checkbox `Koszt do zwrotu`,
- `STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC` - porządek ledgerów,
- `STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS` - manualny PASS Damiana.

Nadal otwarte:

- `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`,
- `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`.

## Backlog produktowy po stabilizacji detail views

### STAGE-A35-OWNER-CONTROL-BASELINE

Status: PO PILNYCH DETAIL/MAIL/CALENDAR LUB JAKO RÓWNOLEGŁY PRODUCT SPRINT

Cel: owner-control audit: co ruszyć, czego nie przegapić, które leady/sprawy stoją.

Zakres:

- leady bez następnego kroku,
- leady bez kontaktu 7+ dni,
- leady bez kontaktu 14+ dni,
- sprawy bez ruchu,
- sprawy z wartością/pieniędzmi, ale bez następnego kroku,
- rekordy bez odpowiedzialnego,
- rekordy z notatką, ale bez zadania/follow-upu.

### STAGE-A35B-MANDATORY-NEXT-STEP-CONTRACT

Status: PO A35

Cel: każdy aktywny lead/sprawa ma mieć jasny następny krok albo świadomy status `brak kolejnego kroku`.

### STAGE231A2_DOCUMENT_BLOCKERS_LITE

Status: PO A35B ALBO RÓWNOLEGLE JAKO MAŁY ETAP

Cel: dokumenty/braki jako element kontroli procesu, nie martwe załączniki.

### STAGE-A41-CONTACT-CADENCE-GRID

Status: PO A35B / PO DOCUMENT_BLOCKERS_LITE

Cel: siatka kontaktu: dziś, 1d, 2d, 3d, 5d, 7d, 14d.

### STAGE-A42-LOST-LEAD-RESCUE

Status: PO A41

Cel: ekran `Do odzyskania` dla leadów z ciszą, brakiem kroku i ryzykiem utraty.

### STAGE-A46-SALES-FUNNEL_MOVEMENT_VIEW

Status: PO A41 LUB PO A42

Cel: lejek pokazuje ruch, ciszę, brak kroku, ryzyko i pieniądze, nie tylko etap.

### STAGE-A45-FINANCE-WATCHLIST

Status: PO A42/A46

Cel: lista pieniędzy do ruszenia, nie księgowość.

### STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT

Status: PO A35/A41/A42/A45 ORAZ PO STAGE231K1/K2, JEŚLI MA IŚĆ MAILEM

Cel: dzienny/tygodniowy raport właściciela jako lista decyzji i ryzyk.

### STAGE-A36-DRAFTS-REBUILD

Status: PO STAGE231J2 / NIE JAKO PIERWSZY WYRÓŻNIK

Cel: jedna skrzynka szkiców: ręczny szkic, wklejony tekst, dyktowanie, parser, AI; zatwierdzanie jako lead/task/event/notatka/follow-up.

### STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER

Status: WYSOKA WARTOŚĆ / PÓŹNIEJ, po stabilizacji podstawowego CRM i owner-control core

Cel: znajdować okazje sprzedażowe po problemie/sygnale, nie budować pustej bazy firm.

Podetapy:

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

### STAGE-A47-CONTROL-SPRINT-OFFER

Status: PO A35 DEMO / MOŻE IŚĆ JAKO ETAP BIZNESOWY RÓWNOLEGLE

Cel: spiąć produkt z usługą wdrożeniową `CloseFlow Control Sprint`.

## Etapy techniczne / safety backlog

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Status: P1 / TECHNICAL SAFETY / DO WYKONANIA PRZED SZERSZYM TESTEM

Zablokować publiczne preview routes w produkcji, jeżeli pokazują prototyp albo dane wyglądające jak realne kontakty.

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Status: PO 232A

Sprawdzić, czy statyczne importy LeadDetail/ClientDetail są nadal potrzebne i czy lazy/chunk boundary jest stabilny.

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Status: PO 232B

Auth/env ma fail-closed w produkcji i nie maskować złej konfiguracji service-role fallbackiem.

### STAGE232D_DOCS_ENCODING_SWEEP

Status: PO APP CORE

Naprawić aktywne README/.env/docs z mojibake bez przepisywania całej historycznej lawiny.

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Status: PO 232D

Rozdzielić runtime guard od docs/project-memory guard.

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Status: PO 232E

Ustalić jeden główny release gate i uporządkować runner pod Windows/Linux.

## Warunek aktualizacji tego pliku

Po każdym zatwierdzonym etapie zmienić status w tym pliku.  
Nie zostawiać kolejności tylko w czacie, run reportach albo payloadach Obsidiana.  
Jeżeli powstaje nowy etap, jego ID i kolejność muszą trafić tutaj.
