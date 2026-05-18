const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const caseDetailPath = path.join(repoRoot, 'src/pages/CaseDetail.tsx');

function readCaseDetail() {
  return fs.readFileSync(caseDetailPath, 'utf8');
}

test('Stage115 CaseDetail imports useWorkspace from project hook, never from React', () => {
  const source = readCaseDetail();

  const reactImports = [...source.matchAll(/import\s+\{([^}]*)\}\s+from\s+['"]react['"]/g)];
  assert.ok(reactImports.length >= 1, 'CaseDetail.tsx should import React hooks from react');

  for (const match of reactImports) {
    const names = match[1].split(',').map((part) => part.trim());
    assert.equal(
      names.some((name) => /^useWorkspace\b/.test(name)),
      false,
      'useWorkspace must not be imported from react; it is a project hook',
    );
  }

  assert.match(
    source,
    /import\s+\{\s*useWorkspace\s*\}\s+from\s+['"]\.\.\/hooks\/useWorkspace['"];?/, 
    'CaseDetail.tsx must import useWorkspace from ../hooks/useWorkspace',
  );

  assert.doesNotMatch(
    source,
    /import\s+\{[^}]*\buseWorkspace\b[^}]*\}\s+from\s+['"]react['"];?/, 
    'React import must not include useWorkspace',
  );
});

test('Stage115 CaseDetail import zone has no import-like text hidden in block comments', () => {
  const source = readCaseDetail();
  const importZoneEndCandidates = [
    source.indexOf('const STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS'),
    source.indexOf('const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE'),
    source.indexOf('type CaseDetailTab'),
  ].filter((value) => value > 0);
  assert.ok(importZoneEndCandidates.length > 0, 'CaseDetail import zone end should be detectable');

  const importZone = source.slice(0, Math.min(...importZoneEndCandidates));
  const blockComments = importZone.match(/\/\*[\s\S]*?\*\//g) || [];

  for (const block of blockComments) {
    assert.doesNotMatch(
      block,
      /\bimport\b[\s\S]*\bfrom\b/,
      'Import-like text must not live inside CaseDetail block comments',
    );
  }

  assert.doesNotMatch(
    source,
    /\/\*\s*STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS[\s\S]*?import\s+\{/, 
    'Stage16O marker must not comment out runtime imports',
  );
});
