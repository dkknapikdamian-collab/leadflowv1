const fs = require('fs');

const path = 'package.json';
let raw = fs.readFileSync(path, 'utf8');
raw = raw.replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};

pkg.scripts['check:closeflow-fb5-toast-danger-source'] = 'node scripts/check-closeflow-fb5-toast-danger-source.cjs';
pkg.scripts['check:closeflow-fb5-heavy-ui-guards'] = 'node scripts/check-closeflow-fb5-heavy-ui-guards.cjs';

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FB5_REPAIR8_PACKAGE_OK');
