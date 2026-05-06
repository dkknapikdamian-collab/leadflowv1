# STAGE16G - PWA manifest guard reconcile script fix

Cel: naprawić błąd parsera z Stage16F i pogodzić kontrakt `pwa-foundation` z `check:pwa-safe-cache`.

Zakres:
- `public/manifest.webmanifest`: `name = Close Flow`, `short_name = CloseFlow`, `start_url = /`.
- `public/service-worker.js`: zachowanie safe-cache bez luzowania zasad, plus legacy markery `/api/` i `/supabase/` wymagane przez stary test.
- `scripts/check-pwa-safe-cache.cjs`: zgodny kontrakt z `tests/pwa-foundation.test.cjs`.

Bez commita. Bez pusha.
