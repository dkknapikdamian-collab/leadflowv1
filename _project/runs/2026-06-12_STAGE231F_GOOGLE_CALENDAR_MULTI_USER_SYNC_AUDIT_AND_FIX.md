# 2026-06-12 STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX

Data: 2026-06-12 23:45 Europe/Warsaw  
Status: WDROZONE_BACKEND_USER_SCOPE_DO_LOKALNEGO_PASS  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY Z KODU / PLIKOW

Przeczytano i sprawdzono:

- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`
- `_project/07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW.md`
- `_project/04_STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_PLAN.md`
- `package.json`
- `src/pages/Settings.tsx`
- `src/pages/Calendar.tsx`
- `src/lib/calendar-items.ts`
- `src/lib/plans.ts`
- `src/lib/access.ts`
- `src/server/google-calendar-handler.ts`
- `src/server/google-calendar-sync.ts`
- `src/server/google-calendar-inbound.ts`
- `src/server/google-calendar-outbound.ts`
- `tests/google-calendar-gating.test.cjs`
- `tests/google-calendar-sync-contract.test.cjs`

Fakty:

- Centralna konfiguracja aplikacji Google jest po stronie CloseFlow.
- OAuth state zawiera `workspaceId` i `userId`.
- Przed tym etapem glowne pobranie polaczenia Google Calendar mialo fallback z polaczenia usera na polaczenie workspace.
- Ten fallback mogl maskowac brak polaczenia konkretnego usera.
- `Settings.tsx` ma plan gate dla Google Calendar oraz funkcje status/connect/disconnect/sync.

## DECYZJE DAMIANA

- Uzytkownik koncowy nie konfiguruje Google Cloud.
- Kazdy uzytkownik autoryzuje dostep do swojego kalendarza.
- Autoryzacja Damiana nie moze dzialac jako cichy fallback dla innego usera.
- Sync ma byc per `workspaceId + userId`.

## HIPOTEZY / PROPOZYCJE AI

- Najbardziej prawdopodobna przyczyna problemu znajomego: brak wlasnego polaczenia Google Calendar albo plan gate.
- Dodatkowe ryzyko: UI w Settings moze nie renderowac wyraznie connect button po wczesniejszych przebudowach. To wymaga testu lokalnego.

## DO POTWIERDZENIA

- Czy konto znajomego ma plan z Google Calendar albo admin/app-owner override.
- Czy w produkcyjnym UI Settings widoczny jest connect flow.
- Czy po powrocie z Google status pokazuje konto usera.

## AUDYT PRZED ETAPEM

Problem: Google Calendar dzialal u Damiana, ale nie dzialal u zwyklego usera.

Ryzyko przed etapem:

- zwykly user mogl nie miec wlasnego polaczenia,
- backend mogl uzyc polaczenia workspace,
- status mogl pokazac wynik mylacy dla usera,
- plan gate mogl ukryc funkcje.

Zakres:

- status,
- connect,
- disconnect,
- sync-inbound,
- sync-outbound,
- user/workspace scope,
- guard i test user-scope.

Czego nie ruszano:

- SQL/RLS,
- realna konfiguracja produkcyjna,
- digest,
- weekly report,
- AI Drafts,
- mobile readability,
- Visual Tile Wave,
- platnosci.

## CO ZMIENIONO

Dodano:

- `src/server/google-calendar-user-scope.ts`
- `scripts/check-stage231f-google-calendar-user-scope.cjs`
- `tests/stage231f-google-calendar-user-scope.test.cjs`

Zmieniono:

- `src/server/google-calendar-handler.ts`

Nowe zachowanie backendu:

- status sprawdza najpierw dokladne polaczenie `workspaceId + userId`,
- legacy workspace connection jest raportowane jako osobny stan, ale nie oznacza `connected:true` dla aktualnego usera,
- sync-inbound i sync-outbound zatrzymuja sie przed sync, gdy aktualny user nie ma wlasnego polaczenia,
- callback zapisuje polaczenie pod zweryfikowanym `workspaceId + userId`,
- reuse danych polaczenia odbywa sie tylko dla tego samego usera w tym samym workspace.

## TESTY AUTOMATYCZNE

Nie uruchomiono lokalnie przez GitHub connector. Wymagany lokalny run.

Do uruchomienia:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$ErrorActionPreference = "Stop"

git pull
git status --short
node scripts/check-stage231f-google-calendar-user-scope.cjs
node --test tests/stage231f-google-calendar-user-scope.test.cjs
npm run test:google-calendar-gating
npm run test:google-calendar-sync-contract
node scripts/check-google-calendar-sync-v1-foundation.cjs
npm run build
git diff --check
git status --short
```

## GUARDY

Dodano guard:

- `scripts/check-stage231f-google-calendar-user-scope.cjs`

Guard sprawdza:

- helper user-scope istnieje,
- status nie uznaje legacy workspace connection za polaczenie aktualnego usera,
- sync bez polaczenia usera zwraca jasny brak polaczenia,
- OAuth state nadal zawiera `workspaceId + userId`,
- plan gate Google Calendar nadal jest zgodny z planami.

## TESTY RECZNE

Status: TEST RECZNY DO WYKONANIA.

Scenariusze:

1. Damian/admin: dotychczasowy sync dalej dziala.
2. Zwykly user bez planu Calendar: widzi jasny blocked state albo brak martwego przycisku; nic nie trafia do kalendarza Damiana.
3. Zwykly user z planem Calendar: laczy wlasne konto, status pokazuje `connectionScope=user`, sync dotyczy jego kalendarza.
4. Zwykly user bez wlasnego polaczenia: status/sync zwraca `connected:false`, `reason=user_not_connected`.

## AUDYT PO ETAPIE

Co poprawiono:

- Zamknieto glowne ryzyko backendowe: cichy fallback workspace nie jest juz normalna sciezka status/sync dla zwyklego usera przez API handler.

Co moze wymagac R2:

- Jezeli lokalny test pokaze, ze Settings nie renderuje connect buttona mimo istnienia handlera, trzeba zrobic maly etap `STAGE231F_R2_SETTINGS_CONNECT_RENDER_REPAIR`.

Czego nie ruszono:

- SQL/RLS,
- duza przebudowa Settings UI,
- direct internal fallback w `getGoogleCalendarConnection`; user-facing handler ma preflight user-scope.

## ZNALEZIONE PROBLEMY

- Brak nowych faktow do ledger poza zakresem.
- Do potwierdzenia po UI test: czy connect button jest renderowany w Settings.

## BRAKI I RYZYKA

- Brak lokalnego PASS.
- Brak testu manualnego na koncie zwyklego usera.
- Stare workspace connection moze teraz pokazac `workspace_legacy`, a zwykly user bedzie musial polaczyc swoje konto. To jest celowe bezpieczenstwo.

## WPLYW NA OBSIDIANA

Obsidian lokalny niedostepny z GitHub connector. Payload do synchronizacji:

- data i godzina: 2026-06-12 23:45 Europe/Warsaw
- stage: STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX
- status: WDROZONE_BACKEND_USER_SCOPE_DO_LOKALNEGO_PASS
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- ryzyko: UI connect render DO_POTWIERDZENIA
- nastepny krok: lokalne testy i ewentualny R2 tylko dla Settings UI connect

## NASTEPNY KROK

Uruchomic lokalne testy. Jesli guard/build przejda i UI connect jest widoczny, przejsc do manualnego testu konta zwyklego usera. Jesli UI nie pokazuje connect flow, wdrozyc maly etap R2 tylko dla Settings UI.

## GIT / ZIP STATUS

Zapisano przez GitHub connector na branchu `dev-rollout-freeze`.

Commity etapu:

- `6dc58037bf21fb77744e3c48fead6ecac3bb1b8e`
- `04e76da431153d2514c9322349e1316b2bd15690`
- `694766bd6562c1824850eb85501d51709281f6d8`
- `5786e59e02df0cb146610f9db7fc9c9509ecf3ad`
- `2bc81fbcbae888c14493625d8c0a2a1c63e7014e`
- `aec3dcaeff550d98859ee961d6f96a3a96f28da4`
