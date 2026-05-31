---
typ: project_report
stage: STAGE216B
status: prepared_qa_smoke
project: CloseFlow / LeadFlow
date: 2026-05-31
---

# STAGE216-B - Tasks / Events / Calendar QA + runtime smoke

## Routing

- canonical_name: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian vault: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT
- Obsidian folder: 10_PROJEKTY/CloseFlow_LeadFlow
- tryb pracy: ZIP-first, lokalne wdrożenie, testy, potem targetowany commit/push

## Teza etapu

Stage216-B nie naprawia wszystkiego naraz. To bramka diagnostyczna dla drugiego rdzenia operacyjnego po migracji Supabase: zadania, wydarzenia, kalendarz oraz relacje lead/client/case -> task/event.

Po Stage216-A5 start obsługi leada jest odblokowany fallbackiem JS. Teraz sprawdzamy, czy zadania, wydarzenia i kalendarz odpowiadają jako kontrolowany JSON, nie jako HTML, Vite source albo 500.

## Wynik skanu lokalnego

- scanned_at: 2026-05-31T21:37:25.625Z
- cwd: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- expected files: 18
- existing files: 18
- missing files: 0
- fetch() markers: 1
- useEffect() markers: 36
- setInterval() markers: 0
- Supabase .from() markers: 18

## Mapa plików

| Plik | Status | Linie | fetch | useEffect | setInterval | supabase .from | Markery |
|---|---:|---:|---:|---:|---:|---:|---|
| package.json | OK | 836 | 0 | 0 | 0 | 0 | api/work-items or work-items route; kind=tasks / task kind routing; Vite source response clue; Supabase access clue; polling / interval clue; Google Calendar sync clue; lead/client/case relation clue |
| vercel.json | OK | 210 | 0 | 0 | 0 | 0 | literal /api/tasks; literal /api/events; api/work-items or work-items route; api/system or apiRoute; kind=tasks / task kind routing; kind=events / event kind routing; Google Calendar sync clue; lead/client/case relation clue |
| src/lib/supabase-fallback.ts | OK | 730 | 1 | 0 | 0 | 0 | literal /api/tasks; literal /api/events; api/system or apiRoute; kind=tasks / task kind routing; kind=events / event kind routing; INVALID_API_RESPONSE handling; non-JSON / HTML guard clues; Vite source response clue; Supabase access clue; hard refresh / workspace readiness clue; Google Calendar sync clue; lead/client/case relation clue |
| api/work-items.ts | OK | 766 | 0 | 0 | 0 | 0 | api/work-items or work-items route; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; hard refresh / workspace readiness clue; Google Calendar sync clue; lead/client/case relation clue |
| api/system.ts | OK | 1021 | 0 | 0 | 0 | 0 | api/system or apiRoute; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; hard refresh / workspace readiness clue; Google Calendar sync clue; lead/client/case relation clue |
| src/pages/TasksStable.tsx | OK | 805 | 0 | 2 | 0 | 0 | kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; polling / interval clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| src/pages/Calendar.tsx | OK | 2767 | 0 | 14 | 0 | 7 | api/work-items or work-items route; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; polling / interval clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| src/pages/TodayStable.tsx | OK | 1774 | 0 | 9 | 0 | 7 | api/work-items or work-items route; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; polling / interval clue; lead/client/case relation clue |
| src/pages/LeadDetail.tsx | OK | 1902 | 0 | 4 | 0 | 0 | api/work-items or work-items route; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; polling / interval clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| src/pages/ClientDetail.tsx | OK | 2340 | 0 | 5 | 0 | 0 | api/work-items or work-items route; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| src/pages/CaseDetail.tsx | OK | 2522 | 0 | 2 | 0 | 4 | api/work-items or work-items route; kind=tasks / task kind routing; kind=events / event kind routing; Vite source response clue; Supabase access clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| scripts/check-stage216a2-lcc-runtime-smoke.cjs | OK | 54 | 0 | 0 | 0 | 0 | INVALID_API_RESPONSE handling; non-JSON / HTML guard clues; lead/client/case relation clue |
| _project/reports/STAGE215_SUPABASE_COVERAGE_MATRIX_2026-05-31.md | OK | 235 | 0 | 0 | 0 | 0 | api/system or apiRoute; kind=tasks / task kind routing; kind=events / event kind routing; INVALID_API_RESPONSE handling; Supabase access clue; polling / interval clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| _project/reports/STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31.md | OK | 173 | 0 | 0 | 0 | 0 | kind=tasks / task kind routing; kind=events / event kind routing; INVALID_API_RESPONSE handling; Supabase access clue; hard refresh / workspace readiness clue; lead/client/case relation clue |
| _project/reports/STAGE216A2_LCC_RUNTIME_SMOKE_2026-05-31.md | OK | 107 | 0 | 0 | 0 | 0 | kind=tasks / task kind routing; kind=events / event kind routing; INVALID_API_RESPONSE handling; non-JSON / HTML guard clues; Supabase access clue; lead/client/case relation clue |
| _project/reports/STAGE216A3_VITE_API_SOURCE_RESPONSE_GUARD_2026-05-31.md | OK | 71 | 0 | 0 | 0 | 0 | kind=tasks / task kind routing; kind=events / event kind routing; non-JSON / HTML guard clues; Vite source response clue; Supabase access clue; lead/client/case relation clue |
| _project/reports/STAGE216A4_CLIENTS_AUTH_ERROR_HOTFIX_2026-05-31.md | OK | 94 | 0 | 0 | 0 | 0 | kind=tasks / task kind routing; non-JSON / HTML guard clues; Vite source response clue; Supabase access clue; lead/client/case relation clue |
| _project/reports/STAGE216A5_LEAD_SERVICE_RPC_FALLBACK_HOTFIX_2026-05-31.md | OK | 55 | 0 | 0 | 0 | 0 | kind=tasks / task kind routing; kind=events / event kind routing; Supabase access clue; lead/client/case relation clue |

## Podsumowanie markerów

- lead/client/case relation clue: 18
- kind=tasks / task kind routing: 17
- Supabase access clue: 16
- kind=events / event kind routing: 15
- Vite source response clue: 12
- hard refresh / workspace readiness clue: 10
- api/work-items or work-items route: 8
- polling / interval clue: 6
- Google Calendar sync clue: 5
- INVALID_API_RESPONSE handling: 5
- non-JSON / HTML guard clues: 5
- api/system or apiRoute: 4
- literal /api/tasks: 2
- literal /api/events: 2

## Braki do potwierdzenia

- brak, wszystkie oczekiwane pliki były dostępne podczas skanu

## Runtime smoke GET-only

Do uruchomienia po starcie lokalnego dev API:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run dev:api
```

W drugim oknie:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="PRAWDZIWY_WORKSPACE_UUID"
node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write
```

Sprawdzane kandydaty:

- /api/tasks
- /api/events
- /api/work-items?kind=tasks
- /api/work-items?kind=events
- /api/system?apiRoute=tasks
- /api/system?apiRoute=events

## Interpretacja runtime

- PASS JSON: endpoint działa jako JSON.
- AUTH_REQUIRED 401/403 JSON: endpoint żyje, wymaga auth/workspace context, to nie jest INVALID_API_RESPONSE.
- NON_JSON_HTML_RESPONSE: twardy FAIL.
- VITE_DEV_API_SOURCE_RESPONSE: prawdopodobnie uruchomiono zwykłe npm run dev zamiast npm run dev:api albo rewrite/API nie działa.
- 500: twardy FAIL i podstawa pod Stage216-B2.
- FETCH_FAILED: port/app URL nie działa.

## Testy automatyczne

- node scripts/check-stage216b-tasks-events-calendar-qa.cjs
- npm run build
- runtime: node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write

## Testy ręczne

- Zadania: wejść w listę zadań, odświeżyć stronę, potwierdzić brak pustego stanu po hard refresh, jeżeli dane istnieją.
- Zadania: sprawdzić dodanie/edycję/zmianę statusu tylko ręcznie, bez danych testowych commitowanych do repo.
- Wydarzenia: wejść w listę/kalendarz, odświeżyć stronę, potwierdzić brak INVALID_API_RESPONSE.
- Kalendarz: sprawdzić dzień/miesiąc, zmianę zakresu, powrót po odświeżeniu i brak skoku do błędnego stanu.
- Relacje: z LeadDetail/ClientDetail/CaseDetail sprawdzić, czy zadania/wydarzenia są widoczne albo czy brak danych jest kontrolowanym pustym stanem.
- Auth/API: przy braku sesji endpoint może dać 401/403, ale musi to być JSON, nie HTML ani source z Vite.
- Query budget: podczas przełączania kalendarza obserwować Network i potwierdzić, że nie ma serii niekontrolowanych retry/polling po Stage213C-B/C.

## Czego nie ruszano

- SQL/RLS/GRANT.
- Google Calendar sync.
- NotificationsCenter.
- TodayStable, poza statycznym skanem zależności.
- Backupy i stare paczki.
- Dane produkcyjne/testowe w Supabase.

## Ryzyka

- Sam statyczny skan nie potwierdza działania runtime ani sesji użytkownika.
- 401/403 JSON jest akceptowalne jako znak, że API żyje, ale nie potwierdza pełnego przepływu zalogowanego operatora.
- Jeżeli endpointy idą przez inny routing niż lista kandydatów, trzeba dopisać wykryty routing w Stage216-B2 albo rozszerzyć smoke.
- Jeżeli kalendarz ma zależność od Google Calendar sync, nie wolno jej zmieniać bez osobnego, wąskiego etapu.

## Werdykt

Status: przygotowano QA/smoke. Nie zamyka migracji Supabase. Następny ruch zależy od runtime smoke i testów ręcznych Damiana.

## Następny krok

1. Apply ZIP lokalnie.
2. Uruchomić generator/check.
3. Uruchomić build.
4. Uruchomić dev:api.
5. Uruchomić runtime smoke.
6. Jeżeli jest 500 albo NON_JSON/VITE source, zrobić Stage216-B2 jako wąski fix pod konkretny błąd.
