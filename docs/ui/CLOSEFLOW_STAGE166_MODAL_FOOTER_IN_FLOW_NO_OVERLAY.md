# CloseFlow Stage166 — Modal Footer In Flow No Overlay

## Routing
- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Problem
After Stage165 the motif/size is better, but the submit/footer row floats over the form content.

## Decision
Keep Stage165 motif and size. Only change footer mechanics to normal document flow:

```css
position: static !important;
bottom: auto !important;
box-shadow: none !important;
```

## Guard rule
Every visual correction has its own guard.
