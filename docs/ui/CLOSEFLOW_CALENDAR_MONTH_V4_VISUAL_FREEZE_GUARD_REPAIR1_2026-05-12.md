# CloseFlow — Calendar Month V4 Visual Freeze Guard Repair1

## Status

Monthly calendar visual state is frozen after restore to V4 baseline.

## Frozen reference

User accepted the monthly calendar screenshot after commit `53e1dca`.

## Repair1

The first guard was too strict because it blocked every `replaceChildren();`.
The accepted V4 baseline can contain old harmless `replaceChildren();` paths, so Repair1 blocks only post-V4 visual layers and post-V4 runtime markers.

## Guard command

```powershell
npm.cmd run check:closeflow:calendar-month-v4-freeze
```

## Source of truth

- `src/pages/Calendar.tsx`
- `src/styles/closeflow-calendar-month-plain-text-rows-v4.css`

## Guard protects against

- re-adding V5/V6/Repair2/Repair3/Repair4/Repair5 calendar visual layers,
- post-V4 runtime visual markers,
- dark inner pill rows in the monthly calendar,
- removing V4 source-truth import/marker.

## Rule

Do not modify the monthly calendar visual skin without updating this guard and getting a new accepted screenshot.
