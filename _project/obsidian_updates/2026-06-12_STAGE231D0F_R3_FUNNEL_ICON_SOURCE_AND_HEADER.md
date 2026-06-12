# 2026-06-12 — STAGE231D0F-R3 Funnel icon source truth + records header fix

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R3 — Funnel icon color source truth + records header fix`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: kontrakt etapu UI / Lejek visual fix
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: kolory ikon top metric tiles mają mieć jedno źródło prawdy; nagłówek rekordów Lejka ma być jednym wierszem
- testy: R3 guard/test + R2 regression guard/test + build + `git diff --check`
- audyt ryzyk po etapie: lokalne nadpisania SVG mogą nadal maskować kolor ikon; manual QA wymagany
- czego nie ruszano: logika filtrów, SQL, kanban, drag/drop, Supabase
- następny krok: apply R3, manual QA `/funnel`, potem selektywny push
