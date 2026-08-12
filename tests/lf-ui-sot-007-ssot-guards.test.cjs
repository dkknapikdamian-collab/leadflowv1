const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const guard = path.join(root, 'scripts', 'check-closeflow-ui-ssot.cjs');

function run(mode, contents) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-ui-sot-007-'));
  const fixturePath = path.join(fixture, 'fixture.ts');
  fs.writeFileSync(fixturePath, contents, 'utf8');
  const result = spawnSync(process.execPath, [guard, mode, '--fixture', fixturePath], { cwd: root, encoding: 'utf8' });
  fs.rmSync(fixture, { recursive: true, force: true });
  return result;
}

test('icons guard rejects a local icon map fixture', () => {
  const result = run('icons', 'const LOCAL_ICON_MAP = { add: Plus };');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /LOCAL_ICON_MAP/);
});

test('colors guard rejects a local tone map fixture', () => {
  const result = run('colors', 'const LOCAL_TONE_MAP = { warning: "amber" };');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /LOCAL_TONE_MAP/);
});

test('typography guard rejects a local typography map fixture', () => {
  const result = run('typography', 'const LOCAL_TYPOGRAPHY_MAP = { body: "text-sm" };');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /LOCAL_TYPOGRAPHY_MAP/);
});

test('css owner guard rejects an unknown owner fixture', () => {
  const result = run('css-owners', 'UNKNOWN_CSS_OWNER');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /UNKNOWN_CSS_OWNER/);
});

test('component clone guard rejects a page-local button clone fixture', () => {
  const result = run('component-clones', 'function LocalButton() { return null; }');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /page-local canonical clone/);
});
