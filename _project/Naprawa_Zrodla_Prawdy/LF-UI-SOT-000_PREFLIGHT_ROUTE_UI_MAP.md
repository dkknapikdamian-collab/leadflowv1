# Naprawa zrodla prawdy — LF-UI-SOT-000 preflight UI/routes

Data: 2026-06-28 00:28 Europe/Warsaw
Status: CANONICAL_MOVED_HERE / COMPLETE_MAP / DOCS_ONLY / RUNTIME_NOT_TOUCHED
canonical_name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Stage id: LF-UI-SOT-000

## Cel miejsca

To miejsce zbiera prace typu: naprawa zrodla prawdy, mapa aktywnych routes, aktywnych widokow, legacy kandydatow, CSS layerow i anty-plastrowych ryzyk UI.

Nie jest to folder na zwykle run reporty. To jest punkt decyzyjny przed zmianami UI/runtime, zeby AI nie poprawialo wygladu przez nakladanie kolejnej warstwy na stara.

## Werdykt

Ten etap nie zmienial UI i nie poprawial wygladu.

Scalono:

1. mape routera z `src/App.tsx`, aktywne importy, aktywne routes, aliasy i ryzyka globalnego CSS;
2. lokalny log Codexa: spis `src/pages`, `src/components`, `src/components/ui`, `src/lib`, route scan, legacy scan, anti-patch scan i forbidden doc import scan.

Status nie jest pelnym PASS runtime, bo lokalne repo wedlug raportu Codexa mialo wczesniejsze brudne zmiany w `TodayStable`, stylach, skryptach i testach.

## Aktywny router

Aktywne zrodlo routes: `src/App.tsx`.

Aktywne strony produkcyjne / route importy:

- `src/pages/PublicLanding`
- `src/pages/LegalPrivacy`
- `src/pages/LegalTerms`
- `src/pages/TodayStable` — aktywny Today
- `src/pages/Leads`
- `src/pages/SalesFunnel`
- `src/pages/LeadDetail` — static import unblock
- `src/pages/Cases`
- `src/pages/CaseDetail`
- `src/pages/Clients`
- `src/pages/ClientDetail` — static import unblock
- `src/pages/ClientPortal`
- `src/pages/Activity`
- `src/pages/AiDrafts`
- `src/pages/Settings`
- `src/pages/AdminAiSettings`
- `src/pages/Login`
- `src/pages/TasksStable` — aktywny Tasks
- `src/pages/Calendar`
- `src/pages/Billing`
- `src/pages/SupportCenter`
- `src/pages/NotificationsCenter`
- `src/pages/Templates`
- `src/pages/ResponseTemplates`
- `src/pages/UiPreviewVNextFull` — DEV-only preview
- `src/pages/UiPreviewVNext` — DEV-only preview

## Aktywne routes

- `/login` -> `Login` albo redirect `/`
- `/start` -> `Login` albo redirect `/`
- `/privacy` -> `LegalPrivacy`
- `/terms` -> `LegalTerms`
- `/portal/:caseId/:token` -> `ClientPortal`
- `/` -> `Today` albo `Login`
- `/today` -> `Today` albo redirect `/login`
- `/leads` -> `Leads`
- `/dev/funnel` -> `SalesFunnel` tylko DEV
- `/funnel` -> `SalesFunnel`
- `/leads/:leadId` -> `LeadDetail`
- `/tasks` -> `Tasks`
- `/calendar` -> `Calendar`
- `/cases` -> `Cases`
- `/case/:caseId` -> `LegacyCaseRedirect`
- `/cases/:caseId` -> `CaseDetail`
- `/clients` -> `Clients`
- `/clients/:clientId` -> `ClientDetail`
- `/activity` -> `Activity`
- `/ai-drafts` -> `AiDrafts`
- `/notifications` -> `NotificationsCenter`
- `/templates` -> `Templates`
- `/case-templates` -> redirect `/templates`
- `/response-templates` -> `ResponseTemplates`
- `/billing` -> `Billing`
- `/help` -> `SupportCenter`
- `/support` -> `SupportCenter`
- `/settings/ai` -> `AdminAiSettings`
- `/settings` -> `Settings`
- `/ui-preview-vnext` -> `UiPreviewVNext` tylko DEV
- `/ui-preview-vnext-full` -> `UiPreviewVNextFull` tylko DEV
- `*` -> redirect `/`

## Lokalny spis `src/pages`

Liczba plikow top-level: 40.

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
- `legal-public-pages.css` jako CSS obok pages, nie route page

## Lokalny spis `src/components`

Liczba top-level: 57.

Najwazniejsze ryzyka:

- backupy `Layout.tsx.stage*.bak` leza w `src/components`;
- `VisualFoundationRuntime*` sugeruja runtime DOM/CSS foundation layers;
- `CloseFlowPageHeaderV2.tsx` i `OperatorTopBarRuntime.tsx` sa kandydatami do audytu header/source-of-truth.

## Lokalny spis `src/components/ui`

Liczba plikow: 20.

Aktywna podstawa UI:

- `button.tsx`
- `dialog.tsx`
- `input.tsx`
- `select.tsx`
- `textarea.tsx`
- `tabs.tsx`
- `card.tsx`
- `badge.tsx`
- `table.tsx`
- `tooltip.tsx`

Zasada: nowe UI zmiany maja preferowac te komponenty zamiast surowego HTML, chyba ze etap jawnie uzasadnia wyjatek.

## Lokalny spis `src/lib`

Liczba top-level: 91.

Najwazniejsze ryzyka:

- backupy `appearance.ts.stage*.bak` leza w `src/lib`;
- istnieja legacy compatibility layers: `firebase-utils.ts`, `closeflow-runtime-source-truth.ts`, `closeflow-visual-source-truth.ts`;
- route helper istnieje jako `routes.ts` i powinien byc uzywany przy kolejnych zmianach tras;
- Calendar/Today ma wiele kontraktow: `calendar-operational-entry-*`, `calendar-lead-shadow-entry-policy.ts`, `calendar-dom-normalizer-policy.ts`.

## Legacy / alias kandydaci

1. `/case/:caseId` jest legacy i robi redirect replace do canonical `/cases/:caseId`.
2. `/case-templates` robi redirect replace do `/templates`.
3. `/support` i `/help` renderuja ten sam `SupportCenter`, ale `/support` nie jest redirectem.
4. `/` i `/today` renderuja Today. Nie zmieniac bez decyzji.
5. `/login` i `/start` renderuja Login dla wylogowanego. Nie zmieniac bez decyzji public/auth.
6. `/dev/funnel` i `/funnel` sa rozdzielone przez `import.meta.env.DEV`.
7. `Today.tsx` istnieje lokalnie, ale router uzywa `TodayStable.tsx`.
8. `Tasks.tsx` istnieje lokalnie, ale router uzywa `TasksStable.tsx`.
9. `Dashboard.tsx` istnieje lokalnie, ale nie jest importowany w `src/App.tsx`.

## Wynik legacy scan

Skan lokalny Codexa znalazl 4278 linii pasujacych do `old|legacy|temp|v2|new|deprecated`.

Liczby:

- `legacy` — 173
- `deprecated` — 5
- `old` — 511
- `temp` — 1577
- `v2` — 613
- `new` — 1351

Top pliki po liczbie trafien:

- `src/pages/Calendar.tsx` — 163
- `src/pages/Templates.tsx` — 141
- `src/styles/closeflow-page-header-v2.css` — 124
- `src/pages/Today.tsx` — 121
- `src/pages/CaseDetail.tsx` — 120
- `src/styles/visual-stage14-lead-detail-vnext.css` — 89
- `src/styles/closeflow-template-modal-source-truth-stage181l.css` — 86
- `src/styles/visual-stage12-client-detail-vnext.css` — 80
- `src/pages/Leads.tsx` — 75
- `src/pages/Tasks.tsx` — 72

Interpretacja: nie kazde trafienie jest bledem. `new` i `template` generuja false-positive. Realne ryzyko jest w backupach `.bak`, runtime DOM normalizatorach, legacy compatibility i stage-specific CSS.

## Wynik anti-patch scan

Skan lokalny Codexa znalazl 931 linii pasujacych do antywzorcow.

Liczby:

- inline `style` — 17
- `display none / display:` — 224
- `z-index / zIndex` — 91
- `lucide-react` — 33
- surowe `<button>` — 213

Top pliki:

- `src/pages/CaseDetail.tsx` — 68
- `src/pages/ClientDetail.tsx` — 44
- `src/pages/LeadDetail.tsx` — 42
- `src/pages/Calendar.tsx` — 30
- `src/styles/visual-stage12-client-detail-vnext.css` — 27
- `src/pages/Today.tsx` — 26
- `src/pages/AiDrafts.tsx` — 25
- `src/pages/Settings.tsx` — 21

Interpretacja:

- nowy inline style w UI stage jest domyslnie zabroniony;
- `display: none` i `hidden` w CaseDetail/Calendar/style layers wymagaja osobnego audytu;
- `z-index` jest ryzykowny w admin tools i modalach/overlay;
- nowe bezposrednie importy ikon powinny isc przez centralne registry;
- nowe przyciski powinny isc przez `src/components/ui/button.tsx`.

## Forbidden doc import scan

Wynik lokalny: brak trafien dla importow dokumentacji projektowej w runtime.

Status: PASS dla runtime importow dokumentacji projektowej.

## Globalne style i ryzyko plastrow

`src/App.tsx` importuje wiele globalnych warstw CSS, m.in. tokeny, source-truth, stage-specific hotfixy, modal layers, density layers, right-rail layers i finance layer.

Werdykt: to jest glowny kandydat do kolejnego UI source-of-truth audit. Nie usuwac tego na oko. Najpierw zrobic macierz:

- aktywny token/system;
- hotfix stage;
- legacy;
- disabled;
- kandydat do migracji/usuniecia.

## Nastepne etapy w tym miejscu

### LF-UI-SOT-001 — Global CSS layer source-of-truth audit

Cel: rozpisac wszystkie globalne importy CSS z `src/App.tsx` na aktywny token/system, hotfix stage, legacy, disabled. Bez usuwania na oko.

### LF-UI-SOT-002 — Pages inventory and unused route candidates

Cel: lokalny spis wszystkich `src/pages/*` i porownanie z importami z `src/App.tsx`. Oznaczyc aktywne, legacy, preview, do potwierdzenia.

### LF-UI-SOT-003 — Component/UI inventory and raw action guard

Cel: spis `src/components/*` i `src/components/ui/*`; wskazac surowe `<button>`, bezposrednie ikony, inline style i odchylenia od komponentow UI.

### LF-UI-SOT-004 — Route alias policy

Cel: decyzja canonical/legacy dla `/help` vs `/support`, `/today` vs `/`, `/start` vs `/login`, bez ruszania tras przed decyzja.

### LF-UI-SOT-005 — Active visual template dictionary

Cel: stworzyc slownik aktywnych wzorcow widoku dla Today / Leads / Clients / Cases / CaseDetail / ClientDetail, z jednym wskazanym plikiem prawdy na kazdy widok.

## Zakazy po tym audycie

- Nie poprawiac UI po klasach CSS bez wskazania aktywnego source-of-truth.
- Nie nakladac kolejnej globalnej warstwy CSS na `src/App.tsx` bez decyzji LF-UI-SOT-001.
- Nie kasowac legacy pages bez lokalnego spisu i guardow.
- Nie zamieniac route aliasow bez decyzji canonical.
- Nie robic masowego cleanupu backupow `.bak` bez osobnego etapu i selektywnej listy plikow.

## Lokalny guard przed kolejnym UI/runtime stage

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git status --short --branch
git diff --check
git diff -- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md _project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md _project/00_AI_START_SPIS_TRESCI.md _project/04_ETAPY_ROZWOJU_APLIKACJI.md
```

## Zapis do Obsidiana

- data i godzina: 2026-06-28 00:28 Europe/Warsaw
- nazwa / alias: Naprawa zrodla prawdy — LF-UI-SOT-000
- canonical_name: CloseFlow / LeadFlow
- repo aplikacji: dkknapikdamian-collab/leadflowv1
- branch aplikacji: dev-rollout-freeze
- target file/path: `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`
- save status: zapisane w repo aplikacji
- runtime/UI: nietkniete
- SQL/API/Supabase: nietkniete
- Obsidian vault: wymaga osobnego wpisu w `dkknapikdamian-collab/obsidian-vault`
- Obsidian local sync: LOCAL_SYNC_PENDING
