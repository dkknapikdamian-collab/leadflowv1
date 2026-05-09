# CloseFlow VS-4 — Active screen layout matrix — 2026-05-09

Marker: `CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4`

## Cel

Każdy aktywny ekran ma jawnie przypisane źródła UI. Ten plik jest generowany z `src/App.tsx` oraz plików stron, żeby nie zgadywać ręcznie, które ekrany używają komponentów systemu wizualnego.

## Zakres

- etap audytowy, bez zmian runtime UI;
- matrix obejmuje route, plik strony, komponenty UI systemu, lokalne importy CSS i lokalne override’y;
- legacy CSS i lokalne override’y są na tym etapie raportowane, ale nie blokowane;
- VS-2C-2 pozostaje deferred, brak migracji list pages.

## Summary

- generated_at: `2026-05-09T17:33:25.978Z`
- route_count: `27`
- screen_file_count: `22`
- rows_with_legacy_css_non_blocking: `15`
- rows_with_local_overrides_non_blocking: `21`

## Matrix

| route |file |status |PageShell |PageHero |MetricGrid |MetricTile |EntityIcon |ActionIcon |SurfaceCard |ListRow |ActionCluster |FormFooter |FinanceSnapshot |legacy CSS |local overrides |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| /login | src/pages/Login.tsx | public_auth | no | no | no | no | yes | no | no | no | no | no | no | - | semantic_tailwind_color_classes |
| /portal/:caseId/:token | src/pages/ClientPortal.tsx | public_portal | no | no | no | no | yes | no | no | no | no | no | no | - | template_className<br>semantic_tailwind_color_classes |
| / | src/pages/TodayStable.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | - | semantic_tailwind_color_classes |
| /today | src/pages/TodayStable.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | - | semantic_tailwind_color_classes |
| /leads | src/pages/Leads.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage20-lead-form-vnext.css | - |
| /leads/:leadId | src/pages/LeadDetail.tsx | protected | no | no | no | no | yes | no | no | no | yes | no | no | ../styles/visual-stage14-lead-detail-vnext.css | template_className<br>local_class_or_tone_map |
| /tasks | src/pages/TasksStable.tsx | protected | no | no | no | no | no | no | no | no | no | no | no | - | - |
| /calendar | src/pages/Calendar.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage22-event-form-vnext.css | inline_style<br>template_className<br>semantic_tailwind_color_classes<br>local_class_or_tone_map |
| /cases | src/pages/Cases.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage23-client-case-forms-vnext.css | inline_style<br>local_class_or_tone_map |
| /case/:caseId | src/pages/CaseDetail.tsx | protected | no | no | no | no | yes | no | no | no | yes | no | no | ../styles/visual-stage13-case-detail-vnext.css | inline_style<br>template_className |
| /cases/:caseId | src/pages/CaseDetail.tsx | protected | no | no | no | no | yes | no | no | no | yes | no | no | ../styles/visual-stage13-case-detail-vnext.css | inline_style<br>template_className |
| /clients | src/pages/Clients.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage23-client-case-forms-vnext.css | - |
| /clients/:clientId | src/pages/ClientDetail.tsx | protected | no | no | no | no | yes | no | no | no | yes | no | no | ../styles/visual-stage12-client-detail-vnext.css | inline_style<br>template_className |
| /activity | src/pages/Activity.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage8-activity-vnext.css<br>../styles/hotfix-right-rail-dark-wrappers.css | inline_style<br>semantic_tailwind_color_classes |
| /ai-drafts | src/pages/AiDrafts.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage9-ai-drafts-vnext.css<br>../styles/hotfix-right-rail-dark-wrappers.css | local_class_or_tone_map |
| /notifications | src/pages/NotificationsCenter.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage10-notifications-vnext.css<br>../styles/hotfix-right-rail-dark-wrappers.css | inline_style<br>semantic_tailwind_color_classes |
| /templates | src/pages/Templates.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | - | semantic_tailwind_color_classes |
| /case-templates | - | protected | no | no | no | no | no | no | no | no | no | no | no | - | - |
| /response-templates | src/pages/ResponseTemplates.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | - | semantic_tailwind_color_classes |
| /billing | src/pages/Billing.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage16-billing-vnext.css | template_className |
| /help | src/pages/SupportCenter.tsx | protected | no | no | no | no | no | no | no | no | no | no | no | ../styles/visual-stage17-support-vnext.css | template_className |
| /support | src/pages/SupportCenter.tsx | protected | no | no | no | no | no | no | no | no | no | no | no | ../styles/visual-stage17-support-vnext.css | template_className |
| /settings/ai | src/pages/AdminAiSettings.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | - | template_className<br>semantic_tailwind_color_classes |
| /settings | src/pages/Settings.tsx | protected | no | no | no | no | yes | no | no | no | no | no | no | ../styles/visual-stage19-settings-vnext.css | - |
| /ui-preview-vnext | src/pages/UiPreviewVNext.tsx | public_preview | no | no | no | no | no | no | no | no | no | no | no | - | inline_style<br>template_className |
| /ui-preview-vnext-full | src/pages/UiPreviewVNextFull.tsx | public_preview | no | no | no | no | no | no | no | no | no | no | no | - | inline_style<br>style_tag |
| * | - | fallback_redirect | no | no | no | no | no | no | no | no | no | no | no | - | - |

## Interpretacja

- `yes` przy komponencie oznacza, że nazwa komponentu występuje w pliku strony. To jest audyt statyczny, nie test runtime renderowania.
- `legacy CSS` pokazuje lokalne importy CSS wykryte w pliku strony, jeżeli nazwa wygląda jak stage/hotfix/repair/legacy.
- `local overrides` pokazuje ryzyka utrzymaniowe: inline style, template className, lokalne mapy klas albo ręczne klasy semantycznych kolorów.

## Kryterium zakończenia VS-4

- `docs/ui/closeflow-active-screen-layout-matrix.generated.json` istnieje i zawiera matrix tras.
- `docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md` istnieje i zawiera tabelę matrix.
- `npm run check:closeflow-active-screen-layout-matrix` przechodzi.
- Etap nie zmienia runtime UI.
