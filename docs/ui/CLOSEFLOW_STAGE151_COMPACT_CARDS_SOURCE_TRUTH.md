# CloseFlow Stage151 — Compact Cards Source Truth

## Rule

Every card-size correction must have its own guard.

## Source truth split

- Stage149 = width source truth.
- Stage150 = typography source truth.
- Stage151 = card/tile/panel compactness source truth.

## Scope

Stage151 slightly reduces cards, tiles and panels across the operator app:
- Today,
- Leads,
- Clients,
- Cases,
- Tasks,
- Calendar,
- Templates,
- Response Templates,
- Activity.

## Do not

Do not create:
- per-tab card-size fixes,
- new width hacks,
- new app-shell scale/overrun fixes,
- route-specific max-width owners.

## Tuning

Adjust only variables in:

```text
src/styles/closeflow-compact-cards-source-truth-stage151.css
```

Important variables:

```css
--cf151-card-pad-y
--cf151-card-pad-x
--cf151-card-gap
--cf151-kpi-min-height
--cf151-panel-min-height
--cf151-list-row-min-height
```
