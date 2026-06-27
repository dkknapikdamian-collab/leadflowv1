# LF-UI-SOT-000 — Preflight i mapa stanu UI / routes

Data: 2026-06-27 23:14 Europe/Warsaw
Status: MAP_CREATED_ON_GITHUB / DOCS_ONLY / RUNTIME_NOT_TOUCHED / LOCAL_GREP_REQUIRED_FOR_FULL_PASS
canonical_name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
Stage id: LF-UI-SOT-000

## Werdykt

Ten etap NIE zmienia UI i NIE poprawia wygladu.

Mapa zostala zalozona jako punkt startowy przed kolejnymi zmianami UI. Aktywne routes sa w `src/App.tsx`. Najwieksze ryzyko preflightu: globalny `src/App.tsx` importuje duzo stage-specific CSS, co tworzy realne ryzyko wizualnych plastrow i konfliktow kolejnosci importow.

Etap nie jest oznaczony jako pelny PASS, bo z poziomu GitHub connector nie wykonano lokalnego `git status`, `git diff --check` ani pelnego `rg` po katalogach. Te komendy sa wpisane nizej jako wymagany lokalny guard przed kolejnym runtime/UI stage.

## Zakres odczytany

Przeczytane / uzyte jako zrodla:

- `AGENTS.md`
- `_project/00_AI_START_SPIS_TRESCI.md`
- `_project/15_ACTIVE_SOURCE_MAP.md`
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `src/App.tsx`
- `package.json` tylko do potwierdzenia standardowych skryptow guard/build/verify

Nie czytano calego repo, calego `_project`, wszystkich run reportow ani wszystkich `obsidian_updates`.

## Pliki zmienione w tym etapie

- `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`

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

Remote branch `dev-rollout-freeze` jest czytelny przez GitHub fetch/compare. Remote HEAD przed tym wpisem: `d81cda9f788da179575490bbaf6142e5dc1fe66f` (`fix(routes): canonicalize case detail route`).

Lokalny stan Damiana NIE zostal sprawdzony przez ten commit. Przed kolejnym stage trzeba uruchomic lokalnie:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git status --short --branch
git diff --check
```

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

## Legacy / alias kandydaci

1. `/case/:caseId` jest legacy i robi `replace` do canonical `/cases/:caseId`.
2. `/case-templates` robi redirect `replace` do `/templates`.
3. `/support` i `/help` renderuja ten sam `SupportCenter`, ale `/support` nie jest redirectem. Kandydat do decyzji: canonical `/help`, legacy `/support -> /help`.
4. `/` i `/today` renderuja `Today`. To moze byc celowe; nie zmieniac bez decyzji.
5. `/login` i `/start` renderuja `Login` dla wylogowanego. Nie zmieniac bez decyzji public/auth.
6. `/dev/funnel` i `/funnel` sa rozdzielone przez `import.meta.env.DEV`; zostawic.
7. Aktywny Today to `TodayStable`, wiec ewentualny `src/pages/Today.tsx` jest legacy kandydatem do lokalnego potwierdzenia.
8. Aktywne Tasks to `TasksStable`, wiec ewentualny `src/pages/Tasks.tsx` jest legacy kandydatem do lokalnego potwierdzenia.

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

## Komponenty do pelnego lokalnego spisu

Ten etap NIE udaje, ze z GitHub connectora wykonano pelny `Get-ChildItem` albo `rg` po folderach. Pelny spis `src/components`, `src/components/ui`, `src/lib` musi zostac wykonany lokalnie ponizszym guardem.

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

Write-Host "=== BRANCH / STATUS ==="
git status --short --branch
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD
git diff --check

Write-Host "=== PAGES ==="
Get-ChildItem .\src\pages -File | Sort-Object Name | Select-Object -ExpandProperty Name

Write-Host "=== COMPONENTS TOP ==="
Get-ChildItem .\src\components -File | Sort-Object Name | Select-Object -ExpandProperty Name

Write-Host "=== COMPONENTS UI ==="
Get-ChildItem .\src\components\ui -File | Sort-Object Name | Select-Object -ExpandProperty Name

Write-Host "=== LIB TOP ==="
Get-ChildItem .\src\lib -File | Sort-Object Name | Select-Object -ExpandProperty Name

Write-Host "=== ROUTER IMPORTS ==="
Select-String -Path .\src\App.tsx -Pattern "import\('./pages/|from './pages/|<Route path=" -AllMatches

Write-Host "=== LEGACY NAME SCAN ==="
Get-ChildItem .\src -Recurse -File -Include *.ts,*.tsx,*.css | Select-String -Pattern "old|legacy|temp|v2|new|deprecated" -CaseSensitive:$false

Write-Host "=== ANTI PATCH SCAN ==="
Get-ChildItem .\src -Recurse -File -Include *.ts,*.tsx,*.css | Select-String -Pattern "style=\{\{|display:\s*none|z-index|zIndex|lucide-react|<button" -CaseSensitive:$false

Write-Host "=== FORBIDDEN DOC IMPORT SCAN ==="
Get-ChildItem .\src -Recurse -File -Include *.ts,*.tsx | Select-String -Pattern "10_PROJEKTY|obsidian_updates|OBSIDIAN_UPDATE|_project" -CaseSensitive:$false
```

## Minimalny guard akceptacji tego etapu

Status pelny PASS dopiero po lokalnym logu:

```txt
git status --short --branch
PASS git diff --check
PASS route import scan
PASS forbidden docs import scan: no runtime imports from 10_PROJEKTY / obsidian_updates / _project
REPORT pages/components/ui/lib lists captured
REPORT anti-patch scan captured
```

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

## Ryzyka

1. Wysokie: stage-specific CSS layers w `src/App.tsx` moga nadpisywac sie wzajemnie.
2. Wysokie: aktywny widok `TodayStable` / `TasksStable` moze byc mylony z legacy `Today` / `Tasks`, jesli takie pliki istnieja lokalnie.
3. Srednie: `/support` i `/help` renderuja ten sam komponent bez jawnej polityki canonical.
4. Srednie: `LeadDetail` i `ClientDetail` sa static import unblock, wiec zmiana lazy/static bez testu moze odtworzyc runtime crash.
5. Srednie: `UiPreviewVNext` i `UiPreviewVNextFull` sa DEV-only; nie traktowac jako produkcyjny wzorzec bez decyzji.

## Czego nie ruszac po tym etapie

- Nie poprawiac UI po klasach CSS bez wskazania aktywnego source-of-truth.
- Nie nakladac kolejnej globalnej warstwy CSS na `src/App.tsx` bez decyzji LF-UI-SOT-001.
- Nie kasowac legacy pages bez lokalnego spisu i guardow.
- Nie zamieniac route aliasow bez decyzji canonical.

## Zapis do Obsidiana

- data i godzina: 2026-06-27 23:14 Europe/Warsaw
- nazwa / alias: `LF-UI-SOT-000 — Preflight i mapa stanu`
- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- target file/path: `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`
- save status: zapis w repo aplikacji przez GitHub connector
- Obsidian GitHub sync: NIE WYKONANO w repo `obsidian-vault`; wpis jest repo-local `_project`
- Obsidian local sync: LOCAL_SYNC_PENDING
- tests: lokalny `git status`, `git diff --check`, route/import/anti-patch scans wymagane przed pelnym PASS
- risk audit: patrz sekcja `Ryzyka`
- what was not touched: runtime UI, pages, components, lib, CSS, package, SQL, API, Supabase/Firebase
- next step: uruchomic lokalny guard z tej notatki i dopiero potem aktywowac LF-UI-SOT-001 albo konkretny UI stage
