const fs = require('node:fs');

const packagePath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, ''));

pkg.scripts = pkg.scripts || {};
pkg.scripts['check:a13-critical-regressions'] = 'node scripts/check-a13-critical-regressions.cjs';

if (!pkg.scripts['test:raw']) {
  pkg.scripts['test:raw'] = 'node --test "tests/**/*.test.cjs"';
}

pkg.scripts['test:compact'] = 'node scripts/run-tests-compact.cjs';
pkg.scripts['test:critical'] = 'node scripts/run-tests-compact.cjs --critical';

if (fs.existsSync('scripts/run-tests-compact.cjs')) {
  pkg.scripts.test = 'node scripts/run-tests-compact.cjs';
}

if (typeof pkg.scripts.lint === 'string' && !pkg.scripts.lint.includes('scripts/check-a13-critical-regressions.cjs')) {
  pkg.scripts.lint = `node scripts/check-a13-critical-regressions.cjs && ${pkg.scripts.lint}`;
}

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('OK: package.json normalized and A13 scripts checked.');
