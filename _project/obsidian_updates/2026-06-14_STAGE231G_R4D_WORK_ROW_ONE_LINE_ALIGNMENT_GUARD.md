# 2026-06-14 - STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT_GUARD

## Routing
- canonical_name: CloseFlow / LeadFlow
- project_id: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzja
Po R4 kod i guardy zamknÄ™Ĺ‚y missing_item, ale screenshot pokazaĹ‚ rozjazd wiersza dziaĹ‚aĹ„. Domykamy wizualny kontrakt work-row zanim przejdziemy do CaseDetail.

## Zakres
- poprawa CSS w `visual-stage14-lead-detail-vnext.css`
- rozszerzenie R4 guard
- nowy guard/test R4D

## Testy
- R3 guard/test
- R4 guard/test
- R4D guard/test
- build
- git diff --check
- manualny test wizualny: status i akcje w jednym wierszu na desktopie

## Ryzyka
- zmiana dotyczy wyĹ‚Ä…cznie LeadDetail action center; nie dotyka CaseDetail, SQL, Google Calendar ani billing/trial.