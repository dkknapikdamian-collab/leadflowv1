const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const leadsPath = path.join(repoRoot, 'src', 'pages', 'Leads.tsx');
const quietGatePath = path.join(repoRoot, 'scripts', 'closeflow-release-check-quiet.cjs');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function expectIncludes(content, text) {
  assert.equal(content.includes(text), true, 'Missing text: ' + text);
}

function expectNotIncludes(content, text) {
  assert.equal(content.includes(text), false, 'Unexpected text: ' + text);
}

test('Stage31 leads list is thin, numbered and has one-line meta', () => {
  const leads = fs.readFileSync(leadsPath, 'utf8');

  expectIncludes(leads, 'STAGE31_LEADS_THIN_NUMBERED_LIST');
  expectIncludes(leads, 'filteredLeads.map((lead, leadIndex) => {');
  expectIncludes(leads, 'data-stage31-lead-thin-row="true"');
  expectIncludes(leads, 'data-stage31-lead-one-line-meta="true"');
  expectIncludes(leads, '{leadIndex + 1}');
  expectIncludes(leads, 'buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel)');
});

test('Stage31 lead search covers phone, email, company, source and case with suggestions', () => {
  const leads = fs.readFileSync(leadsPath, 'utf8');

  expectIncludes(leads, 'normalizeLeadSearchValue');
  expectIncludes(leads, 'buildLeadSearchText(lead, linkedCase).includes(normalizedQuery)');
  expectIncludes(leads, 'leadSearchSuggestions');
  expectIncludes(leads, 'data-stage31-lead-search-suggestions="true"');
  expectIncludes(leads, 'lead-search-suggestions-stage31');
  expectIncludes(leads, 'Szukaj: nazwa, telefon, e-mail, firma, \u017Ar\u00F3d\u0142o albo sprawa...');
});

test('Stage31 removes noisy empty search helper copy', () => {
  const leads = fs.readFileSync(leadsPath, 'utf8');

  expectNotIncludes(leads, 'Spr\u00F3buj zmieni\u0107 wyszukiwanie, klikn\u0105\u0107 inny kafelek u g\u00F3ry albo doda\u0107 nowego leada.');
  expectIncludes(leads, 'Podpowiedzi pojawiaj\u0105 si\u0119 pod wyszukiwark\u0105. Usu\u0144 cz\u0119\u015B\u0107 tekstu albo wybierz inny filtr.');
});

test('Stage31 test is included in quiet release gate', () => {
  const quietGate = fs.readFileSync(quietGatePath, 'utf8');
  expectIncludes(quietGate, 'tests/stage31-leads-thin-list-search.test.cjs');
});

test('Stage31 docs keep Polish encoding clean', () => {
  const doc = read('docs/STAGE31_LEADS_THIN_LIST_SEARCH_2026-04-28.md');
  expectIncludes(doc, 'cienka, numerowana lista');
  expectIncludes(doc, 'wyszukiwarka');
});
