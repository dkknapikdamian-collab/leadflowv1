# OBSIDIAN UPDATE — STAGE220A36-R12 + STAGE226R10

data i godzina: 2026-06-06 09:35 Europe/Warsaw
nazwa / alias wejsciowy: Stage220A36-R12 modal width polish + Stage226R10 Lead/Client Separation Runtime Fix
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R12_AND_STAGE226R10_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: polish UI + blocker runtime bugfix przed Stage227
status zapisu: NIE ZAPISANO BEZPOSREDNIO — manifest do przeniesienia
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzje
- Modal prowizji ma byc kompaktowy: select rodzaju prowizji czytelny, stawka i wartosc prowizji male, wartosc transakcji/zlecenia nie zajmuje calego modala.
- Lead nie jest klientem. Zwykle dodanie leada nie moze tworzyc klienta ani przypisywac client_id.
- Klient powstaje przez jawne dodanie klienta albo start_service/konwersje.

## Testy
- R12 guard/test
- Stage226R10 guard/test
- build
- quiet gate
- manual /leads -> /clients

## Audyt ryzyk
- /api/leads zwykly POST byl podejrzanym miejscem mieszania leadow z klientami.
- Stage227 dalej zablokowany do czasu potwierdzenia separacji bytow.
