# LF-UI-SOT-000 — Preflight i mapa stanu UI / routes

Data: 2026-06-27 23:14 Europe/Warsaw
Scalenie: 2026-06-27 23:42 Europe/Warsaw
Status: MERGED_REPORT_ON_GITHUB / DOCS_ONLY / RUNTIME_NOT_TOUCHED / LOCAL_SCAN_IMPORTED / REPO_DIRTY_WARNING
canonical_name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
Stage id: LF-UI-SOT-000

## Werdykt

Ten etap NIE zmienia UI i NIE poprawia wygladu.

Scalono dwie warstwy raportu:

1. raport GitHub/ChatGPT: mapa routera z `src/App.tsx`, aktywne importy, aktywne routes, aliasy i ryzyka globalnego CSS;
2. raport/local log Codexa: lokalny spis `src/pages`, `src/components`, `src/components/ui`, `src/lib`, route import scan, legacy scan, anti-patch scan i forbidden doc import scan.

Etap nadal nie jest pelnym zamknieciem runtime, bo lokalne repo wg opisu Codexa mialo wczesniejsze brudne zmiany w `TodayStable`, stylach, skryptach i testach. Ten raport jest dokumentacyjny i nie naprawia tych zmian.

## Zakres odczytany / scalony

Przeczytane z repo GitHub:

- `AGENTS.md`
- `_project/00_AI_START_SPIS_TRESCI.md`
- `_project/15_ACTIVE_SOURCE_MAP.md`
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `src/App.tsx`
- `package.json`

Scalono z lokalnego raportu/logu Codexa:

- `Get-ChildItem .\src\pages -File`
- `Get-ChildItem .\src\components -File`
- `Get-ChildItem .\src\components\ui -File`
- `Get-ChildItem .\src\lib -File`
- `Select-String` router imports/routes
- legacy name scan: `old|legacy|temp|v2|new|deprecated`
- anti-patch scan: `style={{|display:\s*none|z-index|zIndex|lucide-react|<button`
- forbidden doc import scan: `10_PROJEKTY|obsidian_updates|OBSIDIAN_UPDATE|_project`

## Pliki zmienione w tym etapie

- `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`
- `_project/00_AI_START_SPIS_TRESCI.md` — repo-local odnośnik do tego raportu

Codex lokalnie deklarowal takze wpis w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`; na GitHubie nie nadpisano tego duzego pliku w tym commicie, zeby nie zniszczyc lokalnych brudnych zmian. Wpis do 04 jest podany nizej jako blok do zastosowania selektywnie, jesli lokalny stan ma byc zsynchronizowany bez konfliktu.

## Pliki celowo nietkniete

- `src/pages/*`
- `src/components/*`
- `src/components/ui/*`
- `src/lib/*`
- `src/index.css`
- `package.json`
- migracje
- Supabase / Firebase / API
- runtime Calendar / Today / Lead / Case / Client

## Branch / status repo

Remote branch `dev-rollout-freeze` jest czytelny przez GitHub fetch/compare. Remote HEAD przed pierwszym wpisem raportu: `d81cda9f788da179575490bbaf6142e5dc1fe66f`.

Status lokalny wg przekazanego raportu Codexa:

- `git diff --check`: PASS, tylko ostrzezenia LF -> CRLF;
- repo nadal mialo wczesniejsze brudne zmiany w `TodayStable`, stylach, skryptach i testach;
- Codex dodal trzy pliki dokumentacyjne: raport, `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, `_project/00_AI_START_SPIS_TRESCI.md`.

Wniosek: nie robic kolejnego UI runtime stage, dopoki lokalny stan nie zostanie pokazany przez `git status --short --branch` i nie bedzie jasne, czy zmiany Codexa sa do przyjecia, stasha czy cofniecia.

## Aktywne importy stron z `src/App.tsx`

| Alias w routerze | Import / plik | Tryb | Status mapy |
|---|---|---|---|
| `PublicLanding` | `src/pages/PublicLanding` | lazy | route import |
| `LegalPrivacy` | `src/pages/LegalPrivacy` | lazy | route import |
| `LegalTerms` | `src/pages/LegalTerms` | lazy | route import |
| `Today` | `src/pages/TodayStable` | lazy | AKTYWNY Today |
| `Leads` | `src/pages/Leads` | lazy | aktywny |
| `SalesFunnel` | `src/pages/SalesFunnel` | lazy | aktywny + dev route |
| `LeadDetail` | `src/pages/LeadDetail` | static | aktywny, static import unblock |
| `Cases` | `src/pages/Cases` | lazy | aktywny |
| `CaseDetail` | `src/pages/CaseDetail` | lazy | aktywny |
| `Clients` | `src/pages/Clients` | lazy | aktywny |
| `ClientDetail` | `src/pages/ClientDetail` | static | aktywny, static import unblock |
| `ClientPortal` | `src/pages/ClientPortal` | lazy | aktywny |
| `Activity` | `src/pages/Activity` | lazy | aktywny |
| `AiDrafts` | `src/pages/AiDrafts` | lazy | aktywny |
| `Settings` | `src/pages/Settings` | lazy | aktywny |
| `AdminAiSettings` | `src/pages/AdminAiSettings` | lazy | aktywny |
| `Login` | `src/pages/Login` | lazy | aktywny auth entry |
| `Tasks` | `src/pages/TasksStable` | lazy | AKTYWNY Tasks |
| `Calendar` | `src/pages/Calendar` | lazy | aktywny |
| `Billing` | `src/pages/Billing` | lazy | aktywny |
| `SupportCenter` | `src/pages/SupportCenter` | lazy | aktywny help/support |
| `NotificationsCenter` | `src/pages/NotificationsCenter` | lazy | aktywny |
| `Templates` | `src/pages/Templates` | lazy | aktywny |
| `ResponseTemplates` | `src/pages/ResponseTemplates` | lazy | aktywny |
| `UiPreviewVNextFull` | `src/pages/UiPreviewVNextFull` | lazy | DEV-only preview |
| `UiPreviewVNext` | `src/pages/UiPreviewVNext` | lazy | DEV-only preview |

## Aktywne routes z `src/App.tsx`

| Route | Element | Status |
|---|---|---|
| `/login` | `Login` albo redirect `/` | aktywny |
| `/start` | `Login` albo redirect `/` | alias auth |
| `/privacy` | `LegalPrivacy` | public |
| `/terms` | `LegalTerms` | public |
| `/portal/:caseId/:token` | `ClientPortal` | public/client portal |
| `/` | `Today` albo `Login` | aktywny root |
| `/today` | `Today` albo redirect `/login` | alias Today |
| `/leads` | `Leads` | aktywny |
| `/dev/funnel` | `SalesFunnel` tylko DEV | dev route |
| `/funnel` | `SalesFunnel` | aktywny |
| `/leads/:leadId` | `LeadDetail` | aktywny |
| `/tasks` | `Tasks` | aktywny |
| `/calendar` | `Calendar` | aktywny |
| `/cases` | `Cases` | aktywny |
| `/case/:caseId` | `LegacyCaseRedirect` | legacy redirect replace |
| `/cases/:caseId` | `CaseDetail` | canonical CaseDetail |
| `/clients` | `Clients` | aktywny |
| `/clients/:clientId` | `ClientDetail` | aktywny |
| `/activity` | `Activity` | aktywny |
| `/ai-drafts` | `AiDrafts` | aktywny |
| `/notifications` | `NotificationsCenter` | aktywny |
| `/templates` | `Templates` | aktywny |
| `/case-templates` | redirect `/templates` replace | legacy alias |
| `/response-templates` | `ResponseTemplates` | aktywny |
| `/billing` | `Billing` | aktywny |
| `/help` | `SupportCenter` | aktywny |
| `/support` | `SupportCenter` | alias, nie redirect |
| `/settings/ai` | `AdminAiSettings` | aktywny |
| `/settings` | `Settings` | aktywny |
| `/ui-preview-vnext` | `UiPreviewVNext` tylko DEV | preview |
| `/ui-preview-vnext-full` | `UiPreviewVNextFull` tylko DEV | preview |
| `*` | redirect `/` | catch-all |

## Lokalny spis `src/pages`

Liczba plikow top-level: 40

- `Activity.tsx`
- `AdminAiSettings.tsx`
- `AiDrafts.tsx`
- `Billing.tsx`
- `Calendar.tsx`
- `CaseDetail.tsx`
- `Cases.tsx`
- `ClientDetail.tsx`
- `ClientPortal.tsx`
- `Clients.tsx`
- `Dashboard.tsx`
- `LeadDetail.tsx`
- `Leads.tsx`
- `LegalPrivacy.tsx`
- `legal-public-pages.css`
- `LegalTerms.tsx`
- `Login.tsx`
- `NotificationsCenter.tsx`
- `PublicLanding.tsx`
- `ResponseTemplates.tsx`
- `SalesFunnel.tsx`
- `Settings.tsx`
- `Settings.tsx.stage179.bak`
- `Settings.tsx.stage180.bak`
- `Settings.tsx.stage180c.bak`
- `Settings.tsx.stage180d.bak`
- `Settings.tsx.stage180e.bak`
- `Settings.tsx.stage180f.bak`
- `Settings.tsx.stage184.bak`
- `Settings.tsx.stage186.before-rollback.bak`
- `Settings.tsx.stage187b-before-fix.bak`
- `Settings.tsx.stage187-hide-preferences-section.bak`
- `SupportCenter.tsx`
- `Tasks.tsx`
- `TasksStable.tsx`
- `Templates.tsx`
- `Today.tsx`
- `TodayStable.tsx`
- `UiPreviewVNext.tsx`
- `UiPreviewVNextFull.tsx`

### Wnioski z pages

Aktywne z routera:

- `Activity.tsx`
- `AdminAiSettings.tsx`
- `AiDrafts.tsx`
- `Billing.tsx`
- `Calendar.tsx`
- `CaseDetail.tsx`
- `Cases.tsx`
- `ClientDetail.tsx`
- `ClientPortal.tsx`
- `Clients.tsx`
- `LeadDetail.tsx`
- `Leads.tsx`
- `LegalPrivacy.tsx`
- `LegalTerms.tsx`
- `Login.tsx`
- `NotificationsCenter.tsx`
- `PublicLanding.tsx`
- `ResponseTemplates.tsx`
- `SalesFunnel.tsx`
- `Settings.tsx`
- `SupportCenter.tsx`
- `TasksStable.tsx`
- `Templates.tsx`
- `TodayStable.tsx`
- `UiPreviewVNext.tsx`
- `UiPreviewVNextFull.tsx`

Kandydaci legacy / nieaktywni w routerze:

- `Dashboard.tsx`
- `Tasks.tsx`
- `Today.tsx`
- backupy `Settings.tsx.stage*.bak`
- `legal-public-pages.css` jako lokalny CSS obok pages, nie route page

## Lokalny spis `src/components` top-level

Liczba plikow top-level: 57

- `AccessGate.tsx`
- `ActivityItemPreviewDialog.tsx`
- `ActivityRoadmap.tsx`
- `AddCaseMissingItemDialog.tsx`
- `AppChunkErrorBoundary.tsx`
- `appearance-provider.tsx`
- `CaseQuickActions.tsx`
- `ClientCreateDialog.tsx`
- `CloseFlowPageHeaderV2.tsx`
- `confirm-dialog.tsx`
- `ContextActionButton.tsx`
- `ContextActionDialogs.tsx`
- `ContextNoteDialog.tsx`
- `CreateClientCaseDialog.tsx`
- `DraftReviewDialog.tsx`
- `EditActivityNoteDialog.tsx`
- `EmailVerificationGate.tsx`
- `entity-actions.tsx`
- `EntityConflictDialog.tsx`
- `entity-contact-card.tsx`
- `ErrorBoundary.tsx`
- `EventCreateDialog.tsx`
- `GlobalAiAssistant.tsx`
- `GlobalQuickActions.tsx`
- `Layout.tsx`
- `Layout.tsx.stage184.bak`
- `Layout.tsx.stage186.before-rollback.bak`
- `Layout.tsx.stage188.bak`
- `Layout.tsx.stage189.bak`
- `Layout.tsx.stage190b.bak`
- `Layout.tsx.stage191.bak`
- `Layout.tsx.stage192.bak`
- `Layout.tsx.stage194.bak`
- `Layout.tsx.stage195.bak`
- `Layout.tsx.stage197.bak`
- `Layout.tsx.stage197b.bak`
- `Layout.tsx.stage198b.bak`
- `LeadAiFollowupDraft.tsx`
- `LeadAiNextAction.tsx`
- `lead-picker.tsx`
- `LeadStartServiceDialog.tsx`
- `NotificationRuntime.tsx`
- `OperatorTopBarRuntime.tsx`
- `PwaInstallPrompt.tsx`
- `QuickAiCapture.tsx`
- `ShellDesktopViewportRuntime.tsx`
- `sidebar-mini-calendar.tsx`
- `StatShortcutCard.tsx`
- `TaskCreateDialog.tsx`
- `task-editor-dialog.tsx`
- `TodayAiAssistant.tsx`
- `topic-contact-picker.tsx`
- `VisualFoundationRuntime.tsx`
- `VisualFoundationRuntimeStage212B.tsx`
- `VisualFoundationRuntimeStage212G.tsx`
- `VisualFoundationRuntimeStage212M.tsx`
- `work-item-card.tsx`

### Wnioski z components

Ryzyka widoczne juz w spisie:

- backupy `Layout.tsx.stage*.bak` leza w `src/components`; to nie jest zdrowe miejsce na legacy backupy;
- `VisualFoundationRuntime*` sugeruja runtime DOM/CSS foundation layers, wymagaja osobnego audytu przed kolejnym UI stage;
- `CloseFlowPageHeaderV2.tsx` i `OperatorTopBarRuntime.tsx` sa kandydatami do audytu header/source-of-truth.

## Lokalny spis `src/components/ui`

Liczba plikow: 20

- `avatar.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `CloseFlowDialogShell.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `input.tsx`
- `label.tsx`
- `progress.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `skeleton.tsx`
- `sonner.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `tooltip.tsx`

### Wnioski z components/ui

`button.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`, `tabs.tsx`, `card.tsx` sa aktywnym UI foundation. Kolejne UI zmiany powinny preferowac te komponenty zamiast surowego HTML, chyba ze dany widok ma udokumentowany powod.

## Lokalny spis `src/lib`

Liczba plikow top-level: 91

- `access.ts`
- `action-visual-taxonomy.ts`
- `activity-roadmap.ts`
- `activity-timeline.ts`
- `admin.ts`
- `ai-assistant.ts`
- `ai-capture.ts`
- `ai-config.ts`
- `ai-direct-write-guard.ts`
- `ai-draft-approval.ts`
- `ai-draft-assistant-bridge.ts`
- `ai-draft-confirm-records.ts`
- `ai-drafts.ts`
- `ai-followup.ts`
- `ai-next-action.ts`
- `ai-usage-guard.ts`
- `appearance.ts`
- `appearance.ts.stage181.bak`
- `appearance.ts.stage182.bak`
- `appearance.ts.stage183.bak`
- `appearance.ts.stage185.bak`
- `appearance.ts.stage186.before-rollback.bak`
- `app-preferences.ts`
- `assistant-intents.ts`
- `assistant-query-client.ts`
- `assistant-result-schema.ts`
- `auth-intent.ts`
- `calendar-dom-normalizer-policy.ts`
- `calendar-items.ts`
- `calendar-lead-shadow-entry-policy.ts`
- `calendar-operational-entry-action-policy.ts`
- `calendar-operational-entry-contract.ts`
- `calendar-operational-entry-today-adapter.ts`
- `calendar-timezone-contract.ts`
- `case-lifecycle-v1.ts`
- `cases.ts`
- `client-auth.ts`
- `client-cases.ts`
- `client-finance.ts`
- `clients.ts`
- `client-value.ts`
- `closeflow-runtime-source-truth.ts`
- `closeflow-visual-source-truth.ts`
- `context-action-contract.ts`
- `data-contract.ts`
- `domain-statuses.ts`
- `drafts.ts`
- `firebase-utils.ts`
- `google-calendar-reminder-preferences.ts`
- `lead-case-handoff.ts`
- `lead-finance.ts`
- `lead-health.ts`
- `lead-next-action.ts`
- `lead-service-state.ts`
- `leadSources.ts`
- `nearest-action.ts`
- `notifications.ts`
- `notification-snooze.cjs`
- `notification-snooze.ts`
- `operator-rail-tone.ts`
- `options.ts`
- `page-header-content.ts`
- `planned-actions.ts`
- `plans.ts`
- `product-truth.ts`
- `quick-lead-parser.cjs`
- `quick-lead-parser.ts`
- `record-operational-badges.ts`
- `relation-value.ts`
- `reminders.ts`
- `routes.ts`
- `schedule-conflicts.ts`
- `scheduling.ts`
- `search-normalization.ts`
- `security.ts`
- `stage30-today-cleanup.ts`
- `stage31-today-tiles-interaction.ts`
- `stage32-today-relations-loading-polish.ts`
- `statuses.ts`
- `supabase-auth.ts`
- `supabase-fallback.ts`
- `supabase-schema-contract.ts`
- `task-event-contract.ts`
- `tasks.ts`
- `today-sections.ts`
- `today-v1-final.ts`
- `topic-contact.ts`
- `ui-truth.ts`
- `utils.ts`
- `workspace.ts`
- `workspace-context.ts`

### Wnioski z lib

Ryzyka widoczne w spisie:

- backupy `appearance.ts.stage*.bak` leza w `src/lib`;
- istnieja legacy compatibility layers: `firebase-utils.ts`, `closeflow-runtime-source-truth.ts`, `closeflow-visual-source-truth.ts`;
- route helper istnieje jako `routes.ts` i powinien byc uzywany przy kolejnych zmianach tras;
- Calendar/Today ma wiele kontraktow: `calendar-operational-entry-*`, `calendar-lead-shadow-entry-policy.ts`, `calendar-dom-normalizer-policy.ts`.

## Legacy / alias kandydaci

1. `/case/:caseId` jest legacy i robi `replace` do canonical `/cases/:caseId`.
2. `/case-templates` robi redirect `replace` do `/templates`.
3. `/support` i `/help` renderuja ten sam `SupportCenter`, ale `/support` nie jest redirectem. Kandydat do decyzji: canonical `/help`, legacy `/support -> /help`.
4. `/` i `/today` renderuja `Today`. To moze byc celowe; nie zmieniac bez decyzji.
5. `/login` i `/start` renderuja `Login` dla wylogowanego. Nie zmieniac bez decyzji public/auth.
6. `/dev/funnel` i `/funnel` sa rozdzielone przez `import.meta.env.DEV`; zostawic.
7. `Today.tsx` istnieje lokalnie, ale aktywny router uzywa `TodayStable.tsx`.
8. `Tasks.tsx` istnieje lokalnie, ale aktywny router uzywa `TasksStable.tsx`.
9. `Dashboard.tsx` istnieje lokalnie, ale nie jest importowany w `src/App.tsx`.

## Wynik legacy name scan

Skan lokalny Codexa znalazl 4278 linii pasujacych do `old|legacy|temp|v2|new|deprecated`.

Liczby po slowach:

- `legacy` — 173
- `deprecated` — 5
- `old` — 511
- `temp` — 1577
- `v2` — 613
- `new` — 1351

Top pliki po liczbie trafien:

- `src\pages\Calendar.tsx` — 163
- `src\pages\Templates.tsx` — 141
- `src\styles\closeflow-page-header-v2.css` — 124
- `src\pages\Today.tsx` — 121
- `src\pages\CaseDetail.tsx` — 120
- `src\styles\visual-stage14-lead-detail-vnext.css` — 89
- `src\styles\closeflow-template-modal-source-truth-stage181l.css` — 86
- `src\styles\visual-stage12-client-detail-vnext.css` — 80
- `src\pages\Leads.tsx` — 75
- `src\pages\Tasks.tsx` — 72
- `src\styles\closeflow-calendar-color-tooltip-v2.css` — 71
- `src\styles\closeflow-record-list-source-truth.css` — 68
- `src\lib\supabase-fallback.ts` — 60
- `src\pages\ResponseTemplates.tsx` — 60
- `src\styles\closeflow-template-modal-source-truth-stage181n.css` — 57

Interpretacja: to nie oznacza automatycznie bledow. `new` i `template` generuja duzo false-positive. Realne ryzyko jest w backupach `.bak`, runtime DOM normalizatorach, legacy compatibility i stage-specific CSS.

## Wynik anti-patch scan

Skan lokalny Codexa znalazl 931 linii pasujacych do `style={{|display:\s*none|z-index|zIndex|lucide-react|<button`.

Liczby po wzorcach:

- `style={{` — 17
- `display none / display:` — 224
- `z-index / zIndex` — 91
- `lucide-react` — 33
- `<button` — 213

Top pliki po liczbie trafien:

- `src\pages\CaseDetail.tsx` — 68
- `src\pages\ClientDetail.tsx` — 44
- `src\pages\LeadDetail.tsx` — 42
- `src\pages\Calendar.tsx` — 30
- `src\styles\visual-stage12-client-detail-vnext.css` — 27
- `src\pages\Today.tsx` — 26
- `src\pages\AiDrafts.tsx` — 25
- `src\pages\Settings.tsx` — 21
- `src\components\admin-tools\AdminDebugToolbar.tsx` — 18
- `src\pages\SupportCenter.tsx` — 17
- `src\pages\NotificationsCenter.tsx` — 16
- `src\pages\Tasks.tsx` — 15
- `src\styles\closeflow-case-history-visual-source-truth.css` — 15
- `src\styles\closeflow-detail-view-source-truth-stage219.css` — 13
- `src\pages\UiPreviewVNext.tsx` — 12

Interpretacja:

- `style={{` nie zawsze jest bledem, ale kazdy nowy inline style w UI stage ma byc domyslnie zabroniony.
- `display: none` i `hidden` w CaseDetail/Calendar/style layers wymagaja osobnego audytu, bo moga maskowac stare UI zamiast usuwac je ze zrodla.
- `z-index` jest szczegolnie ryzykowny w `admin-tools.css` i modalach/overlay.
- `lucide-react` jest dozwolony tylko przez centralne registry / uzasadnione komponenty; nowe bezposrednie importy maja byc blokowane.
- surowe `<button>` wystepuja glownie w admin tools, Calendar i starych widokach; nowe przyciski powinny isc przez `src/components/ui/button.tsx`.

## Forbidden doc import scan

Wynik lokalny: brak trafien po komendzie:

```powershell
Get-ChildItem .\src -Recurse -File -Include *.ts,*.tsx | Select-String -Pattern "10_PROJEKTY|obsidian_updates|OBSIDIAN_UPDATE|_project" -CaseSensitive:$false
```

Status: PASS dla runtime importow dokumentacji projektowej.

## Globalne style i ryzyko plastrow

`src/App.tsx` importuje wiele globalnych warstw CSS, w tym:

- `closeflow-visual-source-truth.css`
- `closeflow-action-tokens.css`
- `closeflow-action-clusters.css`
- `closeflow-form-actions.css`
- `closeflow-card-readability.css`
- `closeflow-surface-tokens.css`
- `closeflow-modal-visual-system.css`
- `closeflow-metric-tiles.css`
- `closeflow-page-header.css`
- `closeflow-list-row-tokens.css`
- `closeflow-alert-severity.css`
- `finance/closeflow-finance.css`
- `closeflow-right-rail-source-truth.css`
- `closeflow-command-actions-source-truth.css`
- `closeflow-page-header-copy-source-truth.css`
- `closeflow-page-header-action-semantics-packet1.css`
- `closeflow-search-source-truth-stage134.css`
- `closeflow-right-rail-heading-source-truth-stage135.css`
- `closeflow-clean-desktop-app-shell-canvas-stage149.css`
- `closeflow-panel-typography-and-width-source-truth-stage150.css`
- `closeflow-compact-cards-source-truth-stage151.css`
- `closeflow-dense-cards-80-percent-target-stage152.css`
- `closeflow-real-density-tokens-no-zoom-stage156.css`
- disabled legacy/comment: `closeflow-viewport-zoom-80-source-truth-stage157.css`
- `closeflow-overlay-portal-density-stage158.css`
- `closeflow-overlay-real-density-and-footer-stage159.css`
- `closeflow-modal-center-and-compact-all-stage160.css`
- `closeflow-cf-modal-surface-center-fix-stage161.css`
- `closeflow-cf-modal-surface-lower-smaller-stage162.css`
- `closeflow-cf-modal-main-center-tall-compact-stage163.css`
- `closeflow-cf-modal-top-anchor-light-surface-stage164.css`
- `closeflow-modal-unified-event-motif-source-truth-stage165.css`
- `closeflow-modal-footer-in-flow-no-overlay-stage166.css`
- `closeflow-topic-contact-picker-readable-stage169.css`
- `closeflow-task-dialog-relation-and-field-readability-stage170.css`
- `closeflow-remove-modal-helper-copy-stage171.css`
- `closeflow-global-client-create-dialog-stage172.css`
- `closeflow-main-search-source-truth-stage173.css`
- `closeflow-main-search-surface-and-text-normalization-stage174.css`
- `closeflow-extend-main-search-source-truth-secondary-pages-stage175.css`
- `closeflow-leads-clients-list-layout-source-truth-stage177.css`
- `closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css`
- `closeflow-secondary-pages-full-width-stage181ad.css`
- `closeflow-app-viewport-scale-75-stage201.css`
- `closeflow-ops-badges-and-icons-stretch-stage204.css`
- `stage231h-r1e-case-finance-correction-modal-final.css`

Werdykt: to jest glowny kandydat do kolejnego UI source-of-truth audit. Nie usuwac tego na oko. Najpierw trzeba zrobic macierz: ktory CSS jest aktywnym tokenem/systemem, ktory jest stage-specific hotfixem, ktory jest legacy/disabled.

## Kandydaci do kolejnych etapow

Nie aktywowac automatycznie. Te wpisy trzeba przeniesc do centralnego `04_ETAPY_ROZWOJU_APLIKACJI.md`, jesli Damian potwierdzi.

### LF-UI-SOT-001 — Global CSS layer source-of-truth audit

Cel: rozpisac wszystkie globalne importy CSS z `src/App.tsx` na: aktywny token/system, hotfix stage, legacy, disabled. Bez usuwania na oko.

Ryzyko: obecny stos CSS wyglada jak historyczne plastry. Kolejny UI stage moze dzialac przez przypadek tylko dzieki kolejnosci importow.

### LF-UI-SOT-002 — Pages inventory and unused route candidates

Cel: lokalny spis wszystkich `src/pages/*` i porownanie z importami z `src/App.tsx`. Oznaczyc aktywne, legacy, preview, do potwierdzenia.

### LF-UI-SOT-003 — Component/UI inventory and raw action guard

Cel: spis `src/components/*` i `src/components/ui/*`; wskazac surowe `<button>`, bezposrednie `lucide-react`, inline style i odchylenia od komponentow UI.

### LF-UI-SOT-004 — Route alias policy

Cel: decyzja canonical/legacy dla `/help` vs `/support`, `/today` vs `/`, `/start` vs `/login`, bez ruszania tras przed decyzja.

### LF-UI-SOT-005 — Active visual template dictionary

Cel: stworzyc slownik aktywnych wzorcow widoku dla Today / Leads / Clients / Cases / CaseDetail / ClientDetail, z jednym wskazanym plikiem prawdy na kazdy widok.

## Blok do selektywnego dopisania w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`

Nie wklejac drugi raz, jesli Codex juz dopisal lokalnie ten sam wpis.

```md
---

## LF-UI-SOT-000 — Preflight i mapa stanu UI/routes

Status: MAP_CREATED_ON_GITHUB / DOCS_ONLY / RUNTIME_NOT_TOUCHED / LOCAL_SCAN_IMPORTED / REPO_DIRTY_WARNING
Data: 2026-06-27 23:42 Europe/Warsaw
Raport: `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`

Cel: zablokowac chaos przed kolejnymi zmianami UI przez ustalenie aktywnych routes, aktywnych pages, kandydatow legacy, globalnych CSS layerow i ryzyk anty-plastrowych.

Wynik:
- aktywny router: `src/App.tsx`;
- aktywny Today: `src/pages/TodayStable.tsx`;
- aktywny Tasks: `src/pages/TasksStable.tsx`;
- canonical CaseDetail: `/cases/:caseId`;
- legacy CaseDetail: `/case/:caseId -> /cases/:caseId`;
- lokalny scan wykazal backupy `.bak`, `Dashboard.tsx`, `Today.tsx`, `Tasks.tsx`, duzo stage-specific CSS i anti-patch trafienia.

Zakaz:
- nie ruszac runtime UI bez kolejnego jawnego etapu;
- nie dokladac kolejnych globalnych CSS plastrow;
- nie kasowac legacy plikow bez osobnego cleanup stage i guardow.

Nastepny rekomendowany etap:
`LF-UI-SOT-001 — Global CSS layer source-of-truth audit`.
```

## Ryzyka

1. Wysokie: stage-specific CSS layers w `src/App.tsx` moga nadpisywac sie wzajemnie.
2. Wysokie: aktywny widok `TodayStable` / `TasksStable` moze byc mylony z legacy `Today` / `Tasks`, ktore istnieja lokalnie.
3. Wysokie: backupy `.bak` leza w `src/pages`, `src/components`, `src/lib`; to moze mylic AI i skany.
4. Wysokie: anti-patch scan pokazuje 931 trafien; nie wolno tego naprawiac masowo, ale trzeba traktowac jako mapa ryzyka.
5. Srednie: `/support` i `/help` renderuja ten sam komponent bez jawnej polityki canonical.
6. Srednie: `LeadDetail` i `ClientDetail` sa static import unblock, wiec zmiana lazy/static bez testu moze odtworzyc runtime crash.
7. Srednie: `UiPreviewVNext` i `UiPreviewVNextFull` sa DEV-only; nie traktowac jako produkcyjny wzorzec bez decyzji.

## Czego nie ruszac po tym etapie

- Nie poprawiac UI po klasach CSS bez wskazania aktywnego source-of-truth.
- Nie nakladac kolejnej globalnej warstwy CSS na `src/App.tsx` bez decyzji LF-UI-SOT-001.
- Nie kasowac legacy pages bez lokalnego spisu i guardow.
- Nie zamieniac route aliasow bez decyzji canonical.
- Nie robic masowego cleanupu backupow `.bak` bez osobnego etapu i selektywnej listy plikow.

## Guard wymagany przed kolejnym UI/runtime stage

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git status --short --branch
git diff --check

# potwierdzic, ze raport i lokalne zmiany nie konfliktuja z remote
git log --oneline -5
git diff -- _project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md _project/00_AI_START_SPIS_TRESCI.md _project/04_ETAPY_ROZWOJU_APLIKACJI.md
```

## Zapis do Obsidiana

- data i godzina: 2026-06-27 23:42 Europe/Warsaw
- nazwa / alias: `LF-UI-SOT-000 — Preflight i mapa stanu`
- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- target file/path: `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`
- save status: scalony raport zapisany w repo aplikacji przez GitHub connector
- Obsidian GitHub sync: NIE WYKONANO w repo `obsidian-vault`; wpis jest repo-local `_project`
- Obsidian local sync: LOCAL_SYNC_PENDING
- tests: lokalny scan Codexa zaimportowany; `git diff --check` wg Codexa PASS z ostrzezeniami LF -> CRLF; repo lokalne nadal brudne
- risk audit: patrz sekcja `Ryzyka`
- what was not touched: runtime UI, pages, components, lib, CSS, package, SQL, API, Supabase/Firebase
- next step: najpierw uporzadkowac/zaakceptowac lokalny dirty state, potem `LF-UI-SOT-001 — Global CSS layer source-of-truth audit`
