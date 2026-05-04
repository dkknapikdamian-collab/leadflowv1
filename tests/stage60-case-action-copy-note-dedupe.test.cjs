// STAGE61_STAGE60_GUARD_COMPAT_HOTFIX
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const marker = 'STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function expectIncludes(value, needle, label) { assert.ok(value.includes(needle), 'missing ' + label + ': ' + needle); }
function expectNotIncludes(value, needle, label) { assert.ok(!value.includes(needle), 'forbidden ' + label + ': ' + needle); }

test('STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE: duplicated case helper copy and main note action are removed', () => {
  const page = read('src/pages/CaseDetail.tsx');
  expectIncludes(page, marker, 'Stage60 marker');
  expectNotIncludes(page, 'Zadania, wydarzenia, braki i notatki powiązane ze sprawą.', 'duplicated related-items helper copy');
  expectNotIncludes(page, 'Zadania, wydarzenia, braki i notatki powiazane ze sprawa.', 'duplicated related-items helper copy without diacritics');
  expectNotIncludes(page, 'data-case-create-action="note"', 'duplicate main note action button');
  expectIncludes(page, 'openCaseNoteDialog', 'note helper retained');
  expectIncludes(page, 'setIsAddNoteOpen(true)', 'note modal opener retained');
  expectIncludes(page, 'data-case-note-follow-up-prompt="true"', 'Stage59 follow-up prompt retained');
});

test('STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE: guards and verify chain know the Stage60 cleanup', () => {
  const stage57 = read('scripts/check-stage57-case-create-action-hub.cjs');
  const pkg = read('package.json');
  expectIncludes(stage57, 'note action button retained in create panel', 'Stage57 note dedupe guard');
  expectIncludes(pkg, 'check:stage60-case-action-copy-note-dedupe', 'Stage60 check script');
  expectIncludes(pkg, 'test:stage60-case-action-copy-note-dedupe', 'Stage60 test script');
  expectIncludes(pkg, 'check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run check:stage62-case-important-actions-header-note-button-remove && npm.cmd run verify:client-detail-operational-ui', 'Stage60 verify chain');
});

