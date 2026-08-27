# Forteca Calm Light — clean staged contract index

PROGRAM: FORTECA_CALM_LIGHT_001_040
CONTRACT_SET: FRT-000..FRT-041
REFERENCE_ROOT: docs/ui/reference/forteca-calm-light
REFERENCE_COUNT: 40
START_BRANCH: codex/forteca-ui-001-040-clean
START_SHA: 3d999dc206ad3d29e255c9d850c4a267c711b18f
STATUS: FRT-000 control-plane initialization

This file is navigation only. The stage contracts below are the only stage
contracts for this program. `_project/WORKFLOW_STATE.json` owns routing; this
README does not create a second workflow state or visual source of truth.

## Stage navigation

| Stage | Reference | Route/state |
|---|---|---|
| FRT-000 | control-plane foundation | repository and contract initialization |
| FRT-001 | 001_today_main.webp | `/` — Today main |
| FRT-002 | 002_today_customize_view.webp | `/` — Today customize overlay |
| FRT-003 | 003_global_add_menu.webp | global app shell — Add menu open |
| FRT-004..009 | 004..009 | `/leads` — list/filter states |
| FRT-010 | 010_lead_detail.webp | `/leads/:leadId` — Lead Detail |
| FRT-011..020 | 011..020 | lead creation/detail contextual flows |
| FRT-021..025 | 021..025 | `/clients` — list/filter states |
| FRT-026..031 | 026..031 | client detail and client creation flows |
| FRT-032..037 | 032..037 | `/cases` and case creation/edit flows |
| FRT-038 | 038_case_detail_service.webp | `/cases/:caseId` — `Obsługa` |
| FRT-039 | 039_case_detail_checklists.webp | `/cases/:caseId` — `Checklisty` |
| FRT-040 | 040_case_detail_history.webp | `/cases/:caseId` — `Historia` |
| FRT-041 | final convergence | all 40 references and final gates |

## Operating rules

- FRT-000 creates the control-plane skeleton and does not implement the 40
  reference screens.
- FRT-001..040 execute one reference at a time: analyze, bounded delegation
  decision, real runtime implementation or independently proven no-change,
  diff review, action-wiring review, targeted tests, browser proof, Guardian,
  documentation, selective commit, push, remote verification, then unlock.
- FRT-041 is the only final convergence stage. It may not introduce a new
  design direction unless a verified root cause requires it.
- A reference image is visual input, not runtime proof. Current runtime,
  accepted behavior, repository contracts and the active Visual SOT win over
  generated details in an image.
- Every required visible control must be real and wired. No fake data, fake
  handlers, placeholder toasts, dead buttons, screenshot hardcoding, weakened
  tests, local one-off CSS, `!important` specificity, or patch-layer CSS.
- One visual concern has one canonical owner. Existing owners are extended
  only when the stage evidence proves the owner cannot express the concern.
- Future stage evidence and PASS receipts are created only from actual
  execution. FRT-000 does not pre-create any future receipt.
- Case Detail has exactly three canonical primary tabs: `Obsługa`,
  `Checklisty`, `Historia`. Extra generated tabs visible in references 039 and
  040 are documented deviations, not product requirements.
- Authenticated populated runtime proof is not an FRT-000 entry condition.
  Authentication may be requested later only when a current reference cannot
  be independently accepted without it.

## Contract schema

Every `FRT-*.md` contract contains exactly these required decision fields:

`STAGE_ID`, `REFERENCE_FILE`, `TARGET_ROUTE`, `TARGET_STATE`, `MISSION`,
`CURRENT_RUNTIME_OWNERS`, `VISUAL_SOT_OWNERS`, `VISIBLE_CONTROL_INVENTORY`,
`BEHAVIOR_TO_PRESERVE`, `KNOWN_REFERENCE_DEVIATIONS`, `ALLOWED_WRITE_SET`,
`EXPECTED_ROOT_CAUSE_OR_GAP`, `ACCEPTANCE_CRITERIA`, `TEST_PLAN`,
`PREDECESSOR`, `SUCCESSOR`.

