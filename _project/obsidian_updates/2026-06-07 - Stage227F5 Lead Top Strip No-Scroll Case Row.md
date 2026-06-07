# 2026-06-07 - Stage227F5 Lead Top Strip No-Scroll Case Row

- data i godzina: 2026-06-07 16:30 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: UI/layout correction + scroll state repair
- decyzja: top strip LeadDetail nie scrolluje i nie używa hash anchors
- testy: F5/F4/F3/C2/build/diff-check
- audyt ryzyk po etapie: sprawdzić deploy wizualnie i stare URL-e z hashem
- następny krok: po akceptacji wrócić do Stage227C3 runtime wiring Brak
## F5R7 — build/guard hotfix
- data i godzina: 2026-06-07 16:45 Europe/Warsaw
- naprawiono: BOM w package.json blokujący build
- naprawiono: F3 guard oczekiwał starego selektora .case-detail-card-page-header zamiast aktualnego .case-detail-header
- zakres: guard/build hotfix, bez zmian SQL/Supabase/runtime danych
- wymagane testy: F5/F4/F3/C2/build/diff-check