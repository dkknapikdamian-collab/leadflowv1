# Stage25D — ClientDetail JSX build fix

## Cel

Naprawić błąd buildu po Stage25B/Stage25C:

`Expected ")" but found "className"` w `ClientDetail.tsx`.

## Przyczyna

Nowa lista spraw została wstawiona jako drugi element JSX w branchu ternary `leads.length ? (...)`, bez opakowania fragmentem `<>...</>`.

## Zmiana

- opakowano smart listę spraw i stary ukrywany blok acquisition-only we fragment JSX,
- zachowano zmiany Stage25B i Stage25C,
- utrzymano tekst `Wejdź w sprawę`,
- uruchamiane są guardy Stage21-Stage25D,
- uruchamiany jest `npm run build`,
- commit i push są w tym samym poleceniu.

Ta paczka działa na stanie po nieudanym Stage25C. Nie trzeba resetować repo.
