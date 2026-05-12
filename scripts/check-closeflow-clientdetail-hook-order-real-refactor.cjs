const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');

const forbidden = [
  'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING',
  'Mirrors skipped hooks: useMemo',
];
for (const marker of forbidden) {
  if (source.includes(marker)) {
    throw new Error('Forbidden ClientDetail hook padding marker still present: ' + marker);
  }
}

const emptyUseMemo = /useMemo\s*\(\s*\(\s*\)\s*=>\s*null\s*,\s*\[\s*\]\s*\)\s*;/;
if (emptyUseMemo.test(source)) {
  throw new Error('Forbidden empty useMemo(() => null, []) padding still present in ClientDetail.');
}

if (!source.includes('export default function ClientDetail()')) {
  throw new Error('ClientDetail export marker missing.');
}

console.log('OK closeflow-clientdetail-hook-order-real-refactor: no empty hook padding remains in ClientDetail.');
