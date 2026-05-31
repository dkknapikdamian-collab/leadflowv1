# STAGE180R - Notifications remove channels card anchorless

## Cel
Usunąć z widoku `/notifications` kartę prawego panelu `Kanały`, w tym blok o powiadomieniach przeglądarki oraz blok `Poranny digest e-mail`.

## Kontekst
Stage180Q zatrzymał się, bo patcher szukał zbyt kruchego anchora. Stage180R usuwa kartę przez wyszukanie zawartości i granic sekcji.

## Fakty
- Praca lokalna.
- Repo: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- Branch: `dev-rollout-freeze`.
- Moduł: `src/pages/NotificationsCenter.tsx`.

## Decyzje Damiana
- Skasować widoczną kartę `Kanały` z prawego panelu powiadomień.

## Zakres
- Usunięcie karty `Kanały`.
- Usunięcie martwej funkcji `PermissionCopy` i nieużywanego stanu `browserEnabled`.
- Pozostawienie pozostałych kart prawego panelu.
- Dodanie guarda Stage180R.

## Czego nie ruszano
- Supabase.
- RLS.
- Routing.
- Logika listy powiadomień.
- Deployment i push.

## Testy automatyczne
- `node scripts/check-stage180r-notifications-remove-channels-card-anchorless.cjs`
- `npm run build`

## Test ręczny
- Uruchomić dev server.
- Otworzyć `http://localhost:3000/notifications`.
- Wykonać `Ctrl+F5`.
- Sprawdzić, że karta `Kanały` i `Poranny digest e-mail` zniknęły.

## Następny krok
Ocenić wizualnie prawy panel powiadomień bez karty kanałów.
