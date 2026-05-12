const fs = require('fs');
const path = require('path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const required = [
  'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_REPAIR_2026_05_12',
  'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING_2026_05_12',
  'Keeps hook order stable for loading/not-found ClientDetail renders',
  'export default function ClientDetail',
];

for (const marker of required) {
  if (!source.includes(marker)) throw new Error('ClientDetail hook order repair missing marker: ' + marker);
}

if (pkg.scripts?.['check:closeflow-clientdetail-hook-order-310-repair'] !== 'node scripts/check-closeflow-clientdetail-hook-order-310-repair.cjs') {
  throw new Error('package.json missing check:closeflow-clientdetail-hook-order-310-repair');
}

const paddingBlocks = source.match(/CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING_2026_05_12/g) || [];
if (paddingBlocks.length < 1) {
  throw new Error('ClientDetail hook order repair did not add any padding block.');
}

console.log('OK closeflow-clientdetail-hook-order-310-repair: ClientDetail loading/not-found hook order is stabilized.');
