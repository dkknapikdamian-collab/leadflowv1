# STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64

Data: 2026-05-04
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Domknąć Stage64 jako stałą część bramki `verify:case-operational-ui`.

Po naprawie duplikowania zadań/wydarzeń w szczegółach sprawy nie wystarczy mieć osobny check. Guard deduplikacji musi odpalać się razem z pakietem operacyjnym spraw, żeby regresja nie wróciła przy kolejnym etapie UI.

## Zakres

- dopisać `npm.cmd run check:stage64-case-detail-work-item-dedupe` do `verify:case-operational-ui`,
- dopisać go na końcu istniejącego chaina, po `verify:ui-contrast`, żeby nie złamać starszych guardów szukających dokładnego fragmentu Stage57-Stage63,
- dodać guard `check:stage65-case-operational-verify-includes-stage64`,
- dodać test `test:stage65-case-operational-verify-includes-stage64`,
- pilnować, żeby `package.json` nie dostał BOM ani `\u0026` w miejscu operatorów `&&`.

## Nie zmieniać

- nie zmieniać logiki deduplikacji Stage64,
- nie zmieniać UI,
- nie czyścić rekordów w bazie,
- nie ruszać Google Calendar ani billing.

## Sprawdzenie

Po wdrożeniu przechodzą:

```text
npm.cmd run check:stage65-case-operational-verify-includes-stage64
npm.cmd run test:stage65-case-operational-verify-includes-stage64
npm.cmd run check:stage57-case-create-action-hub
npm.cmd run check:stage64-case-detail-work-item-dedupe
npm.cmd run verify:case-operational-ui
npm.cmd run build
```

## Kryterium zakończenia

`verify:case-operational-ui` obejmuje Stage64 i nadal przechodzą stare guardy Stage57 oraz build produkcyjny.