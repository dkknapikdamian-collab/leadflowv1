# 2026-06-12_STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT

Data: 2026-06-12 22:10 Europe/Warsaw  
Stage: STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT  
Status: IMPLEMENTED_DOCS_AND_GUARD_PENDING_LOCAL_TESTS  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY Z KODU / PLIKOW

- `App.tsx` route-gates core app pages with `isLoggedIn`.
- `/today` uses `src/pages/TodayStable.tsx`; `src/pages/Today.tsx` is legacy/inactive for active route.
- `/tasks` uses `src/pages/TasksStable.tsx`; `src/pages/Tasks.tsx` exists but is not active in current `App.tsx` route map.
- `/notifications` uses `src/pages/NotificationsCenter.tsx`; `src/pages/Notifications.tsx` was not found.
- `useWorkspace.ts` has admin/app-owner local preview in DEV without Supabase config and creator override feature access.
- `Settings.tsx` gates Google Calendar through `isAdmin || isAppOwner || access.features.googleCalendar` and sends bearer token plus workspace/user headers to `/api/google-calendar`.
- `Settings.tsx` has `DAILY_DIGEST_EMAIL_UI_VISIBLE = false`, so digest UI is hidden even before plan/access logic becomes relevant.
- `plans.ts` includes feature flags for `googleCalendar`, `weeklyReport`, `digest`, `browserNotifications`, `ai`, `fullAi` and other capabilities.
- Matrix file added: `_project/07_STAGE231E_NON_ADMIN_FEATURE_ACCESS_MATRIX.md`.
- Guard added: `scripts/check-stage231e-non-admin-feature-access-map.cjs`.

## DECYZJE DAMIANA

- Wdrażać tylko `STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT`.
- Nie naprawiać jeszcze Google Calendar; kandydaci ida do `STAGE231F`.
- Nie naprawiać jeszcze daily digest / weekly report; kandydaci ida do `STAGE231G`.
- Nie robić mobile redesign; mobile zostaje do `STAGE231H`.
- Nie ruszać SQL, Supabase RLS, dużego refactoru `useWorkspace`, Settings UI ani innych etapów.
- Po etapie wskazać najlepszy następny krok.

## HIPOTEZY / PROPOZYCJE AI

- Największy realny problem po stronie zwykłego konta dotyczy Google Calendar, bo frontend ma plan/admin/owner gate i user/workspace headers, ale backend/multi-user token scope wymaga lokalnego i produkcyjnego testu.
- Digest i weekly report powinny zostać potraktowane razem, bo oba dotyczą delivery, plan-gate, odbiorcy workspace i realnej wysyłki.
- AI/drafts potrzebuje osobnego access/workspace-scope etapu, jeśli ma być twardo gated planem/rolą. W tym etapie nie było bezpieczne mieszać tego z Google Calendar.

## DO POTWIERDZENIA

- Formalne `entity_id`, `workspace_id`, `project_id` dla Obsidian CloseFlow nadal DO_POTWIERDZENIA.
- Lokalny Obsidian vault nie był dostępny przez GitHub connector: `OBSIDIAN_LOCAL_UNAVAILABLE`.
- Nie potwierdzono lokalnie backendowych plików `api/google-calendar*`, `api/daily-digest*`, `api/weekly-report*`, bo GitHub connector nie udostępnił listingów katalogu, a bezpośrednie fetch najczęstszych ścieżek Google Calendar zwróciło MISSING.
- Nie uruchomiono lokalnego builda ani testów node.

## AUDYT PRZED ETAPEM

- stage: `STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT`.
- gdzie Damian zobaczy efekt: w `_project/07_STAGE231E_NON_ADMIN_FEATURE_ACCESS_MATRIX.md`, run report i wyniku guarda.
- realny problem: aplikacja może działać poprawnie na koncie Damiana/admina/app ownera, a inaczej na zwykłym użytkowniku/workspace memberze.
- trasy sprawdzone w routingu: `/settings`, `/calendar`, `/today`, `/tasks`, `/leads`, `/clients`, `/cases`, `/notifications`, `/ai-drafts`.
- podobne miejsca sprawdzone: `isAdmin`, `isAppOwner`, `access.features`, hidden UI flag `DAILY_DIGEST_EMAIL_UI_VISIBLE`, dev-only preview fallbacki, plan features.
- czego nie ruszano: Google Calendar fix, digest fix, weekly report fix, mobile redesign, SQL/RLS, visual tile migration, runtime UI layout.
- guard/test plan: matrix, guard matrix, lokalnie `node scripts/check-stage231e-non-admin-feature-access-map.cjs`, build, Google Calendar tests, `git diff --check`.

## MAPA DOSTEPU

Szczegółowa mapa jest w:

`_project/07_STAGE231E_NON_ADMIN_FEATURE_ACCESS_MATRIX.md`

Werdykty główne:

- `DO_NAPRAWY_W_231F`: Google Calendar status/connect/disconnect/sync-outbound.
- `DO_NAPRAWY_W_231G`: daily digest UI, digest diagnostics/test send, weekly report.
- `DO_NAPRAWY_OSOBNY_ETAP`: AI/drafts access/workspace-scope, jeśli funkcja ma być twardo gated planem/rolą.
- `OK`: core pages i podstawowe ustawienia/notifications w zakresie route/workspace access z tego etapu.

## ZNALEZIONE PROBLEMY

Znalezione problemy: brak nowych poza zakresem już wpisanych etapów.

Nie dopisywano nowego wpisu do `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`, bo wszystkie realne ryzyka zostały przypisane do istniejących etapów:

- Google Calendar -> `STAGE231F`.
- Digest / weekly report -> `STAGE231G`.
- Mobile readability -> `STAGE231H`.
- AI/drafts access/workspace-scope -> osobny przyszły etap, jeśli Damian potwierdzi potrzebę.

## TESTY AUTOMATYCZNE

Nie uruchomiono lokalnie przez GitHub connector:

- `node scripts/check-stage231e-non-admin-feature-access-map.cjs` - SKIP: brak lokalnego runtime.
- `npm run build` - SKIP: brak lokalnego node_modules/runtime.
- `npm run test:google-calendar-gating` - SKIP: brak lokalnego runtime.
- `npm run test:google-calendar-sync-contract` - SKIP: brak lokalnego runtime.
- `git diff --check` - SKIP: brak lokalnego git working tree.

Do uruchomienia lokalnie:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$ErrorActionPreference = "Stop"

git pull
git status --short
node scripts/check-stage231e-non-admin-feature-access-map.cjs
npm run build
npm run test:google-calendar-gating
npm run test:google-calendar-sync-contract
git diff --check
git status --short
```

## TESTY RECZNE

Do wykonania przez Damiana albo developera lokalnie/produkcyjnie:

1. Zwykłe konto nieadminowskie / workspace member loguje się do aplikacji.
2. Sprawdza widoczność i działanie:
   - `/settings`,
   - `/calendar`,
   - `/today`,
   - `/tasks`,
   - `/leads`,
   - `/clients`,
   - `/cases`,
   - `/notifications`,
   - `/ai-drafts`.
3. Dla Google Calendar test ręczny zostaje właściwym wejściem do `STAGE231F`.
4. Dla digest/weekly report test ręczny zostaje właściwym wejściem do `STAGE231G`.

## GUARDY

Dodano:

` scripts/check-stage231e-non-admin-feature-access-map.cjs`

Guard sprawdza:

- istnienie matrixa,
- wpisy dla wszystkich wymaganych funkcji,
- dozwolone werdykty: `OK`, `DO_NAPRAWY_W_231F`, `DO_NAPRAWY_W_231G`, `DO_NAPRAWY_OSOBNY_ETAP`,
- brak niedokończonych markerów typu `TODO`, `???`, `TBD`, `UZUPELNIC`,
- istnienie run reportu,
- obowiązkowe sekcje run reportu,
- obecność `AUDYT PRZED ETAPEM` i `AUDYT PO ETAPIE`.

## AUDYT PO ETAPIE

- co zmieniono: dodano matrix, guard i run report.
- czy przyczyna została naprawiona: etap nie miał naprawiać runtime; przyczyna została zmapowana i skierowana do właściwych następnych etapów.
- czy wykryto funkcje działające tylko na adminie/app ownerze: Google Calendar wymaga `STAGE231F`, bo frontend gate zawiera admin/owner override i plan feature.
- czy Google Calendar wymaga STAGE231F: tak.
- czy digest/weekly report wymaga STAGE231G: tak.
- czy mobile readability wymaga STAGE231H: nie testowano w tym etapie, zostaje zgodnie z kolejką.
- czy znaleziono nowe problemy poza zakresem: nie dopisano nowych, bo wykrycia pasują do istniejącej kolejki.
- co świadomie nie zostało naprawione: runtime Google Calendar, digest, weekly report, AI/drafts gate, mobile UI, SQL/RLS.
- manual test dla Damiana: zwykłe konto/workspace member + lokalny/produkcyjny test wskazanych tras.

## RYZYKA

- Matrix opiera się na statycznym scan repo przez GitHub connector, nie na uruchomionej aplikacji.
- Brak lokalnego directory listing ograniczył potwierdzenie `api/google-calendar*`, `api/daily-digest*`, `api/weekly-report*`.
- Google Calendar może wymagać backend/RLS/token-scope naprawy, której nie wolno było robić w 231E.
- AI/drafts może mieć niewystarczająco twardy access/workspace-scope, ale naprawianie tego teraz rozszerzyłoby etap.
- Digest UI jest schowany flagą; jeżeli funkcja ma być sprzedawana/aktywna, 231G musi podjąć decyzję produktową i techniczną.

## WPLYW NA OBSIDIANA

Status: `OBSIDIAN_LOCAL_UNAVAILABLE`.

Payload do Obsidiana:

- data i godzina: 2026-06-12 22:10 Europe/Warsaw
- nazwa / alias wejściowy: STAGE231E — audyt kont nieadminowskich i dostępności funkcji
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow — DO_POTWIERDZENIA formalne ID
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: wdrożenie etapu mapująco-guardującego
- docelowa ścieżka: 04_KIERUNEK_DO_WDROZENIA, 07_SCIAGA_PLIKOW, 08_HISTORIA_ZMIAN, 09_TESTY_DO_WYKONANIA_I_WYNIKI, 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status zapisu: zapisane w repo `_project`; Obsidian lokalny do synchronizacji
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: lokalne uruchomienie wymagane
- audyt ryzyk po etapie: Google Calendar -> 231F; digest/weekly -> 231G; AI/drafts -> osobny etap jeśli potwierdzone
- czego nie ruszano: runtime UI, SQL, RLS, Google Calendar backend, digest backend, mobile UI
- następny krok: STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX

## NASTEPNY KROK

`STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX`

Cel: sprawdzić i naprawić Google Calendar na zwykłym koncie / workspace memberze, nie tylko na koncie Damiana/admina/app ownera.

## GIT / ZIP STATUS

- ZIP: nie tworzono.
- GitHub connector commits: matrix, guard, run report.
- Package script: nie zmieniono `package.json`, bo connector wymaga pełnej wymiany pliku, a plik ma bardzo długi scripts block. Lokalnie można dodać alias:

```json
"check:stage231e-non-admin-feature-access": "node scripts/check-stage231e-non-admin-feature-access-map.cjs"
```

- Stage status: IMPLEMENTED_DOCS_AND_GUARD_PENDING_LOCAL_TESTS.
