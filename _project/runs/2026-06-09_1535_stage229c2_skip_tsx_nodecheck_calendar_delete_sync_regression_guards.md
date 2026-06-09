# Stage229C2 - skip TSX node-check and close calendar delete sync guards

- data i godzina: 2026-06-09 15:35 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runner repair / guard consolidation
- status: prepared by ZIP runner

## Powod

Stage229C patcher poprawnie dodal guardy, ale runner probowal wykonac node --check na pliku TSX. Node v24 nie obsluguje bezposrednio .tsx w tym trybie, wiec to byl blad runnera, nie kodu aplikacji.

## Zakres

- Pomijamy node --check dla TSX.
- Guard CJS sprawdza kontrakty statycznie.
- Vite build waliduje TS/TSX.
- Zachowano cleanup duplicate savedRecord.

## Testy

- R25/R41/R229A/R229B2/R229C guards.
- R229B2/R229C tests.
- npm run build.
- git diff --check.

## Audyt ryzyk po etapie

- Ryzyko: TSX syntax nie jest walidowany przez node --check, tylko przez Vite build. To poprawna sciezka dla Vite/React.
- Ryzyko: guard blokuje refaktory, ale zabezpiecza krytyczny kontrakt Google Calendar delete sync.
