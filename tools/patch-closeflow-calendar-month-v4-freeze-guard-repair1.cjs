const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const packagePath = path.join(repo, 'package.json');

if (!fs.existsSync(packagePath)) throw new Error('package.json not found');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow:calendar-month-v4-freeze'] = 'node scripts/check-closeflow-calendar-month-v4-freeze.cjs';

fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const doc = `# CloseFlow — Calendar Month V4 Visual Freeze Guard Repair1

## Status

Monthly calendar visual state is frozen after restore to V4 baseline.

## Frozen reference

User accepted the monthly calendar screenshot after commit \`53e1dca\`.

## Repair1

The first guard was too strict because it blocked every \`replaceChildren();\`.
The accepted V4 baseline can contain old harmless \`replaceChildren();\` paths, so Repair1 blocks only post-V4 visual layers and post-V4 runtime markers.

## Guard command

\`\`\`powershell
npm.cmd run check:closeflow:calendar-month-v4-freeze
\`\`\`

## Source of truth

- \`src/pages/Calendar.tsx\`
- \`src/styles/closeflow-calendar-month-plain-text-rows-v4.css\`

## Guard protects against

- re-adding V5/V6/Repair2/Repair3/Repair4/Repair5 calendar visual layers,
- post-V4 runtime visual markers,
- dark inner pill rows in the monthly calendar,
- removing V4 source-truth import/marker.

## Rule

Do not modify the monthly calendar visual skin without updating this guard and getting a new accepted screenshot.
`;

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_2026-05-12.md'), doc, 'utf8');

console.log('CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_PATCH_OK');
