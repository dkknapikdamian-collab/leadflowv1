# STAGE180X_NOTIFICATIONS_METRIC_RENDERER_CLEANUP_2026-05-30

## Cel
Naprawa nieudanego Stage180W: usuniecie pozostalosci importu/type OperatorMetricTiles oraz utrwalenie recznego renderera metryk powiadomien w stylu ekranu Dzis.

## Fakty
- Lokalnie Stage180W zatrzymal sie na: OperatorMetricTiles import/type remains after cleanup.
- Pomiar DOM Damiana wykazal, ze grid i shell maja ten sam x oraz width, wiec problemem nie byl juz sam width wrappera.
- Problemem byl odmienny renderer metryk na /notifications.

## Zmiany
- src/pages/NotificationsCenter.tsx: usunieto OperatorMetricTiles i OperatorMetricTileItem.
- src/pages/NotificationsCenter.tsx: metryki powiadomien renderuja sie recznie jako grid w stylu Dzis.
- src/styles/visual-stage10-notifications-vnext.css: dodano blok STAGE180X_NOTIFICATIONS_METRIC_RENDERER_CLEANUP.
- scripts/check-stage180x-notifications-metric-renderer-cleanup.cjs: guard kontraktu.

## Nie ruszano
Supabase, RLS, routing, logika listy powiadomien, deployment, push.

## Testy
- node scripts/check-stage180x-notifications-metric-renderer-cleanup.cjs
- npm run build
