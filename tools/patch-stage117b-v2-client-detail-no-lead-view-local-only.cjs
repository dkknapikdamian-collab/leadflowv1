const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const clientPath = path.join(root, 'src', 'pages', 'ClientDetail.tsx');
const testRelationPath = path.join(root, 'tests', 'client-relation-command-center.test.cjs');
const testFinalPath = path.join(root, 'tests', 'client-detail-final-operating-model.test.cjs');
const releasePath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const guardPath = path.join(root, 'tests', 'stage117b-client-detail-no-lead-view-contract.test.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function replaceStrict(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error('Stage117B v2 cannot find block: ' + label);
  }
  return text.replace(from, to);
}

function replaceAllLiteral(text, from, to) {
  return text.split(from).join(to);
}

function replaceTestBlock(source, testName, replacementLines) {
  const marker = "test('" + testName + "'";
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error('Stage117B v2 cannot find test block: ' + testName);
  }
  const next = source.indexOf("\ntest('", start + marker.length);
  const end = next === -1 ? source.length : next + 1;
  return source.slice(0, start) + replacementLines.join('\n') + '\n' + source.slice(end);
}

function removeBlockByBounds(source, startNeedle, endNeedle, label) {
  const start = source.indexOf(startNeedle);
  if (start === -1) return source;
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end === -1) throw new Error('Stage117B v2 cannot find end for ' + label);
  return source.slice(0, start) + source.slice(end);
}

let client = read(clientPath);

if (!client.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT')) {
  client = replaceStrict(
    client,
    "const CLIENT_RELATION_OPEN_LEAD_GUARD = 'Otwórz lead';\nconst CLIENT_RELATION_OPEN_LEAD_GUARD_UTF8 = 'Otwórz lead';\n",
    "const STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT = 'ClientDetail keeps lead data as acquisition source only and does not render a lead cockpit';\nvoid STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT;\n",
    'legacy open lead constants',
  );
}

client = replaceAllLiteral(client, "  kind: 'task' | 'event' | 'case' | 'lead' | 'empty';", "  kind: 'task' | 'event' | 'case' | 'empty';");
client = replaceAllLiteral(
  client,
  "  const label = action.contextKind === 'case' ? 'Sprawa' : 'Lead';\n  return (\n    <p className=\"client-detail-next-action-context\" title={contextTitle}>\n      {label}: {contextTitle}\n    </p>\n  );",
  "  const label = action.contextKind === 'case' ? 'Sprawa' : 'Historia pozyskania';\n  return (\n    <p className=\"client-detail-next-action-context\" title={contextTitle} data-client-acquisition-context-only=\"true\">\n      {label}: {contextTitle}\n    </p>\n  );",
);
client = replaceAllLiteral(
  client,
  "      to: targetCaseId ? `/cases/${targetCaseId}` : targetLeadId ? `/leads/${targetLeadId}` : '/today',",
  "      to: targetCaseId ? `/cases/${targetCaseId}` : isEvent ? '/calendar' : '/today',",
);

const openLeadStart = client.indexOf('  const openLead = leads.find((lead) =>');
if (openLeadStart !== -1) {
  const openLeadEnd = client.indexOf("  return {\n    kind: 'empty'", openLeadStart);
  if (openLeadEnd === -1) throw new Error('Stage117B v2 cannot remove open lead fallback');
  client = client.slice(0, openLeadStart) + '  // STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT: client next action does not fall back to opening a lead.\n\n' + client.slice(openLeadEnd);
}

client = replaceAllLiteral(
  client,
  "    subtitle: 'Ten klient nie ma teraz otwartego zadania, wydarzenia, leada ani sprawy.',",
  "    subtitle: 'Ten klient nie ma teraz otwartego zadania, wydarzenia ani sprawy.',",
);

const openNewLeadStart = client.indexOf('  const openNewLeadForExistingClient = () => {');
if (openNewLeadStart !== -1) {
  const openNewLeadEnd = client.indexOf('\n\n  const openMainCase = () => {', openNewLeadStart);
  if (openNewLeadEnd === -1) throw new Error('Stage117B v2 cannot remove openNewLeadForExistingClient');
  client = client.slice(0, openNewLeadStart) + '  // STAGE117B: no new/open lead shortcut from ClientDetail.\n' + client.slice(openNewLeadEnd + 2);
}
client = client.replace(
  /\s*<div hidden data-client-detail-stage35-retain-open-new-lead=\{String\(Boolean\(openNewLeadForExistingClient\)\)\} \/>/g,
  '\n            <div hidden data-client-detail-stage117b-no-lead-shortcut="true" />',
);

const summaryLeadRowsStart = client.indexOf('                    {leads.length ? (\n                      leads.slice(0, 3).map((lead) => (');
if (summaryLeadRowsStart !== -1) {
  const summaryLeadRowsEnd = client.indexOf('                    {clientCaseRows.length === 0 ? (', summaryLeadRowsStart);
  if (summaryLeadRowsEnd === -1) throw new Error('Stage117B v2 cannot find end of summary lead relation rows');
  client = client.slice(0, summaryLeadRowsStart) + client.slice(summaryLeadRowsEnd);
}

client = client.replace(
  /\n\s*\{caseRecord\.leadId \? \(\n\s*<Button type="button" size="sm" variant="outline" onClick=\{\(\) => navigate\(`\/leads\/\$\{String\(caseRecord\.leadId\)\}`\)\}>\n\s*Otwórz lead\n\s*<\/Button>\n\s*\) : null\}/g,
  '',
);
client = client.replace(
  /\n\s*\{firstSourceLead \? \(\n\s*<Button type="button" variant="outline" onClick=\{\(\) => navigate\(`\/leads\/\$\{String\(firstSourceLead\.id\)\}`\)\}>\n\s*Otwórz lead\n\s*<\/Button>\n\s*\) : null\}/g,
  '\n                    <span className="client-detail-source-history-chip" data-client-source-history-readonly="true">Historia pozyskania</span>',
);

client = replaceAllLiteral(
  client,
  '                  {leads.length ? (<>\n\n                  <div className="client-detail-case-smart-list" data-client-case-smart-list="true">',
  '                  <>\n\n                  <div className="client-detail-case-smart-list" data-client-case-smart-list="true" data-client-cases-without-lead-view="true">',
);

const acquisitionStart = client.indexOf('<div className="client-detail-relations-list client-detail-relations-list-acquisition-only">');
if (acquisitionStart !== -1) {
  const tailStart = client.indexOf('                  </>\n                  ) : (', acquisitionStart);
  if (tailStart === -1) throw new Error('Stage117B v2 cannot find acquisition list tail');
  client = client.slice(0, acquisitionStart) + client.slice(tailStart);
}
client = replaceAllLiteral(
  client,
  '                  </>\n                  ) : (\n                    <div className="client-detail-light-empty">\n                      Brak zapisanej historii pozyskania dla tego klienta.\n                    </div>\n                  )}',
  '                  </>',
);

client = replaceAllLiteral(client, '<EntityIcon entity="lead" className="h-4 w-4" />', '<EntityIcon entity="client" className="h-4 w-4" />');

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
    throw new Error('Stage117B v2 forbidden ClientDetail snippet remains: ' + snippet);
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
    throw new Error('Stage117B v2 required ClientDetail snippet missing: ' + required);
  }
}
write(clientPath, client);
console.log('Stage117B v2 patched ClientDetail without active lead view.');

let relationTest = read(testRelationPath);
relationTest = replaceTestBlock(relationTest, 'ClientDetail exposes relation command center actions', [
  "test('ClientDetail exposes relation command center actions without lead cockpit links', () => {",
  "  const file = read('src/pages/ClientDetail.tsx');",
  "  assert.ok(file.includes('Klient jako centrum relacji'));",
  "  assert.ok(file.includes('\\u015Acie\\u017Cka klienta'));",
  "  assert.ok(!file.includes('Otw\\u00F3rz lead'));",
  "  assert.ok(!file.includes('Otwórz lead'));",
  "  assert.ok(file.includes('Otw\\u00F3rz spraw\\u0119') || file.includes('Otwórz sprawę'));",
  "});",
]);
relationTest = replaceTestBlock(relationTest, 'ClientDetail links leads and cases both ways from client screen', [
  "test('ClientDetail keeps lead data scoped but does not link back to the lead cockpit', () => {",
  "  const file = read('src/pages/ClientDetail.tsx');",
  "  assert.ok(file.includes('fetchLeadsFromSupabase({ clientId })'));",
  "  assert.ok(file.includes('fetchCasesFromSupabase({ clientId })'));",
  "  assert.ok(!file.includes('navigate(`/leads/${String(lead.id)}`)'));",
  "  assert.ok(!file.includes('navigate(`/leads/${String(caseRecord.leadId)}`)'));",
  "  assert.ok(!file.includes('navigate(`/leads/${String(firstSourceLead.id)}`)'));",
  "  assert.ok(!file.includes('openNewLeadForExistingClient'));",
  "  assertIncludesOneOf(file, [",
  "    'navigate(`/cases/${String(caseRecord.id)}`)',",
  "    \"navigate('/cases/' + String(caseRecord.id))\",",
  "    \"to={'/cases/' + caseId}\",",
  "  ], 'case route');",
  "  assert.ok(!file.includes('navigate(`/case/${String(caseRecord.id)}`)'));",
  "});",
]);
write(testRelationPath, relationTest);
console.log('Stage117B v2 updated client relation contract.');

let finalTest = read(testFinalPath);
finalTest = replaceTestBlock(finalTest, 'ClientDetail leaves process work in case or active lead, not in client cockpit', [
  "test('ClientDetail leaves process work in case, not in a client-side lead cockpit', () => {",
  "  assert.ok(source.includes('CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD'));",
  "  assert.ok(source.includes('Praca dzieje si\\u0119 w sprawie'));",
  "  assert.ok(source.includes('Otw\\u00F3rz spraw\\u0119') || source.includes('Otwórz sprawę'));",
  "  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));",
  "  assert.ok(!source.includes('Otw\\u00F3rz lead'));",
  "  assert.ok(!source.includes('Otwórz lead'));",
  "  assert.ok(!source.includes('navigate(`/leads/${'));",
  "});",
]);
finalTest = replaceTestBlock(finalTest, 'ClientDetail keeps source lead as history signal', [
  "test('ClientDetail keeps acquisition history as a read-only signal', () => {",
  "  assert.ok(source.includes('Historia pozyskania'));",
  "  assert.ok(source.includes('data-client-source-history-readonly'));",
  "  assert.ok(source.includes('fetchLeadsFromSupabase({ clientId })'));",
  "  assert.ok(!source.includes('data-client-acquisition-history-row'));",
  "});",
]);
write(testFinalPath, finalTest);
console.log('Stage117B v2 updated final operating model contract.');

const guardSource = [
  "const test = require('node:test');",
  "const assert = require('node:assert/strict');",
  "const fs = require('node:fs');",
  "const path = require('node:path');",
  '',
  "const repoRoot = path.resolve(__dirname, '..');",
  'function read(relativePath) {',
  "  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');",
  '}',
  '',
  "test('Stage117B ClientDetail does not render a lead cockpit', () => {",
  "  const source = read('src/pages/ClientDetail.tsx');",
  "  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));",
  "  assert.ok(source.includes('fetchLeadsFromSupabase({ clientId })'), 'lead data may remain as acquisition/source data');",
  "  assert.ok(source.includes('fetchCasesFromSupabase({ clientId })'), 'cases remain the primary client work surface');",
  "  assert.ok(source.includes('data-client-cases-without-lead-view=\"true\"'));",
  "  assert.ok(source.includes('Historia pozyskania'));",
  '  for (const forbidden of [',
  "    'Otwórz lead',",
  "    'navigate(`/leads/${',",
  "    'openNewLeadForExistingClient',",
  "    'data-client-acquisition-history-row',",
  "    'client-detail-relations-list-acquisition-only',",
  "    'Lead powiązany z klientem.',",
  "    \"kind: 'lead'\",",
  "    'leada ani sprawy',",
  '  ]) {',
  "    assert.equal(source.includes(forbidden), false, 'forbidden active lead UI remains: ' + forbidden);",
  '  }',
  '});',
  '',
  "test('Stage117B ClientDetail keeps case-first actions', () => {",
  "  const source = read('src/pages/ClientDetail.tsx');",
  "  assert.ok(source.includes('Otwórz sprawę'));",
  "  assert.ok(source.includes('Wejdź w sprawę'));",
  "  assert.ok(source.includes('Nowa sprawa dla klienta'));",
  '});',
  '',
  "test('Stage117B release gate includes client no-lead-view guard', () => {",
  "  const releaseGate = read('scripts/closeflow-release-check-quiet.cjs');",
  "  assert.ok(releaseGate.includes('tests/stage117b-client-detail-no-lead-view-contract.test.cjs'));",
  '});',
  '',
].join('\n');
write(guardPath, guardSource);
console.log('Stage117B v2 wrote focused guard.');

let release = read(releasePath);
const newTest = "  'tests/stage117b-client-detail-no-lead-view-contract.test.cjs',";
if (!release.includes(newTest)) {
  if (release.includes("  'tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs',")) {
    release = release.replace(
      "  'tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs',",
      "  'tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs',\n" + newTest,
    );
  } else {
    release = release.replace(
      "  'tests/stage116-dialog-description-accessibility-contract.test.cjs',",
      "  'tests/stage116-dialog-description-accessibility-contract.test.cjs',\n" + newTest,
    );
  }
  if (!release.includes(newTest)) throw new Error('Stage117B v2 could not add guard to release gate');
  write(releasePath, release);
  console.log('Stage117B v2 added guard to quiet release gate.');
} else {
  console.log('Stage117B v2 guard already present in quiet release gate.');
}
