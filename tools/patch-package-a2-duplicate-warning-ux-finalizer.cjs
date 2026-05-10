const fs = require('fs');
const path = 'package.json';
const raw = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:a2-duplicate-warning-ux-finalizer'] = 'node scripts/check-closeflow-a2-duplicate-warning-ux-finalizer.cjs';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER_PACKAGE_OK');
