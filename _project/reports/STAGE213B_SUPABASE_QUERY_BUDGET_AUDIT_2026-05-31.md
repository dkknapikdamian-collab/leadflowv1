---
typ: raport_stage
stage: Stage213B
status: prepared_audit
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
---

# Stage213B - Supabase Query Budget Audit

## Cel

Celem etapu jest mapa kosztów zapytań Supabase po Stage213A. Ten etap **nie zmienia RLS, GRANT, danych ani SQL produkcyjnego Supabase**. To jest audyt i guard, nie szeroka optymalizacja.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian vault: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT
- Obsidian folder: 10_PROJEKTY/CloseFlow_LeadFlow / DO_POTWIERDZENIA
- tryb: lokalnie najpierw, potem jeden push po testach

## Przeczytane / przeanalizowane źródła

FAKTY z dostępnego skanu GitHub/commit Stage213A:

- package.json
- src/server/_supabase.ts
- src/lib/supabase-fallback.ts
- src/lib/calendar-items.ts
- src/hooks/useWorkspace.ts
- src/App.tsx
- src/pages/Today.tsx
- src/pages/TodayStable.tsx
- src/pages/Calendar.tsx
- src/pages/Leads.tsx
- src/pages/Clients.tsx
- src/pages/Cases.tsx
- src/pages/TasksStable.tsx
- src/pages/NotificationsCenter.tsx
- src/pages/LeadDetail.tsx
- src/pages/CaseDetail.tsx
- _project/reports/STAGE213A_SUPABASE_PUBLIC_DATA_API_GRANTS_2026-05-31.md
- OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213A Supabase public Data API grants.md

UWAGA OPERACYJNA: GitHub search branch nie pokazał branchy `dev-rollout-freeze` ani `dev`, dlatego audyt został oparty o commit Stage213A `4e83801aaa716a72a20db3499baaf5850f9440f6`. Lokalnie przed zastosowaniem paczki sprawdzić `git branch --show-current`.

## Co jest źródłem kosztu

Aplikacja nie używa w kliencie bezpośrednio `supabase.from(...).select(...)` jako głównego mechanizmu danych. Główny koszt idzie przez warstwę API:

- frontend wywołuje wrappery z `src/lib/supabase-fallback.ts`, np. `fetchTasksFromSupabase`, `fetchEventsFromSupabase`, `fetchCasesFromSupabase`, `fetchLeadsFromSupabase`, `fetchClientsFromSupabase`, `fetchPaymentsFromSupabase`, `fetchActivitiesFromSupabase`;
- wrappery wołają `/api/...` albo `/api/system?...` przez `callApi`;
- backend używa `src/server/_supabase.ts` i REST Data API Supabase przez `supabaseRequest`;
- `callApi` ma 30-sekundowy cache/dedupe dla GET, ale refetch po focus/visibility, interval i retry nadal może zwiększać realną liczbę requestów po wyjściu poza TTL albo przy różnych endpointach.

## Mapa zapytań i ryzyka

| Obszar | Plik | Mechanizm | Kiedy odpala | Szacowany koszt świeżego odczytu | Ryzyko | Uwagi / możliwa optymalizacja |
|---|---|---|---|---:|---|---|
| Bootstrap profilu | `src/App.tsx` | `fetchMeFromSupabase()` | po zalogowaniu usera | 1 GET | niskie | Komentarz w kodzie mówi, że nie ma globalnego focus refresh profilu. Zostawić. |
| Workspace context | `src/hooks/useWorkspace.ts` | `fetchMeFromSupabase()` | auth snapshot / refreshToken | 1 GET | niskie/średnie | Potrzebne, ale `ensureWorkspaceContext` w kalendarzu może je powtórzyć przy retry błędów. |
| Aktywny ekran startowy | `src/pages/TodayStable.tsx` | `loadStableTodayData()` -> tasks, leads, events, cases, ai drafts | mount, focus, visibilitychange, data mutation | 5 logicznych GET + ukryte archiwalne parent indexy z tasks/events | wysokie | Najważniejszy ekran startowy. Focus/visibility bez throttla to top ryzyko. |
| Kalendarz | `src/pages/Calendar.tsx` | `refreshSupabaseBundle()` -> calendar bundle + clients | mount, live mutation, retry 250/900/1800ms, opcjonalny refresh po Google sync | 1 bundle = tasks/events/cases/leads + clients + ukryte parent indexy | bardzo wysokie | Największy mnożnik. Start może wykonać initial + 3 retry + optional Google refresh. |
| Bundle kalendarza | `src/lib/calendar-items.ts` | `fetchCalendarBundleFromSupabase()` | Today legacy, Calendar, Notifications | 4 kolekcje, każda przez `readCollection` z retry | wysokie | To powinno dostać range/limit/cache i/lub jeden backendowy endpoint bundle. |
| Tasks/Events hidden multiplier | `src/lib/supabase-fallback.ts` | `fetchTasksFromSupabase()` i `fetchEventsFromSupabase()` + `buildCalendarParentArchiveIndexForCascade()` | każdy odczyt tasków/eventów | task/event GET + clients includeArchived + cases includeArchived | bardzo wysokie | To jest ukryty mnożnik na prawie każdej stronie operacyjnej. |
| Leady | `src/pages/Leads.tsx` | `loadLeads()` -> leads, cases, tasks, events, clients | mount, create/archive/restore | 5 logicznych GET + ukryte parent indexy | wysokie | Do next action pobierane są wszystkie taski/eventy. Potrzebny endpoint summary/range. |
| Klienci | `src/pages/Clients.tsx` | `reload()` -> clients, leads, cases, payments, tasks, events | mount, create/archive/restore | 6 logicznych GET + ukryte parent indexy | wysokie | Lista klientów ładuje prawie cały workspace dla liczników i wartości. |
| Sprawy | `src/pages/Cases.tsx` | `refreshCases()` i mount Promise.all | mount, create/delete | 5 logicznych GET + ukryte parent indexy | wysokie | Podobne do Lead/Client list. Dane do listy powinny być agregowane po stronie API. |
| Zadania | `src/pages/TasksStable.tsx` | `refreshData()` -> tasks, cases | mount, focus, visibility, save/toggle/delete | 2 logiczne GET + ukryte parent indexy w tasks | wysokie | Focus/visibility bez throttla. Mniejszy od Today, ale nadal stały generator. |
| Powiadomienia | `src/pages/NotificationsCenter.tsx` | `fetchCalendarBundleFromSupabase()` w interval | mount + `setInterval(..., 60_000)` | bundle co 60s | bardzo wysokie | Jedyny jawny polling. Powinien być zastąpiony mutation-event, visibility-gate albo dłuższym intervalem tylko przy aktywnej zakładce. |
| Lead detail | `src/pages/LeadDetail.tsx` | `loadLead()` -> lead, cases, tasks, events, activities, payments | mount, zapis płatności, zmiany | 6 logicznych GET + ukryte parent indexy | średnie/wysokie | Szczegół ładuje wszystkie taski/eventy i filtruje po stronie klienta. |
| Case detail | `src/pages/CaseDetail.tsx` | `refreshCaseData()` -> case, items, activities, tasks, events, payments | mount, płatności, zmiany | 6 logicznych GET + ukryte parent indexy | średnie/wysokie | Tak jak LeadDetail: powinno pobierać work-items filtrowane po caseId/leadId/clientId. |
| Legacy Today | `src/pages/Today.tsx` | `refreshSupabaseBundle()` | kod istnieje, ale aktywny route importuje `TodayStable` | ciężkie, jeśli wróci | średnie | Nie jest aktywnym routem według `src/App.tsx`, ale guard powinien widzieć go jako ryzyko przy reanimacji. |

## Najwięksi winowajcy limitów

### 1. `src/pages/Calendar.tsx` + `src/lib/calendar-items.ts`

To jest największy generator, bo `refreshSupabaseBundle()` ładuje bundle i klientów, a start kalendarza robi initial load, retry po 250/900/1800 ms i opcjonalny kolejny refresh po Google inbound sync. Jeżeli każdy bundle odpala tasks/events/cases/leads oraz ukryte parent-index reads, jeden wejściowy ekran może zachować się jak mini-odkurzacz Supabase.

### 2. `src/pages/NotificationsCenter.tsx`

Jest jawny `setInterval(..., 60_000)`, który co minutę odpala pełny calendar bundle. To jest klasyczny koszt kroplujący: użytkownik zostawi zakładkę, a Supabase dostaje metronomem po głowie.

### 3. `src/pages/TodayStable.tsx`

To aktywny ekran startowy. Ładuje tasks, leads, events, cases i ai drafts, a potem robi refresh na focus i visibilitychange oraz po mutacjach. Ponieważ task/event wrappery mają ukryte parent-indexy, ten ekran jest budżetowo cięższy niż wygląda.

### 4. `src/lib/supabase-fallback.ts` hidden multiplier

`fetchTasksFromSupabase()` i `fetchEventsFromSupabase()` filtrują archiwalne powiązania przez `buildCalendarParentArchiveIndexForCascade()`, czyli dodatkowo pobierają klientów i sprawy z `includeArchived=1`. To nie jest widoczne w komponentach, ale zwielokrotnia koszt prawie wszędzie, gdzie używa się tasków/eventów.

## Decyzja: pierwsze 3 miejsca do optymalizacji w Stage213C

**Teza:** Stage213C powinien poprawić najpierw koszt startowy i cykliczny, nie drobne szczegóły.

**Poziom przekonania:** 9/10.

1. **Notifications polling**  
   - Zmienić pełny `setInterval` bundle co 60s na bezpieczny mechanizm: visibility-aware, dłuższy interval, manual refresh albo event-driven refresh po `closeflow:data-mutated`.
   - To najkrótszy fix o dużym efekcie.

2. **Calendar retry policy**  
   - Ograniczyć retry po starcie kalendarza. Obecne 250/900/1800ms było ratunkiem na hard refresh, ale budżetowo jest za drogie.
   - Propozycja: jeden retry tylko gdy pierwszy wynik pusty/albo gdy workspace dopiero się ustabilizował; nie trzy bezwarunkowe retry.

3. **TodayStable focus/visibility refresh throttle**  
   - Dodać throttle/TTL i nie robić pełnego refetchu po każdym focus/visibility, jeśli dane są świeże.
   - Start screen ma największą częstotliwość użycia, więc każdy refetch tutaj boli podwójnie.

**Argument za:** te trzy poprawki ograniczają requesty bez zmiany modelu danych i bez dotykania RLS/SQL.

**Argument przeciw:** ukryty multiplikator tasks/events zostaje, ale jego naprawa może wymagać większej zmiany API i łatwiej zepsuć widoki.

**Co zmieniłoby decyzję:** runtime counter w Stage213D pokaże, że inny ekran robi więcej requestów niż Calendar/Notifications/TodayStable.

**Najkrótszy test:** po Stage213C wejście kolejno na `/`, `/calendar`, `/notifications` powinno generować mniej requestów niż przed zmianą, bez pustych danych po hard refresh.

## Hipotezy do sprawdzenia lokalnie

- `callApi` GET cache 30s realnie deduplikuje część identycznych requestów, ale nie usuwa kosztu różnych endpointów ani powtarzanych refreshów po TTL.
- `fetchTasksFromSupabase()` i `fetchEventsFromSupabase()` mogą wykonywać ukryte parent indexy nawet tam, gdzie widok nie potrzebuje pełnej informacji o archiwalnych klientach/sprawach.
- `Calendar` retry powstało jako fix stabilności po hard refresh, więc nie wolno go usuwać brutalnie. Trzeba zrobić warunkowy retry, nie amputację.

## Czego nie ruszano

- Nie zmieniano RLS.
- Nie zmieniano GRANT.
- Nie tworzono SQL.
- Nie dotykano danych produkcyjnych.
- Nie pushowano.
- Nie kasowano backupów ani plików.
- Nie zmieniano logiki UI poza dodaniem guardu audytowego w tej paczce.

## Guard Stage213B

Dodano skrypt:

```text
scripts/check-stage213b-supabase-query-budget-audit.cjs
```

Guard sprawdza:

- czy istnieje raport Stage213B;
- czy istnieje update Obsidiana;
- czy raport zawiera kluczowe sekcje i decyzję top 3;
- czy wykryte miejsca ryzyka są ujęte w raporcie;
- czy występują `setInterval` w plikach Supabase/bundle;
- czy występują `select('*')` w miejscach wysokiego ryzyka;
- czy pliki mają wiele wystąpień `refreshSupabaseBundle`.

Guard jest celowo audytowy: obecne ryzyka nie blokują stage, jeżeli są opisane w raporcie. Blokuje brak raportu, brak update Obsidiana albo nowe niewyjaśnione ryzyka.

## Testy wymagane lokalnie

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage213b-supabase-query-budget-audit.cjs
npm run build
```

Opcjonalnie po testach:

```powershell
git status --short
```

## Następny etap

Stage213C - Supabase Query Budget Fix 1:

1. Notifications polling fix.
2. Calendar retry policy fix.
3. TodayStable focus/visibility throttle.

Nie robić pełnej przebudowy API w Stage213C. Najpierw trzy bezpieczne cięcia kosztów. API bundle/parent-index przenieść do kolejnego etapu, jeśli request counter potwierdzi skalę.
