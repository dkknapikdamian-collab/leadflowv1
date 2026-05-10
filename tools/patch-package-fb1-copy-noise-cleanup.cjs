const fs = require('fs');

const path = 'package.json';
let raw = fs.readFileSync(path, 'utf8');
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fb1-copy-noise-cleanup'] = 'node scripts/check-closeflow-fb1-copy-noise-cleanup.cjs';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_PACKAGE_OK');
