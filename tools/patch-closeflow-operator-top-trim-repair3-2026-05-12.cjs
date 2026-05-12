const fs = require('fs');
const path = require('path');

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-operator-top-trim-repair3'] = 'node scripts/check-closeflow-operator-top-trim-repair3.cjs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
