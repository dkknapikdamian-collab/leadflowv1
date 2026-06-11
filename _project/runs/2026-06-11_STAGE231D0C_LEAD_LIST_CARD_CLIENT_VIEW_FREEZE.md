# STAGE231D0C - LeadListCard client-view freeze

Data: 2026-06-11 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scan
- AGENTS.md requires scan-first, _project and Obsidian update.
- Clients view accepted after STAGE231D0B-R10/R11.
- Leads row currently has its own row shell: lead-main-cell, lead-value-cell, lead-action-cell, lead-actions.
- This stage reuses the accepted client card shell without changing lead data semantics.

## Scope
Touched:
- src/pages/Leads.tsx
- src/styles/closeflow-record-list-source-truth.css
- scripts/check-stage231d0c-lead-list-card-client-align.cjs
- tests/stage231d0c-lead-list-card-client-align.test.cjs
- _project memory files

Not touched:
- SQL
- Supabase
- trial banner
- filters
- top layout
- client runtime
- lead create/update/delete logic

## Tests
To run:
- npm run check:stage231d0b-client-list-card-freeze
- node scripts/check-stage231d0c-lead-list-card-client-align.cjs
- node --test tests/stage231d0c-lead-list-card-client-align.test.cjs
- git diff --check
- npm run build

## Manual QA
- /clients after Ctrl+F5: accepted frozen view still unchanged.
- /leads after Ctrl+F5: cards use same compact rhythm, fixed axes and right action column.
- Long lead names/contact/action text ellipsis instead of overlap.
