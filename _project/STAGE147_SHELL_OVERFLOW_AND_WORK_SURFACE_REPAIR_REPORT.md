# STAGE147 Shell Overflow and Work Surface Repair — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / app shell / overflow clipping / work surface

## Cel

Naprawić sytuację po Stage146, gdzie:
- główny obszar roboczy nadal nie wypełnia prawej części ekranu,
- zaznaczenie Bug Note Recorder pokazuje ucięcie/limit po prawej stronie,
- problem wygląda na clipping / overflow / ograniczenie na warstwie rodzica, nie na pojedynczy kafelek.

## FAKTY

- Stage145 i Stage146 są aktywne lokalnie.
- Screenshot pokazuje, że route content zaczyna się poprawnie, ale kończy za wcześnie.
- Zaznaczenie debuggera nie dochodzi do prawego brzegu, co wskazuje na warstwę ograniczającą wyżej.
- `Layout.tsx` renderuje wszystkie zakładki w `div.view.active[data-shell-content=true]`, więc fix powinien dotyczyć route slotu i jego ancestorów, nie samych kafelków.

## DECYZJA

Dodać Stage147:
- `src/styles/closeflow-shell-overflow-work-surface-stage147.css`,
- import po wcześniejszych style stage,
- `overflow-x: visible`, `clip-path:none`, `contain:none` na shellu/route slotach,
- route slot dostaje kontrolowany overrun:
  `width: calc(100% + var(--cf147-work-overrun))`,
- specjalny wariant dla niskiego CSS viewportu przy desktopowym input:
  `@media (max-width: 700px) and (hover:hover) and (pointer:fine)`.

## Testy

```powershell
node scripts/check-stage147-shell-overflow-work-surface.cjs
npm.cmd run build
```

## Runtime audit

```text
docs/ui/CLOSEFLOW_STAGE147_RUNTIME_WIDTH_AND_CLIPPING_AUDIT.js
```

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- deployment
- push

## Następny krok

Sprawdzić `/leads`, `/clients`, `/`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeżeli nadal brakuje szerokości, zwiększyć tylko `--cf147-work-overrun`.
