const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage04-lead-detail.cjs');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const stage04Css = fs.readFileSync(path.join(root, 'src/styles/visual-stage04-lead-detail.css'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

test('reconciled Stage04 guard passes against current LeadDetail source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current LeadDetail source truth/);
});

test('inactive Stage04 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage04-lead-detail\.css/);
  assert.match(guard, /inactive Stage04 LeadDetail CSS import/);
});

test('LeadDetail uses current Stage14, canvas and shared action sources', () => {
  for (const required of [
    'visual-stage14-lead-detail-vnext.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-shared-quick-actions-bar-stage227e3.css',
    'closeflow-lead-detail-sales-signal-stage227e4.css',
  ]) assert.match(leadDetail, new RegExp(required.replace(/\./g, '\\.')));
});

test('static AI follow-up rail is removed while next-action engine remains', () => {
  assert.match(leadDetail, /STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD/);
  assert.match(leadDetail, /STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_RAIL/);
  assert.doesNotMatch(leadDetail, /LeadAiFollowupDraft/);
  assert.match(leadDetail, /LeadAiNextAction/);
});

test('Stage04 remains reference-only while lead flows stay guarded', () => {
  assert.match(stage04Css, /VISUAL_STAGE_04_LEAD_DETAIL_UI_SYSTEM/);
  assert.match(stage04Css, /\.main-lead-detail/);
  for (const required of ['startLeadServiceInSupabase', 'handleAddNote', 'handleUpdateLead', 'handleDeleteLead', 'getLeadFinance', 'LeadAiNextAction']) {
    assert.match(guard, new RegExp(required));
  }
});
