# Stage25C — ClientDetail guard compatibility final

## Cel

Naprawić zatrzymanie Stage25B na starym guardzie Stage23A.

## Przyczyna

Stage25B zmienił nową akcję w karcie sprawy na krótsze `Wejdź`, a historyczny guard `check:stage23a-client-detail-cases-visibility-contrast` nadal wymagał dosłownego tekstu `Wejdź w sprawę`.

## Zmiana

- dodano kompatybilny stały tekst `STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT = 'Wejdź w sprawę'`,
- główna akcja nowej karty sprawy pokazuje `Wejdź w sprawę`,
- zachowano wszystkie zmiany Stage25B,
- odpalane są guardy Stage21, Stage22A, Stage23A, Stage24A, Stage25B, Stage25C,
- odpalany jest `npm run build`,
- commit i push są w tym samym poleceniu.

## Uwaga

To działa na stanie po nieudanym Stage25B. Nie trzeba resetować repo.
