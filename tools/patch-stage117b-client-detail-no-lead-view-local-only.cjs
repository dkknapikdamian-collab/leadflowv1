const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const clientPath = path.join(root, 'src', 'pages', 'ClientDetail.tsx');
const testRelationPath = path.join(root, 'tests', 'client-relation-command-center.test.cjs');
const testFinalPath = path.join(root, 'tests', 'client-detail-final-operating-model.test.cjs');
const releasePath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function replaceAllStrict(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Stage117B cannot find block: ${label}`);
  }
  return text.split(from).join(to);
}

function replaceStrict(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Stage117B cannot find block: ${label}`);
  }
  return text.replace(from, to);
}

function removeBetween(text, startNeedle, endNeedle, label, replacement = '') {
  const start = text.indexOf(startNeedle);
  if (start === -1) throw new Error(`Stage117B cannot find start for ${label}`);
  const end = text.indexOf(endNeedle, start + startNeedle.length);
  if (end === -1) throw new Error(`Stage117B cannot find end for ${label}`);
  return text.slice(0, start) + replacement + text.slice(end);
}

let client = read(clientPath);

// Contract marker and old active-lead constants cleanup.
client = replaceStrict(
  client,
  "const CLIENT_RELATION_OPEN_LEAD_GUARD = 'Otwórz lead';\nconst CLIENT_RELATION_OPEN_LEAD_GUARD_UTF8 = 'Otwórz lead';\n",
  "const STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT = 'ClientDetail keeps lead data as acquisition source only and does not render a lead cockpit';\nvoid STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT;\n",
  'replace legacy open lead guard constants',
);

client = replaceStrict(
  client,
  "  kind: 'task' | 'event' | 'case' | 'lead' | 'empty';",
  "  kind: 'task' | 'event' | 'case' | 'empty';",
  'remove lead from ClientNextAction kind',
);

client = replaceStrict(
  client,
  "  const label = action.contextKind === 'case' ? 'Sprawa' : 'Lead';\n  return (\n    <p className=\"client-detail-next-action-context\" title={contextTitle}>\n      {label}: {contextTitle}\n    </p>\n  );",
  "  const label = action.contextKind === 'case' ? 'Sprawa' : 'Historia pozyskania';\n  return (\n    <p className=\"client-detail-next-action-context\" title={contextTitle} data-client-acquisition-context-only=\"true\">\n      {label}: {contextTitle}\n    </p>\n  );",
  'make lead context acquisition-only',
);

client = replaceStrict(
  client,
  "      to: targetCaseId ? `/cases/${targetCaseId}` : targetLeadId ? `/leads/${targetLeadId}` : '/today',",
  "      to: targetCaseId ? `/cases/${targetCaseId}` : isEvent ? '/calendar' : '/today',",
  'nearest action should not route to lead',
);

const openLeadStart = client.indexOf('  const openLead = leads.find((lead) =>');
if (openLeadStart !== -1) {
  const openLeadEnd = client.indexOf('  return {\n    kind: \'empty\'', openLeadStart);
  if (openLeadEnd === -1) throw new Error('Stage117B cannot remove open lead fallback');
  client = client.slice(0, openLeadStart) + '  // STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT: client next action does not fall back to opening a lead.\n\n' + client.slice(openLeadEnd);
}

client = replaceStrict(
  client,
  "    subtitle: 'Ten klient nie ma teraz otwartego zadania, wydarzenia, leada ani sprawy.',",
  "    subtitle: 'Ten klient nie ma teraz otwartego zadania, wydarzenia ani sprawy.',",
  'empty subtitle no lead cockpit',
);

// Remove new-lead shortcut retained as hidden compatibility marker.
const openNewLeadStart = client.indexOf('  const openNewLeadForExistingClient = () => {');
if (openNewLeadStart !== -1) {
  const openNewLeadEnd = client.indexOf('\n\n  const openMainCase = () => {', openNewLeadStart);
  if (openNewLeadEnd === -1) throw new Error('Stage117B cannot remove openNewLeadForExistingClient');
  client = client.slice(0, openNewLeadStart) + '  // STAGE117B: no new/open lead shortcut from ClientDetail.\n' + client.slice(openNewLeadEnd + 2);
}

client = client.replace(
  /\s*<div hidden data-client-detail-stage35-retain-open-new-lead=\{String\(Boolean\(openNewLeadForExistingClient\)\)\} \/>/,
  '\n            <div hidden data-client-detail-stage117b-no-lead-shortcut="true" />',
);

// Summary tab: remove active lead relation rows.
const summaryLeadRowsStart = client.indexOf("                    {leads.length ? (\n                      leads.slice(0, 3).map((lead) => (");
if (summaryLeadRowsStart !== -1) {
  const summaryLeadRowsEnd = client.indexOf("                    {clientCaseRows.length === 0 ? (", summaryLeadRowsStart);
  if (summaryLeadRowsEnd === -1) throw new Error('Stage117B cannot find end of summary lead relation rows');
  client = client.slice(0, summaryLeadRowsStart) + client.slice(summaryLeadRowsEnd);
}

// Summary tab: remove case-to-lead action from relation rows.
client = client.replace(
  /\n\s*\{caseRecord\.leadId \? \(\n\s*<Button type="button" size="sm" variant="outline" onClick=\{\(\) => navigate\(`\/leads\/\$\{String\(caseRecord\.leadId\)\}`\)\}>\n\s*Otwórz lead\n\s*<\/Button>\n\s*\) : null\}/g,
  '',
);

// Source lead panel stays as read-only acquisition history, without opening lead.
client = client.replace(
  /\n\s*\{firstSourceLead \? \(\n\s*<Button type="button" variant="outline" onClick=\{\(\) => navigate\(`\/leads\/\$\{String\(firstSourceLead\.id\)\}`\)\}>\n\s*Otwórz lead\n\s*<\/Button>\n\s*\) : null\}/g,
  '\n                    <span className="client-detail-source-history-chip" data-client-source-history-readonly="true">Historia pozyskania</span>',
);

// Cases tab: cases must render regardless of linked leads, and acquisition lead rows are removed from the client cockpit.
client = replaceStrict(
  client,
  "                  {leads.length ? (<>\n\n                  <div className=\"client-detail-case-smart-list\" data-client-case-smart-list=\"true\">",
  "                  <>\n\n                  <div className=\"client-detail-case-smart-list\" data-client-case-smart-list=\"true\" data-client-cases-without-lead-view=\"true\">",
  'cases tab no longer gated by leads.length',
);

const acquisitionStart = client.indexOf('<div className="client-detail-relations-list client-detail-relations-list-acquisition-only">');
if (acquisitionStart !== -1) {
  const tailStart = client.indexOf('                  </>\n                  ) : (', acquisitionStart);
  if (tailStart === -1) throw new Error('Stage117B cannot find acquisition list tail');
  client = client.slice(0, acquisitionStart) + client.slice(tailStart);
}

const tailConditional = `                  </>\n                  ) : (\n                    <div className=\"client-detail-light-empty\">\n                      Brak zapisanej historii pozyskania dla tego klienta.\n                    </div>\n                  )}`;
client = replaceStrict(
  client,
  tailConditional,
  '                  </>',
  'remove lead-gated cases tab fallback',
);

// Top/side tile icons should not present lead as the client cockpit icon.
client = replaceAllStrict(
  client,
  '<EntityIcon entity="lead" className="h-4 w-4" />',
  '<EntityIcon entity="client" className="h-4 w-4" />',
  'replace lead icons in ClientDetail chrome',
);

const forbiddenClientSnippets = [
  'Otwórz lead',
  'navigate(`/leads/${',
  'openNewLeadForExistingClient',
  'client-detail-relations-list-acquisition-only',
  'data-client-acquisition-history-row',
  'Lead powiązany z klientem.',
  "kind: 'lead'",
  'leada ani sprawy',
];
for (const snippet of forbiddenClientSnippets) {
  if (client.includes(snippet)) {
    throw new Error(`Stage117B forbidden ClientDetail snippet remains: ${snippet}`);
  }
}
for (const required of [
  'STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT',
  'fetchLeadsFromSupabase({ clientId })',
  'fetchCasesFromSupabase({ clientId })',
  'data-client-cases-without-lead-view="true"',
  'Historia pozyskania',
  'Otwórz sprawę',
]) {
  if (!client.includes(required)) {
    throw new Error(`Stage117B required ClientDetail snippet missing: ${required}`);
  }
}
write(clientPath, client);
console.log('Stage117B patched ClientDetail: no active lead view, cases stay primary.');

let relationTest = read(testRelationPath);
relationTest = relationTest.replace(
  /test\('ClientDetail exposes relation command center actions',[\s\S]*?\n\}\);/,
  `test('ClientDetail exposes relation command center actions without lead cockpit links', () => {\n  const file = read('src/pages/ClientDetail.tsx');\n  assert.ok(file.includes('Klient jako centrum relacji'));\n  assert.ok(file.includes('\\u015Acie\\u017Cka klienta'));\n  assert.ok(!file.includes('Otw\\u00F3rz lead'));\n  assert.ok(!file.includes('Otwórz lead'));\n  assert.ok(file.includes('Otw\\u00F3rz spraw\\u0119') || file.includes('Otwórz sprawę'));\n});`,
);
relationTest = relationTest.replace(
  /test\('ClientDetail links leads and cases both ways from client screen',[\s\S]*?\n\}\);/,
  `test('ClientDetail keeps lead data scoped but does not link back to the lead cockpit', () => {\n  const file = read('src/pages/ClientDetail.tsx');\n\n  assert.ok(file.includes('fetchLeadsFromSupabase({ clientId })'));\n  assert.ok(file.includes('fetchCasesFromSupabase({ clientId })'));\n  assert.ok(!file.includes('navigate(\`/leads/\\${String(lead.id)}\`)'));\n  assert.ok(!file.includes('navigate(\`/leads/\\${String(caseRecord.leadId)}\`)'));\n  assert.ok(!file.includes('navigate(\`/leads/\\${String(firstSourceLead.id)}\`)'));\n  assert.ok(!file.includes('openNewLeadForExistingClient'));\n\n  assertIncludesOneOf(file, [\n    'navigate(\`/cases/\\${String(caseRecord.id)}\`)',\n    \"navigate('/cases/' + String(caseRecord.id))\",\n    \"to={'/cases/' + caseId}\",\n  ], 'case route');\n\n  assert.ok(!file.includes('navigate(\`/case/\\${String(caseRecord.id)}\`)'));\n});`,
);
write(testRelationPath, relationTest);
console.log('Stage117B updated client relation command center contract.');

let finalTest = read(testFinalPath);
finalTest = finalTest.replace(
  /test\('ClientDetail leaves process work in case or active lead, not in client cockpit',[\s\S]*?\n\}\);/,
  `test('ClientDetail leaves process work in case, not in a client-side lead cockpit', () => {\n  assert.ok(source.includes('CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD'));\n  assert.ok(source.includes('Praca dzieje si\\u0119 w sprawie'));\n  assert.ok(source.includes('Otw\\u00F3rz spraw\\u0119') || source.includes('Otwórz sprawę'));\n  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));\n  assert.ok(!source.includes('Otw\\u00F3rz lead'));\n  assert.ok(!source.includes('Otwórz lead'));\n  assert.ok(!source.includes('navigate(\`/leads/\\${'));\n});`,
);
finalTest = finalTest.replace(
  /test\('ClientDetail keeps source lead as history signal',[\s\S]*?\n\}\);/,
  `test('ClientDetail keeps acquisition history as a read-only signal', () => {\n  assert.ok(source.includes('Historia pozyskania'));\n  assert.ok(source.includes('data-client-source-history-readonly'));\n  assert.ok(source.includes('fetchLeadsFromSupabase({ clientId })'));\n  assert.ok(!source.includes('data-client-acquisition-history-row'));\n});`,
);
write(testFinalPath, finalTest);
console.log('Stage117B updated final operating model contract.');

const guardPath = path.join(root, 'tests', 'stage117b-client-detail-no-lead-view-contract.test.cjs');
const guardSource = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('node:fs');\nconst path = require('node:path');\n\nconst repoRoot = path.resolve(__dirname, '..');\nfunction read(relativePath) {\n  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');\n}\n\ntest('Stage117B ClientDetail does not render a lead cockpit', () => {\n  const source = read('src/pages/ClientDetail.tsx');\n\n  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));\n  assert.ok(source.includes('fetchLeadsFromSupabase({ clientId })'), 'lead data may remain as acquisition/source data');\n  assert.ok(source.includes('fetchCasesFromSupabase({ clientId })'), 'cases remain the primary client work surface');\n  assert.ok(source.includes('data-client-cases-without-lead-view="true"'));\n  assert.ok(source.includes('Historia pozyskania'));\n\n  for (const forbidden of [\n    'Otwórz lead',\n    'navigate(\`/leads/\\${',\n    'openNewLeadForExistingClient',\n    'data-client-acquisition-history-row',\n    'client-detail-relations-list-acquisition-only',\n    'Lead powiązany z klientem.',\n    \"kind: 'lead'\",\n    'leada ani sprawy',\n  ]) {\n    assert.equal(source.includes(forbidden), false, 'forbidden active lead UI remains: ' + forbidden);\n  }\n});\n\ntest('Stage117B ClientDetail keeps case-first actions', () => {\n  const source = read('src/pages/ClientDetail.tsx');\n  assert.ok(source.includes('Otwórz sprawę'));\n  assert.ok(source.includes('Wejdź w sprawę'));\n  assert.ok(source.includes('Nowa sprawa dla klienta'));\n});\n\ntest('Stage117B release gate includes client no-lead-view guard', () => {\n  const releaseGate = read('scripts/closeflow-release-check-quiet.cjs');\n  assert.ok(releaseGate.includes('tests/stage117b-client-detail-no-lead-view-contract.test.cjs'));\n});\n`;
write(guardPath, guardSource);
console.log('Stage117B wrote focused guard.');

let release = read(releasePath);
const newTest = "  'tests/stage117b-client-detail-no-lead-view-contract.test.cjs',";
if (!release.includes(newTest)) {
  release = release.replace(
    "  'tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs',",
    "  'tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs',\n" + newTest,
  );
  if (!release.includes(newTest)) {
    release = release.replace(
      "  'tests/stage116-dialog-description-accessibility-contract.test.cjs',",
      "  'tests/stage116-dialog-description-accessibility-contract.test.cjs',\n" + newTest,
    );
  }
  if (!release.includes(newTest)) throw new Error('Stage117B could not add guard to release gate');
  write(releasePath, release);
  console.log('Stage117B added guard to quiet release gate.');
} else {
  console.log('Stage117B guard already present in quiet release gate.');
}
