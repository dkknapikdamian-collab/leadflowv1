# CloseFlow Stage149 — Clean Desktop App Shell Canvas

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / app-shell / cleanup width experiments

## FAKTY

- Stage136-148 narosły jako kolejne próby naprawy szerokości.
- Stage148 skalował root i nie rozwiązał problemu.
- Właściwy wzorzec dla tej aplikacji to desktopowy app-shell z min-width, nie transform/overrun.

## DECYZJA

Stage149:
- usuwa importy CSS Stage136-148 z App.tsx,
- usuwa ShellDesktopViewportRuntime z Layout.tsx,
- dodaje jeden plik source truth:
  `closeflow-clean-desktop-app-shell-canvas-stage149.css`.

## TESTY

```powershell
node scripts/check-stage149-clean-desktop-app-shell-canvas.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Weryfikacja lokalna bez pusha. Jeżeli UI wygląda dobrze, dopiero wtedy można przygotować commit/push i przepisać Obsidian.
