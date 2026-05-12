# CLOSEFLOW_CLIENTDETAIL_NOTES_HOOK_SLOT_REPAIR5_2026-05-12

## Goal

Fix ClientDetail production crash: Cannot read properties of null (reading 'length') in the notes panel.

## Finding

The deployed bundle pointed at the notes area. The loading branch previously used a dummy hook slot returning null:

```tsx
useMemo(() => null, []);
```

The loaded branch then used the same hook slot for `clientNotesStage14A`, which is later read with `.length`. This can leave a null value in the slot and crash the route.

## Change

- Restore ClientDetail from origin/dev-rollout-freeze before patching to remove broken failed patch leftovers.
- Replace dummy null hook with a safe empty-array hook slot.
- Guard client note render calls against non-array values.
- Keep the previous loading null-safe check for finance summary.

## Checks

- npm run check:closeflow-clientdetail-notes-hook-slot-repair5
- npm run check:closeflow-clientdetail-loading-null-safe
- npm run build
