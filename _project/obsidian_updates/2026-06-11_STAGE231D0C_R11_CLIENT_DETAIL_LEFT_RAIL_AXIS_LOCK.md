# STAGE231D0C/R11 - ClientDetail left rail axis lock

- data i godzina: 2026-06-11 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: visual fix / spacing axis lock
- zakres: desktop-only CSS axis lock for ClientDetail left rail
- powód: production screenshot after R9/R10 still showed the left rail too high versus the first right rail card
- czego nie ruszano: JSX, data, SQL, top overview tiles, active case compact card, CaseDetail, LeadListCard runtime
- testy: R11 guard/test, R9/R7 regressions where present, ClientDetail baseline, ClientListCard regression, git diff --check, build
- audyt ryzyk: desktop offset reset below 1180px; final acceptance requires visual screenshot
- następny krok: push after PASS and verify /clients/<id> after deploy
