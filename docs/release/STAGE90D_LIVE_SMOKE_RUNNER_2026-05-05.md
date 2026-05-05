# Stage90D - Live smoke runner for PWA/Digest/Portal/Button Matrix

Date: 2026-05-05  
Branch: dev-rollout-freeze  
Status: LIVE_SMOKE_RUNNER_ADDED  
Package: CUMULATIVE_STAGE90F

## Cel

Po Stage90C mamy checklisty i statyczny evidence. Stage90D dodaje runner środowiskowy, który można odpalić po Vercel deployu.

## Ważna decyzja

Runner **nie odpala daily digest route domyślnie**.

Powód: digest może wysłać mail. To ma być sprawdzone przez Vercel cron logs / Resend delivery / bezpieczny dry-run, a nie przez ślepy ping.

## Automatycznie sprawdzane

- URL aplikacji odpowiada,
- manifest/PWA endpoint, jeśli istnieje,
- service worker endpoint, jeśli istnieje,
- portal bez tokenu nie daje dostępu,
- upload endpoint bez tokenu nie daje dostępu,
- raport zapisuje się w `docs/qa/STAGE90D_LIVE_SMOKE_RESULT.latest.md`.

## Manualnie wymagane

- browser notification,
- toast,
- realny digest delivery/dedupe,
- portal z ważnym tokenem,
- realny upload,
- Button Matrix live.

## Skrypty

- `npm.cmd run stage90d:live-smoke`
- `npm.cmd run check:stage90d-live-smoke-runner`
- `npm.cmd run test:stage90d-live-smoke-runner`
- `npm.cmd run verify:stage90d-smoke-runner`

## Kryterium

Stage90D jest narzędziem do testu środowiskowego. Nie oznacza jeszcze Etapów 13/14/15 jako pełne DONE.


## Stage90E compatibility note

Stage90E keeps this live smoke runner and fixes the Stage90C literal package marker guard.


## Stable safety marker

`DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True`
