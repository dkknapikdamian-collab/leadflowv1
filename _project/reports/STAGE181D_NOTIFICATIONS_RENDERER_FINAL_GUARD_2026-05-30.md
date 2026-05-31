# STAGE181D Notifications renderer final guard

## Cel
- Zamknąć niedokończony cleanup kafelków powiadomień po Stage180W/X/Y/Z/181A-C.
- Utrzymać ręczny renderer kafelków w stylu Dziś.
- Nie usuwać live toastu `Powiadomienia przeglądarki są włączone.` bo to nie jest martwa karta Kanały.

## Fakty z diagnostyki
- Lokalny `NotificationsCenter.tsx` miał już ręczny renderer kafelków `notifications-today-parity-grid`.
- Guard poprzednich etapów błędnie traktował live toast jako martwe copy po karcie Kanały.
- `PermissionCopy` i importy `OperatorMetricTiles` były już usunięte albo zostały usunięte przez ten etap.

## Zakres zmian
- `src/pages/NotificationsCenter.tsx`
- `src/styles/visual-stage10-notifications-vnext.css`
- `scripts/check-stage181d-notifications-renderer-final-guard.cjs`

## Czego nie ruszano
- Supabase
- RLS
- routing
- lista powiadomień
- prawy panel poza martwą kartą Kanały
