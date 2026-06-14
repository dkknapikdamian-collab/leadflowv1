# 2026-06-14 — STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION

- Status: ZIP_PREPARED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Project: CloseFlow / LeadFlow
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- SQL nie ruszany.

## Zakres

R1F naprawia brak wykryty na serwerze po R1D:
- wpłaty prowizji mają mieć realny przycisk `Koryguj`;
- korekta wpłaty edytuje istniejącą wpłatę: kwotę, datę i opis/dopisek;
- korekta kosztu edytuje pełne dane kosztu: rodzaj, datę, kwotę, zwrot, status i notatkę;
- nie rozpoczynać ClientDetail przed testem R1F na serwerze i późniejszym memory closeout R1C2.

## Testy

Do wykonania:
- R1/R1B/R1C/R1D/R1F guardy i testy,
- build,
- diff-check,
- serwerowy test korekty wpłaty i kosztu po refreshu.

## Ryzyka

- API payment PATCH może wymagać backend repair, jeśli serwer odrzuci update istniejącej wpłaty.
- R1C2 memory closeout nadal osobno po potwierdzeniu runtime.
