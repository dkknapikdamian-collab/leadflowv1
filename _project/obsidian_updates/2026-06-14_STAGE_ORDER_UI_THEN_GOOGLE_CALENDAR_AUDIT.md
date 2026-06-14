# Obsidian update - CloseFlow stage order: UI closeout, then Google Calendar

Data: 2026-06-14 12:05 Europe/Warsaw
Status: DO_SYNC_TO_OBSIDIAN
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Docelowe pliki Obsidiana

Dopisac do centralnych plikow projektu:

- `02_AKTUALNY_STAN - CloseFlow_Lead_App.md`
- `04_KIERUNEK_DO_WDROZENIA - CloseFlow_Lead_App.md`
- `08_HISTORIA_ZMIAN - CloseFlow_Lead_App.md`
- `09_TESTY_DO_WYKONANIA_I_WYNIKI - CloseFlow_Lead_App.md`
- `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - CloseFlow_Lead_App.md`

## Wpis do 02_AKTUALNY_STAN

2026-06-14 12:05 Europe/Warsaw - decyzja kolejki etapow.

Po porzadkowaniu UI i sprawdzaniu podpiec detail views aplikacja nie przechodzi od razu do nowych funkcji. Nastepnym etapem po zamknieciu aktualnego porzadkowania LeadDetail/CaseDetail ma byc audyt i ewentualna naprawa Google Calendar multi-user:

`STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT`.

## Wpis do 04_KIERUNEK_DO_WDROZENIA

Kolejnosc:

1. Domknac porzadkowanie UI i realnych podpiec:
   - LeadDetail R3/R4/R4D,
   - CaseDetail R1/R1B/R1C/R1C2.
2. Nastepnie sprawdzic Google Calendar multi-user ownership and sync.
3. Dopiero po tym robic szczegolowy audyt i decyzje, co kolejne wdrozyc do aplikacji.

## Wpis do 09_TESTY_DO_WYKONANIA_I_WYNIKI

Planowany test Google Calendar:

- konto Damian: Google Calendar polaczone,
- drugie konto: polaczyc wlasne Google Calendar,
- utworzyc task/event z drugiego konta,
- uruchomic sync,
- sprawdzic, czy event trafia do kalendarza drugiego konta, nie Damiana,
- sprawdzic `google_calendar_connections`,
- sprawdzic ownership fields w `work_items`,
- sprawdzic `personalScopeSkipped`, created/updated/failed.

Status: DO_WYKONANIA po domknieciu UI/detail mapping.

## Wpis do 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyko: Google Calendar moze nadal dzialac tylko dla jednego konta albo pomijac rekordy drugiego uzytkownika, jesli task/event nie maja ownership fields zgodnych z user-scoped connection.

Nie zamykac jako naprawione bez manualnego testu multi-user.

## Wpis do 08_HISTORIA_ZMIAN

2026-06-14 12:05 Europe/Warsaw - zapisano decyzje: po aktualnym porzadkowaniu UI/detail mappings nastepnym etapem jest Google Calendar multi-user audit/fix, a dopiero potem wybor kolejnych funkcji aplikacji.

## Czego nie ruszano

- Nie zmieniano runtime kodu.
- Nie ruszano SQL.
- Nie wykonywano testu Google Calendar w tym wpisie.
- Nie zmieniano kolejnosci poza zapisaniem decyzji nastepnego etapu.
