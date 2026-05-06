# STAGE16E - PWA manifest name compatibility repair

Cel: domknąć czerwony gate `tests/pwa-foundation.test.cjs`, który wymaga `manifest.name === "Close Flow"`.

Zakres:
- `public/manifest.webmanifest`
- tylko zgodność manifestu PWA z istniejącym testem foundation

Nie zmienia:
- service worker cache policy,
- backendu,
- danych,
- billingu,
- AI,
- workspace/security.

Komendy sprawdzające:
- `npm.cmd run check:pwa-safe-cache`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run test:critical`
- `npm.cmd run check:plan-access-gating`
- `npm.cmd run audit:release-candidate`
- `npm.cmd run build`

NO_PUSH_PERFORMED=True
