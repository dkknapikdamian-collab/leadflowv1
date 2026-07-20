const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const reconcilerPath = path.join(root, 'scripts/guards/reconcile-historical-visual-guard-chain.cjs');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');

const wrapperCases = [
  ['stage16', 'scripts/check-visual-stage16-today-html-reset.cjs'],
  ['v14', 'scripts/check-visual-html-theme-v14.cjs'],
  ['stage08', 'scripts/check-visual-stage08-case-detail.cjs'],
  ['stage07', 'scripts/check-visual-stage07-cases.cjs'],
  ['stage06', 'scripts/check-visual-stage06-client-detail.cjs'],
  ['stage04', 'scripts/check-visual-stage04-lead-detail.cjs'],
  ['stage03', 'scripts/check-visual-stage03-leads.cjs'],
  ['stage02', 'scripts/check-visual-stage02-today.cjs'],
  ['stage01', 'scripts/check-visual-stage01-shell.cjs'],
];

for (const [key, relativePath] of wrapperCases) {
  test(`${key} reconciled wrapper passes against current source truth`, () => {
    const result = spawnSync(process.execPath, [path.join(root, relativePath)], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });

    assert.equal(result.status, 0, `${relativePath}\n${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, new RegExp(`reconciled historical visual guard ${key}`));
  });
}

test('all wrappers use the shared reconciler and one explicit key', () => {
  for (const [key, relativePath] of wrapperCases) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert.match(source, /reconcile-historical-visual-guard-chain\.cjs/);
    assert.match(source, new RegExp(`run\\('${key}'\\)`));
  }
});

test('inactive historical visual styles remain excluded from the global bundle', () => {
  for (const stylesheet of [
    'visual-stage16-today-html-reset.css',
    'visual-html-theme-v14.css',
    'visual-stage08-case-detail.css',
    'visual-stage07-cases.css',
    'visual-stage06-client-detail.css',
    'visual-stage04-lead-detail.css',
    'visual-stage03-leads.css',
    'visual-stage02-today.css',
    'visual-stage01-shell.css',
  ]) {
    assert.doesNotMatch(indexCss, new RegExp(stylesheet.replace(/\./g, '\\.')));
  }
});

test('shared reconciler exposes exactly the expected guard keys', () => {
  const { checks } = require(reconcilerPath);
  assert.deepEqual(Object.keys(checks).sort(), wrapperCases.map(([key]) => key).sort());
});
