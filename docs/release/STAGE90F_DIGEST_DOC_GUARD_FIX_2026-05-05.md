# Stage90F - Digest safety marker guard fix

Date: 2026-05-05  
Branch: dev-rollout-freeze  
Status: DIGEST_SAFETY_GUARD_FIXED  
Package: CUMULATIVE_STAGE90F

## Problem

Stage90E zatrzymał się na:

```text
commands doc must state digest is not auto-called
```

Guard był za kruchy, bo wymagał konkretnej frazy tekstowej w dokumencie komend.

## Naprawa

Stage90F:

- dodaje stabilny marker `DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True`,
- zmienia check `check-stage90d-live-smoke-runner.cjs`, aby szukał markera lub semantyki, a nie jednej frazy,
- aktualizuje testy Stage90D,
- zachowuje live smoke runner bez odpalania digestu mailowego.

## Kryterium

`npm.cmd run verify:stage90d-smoke-runner` ma przejść.
