# STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE â€” Obsidian update

- data i godzina: 2026-06-13 00:20 Europe/Warsaw
- projekt: CloseFlow / LeadFlow
- etap: STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE
- typ: hotfix UI/access source / trial 14d
- decyzja: trial ma byc 14 dni wszedzie; sidebar nie moze pokazywac `TRIAL 0 DNI`.
- zmiana: `Layout.tsx` bierze licznik triala z finalnego `access` modelu, a nie z surowego `workspace.subscriptionStatus` i lokalnego `differenceInDays`.
- guard: `scripts/check-stage231e2-r4-trial-card-access-source.cjs`
- testy: guard R4 + guard R2 + guard R3 + build + git diff --check
- ryzyko: jesli swieze konto nadal nie pokazuje 14 dni, problem jest w `/api/me` albo danych `trial_ends_at`, nie w sidebarze.
- nastepny krok: lokalne testy i ewentualnie R5 backend/data repair.
