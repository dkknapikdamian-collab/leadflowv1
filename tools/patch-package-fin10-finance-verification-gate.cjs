const fs = require('fs');

const path = 'package.json';
const raw = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};

pkg.scripts['check:closeflow-finance-contract'] = 'node scripts/check-closeflow-finance-contract.cjs';
pkg.scripts['check:closeflow-finance-ui-contract'] = 'node scripts/check-closeflow-finance-ui-contract.cjs';
pkg.scripts['check:closeflow-finance-payment-types'] = 'node scripts/check-closeflow-finance-payment-types.cjs';
pkg.scripts['check:closeflow-finance-duplicate-safety'] = 'node scripts/check-closeflow-finance-duplicate-safety.cjs';

pkg.scripts['verify:closeflow-finance'] = [
  'node scripts/check-closeflow-finance-contract.cjs',
  'node scripts/check-closeflow-finance-ui-contract.cjs',
  'node scripts/check-closeflow-finance-payment-types.cjs',
  'node scripts/check-closeflow-finance-duplicate-safety.cjs',
  'npm run check:closeflow-case-settlement-panel',
  'npm run check:closeflow-fin6-payments-list-types',
  'npm run check:closeflow-fin7-client-finance-summary',
  'npm run check:closeflow-fin8-finance-visual-integration',
  'npm run check:closeflow-fin9-finance-duplicate-safety',
  'npm run check:closeflow-api0-vercel-hobby-functions',
  'npm run check:closeflow-api-runtime-data-contract-server-safe',
  'npm run check:closeflow-fin5-import-boundaries-final',
  'npx tsc --noEmit --pretty false',
  'npm run build',
].join(' && ');

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('CLOSEFLOW_FIN10_FINANCE_VERIFICATION_GATE_PACKAGE_OK');
