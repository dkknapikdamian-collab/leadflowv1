# CloseFlow — Visual Stage 21 — Dziś final lock

Data: 2026-04-29  
Zakres: wyłącznie zakładka `Dziś`  
Tryb: ZIP patch, bez pusha do gita  
Repo: `dkknapikdamian-collab/leadflowv1`  
Gałąź robocza: `dev-rollout-freeze`

## Cel

Domknąć wizualnie zakładkę `Dziś` w kierunku HTML `closeflow_full_app_modern_5s_ui_concept.html`, ale bez ruszania funkcji.

Ten etap jest bezpiecznym lockiem CSS. Nie podmienia danych, nie dotyka API, nie rusza Supabase i nie tworzy atrap.

## Tabela mapowania przed wdrożeniem

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Nagłówek zakładki `Dziś` | `src/pages/Today.tsx` | `page-head` z kickerem, tytułem, opisem i akcjami po prawej | Tak | CSS ustawia rytm i typografię, nie zmienia treści ani akcji. |
| Główne akcje zakładki | `Today.tsx` + globalny shell | `head-actions` i `global-bar` | Tak | Przyciski zachowują obecne flow. |
| Kafelki górne / metryki | Obecne komponenty Today / `StatShortcutCard` | `grid-4` + `metric` | Tak | Liczby zostają z aplikacji, nie z HTML. Kafelki mają tylko mocniejszy lock wyglądu i hover. |
| Klikalność kafelków | Obecna logika Today | Te same kafelki w nowym stylu | Tak | Ten etap nie dopisuje nowej logiki kliknięć, tylko nie psuje obecnej. |
| Lista rzeczy do zrobienia | Obecne sekcje Today | `table-card`, `row`, `work-card` | Tak | Sekcje i filtrowanie zostają z repo. |
| Sekcje zwijane / grupy | Obecne sekcje Today | Karty `card`, `panel-head`, `work-card` | Tak | CSS nie rusza stanu zwijania. |
| Prawy panel / skróty | Obecne bloki pomocnicze Today | `right-card` + `quick-list` | Tak | Jeśli repo ma więcej elementów niż HTML, zostają w prawym panelu lub istniejącej sekcji. |
| Szkice AI / elementy do sprawdzenia | Obecny ekran i dane aplikacji | Wizualnie jako karta/sekcja Today | Tak | Etap nie zmienia działania szkiców. |
| Dialogi / modale z Today | Obecne komponenty modalne | Zaokrąglone pola i spójny styl | Tak | Formularze nie są przebudowywane logicznie. |
| Mobile | Obecny responsive shell | `mobile-top`, `mobile-nav`, jedna kolumna | Tak | CSS wzmacnia układ mobilny dla Today. |

## Zmień

- Dodaj `src/styles/visual-stage21-today-final-lock.css`.
- Podepnij import w `src/index.css`.
- Dodaj guard `scripts/check-visual-stage21-today-final-lock.cjs`.
- Dodaj dokumentację etapu.

## Nie zmieniać

- Nie zmieniać `src/pages/Today.tsx`, jeśli nie trzeba.
- Nie zmieniać danych, API, Supabase, Firebase, auth, billing, workspace ani RLS.
- Nie zmieniać zachowania kafelków, sekcji, modali, formularzy, filtrów i nawigacji.
- Nie podmieniać realnych danych na statyczne dane z HTML.
- Nie tworzyć nowego dashboardu obok Today.

## Po wdrożeniu sprawdzić

1. `npm.cmd run build`
2. `node scripts/check-visual-stage21-today-final-lock.cjs`
3. Ekran `/` / `Dziś`:
   - nagłówek,
   - kafelki górne,
   - kliknięcia kafelków,
   - sekcje list,
   - skróty po prawej,
   - modale dodawania / edycji, jeśli są dostępne z Today,
   - mobile.

## Kryterium zakończenia

Zakładka `Dziś` wizualnie siedzi w systemie HTML/Forteca i nadal działa dokładnie na istniejących danych oraz akcjach.

## Co może wymagać ręcznej oceny po odpaleniu

- Czy któryś istniejący kafelek ma inny sens niż kafelki z HTML i wymaga zmiany samej etykiety w osobnym etapie.
- Czy któryś blok Today ma więcej danych niż HTML przewiduje i powinien trafić do prawego panelu albo `Więcej`.
- Czy mobile nie robi zbyt długich kart przy dużej liczbie rekordów.
