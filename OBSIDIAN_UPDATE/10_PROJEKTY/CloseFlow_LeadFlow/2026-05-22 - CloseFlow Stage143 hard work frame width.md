# CloseFlow Stage143 — Hard Work Frame Width

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop width / hard selector repair

## FAKTY

- Frame istnieje, ale diagnostyka pokazała `left 12 / width 262`.
- Poprzedni CSS nie zastosował się do frame’u jako głównego contentu.
- Problem dotyczy każdej zakładki, bo width source truth musi być centralny.

## DECYZJA

Dodać Stage143:
- marker `data-stage143-work-width-frame="true"` w `Layout.tsx`,
- CSS `closeflow-hard-work-frame-width-stage143.css`,
- krótki selektor:
  `[data-shell-content="true"] > [data-stage143-work-width-frame="true"]`.

## TESTY

```powershell
node scripts/check-stage143-hard-work-frame-width.cjs
npm.cmd run build
```
