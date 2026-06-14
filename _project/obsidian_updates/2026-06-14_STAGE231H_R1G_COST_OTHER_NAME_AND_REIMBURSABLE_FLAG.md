# Obsidian payload - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG

- data i godzina: 2026-06-14 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- report_id: STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- status: ZIP_PREPARED / DO_TEST_AND_PUSH
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- SQL: NOT_TOUCHED

## Zakres
- Pole `Nazwa kosztu` dla typu kosztu `Inny`.
- Fiszka/checkbox `Koszt do zwrotu`, domyślnie zaznaczona.
- Koszt zwrotny zwiększa `Koszty do zwrotu` i `Razem do pobrania`.
- Koszt niezwrotny zostaje tylko w `Koszty poniesione`.
- Korekta kosztu edytuje nazwę, flagę zwrotu, datę, kwoty, status i notatkę.

## Testy
- R1/R1B/R1D/R1F/R1F4/R1G guardy i testy.
- npm run build.
- git diff --check.
- Manualny test serwera po deployu.

## Ryzyka
- Nazwa kosztu `Inny` jest przechowywana w istniejącym polu note, bez SQL. Jeżeli później dodamy dedykowaną kolumnę, trzeba zrobić migrację.
- Jeżeli API kosztów ignoruje `reimbursable`, potrzebny będzie osobny backend/Supabase repair.
