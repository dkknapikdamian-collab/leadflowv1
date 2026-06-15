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


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĹ„/Zapisz. Etap zastÄ™puje runtime file bez kruchych anchorĂłw po bĹ‚Ä™dach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1G2 central product-pass sync for legacy R1D2 guard

Status: PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED
PowĂłd wpisu: historyczny guard scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs wymaga dokĹ‚adnej frazy PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED w centralnym pliku etapĂłw. R1G2 wczeĹ›niej byĹ‚ potwierdzony manualnie i wypchniÄ™ty, ale po syncu kolejki etapĂłw fraza nie byĹ‚a obecna w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĹ„/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON legacy guard sync

Status: TECH_PUSHED / REQUIRED_BY_LEGACY_GUARD / SOURCE_SYNC
PowĂłd wpisu: legacy guard R1D2 R4 wymaga obecnoĹ›ci markera STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON w centralnych ledgerach 04/06/08/10/13 oraz w run/Obsidian payload. Ten wpis nie zmienia runtime; synchronizuje ĹşrĂłdĹ‚o prawdy po wczeĹ›niejszych etapach R6-R9.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ™cie klasy bĹ‚Ä™dĂłw legacy markerĂłw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĹ‚ny chain guardĂłw/testĂłw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĹ‚Ä™du guardĂłw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‡ podwĂłjnie escapowany backslash. Bez tego guard szuka bĹ‚Ä™dnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĹ‚Ä™du guardĂłw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĹĽe wymagaÄ‡ nieistniejÄ…cej skĹ‚adni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazują do 5 wpisów, mają tooltip pełnej treści, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w działaniach pokazuje treść notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powi�zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powi�zanie notatka/follow-up, ostrze�enie przy kasowaniu follow-upu z dzia�a� i hierarchi� tekstu w karcie dzia�ania.

## STAGE_BRANCH_AUDIT_001_MAIN_QUARANTINE_AND_DEV_FREEZE_GUARD - 2026-06-15 18:35 Europe/Warsaw

- Decyzja: CloseFlow pracuje wy��cznie na dev-rollout-freeze.
- main zostaje zablokowany: bez push, bez merge, bez rebase.
- Dozwolony push: git push origin HEAD:dev-rollout-freeze.
- Dodano guard: scripts/check-closeflow-branch-scope.cjs.
- main mo�na czyta� tylko read-only i ewentualne dobre fragmenty przenosi� r�cznie osobnymi etapami.

## STAGE_PROJECT_DOCS_ENCODING_REPAIR_001 - 2026-06-15 19:15 Europe/Warsaw

- Zakres: naprawa mojibake w centralnych plikach _project.
- Runtime: nie ruszano.
- main: nie ruszano.
- Dodano guard: scripts/check-closeflow-project-docs-encoding.cjs.
- Push tylko na dev-rollout-freeze.
