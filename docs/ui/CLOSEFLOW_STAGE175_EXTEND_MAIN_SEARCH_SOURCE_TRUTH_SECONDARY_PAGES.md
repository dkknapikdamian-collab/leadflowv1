# CloseFlow Stage175 — Extend Main Search Source Truth to Secondary Pages

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

Apply the same main-search visual source truth from Stage173/174 to:
- `/tasks`
- `/templates`
- `/response-templates`
- `/activity`
- `/ai-drafts`
- `/notifications`
- `/support`

## Source truth

- Marker: `data-cf-main-search-source="stage173"`
- Stage marker: `data-cf-main-search-stage175="true"`
- Class: `.cf-main-search`
- CSS: `src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css`

## Guard

`node scripts/check-stage175-extend-main-search-source-truth-secondary-pages.cjs`
