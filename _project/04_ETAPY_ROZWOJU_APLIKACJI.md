# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw
Ostatnia regulacja kolejki: 2026-06-14 20:05 Europe/Warsaw
Status: ACTIVE / CANONICAL
Typ: centralna kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw rozwoju aplikacji
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄamy teraz, co pÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ„â€¦Ă„Ä…ÄąĹźniej i w jakiej kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci?
```

To jest **jedyne aktywne Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o prawdy dla kolejki etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw**.
Run reporty w `_project/runs/` i payloady w `_project/obsidian_updates/` sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ szczegÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ami etapu, dowodami skanu, testami i historiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, ale **nie zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂpujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tej kolejki**.

Nie wdraÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw z luÄ‚â€žĂ„â€¦Ă„Ä…ÄąĹźnej rozmowy, jeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşli nie sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wpisane albo potwierdzone w tym pliku.

## PowiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦zane pliki centralne

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- `_project/08_CHANGELOG_AI.md` - historia zmian,
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu,
- `_project/13_TEST_HISTORY.md` - wyniki testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw SQL,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy; nie powinien byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jedynĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kolejkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.

## Zasada etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw

KaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄdy etap musi mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowo,
- zakres,
- czego nie ruszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ,
- guard/test,
- test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny dla Damiana,
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

Cel: uporzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dkowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ wszystkie ostatnie etapy w tym jednym centralnym pliku.
Zakres: kolejka etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, bez runtime, bez SQL, bez UI.
Warunek zamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcia: ten plik zawiera aktualnĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ; przyszÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡e etapy nie mogĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tylko w run reports albo payloadach.

---

### 1. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Status: NAJBLIÄ‚â€žĂ„â€¦Ä‚â€šĂ‚Â»SZY ETAP DO WDROÄ‚â€žĂ„â€¦Ä‚â€šĂ‚Â»ENIA

Cel: przywrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ realne dyktowanie notatki w CaseDetail.

Kontrakt:

- przycisk `Dyktuj notatkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â` nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ disabled ani `wkrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇtce`,
- uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywa SpeechRecognition / webkitSpeechRecognition,
- transkrypcja trafia do notatki sprawy,
- autosave po okoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o 2 sekundach ciszy,
- zapis jako activity/note z `caseId`,
- po hard refresh notatka zostaje,
- nie zapisuje pustych notatek,
- nie tworzy duplikatÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw autosave,
- brak wsparcia przeglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦darki / odmowa mikrofonu ma jasny komunikat.

Nie ruszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ:

- Google Calendar,
- SQL,
- billing/trial,
- AI Drafts,
- koszty zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcone R1E,
- global layout.

Run decision: `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`
WÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciwy etap runtime do utworzenia: `_project/runs/STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md`

---

### 2. STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Status: PO R1D2

Cel: dodaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ lekkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ akcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â oznaczania kosztu jako zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcony / czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowo zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcony bez tworzenia duÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄego nowego menu.

Kontrakt UX:

- akcja przy konkretnym koszcie, np. `Oznacz zwrot`,
- domyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlna kwota = pozostaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o do zwrotu,
- obsÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡uga peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nego i czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowego zwrotu,
- data zwrotu domyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlnie dziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹş,
- notatka opcjonalna,
- zapis aktualizuje `reimbursedAmount`, `reimbursedAt`, status `partially_reimbursed` / `reimbursed`,
- summary aktualizuje `Koszty zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcone`, `Koszty do zwrotu`, `Razem do pobrania`.

Nie ruszaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ:

- SQL bez wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszego schema check,
- Google Calendar,
- AI Drafts,
- global finance rewrite.

Run decision/payload: `_project/obsidian_updates/2026-06-14_STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING.md`

---

### 3. STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Status: PO R1E ALBO WCZEÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇNIEJ, JEÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇLI SZKICE BLOKUJĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąÄľ PRACĂ„â€šĂ˘â‚¬ĹľÄ‚â€šĂ‚Â

Cel: rozdzieliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `Szybki szkic` od `Szkicu AI`.

Decyzja produktu:

- `Szybki szkic` = zwykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a notatka/raw capture, wpisana albo dyktowana, zapis bez AI i bez `fullAi`,
- `Szkic AI` = osobna funkcja AI, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇra analizuje tekst i proponuje akcjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â do zatwierdzenia,
- uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownik nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe dostawaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ `WORKSPACE_AI_ACCESS_REQUIRED` przy zwykÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ym szybkim szkicu,
- surowy tekst typu `DzwoniÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ Piotrek, jutro kontakt w sprawie umowy` ma zostaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ zapisany jako notatka/szkic,
- dopiero funkcja AI moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe zaproponowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ task/follow-up/lead/event do zatwierdzenia.

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

Cel: naprawiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ i potwierdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Google Calendar dla wielu uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownikÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

Problem:

- backend jest czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciowo user-scoped,
- ale task/event create moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe nadal nie nadawaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ownership fields,
- outbound sync moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe pomijaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ rekordy przez `personalScopeSkipped`,
- trzeba potwierdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡anie na drugim koncie, nie tylko Damiana.

Zakres:

- `google_calendar_connections` per user,
- task/event ownership fields,
- outbound sync bez fallbacku do konta Damiana,
- UI Settings pokazuje connected/user_not_connected/skipped/created/failed,
- manualny test drugiego konta.

Run decision: `_project/runs/2026-06-14_STAGE_ORDER_UI_THEN_GOOGLE_CALENDAR_AUDIT.md`

---

### 5. STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION

Status: PO GOOGLE CALENDAR ALBO WCZEÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇNIEJ, JEÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇLI PRODUKCJA MAILI BLOKUJE RELEASE

Cel: zaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ/podpiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ domenĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â i realny fundament maila.

Zakres:

- domena produkcyjna,
- DNS,
- realny sender / dostawca maila,
- SPF / DKIM / DMARC / MX,
- env i diagnostyka konfiguracji,
- test wysyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki,
- brak silent fail.

Run decision: `_project/runs/STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN.md`

---

### 6. STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS

Status: PO K1

Cel: wdroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ maile systemowe.

Zakres:

- reset hasÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a,
- potwierdzenie zmiany maila,
- potwierdzenie rejestracji,
- potwierdzenie pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci,
- bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d/status pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci,
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
- brak wysyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ki bez realnego mail foundation,
- guard przed duplikatami.

---

### 8. STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING

Status: PO K2/K3

Cel: produkcyjna zakÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adka Pomoc / Support.

Zakres:

- formularz zgÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oszenia,
- routing do realnego support mailbox / outbox,
- mail potwierdzajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy przyjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie zgÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oszenia,
- status zgÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡oszenia dla uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownika,
- brak martwego support tab.

---

### 9. CODEX-AUTO-CONTEXT-001

Status: TECH BACKLOG / PO PILNYCH ETAPACH

Cel: dodaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ staÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y kontekst dla Codexa i AI developerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw.

Zakres:

- `_project/CODEX_CONTEXT_INDEX.md`,
- `scripts/codex-context-pack.ps1`,
- `.codex/skills/*` scan-first skills,
- skrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇcenie skanÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i ograniczenie chaosu.

PowÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd: w repo nie znaleziono jeszcze `_project/CODEX_CONTEXT_INDEX.md` ani `scripts/codex-context-pack.ps1`.

## ZamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte / aktualnie uznane za domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte etapy UI/detail

### LeadDetail

- `STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT` - technicznie domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âty dla potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡u, next action i gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwnego missing_item guardu.
- `STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX` - closeout starej Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcieÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄki Brak, delete missing_item overflow i CSS work-row.
- `STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT` - wzmocnienie ukÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adu work-row.

Nie traktowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jako otwarte, chyba Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe test regresji pokaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦d.

### CaseDetail finance/cost closeout chain

Status zbiorczy: PRODUCT_PASS / MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / TECH_PUSHED dla Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľcucha finansÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, z wyjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦tkiem nowych osobnych etapÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R1D2 i R1E.

ZamkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte albo objĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âte manualnym PASS:

- `STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT` - contractValue/prowizja,
- `STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL` - korekta/usuwanie kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- `STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION` - peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡na korekta wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡at i kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- `STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR` - naprawa czerwonych guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw i zapisu pÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci,
- `STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG` - koszt `Inny` + checkbox `Koszt do zwrotu`,
- `STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC` - porzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dek ledgerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw,
- `STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS` - manualny PASS Damiana.

Nadal otwarte:

- `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`,
- `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`.

## Backlog produktowy po stabilizacji detail views

### STAGE-A35-OWNER-CONTROL-BASELINE

Status: PO PILNYCH DETAIL/MAIL/CALENDAR LUB JAKO RÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Äąâ€şWNOLEGÄ‚â€žĂ„â€¦Ä‚â€šĂ‚ÂY PRODUCT SPRINT

Cel: owner-control audit: co ruszyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, czego nie przegapiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, ktÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇre leady/sprawy stojĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦.

Zakres:

- leady bez nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpnego kroku,
- leady bez kontaktu 7+ dni,
- leady bez kontaktu 14+ dni,
- sprawy bez ruchu,
- sprawy z wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦/pieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzmi, ale bez nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpnego kroku,
- rekordy bez odpowiedzialnego,
- rekordy z notatkĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, ale bez zadania/follow-upu.

### STAGE-A35B-MANDATORY-NEXT-STEP-CONTRACT

Status: PO A35

Cel: kaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄdy aktywny lead/sprawa ma mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jasny nastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpny krok albo Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşwiadomy status `brak kolejnego kroku`.

### STAGE231A2_DOCUMENT_BLOCKERS_LITE

Status: PO A35B ALBO RÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Äąâ€şWNOLEGLE JAKO MAÄ‚â€žĂ„â€¦Ä‚â€šĂ‚ÂY ETAP

Cel: dokumenty/braki jako element kontroli procesu, nie martwe zaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦czniki.

### STAGE-A41-CONTACT-CADENCE-GRID

Status: PO A35B / PO DOCUMENT_BLOCKERS_LITE

Cel: siatka kontaktu: dziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹş, 1d, 2d, 3d, 5d, 7d, 14d.

### STAGE-A42-LOST-LEAD-RESCUE

Status: PO A41

Cel: ekran `Do odzyskania` dla leadÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw z ciszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦, brakiem kroku i ryzykiem utraty.

### STAGE-A46-SALES-FUNNEL_MOVEMENT_VIEW

Status: PO A41 LUB PO A42

Cel: lejek pokazuje ruch, ciszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â, brak kroku, ryzyko i pieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dze, nie tylko etap.

### STAGE-A45-FINANCE-WATCHLIST

Status: PO A42/A46

Cel: lista pieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdzy do ruszenia, nie ksiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂgowoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ.

### STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT

Status: PO A35/A41/A42/A45 ORAZ PO STAGE231K1/K2, JEÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇLI MA IÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â  MAILEM

Cel: dzienny/tygodniowy raport wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşciciela jako lista decyzji i ryzyk.

### STAGE-A36-DRAFTS-REBUILD

Status: PO STAGE231J2 / NIE JAKO PIERWSZY WYRÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Äąâ€şÄ‚â€žĂ„â€¦Ä‚â€šĂ‚Â»NIK

Cel: jedna skrzynka szkicÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw: rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny szkic, wklejony tekst, dyktowanie, parser, AI; zatwierdzanie jako lead/task/event/notatka/follow-up.

### STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER

Status: WYSOKA WARTOÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â  / PÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Äąâ€şÄ‚â€žĂ„â€¦Ä‚â€žĂ˘â‚¬Â¦NIEJ, po stabilizacji podstawowego CRM i owner-control core

Cel: znajdowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ okazje sprzedaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄowe po problemie/sygnale, nie budowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ pustej bazy firm.

Podetapy:

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

### STAGE-A47-CONTROL-SPRINT-OFFER

Status: PO A35 DEMO / MOÄ‚â€žĂ„â€¦Ä‚â€šĂ‚Â»E IÄ‚â€žĂ„â€¦Ă„Ä…Ă‹â€ˇĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â  JAKO ETAP BIZNESOWY RÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Äąâ€şWNOLEGLE

Cel: spiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ produkt z usÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ugĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ wdroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeniowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ `CloseFlow Control Sprint`.

## Etapy techniczne / safety backlog

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Status: P1 / TECHNICAL SAFETY / DO WYKONANIA PRZED SZERSZYM TESTEM

ZablokowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ publiczne preview routes w produkcji, jeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli pokazujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ prototyp albo dane wyglĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dajĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ce jak realne kontakty.

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Status: PO 232A

SprawdziĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, czy statyczne importy LeadDetail/ClientDetail sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ nadal potrzebne i czy lazy/chunk boundary jest stabilny.

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Status: PO 232B

Auth/env ma fail-closed w produkcji i nie maskowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ zÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ej konfiguracji service-role fallbackiem.

### STAGE232D_DOCS_ENCODING_SWEEP

Status: PO APP CORE

NaprawiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ aktywne README/.env/docs z mojibake bez przepisywania caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ej historycznej lawiny.

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Status: PO 232D

RozdzieliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ runtime guard od docs/project-memory guard.

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Status: PO 232E

UstaliĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jeden gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇwny release gate i uporzĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦dkowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ runner pod Windows/Linux.

## Warunek aktualizacji tego pliku

Po kaÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄdym zatwierdzonym etapie zmieniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ status w tym pliku.
Nie zostawiaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci tylko w czacie, run reportach albo payloadach Obsidiana.
JeÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeli powstaje nowy etap, jego ID i kolejnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ muszĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ trafiĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tutaj.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ/Zapisz. Etap zastÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âpuje runtime file bez kruchych anchorĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w po bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1G2 central product-pass sync for legacy R1D2 guard

Status: PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED
PowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡d wpisu: historyczny guard scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs wymaga dokĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadnej frazy PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED w centralnym pliku etapĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w. R1G2 wczeĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźniej byĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇ potwierdzony manualnie i wypchniÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âty, ale po syncu kolejki etapĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w fraza nie byĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇa obecna w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON legacy guard sync

Status: TECH_PUSHED / REQUIRED_BY_LEGACY_GUARD / SOURCE_SYNC
PowĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡d wpisu: legacy guard R1D2 R4 wymaga obecnoĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźci markera STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON w centralnych ledgerach 04/06/08/10/13 oraz w run/Obsidian payload. Ten wpis nie zmienia runtime; synchronizuje Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ„â€¦Ă„Ä…ÄąĹşrĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡dĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇo prawdy po wczeĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźniejszych etapach R6-R9.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âcie klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚ÂdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w legacy markerĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇny chain guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w/testĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ podwĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡jnie escapowany backslash. Bez tego guard szuka bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„e wymagaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ nieistniejÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦cej skĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ do 5 wpisÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tooltip peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aniach pokazuje treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiÄ‚â€žĂ˘â‚¬Â¦zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiĂ„â€¦zanie notatka/follow-up, ostrzeÄąÄ˝enie przy kasowaniu follow-upu z dziaÄąâ€šaÄąâ€ž i hierarchiĂ„â„˘ tekstu w karcie dziaÄąâ€šania.

## STAGE_BRANCH_AUDIT_001_MAIN_QUARANTINE_AND_DEV_FREEZE_GUARD - 2026-06-15 18:35 Europe/Warsaw

- Decyzja: CloseFlow pracuje wyłącznie na dev-rollout-freeze.
- main zostaje zablokowany: bez push, bez merge, bez rebase.
- Dozwolony push: git push origin HEAD:dev-rollout-freeze.
- Dodano guard: scripts/check-closeflow-branch-scope.cjs.
- main można czytać tylko read-only i ewentualne dobre fragmenty przenosić ręcznie osobnymi etapami.
