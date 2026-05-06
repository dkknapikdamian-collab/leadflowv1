# STAGE 13 — PWA i Mobile Safe Mode

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Aplikacja ma działać jak webowa aplikacja na telefonie, ale service worker nie może cache’ować danych biznesowych, auth, API, portalu klienta ani Supabase storage.

## Zakres zmian

- `public/manifest.webmanifest`
  - nazwa `CloseFlow`,
  - `display: standalone`,
  - `start_url: /?source=pwa`,
  - ikony 192/512/SVG,
  - brak duplikatu shortcutu `Dziś`.

- `public/service-worker.js`
  - cache tylko root shell, manifest, favicon, ikony i `/assets/*`,
  - API/auth/Supabase REST/storage/functions/portal/billing/assistant/network-only,
  - tokenizowane URL-e network-only,
  - ścieżki biznesowe typu `/leads`, `/tasks`, `/calendar`, `/cases`, `/clients`, `/billing`, `/settings` nie są offline sejfem danych.

- `src/components/PwaInstallPrompt.tsx`
  - bezpieczny install prompt,
  - fallback iOS,
  - sensowny hitbox przycisków,
  - komunikat, że dane klientów nie są trzymane offline w cache.

- `src/components/NotificationRuntime.tsx`
  - brak skanu offline,
  - bezpieczne kliknięcie tylko w link wewnętrzny,
  - ponowne skanowanie po `online`.

- `scripts/check-pwa-safe-cache.cjs`
- `tests/pwa-safe-cache.test.cjs`
- `package.json`
  - dodane:
    - `check:pwa-safe-cache`
    - `test:pwa-safe-cache`

## Nie zmieniono

- danych,
- billing,
- AI,
- Google Calendar,
- routingu biznesowego,
- modeli API.

## Weryfikacja

```powershell
npm.cmd run check:pwa-safe-cache
npm.cmd run test:pwa-safe-cache
npm.cmd run build
```

## Kryterium zakończenia

CloseFlow można dodać do ekranu głównego, a service worker nie robi sejfu z cudzymi ani własnymi danymi biznesowymi.
