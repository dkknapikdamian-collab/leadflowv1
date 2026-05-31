# STAGE180V - Notifications metric width like Today

## Cel

Naprawa szerokości górnych kafelków metryk w widoku `/notifications`.

## Fakty

- Użytkownik wskazał, że górne kafelki w `/notifications` są węższe niż w innych zakładkach, np. w `/today`.
- Feedback admina pokazał, że `.notifications-stats-grid` miało realnie około 1080 px szerokości przy viewport 1707 px.
- Źródłem renderu metryk jest `OperatorMetricTiles` z klasą `notifications-stats-grid`.

## Zmiany

- Dodano mocniejszy override CSS w `src/styles/visual-stage10-notifications-vnext.css`.
- Wymuszono szerokość `max-width: 1440px`, zgodną z głównym shellem powiadomień.
- Wymuszono 4 równe kolumny na desktopie, 2 na tabletach i 1 na telefonie.
- Dodano guard `scripts/check-stage180v-notifications-metric-width-like-today.cjs`.

## Testy

- `node scripts/check-stage180v-notifications-metric-width-like-today.cjs`
- `npm run build`
- Ręcznie: restart dev servera i Ctrl+F5 na `http://localhost:3000/notifications`.

## Czego nie ruszano

- Logika powiadomień.
- Supabase.
- RLS.
- Routing.
- Deployment.
- Push.
