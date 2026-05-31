# CloseFlow Stage147 — Shell Overflow and Work Surface Repair

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / app shell / overflow clipping / work surface

## FAKTY

- Stage145 i Stage146 są aktywne, ale route content nadal kończy się za wcześnie.
- Bug Note Recorder pokazuje, że zaznaczenie elementu jest ucinane po prawej.
- Wniosek: to nie kafelek, tylko warstwa rodzica / overflow / work surface.

## DECYZJA

Dodać Stage147:
- `closeflow-shell-overflow-work-surface-stage147.css`,
- wyłączyć clipping na shellu i route slotach,
- dodać kontrolowany work surface overrun,
- zachować jedno źródło prawdy przez CSS variables.

## TESTY

```powershell
node scripts/check-stage147-shell-overflow-work-surface.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić główne zakładki lokalnie. Nie pushować przed akceptacją wizualną.
