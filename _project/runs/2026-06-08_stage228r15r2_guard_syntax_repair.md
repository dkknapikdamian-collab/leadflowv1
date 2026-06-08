# Stage228R15R2 - Guard syntax repair

- date: 2026-06-08 21:55 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Problem

Stage228R15 runtime patch was applied, but the guard crashed before validation:

```text
SyntaxError: Invalid or unexpected token
'source: \\'ContextActionDialogsHost\\'',
```

## Fix

Rewrote scripts/check-stage228r15-missing-item-delete-refresh.cjs with safe JS quoting.

## Scope

- Runtime app logic: not changed by R15R2.
- Guard only: repaired.
- SQL: none.

## Required checks

- R11 guard
- R12 guard
- R13 guard
- R14 guard
- R15 guard
- npm run build
- git diff --check
