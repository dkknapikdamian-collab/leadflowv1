# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw
Ostatnia regulacja kolejki: 2026-06-14 20:05 Europe/Warsaw
Status: ACTIVE / CANONICAL
Typ: centralna kolejnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ etapĂ„â€šÄąâ€šw rozwoju aplikacji
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdraĂ„Ä…Ă„Ëťamy teraz, co pĂ„â€šÄąâ€šĂ„Ä…ÄąĹşniej i w jakiej kolejnoĂ„Ä…Ă˘â‚¬Ĺźci?
```

To jest **jedyne aktywne Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo prawdy dla kolejki etapĂ„â€šÄąâ€šw**.
Run reporty w `_project/runs/` i payloady w `_project/obsidian_updates/` sÄ‚â€žĂ˘â‚¬Â¦ szczegĂ„â€šÄąâ€šĂ„Ä…Ă˘â‚¬Ĺˇami etapu, dowodami skanu, testami i historiÄ‚â€žĂ˘â‚¬Â¦, ale **nie zastÄ‚â€žĂ˘â€žËpujÄ‚â€žĂ˘â‚¬Â¦ tej kolejki**.

Nie wdraĂ„Ä…Ă„ËťaÄ‚â€žĂ˘â‚¬Ë‡ etapĂ„â€šÄąâ€šw z luĂ„Ä…ÄąĹşnej rozmowy, jeĂ„Ä…Ă˘â‚¬Ĺźli nie sÄ‚â€žĂ˘â‚¬Â¦ wpisane albo potwierdzone w tym pliku.

## PowiÄ‚â€žĂ˘â‚¬Â¦zane pliki centralne

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardĂ„â€šÄąâ€šw/testĂ„â€šÄąâ€šw,
- `_project/08_CHANGELOG_AI.md` - historia zmian,
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu,
- `_project/13_TEST_HISTORY.md` - wyniki testĂ„â€šÄąâ€šw,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testĂ„â€šÄąâ€šw SQL,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy; nie powinien byÄ‚â€žĂ˘â‚¬Ë‡ jedynÄ‚â€žĂ˘â‚¬Â¦ kolejkÄ‚â€žĂ˘â‚¬Â¦.

## Zasada etapĂ„â€šÄąâ€šw

KaĂ„Ä…Ă„Ëťdy etap musi mieÄ‚â€žĂ˘â‚¬Ë‡:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje juĂ„Ä…Ă„Ëť czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowo,
- zakres,
- czego nie ruszaÄ‚â€žĂ˘â‚¬Ë‡,
- guard/test,
- test rÄ‚â€žĂ˘â€žËczny dla Damiana,
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

Cel: uporzÄ‚â€žĂ˘â‚¬Â¦dkowaÄ‚â€žĂ˘â‚¬Ë‡ wszystkie ostatnie etapy w tym jednym centralnym pliku.
Zakres: kolejka etapĂ„â€šÄąâ€šw, bez runtime, bez SQL, bez UI.
Warunek zamkniÄ‚â€žĂ˘â€žËcia: ten plik zawiera aktualnÄ‚â€žĂ˘â‚¬Â¦ kolejnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡; przyszĂ„Ä…Ă˘â‚¬Ĺˇe etapy nie mogÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ tylko w run reports albo payloadach.

---

### 1. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Status: NAJBLIĂ„Ä…Ă‚Â»SZY ETAP DO WDROĂ„Ä…Ă‚Â»ENIA

Cel: przywrĂ„â€šÄąâ€šciÄ‚â€žĂ˘â‚¬Ë‡ realne dyktowanie notatki w CaseDetail.

Kontrakt:

- przycisk `Dyktuj notatkÄ‚â€žĂ˘â€žË` nie moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ disabled ani `wkrĂ„â€šÄąâ€štce`,
- uĂ„Ä…Ă„Ëťywa SpeechRecognition / webkitSpeechRecognition,
- transkrypcja trafia do notatki sprawy,
- autosave po okoĂ„Ä…Ă˘â‚¬Ĺˇo 2 sekundach ciszy,
- zapis jako activity/note z `caseId`,
- po hard refresh notatka zostaje,
- nie zapisuje pustych notatek,
- nie tworzy duplikatĂ„â€šÄąâ€šw autosave,
- brak wsparcia przeglÄ‚â€žĂ˘â‚¬Â¦darki / odmowa mikrofonu ma jasny komunikat.

Nie ruszaÄ‚â€žĂ˘â‚¬Ë‡:

- Google Calendar,
- SQL,
- billing/trial,
- AI Drafts,
- koszty zwrĂ„â€šÄąâ€šcone R1E,
- global layout.

Run decision: `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`
WĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciwy etap runtime do utworzenia: `_project/runs/STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md`

---

### 2. STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Status: PO R1D2

Cel: dodaÄ‚â€žĂ˘â‚¬Ë‡ lekkÄ‚â€žĂ˘â‚¬Â¦ akcjÄ‚â€žĂ˘â€žË oznaczania kosztu jako zwrĂ„â€šÄąâ€šcony / czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowo zwrĂ„â€šÄąâ€šcony bez tworzenia duĂ„Ä…Ă„Ëťego nowego menu.

Kontrakt UX:

- akcja przy konkretnym koszcie, np. `Oznacz zwrot`,
- domyĂ„Ä…Ă˘â‚¬Ĺźlna kwota = pozostaĂ„Ä…Ă˘â‚¬Ĺˇo do zwrotu,
- obsĂ„Ä…Ă˘â‚¬Ĺˇuga peĂ„Ä…Ă˘â‚¬Ĺˇnego i czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowego zwrotu,
- data zwrotu domyĂ„Ä…Ă˘â‚¬Ĺźlnie dziĂ„Ä…Ă˘â‚¬Ĺź,
- notatka opcjonalna,
- zapis aktualizuje `reimbursedAmount`, `reimbursedAt`, status `partially_reimbursed` / `reimbursed`,
- summary aktualizuje `Koszty zwrĂ„â€šÄąâ€šcone`, `Koszty do zwrotu`, `Razem do pobrania`.

Nie ruszaÄ‚â€žĂ˘â‚¬Ë‡:

- SQL bez wczeĂ„Ä…Ă˘â‚¬Ĺźniejszego schema check,
- Google Calendar,
- AI Drafts,
- global finance rewrite.

Run decision/payload: `_project/obsidian_updates/2026-06-14_STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING.md`

---

### 3. STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Status: PO R1E ALBO WCZEĂ„Ä…ÄąË‡NIEJ, JEĂ„Ä…ÄąË‡LI SZKICE BLOKUJÄ‚â€žĂ˘â‚¬Ĺľ PRACÄ‚â€žĂ‚Â

Cel: rozdzieliÄ‚â€žĂ˘â‚¬Ë‡ `Szybki szkic` od `Szkicu AI`.

Decyzja produktu:

- `Szybki szkic` = zwykĂ„Ä…Ă˘â‚¬Ĺˇa notatka/raw capture, wpisana albo dyktowana, zapis bez AI i bez `fullAi`,
- `Szkic AI` = osobna funkcja AI, ktĂ„â€šÄąâ€šra analizuje tekst i proponuje akcjÄ‚â€žĂ˘â€žË do zatwierdzenia,
- uĂ„Ä…Ă„Ëťytkownik nie moĂ„Ä…Ă„Ëťe dostawaÄ‚â€žĂ˘â‚¬Ë‡ `WORKSPACE_AI_ACCESS_REQUIRED` przy zwykĂ„Ä…Ă˘â‚¬Ĺˇym szybkim szkicu,
- surowy tekst typu `DzwoniĂ„Ä…Ă˘â‚¬Ĺˇ Piotrek, jutro kontakt w sprawie umowy` ma zostaÄ‚â€žĂ˘â‚¬Ë‡ zapisany jako notatka/szkic,
- dopiero funkcja AI moĂ„Ä…Ă„Ëťe zaproponowaÄ‚â€žĂ˘â‚¬Ë‡ task/follow-up/lead/event do zatwierdzenia.

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

Cel: naprawiÄ‚â€žĂ˘â‚¬Ë‡ i potwierdziÄ‚â€žĂ˘â‚¬Ë‡ Google Calendar dla wielu uĂ„Ä…Ă„ËťytkownikĂ„â€šÄąâ€šw.

Problem:

- backend jest czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowo user-scoped,
- ale task/event create moĂ„Ä…Ă„Ëťe nadal nie nadawaÄ‚â€žĂ˘â‚¬Ë‡ ownership fields,
- outbound sync moĂ„Ä…Ă„Ëťe pomijaÄ‚â€žĂ˘â‚¬Ë‡ rekordy przez `personalScopeSkipped`,
- trzeba potwierdziÄ‚â€žĂ˘â‚¬Ë‡ dziaĂ„Ä…Ă˘â‚¬Ĺˇanie na drugim koncie, nie tylko Damiana.

Zakres:

- `google_calendar_connections` per user,
- task/event ownership fields,
- outbound sync bez fallbacku do konta Damiana,
- UI Settings pokazuje connected/user_not_connected/skipped/created/failed,
- manualny test drugiego konta.

Run decision: `_project/runs/2026-06-14_STAGE_ORDER_UI_THEN_GOOGLE_CALENDAR_AUDIT.md`

---

### 5. STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION

Status: PO GOOGLE CALENDAR ALBO WCZEĂ„Ä…ÄąË‡NIEJ, JEĂ„Ä…ÄąË‡LI PRODUKCJA MAILI BLOKUJE RELEASE

Cel: zaĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă„ËťyÄ‚â€žĂ˘â‚¬Ë‡/podpiÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ domenÄ‚â€žĂ˘â€žË i realny fundament maila.

Zakres:

- domena produkcyjna,
- DNS,
- realny sender / dostawca maila,
- SPF / DKIM / DMARC / MX,
- env i diagnostyka konfiguracji,
- test wysyĂ„Ä…Ă˘â‚¬Ĺˇki,
- brak silent fail.

Run decision: `_project/runs/STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN.md`

---

### 6. STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS

Status: PO K1

Cel: wdroĂ„Ä…Ă„ËťyÄ‚â€žĂ˘â‚¬Ë‡ maile systemowe.

Zakres:

- reset hasĂ„Ä…Ă˘â‚¬Ĺˇa,
- potwierdzenie zmiany maila,
- potwierdzenie rejestracji,
- potwierdzenie pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci,
- bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d/status pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci,
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
- brak wysyĂ„Ä…Ă˘â‚¬Ĺˇki bez realnego mail foundation,
- guard przed duplikatami.

---

### 8. STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING

Status: PO K2/K3

Cel: produkcyjna zakĂ„Ä…Ă˘â‚¬Ĺˇadka Pomoc / Support.

Zakres:

- formularz zgĂ„Ä…Ă˘â‚¬Ĺˇoszenia,
- routing do realnego support mailbox / outbox,
- mail potwierdzajÄ‚â€žĂ˘â‚¬Â¦cy przyjÄ‚â€žĂ˘â€žËcie zgĂ„Ä…Ă˘â‚¬Ĺˇoszenia,
- status zgĂ„Ä…Ă˘â‚¬Ĺˇoszenia dla uĂ„Ä…Ă„Ëťytkownika,
- brak martwego support tab.

---

### 9. CODEX-AUTO-CONTEXT-001

Status: TECH BACKLOG / PO PILNYCH ETAPACH

Cel: dodaÄ‚â€žĂ˘â‚¬Ë‡ staĂ„Ä…Ă˘â‚¬Ĺˇy kontekst dla Codexa i AI developerĂ„â€šÄąâ€šw.

Zakres:

- `_project/CODEX_CONTEXT_INDEX.md`,
- `scripts/codex-context-pack.ps1`,
- `.codex/skills/*` scan-first skills,
- skrĂ„â€šÄąâ€šcenie skanĂ„â€šÄąâ€šw i ograniczenie chaosu.

PowĂ„â€šÄąâ€šd: w repo nie znaleziono jeszcze `_project/CODEX_CONTEXT_INDEX.md` ani `scripts/codex-context-pack.ps1`.

## ZamkniÄ‚â€žĂ˘â€žËte / aktualnie uznane za domkniÄ‚â€žĂ˘â€žËte etapy UI/detail

### LeadDetail

- `STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT` - technicznie domkniÄ‚â€žĂ˘â€žËty dla potencjaĂ„Ä…Ă˘â‚¬Ĺˇu, next action i gĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwnego missing_item guardu.
- `STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX` - closeout starej Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťki Brak, delete missing_item overflow i CSS work-row.
- `STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT` - wzmocnienie ukĂ„Ä…Ă˘â‚¬Ĺˇadu work-row.

Nie traktowaÄ‚â€žĂ˘â‚¬Ë‡ jako otwarte, chyba Ă„Ä…Ă„Ëťe test regresji pokaĂ„Ä…Ă„Ëťe bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d.

### CaseDetail finance/cost closeout chain

Status zbiorczy: PRODUCT_PASS / MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / TECH_PUSHED dla Ă„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľcucha finansĂ„â€šÄąâ€šw i kosztĂ„â€šÄąâ€šw, z wyjÄ‚â€žĂ˘â‚¬Â¦tkiem nowych osobnych etapĂ„â€šÄąâ€šw R1D2 i R1E.

ZamkniÄ‚â€žĂ˘â€žËte albo objÄ‚â€žĂ˘â€žËte manualnym PASS:

- `STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT` - contractValue/prowizja,
- `STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL` - korekta/usuwanie kosztĂ„â€šÄąâ€šw,
- `STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION` - peĂ„Ä…Ă˘â‚¬Ĺˇna korekta wpĂ„Ä…Ă˘â‚¬Ĺˇat i kosztĂ„â€šÄąâ€šw,
- `STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR` - naprawa czerwonych guardĂ„â€šÄąâ€šw i zapisu pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci,
- `STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG` - koszt `Inny` + checkbox `Koszt do zwrotu`,
- `STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC` - porzÄ‚â€žĂ˘â‚¬Â¦dek ledgerĂ„â€šÄąâ€šw,
- `STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS` - manualny PASS Damiana.

Nadal otwarte:

- `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`,
- `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`.

## Backlog produktowy po stabilizacji detail views

### STAGE-A35-OWNER-CONTROL-BASELINE

Status: PO PILNYCH DETAIL/MAIL/CALENDAR LUB JAKO RĂ„â€šĂ˘â‚¬Ĺ›WNOLEGĂ„Ä…Ă‚ÂY PRODUCT SPRINT

Cel: owner-control audit: co ruszyÄ‚â€žĂ˘â‚¬Ë‡, czego nie przegapiÄ‚â€žĂ˘â‚¬Ë‡, ktĂ„â€šÄąâ€šre leady/sprawy stojÄ‚â€žĂ˘â‚¬Â¦.

Zakres:

- leady bez nastÄ‚â€žĂ˘â€žËpnego kroku,
- leady bez kontaktu 7+ dni,
- leady bez kontaktu 14+ dni,
- sprawy bez ruchu,
- sprawy z wartoĂ„Ä…Ă˘â‚¬ĹźciÄ‚â€žĂ˘â‚¬Â¦/pieniÄ‚â€žĂ˘â€žËdzmi, ale bez nastÄ‚â€žĂ˘â€žËpnego kroku,
- rekordy bez odpowiedzialnego,
- rekordy z notatkÄ‚â€žĂ˘â‚¬Â¦, ale bez zadania/follow-upu.

### STAGE-A35B-MANDATORY-NEXT-STEP-CONTRACT

Status: PO A35

Cel: kaĂ„Ä…Ă„Ëťdy aktywny lead/sprawa ma mieÄ‚â€žĂ˘â‚¬Ë‡ jasny nastÄ‚â€žĂ˘â€žËpny krok albo Ă„Ä…Ă˘â‚¬Ĺźwiadomy status `brak kolejnego kroku`.

### STAGE231A2_DOCUMENT_BLOCKERS_LITE

Status: PO A35B ALBO RĂ„â€šĂ˘â‚¬Ĺ›WNOLEGLE JAKO MAĂ„Ä…Ă‚ÂY ETAP

Cel: dokumenty/braki jako element kontroli procesu, nie martwe zaĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czniki.

### STAGE-A41-CONTACT-CADENCE-GRID

Status: PO A35B / PO DOCUMENT_BLOCKERS_LITE

Cel: siatka kontaktu: dziĂ„Ä…Ă˘â‚¬Ĺź, 1d, 2d, 3d, 5d, 7d, 14d.

### STAGE-A42-LOST-LEAD-RESCUE

Status: PO A41

Cel: ekran `Do odzyskania` dla leadĂ„â€šÄąâ€šw z ciszÄ‚â€žĂ˘â‚¬Â¦, brakiem kroku i ryzykiem utraty.

### STAGE-A46-SALES-FUNNEL_MOVEMENT_VIEW

Status: PO A41 LUB PO A42

Cel: lejek pokazuje ruch, ciszÄ‚â€žĂ˘â€žË, brak kroku, ryzyko i pieniÄ‚â€žĂ˘â‚¬Â¦dze, nie tylko etap.

### STAGE-A45-FINANCE-WATCHLIST

Status: PO A42/A46

Cel: lista pieniÄ‚â€žĂ˘â€žËdzy do ruszenia, nie ksiÄ‚â€žĂ˘â€žËgowoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡.

### STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT

Status: PO A35/A41/A42/A45 ORAZ PO STAGE231K1/K2, JEĂ„Ä…ÄąË‡LI MA IĂ„Ä…ÄąË‡Ä‚â€žĂ˘â‚¬Â  MAILEM

Cel: dzienny/tygodniowy raport wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciciela jako lista decyzji i ryzyk.

### STAGE-A36-DRAFTS-REBUILD

Status: PO STAGE231J2 / NIE JAKO PIERWSZY WYRĂ„â€šĂ˘â‚¬Ĺ›Ă„Ä…Ă‚Â»NIK

Cel: jedna skrzynka szkicĂ„â€šÄąâ€šw: rÄ‚â€žĂ˘â€žËczny szkic, wklejony tekst, dyktowanie, parser, AI; zatwierdzanie jako lead/task/event/notatka/follow-up.

### STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER

Status: WYSOKA WARTOĂ„Ä…ÄąË‡Ä‚â€žĂ˘â‚¬Â  / PĂ„â€šĂ˘â‚¬Ĺ›Ă„Ä…Ă„â€¦NIEJ, po stabilizacji podstawowego CRM i owner-control core

Cel: znajdowaÄ‚â€žĂ˘â‚¬Ë‡ okazje sprzedaĂ„Ä…Ă„Ëťowe po problemie/sygnale, nie budowaÄ‚â€žĂ˘â‚¬Ë‡ pustej bazy firm.

Podetapy:

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

### STAGE-A47-CONTROL-SPRINT-OFFER

Status: PO A35 DEMO / MOĂ„Ä…Ă‚Â»E IĂ„Ä…ÄąË‡Ä‚â€žĂ˘â‚¬Â  JAKO ETAP BIZNESOWY RĂ„â€šĂ˘â‚¬Ĺ›WNOLEGLE

Cel: spiÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ produkt z usĂ„Ä…Ă˘â‚¬ĹˇugÄ‚â€žĂ˘â‚¬Â¦ wdroĂ„Ä…Ă„ËťeniowÄ‚â€žĂ˘â‚¬Â¦ `CloseFlow Control Sprint`.

## Etapy techniczne / safety backlog

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Status: P1 / TECHNICAL SAFETY / DO WYKONANIA PRZED SZERSZYM TESTEM

ZablokowaÄ‚â€žĂ˘â‚¬Ë‡ publiczne preview routes w produkcji, jeĂ„Ä…Ă„Ëťeli pokazujÄ‚â€žĂ˘â‚¬Â¦ prototyp albo dane wyglÄ‚â€žĂ˘â‚¬Â¦dajÄ‚â€žĂ˘â‚¬Â¦ce jak realne kontakty.

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Status: PO 232A

SprawdziÄ‚â€žĂ˘â‚¬Ë‡, czy statyczne importy LeadDetail/ClientDetail sÄ‚â€žĂ˘â‚¬Â¦ nadal potrzebne i czy lazy/chunk boundary jest stabilny.

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Status: PO 232B

Auth/env ma fail-closed w produkcji i nie maskowaÄ‚â€žĂ˘â‚¬Ë‡ zĂ„Ä…Ă˘â‚¬Ĺˇej konfiguracji service-role fallbackiem.

### STAGE232D_DOCS_ENCODING_SWEEP

Status: PO APP CORE

NaprawiÄ‚â€žĂ˘â‚¬Ë‡ aktywne README/.env/docs z mojibake bez przepisywania caĂ„Ä…Ă˘â‚¬Ĺˇej historycznej lawiny.

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Status: PO 232D

RozdzieliÄ‚â€žĂ˘â‚¬Ë‡ runtime guard od docs/project-memory guard.

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Status: PO 232E

UstaliÄ‚â€žĂ˘â‚¬Ë‡ jeden gĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwny release gate i uporzÄ‚â€žĂ˘â‚¬Â¦dkowaÄ‚â€žĂ˘â‚¬Ë‡ runner pod Windows/Linux.

## Warunek aktualizacji tego pliku

Po kaĂ„Ä…Ă„Ëťdym zatwierdzonym etapie zmieniÄ‚â€žĂ˘â‚¬Ë‡ status w tym pliku.
Nie zostawiaÄ‚â€žĂ˘â‚¬Ë‡ kolejnoĂ„Ä…Ă˘â‚¬Ĺźci tylko w czacie, run reportach albo payloadach Obsidiana.
JeĂ„Ä…Ă„Ëťeli powstaje nowy etap, jego ID i kolejnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ muszÄ‚â€žĂ˘â‚¬Â¦ trafiÄ‚â€žĂ˘â‚¬Ë‡ tutaj.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ/Zapisz. Etap zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpuje runtime file bez kruchych anchorÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw po bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1G2 central product-pass sync for legacy R1D2 guard

Status: PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED
PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd wpisu: historyczny guard scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs wymaga dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnej frazy PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED w centralnym pliku etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw. R1G2 wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniej byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ potwierdzony manualnie i wypchniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty, ale po syncu kolejki etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw fraza nie byÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a obecna w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON legacy guard sync

Status: TECH_PUSHED / REQUIRED_BY_LEGACY_GUARD / SOURCE_SYNC
PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd wpisu: legacy guard R1D2 R4 wymaga obecnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci markera STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON w centralnych ledgerach 04/06/08/10/13 oraz w run/Obsidian payload. Ten wpis nie zmienia runtime; synchronizuje Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o prawdy po wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszych etapach R6-R9.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂdÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw legacy markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny chain guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ podwÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇjnie escapowany backslash. Bez tego guard szuka bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe wymagaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ nieistniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cej skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujÄ‚â€žĂ˘â‚¬Â¦ do 5 wpisĂ„â€šÄąâ€šw, majÄ‚â€žĂ˘â‚¬Â¦ tooltip peĂ„Ä…Ă˘â‚¬Ĺˇnej treĂ„Ä…Ă˘â‚¬Ĺźci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaĂ„Ä…Ă˘â‚¬Ĺˇaniach pokazuje treĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiĂ„â€¦zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiÄ…zanie notatka/follow-up, ostrzeĹĽenie przy kasowaniu follow-upu z dziaĹ‚aĹ„ i hierarchiÄ™ tekstu w karcie dziaĹ‚ania.
