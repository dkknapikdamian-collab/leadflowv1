const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage18-leads-hard-1to1.cjs');
const indexCssPath = path.join(root, 'src/index.css');
const leadsPath = path.join(root, 'src/pages/Leads.tsx');

const guard = fs.readFileSync(guardPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const leads = fs.readFileSync(leadsPath, 'utf8');

test('reconciled Stage18 guard passes against current source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current Leads source truth/);
});

test('inactive Stage18 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage18-leads-hard-1to1\.css/);
  assert.match(guard, /inactive Stage18 global CSS import/);
});

test('Leads uses current record-list and canvas source imports', () => {
  for (const required of [
    'closeflow-record-list-source-truth.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-canvas-source-truth-stage211e.css',
  ]) {
    assert.match(leads, new RegExp(required.replace(/\./g, '\\.')));
  }
});

test('Leads retains current rebuild marker and historical trace marker', () => {
  assert.match(leads, /VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD/);
  assert.match(leads, /VISUAL_STAGE18_LEADS_HTML_HARD_1TO1/);
});
