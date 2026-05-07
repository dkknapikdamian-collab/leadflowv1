# STAGE16AN - Today view customizer patternless repair

Cel: dodać w sekcji `Dziś` kontrolkę `Widok`, która pozwala użytkownikowi decydować, które kafelki u góry i odpowiadające im listy na dole są widoczne.

Zakres:
- `src/pages/TodayStable.tsx`
- `scripts/check-today-view-customizer.cjs`
- `tests/today-view-customizer.test.cjs`
- `package.json`

Kontrakt:
- kafelek i lista mają ten sam klucz sekcji,
- ukrycie sekcji ukrywa naraz kafelek i listę,
- wybór zapisuje się w `localStorage`,
- `Pokaż wszystko` przywraca pełny widok,
- patch nie dotyka backendu, billing, AI ani danych.

Naprawa względem Stage16AM:
- poprzedni patch używał zbyt kruchego regexa i nie obsłużył CRLF / aktualnego formatowania `sectionVisible`,
- Stage16AN używa odporniejszego dopasowania i usuwa niedoszły artefakt Stage16AM.
