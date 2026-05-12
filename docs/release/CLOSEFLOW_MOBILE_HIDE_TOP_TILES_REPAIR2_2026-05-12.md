# CLOSEFLOW_MOBILE_HIDE_TOP_TILES_REPAIR2_2026-05-12

## Cel

Naprawa po etapie `Mobile hide top start tiles`, jeśli po deployu Vercel kafelki typu `Centrum dnia / Leady / Zadania / Kalendarz` nadal są widoczne na telefonie.

## Diagnoza

Pierwsza poprawka była zbyt miękka: działała tylko wtedy, gdy realny wrapper miał jedną z przewidzianych klas albo atrybutów. Jeśli render używał innego wrappera, CSS nie trafiał w źródło problemu.

## Zmiana

- nadpisano `src/styles/closeflow-mobile-start-tile-trim.css` mocniejszą, ale nadal mobile-only wersją,
- dodano próbę oznaczenia właściwych TSX wrapperów atrybutem `data-cf-mobile-start-tile-trim="true"`,
- dodano bezpiecznik CSS dla małych wrapperów, które zawierają skróty do `leads`, `tasks` i `calendar`,
- desktop/tablet zostają bez zmian.

## Nie zmieniać

- nie usuwać kafelków z Reacta,
- nie zmieniać routingu,
- nie zmieniać logiki Today,
- nie zmieniać desktopowego układu.

## Weryfikacja ręczna

1. Mobile width / telefon: wejść na `Dziś`.
2. Kafelki startowe `Centrum dnia / Leady / Zadania / Kalendarz` nie są widoczne na pierwszym ekranie.
3. Desktop: kafelki nadal widoczne.
4. `npm run build` przechodzi.
