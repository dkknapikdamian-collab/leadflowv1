# STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX

Data: 2026-06-12 22:55 Europe/Warsaw  
Status: READY_FOR_IMPLEMENTATION  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja Damiana

Google Calendar ma dzialac nie tylko na koncie Damiana/admina. Kazdy uprawniony uzytkownik powinien miec jasny przeplyw:

1. Jesli loguje sie Google i plan/funkcja pozwala, widzi status Google Calendar i moze polaczyc swoje konto Calendar przez OAuth.
2. Jesli loguje sie haslem, widzi opcje polaczenia Google Calendar przez OAuth Google.
3. Zadna osoba nie moze przypadkiem synchronizowac sie z kalendarzem innego uzytkownika.
4. Jesli funkcja jest niedostepna przez plan, user ma zobaczyc jasny komunikat i upsell/blocked state, a nie martwy przycisk.
5. Powiadomienia / ustawienia maja pozwolic wlaczyc albo wylaczyc integracje/synchronizacje dla swojego konta.

## Objaw

Na koncie Damiana synchronizacja dziala krzyzowo: CloseFlow -> Google Calendar, Google Calendar -> CloseFlow, przesuwanie i kasowanie wpisow. Na koncie znajomego wpis z CloseFlow nie pojawil sie w Google Calendar, wpisy z Google Calendar nie pojawily sie w CloseFlow, a user nie mogl kliknac synchronizacji.

## Prawdopodobne przyczyny z kodu

1. UI gate planu: Settings pokazuje Google Calendar tylko gdy `isAdmin || isAppOwner || access.features.googleCalendar`. Free/Basic moga nie widziec albo nie kliknac integracji.
2. Google Calendar jest wedlug modelu planow funkcja od Pro, a admin/app owner omija ten gate. Konto Damiana moze wiec nie byc reprezentatywne.
3. Backend zapisuje polaczenie Google Calendar per `workspaceId + userId`, ale `getGoogleCalendarConnection` ma fallback do aktywnego polaczenia workspace. To moze maskowac brak polaczenia usera albo ryzykowac uzycie innego konta.
4. OAuth callback zapisuje tokeny z `googleAccountEmail: null`, wiec UI moze nie pokazac jasno, z jakim Google kontem user sie polaczyl.
5. Logowanie przez Google nie jest rowne zgodzie na Calendar API. User nadal musi przejsc OAuth z zakresem Calendar, chyba ze system ma osobna integracje/zgode.

## Zakres plikow do przeczytania

- AGENTS.md
- _project/00_PROJECT_MEMORY_PROTOCOL.md
- _project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md
- _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md
- _project/07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW.md
- _project/04_STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_PLAN.md
- src/pages/Settings.tsx
- src/lib/plans.ts
- src/lib/product-truth.ts
- src/hooks/useWorkspace.ts
- src/server/google-calendar-handler.ts
- src/server/google-calendar-sync.ts
- src/server/google-calendar-inbound.ts
- src/server/google-calendar-outbound.ts
- src/server/_request-scope.ts
- src/server/_access-gate.ts
- tests/google-calendar-gating.test.cjs
- tests/google-calendar-sync-contract.test.cjs
- scripts/check-google-calendar-*.cjs

## Audyt przed etapem

Developer ma przed kodem zapisac:

- jakie konto testowe ma plan Free/Basic/Pro/AI/trial,
- czy user jest admin/app owner/member,
- czy `access.features.googleCalendar` jest true/false,
- co widzi w Settings -> Integracje,
- jaki jest status `/api/google-calendar?route=status`,
- czy connect jest disabled przez plan, env, brak userId/workspaceId, czy brak konfiguracji,
- czy inbound/outbound zwracaja `connected:false` czy blad,
- czy istnieje user-specific connection dla tego usera,
- czy backend fallbackuje do workspace connection.

## Implementacja - minimalny bezpieczny kierunek

1. Rozdzielic UI states Google Calendar:
   - available_connected,
   - available_not_connected,
   - disabled_by_plan,
   - server_not_configured,
   - auth_required,
   - needs_user_oauth,
   - sync_disabled_by_user.

2. W Settings nie chowac calkowicie informacji o Google Calendar dla zwyklego usera. Jesli plan blokuje, pokazac jasny blocked/upsell state. Jesli plan pozwala, pokazac connect/status/sync.

3. Nie utozsamiac loginu Google z Calendar OAuth. Po loginie Google user moze miec latwiejszy copy/context, ale Calendar wymaga osobnej zgody OAuth.

4. Naprawic bezpieczenstwo kont:
   - defaultowo inbound/outbound/status dla usera maja wymagac user-specific connection,
   - workspace fallback moze zostac tylko jako admin/owner legacy mode albo jawnie opisany tryb workspace-wide, jezeli Damian go zatwierdzi,
   - status UI ma pokazac, czy polaczenie jest user-specific czy workspace fallback.

5. Dla konta haslowego dac jasna akcje: `Polacz Google Calendar`. Uzytkownik ma przejsc OAuth Google i polaczyc swoje konto Calendar z wlasnym userId w workspace.

6. Dodac toggle/preferencje:
   - synchronizacja Google Calendar wlaczona/wylaczona dla tego usera albo workspace, zgodnie z wybranym modelem,
   - wylaczenie nie usuwa tokenow bez potwierdzenia; rozlaczenie usuwa/dezaktywuje connection.

7. Dla inbound sync dodac albo naprawic jawna akcje/wywolanie, zeby user mogl pobrac wpisy z Google Calendar do CloseFlow. Jesli auto-pull istnieje, udokumentowac gdzie i kiedy dziala.

## Guardy / testy wymagane

Dodac albo zaktualizowac:

- scripts/check-stage231f-google-calendar-user-scope.cjs
- tests/stage231f-google-calendar-user-scope.test.cjs

Guard ma sprawdzac:

- Settings ma osobne stany disabled_by_plan / server_not_configured / needs_user_oauth / connected.
- Google Calendar UI nie znika bez komunikatu dla usera.
- Backend nie uzywa cicho workspace fallback dla zwyklego usera bez jawnego trybu.
- OAuth state zawiera workspaceId i userId.
- Status/connect/sync-inbound/sync-outbound maja kontrakt userId/workspaceId.
- Plan gate dla Pro/AI/trial jest zgodny z `src/lib/plans.ts`.

Uruchomic:

- npm run test:google-calendar-gating
- npm run test:google-calendar-sync-contract
- node scripts/check-google-calendar-sync-v1-foundation.cjs
- node scripts/check-stage231f-google-calendar-user-scope.cjs
- npm run build
- git diff --check

## Test reczny Damiana

1. Konto Damiana/admin: status dalej dziala.
2. Konto zwyklego usera na planie bez Google Calendar: widzi jasny blocked state, nie martwy przycisk.
3. Konto zwyklego usera na planie z Google Calendar: widzi `Polacz Google Calendar`, przechodzi OAuth i status pokazuje jego konto.
4. Wpis dodany w CloseFlow usera pojawia sie w jego Google Calendar.
5. Wpis dodany w Google Calendar usera po sync-inbound pojawia sie w CloseFlow jego workspace.
6. Rozlaczenie/wylaczenie sync nie narusza konta Damiana ani innego usera.

## Warunek zamkniecia

- Problem kont nieadminowskich jest odtworzony albo udokumentowany jako plan-gate.
- Naprawiony jest brak klikalnosci/ukrycie integracji dla uprawnionego usera.
- User-specific Google connection nie miesza sie z kontem innej osoby.
- Jest jasny stan dla loginu Google i loginu haslem.
- Guard i testy przechodza albo maja jawny SKIP z powodem.
- Run report jest zapisany w _project/runs.
- Nowe problemy spoza zakresu trafiaja do _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md.
