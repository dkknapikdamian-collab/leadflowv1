# CloseFlow

CloseFlow to aplikacja SaaS do pilnowania leadĂłw, follow-upĂłw, zadaĹ„, wydarzeĹ„ i spraw po sprzedaĹĽy w jednym miejscu.

Produkt jest pozycjonowany jako prosty system operacyjny dla osoby, ktĂłra sama obsĹ‚uguje sprzedaĹĽ i realizacjÄ™: widzi, kogo trzeba ruszyÄ‡, czego nie wolno przegapiÄ‡ i ktĂłre tematy mogÄ… uciec.

## Co robi produkt

- pokazuje priorytety w widoku **DziĹ›**,
- prowadzi leady z nastÄ™pnym krokiem i historiÄ… kontaktu,
- Ĺ‚Ä…czy zadania, wydarzenia, przypomnienia, leady, klientĂłw i sprawy,
- pozwala przejĹ›Ä‡ z wygranego leada do sprawy,
- wspiera notatki, szkice AI i follow-upy bez automatycznego zapisywania finalnych danych przez AI,
- dziaĹ‚a jako aplikacja webowa/PWA gotowa do wdroĹĽenia na Vercel.

## Stack techniczny

- **Frontend:** React + Vite + TypeScript.
- **UI:** Tailwind CSS, lokalne komponenty UI i route-scoped style.
- **Auth:** Supabase Auth jako docelowy model logowania.
- **Dane aplikacyjne:** Supabase przez endpointy w katalogu `api/`.
- **Hosting:** Vercel.
- **Billing:** moduĹ‚y billingowe/checkout sÄ… w repo, ale produkcyjne uĹĽycie wymaga poprawnej konfiguracji providerĂłw, webhookĂłw i testu end-to-end.
- **AI:** wyĹ‚Ä…cznie backend-only. Sekrety AI nie mogÄ… byÄ‡ wystawiane jako `VITE_*`. Frontend moĹĽe wywoĹ‚ywaÄ‡ tylko endpoint aplikacji.

## GĹ‚Ăłwne widoki

- **DziĹ›** â€“ centrum decyzji i najpilniejsze dziaĹ‚ania.
- **Leady** â€“ lista sprzedaĹĽowa z kolejnym krokiem.
- **Lead Detail** â€“ karta leada z kontaktem, notatkami, zadaniami, wydarzeniami i historiÄ….
- **Klienci** â€“ relacje i powiÄ…zane sprawy/leady.
- **Sprawy** â€“ etap realizacji po sprzedaĹĽy.
- **Case Detail** â€“ operacyjny hub sprawy.
- **Zadania** â€“ zadania i follow-upy.
- **Kalendarz** â€“ wspĂłlna oĹ› czasu dla zadaĹ„ i wydarzeĹ„.
- **Szkice AI** â€“ miejsce zatwierdzania treĹ›ci przygotowanych przez AI.
- **Ustawienia / Rozliczenia / Pomoc** â€“ konfiguracja konta i aplikacji.

## Uruchomienie lokalne

### 1. Instalacja zaleĹĽnoĹ›ci

```bash
npm install
```

### 2. Konfiguracja Ĺ›rodowiska

Skopiuj `.env.example` do `.env.local` albo ustaw te same zmienne w Ĺ›rodowisku Vercel.

NajwaĹĽniejsze grupy zmiennych:

- publiczne zmienne klienta: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
- zmienne serwerowe: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
- billing/email/AI: tylko po stronie serwera.

Nie dodawaj sekretĂłw jako `VITE_*`.

### 3. Start dev

```bash
npm run dev
```

### 4. Build produkcyjny

```bash
npm run build
```

## Testy i guardy

NajczÄ™Ĺ›ciej uĹĽywane krĂłtkie checki:

```bash
npm run test:critical
npm run check:polish-mojibake
npm run check:a18-branding-docs
```

PeĹ‚ny release guard:

```bash
npm run verify:closeflow:quiet
```

## Architektura danych: Supabase-first

Supabase jest docelowym ĹşrĂłdĹ‚em prawdy dla danych biznesowych, auth, storage, billing, portalu klienta, szkicĂłw AI, szablonĂłw i aktywnoĹ›ci.

Firebase / Firestore jest traktowany wyĹ‚Ä…cznie jako warstwa legacy/decommission. Nie dopisujemy nowych funkcji do Firestore i nie tworzymy dwĂłch ĹşrĂłdeĹ‚ prawdy.

## BezpieczeĹ„stwo AI

- `GEMINI_API_KEY` i inne sekrety AI sÄ… wyĹ‚Ä…cznie backendowe.
- Nie wolno tworzyÄ‡ `public-prefixed Gemini API key` ani innych publicznych sekretĂłw.
- Frontend komunikuje siÄ™ z AI tylko przez endpoint aplikacji.
- AI moĹĽe przygotowywaÄ‡ szkice, ale finalne rekordy wymagajÄ… zatwierdzenia uĹĽytkownika.

## Status produkcyjny

Aktualny stan gotowoĹ›ci produkcyjnej jest opisany w:

- `docs/PRODUCTION_READINESS_STATUS.md`

Ten dokument ma byÄ‡ ĹşrĂłdĹ‚em prawdy dla ostrzeĹĽeĹ„, brakĂłw i elementĂłw wymagajÄ…cych sprawdzenia przed sprzedaĹĽÄ….

## Portal klienta: wymagane sekrety

Portal klienta nie moĹĽe dziaĹ‚aÄ‡ produkcyjnie na domyĹ›lnych sekretach.

W Ĺ›rodowisku produkcyjnym ustaw jako zmienne serwerowe:

```bash
PORTAL_TOKEN_PEPPER=
PORTAL_SESSION_SECRET=
```

Zasady:

- nie dodawaj tych wartoĹ›ci jako `VITE_*`,
- zmiana `PORTAL_TOKEN_PEPPER` uniewaĹĽnia stare linki portalu,
- zmiana `PORTAL_SESSION_SECRET` uniewaĹĽnia aktywne sesje portalu,
- jeĹ›li `NODE_ENV=production` albo `VERCEL_ENV=production` i brakuje sekretĂłw, endpointy portalu zwracajÄ… `PORTAL_SECRET_CONFIG_MISSING`.
## Portal upload: Supabase Storage

Portal klienta moĹĽe przyjmowaÄ‡ pliki przez endpoint pi/storage-upload.ts. Upload nie idzie bezpoĹ›rednio z przeglÄ…darki do publicznego bucketu. Frontend wysyĹ‚a plik do backendu, backend sprawdza sesjÄ™ portalu i zapisuje obiekt w Supabase Storage przez SUPABASE_SERVICE_ROLE_KEY.

W Ĺ›rodowisku produkcyjnym ustaw jako zmienne serwerowe:

`ash
SUPABASE_PORTAL_BUCKET=portal-uploads
PORTAL_UPLOAD_MAX_BYTES=10485760
PORTAL_UPLOAD_ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document
PORTAL_STORAGE_HEALTH_SECRET=
`

Bucket portal-uploads musi byÄ‡ prywatny. Nie wĹ‚Ä…czaj publicznego listowania ani publicznych policy dla storage.objects.

SQL do utworzenia bucketu:

`	ext
supabase/migrations/20260502_portal_uploads_storage_bucket.sql
`

Diagnostyka po wdroĹĽeniu:

`ash
GET /api/storage-upload-health
Header: x-closeflow-storage-check-secret: <PORTAL_STORAGE_HEALTH_SECRET>
`

Oczekiwany wynik: ok: true, ucket: portal-uploads, public: false.

