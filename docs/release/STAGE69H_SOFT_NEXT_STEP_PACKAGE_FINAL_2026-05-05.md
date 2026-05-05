# STAGE69H_SOFT_NEXT_STEP_PACKAGE_FINAL

Data: 2026-05-05

## Cel

Domknięcie Stage69 po nieudanych próbach patchowania: miękki kolejny krok po oznaczeniu zadania jako zrobione oraz trwała higiena `package.json`.

## Zakres

- `src/pages/Tasks.tsx` dostaje finalny handler `handleSoftNextStepAfterTaskCompletion`.
- Aktywny lead bez `nextActionAt` po zamknięciu zadania dostaje prompt o kolejny krok.
- Operator może ustawić follow-up/przypomnienie na jutro albo świadomie zostawić leada bez kroku.
- `package.json` pozostaje UTF-8 bez BOM, bez `\u0026`, w canonical JSON.

## Guardy

- `check:stage69h-soft-next-step-package-final`
- `test:stage69h-soft-next-step-package-final`
- `check:stage68p-case-history-package-final`
- `check:stage67-package-json-hygiene`
- `npm run build`

## Kryterium zakończenia

Build przechodzi, guardy przechodzą, commit i push idą na `dev-rollout-freeze`.
