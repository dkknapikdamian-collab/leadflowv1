# CloseFlow Stage168 — Remove Sales List Label From Cards

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

Remove the repeated visible card label:

```text
LISTA SPRZEDAŻOWA
```

from every card/kafelek.

## Scope

The patcher scans `src` and removes exact visible label variants only. It does not delete cards, leads, clients, actions or source data structures beyond the label text/property.

## Guard

`node scripts/check-stage168-remove-sales-list-label-from-cards.cjs`

The guard fails if the phrase or common ASCII/mojibake variants return in `src`.
