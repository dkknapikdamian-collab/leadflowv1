# CloseFlow Stage164 — cf-modal Top Anchor Light Surface

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal vertical positioning / light surface

## FAKTY

- Po Stage163 środek poziomy jest już akceptowalny.
- Problem: modal nadal jest ucięty pionowo.
- Problem: okno zadania ma czarne tło.
- Runtime target: `.cf-modal-surface[role="dialog"]`.

## DECYZJE DAMIANA

- Teraz przesunąć okna w dół / naprawić pionowe ucinanie.
- Okno zadania nie ma mieć czarnego tła.
- Jedno źródło prawdy dla modalnych okien.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Trzeba odejść od pionowego centrowania `translateY(-50%)` dla wysokich modali.
- Top anchoring jest stabilniejsze dla formularzy z dużą liczbą pól.
- Light modal surface naprawi task modal i ujednolici UI.

## TESTY

```powershell
node scripts/check-stage164-cf-modal-top-anchor-light-surface.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `+ Wydarzenie`, `+ Lead`, `+ Zadanie`.
