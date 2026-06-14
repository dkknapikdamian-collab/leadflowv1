# Obsidian update — STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

- data i godzina: 2026-06-14 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- report_id: STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL
- status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH / MANUAL_UI_REQUIRED
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- SQL: NOT_TOUCHED

## Decyzja

Manualny test R1B pokazał, że koszty można dodać, ale nie można ich skorygować. Etap R1C dodaje prostą korektę kosztów w tym samym oknie co korekty wpłat.

## Zmiany

- Przycisk: `Koryguj wpłatę/koszt`.
- Jedno okno pokazuje wpłaty/korekty oraz koszty.
- Koszty są czerwone i mają akcje `Koryguj` oraz `Usuń`.
- Korekta kosztu aktualizuje `amount`, `reimbursableAmount`, `reimbursedAmount`, `status`, `note`.

## Testy

- guard R1C
- test R1C
- build
- ręczny test po refreshu

## Ryzyka

- Pełny immutable ledger kosztów nie jest częścią tego etapu.
- Jeśli API kosztów nie obsługuje PATCH/DELETE w runtime, trzeba będzie zrobić osobny backend repair.
