# Visual Stage 04 — LeadDetail

## Cel

Przepięcie karty leada na kierunek wizualny z `closeflow_full_app_modern_5s_ui_concept.html`: `layout-detail`, lewa karta danych kontaktowych, środkowa część operacyjna, hero z najbliższą akcją, hero light dla wartości/finansów, zakładki oraz prawy panel szybkich akcji.

Ten etap nie zmienia logiki biznesowej, Supabase, API, auth, billing, modeli danych ani flow lead -> klient -> sprawa.

## Tabela mapowania

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Karta leada | `src/pages/LeadDetail.tsx`, `/leads/:leadId` | `layout-detail` | Tak | Dodany route scope `main-lead-detail`. |
| Dane kontaktowe | karta danych w LeadDetail | `person-card`, `kv-row` | Tak | Email, telefon, firma, źródło i status zostają. |
| Edycja leada | `isEditing`, `handleUpdateLead` | akcja drugorzędna / panel | Tak | Bez zmiany formularza. |
| Usuwanie leada | `handleDeleteLead` | akcja drugorzędna | Tak | Bez zmiany confirm i routingu po usunięciu. |
| Zmiana statusu | `handleUpdateStatus` | badge/status i akcje | Tak | Statusy bez zmian. |
| AI follow-up | `LeadAiFollowupDraft` | sekcja AI w karcie leada | Tak | Bez zmiany providera lub parsera. |
| AI następna akcja | `LeadAiNextAction` | hero / następny ruch | Tak | Bez zmiany działania. |
| Rozpocznij obsługę | `startLeadServiceInSupabase` | główna akcja | Tak | Flow lead -> sprawa zostaje. |
| Lead już w obsłudze | `associatedCase`, `showServiceBanner` | box „Ten temat jest już w obsłudze” | Tak | Sprzedażowe akcje nie są przywracane jako główne. |
| Połącz ze sprawą | `linkCaseId`, `linkingCase` | prawy panel / akcje | Tak | Bez zmiany API. |
| Szybkie zadanie | `isQuickTaskOpen`, `handleCreateQuickTask` | prawy panel / szybka akcja | Tak | Modal i konflikt terminów zostają. |
| Szybkie wydarzenie | `isQuickEventOpen`, `handleCreateQuickEvent` | prawy panel / szybka akcja | Tak | Modal i konflikt terminów zostają. |
| Notatki | `note`, `handleAddNote`, edycja/usuwanie aktywności | zakładka Historia / work-card | Tak | Bez zmiany zapisu. |
| Zadania powiązane | `linkedTasks` i akcje toggle/edit/delete | sekcja działań / work-card | Tak | Statusy i terminy bez zmian. |
| Wydarzenia powiązane | `linkedEvents` i akcje toggle/edit/delete | sekcja działań / work-card | Tak | Statusy i terminy bez zmian. |
| Finanse | `getLeadFinance`, partial payments | `hero.light` / zakładka Finanse | Tak | Obliczenia bez zmian. |
| Historia aktywności | `activities`, `activityTitle` | zakładka Historia | Tak | Typy aktywności zostają. |
| Element HTML: osobna szuflada AI | Stage 18 | Nie w tym etapie | Nie | Ten etap nie dodaje nowego backendu ani osobnej logiki AI. |

## Pliki

- `src/components/Layout.tsx`
- `src/styles/visual-stage04-lead-detail.css`
- `scripts/check-visual-stage04-lead-detail.cjs`
- `docs/VISUAL_STAGE_04_LEAD_DETAIL_2026-04-28.md`

## Guard/test

Dodano `check:visual-stage04-lead-detail`.

Guard sprawdza:

- scope route `/leads/:leadId`,
- klasę `main-lead-detail`,
- marker `data-visual-stage-lead-detail`,
- zachowanie komponentów AI,
- zachowanie flow `startLeadServiceInSupabase`,
- szybkie zadanie/wydarzenie,
- notatki,
- edycję/usuwanie leada,
- finanse,
- zakładki,
- import CSS.

## Ręczna weryfikacja

Po nałożeniu kliknąć:

- `/leads/:leadId`,
- edycja leada,
- zmiana statusu,
- `Rozpocznij obsługę`,
- `Otwórz sprawę`,
- dodaj zadanie,
- dodaj wydarzenie,
- dodaj notatkę,
- edytuj/usuń notatkę,
- toggle/edit/delete taska,
- toggle/edit/delete eventu,
- zakładki,
- mobile poniżej 760px.

## Kryterium zakończenia

Karta leada ma nowy scope i visual polish zgodny z HTML-em, ale wszystkie obecne funkcje LeadDetail zostają zachowane.
