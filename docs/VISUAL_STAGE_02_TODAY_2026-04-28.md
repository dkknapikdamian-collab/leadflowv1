# CloseFlow — Visual Stage 02 — Dziś

Data: 2026-04-28  
Repo: `dkknapikdamian-collab/leadflowv1`  
Gałąź: `dev-rollout-freeze`  
Zakres: wyłącznie warstwa wizualna zakładki `Dziś` oraz route-scope w shellu.

## 1. Tabela mapowania przed wdrożeniem

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Ekran Dziś | `src/pages/Today.tsx` renderowany pod `/` w `Layout` | `.main.main-today` + zawartość w `.view.active` | Tak | Nie zmieniono logiki Today. Dodano tylko klasę zakresu w shellu. |
| Nagłówek Dziś | Obecny nagłówek w `Today.tsx` | Styl dopasowany do wzorca `page-head`, `h1`, `lead-copy` | Tak | CSS wygładza typografię bez zmiany JSX Today. |
| Górne kafelki Today | Obecne kafelki/shortcuty i sekcje | Wizualnie bliżej `grid-4` + `.metric` z HTML | Tak | Nie zmieniono liczników ani kliknięć. |
| Klikalne kafelki | `openTodayTopTileShortcut`, `data-today-shortcut-section`, kotwice sekcji | Nadal te same elementy, tylko nowy wygląd | Tak | Guard sprawdza obecność handlera. |
| Sekcje zwijane | `TileCard`, `data-today-tile-header`, `collapsedMap`, `onToggle` | Karty z radius/shadow z HTML | Tak | CSS zachowuje `button` header i `aria-expanded`. |
| Karta sekcji | `data-today-tile-card="true"` | `.card`, `.card.pad`, miękkie tło i cień | Tak | Bez zmiany struktury dzieci. |
| Sekcja Pilne / Zaległe | Obecne sekcje Today rozpoznawane po targetach | Wizualny akcent czerwony/amber jak w HTML | Tak | Nie zmieniono wyliczeń. |
| Bez działań | Obecny target `without_action` | Wizualny akcent amber | Tak | Zachowuje istniejący hash/kotwicę. |
| Bez ruchu | Obecny target `without_movement` | Wizualny akcent violet | Tak | Zachowuje istniejące dane. |
| Kalendarz / Najbliższe dni | Obecny target `calendar`, `openWeeklyCalendarFromToday` | Wizualny akcent blue | Tak | Klik nadal prowadzi do `/calendar?view=week`. |
| Szkice AI w Today | `getAiLeadDraftsAsync`, kafelek/sekcja szkiców | Wizualnie jako karta/sekcja w systemie HTML | Tak | Finalny zapis szkicu nadal poza Today. |
| Szybkie snooze | `TodayEntrySnoozeBar`, `data-today-quick-snooze-bar` | Styl `quick-list`/małe przyciski | Tak | Nie zmieniono opcji: Za 1h, Jutro, Za 2 dni, Przyszły tydzień. |
| Edycja zadania/wydarzenia | Obecny przycisk `Edytuj` w snooze barze | Styl przycisku z HTML | Tak | Logika `onEdit` bez zmian. |
| Oznaczanie jako zrobione/przywróć | Obecne akcje Today | Bez zmiany działania | Tak | CSS nie przechwytuje akcji. |
| Otwarcie lead/sprawa | `TodayEntryRelationLinks` do `/leads/:id`, `/cases/:id` | Linki w karcie, wizualnie bardziej miękkie | Tak | Routing bez zmian. |
| Dodawanie taska/eventu/leada z Today | Obecne modale/flow w `Today.tsx` i global bar | Bez zmiany działania | Tak | Nie przenoszono formularzy. |
| Formularze Today | Dialogi z `Dialog`, `Input`, `Label`, `TopicContactPicker` | Bez przebudowy w Stage 02 | Tak | HTML nie może zastąpić formularzy statycznymi danymi. |
| Modale Today | Obecne Dialogi dodawania/edycji | Bez zmiany triggerów i pól | Tak | Nie dotykano logiki modalnej. |
| Filtry/listy Today | Obecne sekcje i sortowanie | Bez zmiany danych, tylko card polish | Tak | Brak nowych filtrów w Stage 02. |
| Supabase/API | `fetchCalendarBundleFromSupabase`, `fetchLeadsFromSupabase`, insert/update/delete | Bez zmian | Tak | Stage 02 nie dotyka API ani kontraktu danych. |
| Mobile Today | Obecny mobile + Stage 01 shell | Dodatkowy polish poniżej 760px | Tak | Bez dużych kafli, bez rozjazdu tekstu. |
| Globalny AI | Stage 01 `GlobalQuickActions` | Jedno miejsce nad ekranem | Tak | Today nie renderuje lokalnej kopii globalnych akcji. |

## 2. Audyt obecnego ekranu Dziś

### Akcje
- kliknięcie kafelków/shortcutów Today,
- zwijanie i rozwijanie sekcji,
- przejście do kalendarza tygodniowego,
- przejście do Szkiców AI,
- otwarcie leada,
- otwarcie sprawy,
- oznaczenie zadania/wydarzenia jako zrobione albo przywrócone,
- szybkie odłożenie: za 1h, jutro, za 2 dni, przyszły tydzień,
- edycja zadania/wydarzenia,
- dodawanie i aktualizacja tasków/eventów w istniejących modalach.

### Formularze
- formularze dodawania/edycji zadań,
- formularze dodawania/edycji wydarzeń,
- formularz dodawania leada, jeśli wywoływany z Today,
- pola relacji przez `TopicContactPicker`.

### Modale
- dialogi dodawania/edycji,
- istniejące modale shadcn/Radix,
- brak nowych atrap modalnych.

### Filtry i dane
- obecne sekcje Today są liczone przez istniejące helpery i dane z Supabase/fallback,
- Stage 02 nie zmienia obliczania zaległości, aktywności, braku ruchu, szkiców AI ani kalendarza.

### Miejsca ryzyka
- zbyt agresywny CSS mógłby uszkodzić przyciski snooze,
- zbyt szeroki scope mógłby zmienić inne ekrany,
- podmiana JSX Today mogłaby zgubić modale i handlery.

Dlatego Stage 02 używa `main-today` ustawianego tylko dla route `/` i styluje istniejące atrybuty `data-today-*`.

## 3. Audyt HTML

### Docelowy układ z HTML
- `page-head`,
- `grid-4`,
- `metric`,
- `layout-list`,
- `hero-grid`,
- `card.pad`,
- `right-card`,
- `quick-list`,
- mobile bez sidebaru.

### Elementy z HTML wykorzystane w Stage 02
- tło i miękkie karty,
- radiusy 28/20/14,
- cień `shadow` i `shadow-soft`,
- typografia nagłówka,
- card polish dla sekcji,
- mobile polish poniżej 760px,
- kolory akcentów: blue/red/amber/violet.

### Elementy z HTML niewdrożone 1:1 w Stage 02

Nie wdrożono 1:1: pełnego przepisania JSX Today na `hero-grid` i prawy panel `Najbliższe dni/Skróty` — powód: bez pełnego lokalnego builda i bez ręcznego testu mogłoby to zgubić istniejące handlery, formularze i modale — rekomendacja: zrobić to dopiero, gdy po Stage 02 potwierdzimy wizualnie, które obecne sekcje mają zostać w lewej/prawej kolumnie.

HTML pokazuje element ponad obecny zakres: statyczne metryki i przykładowe treści. Nie wdrożono statycznych danych, bo zadanie dotyczy tylko wyglądu.

## 4. Mapa przepięcia

| Stary element | Nowe miejsce |
|---|---|
| Obecny root strony Dziś | `Layout` dodaje `main-today` tylko dla `/` |
| Obecne karty sekcji | CSS `visual-stage02-today.css` styluje `data-today-tile-card` |
| Obecne nagłówki sekcji | CSS styluje `data-today-tile-header` |
| Obecny snooze bar | CSS styluje `data-today-quick-snooze-bar` |
| Obecne linki do leadów i spraw | Zostają, dostają spokojniejszy wygląd |
| Obecne stany tekstowe i tła Tailwind | Scoped override w `.main-today` |
| Obecny mobile | Dodatkowy CSS tylko w `.main-today` |

## 5. Implementacja

### Zmienione pliki
- `src/components/Layout.tsx`
- `src/styles/visual-stage02-today.css`
- `scripts/check-visual-stage02-today.cjs`
- `docs/VISUAL_STAGE_02_TODAY_2026-04-28.md`

### Aktualizowane przez skrypt
- `src/index.css` — dopięcie importu `visual-stage02-today.css`,
- `package.json` — dopięcie `check:visual-stage02-today` i guardu do `lint`.

## 6. Guard/test

Dodany guard `scripts/check-visual-stage02-today.cjs` sprawdza:
- marker `VISUAL_STAGE_02_TODAY_ROUTE_SCOPE`,
- klasę `main-today`,
- import CSS Stage 02,
- obecność kluczowych kontraktów Today:
  - global actions dedupe,
  - kafelki i nagłówki `data-today-*`,
  - snooze bar,
  - handler shortcutów,
  - szkice AI,
  - insert/update tasków i eventów,
- brak mojibake w plikach etapu.

## 7. Ręczna weryfikacja po wdrożeniu

1. Wejdź na `/`.
2. Sprawdź, czy ekran Dziś ładuje dane.
3. Kliknij każdy górny kafelek.
4. Rozwiń i zwiń każdą sekcję.
5. Kliknij `Edytuj` przy zadaniu/wydarzeniu.
6. Kliknij snooze: `Za 1h`, `Jutro`, `Za 2 dni`, `Przyszły tydzień`.
7. Otwórz powiązanego leada i sprawę.
8. Sprawdź kafelek/sekcję Szkice AI.
9. Zmniejsz ekran poniżej 760px i sprawdź czy treść nie wychodzi poza ekran.

## 8. Kryterium zakończenia

Zakładka `Dziś` ma wizualnie wejść w nowy system z HTML-a, ale nadal działać jak obecna aplikacja: kafelki klikają, sekcje się zwijają, taski/eventy można edytować i odkładać, szkice AI są widoczne, a dane pochodzą z aplikacji.
