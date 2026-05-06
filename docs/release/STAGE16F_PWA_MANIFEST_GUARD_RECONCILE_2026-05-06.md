# Stage16F — PWA manifest / guard reconcile

Cel: usunąć konflikt między starszym testem `pwa-foundation` a nowszym guardem `check:pwa-safe-cache`.

Zakres:
- `public/manifest.webmanifest` używa `name: "Close Flow"`, `short_name: "CloseFlow"`, `start_url: "/"`, `display: "standalone"`.
- `scripts/check-pwa-safe-cache.cjs` zostaje dostosowany do tego samego kontraktu co `tests/pwa-foundation.test.cjs`.
- Service worker nadal cache’uje tylko shell/assets i nie cache’uje API, auth, Supabase, storage, portalu ani danych biznesowych.

Bez commita. Bez pusha.
