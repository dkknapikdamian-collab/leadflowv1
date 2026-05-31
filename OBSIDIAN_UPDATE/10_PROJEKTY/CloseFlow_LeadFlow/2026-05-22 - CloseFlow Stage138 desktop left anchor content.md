# CloseFlow Stage138 — Desktop Left Anchor Content

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop shell / left anchor

## FAKTY

- Stage137 poprawił szerokość, ale content nadal jest za bardzo centrowany.
- Damian chce przesunąć główne okna aż do panelu bocznego.
- Nie chodzi o jeden kafelek, tylko o desktopowy układ całych widoków.

## DECYZJA

Dodać Stage138:

```text
src/styles/closeflow-desktop-left-anchor-content-stage138.css
```

Cel:
- route-rooty zaczynają się przy panelu bocznym,
- zostaje mały gutter `16px`,
- prawa kolumna i listy wykorzystują większą przestrzeń,
- mobile/tablet bez zmian.

## TESTY

```powershell
node scripts/check-stage138-desktop-left-anchor-content.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `/clients`, `/leads`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
