# VISUAL_STAGE_08_CASE_DETAIL_2026-04-29

## Cel
Przepięcie karty sprawy `CaseDetail` na system wizualny z `closeflow_full_app_modern_5s_ui_concept.html`, bez zmiany logiki biznesowej.

## Tabela mapowania

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Karta sprawy | `src/pages/CaseDetail.tsx`, `/case/:caseId` oraz `/cases/:caseId` | `layout-detail` / `main-case-detail` | Tak | Dodany scope w globalnym shellu. |
| Pobranie sprawy | `fetchCaseByIdFromSupabase` | ten sam ekran, nowa warstwa wizualna | Tak | Supabase bez zmian. |
| Checklisty / braki | `fetchCaseItemsFromSupabase`, `insertCaseItemToSupabase`, `updateCaseItemInSupabase`, `deleteCaseItemFromSupabase` | zakładka `Checklisty`, work-card / right-card | Tak | Nie zmieniono statusów, uploadów ani akceptacji. |
| Zadania sprawy | `fetchTasksFromSupabase`, `insertTaskToSupabase`, `updateTaskInSupabase` | mini-grid / lista działań | Tak | Terminy i statusy bez zmian. |
| Wydarzenia sprawy | `fetchEventsFromSupabase`, `insertEventToSupabase`, `updateEventInSupabase` | mini-grid / lista działań | Tak | Kalendarz bez zmian. |
| Historia aktywności | `fetchActivitiesFromSupabase`, `insertActivityToSupabase` | zakładka `Historia` / work-card | Tak | Typy aktywności zostają. |
| Notatka operatora | `isAddNoteOpen`, `newNote`, `insertActivityToSupabase` | szybka akcja / historia | Tak | Bez direct-write poza istniejącym flow. |
| Portal klienta | `createClientPortalTokenInSupabase`, `buildPortalUrl` | prawy panel / szybka akcja | Tak | Tokeny i URL bez zmian. |
| Lifecycle V1 | `resolveCaseLifecycleV1`, `CaseDetailV1CommandCenter`, `setCaseLifecycleStatusV1` | hero / centrum dowodzenia | Tak | Start, zrobione i przywróć zostają. |
| Zakładki | `TabsTrigger`, `TabsContent` | `Obsługa`, `Ścieżka`, `Checklisty`, `Historia` | Tak | Nie usuwamy zakładek. |
| HTML: osobna szuflada AI | docelowo Stage 18 | Nie wdrożono w Stage 08 | Nie | Brak nowej logiki AI na ślepo. |

## Zmienione pliki
- `src/components/Layout.tsx`
- `src/styles/visual-stage08-case-detail.css`
- `scripts/check-visual-stage08-case-detail.cjs`
- `src/index.css` przez `apply-visual-stages.ps1`
- `package.json` przez `apply-visual-stages.ps1`

## Nie zmieniaj
- Supabase
- auth
- billing/access
- model danych
- logika checklist
- upload/status/akceptacja
- portal klienta
- lifecycle V1
- taski, eventy, aktywności

## Kryterium zakończenia
- `npm run check:visual-stage08-case-detail`
- `npm run check:polish`
- `npm run build`
- `npm run lint`
- `npm run verify:closeflow:quiet`
