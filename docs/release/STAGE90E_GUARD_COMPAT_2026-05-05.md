# Stage90E - Guard compatibility for cumulative Stage90D

Date: 2026-05-05  
Branch: dev-rollout-freeze  
Status: GUARD_COMPAT_FIXED  
Package: CUMULATIVE_STAGE90F

## Problem

Stage90D zatrzymał się na:

```text
root read-first doc must mark cumulative Stage90C
```

To nie był błąd produktu. To był błąd guardu: Stage90D podniósł marker paczki z `CUMULATIVE_STAGE90C` na `CUMULATIVE_STAGE90D`, a stary check dalej oczekiwał literalnie `CUMULATIVE_STAGE90C`.

## Naprawa

Stage90E:

- zachowuje read-first marker aktualnej paczki `CUMULATIVE_STAGE90E`,
- dodaje compatibility markers: `CUMULATIVE_STAGE90C CUMULATIVE_STAGE90D CUMULATIVE_STAGE90E`,
- zmienia `check-stage90-env-portal-button-qa.cjs`, żeby akceptował C/D/E,
- aktualizuje evidence writer na `CUMULATIVE_STAGE90E`,
- zostawia Stage90D live smoke runner.

## Kryterium

`npm.cmd run verify:stage90d-smoke-runner` ma przejść przed buildem i commitem.
