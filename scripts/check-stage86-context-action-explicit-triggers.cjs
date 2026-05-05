const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');

const repo = process.cwd();
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function chars() { return String.fromCharCode.apply(String, arguments); }
function assertContains(rel, text) {
  assert.ok(read(rel).includes(text), rel + ' missing ' + text);
  console.log('PASS ' + rel + ': contains ' + text);
}
function assertNotContains(rel, text) {
  assert.equal(read(rel).includes(text), false, rel + ' still contains ' + text);
}
function assertNoMojibake(rel) {
  const body = read(rel);
  [chars(0x0139), chars(0x00c4), chars(0x0102), chars(0x00c5, 0x00bc), chars(0x00c3, 0x00b3)].forEach((fragment) => {
    assert.equal(body.includes(fragment), false, rel + ' contains forbidden encoding fragment');
  });
}

assertContains('src/components/ContextActionDialogs.tsx', 'openContextQuickAction');
assertContains('src/pages/LeadDetail.tsx', 'STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS');
assertContains('src/pages/LeadDetail.tsx', 'openLeadContextAction');
assertContains('src/pages/LeadDetail.tsx', "openLeadContextAction('task')");
assertContains('src/pages/LeadDetail.tsx', "openLeadContextAction('event')");
assertContains('src/pages/LeadDetail.tsx', "openLeadContextAction('note')");
assertNotContains('src/pages/LeadDetail.tsx', 'setIsQuickTaskOpen(true)');
assertNotContains('src/pages/LeadDetail.tsx', 'setIsQuickEventOpen(true)');
assertContains('src/pages/CaseDetail.tsx', 'STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS');
assertContains('src/pages/CaseDetail.tsx', 'openCaseContextAction');
assertContains('src/pages/CaseDetail.tsx', "openCaseContextAction('task')");
assertContains('src/pages/CaseDetail.tsx', "openCaseContextAction('event')");
assertContains('src/pages/CaseDetail.tsx', "openCaseContextAction('note')");
assertContains('src/pages/ClientDetail.tsx', 'STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS');
assertContains('src/pages/ClientDetail.tsx', 'openClientContextAction');
assertContains('docs/release/STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS_2026-05-05.md', 'Stage86');
['src/pages/LeadDetail.tsx', 'src/pages/CaseDetail.tsx', 'src/pages/ClientDetail.tsx', 'scripts/check-stage86-context-action-explicit-triggers.cjs', 'tests/stage86-context-action-explicit-triggers.test.cjs'].forEach(assertNoMojibake);
console.log('PASS STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS');
