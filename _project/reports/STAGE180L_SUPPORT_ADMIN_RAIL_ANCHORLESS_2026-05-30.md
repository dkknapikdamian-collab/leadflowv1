# STAGE180L - Support admin rail anchorless fix

## Cel
Naprawić Stage180K, który zatrzymał się na błędzie `could not find support shell closing anchor`, ponieważ wcześniejsze etapy H/I/J zmieniły strukturę `SupportCenter.tsx`.

## Zakres
- Dodanie prawego panelu `Panel obsługi` tylko dla admina.
- Zostawienie pełnej szerokości dla zwykłego użytkownika.
- Usunięcie starych sekcji: `Sugerowane zgłoszenia`, `Pomoc operacyjna`, martwe copy pomocy.
- Guard bez zależności od starego anchora JSX.

## Pliki
- `src/pages/SupportCenter.tsx`
- `src/styles/visual-stage17-support-vnext.css`
- `scripts/stage180l-apply-support-admin-rail-anchorless.cjs`
- `scripts/check-stage180l-support-admin-rail-anchorless.cjs`
- `scripts/check-stage180k-support-admin-rail.cjs`

## Testy
- `node scripts/check-stage180l-support-admin-rail-anchorless.cjs`
- `npm run build`

## Czego nie ruszano
- Supabase
- RLS
- API zgłoszeń
- deployment
- push

## Następny krok
Uruchomić lokalnie `/help`, zrobić Ctrl+F5 i ocenić panel admina.
