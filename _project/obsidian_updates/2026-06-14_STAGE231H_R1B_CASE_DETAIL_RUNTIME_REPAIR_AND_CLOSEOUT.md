# Obsidian update — STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- data i godzina: 2026-06-14 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- report_id: STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT
- status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- scope: domknięcie R1B po wykryciu shared CaseFinanceEditorDialog percent-only contractValue bug
- runtime: CaseDetail fake dictation, nextAction, payment copy/history remain guarded; shared finance editor fixed
- case_item source truth decision: two UI entries, one case_items contract
- costs: cost lifecycle left as R1C
- SQL: NOT_TOUCHED
- tests: R1 guard/test, R1B closeout guard/test, build, git diff --check
- manual tests: finance fixed/none/percent, case_item description/status, cost add/summary
- next step: R1C koszt lifecycle + deeper case_item UX unification if manual tests confirm R1B
