# CloseFlow — uproszczony widok klienta v81

## Cel

Przebudować widok `ClientDetail` tak, żeby klient był kartoteką relacji, a nie drugim pulpitem pracy.

## Zakres wdrożenia

- Lewy panel klienta: avatar, imię/nazwa, krótki opis, mini statusy, dane kontaktowe, zasada panelu i główne akcje.
- Prawy panel klienta: tylko 4 zakładki: `Podsumowanie`, `Sprawy`, `Kontakt`, `Historia`.
- Usunięcie dużej sekcji `Leady klienta` z głównego widoku.
- Lead źródłowy pokazany jako informacja historyczna i źródło sprawy, nie jako równorzędny ekran pracy.
- Akcje pracy operacyjnej prowadzą do sprawy, zadań albo kalendarza.

## Zasada UX

Po wejściu w klienta użytkownik ma w 5 sekund zrozumieć:

- z kim ma do czynienia,
- jakie sprawy są otwarte,
- co wymaga ruchu,
- gdzie kliknąć dalej.

## Pliki zmieniane przez paczkę

- `src/pages/ClientDetail.tsx`
- `docs/CLIENT_DETAIL_SIMPLIFIED_CARD_VIEW_2026-04-26.md`
- `tests/client-detail-simplified-card-view.test.cjs`

## Test ręczny

1. Wejdź w klienta z jedną sprawą.
2. Sprawdź, czy widać lewy panel klienta i prawy panel z zakładkami.
3. Sprawdź, czy nie ma dużej sekcji `Leady klienta`.
4. Kliknij `Otwórz sprawę`.
5. Wejdź w zakładki `Sprawy`, `Kontakt`, `Historia`.
6. Sprawdź mobile: lewy panel powinien zejść nad treść, a karty nie powinny się rozjeżdżać.

## Komendy po wdrożeniu

```powershell
node tests/client-detail-simplified-card-view.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```
