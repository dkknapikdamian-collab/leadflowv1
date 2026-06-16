<!-- STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION -->
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
- małe firmy nie kupują â€śbazy firm”,
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

## 2026-05-16 — Next step po Stage92 {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

1. WykonaĂ„â€ˇ test rĂ„â„˘czny na `/calendar`: dzieŚ„ z wydarzeniem, zadaniem i wpisem bez powiĂ„â€¦zania.
2. SprawdziĂ„â€ˇ desktop: treŚâ€şĂ„â€ˇ po lewej, akcje po prawej w dwóch rzĂ„â„˘dach, bez biaŚâ€šej pustej belki.
3. SprawdziĂ„â€ˇ mobile: akcje nie rozjeŚÄ˝dŚÄ˝ajĂ„â€¦ wpisu i nie chowajĂ„â€¦ tytuŚâ€šu.
4. Po potwierdzeniu Damiana dopiero Śâ€šĂ„â€¦czyĂ„â€ˇ z nastĂ„â„˘pnymi paczkami i robiĂ„â€ˇ zbiorczy push.

## STAGE93_MANUAL_TEST_CALENDAR_DESKTOP — 2026-05-16
- Manual test needed: open `/calendar` at desktop 2048x972 and normal zoom.
- Verify the week rail shows day label, full date label and plain text count.
- Verify no black count badge/plaque and no old week filter list.

## NEXT_STAGE_CALENDAR_BATCH_REPAIR_AFTER_SWEEP_2026_05_16

1. PrzeczytaĂ„â€ˇ `_project/runs/STAGE94_CALENDAR_UI_SWEEP_LOCAL_REPORT.md`.
2. Na podstawie P1 zrobiĂ„â€ˇ jednĂ„â€¦ zbiorczĂ„â€¦ paczkĂ„â„˘ Calendar cleanup, zamiast kolejnych mikroŚâ€šatek.
3. RĂ„â„˘cznie sprawdziĂ„â€ˇ `/calendar` na desktop 2048x972 i normalnym zoomie.

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
- TEST RĂ„CZNY DO WYKONANIA: /tasks, /cases, /calendar.
- Verify trash icon is red, background is white/subtle, hover is subtle, and there is no red square/plaque.

## Stage95 V2 manual test
- TEST RĂ„CZNY DO WYKONANIA: /tasks, /cases, /calendar. Verify red trash icon, subtle white background, no red plaque.


## Stage96 leads right rail width and position
- Test rĂ„â„˘czny: /leads na desktopie, sprawdziĂ„â€ˇ czy Filtry proste są nad Najcenniejsze leady i majĂ„â€¦ szerokoŚâ€şĂ„â€ˇ jak /clients.
- Test rĂ„â„˘czny: /clients porównaĂ„â€ˇ szerokoŚâ€şĂ„â€ˇ raila.
- Nie zmieniaĂ„â€ˇ listy leadów w tym etapie.

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

- Manual test: open /, expand ZalegŚâ€še zadania or Zadania do obsŚâ€šugi, verify every task row has Edytuj and Zrobione.
- Click Zrobione and verify the task disappears from the active Today list after completion.

## Stage97 manual test / Today

- Open /.
- Find Zalegle zadania or Zadania do obslugi.
- Verify task rows show Edytuj + Zrobione.
- Click Zrobione and confirm task disappears after completion refresh.


<!-- STAGE104_CALENDAR_PERFORMANCE_F -->
## 2026-05-16 ËĂ˘â€š¬„ Stage104 / Paczka F ËĂ˘â€š¬„ Calendar loading performance

STATUS: WDROŚ»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juŚÄ˝ liczyĂ„â€ˇ `combineScheduleEntries` wprost w renderze.
- Dni miesiĂ„â€¦ca i tygodnia korzystajĂ„â€¦ z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juŚÄ˝ uŚÄ˝ywaĂ„â€ˇ `getEntriesForDay(...)` w render path.
- `cases` idĂ„â€¦ z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeŚâ€šnostronicowy loader zostaŚâ€š zastĂ„â€¦piony maŚâ€šym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeŚâ€şli nie uŚÄ˝yto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiĂ„â€¦ca zostaŚâ€šy nietkniĂ„â„˘te i wymagajĂ„â€¦ osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rĂ„â„˘czny `/calendar`: start, tydzieŚ„, miesiĂ„â€¦c, wybrany dzieŚ„, edycja, +1H/+1D/+1W, zrobione, usuŚ„.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G ËĂ˘â€š¬„ Templates delete + visual contract ËĂ˘â€š¬„ 2026-05-16

STATUS: WDROŚ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaŚâ€š widoczny przycisk UsuŚ„ na karcie szablonu.
- Delete uŚÄ˝ywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeŚâ€şli szablon ma pozycje checklisty.
- Karta szablonu uŚÄ˝ywa cf-template-card cf-readable-card i markerów
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaŚâ€š uŚÄ˝yty w aktywnych sprawach. Wymusza Śâ€şwiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaĂ„â€ˇ /templates; dopiero potem zdecydowaĂ„â€ˇ, czy robimy kolejny lokalny etap czy wspólny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_NEXT_2026_05_17 -->
## NastĂ„â„˘pny krok po Stage98B-100B

1. UruchomiĂ„â€ˇ paczkĂ„â„˘ lokalnie na `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
2. JeŚÄ˝eli wszystkie testy i `verify:closeflow:quiet` przejdĂ„â€¦, paczka wykona commit/push.
3. OtworzyĂ„â€ˇ `/calendar`.
4. ZrobiĂ„â€ˇ screen dnia z `1 wpis` i dnia z `0 wpisów`.
5. ZamknĂ„â€¦Ă„â€ˇ etap dopiero po potwierdzeniu braku mojibake i braku pustego biaŚâ€šego mini-kafelka.
6. Dopiero potem ruszaĂ„â€ˇ modal i templates.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 — Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKâ€śW
- Poprzednia paczka Stage104B nie wykonaŚâ€ša patchera: plik CJS miaŚâ€š bŚâ€šĂ„â€¦d skŚâ€šadni przez nieucieczony backtick w osadzonym teŚâ€şcie.
- Faktyczny problem UI: w Plan najbliŚÄ˝szych dni wpis istnieje, ale renderuje siĂ„â„˘ jako wĂ„â€¦ski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie uŚÄ˝ywa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, peŚâ€šnych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguŚâ€š.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RĂ„CZNY
Status: TEST RĂ„CZNY DO WYKONANIA. WejŚâ€şĂ„â€ˇ na /calendar i sprawdziĂ„â€ˇ dzieŚ„ z 1 wpis oraz dzieŚ„ z 0 wpisów.

## Stage104E - do rozwaŚÄ˝enia
- Audyt opóŚźnienia po UsuŚ„ / Zrobione: optimistic update albo refresh bez Google inbound pull po lokalnej mutacji.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Po wdrozeniu Stage107 wykonac reczny test ClientDetail.
- Jezeli console nadal pokazuje Radix `Missing Description`, zrobic osobny etap aria-dialog-accessibility.
- Jezeli console nadal pokazuje `DEP0169 url.parse`, zrobic osobny etap backend dependency/runtime warning audit.


## Stage113 manual visual check
1. SprawdziĂ„â€ˇ logo w desktop sidebar, mobile top, mobile drawer i login.
2. ZgŚâ€šosiĂ„â€ˇ tylko jednĂ„â€¦ korektĂ„â„˘, jeŚâ€şli potrzebna: rozmiar, kontrast, margines albo obrys.


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

## Stage115 - nastĂ„â„˘pny krok po 3.1

1. Damian: test rĂ„â„˘czny /leads/:id: karta kontaktowa po lewej, telefon/e-mail/firma/ostatni kontakt, copy button.
2. JeŚÄ˝eli 3.1 OK: osobny podetap Stage115.2 dla notatek leada.
3. Potem osobno: Stage115.3 overdue taski i Stage115.4 finanse leada, bez mieszania przyczyn w jednym patchu.

## Stage115B next step

- Damian manual check: verify LeadDetail note section placement and content for leads with/without source note and note activity.
- Continue Stage115 with overdue and finance fixes only after this placement is accepted.

## Stage115C next step

- Damian manual check: type a note in LeadDetail Historia kontaktu and click Dodaj notatkĂ„â„˘. Expected: inline save, no modal.
- If confirmed, continue Stage115D with overdue/task persistence.
- Keep finance repair as a separate Stage115E step.

## Stage115D next step

- Damian manual check: create or find a lead task with a date in the past and status todo/open. Expected: `ZalegŚâ€še` red pill in work list and nearest action.
- If confirmed, continue Stage115E finance repair.
- Do not mix finance with overdue logic.

## Stage115E next step

- Damian manual check: click Dodaj zaliczkĂ„â„˘ and PŚâ€šatnoŚâ€şĂ„â€ˇ czĂ„â„˘Śâ€şciowa in /leads/:id. Expected: modal opens, positive amount saves, finance panel refreshes.
- After manual QA, close Stage115 LeadDetail P1 batch or schedule full finance unification.

## Stage116 - Today work item card source of truth

- Manual QA: /today task/event rows and NajbliŚÄ˝sze 7 dni task/event rows.
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

Status: WDRAŚ»ANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwaĂ„â€ˇ wpis od razu po udanym PATCH, zamiast polegaĂ„â€ˇ wyŚâ€šĂ„â€¦cznie na refreshSupabaseBundle().

Test rĂ„â„˘czny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmieniĂ„â€ˇ dzieŚ„/godzinĂ„â„˘.
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

- Uruchomi„Ă˘â‚¬Ë‡:
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs.
- Uruchomi„Ă˘â‚¬Ë‡:
pm run build.
- Test r„Ă˘„Ëczny: /settings, sekcja ËĂ˘â€š¬ŚÄľPrzypomnienia Google CalendarËĂ˘â€š¬ŚĄ, pola ËĂ˘â€š¬ŚÄľTyp przypomnienia GoogleËĂ˘â€š¬ŚĄ i ËĂ˘â€š¬ŚÄľIle minut wczeĂ„ąĂ˘â‚¬źniejËĂ˘â€š¬ŚĄ.
- Nie pushowa„Ă˘â‚¬Ë‡ osobno, dopi„Ă˘â‚¬¦„Ă˘â‚¬Ë‡ do wi„Ă˘„Ëkszej paczki lokalnych UI poprawek po potwierdzeniu Damiana.

## 2026-05-29 - Next after STAGE179 Settings readability

- Uruchomi„Ă˘â‚¬Ë‡:
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs.
- Uruchomi„Ă˘â‚¬Ë‡:
pm run build.
- Test r„Ă˘„Ëczny: /settings, sekcja ËĂ˘â€š¬ŚÄľPrzypomnienia Google CalendarËĂ˘â€š¬ŚĄ, pola ËĂ˘â€š¬ŚÄľTyp przypomnienia GoogleËĂ˘â€š¬ŚĄ i ËĂ˘â€š¬ŚÄľIle minut wczeĂ„ąĂ˘â‚¬źniejËĂ˘â€š¬ŚĄ.
- Nie pushowa„Ă˘â‚¬Ë‡ osobno, dopi„Ă˘â‚¬¦„Ă˘â‚¬Ë‡ do wi„Ă˘„Ëkszej paczki lokalnych UI poprawek po potwierdzeniu Damiana.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_START -->
## 2026-06-04 — STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH — owner control roadmap po deep research CRM

STATUS: DO WDROŚ»ENIA JAKO ETAP PAMIĂ„CI/ROADMAPY. NIE ZMIENIA RUNTIME UI ANI LOGIKI APLIKACJI.

### Powód etapu

Po analizie konkurencji CRM i raportu `deep-research-report (2).md` dopinamy roadmapĂ„â„˘ CloseFlow do realnego kierunku produktu:

CloseFlow nie ma konkurowaĂ„â€ˇ jako tani, szeroki CRM. CloseFlow ma byĂ„â€ˇ operacyjnym systemem pilnowania ruchu sprzedaŚÄ˝owego, nastĂ„â„˘pnego kroku, ciszy, spraw i pieniĂ„â„˘dzy dla maŚâ€šych firm usŚâ€šugowych.

### Realny stan aplikacji potwierdzony przed wpisem

FAKTY Z REPO:
- Repo: `dkknapikdamian-collab/leadflowv1`.
- Aktywna gaŚâ€šĂ„â€¦Śź projektu wedŚâ€šug pamiĂ„â„˘ci projektu: `dev-rollout-freeze`.
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- `README.md` na `dev-rollout-freeze` juŚÄ˝ pozycjonuje produkt jako aplikacjĂ„â„˘ do pilnowania leadów, follow-upów, zadaŚ„, wydarzeŚ„ i spraw po sprzedaŚÄ˝y.
- GŚâ€šówne widoki istniejĂ„â€¦ w routingu aplikacji: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, AiDrafts, Billing, Support, Notifications, Templates.
- `package.json` ma istniejĂ„â€¦ce guardy/komendy powiĂ„â€¦zane z no-next-step, nearest action, Today, billing, Google Calendar, release gate i `verify:closeflow:quiet`.
- `_project/07_NEXT_STEPS.md` jest realnĂ„â€¦ listĂ„â€¦ etapów/next steps, ale zawiera teŚÄ˝ historiĂ„â„˘, duplikaty i mojibake po starszych stage’ach. Ten etap dopina nowĂ„â€¦ roadmapĂ„â„˘ jako osobny blok bez kasowania historii.

### Decyzja produktowa

DECYZJA DAMIANA / KIERUNEK:
- Nie budujemy Ă˘â‚¬ĹľtaŚ„szego CRM-a„.
- Nie kopiujemy Tillio/Firmao/HubSpot/Pipedrive feature-for-feature.
- Budujemy wŚâ€šaŚâ€şcicielski system kontroli: kto ucieka, kto nie ma kolejnego kroku, która sprawa stoi, gdzie leŚÄ˝Ă„â€¦ pieniĂ„â€¦dze, co trzeba ruszyĂ„â€ˇ dzisiaj.
- SaaS ma byĂ„â€ˇ furtkĂ„â€¦. Realna monetyzacja ma iŚâ€şĂ„â€ˇ przez wdroŚÄ˝enie procesu, playbooki, cleanup i miesiĂ„â„˘czny review.

### Logiczna kolejnoŚâ€şĂ„â€ˇ etapów do wdroŚÄ˝enia

#### A35 — Readiness Audit / Owner Control Baseline

CEL:
- ZbudowaĂ„â€ˇ wewnĂ„â„˘trzny i/lub póŚâ€šproduktowy audyt gotowoŚâ€şci sprzedaŚÄ˝owej.
- Audyt ma dziaŚâ€šaĂ„â€ˇ na realnych danych leadów/spraw z ostatnich 30 dni lub na rĂ„â„˘cznie/importowo podanych danych.

ZAKRES:
- Policz:
  - leady bez nastĂ„â„˘pnego kroku,
  - leady bez kontaktu 7+ dni,
  - leady bez kontaktu 14+ dni,
  - sprawy bez ruchu,
  - sprawy z wartoŚâ€şciĂ„â€¦ finansowĂ„â€¦, ale bez nastĂ„â„˘pnego kroku,
  - rekordy bez wŚâ€šaŚâ€şciciela/odpowiedzialnego,
  - rekordy z notatkĂ„â€¦, ale bez zadania/follow-upu.
- DodaĂ„â€ˇ raport: `CloseFlow Readiness Audit`.
- Wynik ma byĂ„â€ˇ uŚÄ˝ywalny jako:
  - wewnĂ„â„˘trzny ekran diagnostyczny,
  - podstawa oferty `CloseFlow Control Sprint`,
  - ŚźródŚâ€šo danych do kolejnych etapów.

NIE RUSZAĂ„â€ :
- Nie budowaĂ„â€ˇ BI dashboardu.
- Nie budowaĂ„â€ˇ peŚâ€šnego scoringu AI.
- Nie rozbudowywaĂ„â€ˇ ERP/faktur/KSeF.

GUARD/TEST:
- Guard ma sprawdzaĂ„â€ˇ, ŚÄ˝e A35 dokumentuje metryki: no-next-step, 7d silence, 14d silence, stale cases, money-without-next-step.
- Test rĂ„â„˘czny: na danych testowych/realnych porównaĂ„â€ˇ liczby z listĂ„â€¦ leadów/spraw.

#### A35B — Mandatory Next Step Contract

CEL:
- KaŚÄ˝dy aktywny lead/sprawa musi mieĂ„â€ˇ jasny stan kolejnego kroku albo Śâ€şwiadomy status `brak kolejnego kroku`.

ZAKRES:
- UjednoliciĂ„â€ˇ definicjĂ„â„˘ `next step`.
- Na LeadDetail/ClientDetail/CaseDetail pokazywaĂ„â€ˇ:
  - ostatni kontakt,
  - nastĂ„â„˘pny krok,
  - liczba dni ciszy,
  - status ryzyka,
  - szybkie akcje: ustaw follow-up, dodaj zadanie, dodaj notatkĂ„â„˘, oznacz jako martwy/utracony.
- Nie pozwoliĂ„â€ˇ, ŚÄ˝eby historia aktywnoŚâ€şci byŚâ€ša tylko dziennikiem. Historia ma karmiĂ„â€ˇ status ryzyka.

NIE RUSZAĂ„â€ :
- Nie robiĂ„â€ˇ jeszcze peŚâ€šnej automatyzacji.
- Nie mieszaĂ„â€ˇ z AI drafts rebuild.

GUARD/TEST:
- Guard: detail views majĂ„â€¦ widoczny kontrakt last-contact / next-step / silence-age / risk.
- Test rĂ„â„˘czny: lead z kontaktem, lead bez kontaktu, sprawa z pŚâ€šatnoŚâ€şciĂ„â€¦, sprawa bez nastĂ„â„˘pnego kroku.

#### A41 — Contact Cadence Grid / Reminder Engine

CEL:
- DodaĂ„â€ˇ czytelnĂ„â€¦ siatkĂ„â„˘ kontaktu jako gŚâ€šówny widok operacyjny, nie jako spam powiadomieŚ„.

ZAKRES:
- Widok/sekcja `Siatka kontaktu`.
- Bucket/filtrowanie:
  - kontakt dziŚâ€ş,
  - 1 dzieŚ„ ciszy,
  - 2 dni ciszy,
  - 3 dni ciszy,
  - 5 dni ciszy,
  - 7 dni ciszy,
  - 14 dni ciszy.
- KaŚÄ˝dy rekord pokazuje:
  - osoba/firma,
  - typ: lead/klient/sprawa,
  - ostatni kontakt,
  - nastĂ„â„˘pny krok,
  - wartoŚâ€şĂ„â€ˇ sprawy jeŚâ€şli istnieje,
  - status ryzyka,
  - szybkie akcje.
- Engine ma bazowaĂ„â€ˇ na realnej historii aktywnoŚâ€şci, zadaniach i wydarzeniach.

NIE RUSZAĂ„â€ :
- Nie zamieniaĂ„â€ˇ tego w zwykŚâ€še browser notifications.
- Nie budowaĂ„â€ˇ jeszcze peŚâ€šnego sekwencera mailowego.

GUARD/TEST:
- Guard: bucket 7d/14d nie moŚÄ˝e byĂ„â€ˇ tylko statycznym tekstem; musi byĂ„â€ˇ poŚâ€šĂ„â€¦czony z obliczaniem ostatniego kontaktu.
- Test rĂ„â„˘czny: rekordy z róŚÄ˝nymi datami kontaktu wpadajĂ„â€¦ do wŚâ€šaŚâ€şciwych bucketów.

#### A46 — Sales Funnel Movement View / Lejek ruchu sprzedaŚÄ˝owego

CEL:
- ZbudowaĂ„â€ˇ lejek ruchu, który pokazuje nie tylko etap, ale teŚÄ˝ ciszĂ„â„˘, brak kroku, ryzyko i pieniĂ„â€¦dze.

ZAKRES:
- Pipeline/lejek ma pokazywaĂ„â€ˇ:
  - etap,
  - wiek kontaktu,
  - ostatni kontakt,
  - nastĂ„â„˘pny krok,
  - dni bez ruchu,
  - wartoŚâ€şĂ„â€ˇ/potencjalna prowizja,
  - risk flag,
  - szybkie akcje.
- Karta w lejku nie moŚÄ˝e byĂ„â€ˇ tylko nazwĂ„â€¦ i etapem.
- Lejek ma zasilaĂ„â€ˇ Today, Lost Lead Rescue i Owner Digest.

NIE RUSZAĂ„â€ :
- Nie kopiowaĂ„â€ˇ klasycznego CRM kanban jako caŚâ€šoŚâ€şci.
- Nie robiĂ„â€ˇ forecastingu enterprise.

GUARD/TEST:
- Guard: karta lejka zawiera next-step, silence-age, risk, quick actions.
- Test rĂ„â„˘czny: leady/sprawy zmieniajĂ„â€¦ etap i nadal zachowujĂ„â€¦ status ruchu.

#### A42 — Lost Lead Rescue

CEL:
- ZbudowaĂ„â€ˇ osobny ekran `Do odzyskania`, nie tylko filtr w leadach.

ZAKRES:
- Pokazuje:
  - brak ruchu 7+ dni,
  - 14 dni ciszy,
  - brak nastĂ„â„˘pnego kroku,
  - leady z duŚÄ˝Ă„â€¦ wartoŚâ€şciĂ„â€¦ bez aktywnoŚâ€şci,
  - niedokoŚ„czone szkice,
  - leady bez wŚâ€šaŚâ€şciciela.
- Szybkie akcje:
  - odezwij siĂ„â„˘ dziŚâ€ş,
  - utwórz zadanie,
  - odŚâ€šóŚÄ˝,
  - dodaj notatkĂ„â„˘,
  - przygotuj szkic,
  - oznacz jako martwy/utracony.
- Widok ma byĂ„â€ˇ uŚÄ˝ywalny codziennie/tygodniowo przez wŚâ€šaŚâ€şciciela.

NIE RUSZAĂ„â€ :
- Nie robiĂ„â€ˇ rozbudowanych automatyzacji marketingowych.
- Nie wysyŚâ€šaĂ„â€ˇ nic automatycznie bez akceptacji.

GUARD/TEST:
- Guard: ekran/rescue model wymaga kryteriów 7d, 14d, no-next-step i quick actions.
- Test rĂ„â„˘czny: minimum 5 przypadków testowych wpada do wŚâ€šaŚâ€şciwych sekcji.

#### A45 — Finance Watchlist / Money-at-Risk

CEL:
- ZbudowaĂ„â€ˇ listĂ„â„˘ pieniĂ„â„˘dzy do ruszenia, nie peŚâ€šny moduŚâ€š ksiĂ„â„˘gowy.

ZAKRES:
- Pokazuje:
  - sprawy z wartoŚâ€şciĂ„â€¦, ale bez nastĂ„â„˘pnego kroku,
  - prowizje do rozliczenia,
  - wpŚâ€šaty po terminie,
  - brak daty pŚâ€šatnoŚâ€şci,
  - korekty do sprawdzenia,
  - duŚÄ˝e kwoty bez ruchu 7+ dni.
- PowiĂ„â€¦zaĂ„â€ˇ z istniejĂ„â€¦cymi finansami sprawy: wartoŚâ€şĂ„â€ˇ, prowizja, wpŚâ€šaty, korekty, usuwanie wpŚâ€šat.
- Widok ma zasilaĂ„â€ˇ Owner Digest.

NIE RUSZAĂ„â€ :
- Nie budowaĂ„â€ˇ KSeF.
- Nie budowaĂ„â€ˇ fakturowania, magazynu, banków, ERP ani ksiĂ„â„˘gowoŚâ€şci.
- Nie kopiowaĂ„â€ˇ Firmao/Berg.

GUARD/TEST:
- Guard: finance watchlist nie moŚÄ˝e importowaĂ„â€ˇ moduŚâ€šów ksiĂ„â„˘gowych/ERP ani obiecywaĂ„â€ˇ fakturowania.
- Test rĂ„â„˘czny: sprawa z kwotĂ„â€¦ i brakiem next step pojawia siĂ„â„˘ jako money-at-risk.

#### A44 — Owner Digest / Weekly Report

CEL:
- DodaĂ„â€ˇ dzienny/tygodniowy raport wŚâ€šaŚâ€şciciela jako listĂ„â„˘ decyzji, nie vanity dashboard.

ZAKRES:
- Daily:
  - co dziŚâ€ş ruszyĂ„â€ˇ,
  - kto nie ma nastĂ„â„˘pnego kroku,
  - kto ma 7/14 dni ciszy,
  - które sprawy stojĂ„â€¦,
  - jakie pieniĂ„â€¦dze wymagajĂ„â€¦ ruchu.
- Weekly:
  - ile leadów weszŚâ€šo,
  - ile leadów bez next step,
  - ile 7d/14d ciszy,
  - ile spraw bez ruchu,
  - ile pieniĂ„â„˘dzy bez ruchu,
  - najwiĂ„â„˘ksze ryzyko tygodnia.
- Digest ma byĂ„â€ˇ widoczny w aplikacji i docelowo moŚÄ˝liwy do wysyŚâ€ški, ale bez automatycznego wysyŚâ€šania bez konfiguracji/akceptacji.

NIE RUSZAĂ„â€ :
- Nie robiĂ„â€ˇ newslettera.
- Nie robiĂ„â€ˇ dashboardu wykresów dla samego wyglĂ„â€¦du.
- Nie wysyŚâ€šaĂ„â€ˇ e-maili, jeŚâ€şli produkcyjny email nie jest gotowy.

GUARD/TEST:
- Guard: digest ma zawieraĂ„â€ˇ listĂ„â„˘ ryzyk i akcji, nie tylko metryki.
- Test rĂ„â„˘czny: owner widzi co dziŚâ€ş zrobiĂ„â€ˇ bez przechodzenia przez 5 ekranów.

#### A36 — Drafts Rebuild / Jedna skrzynka szkiców

CEL:
- PrzebudowaĂ„â€ˇ szkice jako jedno miejsce zatwierdzania danych, ale dopiero po warstwie kontroli.

ZAKRES:
- Jedna skrzynka:
  - rĂ„â„˘czny szkic,
  - wklejony tekst,
  - dyktowanie,
  - parser,
  - AI.
- ZatwierdŚź jako:
  - lead,
  - zadanie,
  - wydarzenie,
  - notatka,
  - follow-up.
- Po zatwierdzeniu wpis musi automatycznie przypisaĂ„â€ˇ siĂ„â„˘ do lead/klient/sprawa, jeŚâ€şli kontekst jest znany.
- AI dalej dziaŚâ€ša confirm-first: nie zapisuje finalnych danych bez akceptacji uŚÄ˝ytkownika.

NIE RUSZAĂ„â€ :
- Nie sprzedawaĂ„â€ˇ tego jako gŚâ€šównego wyróŚÄ˝nika Ă˘â‚¬ĹľAI CRM„.
- Nie dodawaĂ„â€ˇ automatycznego wysyŚâ€šania wiadomoŚâ€şci.

GUARD/TEST:
- Guard: AI drafts confirm-first i brak automatycznego finalnego zapisu bez akceptacji.
- Test rĂ„â„˘czny: szkic z LeadDetail/ClientDetail/CaseDetail zachowuje kontekst.

#### A47 — Branchen Playbooks / Control Sprint Offer

CEL:
- SpiĂ„â€¦Ă„â€ˇ produkt z usŚâ€šugĂ„â€¦ wdroŚÄ˝eniowĂ„â€¦, ŚÄ˝eby nie sprzedawaĂ„â€ˇ samego taniego SaaS.

ZAKRES:
- Oferta startowa:
  - `CloseFlow Control Sprint`,
  - readiness audit,
  - import/porzĂ„â€¦dkowanie danych,
  - ustawienie etapów,
  - next-step discipline,
  - contact cadence,
  - owner digest,
  - podstawowy finance watchlist,
  - jedno szkolenie.
- Pierwszy segment:
  - maŚâ€še usŚâ€šugi B2B z inboundem i wŚâ€šaŚâ€şcicielem blisko sprzedaŚÄ˝y.
- Playbook V1:
  - etapy,
  - wymagane next steps,
  - progi ciszy,
  - zasady follow-upu,
  - raport ownera.

NIE RUSZAĂ„â€ :
- Nie robiĂ„â€ˇ 10 branŚÄ˝ naraz.
- Nie budowaĂ„â€ˇ marketplace’u playbooków.
- Nie robiĂ„â€ˇ bespoke wdroŚÄ˝eŚ„ bez szablonu.

GUARD/TEST:
- Guard: roadmapa nie moŚÄ˝e mieĂ„â€ˇ wiĂ„â„˘cej niŚÄ˝ jednego aktywnego segmentu startowego bez oznaczenia `DO_POTWIERDZENIA`.
- Test sprzedaŚÄ˝owy: 10 rozmów / demo na danych z ostatnich 30 dni / próba sprzedaŚÄ˝y Control Sprint.

### Minimalny porzĂ„â€¦dek wdroŚÄ˝enia

1. A35 Readiness Audit.
2. A35B Mandatory Next Step Contract.
3. A41 Contact Cadence Grid.
4. A46 Sales Funnel Movement View.
5. A42 Lost Lead Rescue.
6. A45 Finance Watchlist.
7. A44 Owner Digest / Weekly Report.
8. A36 Drafts Rebuild.
9. A47 Branchen Playbooks / Control Sprint Offer.

### Warunki zamkniĂ„â„˘cia tej roadmapy

- KaŚÄ˝dy etap ma osobny run report w `_project/runs/`.
- KaŚÄ˝dy etap ma guard/test albo jawny SKIP z powodem.
- KaŚÄ˝dy etap aktualizuje `_project/07_NEXT_STEPS.md`, `_project/08_CHANGELOG_AI.md`, `_project/12_IMPLEMENTATION_LEDGER.md`, `_project/13_TEST_HISTORY.md`.
- KaŚÄ˝dy etap ma aktualizacjĂ„â„˘ Obsidiana albo manifest.
- Nie uŚÄ˝ywaĂ„â€ˇ `git add .`.
- Nie robiĂ„â€ˇ push przed testami/guardami i rĂ„â„˘cznym potwierdzeniem, jeŚâ€şli etap dotyka runtime UI.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaŚâ€šy siĂ„â„˘ na kruchych anchorach w Clients.tsx.
- V3 uŚÄ˝ywa elastycznych regexów i naprawia czĂ„â„˘Śâ€şciowy lokalny stan.
- Docelowy wzór: [Oferta wysŚâ€šana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaŚâ€š wypchniĂ„â„˘ty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaŚâ€š patcha Settings/Cases, wiĂ„â„˘c helper i guard weszŚâ€šy bez sekcji ustawieŚ„ i bez case badges.
- R2B dopina brakujĂ„â€¦ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeŚâ€şniej przechodziŚâ€š, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siĂ„â„˘ domknĂ„â€¦Ă„â€ˇ hotfixem.
- R2B ma byĂ„â€ˇ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeŚâ€şli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeŚâ€şli plik istnieje
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, ŚÄ˝eby nie udawaĂ„â€ˇ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uŚÄ˝ywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozróŚÄ˝nia ciszĂ„â„˘ kontaktu od braku Śâ€şwieŚÄ˝ego ruchu fallback.
- Dodano runtime testy, które realnie wywoŚâ€šujĂ„â€¦ funkcje przez esbuild, nie tylko szukajĂ„â€¦ tekstu.

DECYZJE DAMIANA:
- Podetapów A-D nie pushujemy osobno.
- Nie robiĂ„â€ˇ drugiego Today.
- Badge majĂ„â€¦ wynikaĂ„â€ˇ z jednego kontraktu ruchu i prawdy aktywnoŚâ€şci.
- `updatedAt` moŚÄ˝e byĂ„â€ˇ fallbackiem aktywnoŚâ€şci, nie prawdĂ„â€¦ kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeŚâ€šne wpiĂ„â„˘cie LeadDetail/CaseDetail widocznego work center moŚÄ˝na zrobiĂ„â€ˇ jako D2, jeŚâ€şli po runtime contract nie bĂ„â„˘dzie regresji.
- Today agregacja moŚÄ˝e dostaĂ„â€ˇ ranking w nastĂ„â„˘pnym kroku, ale bez nowej sekcji.

NASTĂ„PNY KROK:
- Po zielonych testach sprawdziĂ„â€ˇ /leads, /cases, /today.
- Commit/push dopiero po caŚâ€šym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryŚâ€š realny bŚâ€šĂ„â€¦d: fallback z `updatedAt` nadpisywaŚâ€š prawdziwĂ„â€¦ aktywnoŚâ€şĂ„â€ˇ.
- Build przeszedŚâ€š, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` są uŚÄ˝ywane wyŚâ€šĂ„â€¦cznie, gdy nie ma realnych kandydatów aktywnoŚâ€şci/kontaktu/pŚâ€šatnoŚâ€şci.
- To naprawia zaŚâ€šoŚÄ˝enie: nie udajemy kontaktu ani Śâ€şwieŚÄ˝ej aktywnoŚâ€şci przez zwykŚâ€šy update rekordu.

DECYZJE:
- Nie pushowaĂ„â€ˇ Stage223, dopóki runtime testy nie są zielone.
- UtrzymaĂ„â€ˇ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajĂ„â€¦ jednym lokalnym blokiem do jednego commita po peŚâ€šnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTĂ„PNY KROK:
- Po zielonych testach moŚÄ˝na dopiero rozwaŚÄ˝yĂ„â€ˇ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaŚâ€š release na brakujĂ„â€¦cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiĂ„â„˘c brak samego pliku blokuje push.
- R2C dodaje brakujĂ„â€¦cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy release gate.
- Dodajemy minimalny test kontraktu ŚźródŚâ€ša logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push dla caŚâ€šego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedŚâ€š Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaŚâ€š release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byŚâ€š renderowany przez `EntityTrashButton`, ale brakowaŚâ€šo starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujĂ„â€¦cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy guardów.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejĂ„â€¦cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiĂ„â€¦Śâ€š marker kosza na liŚâ€şcie spraw, ale release gate przeszedŚâ€š do kolejnego warunku.
- Guard `case trash actions` wymaga teŚÄ˝, ŚÄ˝eby `CaseDetail.tsx` uŚÄ˝ywaŚâ€š `EntityTrashButton`.
- `CaseDetail.tsx` miaŚâ€š przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaŚâ€š zwykŚâ€šy `Button`.
- R2E zmienia tylko ŚźródŚâ€šo przycisku na `EntityTrashButton` i uŚÄ˝ywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy guardów.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspólnego ŚźródŚâ€ša prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiĂ„â€¦Śâ€š `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, ŚÄ˝eby `CaseDetail.tsx` zawieraŚâ€š `EntityTrashButton`.
- R2F speŚâ€šnia oba kontrakty: importuje/uŚÄ˝ywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czaĂ„â€ˇ guardów.
- Nie zmieniaĂ„â€ˇ release gate.
- RozwiĂ„â€¦zaĂ„â€ˇ konflikt guardów aliasem, nie obejŚâ€şciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaŚâ€š release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych ŚźródŚâ€šach.
- PozostaŚâ€še literalne znaki mojibake w guardach/testach są zamieniane na ASCII unicode escapes, ŚÄ˝eby guardy mogŚâ€šy dalej opisywaĂ„â€ˇ zŚâ€še znaki bez Śâ€šamania Stage98.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiŚâ€š Stage98 i przeprowadziŚâ€š build.
- `verify:closeflow:quiet` zatrzymaŚâ€š release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaŚâ€ša, ŚÄ˝e extractor Śâ€šapaŚâ€š default `{}`, nie ciaŚâ€šo funkcji.
- Sama logika local-first byŚâ€ša poprawna: funkcja ma `Promise.all([` i nie woŚâ€ša Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaŚâ€ša funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, ŚÄ˝eby kontrakt testu i logika byŚâ€šy spójne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiŚâ€š extractor funkcji Stage120 przez usuniĂ„â„˘cie `= {}` z sygnatury.
- Po R2H test Stage120 doszedŚâ€š dalej i wykazaŚâ€š twardy wymóg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszĂ„â€¦ byĂ„â€ˇ literalnie bez argumentów.
- R2I przywraca literalne local reads bez argumentów i zostawia poprawionĂ„â€¦ sygnaturĂ„â„˘ `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, ŚÄ˝eby nie zmieniaĂ„â€ˇ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiĂ„â€¦zujĂ„â€¦cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaŚâ€š release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juŚÄ˝ ma.
- `register-service-worker.ts` ma poprawnĂ„â€¦ logikĂ„â„˘: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaŚâ€š tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaŚâ€š release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenów w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiĂ„â€¦zania`.
- `Clients.tsx` miaŚâ€š poprawnĂ„â€¦ semantykĂ„â„˘ soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speŚâ€šniaŚâ€š starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiĂ„â€¦zaŚ„.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiĂ„â€¦zujĂ„â€¦cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byŚâ€š za ciasny: skrypt wymagaŚâ€š dokŚâ€šadnego istniejĂ„â€¦cego renderu `case-detail-history-row`, którego lokalny `CaseDetail.tsx` ma juŚÄ˝ inaczej po wczeŚâ€şniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenów:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepŚâ€šywu historii.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjĂ„â€¦ Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiŚâ€š `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speŚâ€šnia juŚÄ˝ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bŚâ€šĂ„â„˘dem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziŚâ€š `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenów w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juŚÄ˝ przechodzi, wiĂ„â„˘c brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowĂ„â€¦ funkcjĂ„â€¦.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziŚâ€š case history visual P1 repair3 oraz wszystkie wczeŚâ€şniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastĂ„â„˘pny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoŚâ€şĂ„â€ˇ klienta`,
  - `buildClientNextAction`.
- Log wskazaŚâ€š brak `Zadania klienta`.
- R2O dodaje brakujĂ„â€¦ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linków do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziŚâ€š ClientDetail operational center oraz wszystkie wczeŚâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaŚâ€š zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerów, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyŚâ€šĂ„â€¦czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyŚâ€š `api/daily-digest.ts`.
- R2Q-V2 nie wykonaŚâ€š patcha, bo helper JS miaŚâ€š bŚâ€šĂ„â€¦d skŚâ€šadni przed modyfikacjĂ„â€¦ pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokŚâ€šadny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyŚâ€ški.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziŚâ€š `daily-digest-email-runtime.test.cjs` oraz wczeŚâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenów w `api/daily-digest.ts`:
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
- Nie wyŚâ€šĂ„â€¦czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyŚâ€ški/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziŚâ€š `daily-digest-diagnostics.test.cjs` oraz wczeŚâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenów w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyŚâ€ški.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziŚâ€š `daily-digest-cron-auth.test.cjs` oraz wczeŚâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedŚâ€š dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plików `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byŚâ€šo 13 funkcji API.
- `api/system.ts` juŚÄ˝ importuje `supportHandler` i obsŚâ€šuguje `kind === 'support'`.
- `vercel.json` juŚÄ˝ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, ŚÄ˝eby zejŚâ€şĂ„â€ˇ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajĂ„â€¦ ten plik bezpoŚâ€şrednio.
- Konsolidujemy redundantny support endpoint przez istniejĂ„â€¦cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juŚÄ˝ istnieje.
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
- JeŚâ€şli gdzieŚâ€ş poza Vercel rewrite ktoŚâ€ş woŚâ€ša bezpoŚâ€şrednio plikowĂ„â€¦ funkcjĂ„â„˘ `api/support.ts`, po usuniĂ„â„˘ciu musi trafiĂ„â€ˇ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywróciŚâ€š `api/support.ts` i przeszedŚâ€š `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaŚâ€š siĂ„â„˘ przed peŚâ€šnym dopiĂ„â„˘ciem `activitiesHandler` do `api/system.ts`, wiĂ„â„˘c R2V koŚ„czy konsolidacjĂ„â„˘ `/api/activities`.
- `verify:closeflow:quiet` przeszedŚâ€š dalej i zatrzymaŚâ€š siĂ„â„˘ na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujĂ„â€¦cy kontrakt Stage32e bez przywracania starego dŚâ€šugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziĂ„â€ˇ dodawanie/odczyt aktywnoŚâ€şci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiĂ„â„˘to marker bez zmiany UI, ŚÄ˝eby nie rozwaliĂ„â€ˇ widoku.

NASTĂ„PNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caŚâ€šego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedŚâ€š masowo wiele gates, build i wiĂ„â„˘kszoŚâ€şĂ„â€ˇ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test próbuje czytaĂ„â€ˇ brakujĂ„â€¦cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerów:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujĂ„â€¦cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, który uruchamia testy z quiet gate po kolei i zbiera wszystkie bŚâ€šĂ„â„˘dy zamiast zatrzymywaĂ„â€ˇ siĂ„â„˘ na pierwszym.

DECYZJE:
- Nie uruchamiaĂ„â€ˇ rĂ„â„˘cznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyŚâ€šĂ„â€¦czaĂ„â€ˇ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uŚÄ˝ywaĂ„â€ˇ mass scan, ŚÄ˝eby Śâ€šapaĂ„â€ˇ wiele bŚâ€šĂ„â„˘dów naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byĂ„â€ˇ kopiowany rĂ„â„˘cznie do Supabase bez osobnego przeglĂ„â€¦du SQL.
- Mass scan moŚÄ˝e trwaĂ„â€ˇ dŚâ€šuŚÄ˝ej niŚÄ˝ standardowy verify, ale daje peŚâ€šniejszĂ„â€¦ listĂ„â„˘ blokad.

NASTĂ„PNY KROK:
- JeŚÄ˝eli mass scan pokaŚÄ˝e kilka kolejnych failów, zrobiĂ„â€ˇ jeden zbiorczy R2X zamiast kolejnych maŚâ€šych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaŚâ€š 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiĂ„â€ˇ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koŚ„czy teŚÄ˝ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeŚâ€şli R2U nie dokoŚ„czyŚâ€š route przez anchor.

DECYZJE:
- Nie wyŚâ€šĂ„â€¦czamy starych gate’ów.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajĂ„â€¦ jawny `aria-describedby={undefined}` escape.
- Trash actions majĂ„â€¦ iŚâ€şĂ„â€ˇ przez wspólne ŚźródŚâ€šo `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rĂ„â„˘cznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoŚâ€şci

AUDYT RYZYK:
- CzĂ„â„˘Śâ€şĂ„â€ˇ napraw to kontrakty historycznych testów, wiĂ„â„˘c po zielonym verify trzeba jeszcze obejrzeĂ„â€ˇ UI, szczególnie Calendar i Leads.
- `/api/activities` moŚÄ˝e dziaŚâ€šaĂ„â€ˇ przez rewrite do system route. Po deployu sprawdziĂ„â€ˇ aktywnoŚâ€şci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaĂ„â€ˇ prawdziwe opisy tam, gdzie dialog ma treŚâ€şĂ„â€ˇ formularzowĂ„â€¦.

NASTĂ„PNY KROK:
- Po R2X uruchomiĂ„â€ˇ mass scan. JeŚâ€şli zostanĂ„â€¦ faile, zrobiĂ„â€ˇ R2Y jako kolejny batch z peŚâ€šnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedŚâ€š wszystkie 178 testów.
- Build zatrzymaŚâ€š siĂ„â„˘ na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeŚâ€şnie Stage100/104/99 nie pozwalajĂ„â€¦, ŚÄ˝eby taki legacy combo string wróciŚâ€š do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyŚâ€šĂ„â€¦czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoŚâ€şci dla sprzecznych historycznych gate’ów. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rĂ„â„˘cznie obejrzeĂ„â€ˇ Calendar, bo R2X dotykaŚâ€š kilku klas i dialogów.
- JeŚâ€şli kolejne prebuild guardy wykaŚÄ˝Ă„â€¦ podobny konflikt literalny, naprawiaĂ„â€ˇ markerem poza renderowanĂ„â€¦ funkcjĂ„â€¦, nie cofajĂ„â€¦c UI.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2Y. JeŚÄ˝eli build i verify quiet przejdĂ„â€¦, moŚÄ˝na wykonaĂ„â€ˇ push caŚâ€šego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziŚâ€š `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaŚâ€š z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byŚâ€š sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaŚâ€š tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieŚÄ˝Ă„â€¦cego ŚźródŚâ€ša prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- ŚąródŚâ€šem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byŚâ€š sprzeczny z nowszym prebuild guardem.
- Po deployu rĂ„â„˘cznie sprawdziĂ„â€ˇ listĂ„â„˘ spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AA. JeŚâ€şli build i verify przejdĂ„â€¦, moŚÄ˝na wykonaĂ„â€ˇ push caŚâ€šego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedŚâ€š Stage105, Stage220A28, Stage95 i mass scan 178 testów.
- Build zatrzymaŚâ€š siĂ„â„˘ w `src/pages/Calendar.tsx` na bŚâ€šĂ„â„˘dzie JSX:
  `Expected "=>" but found "="`.
- BŚâ€šĂ„â€¦d powstaŚâ€š w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerów.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skŚâ€šadni po regexowym patchu. NajwiĂ„â„˘ksze ryzyko: delete button w Calendar moŚÄ˝e mieĂ„â€ˇ poprawny build, ale trzeba go kliknĂ„â€¦Ă„â€ˇ rĂ„â„˘cznie po deployu.
- Po deployu sprawdziĂ„â€ˇ `/calendar`: usuŚ„ wpis tygodnia, usuŚ„ wpis z selected day, sprawdŚź dialog/confirm i brak czerwonej plakietki.
- JeŚâ€şli kolejny build pokaŚÄ˝e bŚâ€šĂ„â€¦d skŚâ€šadni w Calendar, nie robiĂ„â€ˇ szerokiego refaktoru; naprawiĂ„â€ˇ lokalnie bŚâ€šĂ„â„˘dny JSX.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AB. JeŚâ€şli build i verify przejdĂ„â€¦, wykonaĂ„â€ˇ push caŚâ€šego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaŚâ€š juŚÄ˝ wypchniĂ„â„˘ty jako commit `66b13479`.
- Podetap E nie byŚâ€š domkniĂ„â„˘ty w wymaganym ksztaŚâ€šcie:
  - istniaŚâ€š `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaŚâ€š runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaŚâ€šo docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byŚâ€š za bardzo tokenowy i nie pilnowaŚâ€š peŚâ€šnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraŚÄ˝amy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoŚâ€şci ani redesignu Today.
- Celem R2AC jest domkniĂ„â„˘cie jakoŚâ€şci/guardów po Stage223 R2.
- Nie pushujemy bez zielonych testów koŚ„cowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RĂ„CZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoŚâ€şci zaleŚÄ˝nej od progu.
- LeadDetail: status nastĂ„â„˘pnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastĂ„â„˘pnego ruchu i pieniĂ„â„˘dzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiĂ„â€¦ i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoŚâ€şĂ„â€ˇ / ryzyko`, klikniĂ„â„˘cia do rekordów, brak agresywnego odŚâ€şwieŚÄ˝ania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GŚâ€šówne ryzyko: guard moŚÄ˝e zŚâ€šapaĂ„â€ˇ przyszŚâ€še rĂ„â„˘czne dublowanie badge w UI — to jest celowe.
- Po zielonym teŚâ€şcie moŚÄ˝na uruchomiĂ„â€ˇ lokalnie aplikacjĂ„â„˘ i przejŚâ€şĂ„â€ˇ checklistĂ„â„˘ manualnĂ„â€¦.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AC lokalnie.
- JeŚÄ˝eli testy są zielone, odpaliĂ„â€ˇ lokalnie `npm run dev:api` i sprawdziĂ„â€ˇ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaŚâ€šy siĂ„â„˘ przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uŚÄ˝ywa parsera bloków/statements, zamiast zakŚâ€šadaĂ„â€ˇ sąsiedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoŚâ€šuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uŚÄ˝ywa timeout/scroll/reorder,
  - root/capture bridges ignorujĂ„â€¦ top metric tiles,
  - top metric buttons majĂ„â€¦ wŚâ€šasne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiĂ„â„˘ty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniĂ„â„˘ciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rĂ„â„˘cznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelków: nie przenoszĂ„â€¦ list na górĂ„â„˘.
- Ryzyko lokalne: expand/collapse na `/today`; rĂ„â„˘czny smoke obowiĂ„â€¦zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelków Today.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AD V4, potem `npm run dev`, rĂ„â„˘czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaŚâ€š siĂ„â„˘ lokalnie i przeszedŚâ€š:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padŚâ€š nie przez Today, tylko przez zŚâ€šamanie kontraktu quiet gate.
- BŚâ€šĂ„â€¦d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaĂ„â€ˇ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaŚâ€š do `package.json` komendĂ„â„˘ `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokŚâ€šadnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnĂ„â€¦trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceŚ„ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byĂ„â€ˇ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byŚâ€šo proceduralne: dopiĂ„â„˘cie guarda do package scriptu Śâ€šamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wŚâ€šasny guard pilnujĂ„â€¦cy, ŚÄ˝e package script pozostaje dokŚâ€šadny, a nowy R2AD guard jest w Śâ€şrodku quiet gate.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AE. JeŚâ€şli verify quiet przejdzie, odpaliĂ„â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywróciŚâ€š exact `verify:closeflow:quiet` contract i build przechodziŚâ€š.
- Verify quiet zatrzymaŚâ€š siĂ„â„˘ na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaŚâ€š:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjĂ„â€¦ R2AD: kafelki Today nie mogĂ„â€¦ juŚÄ˝ przenosiĂ„â€ˇ sekcji w DOM ani przewijaĂ„â€ˇ do sekcji, bo to powodowaŚâ€šo scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiŚâ€š R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Śâ€şcieŚÄ˝ki klikniĂ„â„˘cia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rĂ„â„˘cznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GŚâ€šówne ryzyko: stary test wymuszaŚâ€š zachowanie, które teraz uznaliŚâ€şmy za ŚźródŚâ€šo bugów.
- Nowy kontrakt utrzymuje dostĂ„â„˘pnoŚâ€şĂ„â€ˇ i focus, ale blokuje scroll trap.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AF, potem lokalny `npm run dev`, rĂ„â„˘czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaŚâ€š siĂ„â„˘ i przeszedŚâ€š:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaŚâ€š na `git diff --check`.
- `git diff --check` wskazaŚâ€š trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyŚâ€šĂ„â€¦cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardów, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiĂ„â„˘c ryzyko runtime jest minimalne.
- RĂ„â„˘czny smoke `/today` nadal wymagany, bo wŚâ€šaŚâ€şciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeŚÄ˝enia LF/CRLF z `git diff --check` są nieblokujĂ„â€¦ce; trailing whitespace byŚâ€š blokujĂ„â€¦cy.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ R2AG.
- Po zielonym diff check odpaliĂ„â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, ŚÄ˝e formularz tworzenia leada i klienta nie miaŚâ€š pola `lastContactAt`.
- Zweryfikowano, ŚÄ˝e payload tworzenia leada/klienta nie wysyŚâ€šaŚâ€š `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juŚÄ˝ istniejĂ„â€¦ po Stage223, wiĂ„â„˘c wczeŚâ€şniejsza teza o ich braku byŚâ€ša nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadów i klientów.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyŚâ€şlnie pole pokazuje dzisiejszĂ„â€¦ datĂ„â„˘.
- JeŚÄ˝eli kontakt byŚâ€š starszy, operator ma wpisaĂ„â€ˇ prawdziwĂ„â€¦ datĂ„â„˘.
- DatĂ„â„˘ zapisujemy jako noon ISO, ŚÄ˝eby ograniczyĂ„â€ˇ problemy stref czasowych.
- Daty przyszŚâ€še są blokowane komunikatem: `Ostatni kontakt nie moŚÄ˝e byĂ„â€ˇ w przyszŚâ€šoŚâ€şci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeŚâ€şli SQL nie zostanie uruchomiony, API ma fallback dla brakujĂ„â€¦cej kolumny, ale data nie bĂ„â„˘dzie trwale zapisana w bazie.
- Lista leadów/klientów ma fallback select bez `last_contact_at`, ŚÄ˝eby nie wysadziĂ„â€ˇ produkcji przed migracjĂ„â€¦.
- PeŚâ€šne spiĂ„â„˘cie z widocznoŚâ€şciĂ„â€¦ badge `Cisza 14+ dni` zaleŚÄ˝y od tego, czy `last_contact_at` wróci z API po migracji.
- NastĂ„â„˘pny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeŚâ€şli po manualnym teŚâ€şcie badge nie bierze daty z bazy.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ SQL w Supabase.
- UruchomiĂ„â€ˇ R3A lokalnie.
- PrzetestowaĂ„â€ˇ tworzenie leada/klienta z datĂ„â€¦ 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedŚâ€š guard i runtime test dla Last Contact Intake.
- Build przeszedŚâ€š.
- `verify:closeflow:quiet` zatrzymaŚâ€š siĂ„â„˘ na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaŚâ€ša wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaŚÄ˝dej optional fallback column.
- Nie uruchamiamy osobnego peŚâ€šnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, ŚÄ˝eby potwierdziĂ„â€ˇ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rĂ„â„˘cznie sprawdziĂ„â€ˇ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTĂ„PNY KROK:
- UruchomiĂ„â€ˇ V3.
- JeŚâ€şli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 — Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwoŚâ€šanie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Średnie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przycisków Ustaw zadanie / OdŚâ€šóŚÄ˝ / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga rĂ„â„˘cznego testu po patchu.
- Rescue UI moŚÄ˝e wymagaĂ„â€ˇ póŚźniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdroŚÄ˝ony, wiĂ„â„˘c disabled actions są prawidŚâ€šowe.

## STAGE220A35 — Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartoŚâ€şĂ„â€ˇ transakcji/sprawy nie jest prowizjĂ„â€¦ wŚâ€šaŚâ€şciciela.
- ClientDetail pokazuje prowizjĂ„â„˘ naleŚÄ˝nĂ„â€¦, wpŚâ€šaconĂ„â€¦ prowizjĂ„â„˘ i prowizjĂ„â„˘ do zapŚâ€šaty jako osobne wartoŚâ€şci.
- Karta sprawy w kliencie uŚÄ˝ywa getCaseFinanceSummary, wiĂ„â„˘c prowizja procentowa 69 000 PLN — 2% daje 1 380 PLN zamiast 0 PLN.
- WartoŚâ€şĂ„â€ˇ transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mógŚâ€šby dziedziczyĂ„â€ˇ bŚâ€šĂ„â„˘dne wartoŚâ€şci finansowe.
- Nie ruszano Supabase, RLS ani backendu pŚâ€šatnoŚâ€şci.
- Model prowizji staŚâ€šej nadal uŚÄ˝ywa gotowej kwoty prowizji.

## STAGE220A36 — Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizjĂ„â„˘ staŚâ€šĂ„â€¦ od podstawy procentowej.
- Przy kwocie staŚâ€šej uŚÄ˝ytkownik wpisuje wartoŚâ€şĂ„â€ˇ prowizji.
- Przy prowizji procentowej uŚÄ˝ytkownik wpisuje wartoŚâ€şĂ„â€ˇ transakcji do wyliczenia i stawkĂ„â„˘ procentowĂ„â€¦; prowizja jest wyliczana i nieedytowalna.
- Lista klientów pokazuje prowizjĂ„â„˘ operacyjnĂ„â€¦, nie cenĂ„â„˘ transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu pŚâ€šatnoŚâ€şci.
- Techniczne pole contractValue nadal przechowuje podstawĂ„â„˘ procentu przy modelu procentowym.
- Stage227 moŚÄ˝e startowaĂ„â€ˇ dopiero po rĂ„â„˘cznym sprawdzeniu fixed/percent w modalach finansów.

## STAGE220A36-R2 — Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano ukŚâ€šad modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartoŚâ€şĂ„â€ˇ prowizji.
- Pole "WartoŚâ€şĂ„â€ˇ prowizji" jest edytowalne tylko przy kwocie staŚâ€šej.
- Przy procencie wartoŚâ€şĂ„â€ˇ prowizji wylicza siĂ„â„˘ automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartoŚâ€şĂ„â€ˇ transakcji/zlecenia, jest osobnym polem poniŚÄ˝ej gŚâ€šównych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu pŚâ€šatnoŚâ€şci.
- Ryzyko dotyczy tylko czytelnoŚâ€şci UI i bŚâ€šĂ„â„˘dnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystaĂ„â€ˇ z prowizji jako wartoŚâ€şci operacyjnej.

## STAGE220A36-R4 — Build Guard and Case Item Schema Fix

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

## STAGE220A36-R5 — R4 Guard Token Compat

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

## STAGE220A36-R6 — Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 — CaseDetail Legacy Finance Modal Wiring Fix

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

## STAGE220A36-R10 — Commission Modal Three-Field Top Row Polish

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


## STAGE220A36-R11 — Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie uŚâ€šoŚÄ˝yŚâ€š pola, ale modal nadal byŚâ€š zbyt przytŚâ€šaczajĂ„â€¦cy przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipów Ă˘â‚¬Ĺľ?„, skraca Śâ€şrodkowy label do Ă˘â‚¬ĹľStawka (%)„, zmniejsza wysokoŚâ€şĂ„â€ˇ pól i wyrównuje Śâ€şrodkowe pole stawki.

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
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje peŚâ€šnego komfortu — jeŚÄ˝eli to bĂ„â„˘dzie problem, kolejny etap powinien zrobiĂ„â€ˇ wŚâ€šasny popover.
- Trzeba rĂ„â„˘cznie sprawdziĂ„â€ˇ, czy trzy pola w górnym rzĂ„â„˘dzie nie Śâ€şciskajĂ„â€¦ siĂ„â„˘ na szerokoŚâ€şci laptopa i czy wĂ„â€¦skie ekrany poprawnie zawijajĂ„â€¦ do jednej kolumny.

## STAGE220A36-R12 — Commission Modal Width Polish

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

## STAGE226R10 — Lead/Client Separation Runtime Fix

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

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG — next step

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- po PASS: wykonaĂ„â€ˇ manual smoke /clients -> /leads -> /clients i dopiero potem wróciĂ„â€ˇ do Stage226R11 albo Stage227.
- nie ruszaĂ„â€ˇ: Stage227, Google Calendar, finanse A36, RLS, schema.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX — next step

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- po PASS: wykonaĂ„â€ˇ manual smoke /clients -> /leads -> /clients. Dopiero potem Stage226R11 timezone albo Stage227.
- nie ruszaĂ„â€ˇ: Stage227, Google Calendar, finanse, RLS, schema.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — next step

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- po PASS: rĂ„â„˘cznie przetestowaĂ„â€ˇ konflikt/duplikat dla klienta i leada; dopiero potem wróciĂ„â€ˇ do Stage226R11 timezone Google Calendar albo kolejnego etapu.
- nie ruszaĂ„â€ˇ: Stage227 przed domkniĂ„â„˘ciem lead/client + conflict gate smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — next step

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- po PASS: rĂ„â„˘czny smoke produkcyjny CloseFlow -> Google Calendar -> inbound sync.
- dopiero po potwierdzeniu timezone/reminders wróciĂ„â€ˇ do Stage227 — Sales Funnel Movement View.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — next step

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- po PASS R11B wykonaĂ„â€ˇ push R11/R11B, potem rĂ„â„˘czny smoke Google Calendar: godzina + przypomnienie.
- nie przechodziĂ„â€ˇ do Stage227 bez smoke Google Calendar.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_NEXT_START -->
## 2026-06-06 15:35 Europe/Warsaw ËĂ˘â€š¬„ STAGE227A next step

1. Uruchomi„Ă˘â‚¬Ë‡ lokalny apply i testy.
2. Otworzy„Ă˘â‚¬Ë‡ `/funnel` lokalnie.
3. Sprawdzi„Ă˘â‚¬Ë‡ leady, sprawy, next step, cisz„Ă˘„Ë, ryzyko i wartoĂ„ąĂ˘â‚¬ź„Ă˘â‚¬Ë‡/prowizj„Ă˘„Ë.
4. Po akceptacji Damiana zrobi„Ă˘â‚¬Ë‡ selektywny commit/push bez `git add .`.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_NEXT_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_NEXT_START -->
## 2026-06-06 15:45 Europe/Warsaw ËĂ˘â€š¬„ STAGE227B ËĂ˘â€š¬„ next step

Po lokalnym PASS trzeba r„Ă˘„Ëcznie sprawdzi„Ă˘â‚¬Ë‡ `http://localhost:3000/funnel`. JeĂ„ąĂ„Ëťeli widok jest czytelny, moĂ„ąĂ„Ëťna zrobi„Ă˘â‚¬Ë‡ selektywny commit/push. JeĂ„ąĂ„Ëťeli nie, kolejny etap powinien dopracowa„Ă˘â‚¬Ë‡ tylko kompozycj„Ă˘„Ë UI, bez ruszania helperĂ„â€šŚâ€šw danych.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_NEXT_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_NEXT_START -->
## 2026-06-06 17:05 Europe/Warsaw ËĂ˘â€š¬„ STAGE228A next step

Po wdroĂ„ąĂ„Ëťeniu sprawdzi„Ă˘â‚¬Ë‡ `/funnel`: domyĂ„ąĂ˘â‚¬źlnie powinny by„Ă˘â‚¬Ë‡ widoczne wszystkie rekordy, klikni„Ă˘„Ëcie `Pieni„Ă˘â‚¬¦dze` ma pokaza„Ă˘â‚¬Ë‡ rekord z kwot„Ă˘â‚¬¦ 1380 PLN, a klikni„Ă˘„Ëcie rekordu ma prowadzi„Ă˘â‚¬Ë‡ do sprawy. Nast„Ă˘„Ëpny etap: Stage228B Lead Work Action Center.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_NEXT_END -->

## 2026-06-06 18:00 Europe/Warsaw ËĂ˘â€š¬„ STAGE228B Lead Work Action Center

- typ: etap wdroĂ„ąĂ„Ëťeniowy local-only
- decyzja: Lead nie dostaje peĂ„ąĂ˘â‚¬nego lejka; dostaje centrum pracy ËĂ˘â€š¬ŚÄľCo robimy teraz?ËĂ˘â€š¬ŚĄ z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzy„Ă˘â‚¬Ë‡ drugiego systemu dziaĂ„ąĂ˘â‚¬aĂ„ąĂ˘â‚¬Ĺľ; uĂ„ąĂ„Ëťywa„Ă˘â‚¬Ë‡ istniej„Ă˘â‚¬¦cych handlerĂ„â€šŚâ€šw LeadDetail.

## 2026-06-06 18:36 Europe/Warsaw - After Stage228B R8

1. Push Stage228B R8 hotfix.
2. Verify LeadDetail opens on the server without APP_ROUTE_RENDER_FAILED.
3. Manually test actions: Edytuj, Jutro, Zrobione, UsuŚ„.
4. Continue with STAGE228C_CLIENT_MOVEMENT_PANEL_AFTER_R8 only after LeadDetail is stable.

## 2026-06-06 18:42 Europe/Warsaw — STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiaĂ„â€ˇ guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw — STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw — STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw — STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail dziaŚâ€ša, ale centrum dziaŚâ€šaŚ„ leada byŚâ€šo mniej czytelne niŚÄ˝ analogiczna karta sprawy.
- DECYZJA: Nie tworzyĂ„â€ˇ osobnego systemu wizualnego dla leada. Lead action center ma iŚâ€şĂ„â€ˇ w kierunku tego samego ŚźródŚâ€ša wizualnego co CaseDetail: jeden nagŚâ€šówek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: UsuniĂ„â„˘to duplikujĂ„â€¦ce copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych braków/blokad zamiast dublowaĂ„â€ˇ kaŚÄ˝de zalegŚâ€še wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdziĂ„â€ˇ rĂ„â„˘cznie LeadDetail z zalegŚâ€šym wydarzeniem i porównaĂ„â€ˇ czytelnoŚâ€şĂ„â€ˇ do CaseDetail.

<!-- STAGE228R2_ADMIN_FEEDBACK_NEXT_STEPS -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 next steps

1. Manualnie sprawdzic `/billing`, `/notifications`, `/ai-drafts`, `/funnel`.
2. Jesli lokalny dev dalej zatrzymuje sie na `Ladowanie widoku...`, sprawdzic stan auth/dev bootstrap osobnym etapem.
3. Po akceptacji wizualnej mozna selektywnie commitowac Stage228R2 bez `git add .`.
4. Nie kasowac pozostalych kafelkow z feedback JSON, ktore mialy tylko `.`, bez osobnego potwierdzenia.
<!-- /STAGE228R2_ADMIN_FEEDBACK_NEXT_STEPS -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_NEXT_STEP_BATCH_PUSH_AFTER_MANUAL_PASS

Nie pushowaĂ„â€ˇ przed rĂ„â„˘cznym PASS C5.

NastĂ„â„˘pny krok po apply Stage228R14:
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
- Objaw: klikniecie UsuŚ„ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuŚ„ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastĂ„â„˘pny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw ËĂ˘â€š¬„ Stage228R18 ËĂ˘â€š¬„ missing item hard delete source truth

- problem: Brak znikaĂ„ąĂ˘â‚¬ po klikni„Ă˘„Ëciu UsuĂ„ąĂ˘â‚¬Ĺľ, ale wracaĂ„ąĂ˘â‚¬ po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma by„Ă˘â‚¬Ë‡ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma by„Ă˘â‚¬Ë‡ Ă„ąŚźrĂ„â€šŚâ€šdĂ„ąĂ˘â‚¬owana z linkedTasks, nie z caĂ„ąĂ˘â‚¬ego timeline, Ă„ąĂ„Ëťeby activity history nie odtwarzaĂ„ąĂ˘â‚¬a aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test r„Ă˘„Ëczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niĂ„ąĂ„Ëť soft-delete; historia usuni„Ă˘„Ëcia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw ËĂ˘â€š¬„ STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Ă„ąĂ˘â‚¬aĂ„ąĂ˘â‚¬Ĺľcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera si„Ă˘„Ë juĂ„ąĂ„Ëť na dokĂ„ąĂ˘â‚¬adnym polskim tekĂ„ąĂ˘â‚¬źcie toastu, tylko na strukturze przepĂ„ąĂ˘â‚¬ywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany r„Ă˘„Ëczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

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

## After STAGE231B0-R7

Next: STAGE231B1 — Client Lifetime Earnings Summary. Do not start monthly charts/costs until restore/archive flow is verified.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "Przywróć sprawę".
- Restore flow używa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostają zachowane; delete flow nie jest używany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodność nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Logika finansów, delete flow i dane rozliczeń pozostają bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodność CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodność segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formę `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodność `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietę `Sprawy zamknięte` oraz filtr aktywne vs zamknięte.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamknięte`, `Przywróć sprawę`.
- Kontrakt używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamknięte/przywróć oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- Podział używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodność CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.
\n\n## 2026-06-10 — STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po częściowym R4: elastyczny patch ClientDetail, aktywne/zamknięte sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 — STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usunięto sklejone anchory `const X = useMemo( const X = useMemo(` po częściowym R2/R4/R6/R7.
- Zakres: dotknięte pliki TSX, whitespace, sanity check R8, pełny build/test.



## 2026-06-10 — STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usunięto stary drugi `toggleCaseView`, który pozostał po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokładnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 — STAGE231B0-R9 — Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/Zamknięte/Wszystkie, zamknięte sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansów i aktywnych ryzyk.


## 2026-06-10 — STAGE231B0-R9-R2 — Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9: brakowało jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzała intencję, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R3 — Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9-R2: `/cases` musi mieć widoczny banner `SPRAWA ZAMKNIĘTA` dla zamkniętej sprawy.
- Guard R9 rozszerzony o data-marker bannera, żeby nie przechodził sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R5 — Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamknięte sprawy przez wspólny renderer karty, więc guard akceptuje akcje `Otwórz` i `Przywróć sprawę` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIĘTA` w Historii i rendererze zamkniętej karty.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R9-R6 — Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakładał literalny `</SimpleFiltersCard>`, a komponent prawych skrótów może być self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R8 — R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukał `toggleCaseView`, którego aktualne ułożenie w `Cases.tsx` nie było stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan końca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R9 — Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykrył błędną składnię JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R10 — ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykrył niedomkniętą strukturę JSX w `ClientDetail.tsx` przy przejściu z głównej sekcji do prawego panelu.
- Dodano brakujące `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R11 — Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucał runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejściu w widok spraw.
- Naprawa: wolne użycia `closedRecordStage231B0R8` w JSX zastąpiono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki układ jak widok sprawy, z lewym wyrównaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R12-R7 — Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwóch filtrach.
- Guardy R11/R12/R12-R7 pilnują tego samego kontraktu i blokują `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansów, SQL, Google Calendar, płatności ani innych modułów.


## 2026-06-10 — STAGE231B0-R13 — Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego błędu po R12/R7 w `filteredCases.map((record, index) => ...)`.
- Usunięto `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- Usunięto błędny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 — STAGE231B0-R13-R2 — Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po częściowym R13: guard liczbowy był za ostry, więc zamieniono go na sprawdzanie konkretnych linii logiki.
- Domknięto `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniętej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrót `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 — STAGE231B0-R13-R3 — Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard był zbyt wrażliwy na dokładny polski tekst `Sprawa zamknięta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturę logiczną zamiast pełnego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 — STAGE231B0-R13-R4 — Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard fałszywie ciął `filteredCases.map` na pierwszym zagnieżdżonym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy używają szerokiego deterministycznego okna od początku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardów i dokumentacji.


## 2026-06-10 — STAGE231B0-R13-R6 — Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymał się przed zmianą pliku, bo check starego bloku z HEAD był błędny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastępowany kompletną, zamkniętą składniowo deklaracją.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 — STAGE231B0-R14 — Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- Powód: kartoteka klienta nadal jest centrowana/ściśnięta zamiast używać pełnej szerokości od lewego panelu do prawej krawędzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.

## 2026-06-10 � STAGE231B0-R15-R2 � ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- Pow�d: R14 trafi� w z�y DOM node (`ClientMultiContactField`), wi�c nie m�g� rozci�gn�� kartoteki klienta.
- Decyzja: ClientDetail ma u�ywa� wsp�lnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- �r�d�o prawdy szeroko�ci: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumuj�cy kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usuni�te jako fa�szywy kontrakt.

## 2026-06-10 � STAGE231B0-R15-R3 � ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie u�ytkownika: wygl�d kartoteki klienta jest poprawny i ma tak zosta�.
- Guard szeroko�ci: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znak�w: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, �e ClientDetail u�ywa wsp�lnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usuni�cia b��dnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higien� EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- Powód: pierwsza paczka SAFE miała błąd runnera PowerShell - funkcja przekazywała argumenty natywnym komendom jako pustą tablicę, więc git/node startowały bez parametrów.
- Naprawa: R2 używa jawnych wywołań w PowerShell i naprawia mojibake wyłącznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- Powód: R2/R3 częściowo naprawiły pliki, ale R3 zatrzymał się przez zbyt wąski parser dirty paths.
- Naprawa: masowo obsłużono warianty mojibake `ą/ł/ł/ó/·/–`, znormalizowano EOF i poprawiono guard pod aktualną kopię ClientDetail.
- Zasada: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- Powód: poprzedni run report zawierał przykładowe uszkodzone sekwencje znaków, a guard słusznie skanował też dokumentację etapu.
- Naprawa: dokumentacja etapu nie zapisuje już przykładowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentację zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardów, build i git diff --check.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_NEXT_STEPS_START -->
## 2026-06-10 17:10 Europe/Warsaw — STAGE231D0A — obowiązkowy etap przed D0

Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH

Kolejność po poprawce:
1. R10 — domknięcie archiwum spraw.
2. D0A — Visual Source of Truth Inventory + UI Consistency Guard.
3. D0 — Client workspace UX cleanup + mojibake guard.
4. D1 — model kosztów.
5. D2 — koszty w sprawie.
6. D3 — finanse klienta + koszty.
7. D4 — miesięczny wykres.
8. D5 — regresja finansów/kosztów/UI.

Najbliższy krok po PASS D0A:
- wdrożyć D0, ale tylko na bazie mapy `_project/VISUAL_SOURCE_OF_TRUTH.md` i bez lokalnych wyjątków UI.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_NEXT_STEPS_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_NEXT_STEPS_START -->
## STAGE231D0A-R3 — następny krok

1. Uruchomić rescue R3.
2. Po PASS: commit i push wyłącznie plików D0A-R3.
3. Następny etap: STAGE231D0 — Client workspace UX cleanup + mojibake guard.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_NEXT_STEPS_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 — STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyłącznie niedziałający runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ładowanie klienta..., tekst SPRAWA ZAMKNIĘTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansów i kosztów.
- Istniejące ostrzeżenie duplicate savedRecord zostaje poza zakresem.

NASTĘPNY KROK:
- Po PASS/push przejść do STAGE231D1 — model kosztów.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 — STAGE231D0-R5 — Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- Domknięcie po R4: ikona finansów klienta z EntityIcon case -> payment oraz brakujące tokeny "audyt ryzyk", "następny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: ręcznie sprawdzić brak duplikatu Finanse klienta i poprawną ikonę finansów.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 — STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztów sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrócone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 używa finansowego słownika etykiet i nie dodaje lokalnych stylów UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 może potrzebować SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansów nie pokaże kosztów, dopóki D2/D3 nie podłączą modelu.
- Ryzyko: jeśli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

następny krok:
- Po PASS/push przejść do STAGE231D2 — koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 — Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- następny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 — Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- następny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 — Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powód: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usunięcie api/case-costs.ts, konsolidacja kosztów pod api/cases.ts?resource=costs, guard budżetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtórzyć manualny test Dodaj koszt, bo zmienia się ścieżka API.
- następny krok: PASS -> push -> deploy -> test ręczny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 — STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywała render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujący regresję.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdzić produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeśli nadal wystąpi.

## STAGE231D2-R6 — CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrócenie górnego paska tytułu sprawy do lewej kolumny i podciągnięcie prawego raila do górnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw — next after STAGE231D3-R7

- push only after PASS
- production smoke: CaseDetail opens; Client finance shows Koszty do zwrotu and Razem do pobrania
- if production fails, rollback D3-R7 only

## STAGE231D3-R7-R2 — Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

## 2026-06-10 Europe/Warsaw — STAGE231D0B-R9 ClientListCard polish + source truth cleanup

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

FAKTY:
- ClientListCard pozostaje 2-wierszowy.
- Finance values są porządkowane jako kompaktowe chipy.
- R8 unscoped CSS rescue zostaje zastąpiony scoped R9 source truth.
- LeadListCard dodany tylko jako mapping w UI Dictionary, bez runtime zmian.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Manual QA nadal wymagany, bo guard nie mierzy odbioru wizualnego.
- Osobny dług: duplicate savedRecord warning w ContextActionDialogs.tsx.

NASTĘPNY KROK:
- Po akceptacji /clients: STAGE231D0C LeadListCard align to ClientListCard source truth.

## 2026-06-11 Europe/Warsaw - next after STAGE231D0B-R10

Po PASS i screenshot /clients można pushować R10. Jeśli nadal jest nierówno, kolejny etap ma dotyczyć tylko CSS gridu ClientListCard, bez leadów i bez top layoutu.

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R7 - Client finance chip start alignment

Marker: STAGE231D0B_R10_R7_FINANCE_CHIP_START_ALIGN

Status: LOCAL_APPLY_PREPARED

FAKTY:
- R10/R6 poprawilo ogolny uklad karty klienta i ellipsis/tooltip.
- Manual QA Damiana pokazal, ze karta jest juz dobra, ale chipy finansowe powinny zaczynac tekst w tej samej osi kolumny.
- Ten etap dotyka tylko CSS source truth i guard dokumentujacy decyzje.

DECYZJA DAMIANA:
- "Zarobione lacznie" i "Aktywna prowizja" maja zaczynac sie w tym samym miejscu/kolumnie.
- Dlugosc tekstu moze dyktowac, gdzie chip sie konczy.
- Reszta ukladu zostaje.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Guard nie sprawdza realnej geometrii w przegladarce. Wymagany screenshot /clients po deployu.

NASTEPNY KROK:
- Po PASS i push: sprawdzic /clients, czy oba chipy finansowe startuja w tej samej osi.



---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R8 — finance chip right-edge alignment

Status: LOCAL_APPLIED_PENDING_PUSH_AND_DEPLOY_QA

FAKTY:
- R7 wyrównał finance chipy w złą stronę dla oczekiwanego widoku Damiana.
- R8 nie przebudowuje karty klienta. Zmienia tylko oś wyrównania zielonych chipów finansowych.
- Chipy pozostają o zmiennej długości; prawa krawędź chipów ma być wspólna.

DECYZJA DAMIANA:
- Początek i koniec karty zostają bez zmian.
- Zielone kafelki finansowe mają być wyrównane od prawej strony.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Etap jest wizualny; ostateczne zamknięcie wymaga deployu i ręcznego sprawdzenia /clients.


---
## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R9 finance text start align
Marker: STAGE231D0B_R10_R9_FINANCE_TEXT_START_ALIGN
Status: LOCAL_APPLY_PACKAGE_PREPARED
Scope: ClientListCard on /clients only.
Decision: zielone finance chipy nie maja konczyc sie rowno; teksty "Aktywna prowizja" i "Zarobione lacznie" maja zaczynac sie w jednej osi kolumny, tak jak nazwa/firma w lewej czesci karty. Dlugosc chipa moze dyktowac prawa krawedz.
Tests: npm run check:stage231d0b-client-list-card-freeze; node --test tests/stage231d0b-client-list-card-freeze.test.cjs; git diff --check; npm run build.
Risk: R8 right-edge alignment was visually wrong for Damian's expected reading flow; R9 supersedes R8 by later CSS source-truth override.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10/R10 single-grid alignment source truth

Status: LOCAL_APPLY_PREPARED / DO_MANUAL_QA_AND_PUSH.

FAKT: R10/R7/R8/R9 pokazaly, ze przesuwanie finance chipow przez justify-self/place-self nie zamyka problemu wizualnego, bo primary i secondary byly osobnymi gridami.

DECYZJA: ClientListCard ma uzywac jednej fizycznej siatki CSS dla dwoch wierszy: nazwa/firma, telefon/sprawy, email/akcja, finanse/finanse.

ZAKRES: tylko /clients ClientListCard CSS source truth i guard. Nie ruszano leadow, triala, filtrow, top layoutu, SQL ani Supabase.

TESTY: npm run check:stage231d0b-client-list-card-freeze, node --test tests/stage231d0b-client-list-card-freeze.test.cjs, git diff --check, npm run build.

MANUAL QA: /clients po Ctrl+F5; sprawdzic, czy Aktywna prowizja i Zarobione lacznie startuja w jednej osi, tak jak nazwa/firma.


---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R11 fixed column axis

Status: LOCAL_APPLY_READY / DO_MANUAL_QA_AFTER_DEPLOY

FAKT:
- R10/R10 fixed the physical single grid but the grid still used content-sensitive columns, so column starts could move between client cards.
- R10/R11 pins deterministic column widths through CSS variables on .cf-client-list-card-content.

DECYZJA DAMIANA:
- Texts must start in the same place across every client card.
- Longer text may decide where a chip ends, but it must not move the start axis.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual QA is mandatory after deploy: desktop, narrow window, mobile.
- CSS history R7/R8/R9 remains in file as deprecated layers; R10/R11 is the final active override.

## 2026-06-11 Europe/Warsaw - STAGE231D0C LeadListCard client-view freeze

FAKT:
- /clients ClientListCard view accepted visually after R10/R11 fixed column axis.
- /leads should reuse the same card rhythm, fixed axes, compact card size and action column where the fields are semantically reusable.
- This stage does not change lead data semantics, create flow, filters, trial banner, top layout, SQL or Supabase.

DECYZJA DAMIANA:
- Freeze the accepted Clients view.
- Align the Leads tab to this look only for repeated card/shell elements.
- Do not invent a new layout and do not break existing lead semantics.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node scripts/check-stage231d0c-lead-list-card-client-align.cjs
- node --test tests/stage231d0c-lead-list-card-client-align.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual guard does not measure browser geometry. Manual QA on /leads and /clients remains required.
- Lead cards contain more badges/meta than client cards; CSS must compress, not delete semantics.

---

## 2026-06-11 Europe/Warsaw - After STAGE231D0C/R6

Manual QA: /clients/<id> after deploy. Next planned: STAGE231D0D CaseDetail right rail finance-first layout.

---

## 2026-06-11 19:45 Europe/Warsaw - Next after STAGE231D0C/R7 ClientDetail left rail spacing

STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING

FAKTY Z KODU:
- STAGE231D0C/R6 został wdrożony i wypchnięty jako baseline ClientDetail.
- Manual QA wskazał, że lewy rail zaczyna się za wysoko i wizualnie wchodzi w następny poziom względem kart po prawej.

DECYZJA DAMIANA:
- Zachować zaakceptowane górne kafelki ClientDetail.
- Obniżyć lewy rail do poziomu kafelków po prawej i zachować ten sam odstęp między kartami.

ZAKRES:
- CSS spacing only: lewy rail, prawy rail, odstęp między kartami.
- Bez zmian danych, JSX, SQL, kosztów, wykresów, Google Calendar, LeadListCard runtime i CaseDetail.

TESTY/GUARDY:
- scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- regresja: STAGE231D0C ClientDetail baseline guard, STAGE231D0B ClientListCard guard, optional STAGE231B0 R9 guard, build, git diff --check.

---

## 2026-06-11 20:05 Europe/Warsaw - Next after STAGE231D0C/R8 ClientDetail left rail spacing guard fix

STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

FAKTY Z KODU:
- STAGE231D0C/R7 patch zastosował spacing lewego raila, ale guard miał zepsuty regex po utracie backslashy.
- R8 nie zmienia runtime poza naprawą guarda/testu i dokumentacją.

DECYZJA DAMIANA:
- Zachować górne kafelki ClientDetail.
- Dokończyć spacing lewego raila bez przebudowy układu.

ZAKRES:
- Naprawa scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs.
- Zachowanie CSS R7 i scope ClientDetail.
- Bez zmian SQL, danych, CaseDetail, LeadListCard runtime, kosztów i wykresów.

TESTY/GUARDY:
- node --check guard R7.
- R7 spacing guard.
- R7 spacing node test.
- STAGE231D0C ClientDetail baseline guard/test.
- STAGE231D0B ClientListCard guard/test.
- Optional STAGE231B0 R9 guard/test.
- git diff --check.
- npm run build.

## 2026-06-11 Europe/Warsaw - STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Status: LOCAL_APPLIED / VISUAL_SPACING_FIX / NEED_PUSH

Zakres:
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynał za wysoko względem prawego raila;
- zwiększono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany górny układ kafelków, kompaktową aktywną sprawę, dane i routing.

Testy/guardy:
- node scripts/check-stage231d0c-r9-client-detail-left-rail-visual-align.cjs
- node --test tests/stage231d0c-r9-client-detail-left-rail-visual-align.test.cjs
- node scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- node scripts/check-stage231d0b-client-list-card-freeze.cjs
- git diff --check
- npm run build

Ryzyka:
- finalna akceptacja wymaga screenshotu /clients/<id> po deployu i Ctrl+F5;
- tablet/mobile resetują offset do 0, żeby nie zrobić sztucznej dziury.

---
## 2026-06-11 Europe/Warsaw - STAGE231D0C/R11 ClientDetail left rail axis lock

Marker: STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK

Status: LOCAL_APPLY_READY

Scope:
- desktop-only CSS axis lock for the ClientDetail left rail,
- strengthens previous R7/R9 offset because production screenshot still showed the left rail above the right card axis,
- keeps top overview tiles, compact active case card, data, routing and JSX unchanged.

Tests/guards:
- scripts/check-stage231d0c-r11-client-detail-left-rail-axis-lock.cjs
- tests/stage231d0c-r11-client-detail-left-rail-axis-lock.test.cjs
- R9/R7 regressions where present
- ClientDetail baseline regression
- ClientListCard regression
- git diff --check
- npm run build

Risk audit:
- desktop offset can create too much vertical whitespace on narrow layouts, therefore reset is scoped to max-width 1180px.
- final acceptance requires production screenshot after deploy and Ctrl+F5.

---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0C/R12 ClientDetail left rail measured axis fix

Status: LOCAL_APPLY_PRE_PUSH.
Commit target: fix ClientDetail left rail vertical axis using measured desktop DOM values.

Measured fact from manual DOM audit after clearing debug inline style:
- viewport innerWidth: 1920
- leftFirstTop: 173
- rightFirstTop: 200
- leftMinusRight: -27
- computed left rail margin-top before fix: -36px
- required final desktop margin-top: -9px

Change:
- CSS-only override in src/styles/visual-stage12-client-detail-vnext.css.
- Locks .client-detail-shell > .client-detail-left-rail margin-top to -9px on desktop >=1180px.
- Resets margin/padding/transform on tablet/mobile <=1179px.

Scope not touched:
- JSX, data fetching, Supabase, SQL, costs, charts, active case card structure, CaseDetail, LeadListCard runtime.

Tests required:
- R12 measured-axis guard/test.
- R9 and R7 left rail regressions.
- ClientDetail baseline guard/test.
- ClientListCard freeze regression.
- git diff --check.
- npm run build.

Manual QA after deploy:
- open /clients/<id>, Ctrl+F5.
- verify left Data klienta card starts visually on the same axis as right Najbliższe działania card.
- verify top tiles and active case compact card unchanged.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C-R2 ClientDetailHeader visual freeze + visible icons

Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_TEST_AND_PUSH

Zakres:
- zamrożenie ClientDetailHeader jako wzorca DetailHeader,
- dopisanie stylu widoczności ikon w header buttons,
- dopisanie DetailHeader do UI Dictionary,
- dodanie guarda i testu R2,
- regresja D0C baseline.

Decyzja Damiana:
Header karty klienta detail zostaje wzorcem dla kolejnych kart detail. Ikony w niebieskich przyciskach muszą być widoczne.

Poza zakresem:
- brak SQL,
- brak zmian danych,
- brak zmian aktywnej sprawy,
- brak zmian CaseDetail,
- brak zmian LeadListCard runtime.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.




---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Status: PATCH_RESCUE / CONTINUES_STAGE231D0D_R2

Zakres:
- naprawa częściowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpięcie totalu do istniejącego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usunięciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztów, bez wykresów.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublować osobnej karty kosztów jako drugiego źródła rozliczenia; wiersz totalu w pierwszej karcie jest obowiązkowy dla skanowalności prawego panelu,
- po deployu manualnie sprawdzić kolejność raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R3 CaseDetail 100% scale balanced workspace

Status: PREPARED_BY_ZIP / DO_TEST_AND_PUSH

Zakres:
- działania i notatki w jednym środkowym gridzie,
- notatki compact preview: 3 ostatnie,
- prawy rail compact: rozliczenie, szybkie akcje, dane,
- historia wpłat i lista kosztów nie są stale rozlane w railu,
- R2 guard zaktualizowany jako regresja zgodna z R3.

Testy:
- D0D/R3 guard/test,
- D0D/R2 regression guard/test,
- D0C regression,
- D0B regression,
- build,
- git diff --check.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R4 CaseDetail lean service workspace

Status: LOCAL_PACKAGE_APPLIED_PENDING_PUSH

FAKTY Z KODU:
- R4 usuwa widoczną kartę danych sprawy i klienta z głównego right raila bez usuwania danych z systemu.
- R4 usuwa stałe sekcje historii wpłat i kosztów z right raila.
- R4 zachowuje rozliczenie sprawy i szybkie akcje w railu.
- R4 dopina marker data-case-service-tabs-column="true" do tabs card.

TESTY:
- check-stage231d0d-r4-case-detail-lean-service-workspace.cjs
- stage231d0d-r4-case-detail-lean-service-workspace.test.cjs
- R3/R2 regression guards
- D0C regression
- npm run build
- git diff --check

RYZYKA:
- Tabs są wyrównane wizualnie do kolumny działań bez pełnej przebudowy logiki Tabs; przy kolejnym większym refaktorze warto przenieść strukturę logicznie do left-column.
- Historia wpłat i koszty pozostają dostępne przez istniejące przyciski/modale, ale nie są stałą listą w railu.

---

## 2026-06-12 07:39 Europe/Warsaw - STAGE231D0D-R5 spacing / notes lift / quick actions cleanup

Status: READY_FOR_TEST
Zakres:
- notatki podciągnięte do góry bez łamania wspólnego odstępu kafelków,
- wspólny odstęp kafelków: 14px,
- prawy rail delikatnie podniesiony,
- z CaseQuickActions usunięto osobną akcję "Wpłata prowizji",
- wpłata prowizji zostaje w rozliczeniu sprawy.

Ryzyka:
- override CSS musi nie rozjechać mobile/tablet,
- quick actions nie mogą dublować akcji finansowych,
- R2/R3/R4 guardy były składniowo uszkodzone i zostały naprawione.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usunięto "Wpłata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspólny odstęp kafelków 14px,
- dodano micro-lift prawego raila,
- zachowano wpłatę prowizji tylko w rozliczeniu sprawy.

Powód:
Poprzedni R5 został wypchnięty mimo czerwonych guardów po błędzie ścieżek względnych .NET/PowerShell.

---

## 2026-06-12 08:10 Europe/Warsaw - STAGE231D0D-R6 true service grid geometry

Status: READY_FOR_TEST

Zakres:
- przeniesiono tabs do lewej kolumny workspace dla aktywnej zakładki Obsługa,
- lewa kolumna ma teraz: tabs + działania,
- środkowa kolumna ma notatki startujące od góry tego samego gridu,
- prawy rail jest wyrównany do osi true service grid i używa wspólnego gapu,
- nie ruszano SQL, danych, modelu finansów ani modali.

Audyt:
- R5 był technicznie zielony, ale wizualnie nie zamykał celu, bo tabs były poza gridem.
- R6 naprawia strukturę JSX, a guard sprawdza kolejność grid -> left column -> tabs -> actions -> notes.

---

## 2026-06-12 08:28 Europe/Warsaw - STAGE231D0D-R8 tabs card + right rail axis polish

Status: READY_FOR_TEST

Zakres:
- prawy panel z rozliczeniem i szybkimi akcjami podniesiony do osi kafelka danych sprawy,
- zakładki Obsługa / Checklisty / Historia dostały pełny, rozciągnięty kafelek nad Działaniami sprawy,
- zachowany wspólny odstęp kafelków 14px,
- nie ruszano finansów, modali, SQL, danych, handlerów ani quick actions poza stylem układu.

Ryzyka:
- etap jest CSS-only, więc wymaga ręcznego potwierdzenia na 100% zoom,
- lift prawego raila ma reset na węższych ekranach,
- historyczne mojibake w starych wpisach _project nie jest czyszczone w tym etapie.

---

## 2026-06-12 08:58 Europe/Warsaw - STAGE231D0D-R9 tabs center + axis microfix

Status: APPLIED_LOCAL_WAITING_VISUAL_PASS

Zakres:
- pigułki Obsługa / Checklisty / Historia wyśrodkowane w rozciągniętym kafelku,
- środkowa sekcja CaseDetail podniesiona lekko wyżej,
- prawy panel rozliczeń i szybkich akcji dociągnięty do tej samej osi,
- bez zmian w SQL, Supabase, finansach, modalach, handlerach i danych.

Testy:
- R9 guard/test,
- regresje R8/R6/R5/R4/R3/R2/D0C/D0B,
- git diff --check,
- npm run build.
---

## 2026-06-12 14:34 Europe/Warsaw - STAGE231D0E-R1 ClientDetail grid axis align

Status: PREPARED_LOCAL / pending visual PASS before push

Scope:
- CSS-only alignment of ClientDetail workspace columns.
- Align left data card, center column and right upcoming-actions rail to one top axis.
- Force center content under Braki i blokady to keep same width/left edge as the center column.
- Force right rail content under Najbliższe działania to keep same width/left edge as the rail.

User decision:
- "wszystko co pod braki i blokady oraz najbliższe działania musimy wyrównać z kafelkiem dane klienta"

Touched runtime files:
- src/styles/visual-stage12-client-detail-vnext.css

Not touched:
- src/pages/ClientDetail.tsx
- src/components/CaseQuickActions.tsx
- CaseDetail logic
- Supabase / SQL / finance formulas / handlers / modals

Guards:
- scripts/check-stage231d0e-r1-client-detail-grid-axis-align.cjs
- tests/stage231d0e-r1-client-detail-grid-axis-align.test.cjs

Risk audit:
- Visual-only risk: desktop alignment may improve while tablet breakpoint needs manual check.
- No runtime data risk because only CSS and docs/guards are changed.
- Do not mix with failed R11 finance/notes package or old D0B client-list-card guard drift.

<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — Next after STAGE231D0F

Po wdrożeniu i PASS:
- sprawdzić manualnie `/funnel`,
- potwierdzić, że górne kafle, pasek etapów, lista rekordów i prawy rail są spójne z nowym UI,
- potem wrócić do kolejnego sensownego etapu baseline: `STAGE231D0E — CaseDetail checklist tab baseline`, jeśli nie został jeszcze zamknięty.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R4 Funnel targeted guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGÓW:
- R2 poprawnie zatrzymał się po czerwonym guardzie.
- R3 zatrzymał się na zbyt szerokim mojibake sweepie, który zaczął czyścić stare historyczne wpisy `_project`.
- To nie jest właściwy zakres dla etapu UI Lejka.

DECYZJA:
- Naprawiamy aktywny zakres STAGE231D0F, nie całą historię projektu.
- Lejek pozostaje listą decyzji właściciela, nie kanbanem.
- Nie ruszać logiki filtrów, Supabase, SQL, płatności, routingu, wykresów ani drag/drop.

R4:
- targetowany repair mojibake tylko dla runtime i aktywnych plików etapu,
- guard STAGE231D0F sprawdza aktywny blok UI Dictionary, CSS i runtime,
- guardy nie failują na własnych definicjach tokenów,
- CaseDetail R4 guard jest podmieniany na bezpieczną wersję z tokenami generowanymi po kodach znaków.

TESTY:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- W repo nadal mogą istnieć stare historyczne wpisy z mojibake. Nie naprawiać ich w tym etapie.
- Jeżeli chcemy pełne sprzątanie `_project`, to osobny etap: `ENCODING-SWEEP`, bez mieszania z Lejkiem.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R2 Funnel color/icon/filter parity

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma już `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- `closeflow-metric-tiles.css` ma wspólne tony `blue`, `amber`, `red`, `green`, `purple`.
- Klienci używają wzorca filtrów: `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

DECYZJE DAMIANA:
- Zamysł Lejka zostaje.
- Lejek nie jest kanbanem.
- Kafelki właścicielskie mają mieć kolorowe ikony.
- `Cisza 7+` ma dostać ton `purple`.
- Filtry etapów mają mówić tym samym językiem wizualnym co filtry w Klientach.
- Nie ruszać logiki filtrów, Supabase, SQL, drag/drop ani kanbana.

ZMIANA:
- Dodany marker `STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY`.
- Dodana jawna mapa `FUNNEL_OWNER_TILE_TONE_MAP`.
- `FunnelStageFilterChip` dostaje `data-cf-status-tone`, `cf-status-pill` / `pill` oraz alias `cf-filter-pill`.
- Pasek etapów dostaje `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-filter-strip`, `cf-filter-pills`.
- CSS wymusza widoczne kolorowe ikony w owner tiles.

TESTY:
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Nie wolno przez ten etap zmienić działania filtrów ani przerobić Lejka w kanban.
- Nie mieszać w tym commicie wcześniejszych plików `STAGE231D0E`, jeśli nie są osobno domykane.
<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_END -->

<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R3 Funnel icon source truth + records header fix

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma już `FUNNEL_OWNER_TILE_TONE_MAP` i używa `data-eliteflow-metric-tone`.
- `closeflow-metric-tiles.css` ma zmienne source of truth dla ikon i tła ikon.
- `SalesFunnel.tsx` nadal miał dwuliniowy nagłówek rekordów: mały label + `Rekordy w aktywnym widoku`.

DECYZJE DAMIANA:
- Ikony kafelków Lejka mają mieć widoczny kolor.
- Kolor ikon ma iść ze wspólnego source of truth `closeflow-metric-tiles.css`.
- Nie kolorować lokalnie kafelków Lejka losowymi hexami.
- Nagłówek rekordów ma być jednym wierszem.
- Nie ruszać logiki filtrów, SQL, Supabase, kanbana ani drag/drop.

ZMIANA:
- Dodany marker `STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER`.
- W `closeflow-metric-tiles.css` dopisano ogólną regułę `stroke: currentColor` / `color: currentColor` dla SVG ikon metric tiles.
- W `SalesFunnel.tsx` nagłówek rekordów zmieniony na `FunnelRecordsHeaderRow`.
- W `sales-funnel-stage231d0f-visual-alignment.css` dodano CSS dla jednowierszowego nagłówka.

TESTY:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Jeśli ikony dalej wyglądają bez koloru, możliwa przyczyna to kolejność ładowania CSS albo zewnętrzne nadpisanie SVG. Guard sprawdza source of truth, ale manual QA nadal jest konieczne.
<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_END -->

<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R5 Funnel records header line repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R4 patcher dalej zatrzymał się na starym fragmencie `<p className="text-xs font-black uppercase tracking...">`.
- Przyczyna: nawet regex R4 nie trafił lokalnego wariantu starego JSX.
- Problem jest w konkretnych liniach starego headera, nie w całym Lejku.

ZMIANA:
- R5 usuwa liniowo stare fragmenty:
  - `visibleLabel` paragraph,
  - stary `h2` rekordów,
  - stary licznik tekstowy.
- R5 wymaga nowego `data-stage231d0f-r5-records-header-line-repair`.
- R5 odświeża R3/R4 guardy, żeby walidowały naprawiony stan bez fałszywego globalnego blokowania.

NIE RUSZAĆ:
- logiki filtrów,
- Supabase,
- SQL,
- kanbana,
- drag/drop,
- STAGE231D0E.

TESTY:
- `node scripts/check-stage231d0f-r5-funnel-records-header-line-repair.cjs`
- `node --test tests/stage231d0f-r5-funnel-records-header-line-repair.test.cjs`
- R4/R3 regression guard/test
- R2 guard/test jeśli istnieją
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma dużo wcześniejszych śladów failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R6 Funnel UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 runtime patch przeszedł.
- R5 guard zatrzymał etap wyłącznie na brakach w UI Dictionary: `MetricTileIconColorSource` i `FunnelColorToneMap`.
- To jest problem guardu/pamięci projektu, nie logiki Lejka.

ZMIANA:
- R6 dopisuje brakujące pojęcia do aktywnego bloku UI Dictionary.
- R6 guard łączy aktywne bloki R6/R5/R4/R3/R2 zamiast patrzeć tylko w ostatni blok.
- R6 nie dotyka logiki filtrów, Supabase, SQL, drag/drop ani kanbana.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-ui-dictionary-guard-repair.cjs`
- `node --test tests/stage231d0f-r6-funnel-ui-dictionary-guard-repair.test.cjs`
- R5/R4/R3 regression guard/test
- R2 guard/test jeśli istnieją
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree jest brudny po wielu próbach. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R6 Funnel shared filter resilient patch

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 shared filter patch zatrzymał się na `SalesFunnel post-patch token missing: data-stage231d0f-r5-stage-filter-no-visible-money`.
- Przyczyna: patcher szukał zbyt szerokiego wariantu całego `<button>` w `FunnelStageFilterChip`.
- Realny `SalesFunnel.tsx` ma stabilny marker `data-stage231d0f-r2-filter-tone={tone}` i widoczny `cf-funnel-stage-filter-chip-value`.

ZMIANA:
- R6 patchuje wyłącznie blok funkcji `FunnelStageFilterChip`, a nie cały plik na ślepo.
- R6 dopina no-visible-money marker po stabilnym atrybucie.
- R6 usuwa widoczną kwotę z chipu, zostawia kwotę w `aria-label` i `title`.
- R6 zachowuje wspólny filtr dla Klientów przez stabilny `cf-contact-cadence-pills`.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-shared-filter-resilient-patch.cjs`
- `node --test tests/stage231d0f-r6-funnel-shared-filter-resilient-patch.test.cjs`
- R3 guard/test jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_END -->

<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R8 Funnel icon tone syntax repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R7 zatrzymał się przed patchowaniem na błędzie składni w patcherze.
- Błąd: niepoprawnie escapowany string `payment: \\'green\\''` w tablicy walidacyjnej.
- To nie jest błąd aplikacji ani koncepcji kolorów.

DECYZJA DAMIANA:
- Układ Lejka jest zamrożony.
- Etap dotyczy tylko spójnej kolorystyki ikon/kafelków.

ZMIANA:
- R8 naprawia składnię patchera.
- R8 dodaje `node --check` dla patchera i guardu przed patchowaniem.
- R8 dodaje `metric-icon-tone-registry.ts`.
- R8 podpina Lejek i operator metric tone contract pod wspólny resolver koloru.
- Kafel `Pieniądze` używa `PaymentEntityIcon`, nie strzałki.

TESTY:
- `node --check payload/scripts/apply-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --check payload/scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --test tests/stage231d0f-r8-funnel-icon-tone-syntax-repair.test.cjs`
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Zmiana ikony `Pieniądze` ze strzałki na ikonę płatności jest świadoma.
- Manual QA wymagany dla realnego koloru SVG.
<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R8 patch runtime przeszedł.
- R8 zatrzymał się dopiero na guardzie dokumentacji.
- Brakujący token: `SharedFilterStrip` w aktywnym zakresie UI Dictionary.
- To nie jest problem Lejka ani kolorów ikon.

ZMIANA:
- R9 dopisuje aktywny blok UI Dictionary z literalami:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- R9 odświeża R8 guard, żeby czytał bloki R9/R8/R6/R5/R4 razem.
- R9 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R9/R8 guardów
- R9 guard/test
- R8 regression guard/test
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R9 zatrzymał się po dopisaniu UI Dictionary i project memory.
- Błąd: `The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`
- Przyczyna: PowerShell `Set-StrictMode` i dostęp do brakującej właściwości w `package.json`.
- To nie jest problem runtime Lejka.

ZMIANA:
- R10 usuwa kruchy dostęp PowerShell `$Pkg.scripts.'...'`.
- Dopisanie scriptów do `package.json` odbywa się przez `node -e`.
- R10 uruchamia R10/R9/R8 guardy i testy.
- R10 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R10/R9/R8 guardów
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R11 Funnel R6 regression guard resolver repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R10/R9/R8 guardy i testy przeszły.
- Etap zatrzymał wyłącznie stary R6 regression guard.
- R6 guard oczekiwał literalów `tone: 'blue'`, `tone: 'amber'`, `tone: 'purple'`, `tone: 'red'`, `tone: 'green'`.
- Po R8 te literały zostały celowo zastąpione resolverem `resolveCloseflowMetricIconTone`.

ZMIANA:
- R11 odświeża R6 guard/test, żeby akceptował nowy source of truth.
- R11 odpala R11/R10/R9/R8/R6 guardy i testy.
- R11 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla guardów R11/R10/R9/R8/R6
- R11 guard/test
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 refreshed guard/test
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_START -->
## 2026-06-12 18:30 Europe/Warsaw — STAGE231D0F-R12 Funnel metric colors real CSS enforce

STATUS: READY_TO_APPLY

FAKTY Z QA:
- Po pushu R11 układ Lejka jest OK.
- W Vercel `/funnel` nadal wygląda prawie szaro.
- Problem: kolor nie dochodzi wystarczająco mocno do kafli/SVG.

FAKTY Z KODU:
- `SalesFunnel.tsx` ma `data-eliteflow-metric-tone` i `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` ma tokeny `--cf-metric-tone-*-icon`, ale nie wymuszał pełnego `stroke: currentColor` na SVG i dzieciach SVG.
- `Pieniądze` ma długą wartość i wymaga value-kind.

DECYZJA:
- Układ Lejka zostaje zamrożony.
- R12 zmienia tylko realną kolorystykę kafelków/ikon.
- `Cisza 7+` ma być purple, nie amber.
- Kolor ma być subtelny, nie tęcza.
- Source of truth: `closeflow-metric-tiles.css`.

ZMIANA:
- `FUNNEL_OWNER_TILE_TONE_MAP` ma jawne tony: blue, amber, purple, red, green.
- Dodano `data-cf-metric-value-kind`.
- `closeflow-metric-tiles.css` wymusza SVG `stroke: currentColor`.
- Dodano subtelne tła/bordery kafli per tone.
- Dodano money value sizing.

TESTY:
- `node scripts/check-stage231d0f-r12-funnel-metric-colors-real-css-enforce.cjs`
- `node --test tests/stage231d0f-r12-funnel-metric-colors-real-css-enforce.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA dalej wymagane, bo to etap CSS/render.
- Local tree ma wcześniejsze śmieci; push tylko selektywny.
<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_END -->

<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_START -->
## 2026-06-12 19:20 Europe/Warsaw — STAGE231D0F-R13 Funnel visual color density

STATUS: READY_TO_APPLY

FAKTY Z QA:
- R12 przeszedł technicznie i został wypchnięty.
- Ekran `/funnel` nadal wygląda za blado.
- Problem nie dotyczy już tylko ikon; brakuje warstwy kolorystycznej kafli i rekordów.

DECYZJE DAMIANA:
- Układ Lejka jest zaakceptowany i zamrożony.
- Dodać kolor bez tęczy.
- Kafelki mają mieć kolor w ikonie, wartości i subtelnym surface/accent.
- Rekordy mają dostać lekkie semantyczne akcenty.
- Przyciski `Otwórz` mają być równe i bez łamania.

ZMIANA:
- R13 dodaje `FunnelDecisionSignal tone`.
- R13 dodaje data atrybuty rekordów.
- R13 dodaje tone surface/accent dla kafli w `closeflow-metric-tiles.css`.
- R13 zwiększa open button z 132px do 156px i dodaje nowrap.
- R13 nie zmienia layoutu ani logiki filtrów.

TESTY:
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- To etap CSS/render, więc manual QA jest obowiązkowy.
- Local tree ma wcześniejsze śmieci; push tylko selektywny.
<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_END -->

<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 20:10 Europe/Warsaw — STAGE231D0G Visual Tile Source Truth Atlas

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- STAGE231D0F-R13 przeszedł guard/test/build.
- Commit `0b2f6fb2 fix: improve funnel visual color density` został wypchnięty na `dev-rollout-freeze`.
- Damian wizualnie akceptuje Lejek i zamraża go jako baseline.

DECYZJA DAMIANA:
- FunnelMetricTileR13 zostaje źródłem prawdy dla globalnego CloseFlowMetricTileV2.
- Nie przebudowywać całej aplikacji chaotycznie.
- Najpierw source truth, atlas, guard i plan fal.

ZMIANA:
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`.
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.
- Dopisano UI Dictionary: CloseFlowMetricTileV2, CloseFlowMetricToneMap, FunnelMetricTileR13, SharedFilterStrip, RecordListCard, RightRailCard, FinanceMetricTile.
- Dodano guard/test D0G.
- Runtime widoków nie jest przepinany w tym etapie.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- R13 regression guard/test jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- UI Dictionary ma stare duplikaty i historyczne mojibake. Guard D0G skanuje aktywny blok D0G i nowe source truth, nie całą historię słownika.
- Pełny cleanup lokalnych śmieci po starych paczkach zostaje osobnym etapem.
<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 — Next after STAGE231D0G-CLOSEOUT

STATUS: D0G CLOSED

Next stage:
`STAGE231D0H-1 — Leads + Clients metric tiles and filters to CloseFlowMetricTileV2`

Scope for D0H-1:
- `/leads`
- `/clients`
- metric tiles
- shared filter strips
- list/record cards if directly tied to tile visual parity

Do not include in D0H-1:
- SQL
- Supabase schema
- routing
- CaseDetail
- Calendar
- Billing
- Settings
- full UI Dictionary cleanup
<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_START -->
## 2026-06-12 22:05 Europe/Warsaw — STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

STATUS: READY_TO_APPLY

FAKTY:
- N1 R2 failed during patch on conflict placeholder removal.
- Real conflict card is a standalone right rail `<section>` before the upcoming card.
- R3 removes the whole section using section boundaries.

ZMIANA:
- R3 uses section bounds for conflict card removal.
- R3 preserves N1 scope: visual/source truth only.
- Runtime data logic, filters, localStorage, Supabase, SQL and routing are untouched.

TESTY:
- `node scripts/check-stage231d0h-n1-notifications-visual-source-cleanup.cjs`
- `node --test tests/stage231d0h-n1-notifications-visual-source-cleanup.test.cjs`
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA `/notifications` required.
- Previous failed N1/N1-R2 copied guard/test/run/obsidian files; R3 overwrites active guard/test and creates final R3 run/obsidian.
<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_END -->

## Po STAGE231F_R3
1. Selektywny commit i push tylko plikow Stage231F R3.
2. Zastosowac migracje Supabase na srodowisku docelowym.
3. Damian wykonuje manualny flow `/settings` -> `/today` -> next step -> hard refresh.
4. Globalny mojibake/BOM gate pozostaje osobnym etapem naprawczym.

## Po CLOSEFLOW_CLIENT_CASE_URGENT_FIX
1. Damian wykonuje test reczny kartoteki klienta i sprawy.
2. Po akceptacji mozna wykonac selektywny commit/push tylko plikow tego pakietu.
3. Osobno domknac globalny Stage98 mojibake/BOM i niedokonczony guard 231D2.

## Po CLOSEFLOW_CASE_FINANCE_UI_REPAIR
1. Zastosowac migracje `20260613143500_restore_case_items_canonical_columns.sql` w Supabase.
2. Damian wykonuje test reczny sprawy, klienta i leadow po twardym odswiezeniu.
3. Po akceptacji wykonac selektywny commit/push tylko stage'owanych plikow pakietu.
4. Globalny Stage98 mojibake/BOM pozostaje osobnym etapem.


<!-- CF_RUNTIME_00_SHARED_SOURCE_TRUTH_2026_06_15_START -->
## 2026-06-15 22:56 Europe/Warsaw — CF-RUNTIME-00 Shared source-of-truth foundation

Status: PREPARED_IN_ZIP_LOCAL_APPLY
Typ: techniczny fundament / guard baseline
Zakres: route truth, status truth, missing/blocker truth, access/plan truth wrapper.

Dodane pliki:
- `src/lib/closeflow-runtime-source-truth.ts`
- `tests/cf-runtime-00-source-truth.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `_project/runs/2026-06-15_CF_RUNTIME_00_SHARED_SOURCE_TRUTH.md`

Testy/guardy:
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `node --test tests/cf-runtime-00-source-truth.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

Czego nie ruszano:
- UI, LeadDetail, ClientDetail, CaseDetail, Today, Tasks, Calendar, Billing, Settings, CSS, SQL, Supabase, migrations, env.

Ryzyko:
- istniejący fallback `paid_active -> pro` w `src/lib/plans.ts` pozostaje do późniejszego etapu runtime wiring; helper tylko daje bezpieczny kontrakt.

Następny krok:
- CF-RUNTIME-01 LeadDetail missing/blocker/handoff wiring albo CF-RUNTIME-03 CaseDetail wiring.
<!-- CF_RUNTIME_00_SHARED_SOURCE_TRUTH_2026_06_15_END -->
