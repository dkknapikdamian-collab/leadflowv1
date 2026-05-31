# CloseFlow Stage165 — Modal Unified Event Motif Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal source truth / event motif

## FAKTY

- Każde okienko wygląda inaczej po Stage164.
- Najlepiej wygląda motyw okna wydarzenia, ale jest za duży.
- Realny wspólny komponent to `src/components/ui/dialog.tsx`.
- `DialogContent` ma `data-closeflow-modal-visual-system="true"` i `cf-modal-surface`.

## DECYZJE DAMIANA

- Wszystkie okienka mają mieć motyw jak wydarzenie.
- Wydarzenie ma być mniejsze.
- Lead, Zadanie i Wydarzenie mają iść z jednego źródła prawdy.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Poprawne źródło prawdy to selector:
  `[data-closeflow-modal-visual-system="true"].cf-modal-surface`
- Stage165 powinien być importowany po Stage164 i przejąć kontrolę nad modalami.
- Nie należy dalej tunować osobno `Lead`, `Task`, `Calendar`.

## TESTY

```powershell
node scripts/check-stage165-modal-unified-event-motif.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić trzy okna: `+ Wydarzenie`, `+ Lead`, `+ Zadanie`.
