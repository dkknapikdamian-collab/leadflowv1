# CloseFlow Stage159 — Overlay Real Density and Footer Fix

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / dialogs / modals / footer fix

## FAKTY

- Stage158 poprawił część problemu skali podokienek, ale modal wydarzenia przeskakuje, a lead/task mogą ucinać tekst.
- Event footer z przyciskiem „Zaplanuj” może zasłaniać treść.
- Problem wynika prawdopodobnie z `zoom` na portaled dialog content.

## DECYZJE DAMIANA

- Poprawić wszystkie podokienka.
- Event footer ma być na dole i nie zasłaniać treści.
- Lead/task najlepiej bez wymuszonego scrollowania.
- Każda poprawka musi mieć guard.

## HIPOTEZY AI

- Stage159 powinien nadpisać Stage158 dla dialogów: bez zoomu, realna gęstość.
- Backdrop powinien być nieskalowany.
- Formularze powinny mieć scroll-safe body i footer jako ostatni flex element.

## TESTY

```powershell
node scripts/check-stage159-overlay-real-density-and-footer.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić ręcznie: `+ Lead`, `+ Zadanie`, `+ Wydarzenie`, selecty/dropdowny i brak zasłoniętych pól.
