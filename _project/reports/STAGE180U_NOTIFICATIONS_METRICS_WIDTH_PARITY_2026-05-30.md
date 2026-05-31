# STAGE180U - Notifications metric width parity

## Cel
Dostosowanie górnych kafelków metryk w widoku Powiadomienia do szerokości głównego ekranu/shella.

## Fakty
- Widok /notifications używa OperatorMetricTiles z klasą notifications-stats-grid.
- Dotychczasowy CSS ustawiał max-width dla metryk i shell oddzielnie, co mogło zostawiać kafelki węższe od reszty strony po zmianach layoutu.

## Decyzje Damiana
- Górne kafelki w Powiadomieniach mają mieć taką samą szerokość jak kafelki/sekcje w innych zakładkach i jak główny ekran.

## Zakres
- src/styles/visual-stage10-notifications-vnext.css
- scripts/check-stage180u-notifications-metrics-width-parity.cjs

## Czego nie ruszano
- Supabase
- RLS
- logika powiadomień
- routing
- deployment
- push

## Testy
- node scripts/check-stage180u-notifications-metrics-width-parity.cjs
- npm run build

## Następny krok
Uruchomić dev server, wejść na /notifications i zrobić Ctrl+F5.
