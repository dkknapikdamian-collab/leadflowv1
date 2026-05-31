# CloseFlow Stage152 — Dense Cards 80 Percent Target

## Rule

Every visual correction must have its own guard.

## Decision

Stage152 targets the 70-80% browser zoom density without using browser zoom.

This means:
- we do not scale the whole app,
- we do not touch Stage149 width,
- we do not add per-tab hacks,
- we tighten card padding, card gaps, card min-heights, icon sizes and control heights globally.

## Source truth split

- Stage149 = app width / shell source truth.
- Stage150 = typography source truth.
- Stage151 = initial compact card source truth.
- Stage152 = denser 80% target card source truth.

## Tuning

Adjust only:

```text
src/styles/closeflow-dense-cards-80-percent-target-stage152.css
```

Main variables:

```css
--cf152-card-pad-y
--cf152-card-pad-x
--cf152-card-gap
--cf152-kpi-min-height
--cf152-panel-min-height
--cf152-list-row-min-height
--cf152-side-card-min-height
```
