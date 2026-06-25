# STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP_PRIORITY

Data/czas: 2026-06-25 12:45 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT

## Decyzja Damiana

Po naprawie STAGE232G_R2 Google inbound idempotency Damian potwierdzil, ze na jego koncie synchronizacja Google Calendar dziala dobrze, ale na innym koncie karta Google Calendar pokazuje martwy stan: widac tylko nieaktywny przycisk synchronizacji, uzytkownik nie moze polaczyc konta Google Calendar, a wpisy nie pojawiaja sie w kalendarzu Google.

To ma byc naprawione jako nastepny priorytetowy etap.

## Diagnoza z kodu

Sprawdzone pliki:

- `src/pages/Settings.tsx`
- `src/pages/Login.tsx`
- `src/lib/supabase-auth.ts`
- `src/server/google-calendar-sync.ts`
- `src/server/google-calendar-user-scope.ts`
- `src/server/google-calendar-outbound.ts`
- `src/server/task-route-stage124f.ts`
- `src/server/event-route-stage124f.ts`
- `vercel.json`

Fakty:

1. `Settings.tsx` ma funkcje `handleConnectGoogleCalendar()`, ktora wywoluje `/api/google-calendar?route=connect` i przekierowuje do `data.authUrl`.
2. Widoczny blok UI pokazuje przycisk `Synchronizuj teraz`, ale ten przycisk jest disabled, gdy `googleCalendarConnected` jest false. Uzytkownik bez polaczenia widzi martwy przycisk zamiast jasnego CTA `Polacz Google Calendar`.
3. Logowanie/rejestracja przez Google w Supabase Auth nie jest tym samym co Calendar OAuth. `signInWithGoogle()` loguje przez Google z `prompt=select_account`, ale nie prosi o scope Calendar.
4. Calendar OAuth jest osobnym flow w `google-calendar-sync.ts`, ze scope `openid`, `email`, `https://www.googleapis.com/auth/calendar.events`, `access_type=offline`, `prompt=consent`.
5. To osobne Calendar OAuth jest poprawne produktowo i bezpieczne. Nie wolno cicho podpinac kalendarza bez zgody Google consent.
6. Outbound sync uzywa user-scoped connection przez `getGoogleCalendarUserConnection(workspaceId, userId)` i fail-closed: bez polaczenia zwraca `connected:false` / `user_not_connected`.
7. Outbound sync nie wypycha calego workspace do prywatnego kalendarza. Sprawdza personal scope na wierszu i pomija rekordy bez dopasowania user id.
8. Przy tworzeniu taska/eventu backend wpisuje obecnie `created_by_user_id: null`, przez co nowe wpisy moga nie przejsc filtra personal-scope i nie trafic do kalendarza Google uzytkownika.

## Docelowy produktowy przeplyw

### Uzytkownik loguje/rejestruje sie przez Google

1. Uzytkownik loguje/rejestruje sie przez Google.
2. Aplikacja widzi, ze provider auth to Google, ale brak user-scoped Google Calendar connection.
3. Settings / onboarding pokazuje karte: `Dokoncz polaczenie Google Calendar`.
4. CTA: `Polacz kalendarz`.
5. Klik uruchamia Calendar OAuth consent.
6. Po callbacku polaczenie zapisuje sie per `workspace_id + user_id`.
7. Uzytkownik widzi: `Polaczono: google_account_email`, `Synchronizuj teraz`, `Rozlacz`.

### Uzytkownik loguje sie e-mail + haslo

1. Uzytkownik loguje sie haslem.
2. W ustawieniach widzi przycisk `Polacz Google Calendar`.
3. Klik uruchamia Calendar OAuth consent.
4. Po callbacku polaczenie zapisuje sie per `workspace_id + user_id`.

## Twarde zasady

- Nie laczyc cicho Calendar bez Google consent.
- Nie prosic uzytkownika o wpisanie e-maila Google recznie.
- Konto Google Calendar musi byc potwierdzone przez Google OAuth.
- Nie wypychac calego workspace do prywatnego kalendarza zwyklego uzytkownika.
- Outbound fail-closed zostaje.
- User-scoped connection zostaje.
- Workspace fallback token nie moze byc uzywany dla zwyklego uzytkownika.

## Zakres wdrozenia R3

1. Settings UI:
   - pokazac CTA `Polacz Google Calendar`, gdy `googleCalendarConnected === false`;
   - pokazac czytelny stan `Nie polaczono` / `Polaczono: google_account_email`;
   - pokazac przycisk `Rozlacz`, gdy polaczone;
   - `Synchronizuj teraz` ma byc aktywne dopiero po polaczeniu;
   - martwy disabled button bez instrukcji ma zniknac.

2. Google login/register onboarding:
   - po Google auth, jesli brak Calendar connection, pokazac w Settings albo w pierwszym ekranie integracji karte `Dokoncz polaczenie kalendarza`;
   - nie robic silent auto-connect bez Calendar OAuth consent.

3. Task/event ownership stamp:
   - przy POST taska/eventu zapisac user identity z requestu na polach typu `user_id`, `owner_user_id`, `created_by_user_id` tam, gdzie schema pozwala;
   - jesli schema nie ma czesci kolumn, uzyc safe/variant path albo ograniczyc do kolumn potwierdzonych w runtime;
   - nowe wpisy tego uzytkownika maja przechodzic personal-scope outbound sync.

4. Guard/test:
   - Settings musi miec connect button dla disconnected user;
   - sync button nie moze byc jedyna akcja dla disconnected user;
   - task/event POST musi stampowac user id;
   - outbound fail-closed musi pozostac;
   - Calendar OAuth consent musi pozostac osobny od Supabase Auth Google login.

## Manual smoke Damiana

1. Wejdz na konto bez Google Calendar connection.
2. Otworz Ustawienia -> Integracje.
3. Musi byc widoczny przycisk `Polacz Google Calendar`.
4. Klik -> ma otworzyc Google consent.
5. Po zatwierdzeniu ma wrocic do aplikacji i pokazac `Polaczono: <google email>`.
6. Utworz nowe zadanie z terminem.
7. Klik `Synchronizuj teraz`.
8. Zadanie ma pojawic sie w Google Calendar tego uzytkownika.
9. Uruchom sync drugi raz: bez duplikatu.
10. Rozlacz Google Calendar: sync ma byc zablokowany, ale aplikacja nadal dziala.
11. Konto email+haslo: musi moc przejsc taki sam flow przez przycisk `Polacz Google Calendar`.

## Granice etapu

Nie ruszac:

- finansow/prowizji,
- billing/trial,
- AI Drafts,
- Braki/Blokady,
- Owner Control poza ewentualnym zachowaniem routing/gating,
- SQL/RLS bez oddzielnej decyzji,
- globalnej przebudowy Settings poza sekcja Integracje.

## Status R2 / zaleznosc

STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY jest pushed green po hotfixie mojibake:

- main R2 commit: `6f81a85b fix(closeflow): make google calendar inbound sync idempotent`
- hotfix commit: `cc3553c4 fix(closeflow): repair google inbound mojibake guard`

R3 startuje po R2 jako osobny etap produktowo-runtime.

## Ryzyka

- Jesli task/event create nadal nie zapisze user identity, sync bedzie zwracal `personalScopeSkipped` i wpisy nie wyjda do Google.
- Jesli UI bedzie pokazywac tylko `Synchronizuj teraz`, disconnected user nadal utknie.
- Jesli ktos sprobuje wykorzystac Google login token jako Calendar token, naruszy model zgody i prawdopodobnie runtime nie bedzie mial refresh tokena Calendar.
- Jesli odblokujemy workspace fallback dla zwyklego uzytkownika, mozemy wypchnac cudze wpisy do prywatnego kalendarza.

## Następny krok

Wdrozyc R3 jako najblizszy etap naprawczy, scan-first, z guardami i testem. Nie zaczynac od nowa Google Calendar R2. Naprawiac onboarding/user connection/ownership stamp.

## R3 runtime implementation package - 2026-06-25 13:40 Europe/Warsaw

Status: APPLIED_LOCAL_PENDING_FULL_GATE_AND_OWNER_SMOKE.

Runtime scope:
- Settings disconnected Google Calendar users now get a visible connect CTA block.
- Connected users get account state and disconnect action.
- Existing sync button remains; cleanup can be a later UI polish after smoke.
- Task/Event POST stamps created_by_user_id from verified request identity.
- Calendar OAuth consent remains separate from Supabase Google login.
- Outbound user-scoped fail-closed remains.

Tests:
- node scripts/check-stage232g-r3-google-calendar-user-onboarding-owner-stamp.cjs
- node --test tests/stage232g-r3-google-calendar-user-onboarding-owner-stamp.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
