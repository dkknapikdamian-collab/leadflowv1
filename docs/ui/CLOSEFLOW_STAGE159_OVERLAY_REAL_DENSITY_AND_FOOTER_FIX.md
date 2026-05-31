# CloseFlow Stage159 — Overlay Real Density and Footer Fix

## Problem

After Stage158:
- event dialog can drift horizontally,
- lead/task dialogs can clip text,
- event action footer can cover content,
- lead/task dialogs still require unnecessary scrolling.

## Decision

Stage159 intentionally overrides Stage158 dialog zoom.

Do not use `zoom` on dialog content. Use real modal density:
- smaller dialog width,
- max-height based on viewport,
- compact padding,
- compact inputs,
- compact labels,
- scroll-safe body,
- footer/action rows ordered to the bottom.

## Source truth

- Stage157 = app/browser-80 visual scale.
- Stage158 = broad portal overlay scale attempt.
- Stage159 = dialog/modal real density and footer source truth.

## Guard rule

Every visual correction must have its own guard.
