# Today quick snooze runtime fix

Data: 2026-04-25

## Cel

Naprawic crash ekranu Dzis:

ReferenceError: TODAY_QUICK_SNOOZE_OPTIONS is not defined

## Co zmieniono

- dodano TODAY_QUICK_SNOOZE_OPTIONS w src/pages/Today.tsx,
- poprawiono label paska szybkiego odkladania,
- dodano test tests/today-quick-snooze-options.test.cjs,
- dopieto test do verify:closeflow i verify:closeflow:quiet.

## Zakres

Nie zmieniano API, Supabase, billingu, leadow, spraw ani PWA.

## Kryterium zakonczenia

- ekran Dzis nie crashuje na renderze,
- pasek szybkiego odkladania ma zdefiniowane opcje,
- test regresyjny przechodzi,
- npm.cmd run verify:closeflow:quiet przechodzi.
