# CloseFlow hotfix asset cache stale chunks - check repair

Data: 2026-05-11
Branch: dev-rollout-freeze

## Cel

Naprawa skryptu `scripts/check-hotfix-asset-cache-stale-chunks.cjs`, ktory mial blad skladni JS w literalnym sprawdzeniu `key.startsWith('closeflow-')`.

## Zakres

- Nie zmienia logiki aplikacji.
- Nie zmienia service workera.
- Nie zmienia Vercel headers.
- Nadpisuje tylko check hotfixa poprawna wersja.

## Kryterium

- `npm.cmd run check:hotfix-asset-cache-stale-chunks` przechodzi.
- `npm.cmd run build` przechodzi.
- Dopiero wtedy mozna commitowac/pushowac caly hotfix asset-cache.
