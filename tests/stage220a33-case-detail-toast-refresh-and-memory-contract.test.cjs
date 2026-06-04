const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const appToaster = read('src/components/ui/sonner.tsx');
const toastCss = read('src/styles/closeflow-toast-source-truth-stage220a33.css');
const caseDetail = read('src/pages/CaseDetail.tsx');
const runReport = read('_project/runs/2026-06-04_stage220a33_case_detail_toast_refresh_memory_closeout.md');
const obsidianManifest = read('_project/obsidian_updates/2026-06-04 - CloseFlow - Stage220A33 case detail toast refresh memory closeout.md');

test('STAGE220A33 wires global CloseFlow toast visual source truth through the shared Toaster', () => {
  assert.match(appToaster, /closeflow-toast-source-truth-stage220a33\.css/, 'shared Toaster must import STAGE220A33 CSS');
  assert.match(appToaster, /STAGE220A33_CLOSEFLOW_TOAST_SOURCE_TRUTH/, 'shared Toaster must keep an explicit stage marker');
  assert.match(appToaster, /cn-toast closeflow-toast-source-truth-stage220a33/, 'toastOptions must attach the CloseFlow class to each toast');
  assert.match(toastCss, /STAGE220A33_CLOSEFLOW_TOAST_SOURCE_TRUTH/, 'CSS must declare the source-truth marker');
  assert.match(toastCss, /\[data-sonner-toast\]/, 'CSS must target Sonner runtime toast nodes, not a dead selector');
  assert.doesNotMatch(toastCss, /alert\(|window\.confirm|confirm\(/, 'toast CSS must not introduce native browser prompts');
});

test('STAGE220A33 keeps CaseDetail free from focus or visibility reload listeners', () => {
  assert.doesNotMatch(caseDetail, /visibilitychange/, 'CaseDetail must not reload after browser tab visibility changes');
  assert.doesNotMatch(caseDetail, /addEventListener\(['\"]focus['\"]/, 'CaseDetail must not install window focus refetch listener');
  assert.doesNotMatch(caseDetail, /window\.onfocus/, 'CaseDetail must not use window.onfocus reload path');
  assert.match(caseDetail, /closeflow:context-action-saved/, 'CaseDetail may refresh after explicit operator context action save');
  assert.match(caseDetail, /closeflow:context-note-saved/, 'CaseDetail may refresh after explicit note save');
});

test('STAGE220A33 updates project memory and does not leave the stage only in chat', () => {
  for (const [name, content] of [
    ['run report', runReport],
    ['obsidian manifest', obsidianManifest],
  ]) {
    assert.match(content, /STAGE220A33/, `${name} must mention STAGE220A33`);
    assert.match(content, /FAKTY|DECYZJE|TESTY|NASTĘPNY KROK|NASTEPNY KROK/, `${name} must keep memory sections`);
  }
});
