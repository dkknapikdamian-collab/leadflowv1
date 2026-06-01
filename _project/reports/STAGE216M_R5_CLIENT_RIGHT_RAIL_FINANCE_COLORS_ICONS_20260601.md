# STAGE216M-R5 - ClientDetail right rail finance/colors/icons

## Cel
Dopięcie prawej szyny klienta po Stage216M-R4: finanse mają być widoczne jako trzecia karta, a kolory przycisków i ikon mają iść za rytmem LeadDetail.

## Fakty
- Stage216M-R4 wprowadził prawą szynę klienta w układzie: Najbliższe działania, Główna sprawa, Finanse klienta.
- W UI po wdrożeniu finanse nie były widoczne w prawym railu, a kolory przycisków/ikon różniły się od LeadDetail.

## Decyzje Damiana
- Kierunek prawej szyny jest dobry.
- Brakuje widocznych finansów.
- Kolory muszą być spójne z LeadDetail.
- Każda ikona w prawym panelu ma mieć spójny, czytelny styl.

## Zakres
- CSS-only polish dla ClientDetail right rail.
- Wymuszenie widoczności karty finansów.
- Ujednolicenie kolorów ikon i przycisków.

## Czego nie ruszano
- Supabase.
- API.
- Logika płatności.
- Logika spraw.
- Dane klienta.

## Testy
- `node tests/stage216m-r5-client-right-rail-finance-colors-icons-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok
Po deployu sprawdzić prawą szynę klienta i leada na tym samym viewportcie. Jeśli pasuje, następnie poprawić środkowe top-kafle klienta względem leada.
