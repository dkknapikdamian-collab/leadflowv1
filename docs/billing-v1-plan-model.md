# Billing V1 plan model

## Final model

CloseFlow V1 uses one commercial model:

| Plan ID | Label | Price | Purpose |
| --- | --- | --- | --- |
| `trial_14d` | Trial 14 dni | 0 PLN | Default bootstrap state for every new workspace |
| `closeflow_pro` | CloseFlow Pro | 49 PLN / mies. | Single paid V1 plan exposed in Billing UI |

## Legacy mapping

Legacy plan identifiers are still accepted on read, but they are mapped to the single paid V1 offer in UI and access flows:

| Legacy plan ID | V1 display model |
| --- | --- |
| `solo_mini` | `closeflow_pro` |
| `solo_full` | `closeflow_pro` |
| `team_mini` | `closeflow_pro` |
| `team_full` | `closeflow_pro` |
| `pro` | `closeflow_pro` |
| `free` | `trial_14d` |

## Rules

- Billing UI shows only `trial_14d` and `closeflow_pro`.
- `paid_active` resolves to `closeflow_pro` for display and access decisions.
- This package does not add checkout or webhook logic.
