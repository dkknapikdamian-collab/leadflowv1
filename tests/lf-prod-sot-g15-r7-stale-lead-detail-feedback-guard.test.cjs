const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-lead-detail-feedback-p1-2026-05-13.cjs');
const leadDetailPath = path.join(root, 'src/pages/LeadDetail.tsx');
const followupDraftPath = path.join(root, 'src/components/LeadAiFollowupDraft.tsx');

const guard = fs.readFileSync(guardPath, 'utf8');
const leadDetail = fs.readFileSync(leadDetailPath, 'utf8');
const followupDraft = fs.readFileSync(followupDraftPath, 'utf8');

test('focused LeadDetail feedback guard passes against current source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK check:lead-detail-feedback-p1/);
});

test('guard no longer requires the removed static follow-up card', () => {
  assert.doesNotMatch(guard, /!leadDetail\.includes\(['"]<LeadAiFollowupDraft/);
  assert.match(guard, /leadDetail\.includes\(['"]LeadAiFollowupDraft['"]\)/);
});

test('guard anchors current Stage78 LeadDetail UI truth', () => {
  assert.match(guard, /STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD/);
  assert.match(leadDetail, /STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD/);
  assert.doesNotMatch(leadDetail, /LeadAiFollowupDraft/);
});

test('draft-only component remains available outside LeadDetail', () => {
  assert.match(followupDraft, /createLeadFollowupDraft/);
  assert.match(followupDraft, /AI niczego nie wysyła automatycznie\./);
  assert.match(followupDraft, /Szkic do potwierdzenia/);
  assert.match(followupDraft, /Kopiuj treść/);
});

test('repair changes guard semantics without changing product runtime files', () => {
  assert.match(guard, /src\/pages\/LeadDetail\.tsx/);
  assert.match(guard, /src\/components\/LeadAiFollowupDraft\.tsx/);
  assert.match(guard, /src\/lib\/activity-timeline\.ts/);
});
