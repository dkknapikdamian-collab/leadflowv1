# 2026-06-07 - Stage227F6 Lead Strip Cadence Funnel Width run report

- data i godzina: 2026-06-07 17:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: UI/layout correction + guard compatibility
- decyzja: usunac top shortcut strip z LeadDetail; skompaktowac siatke kontaktu; poszerzyc Lejek
- testy: F6 guard/test, F3/F4/F5 compatibility guards, C2 guard/test, build, diff-check
- audyt ryzyk: sprawdzic deploy wizualnie na LeadDetail, Leads, Clients i Lejek; szczegolnie scroll po starych URL-ach z hashem
- czego nie ruszano: SQL, Supabase, runtime zapis brakow, finanse, kalendarz
## F6R1 — F4/F5 compat guard scroll scope repair
- data i godzina: 2026-06-07 17:10 Europe/Warsaw
- naprawiono: F4/F5 compat guard sprawdzał scrollIntoView globalnie w całym LeadDetail
- decyzja: po F6 top strip jest usunięty, więc guard ma potwierdzać brak scrolla w usuniętym top-stripie, nie blokować innych niezależnych użyć
- zakres: guard/test compatibility repair, bez zmian runtime UI
- wymagane testy: F6/F4/F5/F3/C2/build/diff-check