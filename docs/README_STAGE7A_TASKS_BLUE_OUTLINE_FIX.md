# ETAP 7A — Tasks hotfix: neutralny aktywny kafelek statystyk

## Cel
Usunąć widoczną kolorową obramówkę / ring / glow z aktywnego górnego kafelka statystyk w zakładce `Zadania`.

## Zmienione pliki
- `src/index.css`
- `src/styles/stage7a-tasks-blue-outline-fix.css`
- `tests/stage7a_tasks_blue_outline_fix.test.cjs`

## Zakres
- Hotfix jest ograniczony do `.cf-html-view.main-tasks-html .grid-5`.
- Aktywny kafelek zachowuje neutralne tło, neutralny border i neutralny cień.
- Kliknięcia kafelków oraz filtrowanie zadań nie są zmieniane.

## Poza zakresem
- Brak zmian w licznikach.
- Brak zmian w logice tasków.
- Brak zmian w kalendarzu.
- Brak zmian w Today.
- Brak zmian w routingu, API, auth i billingu.

## Test ręczny
1. Otwórz `/tasks`.
2. Kliknij kolejne górne kafelki.
3. Sprawdź desktop.
4. Sprawdź mobile.
5. Aktywny kafelek ma być czytelny, ale bez kolorowej ramki i poświaty.
