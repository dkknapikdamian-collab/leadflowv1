# CloseFlow Stage156 — Real Density Tokens, No Zoom

## Decision

Stage156 implements the correct direction after rejected Stage153/154/155 attempts.

No:
- app zoom,
- route zoom,
- wrapper scale,
- inverse-width scaling,
- transform scale.

Yes:
- real CSS density tokens,
- smaller card padding,
- smaller gaps,
- lower min-heights,
- smaller icons,
- smaller chips,
- smaller panel typography,
- same left/right anchoring as Stage149.

## Source truth split

- Stage149 = width/app shell source truth.
- Stage150 = typography source truth.
- Stage151/152 = earlier compact card attempts.
- Stage156 = real density tokens, no zoom.

## Tuning

Change only:

```text
src/styles/closeflow-real-density-tokens-no-zoom-stage156.css
```

Important variables:

```css
--cf156-route-pad-y
--cf156-route-pad-x
--cf156-section-gap
--cf156-grid-gap
--cf156-card-pad-y
--cf156-card-pad-x
--cf156-kpi-height
--cf156-panel-height
--cf156-row-height
--cf156-font-body
--cf156-font-title
--cf156-font-kpi
```

## Guard rule

Every visual correction must have its own guard.
