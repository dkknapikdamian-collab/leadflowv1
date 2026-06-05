# STAGE225R5 - mojibake hotfix after Contact Cadence Grid

## Routing
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- stage: STAGE225R5_MOJIBAKE_HOTFIX

## FAKTY
- STAGE225 R4 applied and was committed as 9da266e7.
- Guard failed before commit: Leads.tsx missing 14+ dni ciszy.
- verify:closeflow:quiet failed on Stage98 mojibake hard gate.
- The failure is caused by mojibake in active source files after PowerShell patching.

## ZAKRES HOTFIXU
- Restore src/pages/Leads.tsx and src/pages/Clients.tsx from HEAD^ raw git bytes.
- Reapply Contact Cadence Grid using a Node UTF-8 patcher, not Windows PowerShell string writing.
- Rewrite contact-cadence-grid.ts without mojibake-prone strings.
- Update Stage225 guard to check mojibake tokens.

## TESTY DO URUCHOMIENIA
- node scripts/check-stage225-contact-cadence-grid.cjs
- node --test tests/stage225-contact-cadence-grid.test.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- git status --short

## AUDYT RYZYK PO ETAPIE
- Risk: UI labels are ASCII-only in the new Stage225 block to avoid another mojibake injection. Later we can safely polish labels using direct repo editing and verify hard gate.
- Risk: R5 uses HEAD^ as the clean source for Leads.tsx and Clients.tsx. It is intended to be run immediately after bad STAGE225 commit 9da266e7.
- Risk: _LOCAL_CHECKS backup remains untracked and must not be added to git.

## CZEGO NIE RUSZANO
- No Supabase migration.
- No Today big panel.
- No Lost Lead Rescue UI.
- No push from AI.
