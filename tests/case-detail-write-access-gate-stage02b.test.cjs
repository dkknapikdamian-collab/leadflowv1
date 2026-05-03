const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const caseDetail = fs.readFileSync(path.join(root, 'src/pages/CaseDetail.tsx'), 'utf8');

test('CaseDetail has explicit write access gate for case mutations', () => {
  assert.match(caseDetail, /import\s+\{\s*useWorkspace\s*\}\s+from ['"]\.\.\/hooks\/useWorkspace['"]/);
  assert.match(caseDetail, /const\s*\{[^}]*hasAccess[^}]*access[^}]*\}\s*=\s*useWorkspace\s*\(\s*\)/s);
  assert.match(caseDetail, /caseDetailWriteAccessDenied\s*=\s*!hasAccess/);
  assert.match(caseDetail, /caseDetailAccessStatus\s*=\s*String\(access\?\.status/);
  assert.match(caseDetail, /guardCaseDetailWriteAccess/);
  assert.match(caseDetail, /trial_expired/);
  assert.match(caseDetail, /toast\.error\(reason \+ ' Nie mozna teraz '/);
});

test('CaseDetail write handlers call the local write access guard', () => {
  const required = [
    'handleCopyPortal',
    'handleAddItem',
    'handleItemStatusChange',
    'handleDeleteItem',
    'handleAddTask',
    'handleAddEvent',
    'handleAddNote',
  ];

  for (const functionName of required) {
    const pattern = new RegExp('const\\s+' + functionName + '\\s*=\\s*async[\\s\\S]*?guardCaseDetailWriteAccess');
    assert.match(caseDetail, pattern, functionName + ' is not guarded');
  }
});
