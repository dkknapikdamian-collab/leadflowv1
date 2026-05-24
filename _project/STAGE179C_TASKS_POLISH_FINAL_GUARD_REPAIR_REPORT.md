# STAGE179C Tasks Polish Final Guard Repair — raport

Data: 2026-05-24  
Projekt: CloseFlow / LeadFlow  
Zakres: hotfix / tasks copy / guard reconciliation

## Cel

Zamknąć Stage179 po tym, jak Stage179B nadal nie przechodził dwóch guardów.

## FAKTY

- Stage179B build przeszedł.
- Stage178B guard przeszedł.
- Stage178 guard przeszedł.
- Stage179B guard padł na `Ĺ‚`.
- Stage179 guard padł na oczekiwaniu starego escaped markeru `<h2>{'Filtry zada\u0144'}</h2>`.

## DECYZJE DAMIANA

- Poprawić polskie znaki.
- Usunąć `Szybki fokus`.
- Nie pushować bez przejścia guardów.
- Każda poprawka ma mieć guard.

## HIPOTEZY AI

- Najstabilniejszy kontrakt końcowy: literalne nagłówki w JSX dla Stage178/178B oraz unicode escapes tylko w tablicach label/hint.
- Stage179 i Stage179B guardy muszą być zaktualizowane do finalnego kontraktu po usunięciu focus card.

## Testy

```powershell
node scripts/check-stage179c-tasks-polish-final-guard-repair.cjs
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## Czego nie ruszano

- deploy
- push
- dane
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
