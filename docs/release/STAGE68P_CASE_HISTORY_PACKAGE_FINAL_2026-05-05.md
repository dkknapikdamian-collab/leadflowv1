# STAGE68P_CASE_HISTORY_PACKAGE_FINAL_2026-05-05

Cel: domknąć naprawę historii sprawy po nieudanych lokalnych próbach Stage68 A-O.

Zakres:
- poprawny UTF-8 w `getActivityText` w `src/pages/CaseDetail.tsx`,
- bezosobowe copy historii: `Dodano...`, `Zmieniono...`, `Przełożono...`,
- zachowanie metadanych `Operator/Klient` poza treścią zdania,
- finalny guard Stage68P w `verify:case-operational-ui`,
- usunięcie lokalnych artefaktów nieudanych Stage68,
- `package.json` bez BOM i bez `\u0026`.

Nie zmieniać:
- logiki tworzenia zadań, wydarzeń i braków,
- deduplikacji Stage64,
- układu UI sprawy.

Kryterium zakończenia:
- `npm run check:stage68p-case-history-package-final`,
- `npm run test:stage68p-case-history-package-final`,
- `npm run check:stage66-case-history-passive-copy`,
- `npm run test:stage66-case-history-passive-copy`,
- `npm run check:stage67-package-json-hygiene`,
- `npm run verify:case-operational-ui`,
- `npm run build`.
