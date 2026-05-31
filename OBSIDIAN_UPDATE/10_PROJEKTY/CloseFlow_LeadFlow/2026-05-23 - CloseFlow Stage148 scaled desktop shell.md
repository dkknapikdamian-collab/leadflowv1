# CloseFlow Stage148 — Scaled Desktop Shell

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / app shell / scaled desktop canvas

## FAKTY

- Runtime pokazał szerokie okno laptopa, ale mały CSS viewport.
- Stage145-147 są aktywne, ale dalsze overruny nie rozwiązują przycinania warstwy.
- Problem jest w app-shell/viewport, nie w pojedynczym kafelku.

## DECYZJA

Dodać:
- `src/components/ShellDesktopViewportRuntime.tsx`,
- `src/styles/closeflow-scaled-desktop-shell-stage148.css`,
- `docs/ui/CLOSEFLOW_STAGE148_RUNTIME_SCALED_DESKTOP_AUDIT.js`,
- guard i raport Stage148.

Model: desktopowy canvas aplikacji skalowany do nietypowego CSS viewportu.

## TESTY

```powershell
node scripts/check-stage148-scaled-desktop-shell.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Test wizualny wszystkich głównych zakładek. Bez push przed akceptacją.
