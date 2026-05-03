# CloseFlow

CloseFlow to aplikacja SaaS do pilnowania leadw, follow-upw, zada, wydarze i spraw po sprzeday w jednym miejscu.

Produkt jest pozycjonowany jako prosty system operacyjny dla osoby, ktra sama obsuguje sprzeda i realizację: widzi, kogo trzeba ruszyć, czego nie wolno przegapić i ktre tematy mogą uciec.

## Co robi produkt

- pokazuje priorytety w widoku **Dzi**,
- prowadzi leady z następnym krokiem i historią kontaktu,
- ączy zadania, wydarzenia, przypomnienia, leady, klientw i sprawy,
- pozwala przejć z wygranego leada do sprawy,
- wspiera notatki, szkice AI i follow-upy bez automatycznego zapisywania finalnych danych przez AI,
- dziaa jako aplikacja webowa/PWA gotowa do wdroenia na Vercel.

## Stack techniczny

- **Frontend:** React + Vite + TypeScript.
- **UI:** Tailwind CSS, lokalne komponenty UI i route-scoped style.
- **Auth:** Supabase Auth jako docelowy model logowania.
- **Dane aplikacyjne:** Supabase przez endpointy w katalogu `api/`.
- **Hosting:** Vercel.
- **Billing:** moduy billingowe/checkout są w repo, ale produkcyjne uycie wymaga poprawnej konfiguracji providerw, webhookw i testu end-to-end.
- **AI:** wyącznie backend-only. Sekrety AI nie mogą być wystawiane jako `VITE_*`. Frontend moe wywoywać tylko endpoint aplikacji.

## Gwne widoki

- **Dzi** – centrum decyzji i najpilniejsze dziaania.
- **Leady** – lista sprzedaowa z kolejnym krokiem.
- **Lead Detail** – karta leada z kontaktem, notatkami, zadaniami, wydarzeniami i historią.
- **Klienci** – relacje i powiązane sprawy/leady.
- **Sprawy** – etap realizacji po sprzeday.
- **Case Detail** – operacyjny hub sprawy.
- **Zadania** – zadania i follow-upy.
- **Kalendarz** – wsplna o czasu dla zada i wydarze.
- **Szkice AI** – miejsce zatwierdzania treci przygotowanych przez AI.
- **Ustawienia / Rozliczenia / Pomoc** – konfiguracja konta i aplikacji.

## Uruchomienie lokalne

### 1. Instalacja zalenoci

```bash
npm install
```

### 2. Konfiguracja rodowiska

Skopiuj `.env.example` do `.env.local` albo ustaw te same zmienne w rodowisku Vercel.

Najwaniejsze grupy zmiennych:

- publiczne zmienne klienta: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
- zmienne serwerowe: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
- billing/email/AI: tylko po stronie serwera.

Nie dodawaj sekretw jako `VITE_*`.

### 3. Start dev

```bash
npm run dev
```

### 4. Build produkcyjny

```bash
npm run build
```

## Testy i guardy

Najczęciej uywane krtkie checki:

```bash
npm run test:critical
npm run check:polish-mojibake
npm run check:a18-branding-docs
```

Peny release guard:

```bash
npm run verify:closeflow:quiet
```

## Architektura danych: Supabase-first

Supabase jest docelowym rdem prawdy dla danych biznesowych, auth, storage, billing, portalu klienta, szkicw AI, szablonw i aktywnoci.

Firebase / Firestore jest traktowany wyącznie jako warstwa legacy/decommission. Nie dopisujemy nowych funkcji do Firestore i nie tworzymy dwch rde prawdy.

## Bezpieczestwo AI

- `GEMINI_API_KEY` i inne sekrety AI są wyącznie backendowe.
- Nie wolno tworzyć `public-prefixed Gemini API key` ani innych publicznych sekretw.
- Frontend komunikuje się z AI tylko przez endpoint aplikacji.
- AI moe przygotowywać szkice, ale finalne rekordy wymagają zatwierdzenia uytkownika.

## Status produkcyjny

Aktualny stan gotowoci produkcyjnej jest opisany w:

- `docs/PRODUCTION_READINESS_STATUS.md`

Ten dokument ma być rdem prawdy dla ostrzee, brakw i elementw wymagających sprawdzenia przed sprzedaą.

## Portal klienta: wymagane sekrety

Portal klienta nie moe dziaać produkcyjnie na domylnych sekretach.

W rodowisku produkcyjnym ustaw jako zmienne serwerowe:

```bash
PORTAL_TOKEN_PEPPER=
PORTAL_SESSION_SECRET=
```

Zasady:

- nie dodawaj tych wartoci jako `VITE_*`,
- zmiana `PORTAL_TOKEN_PEPPER` uniewania stare linki portalu,
- zmiana `PORTAL_SESSION_SECRET` uniewania aktywne sesje portalu,
- jeli `NODE_ENV=production` albo `VERCEL_ENV=production` i brakuje sekretw, endpointy portalu zwracają `PORTAL_SECRET_CONFIG_MISSING`.
## Portal upload: Supabase Storage

Portal klienta moe przyjmować pliki przez endpoint pi/storage-upload.ts. Upload nie idzie bezporednio z przeglądarki do publicznego bucketu. Frontend wysya plik do backendu, backend sprawdza sesję portalu i zapisuje obiekt w Supabase Storage przez SUPABASE_SERVICE_ROLE_KEY.

W rodowisku produkcyjnym ustaw jako zmienne serwerowe:

`ash
SUPABASE_PORTAL_BUCKET=portal-uploads
PORTAL_UPLOAD_MAX_BYTES=10485760
PORTAL_UPLOAD_ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document
PORTAL_STORAGE_HEALTH_SECRET=
`

Bucket portal-uploads musi być prywatny. Nie wączaj publicznego listowania ani publicznych policy dla storage.objects.

SQL do utworzenia bucketu:

`	ext
supabase/migrations/20260502_portal_uploads_storage_bucket.sql
`

Diagnostyka po wdroeniu:

`ash
GET /api/storage-upload-health
Header: x-closeflow-storage-check-secret: <PORTAL_STORAGE_HEALTH_SECRET>
`

Oczekiwany wynik: ok: true, ucket: portal-uploads, public: false.

