# Stage89 - Right rail uncramp + export clears counters

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Użytkownik wskazał dwa aktywne problemy po Stage88:

1. `AI wsparcie` w prawej kolumnie nadal jest za wąskie i łamie tekst literami, np. metryki w centrum pracy są nieczytelne.
2. Po kliknięciu `Export` licznik w admin debug toolbarze nie zeruje się, mimo że feedback został wyeksportowany.

## Decyzja

Robimy jeden hotfix:

- right rail dostaje większą kolumnę na desktopie,
- centrum pracy w right rail ma osobne reguły układu,
- długie etykiety nie mogą łamać się literka po literce,
- eksport JSON/Markdown czyści lokalne zgłoszenia i odświeża liczniki.

## Zmiany

### Right rail / AI wsparcie

Marker:

- `STAGE89_RIGHT_RAIL_WORK_CENTER_UNCRAMP`

Zasady:

- desktop: prawa kolumna `minmax(400px, 440px)`,
- średni desktop: prawa kolumna `360-390px` i metryki w 2 kolumnach,
- mobile/tablet: zwykły układ responsywny,
- etykiety w metrykach mają `overflow-wrap: normal`, `word-break: normal`, `hyphens: none`.

### Admin export

Markery:

- `ADMIN_EXPORT_CLEARS_COUNTERS_STAGE89`
- `ADMIN_FEEDBACK_EXPORT_CLEAR_COUNTERS_STAGE89`

Zasady:

- po eksporcie JSON czyścimy `reviewItems`, `bugItems`, `copyItems`, `buttonSnapshots`,
- po eksporcie Markdown robimy to samo,
- toolbar natychmiast odświeża liczniki,
- toast mówi, że licznik został wyczyszczony.

## Test ręczny po deployu

1. Wejdź w kartę leada.
2. Sprawdź panel `AI wsparcie`.
3. Etykiety metryk nie mogą układać się pionowo literami.
4. Kliknij `Bug`, zapisz jeden bug.
5. Licznik `Bug` ma wzrosnąć.
6. Kliknij `Export` → `Pobierz JSON i wyczyść licznik`.
7. Licznik `Bug`, `Copy`, `Review` i `Buttons` ma wrócić do zera.
