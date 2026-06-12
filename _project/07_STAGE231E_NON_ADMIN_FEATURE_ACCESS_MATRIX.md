# 07_STAGE231E_NON_ADMIN_FEATURE_ACCESS_MATRIX - CloseFlow / LeadFlow

Data: 2026-06-12 22:10 Europe/Warsaw  
Status: ACTIVE_STAGE231E_ACCESS_MATRIX  
Stage: STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App  

## Cel

Mapa pokazuje, czy funkcje aplikacji sa dostepne dla zwyklego uzytkownika / czlonka workspace, a nie tylko dla Damiana, admina albo app ownera.

To jest etap audytowo-mapujacy. Nie naprawia jeszcze Google Calendar, daily digest, weekly report, AI/drafts ani mobile readability.

## Werdykty dopuszczalne

- `OK` - dostep dla zwyklego zalogowanego uzytkownika / czlonka workspace jest zgodny z aktualnym kontraktem albo nie ma dowodu na admin-only blokade w zakresie tego etapu.
- `DO_NAPRAWY_W_231F` - przeniesc do STAGE231F Google Calendar multi-user sync audit/fix.
- `DO_NAPRAWY_W_231G` - przeniesc do STAGE231G daily digest / weekly report access delivery audit.
- `DO_NAPRAWY_OSOBNY_ETAP` - problem poza 231F/231G, wymaga osobnego etapu.

## Zrodla przeczytane

- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`
- `_project/07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW.md`
- `_project/STAGE_TEMPLATE_MINIMAL.md`
- `package.json`
- `src/App.tsx`
- `src/hooks/useWorkspace.ts`
- `src/lib/plans.ts`
- `src/lib/access.ts`
- `src/lib/supabase-fallback.ts`
- `src/pages/Settings.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/Today.tsx`
- `src/pages/TodayStable.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/TasksStable.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/AiDrafts.tsx`

## Pliki nieznalezione / zastepstwa

- `src/pages/Notifications.tsx` - MISSING. Realny route `/notifications` uzywa `src/pages/NotificationsCenter.tsx`.
- `api/google-calendar.ts` i `api/google-calendar.js` - MISSING przez GitHub fetch. Frontend wywoluje `/api/google-calendar?route=...`, ale plik backendu wymaga lokalnego scan/fetch po strukturze repo.
- `api/daily-digest*` i `api/weekly-report*` - niepotwierdzone przez connector search. Frontend ma wywolania `/api/daily-digest`; weekly report wymaga osobnego potwierdzenia w STAGE231G.

## Matrix dostepnosci

| Funkcja | Ekran / trasa | Pliki | Aktualny gate | Dostep docelowy | Zwykly uzytkownik | Backend / headers | Werdykt | Dowod |
|---|---|---|---|---|---|---|---|---|
| Google Calendar status | `/settings` | `src/pages/Settings.tsx` | `isAdmin || isAppOwner || access.features.googleCalendar` | Uzytkownik z planem/funkcja Google Calendar | Widzi sekcje tylko przy plan/admin/owner gate | Request do `/api/google-calendar?route=status` z bearer token, `x-workspace-id`, `x-user-id`, `x-user-email` | DO_NAPRAWY_W_231F | Frontend ma dobry kierunek user/workspace headers, ale multi-user backend i zwykle konto wymagaja testu produkcyjnego. |
| Google Calendar connect | `/settings` | `src/pages/Settings.tsx` | `isAdmin || isAppOwner || access.features.googleCalendar` | Uzytkownik z planem/funkcja Google Calendar | Connect dostepny tylko przy gate | POST `/api/google-calendar?route=connect` z tokenem i workspace/user headers | DO_NAPRAWY_W_231F | OAuth musi byc sprawdzony na zwyklym userze, nie tylko owner/admin. |
| Google Calendar disconnect | `/settings` | `src/pages/Settings.tsx` | `isAdmin || isAppOwner || access.features.googleCalendar` | Uzytkownik z planem/funkcja Google Calendar | Disconnect dostepny tylko przy gate | POST `/api/google-calendar?route=disconnect` z tokenem i workspace/user headers | DO_NAPRAWY_W_231F | Ryzyko: token/konto moze byc user-scoped albo workspace-scoped niezgodnie z oczekiwaniem. |
| Google Calendar sync-outbound | `/settings` | `src/pages/Settings.tsx` | `isAdmin || isAppOwner || access.features.googleCalendar` | Uzytkownik z planem/funkcja Google Calendar | Sync outbound dostepny tylko przy gate | POST `/api/google-calendar?route=sync-outbound` z tokenem i workspace/user headers | DO_NAPRAWY_W_231F | To jest dokladnie zakres nastepnego etapu. |
| Calendar page | `/calendar` | `src/App.tsx`, `src/pages/Calendar.tsx` | Route wymaga `isLoggedIn`; strona uzywa workspace/loading/hasAccess | Kazdy zalogowany czlonek workspace z dostepem do aplikacji | Powinien widziec kalendarz aplikacji | Dane ida przez Supabase helpers; inbound Google wymaga osobnego sprawdzenia | OK | Brak admin-only gate w route; Google Calendar sync to osobny STAGE231F. |
| Today page | `/today`, `/` | `src/App.tsx`, `src/pages/TodayStable.tsx`; `src/pages/Today.tsx` legacy inactive | Route wymaga `isLoggedIn`; aktywny route to `TodayStable` | Kazdy zalogowany czlonek workspace | Powinien widziec dashboard operacyjny | Odczyt: tasks/leads/events/cases/ai drafts przez helpers | OK | App.tsx wskazuje TodayStable jako realny route; stary Today.tsx jest legacy/inactive. |
| Tasks | `/tasks` | `src/App.tsx`, `src/pages/TasksStable.tsx`; `src/pages/Tasks.tsx` legacy/nieaktywny route | Route wymaga `isLoggedIn`; zapisy sprawdzaja `hasAccess` i `workspaceId` | Kazdy zalogowany czlonek workspace z aktywnym dostepem | Widzi i wykonuje zadania przy workspace context | Insert/update uzywa workspaceId; delete wymaga dalszego backend/RLS potwierdzenia | OK | Nie znaleziono admin-only gate dla zwyklego obslugiwania zadan. |
| Leads | `/leads` | `src/App.tsx`, `src/pages/Leads.tsx` | Route wymaga `isLoggedIn`; create/archive sprawdzaja `hasAccess` i `workspaceId` | Kazdy zalogowany czlonek workspace z aktywnym dostepem | Moze widziec/dodac leady przy workspace context | Create zapisuje `ownerId` i `workspaceId`; conflict preflight wymaga workspaceId | OK | Brak admin-only gate w UI dla podstawowych leadow. |
| Clients | `/clients` | `src/App.tsx`, `src/pages/Clients.tsx` | Route wymaga `isLoggedIn`; create/archive/restore sprawdzaja `hasAccess` i `workspaceId` | Kazdy zalogowany czlonek workspace z aktywnym dostepem | Moze widziec/dodac klientow przy workspace context | Create zapisuje `workspaceId`; conflict preflight wymaga workspaceId | OK | Brak admin-only gate w UI dla podstawowych klientow. |
| Cases | `/cases`, `/cases/:caseId`, `/case/:caseId` | `src/App.tsx`, `src/pages/Cases.tsx`, `src/pages/CaseDetail.tsx` | Route wymaga `isLoggedIn`; create sprawdza `hasAccess` i `workspaceId` | Kazdy zalogowany czlonek workspace z aktywnym dostepem | Moze widziec/dodac sprawy przy workspace context | Create zapisuje `workspaceId`; detail nie byl pelnym zakresem tego etapu | OK | Brak admin-only gate w listingu spraw; CaseDetail pelna autoryzacja/RLS zostaje poza tym etapem. |
| Notifications | `/notifications` | `src/App.tsx`, `src/pages/NotificationsCenter.tsx` | Route wymaga `isLoggedIn`; strona wymaga workspace.id | Kazdy zalogowany czlonek workspace | Widzi centrum powiadomien przy workspace context | Bundle z `fetchCalendarBundleFromSupabase`; browser actions lokalne | OK | Realny plik to NotificationsCenter.tsx, nie Notifications.tsx. |
| Settings account/security | `/settings` | `src/App.tsx`, `src/pages/Settings.tsx` | Route wymaga `isLoggedIn`; czesc opcji zalezy od workspace/access | Kazdy zalogowany czlonek workspace | Powinien widziec podstawowe ustawienia konta i bezpieczenstwa | Profil/access przychodza z `fetchMeFromSupabase` i `useWorkspace` | OK | Brak dowodu na admin-only blokade podstawowych ustawien. |
| Settings notifications | `/settings` | `src/pages/Settings.tsx` | Route wymaga `isLoggedIn`; digest ma osobny hidden flag | Kazdy czlonek workspace dla ustawien lokalnych; funkcje platne wg planu | Ustawienia powiadomien i przegladarki sa widoczne; digest ukryty | Browser notifications lokalne; digest przez API tylko przy hidden+plan gate | OK | Podstawowe ustawienia notyfikacji nie sa admin-only; digest osobno. |
| Daily digest UI | `/settings` | `src/pages/Settings.tsx` | `DAILY_DIGEST_EMAIL_UI_VISIBLE = false` oraz plan/admin/owner gate | Jesli funkcja ma byc aktywna: uprawniony workspace/user z planem | Aktualnie UI digestu jest ukryte nawet przy plan gate | Nie dotyczy, bo UI schowane | DO_NAPRAWY_W_231G | To nie jest blad do naprawy w 231E; wymaga decyzji czy digest ma byc produkcyjny. |
| Daily digest diagnostics/test send | `/settings` | `src/pages/Settings.tsx` | Schowane za `digestUiVisibleByPlan`; API `/api/daily-digest` | Jesli aktywne: uprawniony workspace/user z planem i odbiorca workspace | Aktualnie niedostepne, jesli flag false | POST `/api/daily-digest` z `action`, `workspaceId`, `userId`, `userEmail` | DO_NAPRAWY_W_231G | Backend/test send wymaga osobnego audytu dostawy. |
| Weekly report | Niepotwierdzony ekran/UI | `src/lib/plans.ts`, package scripts/search do potwierdzenia | Plan feature `weeklyReport` istnieje, UI/backend niepotwierdzone w scan | Jesli aktywne: uprawniony workspace/user z planem | Niepotwierdzone w UI | Niepotwierdzone endpointy/harmonogram | DO_NAPRAWY_W_231G | Funkcja jest w modelu planow, ale delivery/UI wymaga osobnego etapu. |
| AI/drafts | `/ai-drafts`, kafel w `/today` | `src/App.tsx`, `src/pages/AiDrafts.tsx`, `src/pages/TodayStable.tsx` | Route wymaga `isLoggedIn`; page ma kopie plan gate, ale w skanie nie potwierdzono twardego access gate | Docelowo wg planu AI/Basic zgodnie z decyzja produktu | Zwykly user zalogowany moze wejsc w route; zakres plan/role wymaga osobnego potwierdzenia | Draft helpers i Supabase writes; nie wszystkie payloady pokazuja workspaceId w skanowanym fragmencie | DO_NAPRAWY_OSOBNY_ETAP | Potrzebny osobny etap AI Drafts access/workspace-scope, jesli AI Drafts ma byc role/plan gated. |
| Browser notifications | `/settings`, `/notifications` | `src/pages/Settings.tsx`, `src/pages/NotificationsCenter.tsx`, `src/lib/plans.ts` | Browser permission + lokalne ustawienie; plan feature istnieje w `plans.ts` | Kazdy uprawniony user wedlug planu/ustawien przegladarki | Moze wlaczyc permission, o ile przegladarka pozwoli | Lokalny browser permission, log/local settings | OK | To nie jest admin-only; ryzyko plan-gate copy zostaje do osobnej polityki produktowej. |
| Conflict warnings | `/settings`, `/notifications`, record flows | `src/pages/Settings.tsx`, `src/pages/NotificationsCenter.tsx`, `src/lib/notifications.ts` | Lokalne ustawienia/ostrzezenia; brak admin-only gate w zakresie skanu | Kazdy user workspace powinien widziec ostrzezenia dotyczace swoich operacji | Dostepne jako lokalne ustawienie i runtime notification rows | Lokalnie + bundle danych workspace | OK | Brak dowodu, ze zwykly user jest zablokowany przez admin/owner gate. |

## Wnioski

1. Core screens (`/today`, `/calendar`, `/tasks`, `/leads`, `/clients`, `/cases`, `/notifications`, `/settings`) sa route-gated przez logowanie, a nie przez admin-only gate.
2. Najwieksze realne ryzyko nieadminowskie dotyczy Google Calendar, bo frontend juz rozroznia plan/admin/owner i wysyla user/workspace headers, ale efekt na zwyklym koncie wymaga STAGE231F.
3. Digest i weekly report sa produkcyjnie niejasne: digest UI jest twardo schowany flaga `DAILY_DIGEST_EMAIL_UI_VISIBLE = false`, weekly report jest feature w planach, ale UI/delivery wymaga osobnego audytu.
4. AI/drafts jest dostepne jako zalogowana trasa i ma funkcje zapisu/konwersji. Jeżeli ma byc ograniczane planem/rola, potrzebny jest osobny etap access/workspace-scope.

## Nastepny etap

`STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX`
