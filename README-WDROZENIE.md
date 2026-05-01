# CloseFlow — wdrożenie

## Cel dokumentu

Ten dokument opisuje wdrożenie CloseFlow jako aplikacji SaaS lead/case follow-up z architekturą Supabase-first.

## Co jest wdrożone w repo

- aplikacja React + Vite + TypeScript,
- routing i widoki operacyjne: Dziś, Leady, Klienci, Sprawy, Zadania, Kalendarz, Aktywność, Szkice AI, Ustawienia, Billing, Pomoc,
- Supabase Auth jako docelowy model logowania,
- API w katalogu `api/`, które pracuje na zweryfikowanym kontekście użytkownika/workspace,
- Supabase jako docelowe źródło danych biznesowych,
- PWA: manifest, ikony i tryb standalone,
- AI backend-only: frontend nie trzyma sekretów AI,
- podstawowe guardy jakości, w tym kontrola polskich znaków i architektury.

## Jak uruchomić lokalnie

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj `.env.example` do `.env.local` i uzupełnij wartości.

3. Uruchom dev server:

```bash
npm run dev
```

4. Zbuduj produkcyjnie:

```bash
npm run build
```

## Vercel

CloseFlow jest przygotowany pod wdrożenie na Vercel.

Na Vercel ustaw osobno:

- publiczne zmienne klienta `VITE_*`,
- zmienne serwerowe Supabase,
- zmienne billingowe,
- zmienne e-mail/digest,
- zmienne AI backend-only.

Nie ustawiaj sekretów jako `VITE_*`.

## Supabase-first

Supabase jest docelowym źródłem prawdy dla:

- auth,
- workspace,
- leadów,
- klientów,
- spraw,
- zadań,
- wydarzeń,
- aktywności,
- szkiców AI,
- szablonów,
- portalu klienta,
- billing/access state.

Firebase / Firestore jest tylko legacy/decommission. Nie budujemy nowych funkcji na Firestore.

## Billing

Repo zawiera elementy billingowe i checkoutowe. Przed użyciem produkcyjnym trzeba potwierdzić:

- poprawne env providera płatności,
- webhooki,
- mapping planów,
- trial/access state,
- test od checkoutu do odblokowania dostępu.

Nie traktuj billing jako gotowy do sprzedaży bez testu end-to-end.

## AI

AI w CloseFlow działa wyłącznie przez backend.

Zasady:

- brak sekretów AI w kodzie klienta,
- brak `VITE_*` dla kluczy AI,
- AI nie zapisuje finalnych danych bez zatwierdzenia użytkownika,
- komendy tworzące dane mają trafiać do szkiców albo ekranów potwierdzenia.

## Status produkcyjny

Zawsze sprawdź:

- `docs/PRODUCTION_READINESS_STATUS.md`,
- wyniki `npm run test:critical`,
- wyniki `npm run check:polish-mojibake`,
- aktualne migracje Supabase,
- konfigurację env na Vercel.
