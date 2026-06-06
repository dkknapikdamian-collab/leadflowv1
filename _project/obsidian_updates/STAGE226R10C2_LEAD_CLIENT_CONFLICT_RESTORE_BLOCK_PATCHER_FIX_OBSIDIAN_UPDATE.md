# STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX — aktualizacja Obsidiana

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- nazwa / alias wejściowy: Stage226R10C2 — Lead Client Conflict Restore Block Patcher Fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: 01_PULPIT - CloseFlow Lead App.md / DO_POTWIERDZENIA
- mapa zależności: 06_MAPA_ZALEZNOSCI - CloseFlow Lead App.md / DO_POTWIERDZENIA
- ściąga plików: 07_SCIAGA_PLIKOW - CloseFlow Lead App.md / DO_POTWIERDZENIA
- typ wpisu: hotfix po R10C przerwanym przez kruchy patcher
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_Lead_App/03_AKTYWNE_DECYZJE - CloseFlow Lead App.md; 04_KIERUNEK_DO_WDROZENIA; 09_TESTY_DO_WYKONANIA_I_WYNIKI; 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status zapisu: przygotowano w repo _project/obsidian_updates; APPLY spróbuje też dopisać do vaulta, jeżeli ścieżki istnieją lokalnie
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Wpis do aktywnych decyzji

R10B został wypchnięty mimo czerwonego guarda/testu. R10C miał to naprawić, ale patcher zatrzymał się na kruchym markerze końca bloku `restoreConflictCandidate`. R10C2 jest poprawką procesu i kodu: patcher używa odpornych markerów regexowych, usuwa nieudane niezatwierdzone pliki R10C i blokuje przywracanie klienta z flow tworzenia leada.

## Wpis do kierunku

Przed Stage227 trzeba domknąć zaufanie do danych. Priorytet pozostaje: lead/client separation -> timezone Google Calendar -> dopiero potem Sales Funnel Movement View.

## Testy

- npm run check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix
- npm run test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix
- npm run check:stage226r10b-lead-client-conflict-single-dialog
- npm run test:stage226r10b-lead-client-conflict-single-dialog
- npm run check:stage226r10-lead-client-separation-runtime
- npm run test:stage226r10-lead-client-separation-runtime
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- manual smoke: policzyć klientów przed/po dodaniu leada; konflikt z klientem nie może mieć ścieżki Przywróć klienta z formularza leada.

## Audyt ryzyk po etapie

- Ryzyko historycznych danych zostaje: stary klient o tych samych danych może nadal istnieć i wyglądać jak nowy, ale R10C2 nie tworzy go ani nie przywraca.
- Ryzyko UX: z poziomu leada użytkownik traci szybką akcję przywrócenia klienta. To celowe, bo klient ma być otwierany świadomie przez Pokaż.
- Ryzyko procesu: poprzedni R10B pokazał, że push script pozwolił kontynuować mimo FAIL. R10C2 ma Invoke-Native na każdym kroku i powinien zatrzymać push na czerwonym teście.
- Nie ruszano Google Calendar, Stage227, finansów, RLS ani Supabase schema.

## Następny krok

Uruchomić R10C2. Jeśli PASS, zrobić push R10C2. Potem ręczny smoke w aplikacji. Dopiero wtedy Stage226R11 timezone albo Stage227.
