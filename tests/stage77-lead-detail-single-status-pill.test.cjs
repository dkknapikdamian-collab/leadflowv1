const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function findLeadTitleRowBlock(text) {
  const markerIndex = text.indexOf('lead-detail-title-row');
  assert.ok(markerIndex >= 0, 'missing lead-detail-title-row');
  const start = text.lastIndexOf('<div', markerIndex);
  assert.ok(start >= 0, 'cannot find opening div for title row');
  const tagPattern = /<\/?div\b[^>]*>/g;
  tagPattern.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagPattern.exec(text))) {
    const tag = match[0];
    if (tag.startsWith('</')) depth -= 1;
    else if (!tag.endsWith('/>')) depth += 1;
    if (depth === 0) return text.slice(start, tagPattern.lastIndex);
  }
  assert.fail('cannot find closing div for title row');
}

test('Stage77 checker and LeadDetail are syntactically valid', () => {
  for (const file of [
    'scripts/check-stage77-lead-detail-single-status-pill.cjs',
    'tests/stage77-lead-detail-single-status-pill.test.cjs',
  ]) {
    const result = spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, file + '\n' + result.stderr);
  }
});

test('LeadDetail title row renders one status label only', () => {
  const text = read('src/pages/LeadDetail.tsx');
  const titleRow = findLeadTitleRowBlock(text);
  const statusLabelCalls = (titleRow.match(/statusLabel\s*\(/g) || []).length + (titleRow.match(/leadStatusLabel/g) || []).length;
  assert.equal(statusLabelCalls, 1, titleRow);
  assert.doesNotMatch(titleRow, /\{statusLabel\([^)]*lead[^)]*status[^)]*\)\}[\s\S]{0,260}\{statusLabel\([^)]*lead[^)]*status[^)]*\)\}/);
});

test('LeadDetail keeps one shared status mapping and required labels', () => {
  const text = read('src/pages/LeadDetail.tsx');
  assert.match(text, /function statusLabel\(status\?: string\)/);
  assert.match(text, /function statusClass\(status\?: string\)/);
  for (const label of ['Oferta wys\u0142ana', 'Nowy', 'Czeka na odpowied\u017A', 'Przegrany']) {
    assert.ok(text.includes(label), 'missing label: ' + label);
  }
});

test('package scripts expose Stage77 guard and test', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage77-lead-detail-single-status-pill'], 'node scripts/check-stage77-lead-detail-single-status-pill.cjs');
  assert.equal(pkg.scripts['test:stage77-lead-detail-single-status-pill'], 'node --test tests/stage77-lead-detail-single-status-pill.test.cjs');
});
