# STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT

Data: 2026-06-22 23:35 Europe/Warsaw
Status: R0_AUDIT_COMPLETED / REVIEW_REQUIRED / RUNTIME_NOT_TOUCHED
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## PROSTO

R0 sprawdza, czy wewnętrzny `/calendar` może być traktowany jako operacyjne źródło prawdy dla zadań, wydarzeń i terminów powiązanych z leadem/sprawą/klientem.

Wniosek: **jeszcze nie jako pełne źródło prawdy**. Kalendarz ma centralny model `ScheduleEntry` i realne akcje zapisu, ale Today nadal ma własne selektory dat i własną logikę list. Dlatego status jest **PARTIAL**, a następny etap powinien być runtime source-truth fix, nie samo zamknięcie.

## STATUS_PRECONDITION

Status: WYPEŁNIONE / PARTIAL

Sprawdzone:

- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- Obsidian vault: `10_PROJEKTY/CloseFlow_Lead_App/04_ETAPY_ROZWOJU_APLIKACJI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`
- repo runtime: `src/App.tsx`, `src/pages/Calendar.tsx`, `src/lib/scheduling.ts`, `src/lib/calendar-items.ts`, `src/pages/TodayStable.tsx`

Wynik:

```txt
STAGE232I3: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK w _project/04 i CODEX_CONTEXT_INDEX
STAGE232K: PARTIAL / DO_POTWIERDZENIA, bo w CODEX_CONTEXT_INDEX istnieje jeszcze starszy wpis APPLIED_PENDING_TEST_OR_PUSH, a _project/04 opisuje K/R3C jako CLOSED warunkowo
00_START: PARTIAL, bo stara lista nadal pokazuje I2/K/G, ale dolny router wskazuje STAGE232G_R0 jako najbliższy krok po prechecku
_project/04: PASS_FOR_R0, bo ma wpis STAGE232G_R0 i zakaz runtime
CODEX_CONTEXT_INDEX: PASS_FOR_R0, bo ma wpis STAGE232G_R0 i zakaz runtime
Obsidian 04 main vault: STALE, bo nadal pokazuje I3 jako następny aktywny etap po I2
STATUS_PRECONDITION_RESULT: PARTIAL_BUT_R0_ALLOWED_DOCS_ONLY
```

Wniosek: R0 może być wykonane jako audyt bez runtime. Nie wolno jednak zamykać całej kolejki jako idealnie zsynchronizowanej, dopóki Obsidian vault main nie dostanie aktualizacji.

## ACTIVE_ROUTE_MAP

Status: WYPEŁNIONE / PASS

- Aktywna trasa: `/calendar`.
- Router: `src/App.tsx`.
- Route `/calendar` ładuje `Calendar` tylko dla zalogowanego użytkownika.
- Komponent: `Calendar = lazyPage(() => import('./pages/Calendar'), 'Calendar')`.
- Nie znaleziono w aktywnej trasie alternatywnego komponentu kalendarza.
- `LeadDetail` i `ClientDetail` są importowane statycznie, ale to nie dotyczy trasy `/calendar`.

Wniosek: aktywna trasa jest jednoznaczna: `src/pages/Calendar.tsx`.

## CALENDAR_RENDER_FILES_MAP

Status: WYPEŁNIONE / PASS_WITH_LEGACY_RISK

Aktywne pliki i warstwy:

- `src/pages/Calendar.tsx` — ekran, dane, akcje, modale, selected day, week, month.
- `src/lib/scheduling.ts` — wspólny model `ScheduleEntry`, `combineScheduleEntries`, lead shadow entries, operator-today derived entries.
- `src/lib/calendar-items.ts` — pobranie bundle `tasks/events/leads/cases`, normalizacja task/event, Google inbound background sync.
- `src/lib/task-event-contract.ts` — eksportowany przez `scheduling.ts`, normalizacja pól daty task/event.
- `src/lib/work-items/normalize.ts` — normalizacja work itemów używana przez Calendar i Today, ale nie jako pełny wspólny model widoku.
- CSS aktywnie importowane przez Calendar:
  - `visual-stage22-event-form-vnext.css`
  - `closeflow-page-header-v2.css`
  - `closeflow-calendar-skin-only-v1.css`
  - `closeflow-calendar-color-tooltip-v2.css`
  - `closeflow-calendar-month-chip-overlap-fix-v1.css`
  - `closeflow-calendar-month-rows-no-overlap-repair2.css`
  - `closeflow-calendar-month-entry-structural-fix-v3.css`
  - `closeflow-calendar-month-plain-text-rows-v4.css`
  - `closeflow-calendar-selected-day-full-text-repair11.css`
  - `closeflow-calendar-selected-day-new-tile-v9.css`
  - `closeflow-unified-page-canvas-stage211c.css`
  - `closeflow-canvas-source-truth-stage211e.css`
  - `closeflow-canvas-runtime-source-truth-stage211j.css`

Ryzyko: dużo aktywnych CSS/DOM napraw świadczy o historii punktowych korekt. R1 nie powinien dokładać kolejnego obejścia bez uporządkowania źródła renderu.

## CALENDAR_DATA_MODEL_MAP

Status: WYPEŁNIONE / PARTIAL

Calendar przechowuje lokalnie:

```txt
events
tasks
leads
cases
clients
```

Źródła danych:

- `refreshSupabaseBundle()` pobiera `fetchCalendarBundleFromSupabase()` oraz osobno `fetchClientsFromSupabase()`.
- `fetchCalendarBundleFromSupabase()` pobiera taski, eventy, sprawy i leady przez osobne kolekcje.
- Taski i eventy są normalizowane do `CalendarTaskItem` i `CalendarEventItem`.
- Lead nie jest tylko relacją. Lead może generować osobny wpis typu `lead` przez `expandLeadEntries()`.
- Cases/clients są głównie używane jako relacje/opisy i opcje powiązania, nie jako osobne zdarzenia kalendarza.

Model `ScheduleEntry`:

```txt
kind: event | task | lead
sourceId: id rekordu źródłowego
title
startsAt / endsAt
leadId / leadName
raw: rekord źródłowy
```

Wniosek: model Calendar jest mocniejszy niż proste `events/tasks`, ale nie jest jeszcze wspólnym modelem dla Today.

## LEAD_SHADOW_ENTRY_STATUS

Status: WYPEŁNIONE / PARTIAL

Fakty:

- `ScheduleEntryKind` zawiera `lead`.
- `expandLeadEntries()` tworzy wpisy kalendarza z `nextActionAt`, `next_action_at`, `followUpAt`, `follow_up_at`, a w fallbacku z pól daty/czasu.
- Tytuł leada pochodzi z `nextActionTitle`, `next_action_title`, `title`, `name`, `company`.
- `removeLeadShadowEntries()` ukrywa lead entry, jeśli istnieje powiązany task/event po `nextActionItemId` albo ta sama relacja/ten sam moment/ten sam tytuł.
- `combineScheduleEntries()` łączy eventy, taski, operator-today tasks, lead entries i operator-today lead entries, potem usuwa lead shadow entries.

Ryzyko:

- Lead entry jest pochodnym wpisem operacyjnym, nie źródłowym zadaniem.
- Akcje `+1H/+1D/+1W` obsługują lead przez `updateLeadInSupabase(nextActionAt, nextActionTitle)`, więc lead entry nie jest tylko read-only.
- `Zrobione/Przywróć` dla lead entry nie ma jawnej gałęzi update leada i może dawać sukces bez realnego zamknięcia źródła.
- `Usuń` dla lead entry jest zablokowane jako unsupported, co jest bezpieczne.

Wniosek:

```txt
LEAD_SHADOW_ENTRY_STATUS: PARTIAL
```

R1 musi zdecydować: lead shadow zostaje jako świadomy typ operacyjny albo zostaje zepchnięty do tasków/next action z jednym kontraktem.

## TODAY_CALENDAR_PARITY_STATUS

Status: WYPEŁNIONE / PARTIAL

Fakty:

- Calendar używa `combineScheduleEntries()` do budowy `scheduleEntries`, `weekEntries`, `entriesByDayKey`, `weekEntriesByDayKey` i `selectedDayEntries`.
- TodayStable nie używa `combineScheduleEntries()`.
- TodayStable pobiera osobno tasks/events/leads/cases i ma własne funkcje:
  - `getTaskMomentRaw()`
  - `getLeadMomentRaw()`
  - `getEventMomentRaw()`
  - `getDateKey()`
  - `parseTime()`
- TodayStable tworzy `activeLeadsWithPlannedAction` przez `getNearestPlannedAction()` na podstawie `allWorkItems`.
- TodayStable ma osobne listy `operatorTasks`, `todayEvents`, `upcomingRowsAll`.
- Today ma własne akcje przesuwania terminów `+1D/+3D/+1W`, a Calendar ma `+1H/+1D/+1W`.
- Oba ekrany subskrybują `subscribeCloseflowDataMutations`, więc odświeżanie po mutacji istnieje, ale logika wyboru wpisów nie jest jedna.

Wniosek:

```txt
TODAY_CALENDAR_PARITY_STATUS: PARTIAL
```

Najważniejszy problem: Today i Calendar mogą widzieć ten sam rekord po zapisie, ale nie mają tego samego źródła selekcji, sortowania i klasyfikacji wpisów.

## ACTION_FIELD_MATRIX

Status: WYPEŁNIONE / PARTIAL

| Akcja | Typ | Rekord źródłowy | scheduledAt | dueAt | date | time | leadId | caseId | clientId | Po F5 Calendar | Po F5 Today | Ryzyko |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Edytuj | event | event.sourceId | startAt jako źródło czasu | nie dotyczy | z startAt | z startAt | zapisuje | zapisuje | zapisuje | prawdopodobnie OK po refresh | Today widzi przez event moment | PASS dla event |
| Edytuj | task | task.sourceId | zapisuje `scheduledAt: payload.dueAt` | payload.dueAt tylko pośrednio, nie jako jawny `dueAt` w update | zapisuje | payload time | zapisuje | zapisuje | brak jawnego clientId | prawdopodobnie OK, ale zależne od updateTask normalizacji | Today widzi przez własny getTaskMomentRaw | PARTIAL: brak jawnego dueAt/clientId w payloadzie update |
| +1H | event | event.sourceId | startAt przesunięty | nie dotyczy | z startAt | z startAt | zapisuje | zapisuje | brak clientId | OK po refresh | Today event może widzieć po refresh | PASS/PARTIAL bez clientId |
| +1H | task | task.sourceId | nadpisuje scheduledAt/scheduled_at | nadpisuje dueAt/due_at | nadpisuje | nadpisuje | zapisuje | zapisuje | brak clientId | OK po refresh | Today powinien widzieć po getTaskMomentRaw | PASS dla task shift |
| +1H | lead | lead.sourceId | nextActionAt | nie dotyczy | z nextActionAt | z nextActionAt | leadId/sourceId | nie dotyczy | nie dotyczy | OK jako lead shadow | Today zależne od activeLeadsWithPlannedAction/getNearestPlannedAction | PARTIAL |
| +1D | event | event.sourceId | startAt przesunięty | nie dotyczy | z startAt | z startAt | zapisuje | zapisuje | brak clientId | OK po refresh | Today event może widzieć po refresh | PASS/PARTIAL bez clientId |
| +1D | task | task.sourceId | nadpisuje scheduledAt/scheduled_at | nadpisuje dueAt/due_at | nadpisuje | nadpisuje | zapisuje | zapisuje | brak clientId | OK po refresh | Today powinien widzieć po getTaskMomentRaw | PASS dla task shift |
| +1D | lead | lead.sourceId | nextActionAt | nie dotyczy | z nextActionAt | z nextActionAt | leadId/sourceId | nie dotyczy | nie dotyczy | OK jako lead shadow | Today zależne od planned action | PARTIAL |
| +1W | event | event.sourceId | startAt przesunięty | nie dotyczy | z startAt | z startAt | zapisuje | zapisuje | brak clientId | OK po refresh | Today event może widzieć po refresh | PASS/PARTIAL bez clientId |
| +1W | task | task.sourceId | nadpisuje scheduledAt/scheduled_at | nadpisuje dueAt/due_at | nadpisuje | nadpisuje | zapisuje | zapisuje | brak clientId | OK po refresh | Today powinien widzieć po getTaskMomentRaw | PASS dla task shift |
| +1W | lead | lead.sourceId | nextActionAt | nie dotyczy | z nextActionAt | z nextActionAt | leadId/sourceId | nie dotyczy | nie dotyczy | OK jako lead shadow | Today zależne od planned action | PARTIAL |
| Zrobione | event | event.sourceId | zachowuje startAt | nie dotyczy | z startAt | z startAt | zapisuje | zapisuje | brak clientId | OK po refresh | Today powinien ukryć jako closed | PASS/PARTIAL bez clientId |
| Zrobione | task | task.sourceId | nie zapisuje jawnie | nie zapisuje jawnie | zapisuje `date` | nie zapisuje jawnie `time` | zapisuje | zapisuje | brak clientId | może działać, ale zależne od updateTask zachowania pól pominiętych | Today powinien ukryć po status done | PARTIAL: ryzyko utraty/rozjazdu daty jeśli updateTask traktuje brak pól destrukcyjnie |
| Zrobione | lead | lead.sourceId | brak jawnej gałęzi update | nie dotyczy | nie dotyczy | nie dotyczy | lead source | nie dotyczy | nie dotyczy | potencjalnie success bez zmiany źródła | Today może nadal pokazywać lead | BROKEN_RISK |
| Przywróć | event | event.sourceId | zachowuje startAt | nie dotyczy | z startAt | z startAt | zapisuje | zapisuje | brak clientId | OK po refresh | Today może znów widzieć event | PASS/PARTIAL |
| Przywróć | task | task.sourceId | nie zapisuje jawnie | nie zapisuje jawnie | zapisuje `date` | nie zapisuje jawnie `time` | zapisuje | zapisuje | brak clientId | może działać, ale zależne od updateTask | Today może znów widzieć task | PARTIAL |
| Przywróć | lead | lead.sourceId | brak jawnej gałęzi update | nie dotyczy | nie dotyczy | nie dotyczy | lead source | nie dotyczy | nie dotyczy | potencjalnie success bez zmiany źródła | Today może nadal pokazywać lead | BROKEN_RISK |
| Usuń | event | event.sourceId | usuwa event | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | OK po refresh | Today powinien zniknąć po mutation/refetch | PASS |
| Usuń | task | task.sourceId | usuwa/ukrywa task | usuwa/ukrywa task | usuwa/ukrywa task | usuwa/ukrywa task | nie dotyczy | nie dotyczy | nie dotyczy | OK po refresh | Today powinien zniknąć po mutation/refetch | PASS |
| Usuń | lead | unsupported | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | nie dotyczy | blokuje akcję | bez zmian | PASS jako blokada false-success |

Wniosek: shift tasków wygląda najlepiej. Największe ryzyko jest w `Zrobione/Przywróć` dla lead entry oraz w niepełnych payloadach task complete/edit.

## SELECTED_DAY_WEEK_MONTH_VERIFICATION

Status: WYPEŁNIONE / PARTIAL

Fakty:

- `CalendarSelectedDayTileV9` renderuje selected day z `selectedDayEntries` opartymi o `entriesByDayKey`.
- `entriesByDayKey` pochodzi z `scheduleEntries`, czyli z `combineScheduleEntries()`.
- Widok tygodnia używa `weekEntries`, też przez `combineScheduleEntries()`.
- Widok miesiąca używa `scheduleEntries` i `entriesByDayKey`, ale ma aktywne DOM normalizatory dla month rows/chips.

Wniosek:

- Selected day i week są bliżej jednego modelu wpisu.
- Month jest najryzykowniejszy, bo po React renderze działa kilka normalizatorów DOM.

```txt
SELECTED_DAY_WEEK_MONTH_VERIFICATION: PARTIAL
```

## LEGACY_AND_ACTIVE_DOM_NORMALIZERS_FOUND

Status: WYPEŁNIONE / HIGH_RISK

| Plik | Marker / useEffect / CSS | Aktywne runtime? | Co modyfikuje | Ryzyko | Rekomendacja R1 |
|---|---|---|---|---|---|
| `src/pages/Calendar.tsx` | `CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT` | TAK | klasy/dataset/title dla clipped calendar text | średnie | zostawić tylko jeśli test renderu potwierdzi potrzebę |
| `src/pages/Calendar.tsx` | `CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT` | TAK | month chips, `replaceChildren()` | wysokie | uporządkować render miesiąca w React zamiast DOM surgery |
| `src/pages/Calendar.tsx` | `CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT` | TAK | month rows, `className`, dataset, `replaceChildren()` | wysokie | przenieść do declarative renderu albo objąć mocnym guardem |
| CSS Calendar | wiele plików `month-*`, `selected-day-*`, `skin-*` | TAK | wygląd i ukrywanie/naprawy wpisów | średnie/wysokie | R1 powinien mieć visual source truth, nie dokładanie kolejnego CSS hotfixa |

Wniosek: to nie są martwe legacy pliki. To aktywne normalizatory runtime. Każda zmiana w Calendar musi uważać, żeby nie walczyć z tym kodem.

## GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS

Status: WYPEŁNIONE / PASS_WITH_RUNTIME_RISK

Fakty:

- `fetchCalendarBundleFromSupabase()` czyta lokalne Supabase dane i nie czeka na Google sync.
- Calendar po pierwszym lokalnym odczycie uruchamia `syncGoogleCalendarInboundForCalendar()` w tle.
- Jeżeli Google inbound sync zwróci created/updated/deleted, Calendar robi kolejny `refreshSupabaseBundle()`.
- Google sync ma throttle 60 sekund i in-flight promise.

Wniosek:

```txt
GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS: PASS_WITH_RUNTIME_RISK
```

To jest poprawne jako local-first. Ryzyko: manual smoke może widzieć zmianę po background refreshu. R1 nie powinien ruszać Google OAuth/sync bez osobnego etapu.

## CALENDAR_SOURCE_TRUTH_STATUS

Status: WYPEŁNIONE / PARTIAL

Wniosek główny:

```txt
CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL
```

Dlaczego nie PASS:

- Calendar ma swój wspólny model `ScheduleEntry`, ale Today nie używa tego modelu.
- Today ma własne funkcje czytania dat i budowania list.
- Lead shadow entries są świadomym mechanizmem, ale nie są jeszcze produkcyjnie rozstrzygnięte jako źródło prawdy.
- `Zrobione/Przywróć` dla lead entry wygląda na niepełne lub potencjalnie mylące.
- Task complete/edit nie zapisuje pełnej macierzy pól tak konsekwentnie jak shift.
- Obsidian vault main jest stale względem repo app/payloadu.

Dlaczego nie BROKEN:

- Aktywna trasa `/calendar` jest jasna.
- Calendar ma realne sourceId i zapis do event/task/lead dla przesuwania.
- Task shift ma dobry kontrakt pól: `scheduledAt`, `dueAt`, `date`, `time`.
- Delete dla unsupported lead entry jest blokowany, więc nie ma false success dla delete.
- Live refresh/mutation bus istnieje po stronie Calendar i Today.

## DO_POTWIERDZENIA

- Czy Damian chce utrzymać lead shadow entry jako świadomy typ wpisu Calendar, czy wymusić task jako jedyny operacyjny następny krok.
- Czy Today ma zostać refaktorowany do `combineScheduleEntries()` albo wspólnego adaptera read-only.
- Czy `Zrobione/Przywróć` dla lead entry ma być ukryte, blokowane jak delete, czy ma aktualizować lead status/nextAction.
- Czy task complete/edit ma zawsze zapisywać pełny payload: `scheduledAt`, `dueAt`, `date`, `time`, `leadId`, `caseId`, `clientId`.
- Czy Obsidian vault main ma być zsynchronizowany bezpośrednio teraz, czy przez payload po kolejnym pushu.

## ZAKAZY_ZAKRESU_R0

R0 nie rusza:

- SQL / RLS,
- finanse / prowizje,
- Braki / Blokady runtime,
- Owner Control runtime,
- MissingItemsManagerDialog,
- CaseDetail runtime,
- ClientDetail runtime,
- LeadDetail runtime,
- Google Calendar OAuth / produkcyjny sync,
- runtime Calendar / Today.

## R1_DECISION_GATE

R1 runtime fix dopiero po pelnym R0, status-precheck i decyzji Damiana; R0 pozostaje docs-only bez runtime.

Po R0:

```txt
IF CALENDAR_SOURCE_TRUTH_STATUS == PASS:
  R1 = STAGE232G_R1_CALENDAR_STATUS_SYNC_AND_GUARD_CLOSE

IF CALENDAR_SOURCE_TRUTH_STATUS == PARTIAL/BROKEN/DO_POTWIERDZENIA:
  R1 = STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX
```

Decyzja R0:

```txt
R1_RECOMMENDATION: STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX
R1_REASON: CALENDAR_SOURCE_TRUTH_STATUS == PARTIAL
```

## TESTY_R0

Do uruchomienia lokalnie po paczce:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
node --test tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## RUNTIME_TOUCHED

```txt
RUNTIME_TOUCHED: NIE
```

## RISK_AUDIT_AFTER_R0

Najważniejsze ryzyka:

1. **Today/Calendar parity risk** — dwa ekrany używają różnych selektorów i list, mimo że czytają podobne dane.
2. **Lead shadow action risk** — lead entry jest operacyjne, ale akcje done/restore nie mają kompletnej gałęzi backendowej.
3. **DOM normalizer risk** — month view jest aktywnie przepisywany po renderze przez `replaceChildren()` i dataset/className mutacje.
4. **Task payload consistency risk** — shift taska zapisuje pełne pola, ale complete/edit ma bardziej ograniczony payload.
5. **Obsidian sync risk** — app repo ma nowszy kierunek niż `obsidian-vault` main, więc etap nie jest w pełni zamknięty operacyjnie bez synchronizacji Obsidiana.

## NASTĘPNY_KROK

Po akceptacji Damiana przejść do:

```txt
STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX
```

Minimalny zakres R1 powinien być zawężony do:

- wspólny adapter/kontrakt Calendar + Today dla task/event/lead moments,
- blokada lub naprawa `Zrobione/Przywróć` dla lead entries,
- pełny payload task edit/complete,
- test parity Calendar/Today po F5,
- bez Google OAuth/sync i bez SQL.
