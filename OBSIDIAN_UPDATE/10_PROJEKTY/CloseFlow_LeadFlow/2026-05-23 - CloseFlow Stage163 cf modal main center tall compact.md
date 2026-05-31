# CloseFlow Stage163 — cf-modal Main Center Tall Compact

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal source truth / main work-area center / tall compact

## FAKTY

- Stage162 poprawił część problemu, ale modal nadal jest za bardzo po lewej i proporcja jest za szeroka.
- Runtime target: `.cf-modal-surface[role="dialog"]`.
- Dla wydarzeń brakuje pionowej przestrzeni.

## DECYZJE DAMIANA

- Modale bardziej na środek.
- Raczej wyższe niż szersze.
- To samo podejście dla wszystkich podokienek.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Centrowanie powinno być w panelu roboczym, nie w pełnym viewportcie z sidebarem.
- Dodać kontrolowany shift X jako source truth.
- Event modal powinien dostać wyższy envelope 84vh.

## TESTY

```powershell
node scripts/check-stage163-cf-modal-main-center-tall-compact.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `+ Wydarzenie`, `+ Lead`, `+ Zadanie`.
