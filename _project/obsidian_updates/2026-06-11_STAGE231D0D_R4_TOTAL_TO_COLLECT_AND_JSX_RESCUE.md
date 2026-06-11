

# STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Data: 2026-06-11 Europe/Warsaw

Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Status: do zapisania w Obsidianie po PASS/PUSH.

Decyzja:
Pierwsza karta prawego panelu CaseDetail musi mieć widoczny wiersz "Razem do pobrania" i korzystać z istniejącego caseCostsSummaryStage231D2.totalToCollectAmount.

Audyt ryzyk:
Nie tworzyć nowego modelu kosztów ani SQL. R4 jest rescue po częściowym R3 i domyka wymaganie guarda.
