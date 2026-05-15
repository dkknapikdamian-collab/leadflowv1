# 15_RELEASE_READINESS - CloseFlow / LeadFlow

Brak zielonego swiatla release bez dowodu z repo, builda, guardow, manualnych testow, auth/workspace isolation, billing/access i confirm-first AI.

Najkrotszy smoke test: login -> workspace -> lead -> case -> task/event -> AI draft -> billing/access -> reload -> drugi user/workspace.
