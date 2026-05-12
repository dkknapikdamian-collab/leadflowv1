# CLOSEFLOW_MOBILE_HIDE_TOP_TILES_2026-05-12

## Cel

Na telefonie ukryc startowe, duze kafelki/skroty z naglowka strony, np. `Centrum dnia`, `Leady`, `Zadania`, `Kalendarz`, bo zajmuja zbyt duzo pierwszego widoku.

## Zakres

Zmiana jest celowo ograniczona do mobile:

```css
@media (max-width: 767px)
```

Desktop i tablet nie sa ruszane.

## Co zmieniono

- Dodano plik `src/styles/closeflow-mobile-start-tile-trim.css`.
- Podpieto go do globalnego CSS.
- Dodano check `check:mobile-start-tile-trim`.

## Decyzja techniczna

Nie usuwamy komponentow Reacta. Chowamy tylko warstwe wizualna na telefonie. To ogranicza ryzyko regresji w desktopie i pozwala latwo cofnac zmiane.

## Test reczny

1. Otworz aplikacje na szerokosci telefonu, np. 390 px.
2. Wejdz w `Dzis`.
3. Sprawdz, czy na starcie nie widac duzych kafelkow typu `Centrum dnia`, `Leady`, `Zadania`, `Kalendarz`.
4. Sprawdz, czy tytul strony, glowne CTA i tresc robocza sa widoczne wyzej.
5. Otworz desktop >= 1024 px i potwierdz, ze kafelki nadal sa widoczne.

## Ryzyko

Jesli czesc kafelkow ma inne klasy niz obecne selektory, trzeba dodac na ich wrapperze atrybut:

```tsx
data-cf-mobile-start-tile-trim="true"
```

albo dopisac ich wrapper do tego samego CSS. Nie robic osobnego, drugiego systemu mobile.
