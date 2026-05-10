const fs = require('fs');
const p = 'package.json';
let raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fin8-surfacecard-dedup-repair3'] = 'node scripts/check-closeflow-fin8-surfacecard-dedup-repair3.cjs';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FIN8_SURFACECARD_DEDUP_REPAIR3_PACKAGE_OK');
