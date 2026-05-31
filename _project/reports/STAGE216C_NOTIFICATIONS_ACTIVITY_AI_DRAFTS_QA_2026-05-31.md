---
typ: project_report
stage: STAGE216C
status: prepared_qa_smoke
project: CloseFlow / LeadFlow
date: 2026-05-31
---

# STAGE216-C - Notifications / Activity / AI drafts QA + runtime smoke

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

Stage216-C nie naprawia wszystkiego naraz. To bramka diagnostyczna dla trzeciego rdzenia operacyjnego po migracji Supabase: powiadomienia, aktywność oraz szkice AI.

Po Stage216-B tasks/events/calendar mają kontrolowany JSON smoke. Teraz sprawdzamy, czy Activity i AI Drafts działają jako JSON/auth controlled paths, a NotificationsCenter nie wraca do kosztownego pollingu po Stage213C-A.

## Wynik skanu lokalnego

- scanned_at: 2026-05-31T21:50:01.053Z
- cwd: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- expected files: 19
- existing files: 17
- missing files: 2
- fetch() markers: 2
- useEffect() markers: 16
- setInterval() markers: 3
- callApi() markers: 76
- Supabase .from() markers: 9

## Mapa plików

| Plik | Status | Linie | fetch | useEffect | setInterval | callApi | supabase .from | Markery |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| package.json | OK | 836 | 0 | 0 | 0 | 0 | 0 | notifications refresh budget; invalid api response guard clue; manual qa relation clue |
| vercel.json | OK | 210 | 0 | 0 | 0 | 0 | 0 | - |
| src/lib/supabase-fallback.ts | OK | 730 | 1 | 0 | 0 | 76 | 0 | api activities route; api ai-drafts route; ai draft creates task/event/lead/note; activity relation mapping; supabase normalizer; invalid api response guard clue; manual qa relation clue |
| src/lib/notifications.ts | OK | 209 | 0 | 0 | 0 | 0 | 0 | notifications local log/read/snooze; invalid api response guard clue |
| src/lib/ai-drafts.ts | OK | 588 | 0 | 0 | 0 | 0 | 0 | api ai-drafts route; ai draft approval flow; ai draft creates task/event/lead/note; supabase normalizer; invalid api response guard clue |
| src/lib/ai-draft-approval.ts | OK | 178 | 0 | 0 | 0 | 0 | 0 | ai draft approval flow; activity relation mapping; supabase normalizer; invalid api response guard clue; manual qa relation clue |
| src/lib/ai-draft-confirm-records.ts | OK | 62 | 0 | 0 | 0 | 0 | 0 | ai draft creates task/event/lead/note; activity relation mapping; invalid api response guard clue; manual qa relation clue |
| src/lib/data-contract.ts | OK | 819 | 0 | 0 | 0 | 0 | 0 | ai draft creates task/event/lead/note; activity relation mapping; supabase normalizer; invalid api response guard clue; manual qa relation clue |
| api/activities.ts | OK | 184 | 0 | 0 | 0 | 0 | 0 | activity relation mapping; supabase normalizer; invalid api response guard clue; auth/workspace guard clue; manual qa relation clue |
| api/system.ts | OK | 1021 | 0 | 0 | 0 | 0 | 0 | invalid api response guard clue; auth/workspace guard clue |
| src/pages/NotificationsCenter.tsx | OK | 847 | 0 | 3 | 2 | 0 | 1 | notifications refresh budget; notifications local log/read/snooze; invalid api response guard clue; auth/workspace guard clue; manual qa relation clue |
| src/pages/Activity.tsx | OK | 900 | 0 | 1 | 0 | 0 | 0 | api activities route; activity relation mapping; invalid api response guard clue; auth/workspace guard clue; manual qa relation clue |
| src/pages/AiDrafts.tsx | OK | 1221 | 0 | 2 | 0 | 0 | 0 | api activities route; ai draft approval flow; ai draft creates task/event/lead/note; activity relation mapping; supabase normalizer; invalid api response guard clue; auth/workspace guard clue; manual qa relation clue |
| src/pages/TodayStable.tsx | OK | 1774 | 0 | 9 | 0 | 0 | 7 | notifications refresh budget; activity relation mapping; invalid api response guard clue; manual qa relation clue |
| _project/reports/STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_2026-05-31.md | MISSING | 0 | 0 | 0 | 0 | 0 | 0 | - |
| _project/reports/STAGE213C_B_CALENDAR_RETRY_POLICY_2026-05-31.md | OK | 82 | 0 | 0 | 0 | 0 | 0 | notifications refresh budget; invalid api response guard clue |
| _project/reports/STAGE213C_C_TODAY_STABLE_FOCUS_VISIBILITY_THROTTLE_2026-05-31.md | MISSING | 0 | 0 | 0 | 0 | 0 | 0 | - |
| _project/reports/STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.md | OK | 166 | 1 | 1 | 1 | 0 | 1 | notifications refresh budget; invalid api response guard clue; manual qa relation clue |
| _project/reports/STAGE216B_TASKS_EVENTS_CALENDAR_RUNTIME_SMOKE_RESULT_2026-05-31.md | OK | 42 | 0 | 0 | 0 | 0 | 0 | invalid api response guard clue |

## Podsumowanie markerów

- invalid api response guard clue: 16
- manual qa relation clue: 11
- activity relation mapping: 8
- supabase normalizer: 6
- ai draft creates task/event/lead/note: 5
- auth/workspace guard clue: 5
- notifications refresh budget: 5
- ai draft approval flow: 3
- api activities route: 3
- api ai-drafts route: 2
- notifications local log/read/snooze: 2

## Braki do potwierdzenia

- _project/reports/STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_2026-05-31.md
- _project/reports/STAGE213C_C_TODAY_STABLE_FOCUS_VISIBILITY_THROTTLE_2026-05-31.md

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
node tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs --write
```

Akceptowalne wyniki runtime bez pełnego auth:

- AUTH_REQUIRED_401 lub AUTH_REQUIRED_403 jako JSON,
- 200 JSON dla endpointów publicznie czytelnych w kontekście testowym,
- 400 JSON, jeżeli endpoint wymaga parametru i jasno to komunikuje.

Twardy FAIL:

- 500,
- HTML zamiast JSON,
- Vite/source response,
- FETCH_FAILED przy działającym dev API,
- cichy pusty wynik bez kontrolowanego statusu, jeżeli endpoint powinien zgłosić auth albo walidację.

## Manual QA

1. Otwórz Powiadomienia. Sprawdź, czy lista ładuje się bez INVALID_API_RESPONSE i bez ciągłego pełnego odświeżania co 60 sekund.
2. Sprawdź filtry: Wszystkie, Do reakcji, Zaległe, Dzisiaj, Nadchodzące, Odłożone, Przeczytane.
3. Oznacz powiadomienie jako przeczytane, odłóż i przywróć. Sprawdź, czy widok nie robi request stormu.
4. Otwórz Aktywność. Sprawdź, czy lista pokazuje wpisy albo kontrolowany pusty stan bez 500.
5. Sprawdź relacje aktywności: lead, klient, sprawa, zadanie, wydarzenie.
6. Otwórz Szkice AI. Sprawdź ładowanie szkiców, filtry, wyszukiwarkę i pusty stan.
7. Jeżeli masz szkic testowy, otwórz zatwierdzanie jako lead/task/event/note, ale nie zapisuj produkcyjnych danych bez decyzji.
8. Po hard refresh na Powiadomieniach/Aktywności/Szkicach AI nie może być INVALID_API_RESPONSE ani HTML source.

## Czego nie ruszano

- database policy changes,
- Google Calendar sync,
- realne dane runtime,
- backupy lokalne,
- moduły spoza Notifications/Activity/AiDrafts,
- naprawy funkcjonalne bez konkretnego FAIL-a.

## Następny krok

Jeżeli Stage216-C przejdzie: Stage216-D Portal / Storage / Uploads QA. Jeżeli smoke znajdzie konkretny FAIL: Stage216-C2 jako wąski fix pod wskazany endpoint albo komponent.
