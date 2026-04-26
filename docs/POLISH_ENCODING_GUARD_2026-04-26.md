# CloseFlow - Polish encoding guard

Every patch must include a mojibake scan.

Compact verification command:

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
npm.cmd run verify:closeflow:quiet

Use full verify only when a quiet check fails and details are needed.

The checker stores broken patterns through character codes, not literal markers.
This keeps the audit test clean while still detecting broken UI copy.
