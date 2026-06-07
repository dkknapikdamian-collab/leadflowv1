# Obsidian update — Stage227E2 Lead Detail Top Cards Polish

- data i godzina: 2026-06-06 15:20 Europe/Warsaw
- nazwa / alias wejściowy: Stage227E2 — Lead Detail Top Cards Polish
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: nie dotyczy
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: DO_POTWIERDZENIA
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: etap runtime UI / LeadDetail / top cards / guard
- docelowa ścieżka: centralne pliki projektu CloseFlow: aktualny stan, kierunek, testy, ryzyka, historia zmian
- status zapisu: przygotowane w ZIP; brak bezpośredniego zapisu do lokalnego vaultu w tej rozmowie
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: `npm run check:stage227e2-lead-detail-top-cards-polish`, `npm run test:stage227e2-lead-detail-top-cards-polish`, `git diff --check`
- audyt ryzyk po etapie: największe ryzyko to brak jakościowego `lastContactAt` w starych danych; E2 zakazuje `updatedAt`, ale docelowo warto mieć konsekwentne zapisy kontaktu
- czego nie ruszano: SQL, Supabase schema, CaseDetail, cały action center, push
- następny krok: po lokalnym PASS dopisać kolejny etap tylko jeśli E1/E2 są poprawne; nie iść dalej przed potwierdzeniem

## Treść do centralnych plików projektu

Stage227E2 naprawia top cards LeadDetail. Trzy kafelki mają być decyzyjne:

1. `Następny krok` — z `nextTimelineEntry`, tasków i eventów.
2. `Potencjał` — z `leadFinance.formatted`, źródła i statusu.
3. `Cisza / ryzyko` — z dat kontaktu/aktywności, bez `updatedAt`.

Usunięto kierunek dekoracyjnego kafelka `Aktywny lead`. Zwykła edycja rekordu nie może resetować ciszy kontaktu.
