# CloseFlow — Stage 17 — Dziś hard visual 1:1 do HTML

## Cel

Przepiąć widok **Dziś** i widoczną powłokę aplikacji na system wizualny z `closeflow_full_app_modern_5s_ui_concept.html`, bez ruszania danych, API, Supabase, auth, billingu i logiki Today.

## Zakres

- tylko warstwa wizualna,
- import nowego CSS,
- zachowanie kompatybilności guardów Stage 01/02,
- zachowanie klików, zwijania kafli, formularzy, modalów i istniejących akcji.

## Mapa funkcji

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Główny layout aplikacji | `src/components/Layout.tsx` | `.cf-html-shell`, ciemny sidebar, global bar | Tak | Dodawana jest klasa/marker kompatybilności, bez zmiany routingu. |
| Nawigacja boczna | `Layout.tsx` | `.sidebar`, `.nav-group`, `.nav-btn`, `.nav-ico` | Tak | Zmiana wizualna przez CSS, linki zostają. |
| Globalne akcje | `GlobalQuickActions` / `Layout` | `.global-bar`, `.global-actions` | Tak | CSS ujednolica wygląd, nie zmienia działania modalów. |
| Ekran Dziś | `src/pages/Today.tsx` | `page-head`, `grid-4`, `layout-list`, `right-card` | Tak | Bez podmiany na statyczne dane z HTML. |
| Kafelki/statystyki Dziś | `Today.tsx`, `StatShortcutCard` | `.metric`, `.grid-4` | Tak | Klikalność zostaje po stronie istniejącego komponentu. |
| Sekcje zwijane Dziś | `Today.tsx` | `card.pad`, `panel-head`, `work-card` | Tak | CSS zmienia wygląd, nie event handlery. |
| Zadania/wydarzenia w Dziś | `Today.tsx` | `table-card`, `row`, `work-card` | Tak | Nie zmienia terminów, statusów ani update flow. |
| Szkice AI w Dziś | `Today.tsx` | `right-card` / karta sekcji | Tak | Dane i zatwierdzanie szkiców bez zmian. |
| Snooze | `Today.tsx` | `.today-snooze-bar` | Tak | Bez zmiany opcji snooze. |
| Mobile | `Layout.tsx`, CSS | `mobile-top`, `mobile-nav`, 1 kolumna | Tak | Sidebar chowany poniżej 760 px przez CSS. |

## HTML wdrożony w tym etapie

- kolory tła i sidebaru,
- białe karty z dużym radiusem,
- cienie `shadow` / `shadow-soft`,
- globalny pasek akcji,
- metryki w stylu `.metric`,
- right rail / quick-list,
- responsywność dla 1220 px i 760 px.

## Czego nie zmieniono

- API,
- SQL,
- Supabase,
- auth,
- billing,
- work_items,
- obliczanie Today,
- kliknięcia i modale.

## Ważne

Błąd SQL `work_items.lead_id` / `uuid` nie jest naprawiany w tej paczce, bo ten etap jest wyłącznie wizualny. Mieszanie SQL z przebudową UI było przyczyną poprzedniego chaosu.

## Weryfikacja po wdrożeniu

1. `/today`: sprawdź, czy zmienił się realnie styl ekranu.
2. Kliknij kafelki u góry.
3. Rozwiń/zwiń sekcje.
4. Oznacz zadanie jako zrobione.
5. Otwórz wydarzenie.
6. Sprawdź, czy szkice AI są widoczne.
7. Odpal mobile viewport.
