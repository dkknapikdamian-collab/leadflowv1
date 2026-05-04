# STAGE50 - ClientDetail edit/header polish - 2026-05-04

## Cel
Naprawić widoczność trybu edycji danych klienta oraz uprościć górę ekranu klienta.

## Zakres
- src/pages/ClientDetail.tsx
- src/styles/visual-stage12-client-detail-vnext.css
- scripts/check-stage50-client-detail-edit-header-polish.cjs
- tests/stage50-client-detail-edit-header-polish.test.cjs
- package.json

## Zmieniono
- Usunięto wizualnie duplikujący breadcrumb nad nazwą klienta.
- Wymuszono czytelny ciemny tekst w trybie edycji danych klienta.
- Wymuszono widoczność przycisków edycji danych i akcji notatek.
- Statusy pod nazwą klienta ustawiono jako mniejsze, kolorowe i trzymane w jednym wierszu.

## Nie zmieniono
- API.
- Supabase.
- Modelu danych.
- Routingu.
- Logiki lead -> klient -> sprawa.

## Weryfikacja
- npm.cmd run check:stage50-client-detail-edit-header-polish
- npm.cmd run build

## Ręczny smoke test
1. Wejdź w klienta.
2. Sprawdź, że nad nazwą klienta nie ma już duplikującego breadcrumbu.
3. Kliknij Edytuj dane.
4. Tekst w polach ma być widoczny na białym tle.
5. Statusy pod nazwą klienta mają być kolorowe i w jednym wierszu.
6. W notatkach przyciski Dyktuj i Dodaj notatkę mają być widoczne.
