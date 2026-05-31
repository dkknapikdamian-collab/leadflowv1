# CloseFlow Stage150 — Panel Visual Source Truth

## Current accepted state

Stage149 is the width source truth for the whole app panel.

This means:
- no per-tab width hacks,
- no separate max-width for Dzis / Leady / Klienci / Sprawy / Zadania / Kalendarz / Szablony / Odpowiedzi / Aktywnosc,
- no transform-scale desktop canvas,
- no `100% + overrun` width patches,
- the panel should use one app-shell contract:
  - sidebar fixed rail,
  - main fluid column,
  - route content fills main.

## Stage149 is the width source truth

Canonical CSS:
```text
src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css
```

Key contract:
```css
--cf149-min-canvas-width: 1280px;
grid-template-columns: 240px minmax(0, 1fr);
```

## Stage150 is typography source truth

Canonical CSS:
```text
src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css
```

Goal:
- slightly smaller text,
- same typography rules across all tabs,
- no separate visual style per tab.

## Do not reintroduce

Do not reintroduce:
- `max-w-7xl` as route root width owner,
- `mx-auto` as route root positioning owner,
- per-tab width CSS,
- scaled desktop shell runtime,
- overrun-based layout extension,
- hidden/clipped right-side panels.
