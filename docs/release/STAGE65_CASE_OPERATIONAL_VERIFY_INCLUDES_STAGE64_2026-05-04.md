# STAGE65_CASE_OPERATIONAL_VERIFY_INCLUDES_STAGE64

Data: 2026-05-04
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

DomknÄ…Ä‡ Stage64 jako staĹ‚Ä… czÄ™Ĺ›Ä‡ bramki `verify:case-operational-ui`.

Po naprawie duplikowania zadaĹ„/wydarzeĹ„ w szczegĂłĹ‚ach sprawy nie wystarczy mieÄ‡ osobny check. Guard deduplikacji musi odpalaÄ‡ siÄ™ razem z pakietem operacyjnym spraw, ĹĽeby regresja nie wrĂłciĹ‚a przy kolejnym etapie UI.

## Zakres

- dopisaÄ‡ `npm.cmd run check:stage64-case-detail-work-item-dedupe` do `verify:case-operational-ui`,
- dopisaÄ‡ go na koĹ„cu istniejÄ…cego chaina, po `verify:ui-contrast`, ĹĽeby nie zĹ‚amaÄ‡ starszych guardĂłw szukajÄ…cych dokĹ‚adnego fragmentu Stage57-Stage63,
- dodaÄ‡ guard `check:stage65-case-operational-verify-includes-stage64`,
- dodaÄ‡ test `test:stage65-case-operational-verify-includes-stage64`,
- pilnowaÄ‡, ĹĽeby `package.json` nie dostaĹ‚ BOM ani `\u0026` w miejscu operatorĂłw `&&`.

## Nie zmieniaÄ‡

- nie zmieniaÄ‡ logiki deduplikacji Stage64,
- nie zmieniaÄ‡ UI,
- nie czyĹ›ciÄ‡ rekordĂłw w bazie,
- nie ruszaÄ‡ Google Calendar ani billing.

## Sprawdzenie

Po wdroĹĽeniu przechodzÄ…:

```text
npm.cmd run check:stage65-case-operational-verify-includes-stage64
npm.cmd run test:stage65-case-operational-verify-includes-stage64
npm.cmd run check:stage57-case-create-action-hub
npm.cmd run check:stage64-case-detail-work-item-dedupe
npm.cmd run verify:case-operational-ui
npm.cmd run build
```

## Kryterium zakoĹ„czenia

`verify:case-operational-ui` obejmuje Stage64 i nadal przechodzÄ… stare guardy Stage57 oraz build produkcyjny.