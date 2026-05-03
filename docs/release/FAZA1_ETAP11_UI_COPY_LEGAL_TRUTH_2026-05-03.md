# FAZA 1 — Etap 1.1 — Prawda produktu w UI/copy/legal

## Cel

Zabrać aplikacji możliwość mówienia bajek w UI, copy i dokumentacji release. Ten etap nie dodaje nowych funkcji. Uporządkowuje komunikaty tak, żeby użytkownik widział prawdziwy status funkcji.

## Pliki do sprawdzenia

- `src/pages/Billing.tsx`
- `src/pages/Settings.tsx`
- `src/pages/AdminAiSettings.tsx`
- `src/lib/product-truth.ts`
- `docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md`
- `scripts/check-faza1-etap11-ui-copy-legal-truth.cjs`
- `package.json`

## Zmień

- Google Calendar: tylko `W przygotowaniu` / wymaga OAuth, bez claimu aktywnego syncu.
- AI: tylko Beta, szkic, odpowiedź na danych aplikacji, zapis po potwierdzeniu.
- Stripe: wymaga konfiguracji Stripe i webhooka.
- Digest: wymaga mail providera i adresu nadawcy.
- PWA: aplikacja webowa dodawana do ekranu głównego, nie natywna apka sklepowa.
- Security/SOC: brak claimów certyfikacji bez dowodu.

## Nie zmieniaj

- Nie dodawaj nowej logiki billingowej.
- Nie uruchamiaj Google Calendar OAuth.
- Nie zmieniaj działania AI.
- Nie zmieniaj RLS/workspace security w tym etapie.
- Nie twórz nowej gałęzi.

## Po wdrożeniu sprawdź

- `npm run check:faza1-etap11-ui-copy-legal-truth`
- `npm run check:p14-ui-truth-copy-menu`
- `npm run build`

## Kryterium zakończenia

Użytkownik i audytor widzą w UI prawdziwy status funkcji. Aplikacja nie twierdzi, że integracje, certyfikaty, płatności albo AI działają finalnie, jeśli wymagają konfiguracji, są w beta albo są w przygotowaniu.
