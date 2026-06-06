# OBSIDIAN UPDATE — STAGE227B — Lead Detail Work Action Center + Leads History Tile Cleanup

Data: 2026-06-06 15:45 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
Status: DO WPISANIA DO OBSIDIANA / MANIFEST

## Docelowe pliki Obsidiana

Zaktualizować centralne pliki projektu:

- `02_AKTUALNY_STAN - CloseFlow Lead App.md`
- `03_AKTYWNE_DECYZJE - CloseFlow Lead App.md`
- `04_KIERUNEK_DO_WDROZENIA - CloseFlow Lead App.md`
- `06_MAPA_ZALEZNOSCI - CloseFlow Lead App.md`
- `07_SCIAGA_PLIKOW - CloseFlow Lead App.md`
- `08_HISTORIA_ZMIAN - CloseFlow Lead App.md`
- `09_TESTY_DO_WYKONANIA_I_WYNIKI - CloseFlow Lead App.md`
- `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - CloseFlow Lead App.md`

## Treść wpisu

### STAGE227B — Lead Detail Work Action Center + Leads History Tile Cleanup

Data: 2026-06-06 15:45 Europe/Warsaw
Status: DO WDROŻENIA PO STAGE227A / LOCAL-ONLY FIRST

#### Powód

Damian zgłosił, że:

- kafelek `Historia` w top stat cards na `/leads` myli historię pracy z filtrem leadów przeniesionych do obsługi;
- w LeadDetail brakuje wygodnego centrum działań podobnego do tego, co jest w CaseDetail;
- wydarzenie/zadanie przypięte do leada powinno dać się obsłużyć z LeadDetail, a nie tylko przez Calendar;
- potrzebna jest możliwość edycji, oznaczenia jako zrobione, przesunięcia i usunięcia działań leada;
- potrzebne są `obserwacje` jako szybkie notatki operacyjne, bez budowania nowej tabeli w tym etapie.

#### Decyzja

LeadDetail ma być miejscem pracy z działaniami przypiętymi do leada. Użytkownik nie może być zmuszony do przechodzenia do Calendar, żeby oznaczyć wydarzenie/zadanie jako zrobione, edytować, przesunąć albo usunąć. Kafelek `Historia` w top stat cards Leadów zostaje usunięty/ukryty, bo myli historię pracy z filtrem leadów przeniesionych do obsługi.

#### Zakres

- usunąć/ukryć kafelek `Historia` z top stat cards `/leads`;
- dodać główny panel `Działania leada` w `LeadDetail`;
- wzorować panel na `CaseDetail`, ale nie kopiować bezmyślnie;
- dodać akcje: `Edytuj`, `Zrobione`, `Jutro/+1D`, `Usuń` dla task/event;
- dodać `Dodaj obserwację` jako szybki wariant notatki operacyjnej;
- nie budować nowej tabeli obserwacji w tym etapie.

#### Guardy/testy do dodania

- `scripts/check-stage227b-lead-detail-work-action-center.cjs`
- `tests/stage227b-lead-detail-work-action-center.test.cjs`

#### Test ręczny

- `/leads`: kafelek `Historia` nie jest widoczny w top stat cards;
- `LeadDetail`: sekcja `Działania leada` widoczna;
- wydarzenie z dzisiaj można oznaczyć jako zrobione z LeadDetail;
- zadanie można oznaczyć jako zrobione z LeadDetail;
- event/task można edytować i przesunąć z LeadDetail;
- Calendar pozostaje spójny po zmianach;
- CaseDetail nie traci obecnego panelu działań.

#### Ryzyka

- nie robić drugiego kalendarza w LeadDetail;
- nie dublować ciężko akcji między centrum i prawym railem;
- jeśli filtr historii leadów nadal jest potrzebny, przenieść go później do filtrów prostych, nie do top stat cards;
- eventy z Google Calendar wymagają smoke po akcji `Zrobione`.

## Linkowane pliki repo

- `_project/reports/STAGE227B_LEAD_DETAIL_WORK_ACTION_CENTER_REPORT.md`
- `_project/runs/STAGE227B_LEAD_DETAIL_WORK_ACTION_CENTER_RUN.md`
- `_project/obsidian_updates/STAGE227B_LEAD_DETAIL_WORK_ACTION_CENTER_OBSIDIAN_UPDATE.md`
