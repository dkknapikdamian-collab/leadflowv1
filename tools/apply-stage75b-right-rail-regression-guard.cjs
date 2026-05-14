const fs = require('fs');
const path = require('path');

const root = process.cwd();

function fail(message) {
  console.error('STAGE75B_WIRING_FAIL:', message);
  process.exit(1);
}

function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) fail('missing file: ' + relativePath);
  return fs.readFileSync(file, 'utf8');
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content, 'utf8');
}

const packagePath = 'package.json';
const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:right-rail-card-source-of-truth'] = 'node scripts/check-right-rail-card-source-of-truth-stage75.cjs';
pkg.scripts['test:right-rail-card-source-of-truth'] = 'node --test tests/right-rail-card-source-of-truth.test.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

const quietPath = 'scripts/closeflow-release-check-quiet.cjs';
let quiet = read(quietPath);
const testLine = "  'tests/right-rail-card-source-of-truth.test.cjs',";
let lines = quiet.split(/\r?\n/).filter((line) => !line.includes("'tests/right-rail-card-source-of-truth.test.cjs'"));
const startIndex = lines.findIndex((line) => line.includes('const requiredTests = ['));
if (startIndex < 0) fail('cannot find requiredTests array in quiet release gate');
lines.splice(startIndex + 1, 0, testLine);
quiet = lines.join('\n');
if (!quiet.endsWith('\n')) quiet += '\n';
write(quietPath, quiet);

for (const stale of [
  'tools/patch-stage75-right-rail-visual-guard.cjs',
  'tools/patch-stage75-right-rail-visual-guard-repair.cjs',
  'tools/patch-stage75-right-rail-visual-guard-final.cjs',
  'tools/repair-stage75-right-rail-visual-guard.cjs',
]) {
  const full = path.join(root, stale);
  if (fs.existsSync(full)) fs.rmSync(full, { force: true });
}

console.log('OK: Stage75B right rail regression guard wiring applied.');
