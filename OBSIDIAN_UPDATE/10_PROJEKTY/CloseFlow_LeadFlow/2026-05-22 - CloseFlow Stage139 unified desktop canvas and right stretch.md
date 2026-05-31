# CloseFlow Stage139 — Unified Desktop Canvas and Right Stretch

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop shell / canvas background / right stretch

## FAKTY

- Po Stage138 układ jest lepszy, ale Damian wskazał:
  - różnicę kolorów między obszarem przy sidebarze a treścią,
  - za małe rozciągnięcie okna w prawo.
- Problem dotyczy desktopowego canvasu całej aplikacji, nie pojedynczego panelu.

## DECYZJA

Dodać:

```text
src/styles/closeflow-unified-desktop-canvas-stage139.css
```

Cele:
- jeden kolor tła desktopowego,
- brak pionowego pasa przy sidebarze,
- content mocniej rozciągnięty w prawo,
- mały lewy gutter przy panelu bocznym.

## TESTY

```powershell
node scripts/check-stage139-unified-desktop-canvas.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `/clients`, a potem pozostałe główne widoki.
