# STAGE212Y - Today icon size final

## FAKTY
- Zachowano kierunek visual source truth z serii Stage212.
- Ikona Dziś zostaje jako Home, nie LayoutDashboard.
- Poprawiono rozmiar kontenera ikonki Dziś do 28x28 px, zgodnie z resztą sidebaru.
- SVG ikony ustawiono na 16x16 px.
- Dodano guard:
  - scripts/check-stage212y-today-icon-size-final.cjs

## TESTY
- node scripts/check-stage212y-today-icon-size-final.cjs
- npm run build

## CZEGO NIE RUSZANO
- Supabase
- RLS
- dane
- logika biznesowa
- logika powiadomień
- deployment
- push

## BACKUP
_project\backups\stage212y_today_icon_size_final_20260531_145314
