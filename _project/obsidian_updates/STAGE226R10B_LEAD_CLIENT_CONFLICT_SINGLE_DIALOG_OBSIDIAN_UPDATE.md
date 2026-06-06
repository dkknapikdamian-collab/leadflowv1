# STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG — aktualizacja Obsidiana

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- nazwa / alias wejściowy: Stage226R10B — Lead/Client Conflict Single Dialog Hardening
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: 01_PULPIT - CloseFlow Lead App.md / DO_POTWIERDZENIA
- mapa zależności: 06_MAPA_ZALEZNOSCI - CloseFlow Lead App.md / DO_POTWIERDZENIA
- ściąga plików: 07_SCIAGA_PLIKOW - CloseFlow Lead App.md / DO_POTWIERDZENIA
- typ wpisu: etap naprawczy po Stage226R10
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_Lead_App/03_AKTYWNE_DECYZJE - CloseFlow Lead App.md; 04_KIERUNEK_DO_WDROZENIA; 09_TESTY_DO_WYKONANIA_I_WYNIKI; 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status zapisu: przygotowano w repo _project/obsidian_updates; APPLY spróbuje też dopisać do vaulta, jeżeli ścieżki istnieją lokalnie
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Wpis do aktywnych decyzji

Stage226R10B utrwala zasadę: dodanie leada nie może tworzyć, przywracać ani wyświetlać klienta jako efekt uboczny. Konflikt z istniejącym klientem ma pokazać ostrzeżenie i opcję Pokaż, ale nie Przywróć z poziomu formularza leada. Klient powstaje tylko przez jawne dodanie klienta albo explicit start_service / rozpoczęcie obsługi.

## Wpis do kierunku

Przed Stage227 trzeba domknąć zaufanie do danych: lead/client separation i następnie timezone Google Calendar. Stage227 nie powinien iść na danych, którym nie ufamy.

## Testy

- npm run check:stage226r10b-lead-client-conflict-single-dialog
- npm run test:stage226r10b-lead-client-conflict-single-dialog
- npm run check:stage226r10-lead-client-separation-runtime
- npm run test:stage226r10-lead-client-separation-runtime
- npm run build
- npm run verify:closeflow:quiet
- manual smoke: liczba klientów przed/po dodaniu leada nie może wzrosnąć; lead z danymi istniejącego klienta może pokazać konflikt, ale nie może przywrócić klienta z flow leada.

## Audyt ryzyk po etapie

- Istniejące stare rekordy klientów mogą dalej wyglądać jak świeżo dodany lead, jeśli mają te same dane. To wymaga manualnego rozróżnienia po ID/datach.
- Blokada client restore w lead flow może zabrać szybką ścieżkę przywrócenia klienta, ale to jest celowe: przywracanie klienta musi być świadomym wejściem w klienta.
- Jeżeli Supabase ma stare dane z błędnego flow, ten etap nie usuwa danych produkcyjnych; to wymaga osobnego audytu danych, nie automatycznej migracji.
- Nie ruszano Google Calendar, Stage227, finansów, RLS ani schema.

## Następny krok

Uruchomić ZIP lokalnie, wykonać testy i manual smoke. Po PASS zrobić selektywny commit/push. Potem Stage226R11 timezone albo Stage227 dopiero po potwierdzeniu, że R11 nie blokuje.
