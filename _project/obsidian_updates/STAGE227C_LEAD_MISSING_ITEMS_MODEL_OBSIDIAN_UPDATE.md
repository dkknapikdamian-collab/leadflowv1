# OBSIDIAN UPDATE — STAGE227C — Lead Missing Items / Blocks Model Backlog

Data: 2026-06-06 15:55 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
Status: DO WPISANIA DO OBSIDIANA / MANIFEST

## Docelowe pliki Obsidiana

Zaktualizować centralne pliki projektu:

- `03_AKTYWNE_DECYZJE - CloseFlow Lead App.md`
- `04_KIERUNEK_DO_WDROZENIA - CloseFlow Lead App.md`
- `09_TESTY_DO_WYKONANIA_I_WYNIKI - CloseFlow Lead App.md`
- `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - CloseFlow Lead App.md`
- `08_HISTORIA_ZMIAN - CloseFlow Lead App.md`

## Treść wpisu

### STAGE227C — Lead Missing Items / Blocks Model Backlog

Data: 2026-06-06 15:55 Europe/Warsaw
Status: FUTURE STAGE / DO WDROŻENIA PO STAGE227B, JEŚLI POTWIERDZONE

#### Powód

W Stage227B planowany `Dodaj brak` w leadzie może nadal działać przez szybkie zadanie albo notatkę, bo w repo nie ma osobnego modelu braków/blokad dla leada analogicznego do `case_items` w sprawie. To jest uczciwy kompromis na etap porządkowania UI, ale nie jest pełnym modelem braków leada.

#### Decyzja

Nie budować pełnego modelu `braków leada` w Stage227B. Stage227B ma uporządkować ekran i obsługę istniejących task/event/note.

Jeżeli po Stage227B Damian potwierdzi, że `brak leada` ma być czymś więcej niż zadanie oznaczone jako brak, zrobić osobny etap Stage227C.

#### Opcje realizacji

1. Minimalna: `brak leada` jako task typu `missing_item` / `blocker` z osobnym filtrowaniem w LeadDetail.
2. Pełniejsza: osobny model/tabela, np. `lead_items`, `lead_missing_items` albo `lead_blockers` — tylko po osobnej decyzji, SQL, RLS, API i guardach.

#### Czego nie robić w Stage227B

- nie dodawać nowej tabeli dla braków leada;
- nie robić SQL/migracji;
- nie mieszać `case_items` ze zwykłymi leadami;
- nie udawać, że szybkie zadanie jest pełnym modelem braków;
- nie budować drugiego systemu checklist w leadach bez decyzji produktowej.

#### Ryzyko

Pełny model braków leadów może być przesadą, jeśli przed sprzedażą wystarczy task/obserwacja. Etap Stage227C ma najpierw porównać koszt wykonania i wartość operacyjną.

## Linkowane pliki repo

- `_project/reports/STAGE227C_LEAD_MISSING_ITEMS_MODEL_BACKLOG_REPORT.md`
- `_project/obsidian_updates/STAGE227C_LEAD_MISSING_ITEMS_MODEL_OBSIDIAN_UPDATE.md`
