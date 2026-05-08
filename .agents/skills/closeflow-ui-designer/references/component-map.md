# Component Map Seed

Known existing components / candidates:

- `src/components/StatShortcutCard.tsx` — metric tile source-of-truth candidate.
- `src/components/ui/button.tsx` — base button variants.
- `src/components/confirm-dialog.tsx` — destructive confirm semantics.
- `src/components/ContextActionDialogs.tsx` — context action host; audit before editing quick actions.

Missing likely product primitives:

- `EntityActionButton`
- `EntityActionIcon`
- `EntityActionCluster`

Do not create these blindly. First audit whether equivalent components already exist.
