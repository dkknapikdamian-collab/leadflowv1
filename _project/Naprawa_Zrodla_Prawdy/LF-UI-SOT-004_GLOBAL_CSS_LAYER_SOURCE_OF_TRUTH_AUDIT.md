# LF-UI-SOT-004 - Global CSS layer source-of-truth audit

Status: AUDIT_MATRIX_RECORDED / DOCS_ONLY / RUNTIME_NOT_TOUCHED / NEEDS_LOCAL_VERIFY
Date: 2026-06-28 03:55 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan report

Read mode: GitHub remote source scan + stage specification from Damian.

Files read / checked:

```txt
src/App.tsx
scripts/check-ui-patch-layers.cjs
_project/04_ETAPY_ROZWOJU_APLIKACJI.md
_project/04_ETAPY_DO_ZATWIERDZENIA_Z_AUDYTU_DIRTY_WORKTREE_2026_06_28.md
```

Files intentionally not changed:

```txt
src/App.tsx
src/styles/*
src/pages/*
src/components/*
src/lib/*
SQL / migrations / Supabase / Firebase / API
```

Current stage context:

```txt
LF-UI-SOT-000: DONE / audit map
LF-UI-SOT-001: DONE / canonical routing
LF-UI-SOT-002R2: DONE in code / patch guard widened
LF-UI-SOT-003: already listed as DONE in central stage file; do not implement again without reconciliation
LF-UI-SOT-004: this audit/matrix stage
```

Important current guard state:

```txt
App.tsx active global CSS imports: 45
App.tsx disabled legacy CSS import: 1
scripts/check-ui-patch-layers.cjs APP_STYLES_IMPORT_MAX for src/App.tsx: 45
```

Decision:

- do not increase CSS import baseline,
- do not add a new global CSS layer,
- do not remove or reorder CSS imports in this audit stage,
- do not edit CSS contents in this audit stage.

## App.tsx CSS import matrix

Pattern counts are marked `LOCAL_SCAN_REQUIRED` until Damian/runner executes local grep/stat scan on the actual worktree. Remote audit confirms import order, naming risk, owner area, and status classification.

| # | CSS import | Exists | Category | Owner area | Status | Naming risk | Runtime pattern count |
|---:|---|---|---|---|---|---|---|
| 1 | `src/styles/closeflow-visual-source-truth.css` | APP_IMPORT | visual base | app shell | ACTIVE_RUNTIME_COMPAT | source-truth | LOCAL_SCAN_REQUIRED |
| 2 | `src/styles/closeflow-action-tokens.css` | APP_IMPORT | tokens | buttons/actions | ACTIVE_TOKEN_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 3 | `src/styles/closeflow-action-clusters.css` | APP_IMPORT | component | buttons/actions | ACTIVE_COMPONENT_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 4 | `src/styles/closeflow-form-actions.css` | APP_IMPORT | component | buttons/actions | ACTIVE_COMPONENT_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 5 | `src/styles/closeflow-card-readability.css` | APP_IMPORT | component | cards | ACTIVE_COMPONENT_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 6 | `src/styles/closeflow-surface-tokens.css` | APP_IMPORT | tokens | surfaces/cards | ACTIVE_TOKEN_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 7 | `src/styles/closeflow-modal-visual-system.css` | APP_IMPORT | modal system | modal/dialog | ACTIVE_MODAL_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 8 | `src/styles/closeflow-metric-tiles.css` | APP_IMPORT | component | cards/metrics | ACTIVE_COMPONENT_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 9 | `src/styles/closeflow-page-header.css` | APP_IMPORT | component | page header | ACTIVE_COMPONENT_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 10 | `src/styles/closeflow-list-row-tokens.css` | APP_IMPORT | tokens | lists/rows | ACTIVE_TOKEN_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 11 | `src/styles/closeflow-alert-severity.css` | APP_IMPORT | tokens | badges/alerts | ACTIVE_TOKEN_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 12 | `src/styles/finance/closeflow-finance.css` | APP_IMPORT | finance system | finance | ACTIVE_FINANCE_SYSTEM | none | LOCAL_SCAN_REQUIRED |
| 13 | `src/styles/closeflow-right-rail-source-truth.css` | APP_IMPORT | component | right rail | ACTIVE_COMPONENT_SYSTEM | source-truth | LOCAL_SCAN_REQUIRED |
| 14 | `src/styles/closeflow-command-actions-source-truth.css` | APP_IMPORT | component | buttons/actions | ACTIVE_COMPONENT_SYSTEM | source-truth | LOCAL_SCAN_REQUIRED |
| 15 | `src/styles/closeflow-page-header-copy-source-truth.css` | APP_IMPORT | component | page header | DO_MIGRACJI | source-truth | LOCAL_SCAN_REQUIRED |
| 16 | `src/styles/closeflow-page-header-action-semantics-packet1.css` | APP_IMPORT | component | page header/buttons | DO_MIGRACJI | packet | LOCAL_SCAN_REQUIRED |
| 17 | `src/styles/closeflow-search-source-truth-stage134.css` | APP_IMPORT | component | search | HOTFIX_STAGE | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 18 | `src/styles/closeflow-right-rail-heading-source-truth-stage135.css` | APP_IMPORT | component | right rail | HOTFIX_STAGE | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 19 | `src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css` | APP_IMPORT | layout | app shell | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 20 | `src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css` | APP_IMPORT | layout | panels | HOTFIX_STAGE | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 21 | `src/styles/closeflow-compact-cards-source-truth-stage151.css` | APP_IMPORT | component | cards | HOTFIX_STAGE | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 22 | `src/styles/closeflow-dense-cards-80-percent-target-stage152.css` | APP_IMPORT | density | cards/density | HOTFIX_STAGE | stage/percent | LOCAL_SCAN_REQUIRED |
| 23 | `src/styles/closeflow-real-density-tokens-no-zoom-stage156.css` | APP_IMPORT | density tokens | density/scale | HOTFIX_STAGE | stage/no-zoom | LOCAL_SCAN_REQUIRED |
| 24 | `src/styles/closeflow-overlay-portal-density-stage158.css` | APP_IMPORT | overlay density | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 25 | `src/styles/closeflow-overlay-real-density-and-footer-stage159.css` | APP_IMPORT | overlay density | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 26 | `src/styles/closeflow-modal-center-and-compact-all-stage160.css` | APP_IMPORT | modal layout | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 27 | `src/styles/closeflow-cf-modal-surface-center-fix-stage161.css` | APP_IMPORT | modal fix | modal/dialog | HOTFIX_STAGE | stage/fix | LOCAL_SCAN_REQUIRED |
| 28 | `src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css` | APP_IMPORT | modal fix | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 29 | `src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css` | APP_IMPORT | modal fix | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 30 | `src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css` | APP_IMPORT | modal fix | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 31 | `src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css` | APP_IMPORT | modal system | modal/dialog | DO_MIGRACJI | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 32 | `src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css` | APP_IMPORT | modal system | modal/dialog | DO_MIGRACJI | stage/no-overlay | LOCAL_SCAN_REQUIRED |
| 33 | `src/styles/closeflow-topic-contact-picker-readable-stage169.css` | APP_IMPORT | component modal | modal/dialog | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 34 | `src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css` | APP_IMPORT | component modal | tasks/modal | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 35 | `src/styles/closeflow-remove-modal-helper-copy-stage171.css` | APP_IMPORT | modal copy | modal/dialog | DO_USUNIĘCIA_PO_GUARDZIE | stage/remove | LOCAL_SCAN_REQUIRED |
| 36 | `src/styles/closeflow-global-client-create-dialog-stage172.css` | APP_IMPORT | component modal | client/modal | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 37 | `src/styles/closeflow-main-search-source-truth-stage173.css` | APP_IMPORT | component | search | DO_MIGRACJI | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 38 | `src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css` | APP_IMPORT | component | search | DO_MIGRACJI | stage/normalization | LOCAL_SCAN_REQUIRED |
| 39 | `src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css` | APP_IMPORT | component | search/secondary pages | DO_MIGRACJI | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 40 | `src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css` | APP_IMPORT | layout | leads/clients layout | HOTFIX_STAGE | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 41 | `src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css` | APP_IMPORT | layout | tasks/right rail | HOTFIX_STAGE | source-truth/stage | LOCAL_SCAN_REQUIRED |
| 42 | `src/styles/closeflow-secondary-pages-full-width-stage181ad.css` | APP_IMPORT | layout | secondary pages | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 43 | `src/styles/closeflow-app-viewport-scale-75-stage201.css` | APP_IMPORT | density/scale | app shell/density | ACTIVE_RUNTIME_COMPAT | stage/scale | LOCAL_SCAN_REQUIRED |
| 44 | `src/styles/closeflow-ops-badges-and-icons-stretch-stage204.css` | APP_IMPORT | component | badges/icons | HOTFIX_STAGE | stage | LOCAL_SCAN_REQUIRED |
| 45 | `src/styles/stage231h-r1e-case-finance-correction-modal-final.css` | APP_IMPORT | finance modal hotfix | finance/modal | HOTFIX_STAGE | stage/final | LOCAL_SCAN_REQUIRED |

Disabled App.tsx import:

| CSS import | Status | Note |
|---|---|---|
| `src/styles/closeflow-viewport-zoom-80-source-truth-stage157.css` | DISABLED_LAYER | disabled in App.tsx comment: STAGE200 disabled legacy visual/sidebar layer |

## Canonical CSS source map

| Area | Current CSS files | Canonical candidate | Files to merge later | Avoid touching now | Guard needed | Manual smoke needed |
|---|---|---|---|---|---|---|
| app shell | visual-source-truth, clean-desktop-shell stage149, viewport-scale stage201 | `closeflow-visual-source-truth.css` + shell tokens | stage149, stage201 | yes | block new App import | Today, Dashboard, mobile |
| buttons/actions | action-tokens, action-clusters, form-actions, command-actions source-truth | `closeflow-action-tokens.css` + action primitive styles | command-actions source-truth | yes | raw button/action guard already exists | all primary actions |
| cards | card-readability, metric-tiles, compact-cards stage151, dense-cards stage152 | `closeflow-card-readability.css` | stage151/stage152 | yes | no new card stage CSS | Today/Leads/Clients/Cases |
| modal/dialog | modal-visual-system + stage158-166 + stage169-172 + finance final | `closeflow-modal-visual-system.css` | stage158-166, 169-172, finance final | yes | modal layer owner guard needed | task modal, finance modal, client create |
| right rail | right-rail-source-truth, right-rail-heading stage135, tasks-right-rail stage178 | `closeflow-right-rail-source-truth.css` | stage135, stage178 | yes | right rail owner guard needed | CaseDetail, Tasks |
| page header | page-header, page-header-copy, page-header-action-semantics | `closeflow-page-header.css` | copy/action semantics layers | yes | page header owner guard needed | Today/Leads/Clients/Cases |
| search | search stage134, main-search stage173-175 | stage173 likely candidate after audit | stage134, 174, 175 | yes | search owner guard needed | main/secondary search |
| lists/rows | list-row-tokens, leads-clients-list-layout stage177 | `closeflow-list-row-tokens.css` | stage177 | yes | list row owner guard needed | Leads/Clients |
| finance | finance/closeflow-finance, case-finance-correction final | `finance/closeflow-finance.css` | stage231h final | yes | finance modal owner guard needed | CaseDetail finance |
| density/scale | density stages 152/156/158/159/201 | `real-density-tokens` only after audit | 152/158/159/201 | yes | no new density layer | 100%, 120%, mobile |

## Conflict map

| ID | Area | Files | Problem | Risk | Next repair stage |
|---|---|---|---|---|---|
| CSS-CONFLICT-001 | page header | page-header, page-header-copy, page-header-action-semantics | Three layers own header/copy/action semantics | header edits may land in wrong file | LF-UI-SOT-005 or page-header consolidation |
| CSS-CONFLICT-002 | modal/dialog | modal-visual-system + stage158-166 + stage169-172 + finance final | Modal stack has many stage/hotfix layers | new modal fixes may add another stage layer | modal source-truth consolidation |
| CSS-CONFLICT-003 | right rail | right-rail-source-truth + right-rail-heading stage135 + tasks stage178 | rail heading and grouped list split owners | CaseDetail/Tasks rail regressions | right-rail owner map |
| CSS-CONFLICT-004 | search | search stage134 + stages173-175 | search source-truth appears duplicated | secondary search may diverge | search source-truth consolidation |
| CSS-CONFLICT-005 | density/scale | stages152/156/158/159/201 | density and zoom are spread across cards, overlays, viewport | browser zoom fixes can fight layout | density/scale owner map |
| CSS-CONFLICT-006 | finance modal | finance CSS + stage231h final | final hotfix exists outside modal system | finance modal may bypass modal canonical style | finance modal integration |
| CSS-CONFLICT-007 | cards/list layout | card-readability + metric tiles + stages151/152/177 | cards and list layout split between base and stage layers | inconsistent cards across Today/Leads/Clients/Cases | active visual template dictionary |

## Guard impact

Current guard relevant findings:

```txt
APP_STYLES_IMPORT_MAX: src/App.tsx => 45
active CSS imports in App.tsx: 45
disabled legacy import in App.tsx: 1
```

Impact:

- current guard baseline is aligned with current `src/App.tsx` active imports,
- do not increase the limit,
- any new global CSS import should fail guard or be treated as explicit blocker,
- recommended next guard extension: make App CSS import matrix explicit in a generated/audited report and block new `stage*.css`, `hotfix`, `final` imports unless a scoped stage approves them.

## What was not touched

- runtime UI,
- CSS contents,
- layout,
- pages,
- components,
- data/business logic,
- SQL/API/Supabase/Firebase,
- App.tsx import order.

## Tests / verify status

Not executed by AI in local repo.

Required local verify:

```powershell
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run guard:config:status-source-of-truth
node --test tests/config-status-source-of-truth.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Expected risk:

```txt
verify:closeflow:quiet may remain VERIFY_BLOCKED_BY_UNRELATED_DIRTY_WORKSPACE until local dirty worktree is stashed or isolated.
```

## Next stage recommendation

```txt
LF-UI-SOT-005_ACTIVE_VISUAL_TEMPLATE_DICTIONARY
```

Before visual cleanup, define active visual templates for Today, Leads, Clients, Cases, CaseDetail, ClientDetail, Calendar, cards, buttons, header, density, right rail and modals.
