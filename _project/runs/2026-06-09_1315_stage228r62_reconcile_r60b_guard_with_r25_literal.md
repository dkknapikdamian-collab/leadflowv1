# Stage228R62 - reconcile R60B guard with R25 literal

- data i godzina: 2026-06-09 13:15 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: guard repair / compatibility repair
- status: prepared by ZIP runner

## Powod

R61 dopasowal runtime do lokalnego R25 source-truth i R25/R41 przeszly. Pozniej stary guard R60B failowal, bo nadal oczekiwal helpera apiRoute('tasks'), ktory jest sprzeczny z literalnym kontraktem R25.

## Zakres

- R60B guard zostal przepisany na aktualny R25 literal route: /api/system?apiRoute=tasks&id=
- R62 guard sprawdza, ze R60B nie wymaga juz obsolete apiRoute helper
- runtime hardDeleteTaskFromSupabase nie jest cofany
- pelny stack R25/R41/R47-R62 + build + diff-check

## Audyt ryzyk po etapie

- Ryzyko: guardy z posrednich R-stage moga sobie wzajemnie przeczyc. Kontrola: R62 jawnie uzgadnia R60B z R25, ktory jest prebuild source-truth.
- Ryzyko: literal R25 jest kruchy. Kontrola: nie zmieniamy go teraz, bo prebuild go wymaga; ewentualna zmiana powinna byc osobnym etapem porzadkujacym.
