# CloseFlow Stage162 — cf-modal-surface Lower Smaller Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal source truth / lower and smaller

## FAKTY

- Stage161 został zastosowany lokalnie i build przeszedł.
- Wizualnie jest lepiej, ale modal nadal jest za wysoko/za duży.
- Runtime target pozostaje `.cf-modal-surface[role="dialog"]`.

## DECYZJE DAMIANA

- Każde podokienko ma być niżej i trochę mniejsze.
- Ma istnieć jedno źródło prawdy dla tych modalnych okien.
- Nie pushować i nie deployować przed akceptacją.

## HIPOTEZY AI

- Stage162 powinien być tuningiem Stage161, nie nową ogólną warstwą zgadywania.
- Parametry źródła prawdy: `620px`, `76vh`, `56vh`.

## TESTY

```powershell
node scripts/check-stage162-cf-modal-surface-lower-smaller.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `+ Wydarzenie`, `+ Lead`, `+ Zadanie`.
