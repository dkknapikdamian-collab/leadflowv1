# CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_FIX_2026-05-11

## Cel

Naprawa zachowania kafelków u góry ekranu Today na mobile.

Kliknięcie kafelka, np. `Leady bez najbliższej akcji`, ma:

1. ustawić właściwą sekcję jako aktywną,
2. rozwinąć listę,
3. przenieść sekcję wyżej,
4. przewinąć użytkownika do właściwej listy,
5. ustawić `aria-controls` i `aria-expanded` na kafelku.

## Zakres

Aktywny ekran Today działa przez:

- `src/pages/TodayStable.tsx`

Nie zmieniamy starego, nieaktywnego `src/pages/Today.tsx`.

## Pliki

- `src/pages/TodayStable.tsx`
- `scripts/check-closeflow-today-mobile-tile-focus.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `package.json`

## Test ręczny

Desktop i mobile:

1. Wejdź na `/`.
2. Kliknij kafelek `Leady bez najbliższej akcji`.
3. Sekcja ma się rozwinąć.
4. Strona ma przewinąć do tej sekcji.
5. Na telefonie po kliknięciu nie może być efektu „nic się nie stało”.

## Kryterium zakończenia

Każdy klikalny kafelek Today prowadzi do widocznej, rozwiniętej listy.
