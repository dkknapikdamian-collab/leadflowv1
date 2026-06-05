# OBSIDIAN UPDATE MANIFEST - STAGE225R5 Mojibake Hotfix

## Target
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- wpis: _project/obsidian_updates/2026-06-05 - CloseFlow - Stage225R5 Mojibake Hotfix.md

## Files touched
- src/pages/Leads.tsx
- src/pages/Clients.tsx
- src/lib/owner-control/contact-cadence-grid.ts
- scripts/check-stage225-contact-cadence-grid.cjs
- tests/stage225-contact-cadence-grid.test.cjs
- _project/runs/STAGE225R5_MOJIBAKE_HOTFIX_2026_06_05.md
- _project/obsidian_updates/2026-06-05 - CloseFlow - Stage225R5 Mojibake Hotfix.md

## Tests required
- node scripts/check-stage225-contact-cadence-grid.cjs
- node --test tests/stage225-contact-cadence-grid.test.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- git status --short
