const fs = require('node:fs');
const path = require('node:path');

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:fin15'] = 'node scripts/check-fin15-lead-finance-ghosts.cjs';
pkg.scripts['test:fin15'] = 'node --test tests/fin15-lead-finance-ghosts.test.cjs';
pkg.scripts['verify:fin15'] = 'npm run check:fin15 && npm run test:fin15 && node --test tests/lead-service-mode-v1.test.cjs';
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log('[FIN-15 MASS REPAIR12] package.json: check:fin15, test:fin15, verify:fin15 ustawione idempotentnie');
