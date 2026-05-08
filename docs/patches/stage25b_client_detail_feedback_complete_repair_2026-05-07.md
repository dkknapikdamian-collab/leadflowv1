# Stage25B — ClientDetail feedback complete repair

## Źródło

Naprawa po błędzie paczki Stage25A oraz feedback z admin toola z 2026-05-07 23:12.

## Co naprawia

- usuwa niedokończone pliki Stage25A,
- naprawia błąd składni w skrypcie naprawczym,
- ukrywa `Kompletność sprawy / Finanse klienta`,
- ukrywa stary wiersz historii pozyskania leada w zakładce `Aktywne sprawy`,
- dodaje nową listę spraw z nazwą sprawy, wartością, statusem, kompletnością i akcjami,
- przesuwa tekst notatki pod przyciski,
- wymusza ciemny tekst w `Szybkie akcje`,
- delikatnie powiększa roadmapę.

## Weryfikacja

Apply uruchamia:
- Stage21 guard,
- Stage22A guard,
- Stage23A guard,
- Stage24A guard,
- Stage25B guard,
- `npm run build`.

## Uwaga

Przycisk `Usuń` nadal nie robi destrukcyjnego kasowania z karty klienta. Pokazuje komunikat, bo prawdziwe usuwanie wymaga osobnego etapu z potwierdzeniem i kontrolą backendową.
