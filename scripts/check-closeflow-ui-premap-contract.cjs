const fs = require('fs');
const path = require('path');

const premapPath = path.join(process.cwd(), 'docs/ui/CLOSEFLOW_UI_PREMAP_2026-05-08.md');
if (!fs.existsSync(premapPath)) {
  console.error('Missing docs/ui/CLOSEFLOW_UI_PREMAP_2026-05-08.md');
  process.exit(1);
}

const text = fs.readFileSync(premapPath, 'utf8');
const required = [
  'One function = one logical placement',
  'One visual meaning = one source of style truth',
  'src/components/StatShortcutCard.tsx',
  'src/styles/closeflow-metric-tiles.css',
  'src/components/ui/button.tsx',
  'src/components/confirm-dialog.tsx',
  'Trash2',
  'Dodaj notatkę',
];

for (const needle of required) {
  if (!text.includes(needle)) {
    console.error(`Premap missing required phrase: ${needle}`);
    process.exit(1);
  }
}

console.log('OK: CloseFlow UI premap contract is present.');
