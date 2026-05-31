# CloseFlow Stage167 — Remove Quick Planning Placeholder

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

Remove the disabled/placeholder card:

- `Szybkie planowanie`
- `Dodanie zadania albo wydarzenia bezpośrednio z formularza...`
- `Ten etap nie udaje tej funkcji.`

This copy is product-hostile. It explains an internal limitation inside a user form and should not appear in production UI.

## Guard

`node scripts/check-stage167-remove-quick-planning-placeholder.cjs`

The guard scans `src` and fails if the placeholder text returns.
