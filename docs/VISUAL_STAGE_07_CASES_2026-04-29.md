# Visual Stage 07 — Sprawy

## Cel

Przenieść ekran `Sprawy` na docelowy system wizualny z `closeflow_full_app_modern_5s_ui_concept.html` bez zmiany logiki biznesowej, Supabase, API, modeli danych, tworzenia spraw, usuwania spraw, lifecycle, filtrów ani routingu.

## Tabela mapowania

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Lista spraw | `src/pages/Cases.tsx`, `filteredCases.map` | `table-card` / lista spraw | Tak | Dane i filtrowanie bez zmian. |
| Pobieranie spraw | `fetchCasesFromSupabase()` | ten sam ekran, nowy scope `main-cases` | Tak | Supabase bez zmian. |
| Kontekst leadów | `fetchLeadsFromSupabase()` | źródło pozyskania / link do leada | Tak | Link do historii pozyskania zostaje. |
| Kontekst zadań | `fetchTasksFromSupabase()` | lifecycle / następny krok | Tak | Bez zmiany logiki. |
| Kontekst wydarzeń | `fetchEventsFromSupabase()` | lifecycle / następny krok | Tak | Bez zmiany logiki. |
| Dodaj sprawę | `Dialog open={isCreateCaseOpen}` | akcja w `page-head` | Tak | Modal i formularz zostają. |
| Formularz nowej sprawy | tytuł, klient, email, telefon, status | modal `Nowa sprawa` | Tak | Nie dodano nowych wymaganych pól. |
| Podpowiedzi klienta | `clientSuggestions`, `handleSelectClientSuggestion` | modal tworzenia sprawy | Tak | Zachowane. |
| Usuń sprawę | `deleteCaseWithRelations`, `ConfirmDialog` | akcja kontekstowa rekordu | Tak | Potwierdzenie i relacje bez zmian. |
| Wyszukiwarka | `searchQuery` | `search` z HTML | Tak | Szuka po sprawie, kliencie i statusie. |
| Kafelki filtrów | `caseView`, `StatShortcutCard` | `grid-4` / metryki operacyjne | Tak | HTML pokazuje 4 główne kafle, repo ma 7 realnych filtrów. Nie usuwamy ich. |
| W realizacji | status/lifecycle | metryka główna | Tak | Realne dane. |
| Czeka na klienta | lifecycle waiting/approval | metryka główna | Tak | Realne dane. |
| Zablokowane | lifecycle blocked | metryka główna | Tak | Realne dane. |
| Gotowe | ready/completed | metryka / filtr | Tak | Realne dane. |
| Akceptacje | dodatkowy filtr repo | dodatkowy kafel operacyjny | Tak | Funkcja istniejąca w aplikacji nie była widoczna w HTML. Zostaje jako filtr operacyjny. |
| Bez kroku | dodatkowy filtr repo | dodatkowy kafel operacyjny | Tak | Nie usuwamy. |
| Pozyskane | sprawy z `leadId` | dodatkowy kafel operacyjny | Tak | Nie usuwamy. |
| Progress sprawy | `Progress value={percent}` | statusline / progress | Tak | Bez zmiany obliczeń. |
| Lifecycle V1 | `resolveCaseLifecycleV1` | statusline / karta rekordu | Tak | Bez zmiany logiki. |
| Otwórz historię pozyskania | link do `/leads/:leadId` | akcja rekordu | Tak | Zostaje. |
| Otwórz sprawę | link do `/cases/:id` | akcja rekordu | Tak | Routing bez zmian. |
| HTML: `Dodaj brak`, `Portal klienta` | pełne funkcje są w `CaseDetail` | Nie wdrożono na liście | Częściowo | Element ponad zakres listy. Pełne działania zostają w Stage 08. |

## Funkcje zachowane

- `fetchCasesFromSupabase`
- `fetchLeadsFromSupabase`
- `fetchTasksFromSupabase`
- `fetchEventsFromSupabase`
- `createCaseInSupabase`
- `deleteCaseWithRelations`
- `ConfirmDialog`
- `resolveCaseLifecycleV1`
- `StatShortcutCard`
- `searchQuery`
- `caseView`
- `clientSuggestions`
- link do `CaseDetail`
- link do historii pozyskania leada

## Nie zmieniaj

- Supabase
- API
- auth
- billing/access
- model danych
- `createCaseInSupabase`
- `deleteCaseWithRelations`
- lifecycle V1
- relacji lead → sprawa
- routingu do `CaseDetail`

## Guard

Dodany skrypt:

```bash
npm run check:visual-stage07-cases
```

Sprawdza:

- route scope `/cases`,
- klasę `main-cases`,
- marker `data-visual-stage-cases`,
- import CSS Stage 07,
- zachowanie kluczowych funkcji z `Cases.tsx`.

## Ręczna weryfikacja

Po nałożeniu ZIP-a kliknij:

- `/cases`
- `Dodaj sprawę`
- formularz nowej sprawy
- podpowiedzi klienta
- wyszukiwarka
- wszystkie kafle filtrów
- link do leada
- link do karty sprawy
- usunięcie sprawy z `ConfirmDialog`
- mobile poniżej 760px

## Nie wdrożono 1:1

Nie wdrożono 1:1: osobnych akcji `Dodaj brak` i `Portal klienta` na liście spraw — powód: realna logika tych funkcji znajduje się w `CaseDetail`, a Stage 07 dotyczy listy spraw. Rekomendacja: pełne mapowanie tych funkcji w Visual Stage 08 — CaseDetail.
