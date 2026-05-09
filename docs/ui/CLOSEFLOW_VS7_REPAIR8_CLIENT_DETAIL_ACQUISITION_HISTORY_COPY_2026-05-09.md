# CLOSEFLOW VS-7 Repair8: ClientDetail acquisition history copy

## Cel
Domknac kolejny release gate po VS-7 bez cofania semantycznego systemu kolorow kafelkow.

## Zakres
- `src/pages/ClientDetail.tsx`
- `tests/client-detail-simplified-card-view.test.cjs`

## Kontrakt
Ekran klienta ma utrzymac kopie historii pozyskania:
- `Lead zrodlowy`
- `Historia pozyskania`
- `Zrodlo:`
- `Otworz sprawe`

## Nie zmieniac
- VS-7 semantic metric tones
- OperatorMetricTile runtime
- soft-trash leadow/klientow
- routingu spraw/leadow

## Kryterium zakonczenia
- `node --test tests/client-detail-simplified-card-view.test.cjs`
- `npm run verify:closeflow:quiet`
- `npm run test:raw`
- `npm run build`
