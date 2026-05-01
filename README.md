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
