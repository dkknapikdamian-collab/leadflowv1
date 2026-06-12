# 2026-06-12_STAGE231E_R1_GUARD_PIPE_PARSING_HOTFIX

Data: 2026-06-12 22:50 Europe/Warsaw  
Stage: STAGE231E_R1_GUARD_PIPE_PARSING_HOTFIX  
Parent stage: STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY Z LOGOW DAMIANA

- `git pull` fast-forward pobral commit STAGE231E z matrixem, guardem, run reportem i kolejka.
- `node scripts/check-stage231e-non-admin-feature-access-map.cjs` zakonczyl sie FAIL:
  `Invalid or empty verdict for Google Calendar status: access.features.googleCalendar``.
- `npm run build` zakonczyl sie PASS, ale z ostrzezeniem o duplicate key `savedRecord` w `src/components/ContextActionDialogs.tsx` i znanym ostrzezeniem dynamic/static import `supabase-fallback.ts`.
- `npm run test:google-calendar-gating` zakonczyl sie PASS 3/3.
- `npm run test:google-calendar-sync-contract` zakonczyl sie PASS 3/3.
- `git diff --check` nie pokazal bledow whitespace, tylko ostrzezenia LF -> CRLF w istniejacych lokalnych, niezakresowych plikach Stage231D0D.
- Lokalny working tree Damiana ma wiele niezakresowych zmian Stage231D0D/0E/0F/0H; nie sa czescia STAGE231E_R1.

## PRZYCZYNA

Guard R0 parsowal wiersze tabeli markdown przez `line.split('|')`. Matrix ma w kolumnie `Aktualny gate` wartosc:

`isAdmin || isAppOwner || access.features.googleCalendar`

Znaki `||` zostaly potraktowane jako separatory kolumn tabeli. W efekcie guard przesunal kolumny i odczytal `access.features.googleCalendar`` jako werdykt.

## CO ZMIENIONO

- Zmieniono `scripts/check-stage231e-non-admin-feature-access-map.cjs`.
- Guard nie liczy juz kolumn przez proste `split('|')`.
- Guard dla kazdego wymaganego wiersza znajduje dozwolony werdykt jako komorke markdown z listy:
  - `OK`,
  - `DO_NAPRAWY_W_231F`,
  - `DO_NAPRAWY_W_231G`,
  - `DO_NAPRAWY_OSOBNY_ETAP`.
- Zaktualizowano `_project/07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW.md`, dodajac status R1 i uwage o parserze `||`.

## TESTY / GUARDY

Do ponownego uruchomienia lokalnie po `git pull`:

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

## AUDYT PO HOTFIXIE

- Przyczyna byla w guardzie, nie w matrixie dostepnosci.
- Nie zmieniono werdyktow matrixa.
- Nie zmieniono runtime aplikacji.
- Nie ruszano Google Calendar backend, digest, weekly report, SQL/RLS, UI ani STAGE231F.
- Wymagane ponowne lokalne uruchomienie guarda, bo GitHub connector nie uruchamia node runtime.

## RYZYKA

- Guard R1 celowo nie parsuje tabeli jako pelnego AST markdown. Chroni kontrakt STAGE231E wystarczajaco: wymagane funkcje + jeden dozwolony werdykt w wierszu + run report sections.
- Lokalny working tree Damiana zawiera duzo niezakresowych zmian. Nie dodawac ich przypadkowo do commita/pusha STAGE231E_R1.
- Ostrzezenie builda o duplicate key `savedRecord` w `ContextActionDialogs.tsx` jest poza zakresem, ale powinno zostac wpisane do osobnego etapu/bug sweep, jesli nie jest juz znane.

## NASTEPNY KROK

1. Damian/local developer robi `git pull`.
2. Uruchamia `node scripts/check-stage231e-non-admin-feature-access-map.cjs`.
3. Jesli PASS, mozna przejsc do `STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX` z poprawiona decyzja: centralna konfiguracja Google OAuth po stronie CloseFlow, zgoda OAuth per uzytkownik.

## OBSIDIAN PAYLOAD

- data i godzina: 2026-06-12 22:50 Europe/Warsaw
- nazwa / alias wejściowy: STAGE231E_R1_GUARD_PIPE_PARSING_HOTFIX
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow — DO_POTWIERDZENIA formalne ID
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: hotfix guarda / raport lokalnego FAIL
- docelowa ścieżka: 09_TESTY_DO_WYKONANIA_I_WYNIKI, 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY, 08_HISTORIA_ZMIAN
- status zapisu: zapisane w repo `_project/runs`; Obsidian lokalny DO_SYNCHRONIZACJI
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- testy: lokalny rerun wymagany
- czego nie ruszano: runtime UI, Google Calendar backend, SQL/RLS, digest/weekly, STAGE231F
- następny krok: rerun guarda STAGE231E R1, potem STAGE231F
