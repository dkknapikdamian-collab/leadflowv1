# STAGE231D0B - Client List Card Visual Freeze - run report

Data: 2026-06-12 11:15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scan report

Repo files read before package preparation:
- AGENTS.md
- package.json
- src/pages/Clients.tsx
- src/pages/ClientDetail.tsx
- src/lib/finance/case-finance-source.ts
- src/styles/closeflow-record-list-source-truth.css
- _project/00_PROJECT_STATUS.md
- _project/03_CURRENT_STAGE.md
- _project/06_GUARDS_AND_TESTS.md

Obsidian/project-memory files read:
- direct local Obsidian access was not available in ChatGPT runtime.
- used uploaded bootstrap/router rules and prepared Obsidian update manifest for 10_PROJEKTY/CloseFlow_Lead_App.

## Change

ClientListCard on /clients now uses two-line layout:
- Row 1: index, name, phone, email, active commission, actions.
- Row 2: company, cases count, lifetime earned, nearest action, allowed helper status badges.

Removed from client card:
- Leady:
- Aktywna sprawa

Added/kept:
- Sprawy:
- Aktywna prowizja:
- Zarobione Ĺ‚Ä…cznie:
- dedicated phone marker/class
- dedicated email marker/class
- client-list-card-row-primary
- client-list-card-row-secondary

## Finance source

- Aktywna prowizja uses getClientCasesFinanceSummary(..., mode: 'all_active_cases').commissionAmount.
- Zarobione Ĺ‚Ä…cznie uses getClientCasesFinanceSummary(..., mode: 'all_cases').commissionPaidAmount.

## Guard

Guard:
- scripts/check-stage231d0b-client-list-card-freeze.cjs

Package script:
- 
pm run check:stage231d0b-client-list-card-freeze

Guard checks:
- no Leady: in Clients card source,
- no Aktywna sprawa in Clients card source,
- required labels and markers,
- two-row structure,
- record-list source CSS,
- UI Dictionary entry,
- mojibake in touched files.

## Tests to run

- 
pm run check:stage231d0b-client-list-card-freeze
- 
pm run build
- git diff --check

## Manual test

1. Open /clients desktop.
2. Confirm card uses two visual rows.
3. Confirm phone is high, strong and next to client name.
4. Confirm Leady: is not visible.
5. Confirm Aktywna sprawa is not visible.
6. Confirm Sprawy: X, Aktywna prowizja, Zarobione Ĺ‚Ä…cznie, and nearest action are visible.
7. Check mobile width does not break actions/kosz.

## Risk audit

- Financial labels are now more precise, but correctness depends on case/payment finance source completeness.
- If cases have commission fields empty, active commission can correctly show 0 PLN; that is a data-completeness issue, not a UI bug.
- If old payment records use unknown payment type/status, lifetime earned may require a finance data normalization stage.
- This stage intentionally does not remove lead counting from all app logic; it only blocks rendering on ClientListCard.
- Right rail/client attention copy may still mention lead context without Leady: label; that is outside this card freeze.

## Status

LOCAL_APPLIED_PENDING_MANUAL_TEST_AND_PUSH