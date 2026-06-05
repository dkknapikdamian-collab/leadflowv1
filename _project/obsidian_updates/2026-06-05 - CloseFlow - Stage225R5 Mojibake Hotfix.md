# CloseFlow - STAGE225R5 Mojibake Hotfix

- data: 2026-06-05 Europe/Warsaw
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Powod
STAGE225 zostal wdrozony i wypchniety, ale verify:closeflow:quiet wykryl twardy blad Stage98 mojibake w aktywnych plikach. Przed pushem padl tez guard Stage225 z komunikatem, ze Leads.tsx nie ma 14+ dni ciszy.

## Decyzja
Nie idziemy do kolejnego etapu. Najpierw hotfix kodowania i guardow dla STAGE225.

## Zakres
- odtworzenie Leads.tsx i Clients.tsx z czystego HEAD^,
- ponowne nalozenie Contact Cadence Grid przez Node/UTF-8,
- naprawa helpera contact-cadence-grid.ts,
- guard mojibake w check-stage225-contact-cadence-grid.cjs,
- testy Stage225 + build + verify.

## Ryzyka
- _LOCAL_CHECKS zostaje lokalnie i nie moze wejsc do commita.
- Po hotfixie trzeba sprawdzic UI /leads i /clients recznie.
