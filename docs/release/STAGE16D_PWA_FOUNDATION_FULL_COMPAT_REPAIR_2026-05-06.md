# Stage16D — PWA foundation full compat repair

Cel: naprawić zgodność ze starym `tests/pwa-foundation.test.cjs` bez osłabiania Stage13 PWA safe cache.

Zakres:
- `public/service-worker.js`
- dodanie wykonywalnych markerów zgodności:
  - `url.pathname.startsWith('/api/')`
  - `url.pathname.startsWith('/supabase/')`
- zachowanie blokady cache dla API, auth, Supabase REST/storage/functions, portalu, tokenów i runtime business routes.

Nie wykonuje commita ani pusha.
