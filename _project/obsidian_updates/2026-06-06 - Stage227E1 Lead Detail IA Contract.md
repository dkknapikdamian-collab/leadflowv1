# 2026-06-06 15:00 Europe/Warsaw — Stage227E1 Lead Detail IA Contract + Visual Source of Truth

## Zapis do Obsidiana

- data i godzina: 2026-06-06 15:00 Europe/Warsaw
- nazwa / alias wejściowy: Stage227E1 — Lead Detail IA Contract + Visual Source of Truth
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: nie dotyczy
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: DO_POTWIERDZENIA, prawdopodobnie `10_PROJEKTY/CloseFlow`
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: etap kontraktowy / IA / Visual Source of Truth / guard
- docelowa ścieżka: centralne pliki projektu CloseFlow: kierunek, testy, ryzyka, historia zmian, ściąga plików
- status zapisu: przygotowane w repo jako `_project/obsidian_updates/2026-06-06 - Stage227E1 Lead Detail IA Contract.md`; wymaga przeniesienia lub synchronizacji z vaultem Obsidiana
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: `npm run check:stage227e1-lead-detail-ia-contract`, `npm run test:stage227e1-lead-detail-ia-contract`, `git diff --check`
- audyt ryzyk po etapie: wykonany w run report
- czego nie ruszano: runtime UI, Supabase, SQL, CaseDetail, Google Calendar, finanse, routing
- następny krok: po PASS i akceptacji commit/push Stage227E1; dopiero potem Stage227E2

## Decyzja

LeadDetail ma zostać przebudowany jako karta sprzedażowa, nie jako kopia sprawy. Stage227E1 tylko zamyka kontrakt i guard. Nie idziemy dalej do przebudowy UI przed PASS.

## Jedno źródło prawdy wizualne

Te same albo podobne akcje w LeadDetail i CaseDetail muszą używać wspólnych klas/komponentów/wzorców. Zakazane jest tworzenie osobnych styli dla tych samych akcji leada.

## Docelowe sekcje

1. Header
2. Quick Actions
3. Decision Cards
4. Sales Signal / Sygnał sprzedażowy
5. Work Action Center
6. Notes
7. Source/History

## Testy i guardy

- Guard: `scripts/check-stage227e1-lead-detail-ia-contract.cjs`
- Test: `tests/stage227e1-lead-detail-ia-contract.test.cjs`
- Package scripts:
  - `check:stage227e1-lead-detail-ia-contract`
  - `test:stage227e1-lead-detail-ia-contract`

## Audyt ryzyk

- Niskie ryzyko runtime, bo brak przebudowy UI.
- Wysokie ryzyko przyszłej duplikacji stylów, dlatego guard blokuje brak wspólnego VST.
- Średnie ryzyko, że `Dodaj brak` zostanie nadprojektowane; E1 ogranicza to do ręcznej blokady/braku bez nowej tabeli.
- Średnie ryzyko, że mobile zostanie potraktowany jak desktop; kontrakt wymusza kolejność operacyjną mobile.
