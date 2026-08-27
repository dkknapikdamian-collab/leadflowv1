# FRT-000 — VISUAL FOUNDATION AND CONTROL PLANE

CONTRACT_STATUS: ACTIVE
STAGE_ID: FRT-000
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/manifest.json
TARGET_ROUTE: CONTROL_PLANE
TARGET_STATE: clean Forteca program initialization without authenticated runtime proof

MISSION:
  Verify the repository, approved clean branch and 3d999dc206ad3d29e255c9d850c4a267c711b18f
  anchor; independently verify the 40-file reference pack; load the current
  Visual SOT and its owner registry; resolve AI Code Guardian; create this
  exact FRT-000..FRT-041 contract set; establish evidence/test reuse and
  zero-plaster policy; and persist truthful routing for the next stage.
  This stage is control-plane and evidence work only. It does not implement
  references 001..040 and does not require authenticated populated data.

CURRENT_RUNTIME_OWNERS:
  _project/PROJECT_MANIFEST.json; _project/AGENT_CAPABILITIES.json;
  _project/WORKFLOW_STATE.json; AGENTS.md; AGENTS.override.md;
  docs/ui/reference/forteca-calm-light/; src/main.tsx;
  src/lib/source-of-truth/visual-owner-registry.json;
  src/styles/closeflow-visual-source-truth.css

VISUAL_SOT_OWNERS:
  Read and reference, do not duplicate: src/styles/owners/closeflow-foundation.css
  (tokens, typography, spacing, semantic colors); closeflow-surfaces-and-cards.css
  (surfaces, radii, shadows); closeflow-page-shell.css (shell/header/sidebar);
  closeflow-actions.css plus src/components/ui/button.tsx and
  src/components/entity-actions.tsx (buttons and action clusters);
  closeflow-icons.css plus src/components/ui-system/icon-registry.ts and
  EntityIcon/SemanticIcon (icons); closeflow-metrics.css and MetricTile;
  closeflow-records-and-rails.css and StatusPill/ListRow; closeflow-dialogs.css
  (forms and modals); closeflow-search-and-density.css (search/filter);
  closeflow-responsive-adapters.css (responsive density); closeflow-calendar.css.

VISIBLE_CONTROL_INVENTORY:
  Control-plane only: branch/ref checks, manifest/file/hash/dimension checks,
  required UI map and style map audits, skill-pack and premap checks, contract
  schema check, JSON/state check, Guardian audit, diff check, selective git
  commit, normal push and remote-head verification. No product control is
  accepted or fabricated by this stage.

BEHAVIOR_TO_PRESERVE:
  LF-UI-SOT-007 remains ACCEPTED_AND_CLOSED; existing runtime, data scope,
  auth boundaries and canonical Visual SOT remain unchanged. The reference
  pack remains REFERENCE_ONLY and never becomes runtime data.

KNOWN_REFERENCE_DEVIATIONS:
  The reference pack contains 40 views only (the manifest describes a larger
  planned map); Forteca is a working mockup label, not a product-brand decision;
  references 039 and 040 contain extra generated tabs, while Case Detail stays
  Obsługa/Checklisty/Historia. The repository AGENTS.override.md contains a
  stale historical LF branch sentence; record the mismatch, do not repair the
  old LF workflow or overwrite the instruction file in this stage.

ALLOWED_WRITE_SET:
  _project/contracts/forteca-clean/README.md;
  _project/contracts/forteca-clean/FRT-000..FRT-041 contract files;
  _project/WORKFLOW_STATE.json;
  audit/evidence/FRT-000_FORTECA_BASELINE.json;
  the four tracked generated UI/style map outputs changed by the required
  premap commands. No src runtime, auth, database, provider, production,
  accepted LF-UI contract or unrelated untracked path may be changed.

EXPECTED_ROOT_CAUSE_OR_GAP:
  The clean Forteca branch begins at the reference-pack anchor with the old
  LF-UI workflow closed but without a canonical FRT contract directory or FRT
  next-stage pointer. The current instruction file also carries stale old
  branch wording. The gap is control-plane routing and evidence indexing, not
  missing authenticated runtime data and not a CSS defect.

ACCEPTANCE_CRITERIA:
  Repository identity, branch, start SHA and remote truth are recorded;
  manifest has exactly 40 sequential files and every file has independently
  verified name, byte count, SHA-256 and 1672x941 dimensions; current Visual
  SOT and owner registry are referenced; all 42 exact contract files exist and
  pass required-field validation; no future receipt exists; evidence/test
  reuse decisions include matching SHA/worktree/config/scope/guard/freshness;
  zero-plaster/root-cause rules are explicit; required premap checks and final
  Guardian audit are recorded truthfully; WORKFLOW_STATE has one current FRT-000
  stage and `next_stage` FRT-001 only; selective commit, normal push and
  remote-head verification succeed. FRT-001 remains controller-locked until
  FRT-000 acceptance is independently recorded; no self-acceptance is claimed.

TEST_PLAN:
  Run or reuse only the required bounded checks: audit:closeflow-ui-map,
  audit:closeflow-style-map, check:closeflow-ui-skill-pack,
  check:closeflow-ui-premap-contract; manifest/hash/bytes/dimensions verifier;
  contract/state JSON validator; git diff --check; final AI Code Guardian
  AUDIT_ONLY for this exact worktree and scope. Do not run browser/auth tests
  because FRT-000 has no runtime route-state acceptance requirement. Reuse
  LF-UI evidence only for unchanged owner facts when its SHA, scope,
  configuration, guard version and freshness match; otherwise mark it stale.

PREDECESSOR: NONE (new Forteca program after LF-UI-SOT-007 ACCEPTED_AND_CLOSED)
SUCCESSOR: FRT-001

