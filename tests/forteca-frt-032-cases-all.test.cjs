const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..');
const contractRelativePath = '_project/contracts/forteca-clean/FRT-032_CASES_ALL.md';
const referenceRelativePath = 'docs/ui/reference/forteca-calm-light/032_cases_all.webp';
const casesRelativePath = 'src/pages/Cases.tsx';

const readRepositoryFile = (relativePath) =>
  fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

const assertSourceMatches = (source, pattern, message = `Expected Cases.tsx to match ${pattern}`) =>
  assert.ok(pattern.test(source), message);

test('FRT-032 is locked to the all-cases route and reference', () => {
  const contract = readRepositoryFile(contractRelativePath);

  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-032$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases$/m);
  assert.match(contract, /^TARGET_STATE: Cases — Wszystkie$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/032_cases_all\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-031$/m);
  assert.match(contract, /^SUCCESSOR: FRT-033$/m);
  assert.equal(fs.existsSync(path.join(repositoryRoot, referenceRelativePath)), true);
});

test('Cases all-state renders real workspace data instead of a fixture list', () => {
  const source = readRepositoryFile(casesRelativePath);

  assertSourceMatches(source, /export default function Cases\s*\(/);
  assertSourceMatches(source, /useWorkspace\s*\(\s*\)/);
  assertSourceMatches(source, /workspace\?\.id/);
  assertSourceMatches(source, /fetchCasesFromSupabase\s*\(/);
  assertSourceMatches(source, /const\s+\[cases,\s*setCases\]/);
  assertSourceMatches(source, /useState<CaseView>\(\s*['"]all['"]\s*\)/);
  assertSourceMatches(source, /caseView\s*===\s*['"]all['"]\s*\?\s*cases/);

  assert.doesNotMatch(source, /mockCases|fixtureCases|fixtureData/i);
  assert.doesNotMatch(source, /SP-2026\//);
});

test('Cases all-state exposes the shared search, filter, sort and reset controls', () => {
  const source = readRepositoryFile(casesRelativePath);

  assertSourceMatches(source, /pageKey=["']cases["']/);
  assertSourceMatches(source, /value=\{searchQuery\}/);
  assertSourceMatches(source, /setSearchQuery/);
  assertSourceMatches(source, /<FilterToolbar\b/);
  assertSourceMatches(source, /<FilterSelect\b/);
  assertSourceMatches(source, /<SortSelect\b/);
  assertSourceMatches(source, /Status/i);
  assertSourceMatches(source, /Kompletność/i);
  assertSourceMatches(source, /Opiekun/i);
  assertSourceMatches(source, /Więcej filtrów/i);
  assertSourceMatches(source, /resetCase(?:List)?Filters|Reset(?:uj|owanie| filtr)/i);
  assertSourceMatches(source, /setShowMoreFilters/);

  for (const stateKey of [
    'statusFilter',
    'clientFilter',
    'ownerFilter',
    'blockerFilter',
    'completenessFilter',
    'sortBy',
    'showMoreFilters',
  ]) {
    assertSourceMatches(source, new RegExp(`\\b${stateKey}\\b`));
  }

  for (const setter of [
    'setStatusFilter',
    'setClientFilter',
    'setOwnerFilter',
    'setBlockerFilter',
    'setCompletenessFilter',
    'setSortBy',
  ]) {
    assertSourceMatches(source, new RegExp(`\\b${setter}\\b`));
  }
});

test('Cases all-state binds reference metrics to dynamic case statistics', () => {
  const source = readRepositoryFile(casesRelativePath);

  for (const [labelPattern, statKey, label] of [
    ['Wszystkie(?:\\s+sprawy)?', 'all', 'Wszystkie'],
    ['Czek(?:ają|a) na klienta', 'waiting', 'Czekają na klienta'],
    ['Zablokowane', 'blocked', 'Zablokowane'],
    ['Gotowe(?:\\s+do\\s+startu)?', 'ready', 'Gotowe do startu'],
  ]) {
    const labelMatch = new RegExp(
      `(?:label|title)\\s*(?:=|:)\\s*["']${labelPattern}["']`,
      'i',
    ).exec(source);
    assert.ok(labelMatch, `metric ${label} is missing`);

    const nearbyMetricSource = source.slice(
      Math.max(0, labelMatch.index - 260),
      labelMatch.index + labelMatch[0].length + 260,
    );
    assertSourceMatches(
      nearbyMetricSource,
      new RegExp(`\\bstats\\.${statKey}\\b`),
      `metric ${label} must be backed by stats.${statKey}`,
    );
  }

  assertSourceMatches(source, /const\s+stats\s*=/);
  assertSourceMatches(source, /all:\s*cases\.length/);
  const metricBlocks = [...source.matchAll(/<StatShortcutCard\b[\s\S]*?\/>/g)].map(([block]) => block);
  assert.ok(metricBlocks.length >= 4, 'expected four shared metric cards');
  assert.ok(
    metricBlocks.every((block) => !/(?:value|count)\s*=\s*\{\s*\d+\s*\}/.test(block)),
    'metric cards must not hardcode numeric values',
  );
  assert.doesNotMatch(source, /(?:value|count)\s*:\s*\d+\b/);
});

test('Cases all-state keeps real row navigation, completeness and actions', () => {
  const source = readRepositoryFile(casesRelativePath);

  assertSourceMatches(source, /(?:filteredCases|visibleCases)\.map\s*\(/);
  assertSourceMatches(source, /caseDetailPath\(record\.id\)/);
  assertSourceMatches(source, /getCaseStatusLabel\(record\.status\)/);
  assertSourceMatches(source, /record\.completenessPercent/);
  assertSourceMatches(source, /data-case-row-delete-action=["']true["']/);
  assertSourceMatches(source, /deleteCaseWithRelations/);
  assertSourceMatches(source, /aria-label=\{`Otwórz sprawę/);
  assertSourceMatches(source, /aria-label=["']Usuń sprawę["']/);

  assert.doesNotMatch(source, /onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/);
  assert.doesNotMatch(source, /href=["']#["']/);
});
