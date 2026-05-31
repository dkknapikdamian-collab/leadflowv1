# CloseFlow Stage142 — Repair Shared Work Width Frame Mount

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop width source truth / naprawa mountu frame

## FAKTY

- Damian wkleił wynik diagnostyki:
  `left: 12`, `width: 262`, `right: 274`, `maxWidth: 1500px`.
- To oznacza, że frame szerokości nie działa w głównym obszarze contentu.
- Poprawka ma dotyczyć każdej zakładki, nie tylko `Dziś`.

## DECYZJA

Stage142 normalizuje `Layout.tsx`:
- usuwa błędne/stare wrappery `cf-work-width-frame`,
- dodaje dokładnie jeden wrapper bezpośrednio w `.view.active[data-shell-content]`,
- CSS celuje w `data-stage142-main-work-frame="true"`.

## TESTY

```powershell
node scripts/check-stage142-repair-shared-work-width-frame-mount.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Po wdrożeniu sprawdzić w konsoli `data-stage142-main-work-frame`, czy jego parent to `data-shell-content=true` i czy width nie jest już `262`.
