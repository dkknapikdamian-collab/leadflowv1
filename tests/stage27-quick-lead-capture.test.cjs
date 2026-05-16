const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { parseQuickLeadNote } = require('../src/lib/quick-lead-parser.cjs');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function assertIncludes(content, needle, label) {
  assert.ok(content.includes(needle), `${label} missing: ${needle}`);
}

test('Quick Lead Capture parser detects phone, Facebook source and tomorrow after 10', () => {
  const now = new Date('2026-04-30T08:00:00');
  const draft = parseQuickLeadNote('Pani Anna z Tarnowa chce wycen\u0119 mieszkania, 608 123 456, zadzwoni\u0107 jutro po 10, przysz\u0142a z Facebooka.', now);

  assert.equal(draft.contactName, 'Anna');
  assert.equal(draft.phone, '608123456');
  assert.equal(draft.source, 'facebook');
  assert.equal(draft.priority, 'medium');
  assert.equal(draft.dueAt, '2026-05-01T10:00');
  assert.match(draft.nextAction, /zadzwoni\u0107/i);
});

test('Quick Lead Capture creates pending draft before final lead save', () => {
  const component = read('src/components/quick-lead/QuickLeadCaptureModal.tsx');

  assertIncludes(component, 'QUICK_LEAD_CAPTURE_MODAL_STAGE27', 'QuickLeadCaptureModal');
  assertIncludes(component, 'saveAiLeadDraftAsync', 'QuickLeadCaptureModal');
  assertIncludes(component, 'markAiLeadDraftConvertedAsync', 'QuickLeadCaptureModal');
  assertIncludes(component, 'archiveAiLeadDraftAsync', 'QuickLeadCaptureModal');
});

test('Quick Lead Capture confirm creates lead and clears rawText', () => {
  const component = read('src/components/quick-lead/QuickLeadCaptureModal.tsx');

  assertIncludes(component, 'insertLeadToSupabase', 'QuickLeadCaptureModal');
  assertIncludes(component, 'insertTaskToSupabase', 'QuickLeadCaptureModal');
  assertIncludes(component, "rawText: ''", 'QuickLeadCaptureModal');
  assertIncludes(component, 'setRawText(\'\')', 'QuickLeadCaptureModal');
  assertIncludes(component, 'Zatwierd\u017A i zapisz', 'QuickLeadCaptureModal');
});

test('Quick Lead Capture cancel does not create final lead and clears rawText', () => {
  const component = read('src/components/quick-lead/QuickLeadCaptureModal.tsx');
  const cancelBlock = component.slice(component.indexOf('const handleCancel'), component.indexOf('const updateDraft'));

  assertIncludes(cancelBlock, 'archiveAiLeadDraftAsync', 'handleCancel');
  assertIncludes(cancelBlock, "setRawText('')", 'handleCancel');
  assert.ok(!cancelBlock.includes('insertLeadToSupabase'), 'cancel block must not create a lead');
});

test('Quick Lead Capture entry points exist in Leads and global quick actions', () => {
  const leads = read('src/pages/Leads.tsx');
  const globalActions = read('src/components/GlobalQuickActions.tsx');

  assertIncludes(leads, 'QuickLeadCaptureModal', 'Leads.tsx');
  assertIncludes(leads, 'Dodaj szybkiego leada', 'Leads.tsx');
  assertIncludes(leads, "consumeGlobalQuickAction()", 'Leads.tsx');
  assertIncludes(leads, "'quick-lead'", 'Leads.tsx');
  assertIncludes(globalActions, "'quick-lead'", 'GlobalQuickActions.tsx');
  assertIncludes(globalActions, 'Szybki lead', 'GlobalQuickActions.tsx');
});

test('Quick Lead Capture documentation exists', () => {
  const doc = read('docs/STAGE27_QUICK_LEAD_CAPTURE.md');
  assertIncludes(doc, 'Quick Lead Capture', 'STAGE27 doc');
  assertIncludes(doc, 'Finalny lead powstaje dopiero po zatwierdzeniu u\u017Cytkownika', 'STAGE27 doc');
});
