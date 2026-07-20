const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage03-leads.cjs');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
const leads = fs.readFileSync(path.join(root, 'src/pages/Leads.tsx'), 'utf8');
const stage03Css = fs.readFileSync(path.join(root, 'src/styles/visual-stage03-leads.css'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

test('reconciled Stage03 guard passes against current Leads source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current Leads source truth/);
});

test('inactive Stage03 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage03-leads\.css/);
  assert.match(guard, /inactive Stage03 Leads CSS import/);
});

test('Leads uses current form, page-header, record-list and canvas sources', () => {
  for (const required of [
    'visual-stage20-lead-form-vnext.css',
    'closeflow-page-header-v2.css',
    'closeflow-record-list-source-truth.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-canvas-source-truth-stage211e.css',
  ]) assert.match(leads, new RegExp(required.replace(/\./g, '\\.')));
});

test('Leads retains current rebuild and separation contracts', () => {
  assert.match(leads, /VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD/);
  assert.match(leads, /VISUAL_STAGE18_LEADS_HTML_HARD_1TO1/);
  assert.match(leads, /STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE/);
  assert.match(leads, /STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME/);
});

test('Stage03 remains reference-only while lead operating flows stay guarded', () => {
  assert.match(stage03Css, /VISUAL_STAGE_03_LEADS_UI_SYSTEM/);
  assert.match(stage03Css, /\.main-leads/);
  for (const required of [
    'handleCreateLead',
    'findEntityConflictsInSupabase',
    'handleArchiveLead',
    'handleRestoreLead',
    'buildContactCadenceGrid',
    'buildLostLeadRescue',
    'sanitizeNewLeadCreatePayloadA1',
  ]) assert.match(guard, new RegExp(required));
});
