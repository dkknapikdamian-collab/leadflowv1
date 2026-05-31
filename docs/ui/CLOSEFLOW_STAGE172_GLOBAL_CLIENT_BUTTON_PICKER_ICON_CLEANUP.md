# CloseFlow Stage172 — Global Client Button + Picker Icon Cleanup

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_Lead_App`

## Decision

1. Remove the magnifying glass from the `TopicContactPicker` input because it collides visually with the text.
2. Add global `+ Klient` button next to `+ Lead`, `+ Zadanie`, `+ Wydarzenie`.
3. Add `ClientCreateDialog` using the same `lead-form-vnext` visual source truth.
4. Client dialog has an immediate option to create a case: `Dodaj sprawę od razu`.

## Source truth

- Picker: `src/components/topic-contact-picker.tsx`
- Global actions: `src/components/GlobalQuickActions.tsx`
- Client quick dialog: `src/components/ClientCreateDialog.tsx`
- Stage CSS: `src/styles/closeflow-global-client-create-dialog-stage172.css`

## Guard

`node scripts/check-stage172-global-client-button-picker-icon-cleanup.cjs`
