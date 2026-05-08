# CloseFlow admin feedback visual repair — 2026-05-08

## Cel

Naprawa P1 z eksportu admin feedbacku z 2026-05-08:

1. `/cases/:id` — panel `Dodaj do sprawy` / `case-detail-create-action-card`: skasować czarne tło za kafelkami.
2. `/calendar` — `Brak powiązania` ma być czytelne.
3. `/calendar` — godzina wpisu, np. `01:00`, ma być czytelna.
4. `/calendar` — boczny panel `Najbliższe 7 dni` nie może mieć białych liter na białym tle.

## Zakres zmiany

- Dodano scoped CSS guard: `CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_2026_05_08`.
- Plik CSS: `src/index.css`.
- Dodano check: `npm run check:closeflow-admin-feedback-visual-repair`.

## Nie zmieniono

- Brak zmian modelu danych.
- Brak zmian API.
- Brak przebudowy layoutu.
- Brak zmian routingowych.

## Test ręczny po wdrożeniu

1. Wejdź w `/cases/<id>` i sprawdź panel `Dodaj do sprawy`: nie ma czarnego tła za kafelkami.
2. Wejdź w `/calendar` i sprawdź wpisy w planie: `Brak powiązania` i godzina są widoczne.
3. Sprawdź lewy/boczny panel `Najbliższe 7 dni`: daty i tekst są czytelne na jasnym tle.
4. Sprawdź tryb desktop przy szerokim viewport podobnym do zgłoszenia: 2304 x 1094, DPR ok. 0.83.
