const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-a13-critical-regressions.cjs');
const templatesPath = path.join(root, 'src/pages/Templates.tsx');
const indexCssPath = path.join(root, 'src/index.css');

const guard = fs.readFileSync(guardPath, 'utf8');
const templates = fs.readFileSync(templatesPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');

test('A13 critical regression guard passes against current source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: A13 critical regression guard passed/);
});

test('guard anchors the current Templates record-list marker', () => {
  assert.match(guard, /data-cf-templates-page-source="record-list-source-truth"/);
  assert.match(templates, /data-cf-templates-page-source="record-list-source-truth"/);
});

test('guard rejects restoration of the inactive Stage36 marker', () => {
  assert.match(guard, /data-a16-template-light-ui=/);
  assert.doesNotMatch(templates, /data-a16-template-light-ui=/);
});

test('Templates remains a light page using current utility source truth', () => {
  for (const required of ['bg-white', 'border-slate-200', 'text-slate-900', 'text-slate-500']) {
    assert.match(templates, new RegExp(required));
  }
});

test('Stage36 reference stylesheet remains excluded from the global bundle', () => {
  assert.doesNotMatch(indexCss, /stage36-unified-light-pages\.css/);
});
