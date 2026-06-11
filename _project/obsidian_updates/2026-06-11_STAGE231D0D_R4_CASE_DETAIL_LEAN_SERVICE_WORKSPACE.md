# Obsidian update - STAGE231D0D-R4

Data: 2026-06-11 Europe/Warsaw

Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Zmiana: CaseDetail lean service workspace.

Decyzja Damiana: prawy rail ma być krótszy; widoczne dane sprawy i klienta, historia wpłat i kosztowe empty state nie mają zajmować stałego miejsca w railu. Dane nie są kasowane z systemu.

Testy: R4 guard/test, R3/R2 regressions, D0C, build, diff check.

Ryzyka: tabs wyrównane wizualnie; logiczne przeniesienie tabs do left-column można wykonać w osobnym refaktorze, jeśli będzie potrzebne.
