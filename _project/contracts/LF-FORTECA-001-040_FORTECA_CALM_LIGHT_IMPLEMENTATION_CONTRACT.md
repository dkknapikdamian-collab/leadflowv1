# LF-FORTECA-001-040 — FORTECA CALM LIGHT REFERENCE IMPLEMENTATION PROGRAM

Status: ACTIVE
Project: CloseFlow / LeadFlow / CaseFlow
Project ID: closeflow_lead_app
Repository: dkknapikdamian-collab/leadflowv1
Canonical application branch: dev-rollout-freeze
Implementation branch: feat/forteca-ui-implementation-20260826
Reference commit: 3d999dc206ad3d29e255c9d850c4a267c711b18f
Reference root: docs/ui/reference/forteca-calm-light
Reference manifest: docs/ui/reference/forteca-calm-light/manifest.json
Reference README: docs/ui/reference/forteca-calm-light/README.md
Reference master spec: docs/ui/reference/forteca-calm-light/MASTER_VISUAL_SPEC.md
Reference range: 001-040
Branch verification: REFERENCE_COMMIT is ancestor of feat branch HEAD (verified 20260826)
Manifest verification: image_count=40 (verified), 40 WebP 001-040 present with manifest entries
Task class for design: TECHNICAL_IMPLEMENTATION_STAGE_DESIGN
Task class for code: CODE_CHANGE
Guardian: ai-code-guardian REQUIRED, loading order PLUGIN_FIRST_REPOSITORY_FALLBACK, canonical fallback skills/ai-code-guardian/SKILL.md

## 1. Mission

Implement the COMPLETE approved 001-040 Forteca Calm Light reference set into the real CloseFlow application, image-by-image, functional and visual. No dead controls, no fake implementation, no parallel visual SOT. Every reference receives its own reconciliation, runtime wiring, targeted tests, typecheck/lint/build/diff-check, guardian coverage and browser proof on the real production route/state.

Sequential order: STAGE 000 -> STAGE 001 (001) -> ... -> STAGE 040 (040). One reference = one acceptance unit.

## 2. Hard execution model

- Implementation branch is ONLY feat/forteca-ui-implementation-20260826. Do NOT mutate main or dev-rollout-freeze. No self-merge into production.
- Branch base verified at 3d999dc (dev-rollout-freeze descendant). If currently on another branch, switch only safely without destroying local work (no reset/clean/stash-as-shortcut).
- AI Code Guardian is REQUIRED for stage design and code change. Load installed plugin first, else canonical repository fallback defined by AGENT_CAPABILITIES.json. If both unavailable => BLOCKED_REQUIRED_CAPABILITY_UNAVAILABLE. Never fake PASS.
- ONE_OWNER_PER_VISUAL_CONCERN mandatory. Do NOT create FortecaButton2 / NewCardV3 / parallel tokens.
- Visual SOT owners are those registered in src/lib/source-of-truth/visual-owner-registry.json and reachable via src/styles/closeflow-visual-source-truth.css. Extend/reconcile existing owner; create new owner only with evidence that current owner cannot represent the concern.
- Canonical workflow SOT is _project/WORKFLOW_STATE.json. This contract is the sole implementation contract for 001-040. Do not maintain competing state files.

## 3. Reference priority when conflicts arise

1. real runtime / accepted product behavior
2. current canonical repository contracts
3. existing accepted Visual SOT (visual-owner-registry.json + visual-repository.ts)
4. manifest.json / README known deviations (e.g., 039/040 extra tabs)
5. reference screenshot pixels
6. generated copy/detail visible only inside AI screenshot (lowest priority)

Do NOT invent backend features for decorative AI buttons. Do NOT remove working product features because one screenshot omits them. Do NOT rename product to Forteca — Forteca is working mockup label only.

Case Detail special rule: canonical tabs remain exactly Obsługa / Checklisty / Historia. 038=Obsługa visual target, 039=Checklisty visual target, 040=Historia visual target. Ignore AI-generated extra tabs in 039/040.

## 4. Existing visual SOT owner inventory (reconciled at Stage 000)

Inventory taken from visual-owner-registry.json, visual-repository.ts, src/styles/*, src/components/* at REFERENCE_COMMIT 3d999dc.

| Concern | Canonical Owner | Scope | Consumer Roots | Notes |
|---|---|---|---|---|
| Page shell + application shell | src/components/layout/app-shell.tsx + src/components/layout/page-shell.tsx + src/components/Layout.tsx (legacy shell wrapper) | global | src/styles/owners/closeflow-page-shell.css, src/styles/closeflow-visual-source-truth.css, src/components/ui-system/PageShell.tsx | AppShell is thin wrapper; Layout.tsx is current runtime shell (sidebar+content). ONE OWNER per layout variant; extend page-shell.css not duplicate. |
| Sidebar + header shell | src/components/layout/sidebar-nav.tsx + src/components/layout/page-header.tsx | global | src/styles/owners/closeflow-page-shell.css, src/styles/owners/closeflow-foundation.css, src/lib/page-header-content.ts | SidebarNav and PageHeader are thin presentational owners; visual authority is CSS owner + icon registry. |
| Cards / surfaces / radii / shadows | src/styles/owners/closeflow-surfaces-and-cards.css | global | src/styles/closeflow-visual-source-truth.css, src/components/ui/card.tsx, src/components/ui-system/SurfaceCard.tsx | Single owner for surface/radius/shadow. Do not create per-page card CSS. |
| Typography / spacing / tokens / semantic colors | src/styles/owners/closeflow-foundation.css | global | src/styles/closeflow-visual-source-truth.css, src/components/ui-system/semantic-visual-registry.ts | Tokens, typography, spacing, semantic colors single owner. |
| Buttons / action clusters | src/styles/owners/closeflow-actions.css | global | src/styles/closeflow-visual-source-truth.css, src/components/ui/button.tsx, src/components/ui-system/ActionCluster.tsx, src/components/entity-actions.tsx | BUTTONS_ACTIONS owner. Variants: primary/secondary/ghost/destructive. Do not add FortecaButton. |
| Icon geometry + icon registry | src/ui-system/icons/SemanticIcon.tsx + src/styles/design-system/closeflow-icons.css | global | src/components/ui-system/ActionIcon.tsx, src/components/ui-system/EntityIcon.tsx, src/lib/source-of-truth/icon-registry.ts | ICON_GEOMETRY single owner. Use semantic registry, not raw lucide color patches. |
| Metric tiles / cards | src/styles/owners/closeflow-metrics.css | global | src/components/ui-system/MetricTile.tsx, src/components/ui-system/MetricGrid.tsx, src/components/StatShortcutCard.tsx | CARDS_TILES owner. MetricTile is primitive; OperatorMetricTiles composes. |
| Status pills / badges / semantic tones | src/styles/owners/closeflow-records-and-rails.css | global | src/components/ui-system/StatusPill.tsx, src/components/ui/badge.tsx, src/lib/source-of-truth/status-repository.ts | BADGES owner; separates visual tone from business status truth. |
| Entity cards / contact cards | src/components/entity-contact-card.tsx + src/styles/owners/closeflow-rails-and-detail.css | global / detail scoped | src/pages/LeadDetail.tsx, ClientDetail, CaseDetail | Entity cards reuse rail owner; do not duplicate. |
| Action clusters / row actions | src/components/entity-actions.tsx + src/components/ui-system/ActionCluster.tsx | global | src/components/ui-system/ActionIcon.tsx | Single action cluster owner. |
| Lists / tables / rows | src/styles/owners/closeflow-records-and-rails.css | global | src/components/ui-system/ListRow.tsx, src/components/ui/list-card.tsx, src/components/ui/table.tsx | LIST_ROWS owner. Extend/reconcile; don’t create NewListV3. |
| Forms / fields / selects | src/styles/owners/closeflow-dialogs.css | global | src/components/ui-system/FormFooter.tsx, src/components/ui/form-field.tsx, input/select/textarea | FORMS owner. |
| Dialogs / modals | src/styles/owners/closeflow-dialogs.css | global | src/components/ui/dialog.tsx, confirm-dialog.tsx, ContextActionDialogs, TaskCreateDialog | MODALS owner. Footer = Cancel + Primary; no overlay intercepting clicks. |
| Filter toolbars / search / chips / selects | src/styles/owners/closeflow-search-and-density.css | route-scoped | src/pages/Leads.tsx, Clients, Cases, src/components/ui/filter-toolbar.tsx etc | SEARCH owner (route-scoped). Leads/Clients/Cases share. |
| Responsive / density / breakpoints | src/styles/owners/closeflow-responsive-adapters.css + src/styles/page-adapters/page-adapters.css + src/styles/core/core-contracts.css | route-scoped/entry | pages, app-shell, page-shell | Single responsive density owner; no fixed widths that break tablet/desktop. |
| Page-specific visual adapters | src/styles/page-adapters/page-adapters.css + src/styles/owners/closeflow-page-adapters.css | route-scoped | scoped page files | Allowed only with metadata: role=scoped-adapter, boundary, whyNotGlobal, whyNotDuplicate. |
| Calendar-specific visuals | src/styles/owners/closeflow-calendar.css | route-scoped | src/pages/Calendar.tsx | CALENDAR owner. |
| Right rail | src/styles/owners/closeflow-records-and-rails.css | global | src/components/Layout.tsx rails | Shares owner with LIST_ROWS/BADGES. No duplicate rail CSS. |

Forbidden historical patterns (must not reintroduce): stage*.css, hotfix*.css, eliteflow*.css, emergency/*.css, temporary/*, legacy/*, final-lock, packet* — these are legacy patch layers retired by LF-UI-SOT-007.

If a concern truly cannot be represented by current owner, evidence must be recorded in contract and guardian receipt before creating a scoped adapter with the required metadata.

## 5. Global visual direction (Forteca Calm Light)

- Canvas #F7F9FC, Surface #FFFFFF, Surface subtle #F8FAFC, Border #E5EAF2
- Text primary #0F172A, secondary #64748B, muted #94A3B8
- Primary blue restrained #2563EB / soft #EFF6FF
- Semantic accents only: danger #EF4444 soft #FEF2F2, warning #F59E0B soft #FFFBEB, success #16A34A soft #F0FDF4, violet #8B5CF6 soft #F5F3FF
- Typography Inter/Geist grotesk, header desktop 28-32 semibold, base 13-14, meta 11-12, KPI 24-30
- Geometry: 8px grid, card radius 14-16, button radius 10-12, input height 40-44, gutters 24-32, card pad 16-20
- Shadows subtle, one icon family 16-20 line 1.5-2px, one function = one semantic icon, destructive always danger language, date field exactly one clickable calendar icon
- Hierarchy/spacing/density high clarity, restrained color, no dashboard noise, no arbitrary gradients, no visual gimmicks, no oversized whitespace, no masking broken runtime with CSS

## 6. Reference implementation matrix 001-040

Each entry reconciles manifest.json label + MASTER_VISUAL_SPEC mapping to a real route/state, real page/component, real data source, visible actions with handler verification, visual SOT owner, and acceptance receipts.

IMPLEMENTATION_STATUS values: TODO | IN_PROGRESS | PASS | BLOCKED
Each PASS requires: targeted action-wiring tests, relevant regression tests, TSC, lint, build (if warranted), git diff --check, guardian receipt for exact scope, and one browser proof on the real route/state compared to WebP.

| REFERENCE_ID | REFERENCE_FILE | TARGET_ROUTE | TARGET_STATE | PRIMARY_PAGE | SHARED_COMPONENTS | REAL_DATA_SOURCE | VISIBLE_ACTIONS | ACTION_HANDLERS | VISUAL_SOT_OWNER | IMPLEMENTATION_STATUS | TEST_RECEIPT | BROWSER_PROOF | COMMIT_SHA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 001 | 001_today_main.webp | / (canonical) alias /today | Dziś — główny, loaded | src/pages/TodayStable.tsx | AppShell, PageHeader, MetricTile/MetricGrid, Section cards, OperatorSideCard, Search/density | src/lib/today-sections.ts, workspace scope, tasks/events/leads/cases, drafts if plan enabled, useWorkspace hook | Dostosuj widok, Dodaj (split), KPI tile clicks filtering sections, section expand/collapse, quick action Add task/event, navigation to Leads/Cases/Tasks/Calendar | onClick Dostosuj widok -> local state/modal, Dodaj split -> quick add dialogs, metric tile -> filter state, section toggle -> collapsed state, quick action triggers -> ContextActionDialogs/EventCreateDialog | PAGE_SHELL, CARDS_TILES, TYPOGRAPHY/SPACING/SURFACES, BUTTONS_ACTIONS, LIST_ROWS | TODO | _ | _ | _ |
| 002 | 002_today_customize_view.webp | / | Dziś — Dostosuj widok overlay | src/pages/TodayStable.tsx (+ customization dialog/popover) | PageHeader action, Dialog/FormFooter, Checkbox group, Button cluster | src/lib/app-preferences.ts or Today preferences store, persistence via Supabase/user prefs | Checkboxes per section, Reorder (if implemented — otherwise not faked), Przywróć domyślne, Zapisz / Anuluj / close X | checkbox onChange -> pendingPrefs state, reorder onDrag (only if real impl, else omitted with GAP), reset -> default prefs, save -> persist + close + rerender, cancel/close -> discard | MODALS/FORMS, BUTTONS_ACTIONS, SURFACES | TODO | _ | _ | _ |
| 003 | 003_global_add_menu.webp | * (global overlay) | Globalne menu Dodaj (OperatorTopBarRuntime) | src/components/OperatorTopBarRuntime.tsx + src/components/Layout.tsx global bar | Dialog/DropdownMenu, ActionCluster, Button, SemanticIcon | no data fetch; menu triggers entity creation dialogs via handlers in Layout/App | Dodaj trigger, menu items: Lead/Klient/Sprawa/Zadanie/Wydarzenie/Szkic (only if feature active), outside click/ESC close | onClick Dodaj -> open menu, menu item onSelect -> open specific create dialog (ClientCreateDialog/TaskCreateDialog/EventCreateDialog/GlobalAiAssistant etc), ESC/outer click -> close | MODALS, BUTTONS_ACTIONS, ICONS, PAGE_SHELL | TODO | _ | _ | _ |
| 004 | 004_leads_all.webp | /leads | Leady — Wszystkie | src/pages/Leads.tsx | PageHeader, MetricGrid/MetricTile, Search field, FilterChipGroup/FilterToolbar, ListRow/Table, StatusPill, ActionIcon | src/lib/leads.ts filtered by status=all, workspace scoped query, search-normalization | Dodaj leada (primary), Import CSV (if enabled), search input, filter chips (Status/Source/Risk/Cadence), Więcej filtrów, Reset, row click -> LeadDetail, row overflow actions | Add -> ClientCreateDialog variant for Lead, Import -> CSV handler, search onChange debounced filter, chip onChange -> query refetch, row click navigate, overflow menu actions -> entity-actions handlers | PAGE_SHELL, CARDS_TILES, SEARCH, LIST_ROWS, BADGES, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 005 | 005_leads_active.webp | /leads | Leady — Aktywne (quick filter Aktywne) | src/pages/Leads.tsx | same as 004 plus active filter state | src/lib/leads.ts where status active, owner-control risk helpers | Same as 004 plus filtered KPI active highlighted | same handlers; metric tile active = filter Aktywne | CARDS_TILES, LIST_ROWS, SEARCH, BADGES | TODO | _ | _ | _ |
| 006 | 006_leads_at_risk.webp | /leads | Leady — Zagrożone | src/pages/Leads.tsx | same | src/lib/owner-control/owner-risk-rules, lead-health, query risk=HIGH | Same header/search/table plus risk badges | same; risk chip selected | CARDS_TILES, LIST_ROWS, BADGES, TYPOGRAPHY | TODO | _ | _ | _ |
| 007 | 007_leads_history.webp | /leads | Leady — Historia | src/pages/Leads.tsx | same | src/lib/leads.ts history filter (won/lost/moved_to_case) | Same plus history segmented view | same; metric/history tile active | CARDS_TILES, LIST_ROWS, SURFACES | TODO | _ | _ | _ |
| 008 | 008_leads_rescue.webp | /leads | Leady — Do odzyskania (rescue) | src/pages/Leads.tsx | same + rescue priority grouping | src/lib/owner-control/lost-lead-rescue, rescue bucket logic | Prioritized rescue list, CTA Ustaw kolejny krok per row | CTA -> open Next Step prompt / TaskCreateDialog with lead context | LIST_ROWS, BADGES, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 009 | 009_leads_trash.webp | /leads | Leady — Kosz / archiwalne (soft delete) | src/pages/Leads.tsx | same + archived filter | src/lib/leads.ts archived/trash query, soft delete state | Restore, Hard delete (if workflow allows) per row, Empty trash bulk | restore onClick -> unarchive mutation, hard delete -> confirm dialog -> delete, bulk -> confirm | LIST_ROWS, MODALS (confirm), BUTTONS_ACTIONS danger | TODO | _ | _ | _ |
| 010 | 010_lead_detail.webp | /leads/:leadId | Szczegół aktywnego leada — Preview first, Edit on click | src/pages/LeadDetail.tsx | PageHeader with back Leady, EntityContactCard, Decision cards (SurfaceCard/MetricTile), Tabs if any, ActionCluster quick actions, Notes/Activity rail | src/lib/leads.ts single lead fetch, src/lib/lead-health, nearest-action, notes/activities, workspace scope | Back to Leads, Edytuj, ... overflow, primary contextual: Ustaw kolejny krok / Rozpocznij obsługę / Otwórz sprawę, Quick actions Zadzwoń/Email/Notatka/Zadanie/Spotkanie/Brak, phone/email links | all handlers wired: navigate back, open Edit modal, overflow menu actions, next step prompt, start case dialog, quick action dialogs (ContextNoteDialog etc), tel/mailto | PAGE_SHELL, SURFACES, CARDS_TILES, BUTTONS_ACTIONS, ICONS, RIGHT_RAIL, MODALS | TODO | _ | _ | _ |
| 011 | 011_lead_add_modal.webp | /leads (modal overlay) | Dodaj leada — modal | src/pages/Leads.tsx triggering src/components/ClientCreateDialog.tsx or Lead Create dialog | Dialog, FormField/Input/Select/Textarea, FormFooter, Button, semantic validation | src/lib/leads.ts create, workspace-scoped mutation, duplicate detection handled by 013 | Form fields: nazwa, źródło, wartość/potencjał, status, ostatni kontakt, email/telefon/firma/summary/notes; Footer Anuluj + Utwórz leada; Quick follow-ups after create: Dodaj zadanie / Ustaw kolejny krok (if in image, verify wiring) | onSubmit -> validate -> create -> toast/success -> close -> list refetch -> optional follow-up dialogs, onCancel/close -> discard, field onChange -> controlled state | MODALS/FORMS, BUTTONS_ACTIONS, ICONS | TODO | _ | _ | _ |
| 012 | 012_lead_edit_modal.webp | /leads/:leadId (modal) | Edytuj leada — modal | src/pages/LeadDetail.tsx or Leads inline | Same form primitives as 011 prepopulated | src/lib/leads.ts update, existing values | Same fields as add but populated, Save/Update CTA | onSubmit -> update mutation -> close -> detail refetch, cancel -> discard | MODALS/FORMS, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 013 | 013_lead_duplicate_conflict.webp | /leads (modal) | Konflikt duplikatu leada | src/components/EntityConflictDialog.tsx | Dialog, ListRow for candidates, Button cluster, StatusPill | src/lib/entity-conflicts or lead duplicate check, candidate query | Open existing (per candidate), Anuluj, Dodaj mimo to (explicit force create) | Open existing -> navigate to candidate lead, cancel -> close, force -> create despite duplicate with flag | MODALS, LIST_ROWS, BUTTONS_ACTIONS, BADGES | TODO | _ | _ | _ |
| 014 | 014_lead_add_task.webp | /leads/:leadId (modal) | Lead — Dodaj zadanie | src/pages/LeadDetail.tsx via src/components/TaskCreateDialog.tsx or ContextActionDialogs | Dialog, FormField (title/type/relation/date/time/priority/status/reminder/recurrence), FormFooter | src/lib/tasks.ts create with relation leadId, workspace scope | Create task fields + save | onSubmit -> create task linked to lead -> close -> detail task list refetch, cancel -> close | MODALS/FORMS, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 015 | 015_lead_add_note.webp | /leads/:leadId (modal) | Lead — Dodaj notatkę | src/components/ContextNoteDialog.tsx | Dialog, TextareaField, Relation picker, FormFooter | src/lib/notes or activity notes, lead relation | Note textarea + Save | onSubmit -> create note -> close -> activity reload, cancel -> close | MODALS/FORMS, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 016 | 016_lead_add_event.webp | /leads/:leadId (modal) | Lead — Dodaj spotkanie / wydarzenie | src/components/EventCreateDialog.tsx | Dialog, FormField date/time/type, recurrence, reminder, Relation | src/lib/calendar-items.ts / events, workspace scope, google-calendar if enabled | Event fields + Status/Recurrence/Reminder | onSubmit -> create event -> close -> calendar/detail reload, cancel -> close | MODALS/FORMS, BUTTONS_ACTIONS, CALENDAR | TODO | _ | _ | _ |
| 017 | 017_lead_add_missing_blocker.webp | /leads/:leadId (modal) | Lead — Dodaj brak / blokadę | src/components/AddCaseMissingItemDialog.tsx (lead variant) | Dialog, Select type, Text title/description, Checkbox blocksProgress, Relation, optional deadline | src/lib/missing-items / stage227c1 contract, lead scope | Add blocker form | onSubmit -> create missing item -> close -> blocker summary + list reload | MODALS/FORMS, BUTTONS_ACTIONS, BADGES | TODO | _ | _ | _ |
| 018 | 018_lead_missing_blockers_list.webp | /leads/:leadId (dialog/manager) | Lead — Braki i blokady lista/manager | src/pages/LeadDetail.tsx blocker manager section/dialog | Dialog or inline card, ListRow with blocker toggle, StatusPill, ActionIcon edit/delete/resolve | src/lib/missing-items fetch for lead, active vs all | Zobacz wszystkie braki, active toggle, Edit, Delete, Resolve | open manager -> fetch, toggle blocker -> patch, resolve -> patch, edit/delete -> dialogs with handlers | LIST_ROWS, BADGES, MODALS, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 019 | 019_lead_next_step_prompt.webp | /leads/:leadId (light prompt) | Lead — Ustaw kolejny krok prompt | src/pages/LeadDetail.tsx / src/components/LeadStartServiceDialog? prompt component | SurfaceCard/Modal light, Button cluster | lead next-action state, task completion trigger if lead has no next step after action | Jutro / Przypomnij jutro, Niestandardowo/Custom date, Zostaw bez kroku | onClick Jutro -> schedule tomorrow action, Custom -> open date picker, Leave without step -> dismiss with flag; all wired to persistence, not console.log | SURFACES, BUTTONS_ACTIONS, MODALS light | TODO | _ | _ | _ |
| 020 | 020_lead_start_case.webp | /leads/:leadId (modal) | Lead — Rozpocznij obsługę / utwórz sprawę | src/components/LeadStartServiceDialog.tsx + src/components/CreateClientCaseDialog.tsx | Dialog, Client/Case title, Template select, Starter state, FormFooter | src/lib/lead-case-handoff.ts, src/lib/cases/create-client-case.ts, lead->client/case transition | Create and redirect; form fields + primary Rozpocznij obsługę | onSubmit -> create case + migrate lead -> navigate to /cases/:newCaseId, cancel -> close | MODALS/FORMS, BUTTONS_ACTIONS, SURFACES | TODO | _ | _ | _ |
| 021 | 021_clients_all.webp | /clients | Klienci — Wszyscy | src/pages/Clients.tsx | PageHeader, MetricGrid, Search, FilterChip, ListRow/Table, TopValueRecordsCard rail? | src/lib/clients.ts all, workspace scope | Dodaj klienta (primary), search, filter pills, sort wartość, row -> ClientDetail | Add -> ClientCreateDialog, search/filter handlers, row nav | PAGE_SHELL, CARDS_TILES, SEARCH, LIST_ROWS, BADGES, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 022 | 022_clients_without_case.webp | /clients | Klienci — Bez sprawy | src/pages/Clients.tsx | same + Bez sprawy filter state | src/lib/clients.ts where activeCaseCount=0 | Same | same filtered | LIST_ROWS, BADGES | TODO | _ | _ | _ |
| 023 | 023_clients_need_contact.webp | /clients | Klienci — Wymaga kontaktu | src/pages/Clients.tsx | same | src/lib/clients.ts need-contact cadence, owner-control contact-cadence-grid | Same + cadence badges | same | BADGES, LIST_ROWS | TODO | _ | _ | _ |
| 024 | 024_clients_active_commission.webp | /clients | Klienci — Aktywna prowizja | src/pages/Clients.tsx | same + commission metric | src/lib/clients.ts with active commission, client-finance | Same | same | CARDS_TILES, LIST_ROWS, BADGES | TODO | _ | _ | _ |
| 025 | 025_clients_archived.webp | /clients | Klienci — Archiwalne | src/pages/Clients.tsx | same + archived filter | src/lib/clients.ts archived query | Restore per row, actions | restore handler | LIST_ROWS, BADGES, MODALS | TODO | _ | _ | _ |
| 026 | 026_client_detail.webp | /clients/:clientId | Szczegół klienta | src/pages/ClientDetail.tsx | PageHeader, EntityContactCard left, Hero decision cards, Tabs, Right rail quick actions, Finance summary rail, Checklist/history middle | src/lib/clients.ts single, src/lib/client-cases.ts, client-finance summary, activity | Nowa sprawa (primary), Edytuj, overflow, Dane klienta Edytuj, + Nowa sprawa rail, quick actions note/task/event/brak | Nowa sprawa -> CreateClientCaseDialog with clientId, Edit -> ClientCreateDialog edit, quick actions -> respective dialogs, finance actions | PAGE_SHELL, SURFACES, RIGHT_RAIL, CARDS_TILES, BUTTONS_ACTIONS, MODALS | TODO | _ | _ | _ |
| 027 | 027_client_detail_no_active_case.webp | /clients/:clientId | Szczegół klienta — bez aktywnej sprawy (empty active case state) | src/pages/ClientDetail.tsx state variant | same but empty state card for Aktywne sprawy section | same data but filtered activeCases=0 | Secondary states: empty message + CTA Utwórz pierwszą sprawę | CTA -> same as Nowa sprawa | SURFACES, CARDS_TILES, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 028 | 028_client_detail_closed_cases.webp | /clients/:clientId | Szczegół klienta — sprawy zamknięte (history section) | src/pages/ClientDetail.tsx with closedCases expanded | Tabs/accordion section for Zamknięte sprawy, ListRow for closed cases, Restore where allowed | src/lib/client-cases.ts closed query | Przywróć sprawę per closed row, open closed case row nav | Przywróć -> patch case status -> reload, row click -> navigate | LIST_ROWS, BADGES, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 029 | 029_client_add_modal.webp | /clients (modal) | Dodaj klienta — modal | src/components/ClientCreateDialog.tsx | Dialog, FormField name/company/email/phone/lastContact/notes, Checkbox Utwórz od razu sprawę + nazwa sprawy conditional, FormFooter | src/lib/clients.ts create, optional case creation | Create client form | onSubmit -> create client (+ optional case) -> close -> list reload -> optional navigate, cancel -> close | MODALS/FORMS, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 030 | 030_client_edit_modal.webp | /clients/:clientId (modal) | Edytuj klienta — modal | src/components/ClientCreateDialog.tsx edit mode | same as 029 prepopulated | src/lib/clients.ts update | Update CTA | onSubmit update -> close -> detail reload | MODALS/FORMS | TODO | _ | _ | _ |
| 031 | 031_client_new_case_modal.webp | /clients/:clientId (modal) | Klient — Nowa sprawa | src/components/CreateClientCaseDialog.tsx | Dialog, Client read-only, Title, Template select, starter state, FormFooter | src/lib/cases/create-client-case.ts with clientId | Create case | onSubmit -> create case for client -> close -> reload client cases -> optional navigate to new case, cancel -> close | MODALS/FORMS | TODO | _ | _ | _ |
| 032 | 032_cases_all.webp | /cases | Sprawy — Wszystkie | src/pages/Cases.tsx | PageHeader, MetricGrid (Wszystkie/Czekają/Zablokowane/Gotowe), Search, Status/Blocker/Client filters, ListRow with progress bar | src/lib/cases.ts all, workspace scope | Dodaj sprawę (primary), search, filters, row -> CaseDetail | Add -> dialog, filter/search handlers, row nav | PAGE_SHELL, CARDS_TILES, SEARCH, LIST_ROWS, BADGES, BUTTONS_ACTIONS | TODO | _ | _ | _ |
| 033 | 033_cases_waiting_for_client.webp | /cases | Sprawy — Czekają na klienta | src/pages/Cases.tsx filtered | same filtered by waiting | src/lib/cases.ts waiting query | same filtered | same | LIST_ROWS, BADGES | TODO | _ | _ | _ |
| 034 | 034_cases_blocked.webp | /cases | Sprawy — Zablokowane | src/pages/Cases.tsx filtered | same | src/lib/cases.ts blocked query, blocker count | same | same | LIST_ROWS, BADGES | TODO | _ | _ | _ |
| 035 | 035_cases_ready_to_start.webp | /cases | Sprawy — Gotowe do startu | src/pages/Cases.tsx filtered | same | src/lib/cases.ts readyToStart query (completeness 100% + no blockers) | same | same | LIST_ROWS, BADGES, SURFACES | TODO | _ | _ | _ |
| 036 | 036_case_add_modal.webp | /cases (modal) | Dodaj sprawę — modal | src/components/AddCaseMissingItem? actually case create dialog (CreateClientCaseDialog or dedicated) | Dialog, Client picker, Title, Template, Starter state | src/lib/cases/create-client-case.ts | Create | onSubmit create -> close -> list reload, cancel | MODALS/FORMS | TODO | _ | _ | _ |
| 037 | 037_case_edit_modal.webp | /cases/:caseId (modal) | Edytuj sprawę — modal | CaseDetail edit dialog | same prepopulated | src/lib/cases.ts update | Update | onSubmit update -> close -> detail reload | MODALS/FORMS | TODO | _ | _ | _ |
| 038 | 038_case_detail_service.webp | /cases/:caseId tab Obsługa | Szczegół sprawy — Obsługa | src/pages/CaseDetail.tsx tab Obsługa | PageHeader (back Sprawy, status, Portal klienta, Edytuj, ...), Top decision strip (Kompletność/Braki/Następny ruch/Czeka), Tabs, Notes/Tasks/Events/Braki sections, Quick actions rail, Finance rail | src/lib/cases.ts single, checklist progress, missing-items, tasks/events, finance, portal token state | Portal klienta generate/copy/revoke, Edytuj, close/restore (secondary), quick actions Dodaj notatkę/zadanie/wydarzenie/brak/Wyślij przypomnienie, finance Add payment | All handlers via entity-actions, CaseQuickActions, portal handlers, finance dialogs | PAGE_SHELL, SURFACES, RIGHT_RAIL, LIST_ROWS, BADGES, BUTTONS_ACTIONS, MODALS | TODO | _ | _ | _ |
| 039 | 039_case_detail_checklists.webp | /cases/:caseId tab Checklisty | Szczegół sprawy — Checklisty (style ref only; ignore AI extra tabs) | src/pages/CaseDetail.tsx tab Checklisty | Progress summary, Required vs optional, ListRow checklist items with type/status/deadline/requestedFrom, Add item CTA | src/lib/cases.ts checklists/items, case-templates relation | Add item, verify/reject/accept per row, expand details | Add -> dialog create item, verify -> patch status, reject -> reason dialog | SURFACES, LIST_ROWS, BADGES, BUTTONS_ACTIONS, MODALS | TODO | _ | _ | _ |
| 040 | 040_case_detail_history.webp | /cases/:caseId tab Historia | Szczegół sprawy — Historia (style ref only; ignore AI extra tabs) | src/pages/CaseDetail.tsx tab Historia | Timeline grouped Dzisiaj/Wczoraj/data, Row with entity icon, status/severity, title/meta/relation/time, open action, Technical payload collapsed | src/lib/cases.ts history/activity timeline, portal activity, payments/finance events | Expand technical payload, Open related record, Filter? | expand -> local toggle, open -> navigate, no dead links | LIST_ROWS, BADGES, TIMELINE SURFACES, BUTTONS_ACTIONS | TODO | _ | _ | _ |

Reference count 40 verified. Status for Stage 000: ALL TODO until respective stage completes.

Known deviations documented in manifest: 039/040 contain extra AI-generated Case Detail tabs; canonical remains Obsługa/Checklisty/Historia exactly.

## 7. Action / button wiring contract (applies to every reference)

For every VISIBLE_CONTROL prove:
VISIBLE_CONTROL -> UI COMPONENT -> EVENT HANDLER -> DOMAIN ACTION / ROUTE -> SUCCESS STATE -> ERROR STATE

Prohibited: onClick={() => {}}, console.log placeholder, href="#", dead button, overlay intercepting clicks, fake disabled, visual but non-actionable control.

Each reference with interactive controls must have targeted tests proving: trigger exists & clickable, correct dialog/route/action opens, correct entity context passed, submit invokes real persistence path, cancel/close works, no duplicate handler competing.

Each modal/dialog (011,012,013,014,015,016,017,019,020,029,030,031,036,037) must: open from correct real trigger, receive correct entity context, populate existing values when editing, validate required fields, save through real Supabase/Firestore persistence path (as per current data-contract), report errors, close correctly, update UI after success, preserve keyboard/focus, have working cancel/close.

Functional integrity preserved: lead lifecycle, lead->client/case transition, client relations, case lifecycle, tasks/notes/events/missingItems, calendar, payments/commissions/settlements, Google Calendar, portal, auth/access/workspace scope, notifications. If reference appears to demand NEW product function not present in canonical truth: register FUNCTIONAL_GAP_OR_OWNER_DECISION_REQUIRED and do not invent.

## 8. Visual implementation contract

Reproduce Forteca Calm Light direction within product truth: hierarchy, spacing/density, card proportions, radius 14-16, typography hierarchy, background hierarchy (#F7F9FC canvas, #FFFFFF surfaces, #F8FAFC subtle), subtle borders #E5EAF2, subtle shadows, restrained blue primary #2563EB, semantic accents only, sidebar light active pill, page header title 28-32 semibold + one-line description + right-aligned CTAs (max 1 primary +1-2 secondary), filters search+chip toolbar, list row identity+1 status+meta+right action, modal composition title+grouped fields+footer Cancel+Primary, icons single family 16-20 line 1.5-2, states loading skeleton preferred, empty with what/why/next, error with retry no stack.

Forbidden: embedding WebP as background, static HTML screenshot reproduction, hardcoding example customers/leads/cases from image to hide real data, hiding real controls to match screenshot, disabling actions, screenshot-only routes, styling only /ui-preview-*, fake toasts/numbers/lists, CSS masking broken runtime, special code only during visual tests.

Fix proper owners/components; do not add one giant CSS override.

## 9. Visual proof after every reference

Steps per reference:
1. Run real app (npm run dev or build preview).
2. Navigate to real production route/state.
3. Populate legitimate test state where required (seed via supabase fixture or local state).
4. Capture browser screenshot (desktop primary; viewport ~1440).
5. Compare with approved WebP — evaluate global shell/sidebar/page width/top spacing/hierarchy/cards/columns/typography/controls/modal size/density/semantic colors/alignment/overflow/responsive clipping. Exact pixel equality not required; major structural deviation not acceptable. If mismatch is caused by canonical functionality overriding image, document exception explicitly.

One reference -> one browser proof. No collage.

## 10. Responsive / overflow contract

Desktop reference primary, but must not introduce: horizontal page scroll, clipped buttons, modal overflow, hidden important actions, broken sidebar/content, fixed widths destroying smaller desktop/tablet. Preserve current mobile behavior unless shared component change requires bounded repair. Do not redesign mobile from imagination during desktop stage.

Open Design is OPTIONAL, not SOT. Use only if materially helps geometry/layout measurement. Do not block for it, do not install large tooling, do not regenerate screenshots.

## 11. Test gate for each reference

Before PASS, run:
1. targeted tests for changed behavior
2. relevant existing regression tests (guard:ui:* and route guards)
3. tsc --noEmit for changed scope
4. lint where applicable
5. build where warranted
6. git diff --check
7. AI Code Guardian for exact changed scope
8. browser visual proof

No fabricated PASS. Pre-existing unrelated failures classified with evidence.

## 12. Git model

Implementation commits on feat/forteca-ui-implementation-20260826. Allowed: selective git add <exact files>, commit, normal non-force push. Forbidden: git add ., git add -A, git commit -a, force push, reset/clean/stash/rebase as shortcut, history rewrite, blind stash, unrelated files. Prefer one coherent commit per reference acceptance unit. Shared foundation changes go in Stage 000 or earliest owning reference then reused.

## 13. Stage order and current status

STAGE 000: FOUNDATION / EXISTING VISUAL SOT RECONCILIATION — STATUS: IN_PROGRESS (this contract + matrix + guardian pre-check is Stage 000 acceptance unit)
STAGE 001 -> 001_today_main.webp — TODO
STAGE 002 -> 002_today_customize_view.webp — TODO
...
STAGE 040 -> 040_case_detail_history.webp — TODO

Execution sequence: complete Stage 000 contract and guardian pre-check, commit selectively, push, then proceed STAGE 001 automatically, continue until REFERENCE_001..040 all PASS or REAL non-resolvable owner/capability blocker.

Do not ask Damian should I continue — answer is YES, continue until 040 or real blocker. Technical bug is not automatically owner blocker; diagnose and repair bounded technical problems autonomously.

## 14. Final convergence after 040

Required final checks before CLOSE:
REFERENCE_COUNT=40 IMPLEMENTED_COUNT=40 UNRECONCILED_REFERENCES=0
DEAD_VISIBLE_ACTIONS=0 PLACEHOLDER_HANDLERS=0 FAKE_DATA_PATHS=0 PARALLEL_VISUAL_SOT=0 DUPLICATE_VISUAL_OWNER_CONCERNS=0 KNOWN_DEVIATIONS_DOCUMENTED=YES (039/040 tabs)

Run final: TSC, lint, relevant full test suite, build, git diff --check, final guardian coverage, browser smoke of implemented route family, route/action inventory reconciliation.

Never claim UI program CLOSED if any 001-040 lacks browser proof or action reconciliation.

## 15. Recovery

Preserve newer valid work. Rollback by git revert <stage-commit-sha> after verifying exact commit/scope. Never use reset --hard / clean / stash / rebase or force push.

## 16. Closeout boundary

Executor produces evidence and proposed Obsidian update per reference. It does not close stage in Vault or activate next product stage — that remains owner/controller decision. This contract does not change domain logic without evidence that UI requirement actually requires it.

---

Appendix A: Detailed owner inventory already in section 4. Appendix B: Reference matrix 001-040 above doubles as visual proof index. Appendix C: Manifest byte/size/sha256 verification passed at 3d999dc.
