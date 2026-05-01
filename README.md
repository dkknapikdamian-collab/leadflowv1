# Close Flow

Close Flow to aplikacja do prowadzenia leadów, follow-upów, zadań, wydarzeń i spraw po sprzedaży w jednym miejscu.

## Co robi produkt

- pilnuje kolejnego ruchu przy leadzie
- pokazuje priorytety w widoku **Dziś**
- łączy zadania, wydarzenia i przypomnienia z leadami oraz sprawami
- pozwala płynnie przejść z wygranego leada do **sprawy**
- wspiera obsługę po sprzedaży bez chaosu między kalendarzem, notatkami i listą zadań

## Główne widoki

- **Dziś** – najważniejsze rzeczy do ruszenia teraz
- **Leady** – lista sprzedażowa z kolejnym krokiem
- **Lead Detail** – pełna karta leada z zadaniami, wydarzeniami i historią
- **Sprawy** – etap po sprzedaży
- **Case Detail** – operacyjny hub sprawy
- **Kalendarz** – wspólna oś czasu dla zadań i wydarzeń
- **Aktywność** – historia ruchów operatora
- **Ustawienia / Rozliczenia / Pomoc** – konfiguracja konta i aplikacji

## Stack

- **Frontend:** React + Vite + TypeScript
- **UI:** Tailwind + komponenty lokalne
- **Auth:** Firebase Authentication + Google Login
- **Dane aplikacyjne / API:** Supabase przez endpointy w katalogu `api/`

## Uruchomienie lokalne

### 1. Zainstaluj zależności
```bash
npm install
```

### 2. Skonfiguruj Firebase
Repo korzysta z pliku:
- `firebase-applet-config.json`

To konfiguracja klienta Firebase używana do logowania i profilu użytkownika.

### 3. Skonfiguruj Supabase
Frontend oczekuje:
- `VITE_SUPABASE_URL`

Warstwa API po stronie serwera korzysta z:
- `SUPABASE_URL` lub `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Uruchom projekt
```bash
npm run dev
```

## Build produkcyjny
```bash
npm run build
```

## Uwaga architektoniczna

Aktualny kierunek produktu to:
- Firebase dla auth
- Supabase dla danych aplikacyjnych i endpointów API

Warstwy sprzedaży, zadań, wydarzeń, aktywności i spraw są prowadzone po stronie Supabase.
<!-- closeflow-ai-env-policy -->
## Bezpieczeństwo AI / Gemini

- `GEMINI_API_KEY` jest wyłącznie zmienną backendową/serwerową.
- Frontend nie może czytać `GEMINI_API_KEY` przez `process.env`, `import.meta.env`, `define` w Vite ani globalne stałe.
- Nie wolno tworzyć `VITE_GEMINI_API_KEY` ani innych `VITE_*` sekretów AI.
- Jeśli Gemini jest używane, frontend wywołuje endpoint aplikacji, a endpoint serwerowy dopiero komunikuje się z Gemini.
- Po buildzie uruchom `npm.cmd run verify:security:gemini-client`, żeby sprawdzić `vite.config.ts`, kod klienta i `dist`.

<!-- closeflow-supabase-first-architecture -->
## Architektura danych: Supabase-first

Od etapu 00 obowiązuje decyzja: Supabase jest docelowym źródłem prawdy dla danych biznesowych, auth, storage, billing, portalu klienta, AI drafts, szablonów i aktywności.

Firebase / Firestore pozostaje warstwą legacy do migracji. Nie dopisujemy nowych funkcji do Firestore i nie tworzymy dwóch źródeł prawdy.

Szczegóły:

- `docs/SUPABASE_FIRST_ARCHITECTURE.md`
- `docs/DATA_SOURCE_MAP.md`
<!-- /closeflow-supabase-first-architecture -->


<!-- closeflow-stage01-supabase-auth -->
## Logowanie: Supabase Auth

Od etapu 01 docelowym modelem logowania jest Supabase Auth.

Frontend używa `Authorization: Bearer <supabase_access_token>` dla requestów do API. Backend ustala użytkownika i workspace na podstawie zweryfikowanego tokenu Supabase, a nie na podstawie nagłówków `x-user-id`, `x-user-email`, `x-workspace-id` z frontu.

Szczegóły wdrożenia:

- `docs/STAGE01_SUPABASE_AUTH.md`
- `supabase/migrations/2026-05-01_stage01_supabase_auth_identity.sql`
<!-- /closeflow-stage01-supabase-auth -->
