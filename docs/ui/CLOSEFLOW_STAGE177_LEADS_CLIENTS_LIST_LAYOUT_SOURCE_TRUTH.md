# CloseFlow Stage177 — Leads/Clients List Layout Source Truth

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

Lead list cards and client list cards must share one layout source truth:
- same left-stack width,
- same search width,
- same table-card width,
- same row skeleton,
- same right rail width,
- same right rail compactness.

## Why

Lead page visually diverged from Client page:
- lead row/card geometry felt different,
- search and lead information should end at the same boundary as in Client,
- right rail cards on Leads need a slightly tighter but still readable layout.

## Implementation

Stage177:
- adds final layout CSS after Stage175,
- adds explicit markers/classes in `Leads.tsx`,
- aligns lead `layout-list`, table card, row wrapper, row skeleton and right rail with the client source.

## Guard

`node scripts/check-stage177-leads-clients-list-layout-source-truth.cjs`
