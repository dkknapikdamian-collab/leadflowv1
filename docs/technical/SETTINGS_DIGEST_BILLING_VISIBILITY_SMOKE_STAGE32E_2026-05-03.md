# SETTINGS / DIGEST / BILLING VISIBILITY SMOKE - Stage 3.2E

## Source of truth

```text
src/lib/plans.ts
docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md
docs/technical/PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md
docs/technical/PLAN_BASED_UI_VISIBILITY_STAGE32D_2026-05-03.md
```

## Smoke rules

| Surface | Allowed behavior |
|---|---|
| Settings Google Calendar | hidden outside `googleCalendar` |
| Settings Google Calendar status call | skipped outside `googleCalendar` |
| Settings digest | hidden unless global digest UI is enabled and plan has `digest` |
| Billing plan cards | may show all plans |
| Billing feature matrix | may show all plan differences |
| Global flow | no upsell clutter |

## Markers

```text
canUseGoogleCalendarByPlan
canUseDigestByPlan
digestUiVisibleByPlan
DISABLED_BY_PLAN
data-plan-visibility-stage32e="google-calendar"
data-plan-visibility-stage32e="billing-plan-comparison"
data-plan-visibility-stage32e="billing-feature-matrix"
```

## Guard v4 correction

The guard now requires exactly one declaration of each Settings plan gate:

```text
const canUseGoogleCalendarByPlan
const canUseDigestByPlan
const digestUiVisibleByPlan
```

## Next

```text
FAZA 3 - Etap 3.2F - backend entity limits smoke
```
