const fs = require('fs');
const path = require('path');

const required = [
  '.agents/skills/closeflow-ui-designer/SKILL.md',
  '.agents/skills/closeflow-ui-designer/references/global-style-token-contract.md',
  '.agents/skills/closeflow-ui-designer/references/action-icon-style-map.seed.md',
  '.agents/skills/closeflow-ui-designer/references/entity-detail-action-map.seed.md',
  'docs/ui/CLOSEFLOW_UI_PREMAP_2026-05-08.md',
  'scripts/audit-closeflow-ui-map.cjs',
  'scripts/audit-closeflow-style-map.cjs',
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error('Missing CloseFlow UI skill pack files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const skill = fs.readFileSync(path.join(process.cwd(), '.agents/skills/closeflow-ui-designer/SKILL.md'), 'utf8');
for (const needle of ['name: closeflow-ui-designer', 'Same function means same logical placement', 'Same visual meaning means one source of truth']) {
  if (!skill.includes(needle)) {
    console.error(`SKILL.md missing required phrase: ${needle}`);
    process.exit(1);
  }
}

console.log('OK: CloseFlow UI skill pack files are present.');
