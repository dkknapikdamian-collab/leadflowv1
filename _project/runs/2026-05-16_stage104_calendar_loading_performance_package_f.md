# RUN — Stage104 / Paczka F — Calendar loading performance

Data: 2026-05-16  
Projekt: CloseFlow / LeadFlow  
Tryb: ZIP lokalny, bez pusha  
Branch docelowy: dev-rollout-freeze

## Scan-first confirmation

- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch według instrukcji projektu: `dev-rollout-freeze`
- Lokalna ścieżka docelowa: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian vault docelowy: `C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT`
- Przeczytane pliki / źródła:
  - `LEAD_APP__AKTYWNA_MAPA_I_PROCES_OBSIDIAN_FINAL_V2.md`
  - `LEAD_APP__POLECENIE_DO_PRZESTRZENI_ROBOCZEJ_FINAL_V2.md`
  - `AI_DEVELOPER_KODOWANIE_STANDARD_DAMIANA.md`
  - `src/pages/Calendar.tsx`
  - `src/lib/calendar-items.ts`
  - `src/lib/scheduling.ts`
  - `src/lib/supabase-fallback.ts`
  - `package.json`
- Brakujące lokalnie w środowisku pakowania: pełny lokalny checkout Damiana i jego runtime. Paczka jest przygotowana do zastosowania na lokalnym repo przez `APPLY_CLOSEFLOW_STAGE104_CALENDAR_PERFORMANCE_F.ps1`.

## FAKTY Z KODU / PLIKÓW

- `Calendar.tsx` liczył `combineScheduleEntries` bezpośrednio w renderze dla `scheduleEntries` i `weekEntries`.
- `Calendar.tsx` wołał `getEntriesForDay(...)` w mapach dni miesiąca i tygodnia.
- `Calendar.tsx` blokował cały widok przez pełnoekranowy loader przy `loading`.
- `fetchCalendarBundleFromSupabase()` zwraca już `cases`, a `Calendar.tsx` równolegle pobierał `fetchCasesFromSupabase()` drugi raz.
- `fetchCalendarBundleFromSupabase()` nadal pobiera kalendarz szeroko: tasks, events, cases, leads. Zakresy dat po stronie API są oznaczone jako DO POTWIERDZENIA, bo aktualne fetchery `fetchTasksFromSupabase()` i `fetchEventsFromSupabase()` nie mają jawnych parametrów zakresu dat.

## DECYZJE DAMIANA

- Etap ma być wykonany jako lokalna paczka ZIP.
- Bez pusha na tym etapie.
- W paczce muszą być aktualizacje `_project/` i Obsidiana.
- Celem jest znaleźć i ograniczyć lag kalendarza wynikający z danych, renderów, fetchy i ciężkich list.

## HIPOTEZY / PROPOZYCJE AI

- Główne źródło lagu na froncie: powtarzane mapowanie `combineScheduleEntries` i filtrowanie per dzień w renderze.
- Drugi realny koszt: pełnostronicowy loader i podwójny fetch cases.
- Range fetch po backendzie warto zrobić dopiero po potwierdzeniu kontraktu API dla `/api/tasks`, `/api/events` i `/api/leads`.

## ZMIENIONE PLIKI

- `src/pages/Calendar.tsx`
- `tests/stage104-calendar-loading-performance-contract.test.cjs`
- `_project/runs/2026-05-16_stage104_calendar_loading_performance_package_f.md`
- `_project/03_CURRENT_STAGE.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/10_PROJECT_TIMELINE.md`
- `_project/14_TEST_HISTORY.md`
- Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/2026-05-16_stage104_calendar_loading_performance.md`
- Obsidian dashboard: `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- Obsidian index: `PROJECTS.md` line guard, jeżeli brakowało wpisu CloseFlow.

## CO ZMIENIONO TECHNICZNIE

1. `scheduleEntries` przeniesione do `useMemo`.
2. `weekEntries` przeniesione do `useMemo`.
3. Zakres miesiąca, dni miesiąca i dni tygodnia przeniesione do `useMemo`.
4. Dodano `entriesByDayKey` i `weekEntriesByDayKey`, żeby wpisy per dzień były kubełkowane raz, a nie filtrowane w zagnieżdżonych mapach.
5. `selectedDayEntries` liczone z precomputed map i `useMemo`.
6. Usunięto bezpośrednie użycie `getEntriesForDay` z `Calendar.tsx`.
7. Usunięto pełnostronicowy loader dla kalendarza. UI renderuje shell, a stan ładowania jest oddzielony jako mały skeleton/panel danych.
8. `Calendar.tsx` przestał dublować fetch cases obok `fetchCalendarBundleFromSupabase()`. Cases pochodzą z bundle.

## TESTY AUTOMATYCZNE

- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` w skrypcie APPLY, chyba że uruchomiono z `-SkipBuild`.

## GUARDY

Guard Stage104 sprawdza:

- `Calendar.tsx` nie liczy `combineScheduleEntries` poza `useMemo`.
- `Calendar.tsx` ma `entriesByDayKey` i `weekEntriesByDayKey` w `useMemo`.
- `Calendar.tsx` nie używa `getEntriesForDay(...)` w render path.
- `selectedDayEntries` idzie z memoizowanego precompute.
- loading danych nie blokuje całej strony przez `if (loading) return <Layout>...`.
- cases nie są pobierane drugi raz obok `fetchCalendarBundleFromSupabase()`.

## TESTY RĘCZNE

Status: TEST RĘCZNY DO WYKONANIA.

Ręcznie sprawdzić:

1. Wejście na `/calendar` po odświeżeniu strony.
2. Przełącznik Tydzień / Miesiąc.
3. Nawigację poprzedni / następny miesiąc.
4. Kliknięcie dnia w miesiącu i przewinięcie do panelu wybranego dnia.
5. Edycję wpisu z miesiąca.
6. Akcje `+1H`, `+1D`, `+1W`, `Zrobione`, `Usuń` w tygodniu i w wybranym dniu.
7. Czy po odświeżaniu danych nie znika cały shell kalendarza.

## BRAKI I RYZYKA

- Range fetch po backendzie nie został wdrożony, bo aktualny kontrakt `fetchTasksFromSupabase()` / `fetchEventsFromSupabase()` nie przyjmuje zakresu dat. Próba dopięcia query params bez potwierdzenia backendu byłaby ryzykownym zgadywaniem.
- W pliku `Calendar.tsx` nadal istnieją stare efekty DOM-normalizacji miesiąca. Nie były usuwane w tej paczce, bo mogłyby naruszyć zamrożony wygląd kalendarza. To osobny kandydat na Paczkę G: ograniczenie DOM post-processingu tylko do aktywnego widoku i tylko po zmianie entries map.
- Test automatyczny jest kontraktowy, nie mierzy realnego czasu renderu.

## WPŁYW NA OBSIDIANA

- Dodano notatkę etapu Stage104 / Paczka F.
- Dashboard CloseFlow dostaje wpis o statusie: wdrożone lokalnie po APPLY, test ręczny do wykonania.
- `PROJECTS.md` dostaje wpis CloseFlow, jeżeli go brakuje.

## NASTĘPNY KROK

Uruchomić paczkę lokalnie, wkleić wynik guard/build i zrobić test ręczny kalendarza. Jeśli guard i build przejdą, następny sensowny etap to Paczka G: audyt i ograniczenie starych efektów DOM-normalizacji miesiąca, bo one nadal mogą generować koszt po renderze.

## GIT / ZIP STATUS

- ZIP przygotowany lokalnie.
- Brak pusha.
- Skrypt APPLY pokazuje `git status --short` po pracy.
