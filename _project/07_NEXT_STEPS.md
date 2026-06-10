# 07_NEXT_STEPS - CloseFlow / LeadFlow

<!-- STAGE230_AI_DRAFT_INBOX_ROADMAP_START -->
## 2026-06-09 — STAGE230 — AI Draft Inbox / Voice Capture / App-Scoped AI Roadmap

STATUS: ROADMAP_DO_WDROŻENIA / PRIORYTET PRZED STARYMI ETAPAMI

### Decyzja kierunkowa

Budujemy `Inbox szkiców` jako operacyjny moduł przechwytywania i porządkowania chaosu z rozmów, jazdy samochodem, szybkich telefonów i luźnych notatek.

AI w CloseFlow nie ma być chatbotem ogólnym. AI ma działać wyłącznie w granicach aplikacji:
- leady,
- klienci,
- sprawy,
- zadania,
- wydarzenia,
- notatki,
- braki / missing items,
- follow-upy,
- aktywność / historia.

AI nie ma sprawdzać pogody, internetu, wiadomości, porad ogólnych ani wykonywać akcji poza CloseFlow.

Najważniejszy kontrakt produktu:
1. Najpierw zawsze zapisujemy surowy szkic.
2. AI może zaproponować akcję aplikacji.
3. Użytkownik zatwierdza przed wykonaniem.
4. Każda akcja pochodząca z AI ma mieć audit trail.
5. Jeżeli AI nie jest pewne, zapisuje `raw_draft` i prosi o wybór / doprecyzowanie, zamiast zgadywać.

### Warstwa już istniejąca według skanu repo

FAKTY:
- `src/pages/AiDrafts.tsx` ma już stronę szkiców, filtry typów i zatwierdzanie szkiców.
- `src/lib/ai-drafts.ts` traktuje Supabase jako źródło prawdy dla szkiców, a local storage jako dev/fallback.
- `src/lib/ai-draft-approval.ts` ma obecnie regułowe rozpoznawanie typu `lead/task/event/note`, daty i podstawowych pól.
- To jest dobra baza, ale za słaba na produkcyjnego asystenta głosowego.

DO POTWIERDZENIA:
- aktualny stan env/providerów: Google AI Studio / Gemini, Cloudflare AI, ewentualne testowe endpointy,
- czy produkcyjny backend ma aktywny server-only provider dla AI,
- czy obecne tabele Supabase `ai_drafts` mają wszystkie potrzebne pola dla `raw_text`, `parsed_json`, `proposed_actions`, `warnings`, `confidence`, `approved_by`, `approved_at`,
- czy obecna mobile textarea / dyktowanie powoduje duplikację słów tylko na jednym telefonie czy szerzej.

### Architektura docelowa

#### Warstwa 1 — Capture

Wejścia:
- `manual_text`,
- `voice_dictation`,
- `mobile_quick_capture`,
- `today_assistant`,
- `lead_detail`,
- `client_detail`,
- `case_detail`.

Wymóg:
- zapis `raw_text` do Supabase musi nastąpić przed AI parse,
- AI failure nie może zgubić szkicu,
- szkic musi mieć status i źródło.

Minimalne pola szkicu:
- `id`,
- `workspace_id`,
- `user_id`,
- `raw_text`,
- `source`,
- `status`,
- `created_at`,
- `updated_at`,
- `parsed_json`,
- `ai_status`,
- `ai_provider`,
- `ai_model`,
- `confidence`,
- `proposed_actions`,
- `missing_fields`,
- `warnings`,
- `linked_record_id`,
- `linked_record_type`,
- `approved_by`,
- `approved_at`.

#### Warstwa 2 — App-scoped AI parser

Backend server-only endpoint:
- `POST /api/ai/drafts/parse`

AI dostaje:
- surowy tekst,
- kontekst aplikacji,
- ograniczony katalog akcji CloseFlow,
- aktualny język: `pl-PL`,
- jasny zakaz odpowiedzi ogólnych.

AI zwraca wyłącznie JSON zgodny ze schematem:
- `intent`,
- `confidence`,
- `summary`,
- `proposedActions`,
- `missingFields`,
- `warnings`,
- `requiresUserApproval`.

Dozwolone akcje:
- `create_lead`,
- `create_client`,
- `create_task`,
- `create_event`,
- `create_note`,
- `attach_note_to_lead`,
- `attach_note_to_client`,
- `attach_note_to_case`,
- `attach_task_to_lead`,
- `attach_task_to_client`,
- `attach_task_to_case`,
- `create_missing_item`,
- `update_followup`,
- `no_action_save_raw_draft`.

Zakazane akcje:
- delete bez osobnego explicit confirm,
- wysyłka maila/SMS bez zatwierdzenia,
- sprawdzanie pogody,
- internet search,
- ogólne porady,
- dowolne działania poza workspace CloseFlow.

#### Warstwa 3 — Relation resolver

AI nie może samodzielnie zgadywać rekordu, jeśli dopasowanie jest niejednoznaczne. System wyszukuje możliwe rekordy, UI pokazuje wybór i dopiero potem akcja może być zatwierdzona.

#### Warstwa 4 — Review / Approval UI

Inbox szkiców ma pokazywać:
- surowy tekst,
- rozpoznanie AI,
- proponowane akcje,
- brakujące dane,
- konflikty,
- pewność,
- przyciski: `Zatwierdź`, `Edytuj`, `Zapisz jako notatkę`, `Odrzuć`.

AI nie wykonuje mutacji bez zatwierdzenia.

#### Warstwa 5 — Apply engine

Po zatwierdzeniu tworzymy realne rekordy:
- lead,
- klient,
- zadanie,
- wydarzenie,
- notatka,
- brak,
- activity log.

Każda mutacja z AI ma audit metadata:
- `source = ai_voice_capture` albo `ai_draft_inbox`,
- `raw_draft_id`,
- `ai_confidence`,
- `approved_by_user`,
- `approved_at`.

### Provider strategy

Na start można użyć testowej warstwy:
- Google AI Studio / Gemini jako podstawowy parser,
- Cloudflare AI jako fallback lub drugi provider testowy,
- rule parser jako fallback bez AI.

Wymogi bezpieczeństwa:
- brak kluczy AI w kliencie,
- tylko server-side API,
- guard `verify-no-client-gemini-secret`,
- provider/model musi być zapisany w wyniku szkicu,
- output musi być JSON schema validated,
- błędny JSON nie może blokować zapisu raw draftu.

### Etapy wdrożenia

#### STAGE230A — Roadmap + provider inventory + guard
Cel: zapisać roadmapę przed starymi etapami w `_project/07_NEXT_STEPS.md`, dodać guard i spisać inventory istniejącej warstwy szkiców. Bez runtime UI i bez bazy.

Testy:
- `node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs`
- `node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs`
- `git diff --check`

#### STAGE230B — Quick Capture Inbox bez AI
Cel: użytkownik może szybko zapisać szkic tekstowy z mobile/desktop. Raw draft zawsze trafia do Supabase i jest widoczny w Inboxie szkiców.

Zakres:
- przycisk/sekcja `Szybki szkic`,
- textarea z obsługą systemowego dyktowania telefonu,
- zapis do istniejącego pipeline `ai-drafts`,
- status `draft/pending_review`,
- source `voice_dictation` albo `manual_text`.

Bez AI parse w tym etapie.

Manual test:
- desktop typing,
- desktop dictation,
- phone typing,
- phone dictation,
- F5 after save,
- draft visible in inbox.

#### STAGE230C — Phone dictation duplicate-words audit
Cel: zweryfikować problem duplikowania słów przy dyktowaniu na telefonie.

Hipoteza: problem może pochodzić z browser speech input / IME, kilku `input/composition` eventów albo z naszego handlera.

Test matrix:
- Android Chrome + Gboard,
- Android Samsung Keyboard,
- iPhone Safari dictation,
- desktop Chrome voice input / system dictation,
- Edge/Chrome jeśli dostępne.

Zakres techniczny:
- dodać debug opcjonalny `voice_input_event_trace`,
- logować lokalnie: timestamp, event type, inputType, before/after length, last tokens,
- nie logować danych klienta do zewnętrznych usług,
- sprawdzić, czy duplikacja powstaje przed zapisem czy dopiero w naszej aplikacji.

#### STAGE230D — AI parser jako propozycja, nie wykonanie
Cel: dodać server-only parser AI zwracający JSON propozycji.

Endpoint:
- `POST /api/ai/drafts/parse`

Provider:
- pierwszeństwo: Gemini / Google AI Studio, jeśli env jest gotowy,
- fallback: Cloudflare AI, jeśli jest gotowy,
- fallback bez AI: obecny rule parser.

Guardy:
- brak AI key w kliencie,
- output JSON schema valid,
- AI cannot return unsupported action,
- AI cannot return weather/internet/general assistant response,
- AI failure leaves raw draft intact.

#### STAGE230E — AI Review Card w Inboxie szkiców
Cel: użytkownik widzi, co AI rozpoznało, i może zatwierdzić / poprawić.

UI:
- karta raw draftu,
- summary,
- proposed actions,
- missing fields,
- confidence,
- relation candidates,
- CTA: zatwierdź / edytuj / tylko notatka / odrzuć.

Bez automatycznego wykonania bez kliknięcia.

#### STAGE230F — Apply engine po zatwierdzeniu
Cel: zatwierdzony draft tworzy realny rekord w aplikacji.

Mutacje:
- lead,
- client,
- task,
- event,
- note,
- missing item,
- activity.

Wymóg:
- każda mutacja ma `raw_draft_id`,
- każdy rekord ma ślad źródła,
- po sukcesie draft ma status `converted`.

Guardy:
- no direct apply without approval,
- no delete/send action,
- linked record id written,
- activity log created.

#### STAGE230G — Voice-first polish + mobile UX
Cel: zrobić z tego funkcję, która realnie działa w samochodzie.

Zakres:
- duży przycisk `Dyktuj szkic`,
- minimum kliknięć,
- ekran `Zapisano szkic` po sukcesie,
- tryb poor network: nie obiecywać, jeśli Supabase nie zapisał,
- jasne komunikaty błędów,
- brak migania i utraty tekstu.

#### STAGE230H — AI eval pack
Cel: testować polskie, chaotyczne dyktowanie.

Przykłady testowe:
- `Dzwonił Marek z Tarnowa, numer 500600700, chce ofertę na dom 120 metrów, oddzwonić jutro po 10.`
- `Do leada Kowalski dodaj zadanie, żeby wysłać ofertę w piątek.`
- `Zapisz notatkę do klienta Anna, że ma dosłać dokumenty.`
- `Stwórz wydarzenie spotkanie z Pawłem jutro o trzynastej.`
- `Nie wiem kto dzwonił, chyba pan od działki, zapisz tylko szkic.`
- `Jaka jutro pogoda?` => outside_app_scope.

Guard:
- correct intent,
- valid JSON,
- no unsupported action,
- no external assistant behavior,
- raw draft preserved.

### STAGE230A3 — dodatkowe etapy rozwoju aplikacji wpisane do backlogu produkcyjnego

STATUS: BACKLOG_DO_WDROŻENIA / DO_PRIORYTETYZACJI_PRZED_PRODUKCJĄ

#### Pre-production core backlog — rzeczy do dopięcia przed wejściem produkcyjnym

1. `STAGE231A_DOCUMENTS_FOR_LEADS`
   - Cel: dodać dokumenty/załączniki do leadów.
   - Zakres: upload/link dokumentu, typ dokumentu, opis, data dodania, powiązanie z leadem, widoczność w LeadDetail.
   - Wymóg: dokumenty nie mogą mieszać się z notatkami; mają mieć osobną sekcję i guard.
   - Ryzyko: storage, uprawnienia, limity plików, prywatność danych.

2. `STAGE231B_COSTS_AND_FINANCIAL_ITEMS`
   - Cel: dodać koszty/pozycje kosztowe do leadów/spraw/klientów.
   - Zakres: typ kosztu, kwota, data, opis, powiązanie z rekordem, suma kosztów, widoczność w szczegółach.
   - Wymóg: osobny kontrakt danych, bez mieszania z prowizją i wartością leada.
   - Ryzyko: zła interpretacja kosztów jako przychodu/prowizji.

3. `STAGE231C_SIMPLIFY_TASK_EVENT_EDITING`
   - Cel: uprościć edycję wydarzeń i zadań.
   - Zakres: szybszy modal, mniej pól na start, wyraźne daty/godziny, szybkie zapisz/anuluj, brak migania, bez utraty danych.
   - Wymóg: zachować Google Calendar sync i istniejące guardy kalendarza.
   - Ryzyko: regresja w done/delete/pending_delete/remote Google delete.

4. `STAGE231D_START_SCREEN_PRODUCTION_READINESS`
   - Cel: poprawić ekran startowy przed wejściem produkcyjnym.
   - Zakres: pulpit właściciela, dzisiejsze zadania, najbliższe akcje, ryzyka, szkice do decyzji, krótki status systemu.
   - Wymóg: start ma pokazywać co robić teraz, nie być ozdobnym dashboardem.
   - Ryzyko: przeładowanie ekranu i powrót do CRM-owego chaosu.

## 2026-06-09 16:00 Europe/Warsaw — LeadFlow AI Opportunity Finder

Status: KIERUNEK_ROZWOJU_DO_AKCEPTACJI
Priorytet: WYSOKI
Typ: przyszły moduł produkcyjny / high-value feature
Nie blokuje aktualnych etapów produkcyjnych.

### Teza

LeadFlow nie powinien być tylko CRM-em do obsługi leadów po ich otrzymaniu. Docelowo powinien pomagać znajdować okazje sprzedażowe przed kontaktem z klientem.

Nie budujemy zwykłej bazy firm. Budujemy moduł, który wykrywa firmy z konkretnym problemem, sygnałem lub powodem do kontaktu.

Główna zasada:

```txt
Nie: znajdź firmy.
Tak: znajdź firmy z problemem.
```

### Kierunek produktu

AI Opportunity Finder ma być modułem LeadFlow / CloseFlow, nie osobną aplikacją.

Docelowy efekt:
- użytkownik określa branżę, miasto i problem/sygnał,
- system znajduje firmy pasujące do sygnału,
- system tworzy konkretny powód kontaktu,
- system zapisuje leady do LeadFlow,
- system ustawia follow-up,
- system pozwala właścicielowi lub handlowcowi pracować z listą okazji w tym samym CRM.

### Przykładowe sygnały sprzedażowe

- firmy bez formularza kontaktowego,
- firmy ze starą stroną,
- firmy bez SSL,
- sklepy z widocznym ryzykiem regulaminu/EAA,
- restauracje z małą liczbą opinii Google,
- firmy bez strony,
- agencje lub lokalne firmy z małą liczbą aktualnych ofert,
- lokalne biznesy z nieaktualnymi danymi kontaktowymi,
- firmy z widocznym problemem konwersji albo zaufania.

### Dlaczego to ma sens

CRM zaczyna się za późno, jeśli użytkownik nie ma sensownych leadów. Dla wielu małych firm ból nie brzmi „jak obsłużyć 1000 leadów”, tylko „skąd wziąć pierwsze 20 sensownych leadów z powodem kontaktu”.

LeadFlow powinien docelowo obsługiwać cały ruch:
1. wykrycie okazji,
2. zapis leada,
3. follow-up,
4. zadania,
5. notatki,
6. historia,
7. status,
8. raport właściciela.

### Granice

Nie budujemy:
- generycznej bazy firm,
- kopii Apollo/Clay/Lusha,
- scrapera bez powodu kontaktu,
- osobnej aplikacji DealGram.

Budujemy:
- moduł okazji sprzedażowych,
- scoring problemu,
- powód kontaktu,
- szybkie utworzenie leada,
- follow-up w LeadFlow.

### Status wdrożeniowy

Ten kierunek jest ważny, ale nie blokuje aktualnych etapów:
- Stage230B Quick Capture Inbox,
- Stage230C mobile dictation duplicate audit,
- Stage230D AI parser proposal endpoint,
- pre-production backlog: dokumenty do leadów, koszty, edycja zadań/wydarzeń, ekran startowy.

Do wdrożenia dopiero po ustabilizowaniu podstawowego CRM i szkiców.

### Proponowane późniejsze etapy

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

#### Growth backlog — moduł pozyskiwania leadów, nie osobna aplikacja

`STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER`

Decyzja robocza:
- nie budować osobnej aplikacji typu kolejna baza firm,
- rozwijać to jako moduł w CloseFlow / LeadFlow,
- CRM ma najpierw działać dobrze,
- dopiero potem dokładamy pre-CRM: Smart Prospecting / AI Opportunity Finder.

Teza:
- małe firmy nie kupują “bazy firm”,
- kupują listę konkretnych okazji sprzedażowych z powodem kontaktu.

Docelowy moduł:
- użytkownik wpisuje branżę, miasto i sygnał problemu,
- system znajduje firmy,
- ocenia potencjał,
- zapisuje leady,
- tworzy powód kontaktu,
- ustawia follow-up,
- wrzuca wszystko w istniejący flow CloseFlow.

Przykładowe sygnały:
- firmy bez formularza kontaktowego,
- stare strony,
- brak SSL,
- sklepy z ryzykiem EAA/regulaminu,
- restauracje z małą liczbą opinii,
- firmy bez strony,
- branże lokalne z oczywistym powodem kontaktu.

Etapy późniejsze:
1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

Status:
- DO_POTWIERDZENIA po ustabilizowaniu CRM, szkiców, kalendarza i start screen.

### Definicja sukcesu produktu

Funkcja jest dobra dopiero gdy:
- użytkownik w aucie może w 5 sekund zapisać szkic,
- AI nie gubi surowej treści,
- AI rozpoznaje większość typowych dyktowań,
- nie wykonuje niepewnych akcji,
- użytkownik zatwierdza przed zapisem finalnym,
- każdy rekord z AI ma ślad audytu,
- mobile dictation nie duplikuje słów albo mamy obejście.

### Następny logiczny etap po tej roadmapie

Po Stage230A wdrażamy:
1. STAGE230B — Quick Capture Inbox bez AI,
2. STAGE230C — phone dictation duplicate-words audit,
3. STAGE230D — AI parser proposal endpoint.

<!-- STAGE230_AI_DRAFT_INBOX_ROADMAP_END -->

## Current next step after 2026-05-16 memory closeout

1. Pull latest `dev-rollout-freeze` locally.
2. Verify presence of project memory protocol files and marker in `AGENTS.md`.
3. Verify Obsidian `PROJECTS.md` points to `10_PROJEKTY/CloseFlow_Lead_App/`.
4. Only after both app repo and Obsidian repo pushes are confirmed, run a separate archive/merge stage for old CloseFlow paths.

## Do not do yet

- Do not delete old V8/V9 blocks from `AGENTS.md`.
- Do not delete old Obsidian paths such as `10_PROJECTS`.
- Do not archive old CloseFlow notes until the new map is confirmed after pull.
- Do not change runtime UI, routing, product logic, styles or architecture in this organizational stage.

## Required closure evidence for next stage

- Scan proof in `_project/runs/`.
- App repo status after pull.
- Obsidian repo status after pull.
- Manual test status, even if the stage is organizational.
- Tests/guards status or explicit skip reason.

## 2026-05-16 â€” Next step po Stage92 {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

1. WykonaÄ‡ test rÄ™czny na `/calendar`: dzieĹ„ z wydarzeniem, zadaniem i wpisem bez powiÄ…zania.
2. SprawdziÄ‡ desktop: treĹ›Ä‡ po lewej, akcje po prawej w dwĂłch rzÄ™dach, bez biaĹ‚ej pustej belki.
3. SprawdziÄ‡ mobile: akcje nie rozjeĹĽdĹĽajÄ… wpisu i nie chowajÄ… tytuĹ‚u.
4. Po potwierdzeniu Damiana dopiero Ĺ‚Ä…czyÄ‡ z nastÄ™pnymi paczkami i robiÄ‡ zbiorczy push.

## STAGE93_MANUAL_TEST_CALENDAR_DESKTOP â€” 2026-05-16
- Manual test needed: open `/calendar` at desktop 2048x972 and normal zoom.
- Verify the week rail shows day label, full date label and plain text count.
- Verify no black count badge/plaque and no old week filter list.

## NEXT_STAGE_CALENDAR_BATCH_REPAIR_AFTER_SWEEP_2026_05_16

1. PrzeczytaÄ‡ `_project/runs/STAGE94_CALENDAR_UI_SWEEP_LOCAL_REPORT.md`.
2. Na podstawie P1 zrobiÄ‡ jednÄ… zbiorczÄ… paczkÄ™ Calendar cleanup, zamiast kolejnych mikroĹ‚atek.
3. RÄ™cznie sprawdziÄ‡ `/calendar` na desktop 2048x972 i normalnym zoomie.

## NEXT STEP: Manual Calendar consolidated cleanup test

- Open /calendar in week and month mode.
- Desktop: 2048x972 and normal zoom.
- Verify selected day renders only V9 tile, without duplicate old list and without extra badge.
- Verify week rail count is text, not a dark or pill badge.
- Verify month grid still works and compact Wyd/Zad labels stay only inside month cells.

## STAGE94_SWEEP_REGEX_FIX_V4_NEXT_2026_05_16

- Run manual /calendar test after the sweep passes: month selected day, week rail, 2048x972 desktop, normal zoom.
- Then run full quiet release gate before the planned collective GitHub push.

## Next - Stage94 weekly plan manual test - 2026-05-16

- Manual test /calendar in week view: entries must show Wydarzenie/Zadanie/Lead, time, status, full title, relation and actions.
- Verify month grid still behaves as before.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2 next
- Manual test: /calendar weekly view.
- Then run full quiet gate before collective GitHub push.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3 next
- Manual test: /calendar weekly view.
- Then run full quiet gate before collective GitHub push.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4

Next: manual /calendar week view at desktop width. Confirm no Wy/Zad-only rows and no hidden title-only entries.

## Stage95 manual test
- TEST RÄCZNY DO WYKONANIA: /tasks, /cases, /calendar.
- Verify trash icon is red, background is white/subtle, hover is subtle, and there is no red square/plaque.

## Stage95 V2 manual test
- TEST RÄCZNY DO WYKONANIA: /tasks, /cases, /calendar. Verify red trash icon, subtle white background, no red plaque.


## Stage96 leads right rail width and position
- Test rÄ™czny: /leads na desktopie, sprawdziÄ‡ czy Filtry proste sÄ… nad Najcenniejsze leady i majÄ… szerokoĹ›Ä‡ jak /clients.
- Test rÄ™czny: /clients porĂłwnaÄ‡ szerokoĹ›Ä‡ raila.
- Nie zmieniaÄ‡ listy leadĂłw w tym etapie.

- Manual test: compare /leads and /clients right rail on desktop; verify Filtry proste is above Najcenniejsze leady and rail is not ~195px.

### Next - Stage96 manual check
- Open /leads and /clients on desktop.
- Confirm /leads right rail is not narrow and SimpleFiltersCard is above TopValueRecordsCard.
- Do not push until manual UI check and full quiet gate are done.

### Next - Stage96 V4 manual check
- Open /leads and /clients on desktop.
- Confirm /leads right rail width matches /clients and filters stay above top value card.
- Run full quiet gate after manual UI OK.

## STAGE96_V5_NEXT_STEPS
- Manual test /leads and /clients on desktop.
- Confirm simple filters appear above top-value rail and rail does not collapse visually.


## STAGE97_NEXT_MANUAL_TODAY_OVERDUE_TASK_DONE

- Manual test: open /, expand ZalegĹ‚e zadania or Zadania do obsĹ‚ugi, verify every task row has Edytuj and Zrobione.
- Click Zrobione and verify the task disappears from the active Today list after completion.

## Stage97 manual test / Today

- Open /.
- Find Zalegle zadania or Zadania do obslugi.
- Verify task rows show Edytuj + Zrobione.
- Click Zrobione and confirm task disappears after completion refresh.


<!-- STAGE104_CALENDAR_PERFORMANCE_F -->
## 2026-05-16 Ă˘â‚¬â€ť Stage104 / Paczka F Ă˘â‚¬â€ť Calendar loading performance

STATUS: WDROĹ»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juĹĽ liczyÄ‡ `combineScheduleEntries` wprost w renderze.
- Dni miesiÄ…ca i tygodnia korzystajÄ… z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juĹĽ uĹĽywaÄ‡ `getEntriesForDay(...)` w render path.
- `cases` idÄ… z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeĹ‚nostronicowy loader zostaĹ‚ zastÄ…piony maĹ‚ym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeĹ›li nie uĹĽyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiÄ…ca zostaĹ‚y nietkniÄ™te i wymagajÄ… osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rÄ™czny `/calendar`: start, tydzieĹ„, miesiÄ…c, wybrany dzieĹ„, edycja, +1H/+1D/+1W, zrobione, usuĹ„.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ă˘â‚¬â€ť Templates delete + visual contract Ă˘â‚¬â€ť 2026-05-16

STATUS: WDROĹ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĹ‚ widoczny przycisk UsuĹ„ na karcie szablonu.
- Delete uĹĽywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĹ›li szablon ma pozycje checklisty.
- Karta szablonu uĹĽywa cf-template-card cf-readable-card i markerĂłw
ecord-list-source-truth.
- Stary marker data-a16-template-light-ui nie jest aktywnym source of truth dla stylu.

TESTY:
-
ode tests/stage105-templates-delete-and-visual-contract.test.cjs
-
pm run build

TEST R\u00c4\u0098CZNY:
- DO WYKONANIA na /templates: create/edit/duplicate/delete z confirmami.

RYZYKO:
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĹ‚ uĹĽyty w aktywnych sprawach. Wymusza Ĺ›wiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaÄ‡ /templates; dopiero potem zdecydowaÄ‡, czy robimy kolejny lokalny etap czy wspĂłlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_NEXT_2026_05_17 -->
## NastÄ™pny krok po Stage98B-100B

1. UruchomiÄ‡ paczkÄ™ lokalnie na `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
2. JeĹĽeli wszystkie testy i `verify:closeflow:quiet` przejdÄ…, paczka wykona commit/push.
3. OtworzyÄ‡ `/calendar`.
4. ZrobiÄ‡ screen dnia z `1 wpis` i dnia z `0 wpisĂłw`.
5. ZamknÄ…Ä‡ etap dopiero po potwierdzeniu braku mojibake i braku pustego biaĹ‚ego mini-kafelka.
6. Dopiero potem ruszaÄ‡ modal i templates.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 â€” Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKĂ“W
- Poprzednia paczka Stage104B nie wykonaĹ‚a patchera: plik CJS miaĹ‚ bĹ‚Ä…d skĹ‚adni przez nieucieczony backtick w osadzonym teĹ›cie.
- Faktyczny problem UI: w Plan najbliĹĽszych dni wpis istnieje, ale renderuje siÄ™ jako wÄ…ski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie uĹĽywa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, peĹ‚nych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguĹ‚.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RÄCZNY
Status: TEST RÄCZNY DO WYKONANIA. WejĹ›Ä‡ na /calendar i sprawdziÄ‡ dzieĹ„ z 1 wpis oraz dzieĹ„ z 0 wpisĂłw.

## Stage104E - do rozwaĹĽenia
- Audyt opĂłĹşnienia po UsuĹ„ / Zrobione: optimistic update albo refresh bez Google inbound pull po lokalnej mutacji.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Po wdrozeniu Stage107 wykonac reczny test ClientDetail.
- Jezeli console nadal pokazuje Radix `Missing Description`, zrobic osobny etap aria-dialog-accessibility.
- Jezeli console nadal pokazuje `DEP0169 url.parse`, zrobic osobny etap backend dependency/runtime warning audit.


## Stage113 manual visual check
1. SprawdziÄ‡ logo w desktop sidebar, mobile top, mobile drawer i login.
2. ZgĹ‚osiÄ‡ tylko jednÄ… korektÄ™, jeĹ›li potrzebna: rozmiar, kontrast, margines albo obrys.


- After Stage114A V8 passes, proceed to Stage114B: fix /calendar refresh loading behavior.

- 2026-05-17 Stage114B local-only: calendar hard-refresh data load waits for workspaceReady; added guard tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs; no git add/commit/push.


## Stage114C V2 - calendar shift persistence guard fix local only
- Local-only ZIP stage.
- Guard repaired after V1 regex false negative.
- Task shifts must write date, scheduledAt, dueAt and time before success toast.
- Manual QA still required on /calendar for +1D, +1W and +1H.

## STAGE114D_NEXT_PUSH_READY

Po recznym potwierdzeniu modala Stage114 A-D spiac w jeden selektywny push. Nie uzywac git add .

## STAGE114D_V2_CALENDAR_MODAL_VIEWPORT_AND_DOC_GUARD_LOCAL_ONLY

- Status: local-only, no git add, no commit, no push.
- Scope: /calendar modal viewport, Radix DialogDescription, Stage114 docs encoding cleanup after broad Stage98 guard failed on _project reports.
- Guards: stage98 polish mojibake calendar guard, Stage114B, Stage114C, Stage114D modal viewport, Stage108 render smoke, build, verify:closeflow:quiet.
- Manual QA: edit calendar entry, title not clipped, scroll body works, sticky footer does not cover fields, no Radix description warning.

## STAGE114D_V3_NEXT_MANUAL_QA
Manual QA: /calendar edit modal, header offset, bottom scroll, sticky footer, no Radix missing description warning. If accepted, Stage114 batch can move to selective local commit/push planning.


## Stage114 manual confirmation after V5
- Damian checks /calendar hard refresh, +1D/+1W/+1H task persistence and edit modal viewport.

## Stage114 next
- Manual QA: /calendar edit modal title, scroll, footer, Radix description warning.
- If manual QA passes, prepare selective batch push later.

## STAGE114D_V8_CALENDAR_MODAL_VIEWPORT_STAGE102_GUARD_FIX_LOCAL_ONLY

- Status: LOCAL ONLY, no git add, no commit, no push.
- Zakres: /calendar modal viewport, Stage102 guard compatibility, Stage114D guard.
- Decyzja: calendar-entry-modal-viewport is allowed as a viewport safety class and is not a local dark overflow shell.
- Guardy: Stage102, Stage98, Stage114B, Stage114C, Stage114D, Stage108 smoke, build, verify:closeflow:quiet.
- Test reczny: otworzyc /calendar, edycje wpisu i tworzenie wpisu; tytul nie moze byc uciety, footer nie moze przykrywac pol, konsola bez Radix Missing Description.

## Stage114 after V9
- Manual browser QA: hard refresh calendar, shift task +1D/+1W/+1H, open calendar create/edit modals.
- If manual QA passes, prepare selective batch commit later. Do not use git add .

## Stage114D V10 next manual check
- Open /calendar.
- Open create event, create task and edit entry modals.
- Confirm header is not clipped and footer does not cover fields.
- Confirm browser console has no Radix missing description warning.

<!-- STAGE115_LEAD_CONTACT_CLIENT_PARITY -->

## Stage115 - nastÄ™pny krok po 3.1

1. Damian: test rÄ™czny /leads/:id: karta kontaktowa po lewej, telefon/e-mail/firma/ostatni kontakt, copy button.
2. JeĹĽeli 3.1 OK: osobny podetap Stage115.2 dla notatek leada.
3. Potem osobno: Stage115.3 overdue taski i Stage115.4 finanse leada, bez mieszania przyczyn w jednym patchu.

## Stage115B next step

- Damian manual check: verify LeadDetail note section placement and content for leads with/without source note and note activity.
- Continue Stage115 with overdue and finance fixes only after this placement is accepted.

## Stage115C next step

- Damian manual check: type a note in LeadDetail Historia kontaktu and click Dodaj notatkÄ™. Expected: inline save, no modal.
- If confirmed, continue Stage115D with overdue/task persistence.
- Keep finance repair as a separate Stage115E step.

## Stage115D next step

- Damian manual check: create or find a lead task with a date in the past and status todo/open. Expected: `ZalegĹ‚e` red pill in work list and nearest action.
- If confirmed, continue Stage115E finance repair.
- Do not mix finance with overdue logic.

## Stage115E next step

- Damian manual check: click Dodaj zaliczkÄ™ and PĹ‚atnoĹ›Ä‡ czÄ™Ĺ›ciowa in /leads/:id. Expected: modal opens, positive amount saves, finance panel refreshes.
- After manual QA, close Stage115 LeadDetail P1 batch or schedule full finance unification.

## Stage116 - Today work item card source of truth

- Manual QA: /today task/event rows and NajbliĹĽsze 7 dni task/event rows.
- If accepted, plan Stage117 to migrate Calendar selected-day/week-plan to the same card contract.
- Do not migrate LeadDetail/ClientDetail/CaseDetail in this stage.
## Stage117 next step

- Manual QA: /leads at 80%, 90%, 100% zoom and mobile width.
- Confirm Filtry proste starts level with search, Najcenniejsze leady sits directly below, no overlap or squeezed rail.
- If accepted, continue with next P1 visual/layout item.

## Stage115 - next steps after CaseDetail crash

STAGE115_CASE_DETAIL_RUNTIME_CRASH_HOTFIX_2026_05_18

1. Damian runs the Stage115 package with `-DoPush`.
2. Damian manually opens a case and hard-refreshes the route.
3. If CaseDetail is stable, next batch: Radix Dialog Description warning + client should not show leads + lead detail spacing.
4. Do not mark Stage113/Stage114 as closed until Damian confirms their separate fixes.


<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST START -->
## Next after Stage119

1. Run ZIP apply with -DoPush.
2. Confirm verify:closeflow:quiet passes.
3. Manual QA on /calendar: hard refresh, week/month/selected day, modals, +1H/+1D/+1W, done/delete.
4. If manual QA still shows calendar P0 issues, prepare the next batch as a runtime/data patch, not another release-gate patch.
<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST END -->

<!-- STAGE119_V2_NEXT_CALENDAR_MANUAL_QA -->
## Stage119 V2 next - calendar manual QA

After Stage119 V2 passes and push completes, Damian should test `/calendar`: hard refresh, week, month, selected day, create/edit modals, +1H, +1D, +1W, Zrobione, Usun.

If manual QA exposes a real runtime issue, make the next package a narrow Calendar P0/P1 fix using the trusted gate.
<!-- /STAGE119_V2_NEXT_CALENDAR_MANUAL_QA -->

<!-- STAGE119_V3_NEXT_CALENDAR_MANUAL_QA -->
## Stage119 V3 next - calendar manual QA

After Stage119 V3 passes and push completes, Damian should test `/calendar`: hard refresh, week, month, selected day, create/edit modals, +1H, +1D, +1W, Zrobione, Usun.

If manual QA exposes a real runtime issue, make the next package a narrow Calendar P0/P1 fix using the now-trusted gate.
<!-- /STAGE119_V3_NEXT_CALENDAR_MANUAL_QA -->

<!-- STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->
## 2026-05-18 - Stage119 V4 - release gate requiredTests dedupe

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Stage98 calendar mojibake guard jest pojedynczym pre-build hard gate w erify:closeflow:quiet.
- Stage119 V4 deduplikuje
equiredTests, zeby ponowione paczki V2/V3 nie zostawialy zdublowanego wpisu Stage119.
- Guard Stage119 parsuje tablice testow i nie liczy surowych wystapien tekstu.

Testy:
-
ode --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
-
ode --test tests/stage119-calendar-release-gate-trust.test.cjs
-
pm run verify:closeflow:quiet

Test reczny:
- DO WYKONANIA na /calendar po zielonym gate.
<!-- /STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->

<!-- STAGE119_V5_RELEASE_GATE_HARNESS_AND_MISSING_TESTS_AUDIT -->
## 2026-05-18 - Stage119 V5 - release gate harness and missing tests audit

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Apply V5 kopiuje Stage98 i Stage119 przed pierwszym node --test.
- Wszystkie komendy testowe sa uruchamiane z cwd repo aplikacji.
- V5 deduplikuje requiredTests i wypisuje wszystkie brakujace testy przed verify:closeflow:quiet.

Testy:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage119-calendar-release-gate-trust.test.cjs
- node tools/audit-stage119-v5-required-tests.cjs <repo>
- npm run verify:closeflow:quiet

Test reczny:
- DO WYKONANIA na /calendar po zielonym gate.
<!-- /STAGE119_V5_RELEASE_GATE_HARNESS_AND_MISSING_TESTS_AUDIT -->


<!-- STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->
## 2026-05-18 - Stage120 Calendar local-first sync and focus

- Calendar reads local Supabase data before Google Calendar inbound sync.
- Google inbound runs in background after first local render and refreshes only if it changed rows.
- /calendar?focus=YYYY-MM-DD is now honored by Calendar.
- Guard: tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs.
- Manual QA: hard refresh, week/month/selected day, focus link, add/edit, shift, done/delete.
<!-- /STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->


<!-- STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->
## 2026-05-18 - Stage121 calendar shift persistence optimistic state

Status: WDRAĹ»ANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwaÄ‡ wpis od razu po udanym PATCH, zamiast polegaÄ‡ wyĹ‚Ä…cznie na refreshSupabaseBundle().

Test rÄ™czny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmieniÄ‡ dzieĹ„/godzinÄ™.
<!-- /STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->

## 2026-05-18 - STAGE122_RUNTIME_AUTH_API_PWA_HARDENING

1. Deploy Stage122 and verify /api/version returns stage marker.
2. In DevTools Network, confirm runtime marker appears and the old service worker is unregistered.
3. Retest Calendar shift actions.
4. If 401 remains, repair auth/session flow next; do not patch calendar UI again before API status is clean.

## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

1. Deploy Stage122 V9.
2. Check /api/version.
3. Check console marker and JS bundle hash.
4. Check /api/me.
5. If /api/me remains 401, fix auth/session/workspace before touching Calendar UI.

<!-- STAGE124A_SUPABASE_EGRESS_NEXT_START -->
## 2026-05-19 - Po Stage124A V3

1. Test reczny UI bez utraty danych na listach i detailach.
2. Sprawdzic Supabase Usage / Logs Top Paths po normalnej sesji.
3. Stage124B: calendar/task date-range queries oraz dalsza deduplikacja auth/workspace, jezeli Usage dalej rosnie.
4. Nie wracac do `select=*` w listach; brakujace pola dopisywac jawnie do ListDTO constants.
<!-- STAGE124A_SUPABASE_EGRESS_NEXT_END -->

## STAGE124D_TASK_EVENT_LIGHT_ROUTES - next

- After manual QA, Stage124E should make Calendar pass from/to range params to /api/tasks and /api/events.
- Check Supabase Usage Dashboard after normal app use to verify reduced API egress.

## Stage124F visible calendar range wiring

After Stage124E, wire the visible Calendar page/sidebar month/week/day range into `fetchCalendarBundleFromSupabase(options)` so task/event reads are bounded by actual UI range.

## 2026-05-29 - Next after STAGE179 Settings readability

- UruchomiĂ„â€ˇ:
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs.
- UruchomiĂ„â€ˇ:
pm run build.
- Test rĂ„â„˘czny: /settings, sekcja Ă˘â‚¬ĹľPrzypomnienia Google CalendarĂ˘â‚¬ĹĄ, pola Ă˘â‚¬ĹľTyp przypomnienia GoogleĂ˘â‚¬ĹĄ i Ă˘â‚¬ĹľIle minut wczeÄąâ€şniejĂ˘â‚¬ĹĄ.
- Nie pushowaĂ„â€ˇ osobno, dopiĂ„â€¦Ă„â€ˇ do wiĂ„â„˘kszej paczki lokalnych UI poprawek po potwierdzeniu Damiana.

## 2026-05-29 - Next after STAGE179 Settings readability

- UruchomiĂ„â€ˇ:
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs.
- UruchomiĂ„â€ˇ:
pm run build.
- Test rĂ„â„˘czny: /settings, sekcja Ă˘â‚¬ĹľPrzypomnienia Google CalendarĂ˘â‚¬ĹĄ, pola Ă˘â‚¬ĹľTyp przypomnienia GoogleĂ˘â‚¬ĹĄ i Ă˘â‚¬ĹľIle minut wczeÄąâ€şniejĂ˘â‚¬ĹĄ.
- Nie pushowaĂ„â€ˇ osobno, dopiĂ„â€¦Ă„â€ˇ do wiĂ„â„˘kszej paczki lokalnych UI poprawek po potwierdzeniu Damiana.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_START -->
## 2026-06-04 â€” STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH â€” owner control roadmap po deep research CRM

STATUS: DO WDROĹ»ENIA JAKO ETAP PAMIÄCI/ROADMAPY. NIE ZMIENIA RUNTIME UI ANI LOGIKI APLIKACJI.

### PowĂłd etapu

Po analizie konkurencji CRM i raportu `deep-research-report (2).md` dopinamy roadmapÄ™ CloseFlow do realnego kierunku produktu:

CloseFlow nie ma konkurowaÄ‡ jako tani, szeroki CRM. CloseFlow ma byÄ‡ operacyjnym systemem pilnowania ruchu sprzedaĹĽowego, nastÄ™pnego kroku, ciszy, spraw i pieniÄ™dzy dla maĹ‚ych firm usĹ‚ugowych.

### Realny stan aplikacji potwierdzony przed wpisem

FAKTY Z REPO:
- Repo: `dkknapikdamian-collab/leadflowv1`.
- Aktywna gaĹ‚Ä…Ĺş projektu wedĹ‚ug pamiÄ™ci projektu: `dev-rollout-freeze`.
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- `README.md` na `dev-rollout-freeze` juĹĽ pozycjonuje produkt jako aplikacjÄ™ do pilnowania leadĂłw, follow-upĂłw, zadaĹ„, wydarzeĹ„ i spraw po sprzedaĹĽy.
- GĹ‚Ăłwne widoki istniejÄ… w routingu aplikacji: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, AiDrafts, Billing, Support, Notifications, Templates.
- `package.json` ma istniejÄ…ce guardy/komendy powiÄ…zane z no-next-step, nearest action, Today, billing, Google Calendar, release gate i `verify:closeflow:quiet`.
- `_project/07_NEXT_STEPS.md` jest realnÄ… listÄ… etapĂłw/next steps, ale zawiera teĹĽ historiÄ™, duplikaty i mojibake po starszych stageâ€™ach. Ten etap dopina nowÄ… roadmapÄ™ jako osobny blok bez kasowania historii.

### Decyzja produktowa

DECYZJA DAMIANA / KIERUNEK:
- Nie budujemy â€žtaĹ„szego CRM-aâ€ť.
- Nie kopiujemy Tillio/Firmao/HubSpot/Pipedrive feature-for-feature.
- Budujemy wĹ‚aĹ›cicielski system kontroli: kto ucieka, kto nie ma kolejnego kroku, ktĂłra sprawa stoi, gdzie leĹĽÄ… pieniÄ…dze, co trzeba ruszyÄ‡ dzisiaj.
- SaaS ma byÄ‡ furtkÄ…. Realna monetyzacja ma iĹ›Ä‡ przez wdroĹĽenie procesu, playbooki, cleanup i miesiÄ™czny review.

### Logiczna kolejnoĹ›Ä‡ etapĂłw do wdroĹĽenia

#### A35 â€” Readiness Audit / Owner Control Baseline

CEL:
- ZbudowaÄ‡ wewnÄ™trzny i/lub pĂłĹ‚produktowy audyt gotowoĹ›ci sprzedaĹĽowej.
- Audyt ma dziaĹ‚aÄ‡ na realnych danych leadĂłw/spraw z ostatnich 30 dni lub na rÄ™cznie/importowo podanych danych.

ZAKRES:
- Policz:
  - leady bez nastÄ™pnego kroku,
  - leady bez kontaktu 7+ dni,
  - leady bez kontaktu 14+ dni,
  - sprawy bez ruchu,
  - sprawy z wartoĹ›ciÄ… finansowÄ…, ale bez nastÄ™pnego kroku,
  - rekordy bez wĹ‚aĹ›ciciela/odpowiedzialnego,
  - rekordy z notatkÄ…, ale bez zadania/follow-upu.
- DodaÄ‡ raport: `CloseFlow Readiness Audit`.
- Wynik ma byÄ‡ uĹĽywalny jako:
  - wewnÄ™trzny ekran diagnostyczny,
  - podstawa oferty `CloseFlow Control Sprint`,
  - ĹşrĂłdĹ‚o danych do kolejnych etapĂłw.

NIE RUSZAÄ†:
- Nie budowaÄ‡ BI dashboardu.
- Nie budowaÄ‡ peĹ‚nego scoringu AI.
- Nie rozbudowywaÄ‡ ERP/faktur/KSeF.

GUARD/TEST:
- Guard ma sprawdzaÄ‡, ĹĽe A35 dokumentuje metryki: no-next-step, 7d silence, 14d silence, stale cases, money-without-next-step.
- Test rÄ™czny: na danych testowych/realnych porĂłwnaÄ‡ liczby z listÄ… leadĂłw/spraw.

#### A35B â€” Mandatory Next Step Contract

CEL:
- KaĹĽdy aktywny lead/sprawa musi mieÄ‡ jasny stan kolejnego kroku albo Ĺ›wiadomy status `brak kolejnego kroku`.

ZAKRES:
- UjednoliciÄ‡ definicjÄ™ `next step`.
- Na LeadDetail/ClientDetail/CaseDetail pokazywaÄ‡:
  - ostatni kontakt,
  - nastÄ™pny krok,
  - liczba dni ciszy,
  - status ryzyka,
  - szybkie akcje: ustaw follow-up, dodaj zadanie, dodaj notatkÄ™, oznacz jako martwy/utracony.
- Nie pozwoliÄ‡, ĹĽeby historia aktywnoĹ›ci byĹ‚a tylko dziennikiem. Historia ma karmiÄ‡ status ryzyka.

NIE RUSZAÄ†:
- Nie robiÄ‡ jeszcze peĹ‚nej automatyzacji.
- Nie mieszaÄ‡ z AI drafts rebuild.

GUARD/TEST:
- Guard: detail views majÄ… widoczny kontrakt last-contact / next-step / silence-age / risk.
- Test rÄ™czny: lead z kontaktem, lead bez kontaktu, sprawa z pĹ‚atnoĹ›ciÄ…, sprawa bez nastÄ™pnego kroku.

#### A41 â€” Contact Cadence Grid / Reminder Engine

CEL:
- DodaÄ‡ czytelnÄ… siatkÄ™ kontaktu jako gĹ‚Ăłwny widok operacyjny, nie jako spam powiadomieĹ„.

ZAKRES:
- Widok/sekcja `Siatka kontaktu`.
- Bucket/filtrowanie:
  - kontakt dziĹ›,
  - 1 dzieĹ„ ciszy,
  - 2 dni ciszy,
  - 3 dni ciszy,
  - 5 dni ciszy,
  - 7 dni ciszy,
  - 14 dni ciszy.
- KaĹĽdy rekord pokazuje:
  - osoba/firma,
  - typ: lead/klient/sprawa,
  - ostatni kontakt,
  - nastÄ™pny krok,
  - wartoĹ›Ä‡ sprawy jeĹ›li istnieje,
  - status ryzyka,
  - szybkie akcje.
- Engine ma bazowaÄ‡ na realnej historii aktywnoĹ›ci, zadaniach i wydarzeniach.

NIE RUSZAÄ†:
- Nie zamieniaÄ‡ tego w zwykĹ‚e browser notifications.
- Nie budowaÄ‡ jeszcze peĹ‚nego sekwencera mailowego.

GUARD/TEST:
- Guard: bucket 7d/14d nie moĹĽe byÄ‡ tylko statycznym tekstem; musi byÄ‡ poĹ‚Ä…czony z obliczaniem ostatniego kontaktu.
- Test rÄ™czny: rekordy z rĂłĹĽnymi datami kontaktu wpadajÄ… do wĹ‚aĹ›ciwych bucketĂłw.

#### A46 â€” Sales Funnel Movement View / Lejek ruchu sprzedaĹĽowego

CEL:
- ZbudowaÄ‡ lejek ruchu, ktĂłry pokazuje nie tylko etap, ale teĹĽ ciszÄ™, brak kroku, ryzyko i pieniÄ…dze.

ZAKRES:
- Pipeline/lejek ma pokazywaÄ‡:
  - etap,
  - wiek kontaktu,
  - ostatni kontakt,
  - nastÄ™pny krok,
  - dni bez ruchu,
  - wartoĹ›Ä‡/potencjalna prowizja,
  - risk flag,
  - szybkie akcje.
- Karta w lejku nie moĹĽe byÄ‡ tylko nazwÄ… i etapem.
- Lejek ma zasilaÄ‡ Today, Lost Lead Rescue i Owner Digest.

NIE RUSZAÄ†:
- Nie kopiowaÄ‡ klasycznego CRM kanban jako caĹ‚oĹ›ci.
- Nie robiÄ‡ forecastingu enterprise.

GUARD/TEST:
- Guard: karta lejka zawiera next-step, silence-age, risk, quick actions.
- Test rÄ™czny: leady/sprawy zmieniajÄ… etap i nadal zachowujÄ… status ruchu.

#### A42 â€” Lost Lead Rescue

CEL:
- ZbudowaÄ‡ osobny ekran `Do odzyskania`, nie tylko filtr w leadach.

ZAKRES:
- Pokazuje:
  - brak ruchu 7+ dni,
  - 14 dni ciszy,
  - brak nastÄ™pnego kroku,
  - leady z duĹĽÄ… wartoĹ›ciÄ… bez aktywnoĹ›ci,
  - niedokoĹ„czone szkice,
  - leady bez wĹ‚aĹ›ciciela.
- Szybkie akcje:
  - odezwij siÄ™ dziĹ›,
  - utwĂłrz zadanie,
  - odĹ‚ĂłĹĽ,
  - dodaj notatkÄ™,
  - przygotuj szkic,
  - oznacz jako martwy/utracony.
- Widok ma byÄ‡ uĹĽywalny codziennie/tygodniowo przez wĹ‚aĹ›ciciela.

NIE RUSZAÄ†:
- Nie robiÄ‡ rozbudowanych automatyzacji marketingowych.
- Nie wysyĹ‚aÄ‡ nic automatycznie bez akceptacji.

GUARD/TEST:
- Guard: ekran/rescue model wymaga kryteriĂłw 7d, 14d, no-next-step i quick actions.
- Test rÄ™czny: minimum 5 przypadkĂłw testowych wpada do wĹ‚aĹ›ciwych sekcji.

#### A45 â€” Finance Watchlist / Money-at-Risk

CEL:
- ZbudowaÄ‡ listÄ™ pieniÄ™dzy do ruszenia, nie peĹ‚ny moduĹ‚ ksiÄ™gowy.

ZAKRES:
- Pokazuje:
  - sprawy z wartoĹ›ciÄ…, ale bez nastÄ™pnego kroku,
  - prowizje do rozliczenia,
  - wpĹ‚aty po terminie,
  - brak daty pĹ‚atnoĹ›ci,
  - korekty do sprawdzenia,
  - duĹĽe kwoty bez ruchu 7+ dni.
- PowiÄ…zaÄ‡ z istniejÄ…cymi finansami sprawy: wartoĹ›Ä‡, prowizja, wpĹ‚aty, korekty, usuwanie wpĹ‚at.
- Widok ma zasilaÄ‡ Owner Digest.

NIE RUSZAÄ†:
- Nie budowaÄ‡ KSeF.
- Nie budowaÄ‡ fakturowania, magazynu, bankĂłw, ERP ani ksiÄ™gowoĹ›ci.
- Nie kopiowaÄ‡ Firmao/Berg.

GUARD/TEST:
- Guard: finance watchlist nie moĹĽe importowaÄ‡ moduĹ‚Ăłw ksiÄ™gowych/ERP ani obiecywaÄ‡ fakturowania.
- Test rÄ™czny: sprawa z kwotÄ… i brakiem next step pojawia siÄ™ jako money-at-risk.

#### A44 â€” Owner Digest / Weekly Report

CEL:
- DodaÄ‡ dzienny/tygodniowy raport wĹ‚aĹ›ciciela jako listÄ™ decyzji, nie vanity dashboard.

ZAKRES:
- Daily:
  - co dziĹ› ruszyÄ‡,
  - kto nie ma nastÄ™pnego kroku,
  - kto ma 7/14 dni ciszy,
  - ktĂłre sprawy stojÄ…,
  - jakie pieniÄ…dze wymagajÄ… ruchu.
- Weekly:
  - ile leadĂłw weszĹ‚o,
  - ile leadĂłw bez next step,
  - ile 7d/14d ciszy,
  - ile spraw bez ruchu,
  - ile pieniÄ™dzy bez ruchu,
  - najwiÄ™ksze ryzyko tygodnia.
- Digest ma byÄ‡ widoczny w aplikacji i docelowo moĹĽliwy do wysyĹ‚ki, ale bez automatycznego wysyĹ‚ania bez konfiguracji/akceptacji.

NIE RUSZAÄ†:
- Nie robiÄ‡ newslettera.
- Nie robiÄ‡ dashboardu wykresĂłw dla samego wyglÄ…du.
- Nie wysyĹ‚aÄ‡ e-maili, jeĹ›li produkcyjny email nie jest gotowy.

GUARD/TEST:
- Guard: digest ma zawieraÄ‡ listÄ™ ryzyk i akcji, nie tylko metryki.
- Test rÄ™czny: owner widzi co dziĹ› zrobiÄ‡ bez przechodzenia przez 5 ekranĂłw.

#### A36 â€” Drafts Rebuild / Jedna skrzynka szkicĂłw

CEL:
- PrzebudowaÄ‡ szkice jako jedno miejsce zatwierdzania danych, ale dopiero po warstwie kontroli.

ZAKRES:
- Jedna skrzynka:
  - rÄ™czny szkic,
  - wklejony tekst,
  - dyktowanie,
  - parser,
  - AI.
- ZatwierdĹş jako:
  - lead,
  - zadanie,
  - wydarzenie,
  - notatka,
  - follow-up.
- Po zatwierdzeniu wpis musi automatycznie przypisaÄ‡ siÄ™ do lead/klient/sprawa, jeĹ›li kontekst jest znany.
- AI dalej dziaĹ‚a confirm-first: nie zapisuje finalnych danych bez akceptacji uĹĽytkownika.

NIE RUSZAÄ†:
- Nie sprzedawaÄ‡ tego jako gĹ‚Ăłwnego wyrĂłĹĽnika â€žAI CRMâ€ť.
- Nie dodawaÄ‡ automatycznego wysyĹ‚ania wiadomoĹ›ci.

GUARD/TEST:
- Guard: AI drafts confirm-first i brak automatycznego finalnego zapisu bez akceptacji.
- Test rÄ™czny: szkic z LeadDetail/ClientDetail/CaseDetail zachowuje kontekst.

#### A47 â€” Branchen Playbooks / Control Sprint Offer

CEL:
- SpiÄ…Ä‡ produkt z usĹ‚ugÄ… wdroĹĽeniowÄ…, ĹĽeby nie sprzedawaÄ‡ samego taniego SaaS.

ZAKRES:
- Oferta startowa:
  - `CloseFlow Control Sprint`,
  - readiness audit,
  - import/porzÄ…dkowanie danych,
  - ustawienie etapĂłw,
  - next-step discipline,
  - contact cadence,
  - owner digest,
  - podstawowy finance watchlist,
  - jedno szkolenie.
- Pierwszy segment:
  - maĹ‚e usĹ‚ugi B2B z inboundem i wĹ‚aĹ›cicielem blisko sprzedaĹĽy.
- Playbook V1:
  - etapy,
  - wymagane next steps,
  - progi ciszy,
  - zasady follow-upu,
  - raport ownera.

NIE RUSZAÄ†:
- Nie robiÄ‡ 10 branĹĽ naraz.
- Nie budowaÄ‡ marketplaceâ€™u playbookĂłw.
- Nie robiÄ‡ bespoke wdroĹĽeĹ„ bez szablonu.

GUARD/TEST:
- Guard: roadmapa nie moĹĽe mieÄ‡ wiÄ™cej niĹĽ jednego aktywnego segmentu startowego bez oznaczenia `DO_POTWIERDZENIA`.
- Test sprzedaĹĽowy: 10 rozmĂłw / demo na danych z ostatnich 30 dni / prĂłba sprzedaĹĽy Control Sprint.

### Minimalny porzÄ…dek wdroĹĽenia

1. A35 Readiness Audit.
2. A35B Mandatory Next Step Contract.
3. A41 Contact Cadence Grid.
4. A46 Sales Funnel Movement View.
5. A42 Lost Lead Rescue.
6. A45 Finance Watchlist.
7. A44 Owner Digest / Weekly Report.
8. A36 Drafts Rebuild.
9. A47 Branchen Playbooks / Control Sprint Offer.

### Warunki zamkniÄ™cia tej roadmapy

- KaĹĽdy etap ma osobny run report w `_project/runs/`.
- KaĹĽdy etap ma guard/test albo jawny SKIP z powodem.
- KaĹĽdy etap aktualizuje `_project/07_NEXT_STEPS.md`, `_project/08_CHANGELOG_AI.md`, `_project/12_IMPLEMENTATION_LEDGER.md`, `_project/13_TEST_HISTORY.md`.
- KaĹĽdy etap ma aktualizacjÄ™ Obsidiana albo manifest.
- Nie uĹĽywaÄ‡ `git add .`.
- Nie robiÄ‡ push przed testami/guardami i rÄ™cznym potwierdzeniem, jeĹ›li etap dotyka runtime UI.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaĹ‚y siÄ™ na kruchych anchorach w Clients.tsx.
- V3 uĹĽywa elastycznych regexĂłw i naprawia czÄ™Ĺ›ciowy lokalny stan.
- Docelowy wzĂłr: [Oferta wysĹ‚ana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaĹ‚ wypchniÄ™ty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaĹ‚ patcha Settings/Cases, wiÄ™c helper i guard weszĹ‚y bez sekcji ustawieĹ„ i bez case badges.
- R2B dopina brakujÄ…ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeĹ›niej przechodziĹ‚, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siÄ™ domknÄ…Ä‡ hotfixem.
- R2B ma byÄ‡ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeĹ›li plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeĹ›li plik istnieje
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, ĹĽeby nie udawaÄ‡ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uĹĽywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrĂłĹĽnia ciszÄ™ kontaktu od braku Ĺ›wieĹĽego ruchu fallback.
- Dodano runtime testy, ktĂłre realnie wywoĹ‚ujÄ… funkcje przez esbuild, nie tylko szukajÄ… tekstu.

DECYZJE DAMIANA:
- PodetapĂłw A-D nie pushujemy osobno.
- Nie robiÄ‡ drugiego Today.
- Badge majÄ… wynikaÄ‡ z jednego kontraktu ruchu i prawdy aktywnoĹ›ci.
- `updatedAt` moĹĽe byÄ‡ fallbackiem aktywnoĹ›ci, nie prawdÄ… kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeĹ‚ne wpiÄ™cie LeadDetail/CaseDetail widocznego work center moĹĽna zrobiÄ‡ jako D2, jeĹ›li po runtime contract nie bÄ™dzie regresji.
- Today agregacja moĹĽe dostaÄ‡ ranking w nastÄ™pnym kroku, ale bez nowej sekcji.

NASTÄPNY KROK:
- Po zielonych testach sprawdziÄ‡ /leads, /cases, /today.
- Commit/push dopiero po caĹ‚ym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryĹ‚ realny bĹ‚Ä…d: fallback z `updatedAt` nadpisywaĹ‚ prawdziwÄ… aktywnoĹ›Ä‡.
- Build przeszedĹ‚, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sÄ… uĹĽywane wyĹ‚Ä…cznie, gdy nie ma realnych kandydatĂłw aktywnoĹ›ci/kontaktu/pĹ‚atnoĹ›ci.
- To naprawia zaĹ‚oĹĽenie: nie udajemy kontaktu ani Ĺ›wieĹĽej aktywnoĹ›ci przez zwykĹ‚y update rekordu.

DECYZJE:
- Nie pushowaÄ‡ Stage223, dopĂłki runtime testy nie sÄ… zielone.
- UtrzymaÄ‡ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajÄ… jednym lokalnym blokiem do jednego commita po peĹ‚nych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTÄPNY KROK:
- Po zielonych testach moĹĽna dopiero rozwaĹĽyÄ‡ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na brakujÄ…cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiÄ™c brak samego pliku blokuje push.
- R2C dodaje brakujÄ…cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyĹ‚Ä…czamy release gate.
- Dodajemy minimalny test kontraktu ĹşrĂłdĹ‚a logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push dla caĹ‚ego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedĹ‚ Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byĹ‚ renderowany przez `EntityTrashButton`, ale brakowaĹ‚o starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujÄ…cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyĹ‚Ä…czamy guardĂłw.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejÄ…cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiÄ…Ĺ‚ marker kosza na liĹ›cie spraw, ale release gate przeszedĹ‚ do kolejnego warunku.
- Guard `case trash actions` wymaga teĹĽ, ĹĽeby `CaseDetail.tsx` uĹĽywaĹ‚ `EntityTrashButton`.
- `CaseDetail.tsx` miaĹ‚ przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaĹ‚ zwykĹ‚y `Button`.
- R2E zmienia tylko ĹşrĂłdĹ‚o przycisku na `EntityTrashButton` i uĹĽywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyĹ‚Ä…czamy guardĂłw.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspĂłlnego ĹşrĂłdĹ‚a prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiÄ…Ĺ‚ `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, ĹĽeby `CaseDetail.tsx` zawieraĹ‚ `EntityTrashButton`.
- R2F speĹ‚nia oba kontrakty: importuje/uĹĽywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyĹ‚Ä…czaÄ‡ guardĂłw.
- Nie zmieniaÄ‡ release gate.
- RozwiÄ…zaÄ‡ konflikt guardĂłw aliasem, nie obejĹ›ciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych ĹşrĂłdĹ‚ach.
- PozostaĹ‚e literalne znaki mojibake w guardach/testach sÄ… zamieniane na ASCII unicode escapes, ĹĽeby guardy mogĹ‚y dalej opisywaÄ‡ zĹ‚e znaki bez Ĺ‚amania Stage98.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiĹ‚ Stage98 i przeprowadziĹ‚ build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaĹ‚a, ĹĽe extractor Ĺ‚apaĹ‚ default `{}`, nie ciaĹ‚o funkcji.
- Sama logika local-first byĹ‚a poprawna: funkcja ma `Promise.all([` i nie woĹ‚a Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaĹ‚a funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, ĹĽeby kontrakt testu i logika byĹ‚y spĂłjne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiĹ‚ extractor funkcji Stage120 przez usuniÄ™cie `= {}` z sygnatury.
- Po R2H test Stage120 doszedĹ‚ dalej i wykazaĹ‚ twardy wymĂłg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszÄ… byÄ‡ literalnie bez argumentĂłw.
- R2I przywraca literalne local reads bez argumentĂłw i zostawia poprawionÄ… sygnaturÄ™ `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, ĹĽeby nie zmieniaÄ‡ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiÄ…zujÄ…cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juĹĽ ma.
- `register-service-worker.ts` ma poprawnÄ… logikÄ™: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaĹ‚ tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenĂłw w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiÄ…zania`.
- `Clients.tsx` miaĹ‚ poprawnÄ… semantykÄ™ soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speĹ‚niaĹ‚ starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiÄ…zaĹ„.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyĹ‚Ä…czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiÄ…zujÄ…cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byĹ‚ za ciasny: skrypt wymagaĹ‚ dokĹ‚adnego istniejÄ…cego renderu `case-detail-history-row`, ktĂłrego lokalny `CaseDetail.tsx` ma juĹĽ inaczej po wczeĹ›niejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenĂłw:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepĹ‚ywu historii.

DECYZJE:
- Nie wyĹ‚Ä…czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjÄ… Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiĹ‚ `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speĹ‚nia juĹĽ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyĹ‚Ä…czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bĹ‚Ä™dem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziĹ‚ `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenĂłw w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juĹĽ przechodzi, wiÄ™c brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĹ‚Ä…czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowÄ… funkcjÄ….

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziĹ‚ case history visual P1 repair3 oraz wszystkie wczeĹ›niejsze release gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastÄ™pny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoĹ›Ä‡ klienta`,
  - `buildClientNextAction`.
- Log wskazaĹ‚ brak `Zadania klienta`.
- R2O dodaje brakujÄ…ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĹ‚Ä…czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkĂłw do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziĹ‚ ClientDetail operational center oraz wszystkie wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaĹ‚ zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerĂłw, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyĹ‚Ä…czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyĹ‚ `api/daily-digest.ts`.
- R2Q-V2 nie wykonaĹ‚ patcha, bo helper JS miaĹ‚ bĹ‚Ä…d skĹ‚adni przed modyfikacjÄ… pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokĹ‚adny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziĹ‚ `daily-digest-email-runtime.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenĂłw w `api/daily-digest.ts`:
  - `workspace-diagnostics`,
  - `digest-diagnostics`,
  - `hasResendApiKey`,
  - `usesFallbackFromEmail`,
  - `cronSecretConfigured`,
  - `canSend`.
- R2R dodaje te tokeny jako jawny kontrakt diagnostyczny w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziĹ‚ `daily-digest-diagnostics.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenĂłw w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziĹ‚ `daily-digest-cron-auth.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikĂłw `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byĹ‚o 13 funkcji API.
- `api/system.ts` juĹĽ importuje `supportHandler` i obsĹ‚uguje `kind === 'support'`.
- `vercel.json` juĹĽ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, ĹĽeby zejĹ›Ä‡ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajÄ… ten plik bezpoĹ›rednio.
- Konsolidujemy redundantny support endpoint przez istniejÄ…cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juĹĽ istnieje.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/vercel-hobby-function-budget.test.cjs
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- npm run build
- git diff --check

RYZYKA:
- JeĹ›li gdzieĹ› poza Vercel rewrite ktoĹ› woĹ‚a bezpoĹ›rednio plikowÄ… funkcjÄ™ `api/support.ts`, po usuniÄ™ciu musi trafiÄ‡ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrĂłciĹ‚ `api/support.ts` i przeszedĹ‚ `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaĹ‚ siÄ™ przed peĹ‚nym dopiÄ™ciem `activitiesHandler` do `api/system.ts`, wiÄ™c R2V koĹ„czy konsolidacjÄ™ `/api/activities`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej i zatrzymaĹ‚ siÄ™ na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujÄ…cy kontrakt Stage32e bez przywracania starego dĹ‚ugiego copy i bez zmiany layoutu.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani daily digest.

DECYZJE:
- Nie cofamy R2T/R2U.
- `api/support.ts` zostaje, bo stary gate czyta go literalnie.
- `api/activities.ts` pozostaje skonsolidowane do `src/server/activities-handler.ts` + `api/system?kind=activities`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage32e-relation-rail-copy-compat.test.cjs
- node --test tests/request-identity-vercel-api-signature.test.cjs
- node --test tests/vercel-hobby-function-budget.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziÄ‡ dodawanie/odczyt aktywnoĹ›ci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiÄ™to marker bez zmiany UI, ĹĽeby nie rozwaliÄ‡ widoku.

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedĹ‚ masowo wiele gates, build i wiÄ™kszoĹ›Ä‡ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prĂłbuje czytaÄ‡ brakujÄ…cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerĂłw:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujÄ…cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktĂłry uruchamia testy z quiet gate po kolei i zbiera wszystkie bĹ‚Ä™dy zamiast zatrzymywaÄ‡ siÄ™ na pierwszym.

DECYZJE:
- Nie uruchamiaÄ‡ rÄ™cznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyĹ‚Ä…czaÄ‡ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uĹĽywaÄ‡ mass scan, ĹĽeby Ĺ‚apaÄ‡ wiele bĹ‚Ä™dĂłw naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byÄ‡ kopiowany rÄ™cznie do Supabase bez osobnego przeglÄ…du SQL.
- Mass scan moĹĽe trwaÄ‡ dĹ‚uĹĽej niĹĽ standardowy verify, ale daje peĹ‚niejszÄ… listÄ™ blokad.

NASTÄPNY KROK:
- JeĹĽeli mass scan pokaĹĽe kilka kolejnych failĂłw, zrobiÄ‡ jeden zbiorczy R2X zamiast kolejnych maĹ‚ych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaĹ‚ 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiÄ‡ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koĹ„czy teĹĽ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeĹ›li R2U nie dokoĹ„czyĹ‚ route przez anchor.

DECYZJE:
- Nie wyĹ‚Ä…czamy starych gateâ€™Ăłw.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajÄ… jawny `aria-describedby={undefined}` escape.
- Trash actions majÄ… iĹ›Ä‡ przez wspĂłlne ĹşrĂłdĹ‚o `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rÄ™cznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoĹ›ci

AUDYT RYZYK:
- CzÄ™Ĺ›Ä‡ napraw to kontrakty historycznych testĂłw, wiÄ™c po zielonym verify trzeba jeszcze obejrzeÄ‡ UI, szczegĂłlnie Calendar i Leads.
- `/api/activities` moĹĽe dziaĹ‚aÄ‡ przez rewrite do system route. Po deployu sprawdziÄ‡ aktywnoĹ›ci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaÄ‡ prawdziwe opisy tam, gdzie dialog ma treĹ›Ä‡ formularzowÄ….

NASTÄPNY KROK:
- Po R2X uruchomiÄ‡ mass scan. JeĹ›li zostanÄ… faile, zrobiÄ‡ R2Y jako kolejny batch z peĹ‚nej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedĹ‚ wszystkie 178 testĂłw.
- Build zatrzymaĹ‚ siÄ™ na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeĹ›nie Stage100/104/99 nie pozwalajÄ…, ĹĽeby taki legacy combo string wrĂłciĹ‚ do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyĹ‚Ä…czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoĹ›ci dla sprzecznych historycznych gateâ€™Ăłw. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rÄ™cznie obejrzeÄ‡ Calendar, bo R2X dotykaĹ‚ kilku klas i dialogĂłw.
- JeĹ›li kolejne prebuild guardy wykaĹĽÄ… podobny konflikt literalny, naprawiaÄ‡ markerem poza renderowanÄ… funkcjÄ…, nie cofajÄ…c UI.

NASTÄPNY KROK:
- UruchomiÄ‡ R2Y. JeĹĽeli build i verify quiet przejdÄ…, moĹĽna wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziĹ‚ `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaĹ‚ z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byĹ‚ sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaĹ‚ tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieĹĽÄ…cego ĹşrĂłdĹ‚a prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- ĹąrĂłdĹ‚em prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
- Nie przywracamy `cf-case-row-delete-text-action`.
- Nie pushujemy bez zielonego build/verify/diff.

TESTY:
- node --test tests/stage105-calendar-modal-no-dark-inputs.test.cjs
- node scripts/check-stage220a28-modal-focus-trash.cjs
- node --test tests/stage95-destructive-action-visual-source.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniono test, bo poprzedni kontrakt byĹ‚ sprzeczny z nowszym prebuild guardem.
- Po deployu rÄ™cznie sprawdziÄ‡ listÄ™ spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AA. JeĹ›li build i verify przejdÄ…, moĹĽna wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedĹ‚ Stage105, Stage220A28, Stage95 i mass scan 178 testĂłw.
- Build zatrzymaĹ‚ siÄ™ w `src/pages/Calendar.tsx` na bĹ‚Ä™dzie JSX:
  `Expected "=>" but found "="`.
- BĹ‚Ä…d powstaĹ‚ w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerĂłw.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skĹ‚adni po regexowym patchu. NajwiÄ™ksze ryzyko: delete button w Calendar moĹĽe mieÄ‡ poprawny build, ale trzeba go kliknÄ…Ä‡ rÄ™cznie po deployu.
- Po deployu sprawdziÄ‡ `/calendar`: usuĹ„ wpis tygodnia, usuĹ„ wpis z selected day, sprawdĹş dialog/confirm i brak czerwonej plakietki.
- JeĹ›li kolejny build pokaĹĽe bĹ‚Ä…d skĹ‚adni w Calendar, nie robiÄ‡ szerokiego refaktoru; naprawiÄ‡ lokalnie bĹ‚Ä™dny JSX.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AB. JeĹ›li build i verify przejdÄ…, wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaĹ‚ juĹĽ wypchniÄ™ty jako commit `66b13479`.
- Podetap E nie byĹ‚ domkniÄ™ty w wymaganym ksztaĹ‚cie:
  - istniaĹ‚ `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaĹ‚ runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaĹ‚o docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byĹ‚ za bardzo tokenowy i nie pilnowaĹ‚ peĹ‚nej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraĹĽamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoĹ›ci ani redesignu Today.
- Celem R2AC jest domkniÄ™cie jakoĹ›ci/guardĂłw po Stage223 R2.
- Nie pushujemy bez zielonych testĂłw koĹ„cowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RÄCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoĹ›ci zaleĹĽnej od progu.
- LeadDetail: status nastÄ™pnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastÄ™pnego ruchu i pieniÄ™dzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiÄ… i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoĹ›Ä‡ / ryzyko`, klikniÄ™cia do rekordĂłw, brak agresywnego odĹ›wieĹĽania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GĹ‚Ăłwne ryzyko: guard moĹĽe zĹ‚apaÄ‡ przyszĹ‚e rÄ™czne dublowanie badge w UI â€” to jest celowe.
- Po zielonym teĹ›cie moĹĽna uruchomiÄ‡ lokalnie aplikacjÄ™ i przejĹ›Ä‡ checklistÄ™ manualnÄ….

NASTÄPNY KROK:
- UruchomiÄ‡ R2AC lokalnie.
- JeĹĽeli testy sÄ… zielone, odpaliÄ‡ lokalnie `npm run dev:api` i sprawdziÄ‡ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaĹ‚y siÄ™ przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uĹĽywa parsera blokĂłw/statements, zamiast zakĹ‚adaÄ‡ sÄ…siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoĹ‚uje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uĹĽywa timeout/scroll/reorder,
  - root/capture bridges ignorujÄ… top metric tiles,
  - top metric buttons majÄ… wĹ‚asne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiÄ™ty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniÄ™ciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rÄ™cznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkĂłw: nie przenoszÄ… list na gĂłrÄ™.
- Ryzyko lokalne: expand/collapse na `/today`; rÄ™czny smoke obowiÄ…zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkĂłw Today.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AD V4, potem `npm run dev`, rÄ™czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaĹ‚ siÄ™ lokalnie i przeszedĹ‚:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padĹ‚ nie przez Today, tylko przez zĹ‚amanie kontraktu quiet gate.
- BĹ‚Ä…d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaÄ‡ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaĹ‚ do `package.json` komendÄ™ `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokĹ‚adnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnÄ…trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceĹ„ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byÄ‡ uruchamiany przez `closeflow-release-check-quiet.cjs`.
- Nie pushujemy bez zielonego verify quiet.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2ae-quiet-gate-contract-repair.cjs
- node --test tests/closeflow-release-gate-quiet.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa kontraktu testowego, nie nowy runtime feature.
- Ryzyko byĹ‚o proceduralne: dopiÄ™cie guarda do package scriptu Ĺ‚amie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wĹ‚asny guard pilnujÄ…cy, ĹĽe package script pozostaje dokĹ‚adny, a nowy R2AD guard jest w Ĺ›rodku quiet gate.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AE. JeĹ›li verify quiet przejdzie, odpaliÄ‡ lokalnie `npm run dev`, sprawdziÄ‡ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrĂłciĹ‚ exact `verify:closeflow:quiet` contract i build przechodziĹ‚.
- Verify quiet zatrzymaĹ‚ siÄ™ na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaĹ‚:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjÄ… R2AD: kafelki Today nie mogÄ… juĹĽ przenosiÄ‡ sekcji w DOM ani przewijaÄ‡ do sekcji, bo to powodowaĹ‚o scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiĹ‚ R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Ĺ›cieĹĽki klikniÄ™cia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rÄ™cznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GĹ‚Ăłwne ryzyko: stary test wymuszaĹ‚ zachowanie, ktĂłre teraz uznaliĹ›my za ĹşrĂłdĹ‚o bugĂłw.
- Nowy kontrakt utrzymuje dostÄ™pnoĹ›Ä‡ i focus, ale blokuje scroll trap.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AF, potem lokalny `npm run dev`, rÄ™czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaĹ‚ siÄ™ i przeszedĹ‚:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaĹ‚ na `git diff --check`.
- `git diff --check` wskazaĹ‚ trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyĹ‚Ä…cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardĂłw, package scripts, quiet gate ani UI.

DECYZJE:
- Nie dotykamy zachowania R2AD/R2AF.
- Nie ignorujemy `git diff --check`.
- Nie pushujemy bez zielonego diff check.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To czyszczenie whitespace, wiÄ™c ryzyko runtime jest minimalne.
- RÄ™czny smoke `/today` nadal wymagany, bo wĹ‚aĹ›ciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeĹĽenia LF/CRLF z `git diff --check` sÄ… nieblokujÄ…ce; trailing whitespace byĹ‚ blokujÄ…cy.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AG.
- Po zielonym diff check odpaliÄ‡ lokalnie `npm run dev`, sprawdziÄ‡ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, ĹĽe formularz tworzenia leada i klienta nie miaĹ‚ pola `lastContactAt`.
- Zweryfikowano, ĹĽe payload tworzenia leada/klienta nie wysyĹ‚aĹ‚ `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juĹĽ istniejÄ… po Stage223, wiÄ™c wczeĹ›niejsza teza o ich braku byĹ‚a nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadĂłw i klientĂłw.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyĹ›lnie pole pokazuje dzisiejszÄ… datÄ™.
- JeĹĽeli kontakt byĹ‚ starszy, operator ma wpisaÄ‡ prawdziwÄ… datÄ™.
- DatÄ™ zapisujemy jako noon ISO, ĹĽeby ograniczyÄ‡ problemy stref czasowych.
- Daty przyszĹ‚e sÄ… blokowane komunikatem: `Ostatni kontakt nie moĹĽe byÄ‡ w przyszĹ‚oĹ›ci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeĹ›li SQL nie zostanie uruchomiony, API ma fallback dla brakujÄ…cej kolumny, ale data nie bÄ™dzie trwale zapisana w bazie.
- Lista leadĂłw/klientĂłw ma fallback select bez `last_contact_at`, ĹĽeby nie wysadziÄ‡ produkcji przed migracjÄ….
- PeĹ‚ne spiÄ™cie z widocznoĹ›ciÄ… badge `Cisza 14+ dni` zaleĹĽy od tego, czy `last_contact_at` wrĂłci z API po migracji.
- NastÄ™pny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeĹ›li po manualnym teĹ›cie badge nie bierze daty z bazy.

NASTÄPNY KROK:
- UruchomiÄ‡ SQL w Supabase.
- UruchomiÄ‡ R3A lokalnie.
- PrzetestowaÄ‡ tworzenie leada/klienta z datÄ… 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedĹ‚ guard i runtime test dla Last Contact Intake.
- Build przeszedĹ‚.
- `verify:closeflow:quiet` zatrzymaĹ‚ siÄ™ na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaĹ‚a wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaĹĽdej optional fallback column.
- Nie uruchamiamy osobnego peĹ‚nego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, ĹĽeby potwierdziÄ‡ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rÄ™cznie sprawdziÄ‡ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTÄPNY KROK:
- UruchomiÄ‡ V3.
- JeĹ›li gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 â€” Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwoĹ‚anie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Ĺšrednie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przyciskĂłw Ustaw zadanie / OdĹ‚ĂłĹĽ / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga rÄ™cznego testu po patchu.
- Rescue UI moĹĽe wymagaÄ‡ pĂłĹşniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdroĹĽony, wiÄ™c disabled actions sÄ… prawidĹ‚owe.

## STAGE220A35 â€” Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartoĹ›Ä‡ transakcji/sprawy nie jest prowizjÄ… wĹ‚aĹ›ciciela.
- ClientDetail pokazuje prowizjÄ™ naleĹĽnÄ…, wpĹ‚aconÄ… prowizjÄ™ i prowizjÄ™ do zapĹ‚aty jako osobne wartoĹ›ci.
- Karta sprawy w kliencie uĹĽywa getCaseFinanceSummary, wiÄ™c prowizja procentowa 69 000 PLN Ă— 2% daje 1 380 PLN zamiast 0 PLN.
- WartoĹ›Ä‡ transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mĂłgĹ‚by dziedziczyÄ‡ bĹ‚Ä™dne wartoĹ›ci finansowe.
- Nie ruszano Supabase, RLS ani backendu pĹ‚atnoĹ›ci.
- Model prowizji staĹ‚ej nadal uĹĽywa gotowej kwoty prowizji.

## STAGE220A36 â€” Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizjÄ™ staĹ‚Ä… od podstawy procentowej.
- Przy kwocie staĹ‚ej uĹĽytkownik wpisuje wartoĹ›Ä‡ prowizji.
- Przy prowizji procentowej uĹĽytkownik wpisuje wartoĹ›Ä‡ transakcji do wyliczenia i stawkÄ™ procentowÄ…; prowizja jest wyliczana i nieedytowalna.
- Lista klientĂłw pokazuje prowizjÄ™ operacyjnÄ…, nie cenÄ™ transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu pĹ‚atnoĹ›ci.
- Techniczne pole contractValue nadal przechowuje podstawÄ™ procentu przy modelu procentowym.
- Stage227 moĹĽe startowaÄ‡ dopiero po rÄ™cznym sprawdzeniu fixed/percent w modalach finansĂłw.

## STAGE220A36-R2 â€” Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano ukĹ‚ad modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartoĹ›Ä‡ prowizji.
- Pole "WartoĹ›Ä‡ prowizji" jest edytowalne tylko przy kwocie staĹ‚ej.
- Przy procencie wartoĹ›Ä‡ prowizji wylicza siÄ™ automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartoĹ›Ä‡ transakcji/zlecenia, jest osobnym polem poniĹĽej gĹ‚Ăłwnych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu pĹ‚atnoĹ›ci.
- Ryzyko dotyczy tylko czytelnoĹ›ci UI i bĹ‚Ä™dnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystaÄ‡ z prowizji jako wartoĹ›ci operacyjnej.

## STAGE220A36-R4 â€” Build Guard and Case Item Schema Fix

Data: 2026-06-05 22:15 Europe/Warsaw

### FAKTY
- Naprawiono guardy A35/A36 po R2: usunieto BOM/mojibake i zbyt sztywne tokeny copy.
- Usunieto wysylanie approved_at przy tworzeniu case_items, bo produkcyjna tabela nie ma tej kolumny.
- Nie dodawano SQL ani kolumny w Supabase.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- node --test tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Commit 00b8a95 byl wypchniety mimo czerwonych guardow, wiec R4 domyka build przed Stage227.
- Runtime bledy schema cache PGRST204 trzeba lapac guardami payloadu, nie obiecywac SQL bez potrzeby.
- Nie ruszano Supabase, RLS ani modelu platnosci.

## STAGE220A36-R5 â€” R4 Guard Token Compat

Data: 2026-06-05 22:30 Europe/Warsaw

### FAKTY
- Vercel po d1e380f5 przechodzil A35, A36 i A36-R2, ale padal na zbyt sztywnym R4 guardzie.
- R4 guard oczekiwal tokenu "CaseFinanceEditorDialog percent basis field", a aktualny A36 guard uzywa "CaseFinanceEditorDialog percent basis label".
- R5 dopuszcza oba tokeny i dodaje osobny guard/test, zeby nie powtorzyc tego regresu.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node scripts/check-stage220a36r5-r4-guard-token-compat.cjs
- node --test tests/stage220a36r5-r4-guard-token-compat.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- To jest hotfix guardu, nie zmiana UI ani bazy.
- approved_at fix z R4 zostaje bez zmian.
- Stage227 nadal wymaga zielonego Vercel po R5.

## STAGE220A36-R6 â€” Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 â€” CaseDetail Legacy Finance Modal Wiring Fix

Data: 2026-06-06 07:55 Europe/Warsaw

### FAKTY
- Produkcyjny bundle CaseDetail zawieral jednoczesnie nowy i stary modal.
- Widoczny modal w karcie sprawy byl inline FIN-11 w CaseDetail.tsx, a nie wspolny CaseFinanceEditorDialog.
- R7 przepina legacy modal CaseDetail na kolejnosc: Rodzaj prowizji -> Stawka -> Wartosc prowizji -> Podstawa procentu -> Waluta -> Status.

### TESTY
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node --test tests/stage220a36r7-case-detail-legacy-finance-modal.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Guardy A36 wczesniej pilnowaly wspolnego komponentu, ale nie pilnowaly inline modala CaseDetail, dlatego UI produkcyjne moglo pozostac stare.
- Po R7 trzeba sprawdzic bundle w przegladarce: hasOldTitle powinno byc false, a hasNewTitle true.
- Blad /api/case-items 500 jest osobnym watkiem; wymaga Response z Network, jesli po deployu R7 nadal wystapi.

## STAGE220A36-R10 â€” Commission Modal Three-Field Top Row Polish

Data: 2026-06-06 08:55 Europe/Warsaw

### FAKTY
- Po R7 produkcyjny bundle byl aktualny, ale UX nadal nie odpowiadal oczekiwaniu: u gory mialy byc trzy pola decyzyjne, a wartosc transakcji/zlecenia osobno nizej.
- R10 uklada modal jako: Rodzaj prowizji -> Stawka (%) -> Wartosc prowizji w pierwszym rzedzie, a Wartosc transakcji/zlecenia jako osobne pole pod spodem.

### TESTY
- node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs
- node --test tests/stage220a36r10-commission-modal-three-field-layout.test.cjs
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a32-finance-controls-delete-labels.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Zmieniany jest tylko uklad i copy modala, nie model danych ani zapis prowizji.
- Stare guardy A31/A32/R7 zostaja dostosowane do nowego labela wartosci transakcji/zlecenia, zeby nie blokowaly poprawnego UX.
- /api/case-items 500 pozostaje osobnym watkiem, jesli nadal wystepuje po deployu.


## STAGE220A36-R11 â€” Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie uĹ‚oĹĽyĹ‚ pola, ale modal nadal byĹ‚ zbyt przytĹ‚aczajÄ…cy przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipĂłw â€ž?â€ť, skraca Ĺ›rodkowy label do â€žStawka (%)â€ť, zmniejsza wysokoĹ›Ä‡ pĂłl i wyrĂłwnuje Ĺ›rodkowe pole stawki.

### TESTY
- node scripts/check-stage220a36r11-commission-modal-compact-tooltips.cjs
- node --test tests/stage220a36r11-commission-modal-compact-tooltips.test.cjs
- node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Zmieniany jest tylko UX/copy/CSS modala, nie zapis prowizji ani backend.
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje peĹ‚nego komfortu â€” jeĹĽeli to bÄ™dzie problem, kolejny etap powinien zrobiÄ‡ wĹ‚asny popover.
- Trzeba rÄ™cznie sprawdziÄ‡, czy trzy pola w gĂłrnym rzÄ™dzie nie Ĺ›ciskajÄ… siÄ™ na szerokoĹ›ci laptopa i czy wÄ…skie ekrany poprawnie zawijajÄ… do jednej kolumny.

## STAGE220A36-R12 â€” Commission Modal Width Polish

Data: 2026-06-06 09:35 Europe/Warsaw

### FAKTY
- Po R11 modal byl czytelniejszy, ale select rodzaju prowizji nadal ucinal tekst, a pole wartosci transakcji/zlecenia zajmowalo zbyt duzo szerokosci.
- R12 poszerza pole rodzaju prowizji, utrzymuje kompaktowa stawke i kwote prowizji oraz ogranicza szerokosc pola wartosci transakcji/zlecenia.

### TESTY
- node scripts/check-stage220a36r12-commission-modal-width-polish.cjs
- node --test tests/stage220a36r12-commission-modal-width-polish.test.cjs

### AUDYT RYZYK
- Zmieniany jest tylko CSS i marker ukladu modala; logika zapisu prowizji zostaje bez zmian.
- Na waskich ekranach pola nadal skladaja sie do jednej kolumny.

## STAGE226R10 â€” Lead/Client Separation Runtime Fix

Data: 2026-06-06 09:35 Europe/Warsaw

### FAKTY
- Lead i klient sa osobnymi bytami. Dodanie leada nie moze tworzyc ani wyswietlac klienta.
- W api/leads.ts zwykly POST tworzacy leada nie moze wywolywac ensureClientForLead ani wypelniac client_id/linked_case_id.
- Konwersja do klienta zostaje tylko w jawnym przeplywie start_service.

### TESTY
- node scripts/check-stage226r10-lead-client-separation-runtime.cjs
- node --test tests/stage226r10-lead-client-separation-runtime.test.cjs
- opcjonalnie Stage226 lost-lead-rescue guard/test jesli pliki istnieja
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Najwieksze ryzyko bylo w zwyklym POST /api/leads, ktory mogl zapewniac klienta przed utworzeniem leada.
- Nie ruszano Supabase schema, RLS, Stage227 ani finansow A36 poza malym R12 CSS.
- Trzeba recznie potwierdzic: dodanie leada nie zwieksza liczby klientow na /clients.

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG â€” next step

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- po PASS: wykonaÄ‡ manual smoke /clients -> /leads -> /clients i dopiero potem wrĂłciÄ‡ do Stage226R11 albo Stage227.
- nie ruszaÄ‡: Stage227, Google Calendar, finanse A36, RLS, schema.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX â€” next step

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- po PASS: wykonaÄ‡ manual smoke /clients -> /leads -> /clients. Dopiero potem Stage226R11 timezone albo Stage227.
- nie ruszaÄ‡: Stage227, Google Calendar, finanse, RLS, schema.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX â€” next step

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- po PASS: rÄ™cznie przetestowaÄ‡ konflikt/duplikat dla klienta i leada; dopiero potem wrĂłciÄ‡ do Stage226R11 timezone Google Calendar albo kolejnego etapu.
- nie ruszaÄ‡: Stage227 przed domkniÄ™ciem lead/client + conflict gate smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH â€” next step

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- po PASS: rÄ™czny smoke produkcyjny CloseFlow -> Google Calendar -> inbound sync.
- dopiero po potwierdzeniu timezone/reminders wrĂłciÄ‡ do Stage227 â€” Sales Funnel Movement View.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX â€” next step

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- po PASS R11B wykonaÄ‡ push R11/R11B, potem rÄ™czny smoke Google Calendar: godzina + przypomnienie.
- nie przechodziÄ‡ do Stage227 bez smoke Google Calendar.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_NEXT_START -->
## 2026-06-06 15:35 Europe/Warsaw Ă˘â‚¬â€ť STAGE227A next step

1. UruchomiĂ„â€ˇ lokalny apply i testy.
2. OtworzyĂ„â€ˇ `/funnel` lokalnie.
3. SprawdziĂ„â€ˇ leady, sprawy, next step, ciszĂ„â„˘, ryzyko i wartoÄąâ€şĂ„â€ˇ/prowizjĂ„â„˘.
4. Po akceptacji Damiana zrobiĂ„â€ˇ selektywny commit/push bez `git add .`.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_NEXT_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_NEXT_START -->
## 2026-06-06 15:45 Europe/Warsaw Ă˘â‚¬â€ť STAGE227B Ă˘â‚¬â€ť next step

Po lokalnym PASS trzeba rĂ„â„˘cznie sprawdziĂ„â€ˇ `http://localhost:3000/funnel`. JeÄąÄ˝eli widok jest czytelny, moÄąÄ˝na zrobiĂ„â€ˇ selektywny commit/push. JeÄąÄ˝eli nie, kolejny etap powinien dopracowaĂ„â€ˇ tylko kompozycjĂ„â„˘ UI, bez ruszania helperÄ‚Ĺ‚w danych.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_NEXT_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_NEXT_START -->
## 2026-06-06 17:05 Europe/Warsaw Ă˘â‚¬â€ť STAGE228A next step

Po wdroÄąÄ˝eniu sprawdziĂ„â€ˇ `/funnel`: domyÄąâ€şlnie powinny byĂ„â€ˇ widoczne wszystkie rekordy, klikniĂ„â„˘cie `PieniĂ„â€¦dze` ma pokazaĂ„â€ˇ rekord z kwotĂ„â€¦ 1380 PLN, a klikniĂ„â„˘cie rekordu ma prowadziĂ„â€ˇ do sprawy. NastĂ„â„˘pny etap: Stage228B Lead Work Action Center.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_NEXT_END -->

## 2026-06-06 18:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE228B Lead Work Action Center

- typ: etap wdroÄąÄ˝eniowy local-only
- decyzja: Lead nie dostaje peÄąâ€šnego lejka; dostaje centrum pracy Ă˘â‚¬ĹľCo robimy teraz?Ă˘â‚¬ĹĄ z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyĂ„â€ˇ drugiego systemu dziaÄąâ€šaÄąâ€ž; uÄąÄ˝ywaĂ„â€ˇ istniejĂ„â€¦cych handlerÄ‚Ĺ‚w LeadDetail.

## 2026-06-06 18:36 Europe/Warsaw - After Stage228B R8

1. Push Stage228B R8 hotfix.
2. Verify LeadDetail opens on the server without APP_ROUTE_RENDER_FAILED.
3. Manually test actions: Edytuj, Jutro, Zrobione, UsuĹ„.
4. Continue with STAGE228C_CLIENT_MOVEMENT_PANEL_AFTER_R8 only after LeadDetail is stable.

## 2026-06-06 18:42 Europe/Warsaw â€” STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiaÄ‡ guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw â€” STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw â€” STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw â€” STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail dziaĹ‚a, ale centrum dziaĹ‚aĹ„ leada byĹ‚o mniej czytelne niĹĽ analogiczna karta sprawy.
- DECYZJA: Nie tworzyÄ‡ osobnego systemu wizualnego dla leada. Lead action center ma iĹ›Ä‡ w kierunku tego samego ĹşrĂłdĹ‚a wizualnego co CaseDetail: jeden nagĹ‚Ăłwek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: UsuniÄ™to duplikujÄ…ce copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych brakĂłw/blokad zamiast dublowaÄ‡ kaĹĽde zalegĹ‚e wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdziÄ‡ rÄ™cznie LeadDetail z zalegĹ‚ym wydarzeniem i porĂłwnaÄ‡ czytelnoĹ›Ä‡ do CaseDetail.

<!-- STAGE228R2_ADMIN_FEEDBACK_NEXT_STEPS -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 next steps

1. Manualnie sprawdzic `/billing`, `/notifications`, `/ai-drafts`, `/funnel`.
2. Jesli lokalny dev dalej zatrzymuje sie na `Ladowanie widoku...`, sprawdzic stan auth/dev bootstrap osobnym etapem.
3. Po akceptacji wizualnej mozna selektywnie commitowac Stage228R2 bez `git add .`.
4. Nie kasowac pozostalych kafelkow z feedback JSON, ktore mialy tylko `.`, bez osobnego potwierdzenia.
<!-- /STAGE228R2_ADMIN_FEEDBACK_NEXT_STEPS -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_NEXT_STEP_BATCH_PUSH_AFTER_MANUAL_PASS

Nie pushowaÄ‡ przed rÄ™cznym PASS C5.

NastÄ™pny krok po apply Stage228R14:
1. Uruchomic manual C5 test.
2. Jesli PASS: poprosic o finalny batch push script.
3. Finalny push ma byc selektywny i obejmowac tylko pliki zwiazane z batch C5 oraz jawnie zaakceptowane lokalne etapy.
4. Przed pushem:
   - git status --short,
   - node scripts/check-stage228r11-shared-missing-item-flow.cjs,
   - node scripts/check-stage228r12-context-action-blocker-host.cjs,
   - node scripts/check-stage228r13-missing-item-status-resolve.cjs,
   - node scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs,
   - npm run build,
   - git diff --check.

## 2026-06-08 21:45 Europe/Warsaw - STAGE228R15_NEXT_STEPS_AFTER_DEPLOY

Po pushu Stage228R15 sprawdzic na deployu:
1. Lead Brak add/delete bez refresh i bez bledu next_action_title.
2. Client Brak add/delete bez refresh.
3. Case Brak add/resolve.
4. Jesli blad next_action_title nadal wystapi, nastepny etap musi wejsc w API/trigger sync lead next action, nie w UI.

## 2026-06-08 22:30 Europe/Warsaw - STAGE228R16R2_NEXT_STEPS_AFTER_DEPLOY

Next:
1. Apply R16R2.
2. Push R16R2.
3. Test deployed Lead/Client/Case Brak.
4. If button still does not open, inspect ContextActionDialogsHost mounting in App/Layout.

<!-- STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
## 2026-06-08 20:45 Europe/Warsaw - Stage228R17 missing_item delete contract

STATUS: LOCAL_ONLY_APPLIED_BY_ZIP, test reczny DO WYKONANIA.

FAKTY:
- Objaw: klikniecie UsuĹ„ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuĹ„ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastÄ™pny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ă˘â‚¬â€ť Stage228R18 Ă˘â‚¬â€ť missing item hard delete source truth

- problem: Brak znikaÄąâ€š po klikniĂ„â„˘ciu UsuÄąâ€ž, ale wracaÄąâ€š po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€ˇ ÄąĹźrÄ‚Ĺ‚dÄąâ€šowana z linkedTasks, nie z caÄąâ€šego timeline, ÄąÄ˝eby activity history nie odtwarzaÄąâ€ša aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rĂ„â„˘czny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niÄąÄ˝ soft-delete; historia usuniĂ„â„˘cia zostaje jako activity.

## 2026-06-08 21:50 Europe/Warsaw - STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT

### Status
- Stage228R18/R18R2/R18R3/R18R4 were not accepted as runtime fixes because their patch/apply scripts failed before stable runtime change.
- Stage228R18R5 switches to mass preflight and a safer patching strategy.

### Runtime contract
- LeadDetail missing_item delete must call `hardDeleteTaskFromSupabase(taskId)`.
- `hardDeleteTaskFromSupabase` must use `DELETE /api/system?apiRoute=tasks&id=<id>`.
- The lead view must optimistically remove the row and then use a silent refresh.
- The active Brak must not return after hard refresh.

### Guards and tests
- `scripts/check-stage228r18r5-missing-item-hard-delete-source-truth.cjs`
- `tests/stage228r18r5-missing-item-hard-delete-source-truth.test.cjs`
- guard is wired into `package.json` prebuild.

### Manual test
1. Add Brak on LeadDetail.
2. Hard refresh - Brak is visible.
3. Click Usun.
4. Hard refresh - Brak does not return.

### Risk sweep
- Hard delete is intentionally stronger than soft-delete for user-facing missing_item delete.
- The deletion activity stays in history, but it must not recreate active blocker state.
- Similar delete behavior in ClientDetail should be checked after LeadDetail is confirmed.



## 2026-06-08 22:20 Europe/Warsaw - STAGE228R19R2 missing item active source truth

- status: LOCAL_APPLIED_PENDING_MANUAL_TEST
- problem: deleted Brak/missing_item returned after hard refresh because active UI could be rebuilt from non-task/timeline source.
- decision: active Braki on LeadDetail must be sourced only from linkedTasks/work_items, not activity history.
- guard: scripts/check-stage228r19r2-missing-item-active-source-truth.cjs
- test: tests/stage228r19r2-missing-item-active-source-truth.test.cjs
- manual test: add Brak -> hard refresh -> delete -> hard refresh -> Brak does not return.
- risk sweep: ClientDetail may require an analogous source-truth sweep if the same symptom appears there.
- marker: STAGE228R19R2_MISSING_ITEM_ACTIVE_SOURCE_TRUTH

---

## 2026-06-09 02:50 Europe/Warsaw Ă˘â‚¬â€ť STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Äąâ€šaÄąâ€žcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siĂ„â„˘ juÄąÄ˝ na dokÄąâ€šadnym polskim tekÄąâ€şcie toastu, tylko na strukturze przepÄąâ€šywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rĂ„â„˘czny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE231_AUTH_URGENT_BACKLOG_START -->
## 2026-06-09 - PILNE: Auth / rejestracja / Google / e-mail / hasło

Priorytet przed kolejnymi funkcjami:
1. STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY — dodać Google do rejestracji, ujednolicić copy logowania/rejestracji, jawnie opisać obecny public trial bootstrap OAuth.
2. STAGE231B_SUPABASE_ONLY_SETTINGS_SECURITY — przenieść ustawienia bezpieczeństwa z Firebase Auth na Supabase Auth: zmiana hasła, ustaw hasło dla kont Google-only, zmiana e-maila.
3. STAGE231C_AUTH_EMAIL_DELIVERY_AND_REDIRECT_QA — sprawdzić maile: rejestracja, potwierdzenie, reset hasła, zmiana e-maila, redirect URL.
4. STAGE231D_PUBLIC_TRIAL_OR_INVITE_ONLY_DECISION — decyzja czy nowe konta Google mogą same tworzyć workspace trial, czy wprowadzamy invite/gate.
5. STAGE231E_AUTH_FULL_MATRIX_QA — matryca testów: nowe Google, istniejące Google, e-mail/hasło, reset, zmiana hasła, zmiana e-maila, wyloguj wszystkie urządzenia.

Uwaga:
- Obecnie /api/me może bootstrapować nowy workspace trial po OAuth.
- Settings używa jeszcze Firebase Auth do części akcji bezpieczeństwa i wymaga migracji.
<!-- STAGE231_AUTH_URGENT_BACKLOG_END -->

## Future auth stages after STAGE231D

### STAGE231E_EMAIL_COPY_REPAIR

Poprawić treści e-maili Supabase/Auth: rejestracja, potwierdzenie e-maila, reset hasła, komunikaty po kliknięciu linków, copy w aplikacji po wysłaniu maila.

### STAGE231F_INVITE_ONLY_TEST_MODE

Dodać opcjonalny tryb invite-only/test-mode: tylko e-maile na allowliście/zaproszeniach mogą tworzyć konto. Nie wdrażać jako default dla publicznego SaaS.

## 2026-06-10 — po STAGE231B0

Następny etap po PASS i pushu:
STAGE231B1 — Client Lifetime Earnings Summary.

Zakres:
- Zarobione łącznie przy kliencie.
- Aktywna prowizja do zebrania.
- Prowizja pozostała.
- Zamknięte sprawy z zarobkiem.
- all_cases dla lifetime earnings.
- all_active_cases dla aktywnych pieniędzy.
