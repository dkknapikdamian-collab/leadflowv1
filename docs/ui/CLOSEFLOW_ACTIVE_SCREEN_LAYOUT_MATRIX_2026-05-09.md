# CloseFlow Active Screen Layout Matrix

**Data:** 2026-05-09  
**Etap:** VS-4 — Active screen layout matrix  
**Status:** audyt źródeł UI aktywnych ekranów, bez migracji runtime

## Cel

Każdy aktywny ekran ma jawnie opisane źródła UI. Ten etap nie przepina ekranów. Tworzy mapę, która mówi, gdzie ekran używa aktualnego UI systemu, a gdzie nadal opiera się o lokalny JSX, stare klasy, legacy CSS, temporary overrides albo emergency hotfixes.

## Źródła prawdy

- Route'y: `src/App.tsx`
- Ekrany: `src/pages/*`
- CSS warstwy: `src/index.css`, `src/styles/core/*`, `src/styles/page-adapters/*`, `src/styles/legacy/*`, `src/styles/temporary/*`, `src/styles/emergency/*`
- Wygenerowany JSON: `docs/ui/closeflow-active-screen-layout-matrix.generated.json`

## Statusy

| Status | Znaczenie |
|---|---|
| `OK` | Ekran w większości używa źródeł UI z rejestru i nie wymaga pilnej migracji. |
| `MIGRATE` | Ekran działa, ale ma lokalne lub mieszane źródła UI i powinien wejść do kolejnej migracji. |
| `LEGACY` | Ekran jest ciężki albo mocno oparty o stare CSS/JSX. Ruszać tylko osobnym etapem. |
| `OUT_OF_SCOPE` | Ekran nie jest aktywny albo plik nie istnieje w aktualnym branchu. |

## Wynik audytu

- Liczba ekranów: **16**
- OK: **0**
- MIGRATE: **12**
- LEGACY: **4**
- OUT_OF_SCOPE: **0**

## Matrix

| Route | File | PageShell source | PageHero source | Metric source | EntityIcon source | ActionIcon source | SurfaceCard source | ListRow source | ActionCluster source | FormFooter source | Finance source | Legacy CSS | Temporary overrides | Status | Next migration stage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /, /today | src/pages/TodayStable.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | ui-system/ActionCluster | not_detected | local finance/status markup detected | page-adapters: visual-stage02-today.css; page-adapters: visual-stage21-today-final-lock.css; temporary: stageA24/stageA25 today relations | stageA24-today-relations-label-align.css; stageA25-today-relations-lead-badge-inline.css | LEGACY | VS-5A decision hub screen adapter audit |
| /tasks | src/pages/TasksStable.tsx | legacy/shared layout wrapper | local/legacy header markup | ui-system metric components | not_detected | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | local/shared footer markup | none | page-adapters: visual-stage20-tasks-safe-css.css; page-adapters: visual-stage28-tasks-vnext.css; page-adapters: visual-stage30-tasks-compact-after-calendar.css; page-adapters: tasks-header-stage45b-cleanup.css | none | MIGRATE | VS-5B tasks list component migration |
| /leads | src/pages/Leads.tsx | legacy/shared layout wrapper | local/legacy header markup | shared adapter: StatShortcutCard -> OperatorMetricTile | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | local/shared footer markup | local finance/status markup detected | page-adapters: visual-stage03-leads.css; page-adapters: visual-stage18/25/26 leads CSS | none | MIGRATE | VS-5C leads list component migration |
| /clients | src/pages/Clients.tsx | legacy/shared layout wrapper | local/legacy header markup | shared adapter: StatShortcutCard -> OperatorMetricTile | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | local/shared footer markup | local finance/status markup detected | page-adapters: visual-stage05-clients.css; temporary: stage35 clients cleanup | stage35-clients-value-detail-cleanup.css | MIGRATE | VS-5D clients list component migration |
| /cases | src/pages/Cases.tsx | legacy/shared layout wrapper | local/legacy header markup | shared adapter: StatShortcutCard -> OperatorMetricTile | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | local/shared footer markup | none | page-adapters: visual-stage07-cases.css; page-adapters: visual-stage27-cases-vnext.css | none | MIGRATE | VS-5E cases list component migration |
| /calendar | src/pages/Calendar.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | local/shared footer markup | none | page-adapters: visual-stage29-calendar-vnext.css; temporary: stage34 calendar readability; emergency: calendar week/card readability | stage34-calendar-readability-status-forms.css; stage34b-calendar-complete-polish.css | MIGRATE | VS-5F calendar surface migration |
| /ai-drafts | src/pages/AiDrafts.tsx | legacy/shared layout wrapper | local/legacy header markup | shared adapter: StatShortcutCard -> OperatorMetricTile | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | not_detected | local finance/status markup detected | temporary: stage33 AI drafts text contrast; emergency: ai drafts right rail hotfixes | stage33a-ai-drafts-generated-text-contrast.css | MIGRATE | VS-5G AI drafts screen registry alignment |
| /notifications | src/pages/NotificationsCenter.tsx | legacy/shared layout wrapper | local/legacy header markup | ui-system metric components | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | not_detected | none | core/metric contracts only unless local page classes detected | none | MIGRATE | VS-5H notifications list registry alignment |
| /templates | src/pages/Templates.tsx | legacy/shared layout wrapper | local/legacy header markup | shared adapter: StatShortcutCard -> OperatorMetricTile | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | local/shared footer markup | local finance/status markup detected | core/page shell contracts only unless local page classes detected | none | MIGRATE | VS-5I templates screen registry alignment |
| /activity | src/pages/Activity.tsx | legacy/shared layout wrapper | local/legacy header markup | shared adapter: StatShortcutCard -> OperatorMetricTile | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | not_detected | local finance/status markup detected | emergency: activity right rail hotfixes | none | MIGRATE | VS-5J activity list registry alignment |
| /leads/:leadId | src/pages/LeadDetail.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | ui-system/ActionCluster | local/shared footer markup | local finance/status markup detected | page-adapters: visual-stage04-lead-detail.css; emergency: lead right rail wrappers | none | LEGACY | VS-6A lead detail heavy screen migration |
| /clients/:clientId | src/pages/ClientDetail.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | ui-system/ActionCluster | local/shared footer markup | local finance/status markup detected | page-adapters: visual-stage06-client-detail.css; emergency: client note/event/lead visibility finalizer | none | LEGACY | VS-6B client detail heavy screen migration |
| /case/:caseId, /cases/:caseId | src/pages/CaseDetail.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | ui-system/ActionCluster | local/shared footer markup | local finance/status markup detected | page-adapters: visual-stage08-case-detail.css; page-adapters: visual-stage13-case-detail-vnext.css; legacy: case-detail-simplified/stage2 | none | LEGACY | VS-6C case detail heavy screen migration |
| /billing | src/pages/Billing.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | not_detected | billing screen finance UI, semantic finance registry pending | finance semantics pending VS-5K | none | MIGRATE | VS-5K billing finance semantic alignment |
| /settings | src/pages/Settings.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | ui-system/EntityIcon registry | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | not_detected | local finance/status markup detected | core/settings icon/action contracts pending VS-5L | sidebar/settings polish inherited from temporary overrides | MIGRATE | VS-5L settings actions and forms alignment |
| /help, /support | src/pages/SupportCenter.tsx | legacy/shared layout wrapper | local/legacy header markup | local/legacy metric markup | direct lucide entity icons | direct lucide action icons | local/legacy card or panel markup | local/legacy list row markup | local/entity action cluster markup | not_detected | none | support surface contracts pending VS-5M | none | MIGRATE | VS-5M support center surface/list alignment |

## Zasady po VS-4

1. Nie migrować kilku ciężkich ekranów naraz.
2. Today, LeadDetail, ClientDetail i CaseDetail traktować jako ekrany wysokiego ryzyka.
3. Każda kolejna migracja ma wskazać, który wiersz z tej macierzy zmienia status.
4. Jeśli ekran dostaje nowy lokalny kolor, ikonę, kafelek, kartę albo row bez rejestru, check powinien zostać rozszerzony.
5. Finance UI ma używać semantyk z VS-2D, nie lokalnych kolorów bez znaczenia.

## Weryfikacja

```bash
npm run audit:closeflow-active-screen-layout-matrix
npm run check:closeflow-active-screen-layout-matrix
npm run build
```

## Kryterium zakończenia

VS-4 jest zakończony, gdy:

1. dokument istnieje,
2. JSON generated istnieje,
3. każdy aktywny ekran z listy ma wpis,
4. każdy wpis ma status `OK`, `MIGRATE`, `LEGACY` albo `OUT_OF_SCOPE`,
5. check i build przechodzą.
