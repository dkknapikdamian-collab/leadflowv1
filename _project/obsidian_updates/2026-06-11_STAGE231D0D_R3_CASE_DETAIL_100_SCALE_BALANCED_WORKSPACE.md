

# STAGE231D0D-R3_CASE_DETAIL_100_SCALE_BALANCED_WORKSPACE_OBSIDIAN

Data: 2026-06-11 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Decyzja
Nie zamrażać R2 jako finalnego UX. R3 balansuje ekran na 100% skali: działania i notatki obok siebie, prawy rail kompaktowy.

## Ryzyka
- nie dublować notatek,
- nie rozlać historii wpłat i kosztów w railu,
- nie naruszyć R2 source-of-truth,
- nie dodawać SQL/modelu/wykresów.

## Testy
D0D/R3 guard/test, R2 regression, D0C, D0B, build, git diff --check.
