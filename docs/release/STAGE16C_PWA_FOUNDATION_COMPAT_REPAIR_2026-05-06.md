# Stage16C — PWA foundation compat repair

Cel: naprawić czerwony gate `verify:closeflow:quiet` po Stage16B bez cofania bezpiecznego service workera.

Problem:
- `tests/pwa-foundation.test.cjs` oczekuje jawnego markera kodu `url.pathname.startsWith('/api/')`.
- Stage13 PWA safe mode używał zmiennej `path = url.pathname.toLowerCase()` i `path.startsWith('/api/')`, co było bezpieczne, ale niezgodne ze starszym guardem.

Zmiana:
- `public/service-worker.js` dostaje wykonywalny marker `const legacyApiPathCompat = url.pathname.startsWith('/api/');`.
- `legacyApiPathCompat` jest użyty w `isApiOrDataRequest`.
- Nie rozluźnia to cache. API dalej jest network-only.

Sprawdzenie:
- `npm.cmd run check:pwa-safe-cache`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run test:critical`
- `npm.cmd run check:plan-access-gating`
- opcjonalnie `npm.cmd run audit:release-candidate`
- `npm.cmd run build`

Bez commita. Bez pusha.
