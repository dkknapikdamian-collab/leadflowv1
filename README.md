# CloseFlow

CloseFlow to aplikacja SaaS do pilnowania leadów, follow-upów, zadań, wydarzeń i spraw po sprzedaży w jednym miejscu.

Produkt jest pozycjonowany jako prosty system operacyjny dla osoby, która sama obsługuje sprzedaż i realizację: widzi, kogo trzeba ruszyć, czego nie wolno przegapić i które tematy mogą uciec.

## Co robi produkt

- pokazuje priorytety w widoku **Dziś**,
- prowadzi leady z następnym krokiem i historią kontaktu,
- łączy zadania, wydarzenia, przypomnienia, leady, klientów i sprawy,
- pozwala przejść z wygranego leada do sprawy,
- wspiera notatki, szkice AI i follow-upy bez automatycznego zapisywania finalnych danych przez AI,
- działa jako aplikacja webowa/PWA gotowa do wdrożenia na Vercel.

## Stack techniczny

- **Frontend:** React + Vite + TypeScript.
- **UI:** Tailwind CSS, lokalne komponenty UI i route-scoped style.
- **Auth:** Supabase Auth jako docelowy model logowania.
- **Dane aplikacyjne:** Supabase przez endpointy w katalogu `api/`.
- **Hosting:** Vercel.
- **Billing:** moduły billingowe/checkout są w repo, ale produkcyjne użycie wymaga poprawnej konfiguracji providerów, webhooków i testu end-to-end.
- **AI:** wyłącznie backend-only. Sekrety AI nie mogą być wystawiane jako `VITE_*`. Frontend może wywoływać tylko endpoint aplikacji.

## Główne widoki

- **Dziś** – centrum decyzji i najpilniejsze działania.
- **Leady** – lista sprzedażowa z kolejnym krokiem.
- **Lead Detail** – karta leada z kontaktem, notatkami, zadaniami, wydarzeniami i historią.
- **Klienci** – relacje i powiązane sprawy/leady.
- **Sprawy** – etap realizacji po sprzedaży.
- **Case Detail** – operacyjny hub sprawy.
- **Zadania** – zadania i follow-upy.
- **Kalendarz** – wspólna oś czasu dla zadań i wydarzeń.
- **Szkice AI** – miejsce zatwierdzania treści przygotowanych przez AI.
- **Ustawienia / Rozliczenia / Pomoc** – konfiguracja konta i aplikacji.

## Uruchomienie lokalne

### 1. Instalacja zależności

```bash
npm install
```

### 2. Konfiguracja środowiska

Skopiuj `.env.example` do `.env.local` albo ustaw te same zmienne w środowisku Vercel.

Najważniejsze grupy zmiennych:

- publiczne zmienne klienta: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
- zmienne serwerowe: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
- billing/email/AI: tylko po stronie serwera.

Nie dodawaj sekretów jako `VITE_*`.

### 3. Start dev

```bash
npm run dev
```

### 4. Build produkcyjny

```bash
npm run build
```

## Testy i guardy

Najczęściej używane krótkie checki:

```bash
npm run test:critical
npm run check:polish-mojibake
npm run check:a18-branding-docs
```

Pełny release guard:

```bash
npm run verify:closeflow:quiet
```

## Architektura danych: Supabase-first

Supabase jest docelowym źródłem prawdy dla danych biznesowych, auth, storage, billing, portalu klienta, szkiców AI, szablonów i aktywności.

Firebase / Firestore jest traktowany wyłącznie jako warstwa legacy/decommission. Nie dopisujemy nowych funkcji do Firestore i nie tworzymy dwóch źródeł prawdy.

## Bezpieczeństwo AI

- `GEMINI_API_KEY` i inne sekrety AI są wyłącznie backendowe.
- Nie wolno tworzyć `VITE_GEMINI_API_KEY` ani innych publicznych sekretów.
- Frontend komunikuje się z AI tylko przez endpoint aplikacji.
- AI może przygotowywać szkice, ale finalne rekordy wymagają zatwierdzenia użytkownika.

## Status produkcyjny

Aktualny stan gotowości produkcyjnej jest opisany w:

- `docs/PRODUCTION_READINESS_STATUS.md`

Ten dokument ma być źródłem prawdy dla ostrzeżeń, braków i elementów wymagających sprawdzenia przed sprzedażą.
