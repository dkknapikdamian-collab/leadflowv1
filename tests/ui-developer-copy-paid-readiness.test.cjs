const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      result.push(...walk(full));
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      result.push(full);
    }
  }
  return result;
}

test('UI developer copy paid-readiness guard v4 is wired and precise', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const guard = read('scripts/check-ui-developer-copy-paid-readiness.cjs');
  const doc = read('docs/architecture/UI_DEVELOPER_COPY_GUARD_STAGE03A1.md');

  assert.equal(pkg.scripts['check:ui-developer-copy-paid-readiness'], 'node scripts/check-ui-developer-copy-paid-readiness.cjs');
  assert.equal(pkg.scripts['test:ui-developer-copy-paid-readiness'], 'node --test tests/ui-developer-copy-paid-readiness.test.cjs');
  assert.match(quiet, /tests\/ui-developer-copy-paid-readiness\.test\.cjs/);

  assert.match(guard, /paid-readiness guard v4/);
  assert.match(guard, /extractQuotedText/);
  assert.match(guard, /extractJsxText/);
  assert.match(guard, /isTechnicalOnlyLine/);
  assert.match(guard, /timeline-faster-than-heavy-grid/);
  assert.doesNotMatch(guard, /pattern:\s*\/fallback\//);
  assert.doesNotMatch(guard, /pattern:\s*\/guard\//);

  assert.match(doc, /developer copy/);
  assert.match(doc, /paid UI/);
  assert.match(doc, /Stage03A1/);
});

test('Visible heavy-grid rationale sentence is removed from UI source files', () => {
  const files = [
    ...walk(path.join(root, 'src', 'pages')),
    ...walk(path.join(root, 'src', 'components')),
    path.join(root, 'src', 'lib', 'options.ts'),
  ].filter((file) => fs.existsSync(file));

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(content, /Układ osi czasu jest szybszy niż ciężka siatka/i, path.relative(root, file));
    assert.doesNotMatch(content, /Uklad osi czasu jest szybszy niz ciezka siatka/i, path.relative(root, file));
  }
});
