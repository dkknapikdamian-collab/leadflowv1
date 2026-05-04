# STAGE67_PACKAGE_JSON_HYGIENE

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Przywrócić normalne, stabilne formatowanie `package.json` po wcześniejszym zapisie przez PowerShell oraz zabezpieczyć repo przed powrotem problemów z BOM i escaped ampersand (`\\u0026`).

## Zakres

- `package.json` jest zapisywany jako UTF-8 bez BOM.
- `package.json` jest formatowany kanonicznie przez `JSON.stringify(pkg, null, 2) + newline`.
- Operatory `&&` zostają zwykłym tekstem, bez `\\u0026`.
- `verify:case-operational-ui` obejmuje Stage64 dedupe oraz Stage66 proste opisy historii sprawy.
- Dodano guard i test STAGE67.

## Nie zmieniaj

- Nie zmieniać logiki `CaseDetail.tsx`.
- Nie zmieniać działania STAGE64 ani STAGE66.
- Nie dodawać nowych funkcji UI w tym etapie.

## Kryterium zakończenia

- `npm run check:stage67-package-json-hygiene` przechodzi.
- `npm run test:stage67-package-json-hygiene` przechodzi.
- `npm run verify:case-operational-ui` przechodzi.
- `npm run build` przechodzi.
