# 2026-06-12 — STAGE231D0F-R4 Funnel owner dashboard targeted guard repair

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R4 — Funnel targeted guard repair`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa paczki wdrożeniowej / zawężenie guardu / Lejek
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- testy: STAGE231D0F guard/test + CaseDetail R4 regression + build + `git diff --check`
- audyt ryzyk po etapie: R3 próbował czyścić stare historyczne mojibake; R4 zawęża zakres do aktywnego etapu
- czego nie ruszano: Supabase, SQL, logika filtrów, płatności, routingi, wykresy, drag/drop, ClientDetail, LeadListCard
- następny krok: apply R4, manual QA `/funnel`, potem selektywny push bez STAGE231D0E
