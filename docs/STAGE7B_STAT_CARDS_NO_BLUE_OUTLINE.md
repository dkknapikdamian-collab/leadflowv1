# Stage 7B — usunięcie niebieskiego obramowania kart skrótów

## Cel
Usunąć niebieskie obramowanie/ring z aktywnej karty skrótu, np. kafla `Na dziś`, bez zmiany danych, routingu, kalendarza ani logiki zadań.

## Zmienione obszary
- `src/components/StatShortcutCard.tsx`
- `tests/stage7b_stat_shortcut_no_blue_outline.test.cjs`

## Zakres zmian
- Aktywna karta skrótu nadal może mieć delikatne tło i cień.
- Usunięty jest niebieski `ring-2 ring-primary/40`.
- Wyłączony jest niebieski focus ring na tym komponencie, żeby po kliknięciu nie zostawała widoczna niebieska ramka.

## Poza zakresem
- Brak zmian w API.
- Brak zmian w Supabase.
- Brak zmian w sidebarze.
- Brak zmian w kalendarzu.
- Brak zmian w logice tasków.

## Test ręczny
1. Wejdź na ekran z kafelkami skrótów.
2. Kliknij `Na dziś`.
3. Sprawdź, czy kafel nie ma niebieskiego obramowania.
4. Sprawdź, czy kliknięcie nadal filtruje/przenosi zgodnie z dotychczasową logiką.
