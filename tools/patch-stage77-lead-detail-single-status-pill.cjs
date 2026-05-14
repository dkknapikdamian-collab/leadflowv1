const fs = require('fs');
const path = require('path');

const root = process.cwd();
const leadDetailPath = path.join(root, 'src', 'pages', 'LeadDetail.tsx');
const packagePath = path.join(root, 'package.json');
const quietPath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const checkPath = path.join(root, 'scripts', 'check-stage77-lead-detail-single-status-pill.cjs');
const testPath = path.join(root, 'tests', 'stage77-lead-detail-single-status-pill.test.cjs');

function fail(message) {
  console.error('STAGE77_PATCH_FAIL:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + path.relative(root, file));
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function findLeadTitleRowBlock(text) {
  const markerIndex = text.indexOf('lead-detail-title-row');
  if (markerIndex < 0) fail('LeadDetail.tsx missing lead-detail-title-row');
  const start = text.lastIndexOf('<div', markerIndex);
  if (start < 0) fail('cannot find opening div for lead-detail-title-row');

  const tagPattern = /<\/?div\b[^>]*>/g;
  tagPattern.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagPattern.exec(text))) {
    const tag = match[0];
    const isClosing = tag.startsWith('</');
    const isSelfClosing = tag.endsWith('/>');
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) {
      return { start, end: tagPattern.lastIndex, block: text.slice(start, tagPattern.lastIndex) };
    }
  }
  fail('cannot find closing div for lead-detail-title-row');
}

function statusLabelCount(block) {
  const direct = (block.match(/statusLabel\s*\(/g) || []).length;
  const alias = (block.match(/leadStatusLabel/g) || []).length;
  return direct + alias;
}

function collectStatusElements(block) {
  const candidates = [];
  for (const tag of ['span', 'Badge']) {
    const pattern = new RegExp('<' + tag + '\\b[\\s\\S]*?<\\/' + tag + '>', 'g');
    let match;
    while ((match = pattern.exec(block))) {
      const element = match[0];
      const normalized = element.replace(/\s+/g, ' ');
      const looksLikeLeadStatus = /statusLabel\s*\(/.test(element) || /leadStatusLabel/.test(element);
      const looksLikePill = /lead-detail-pill/.test(element) || /statusClass\s*\(/.test(element) || /cf-status-pill/.test(element);
      if (looksLikeLeadStatus && looksLikePill) {
        candidates.push({ start: match.index, end: pattern.lastIndex, element, normalized });
      }
    }
  }
  candidates.sort((a, b) => a.start - b.start);
  return candidates;
}

function dedupeTitleRowStatus(text) {
  const found = findLeadTitleRowBlock(text);
  let block = found.block;
  const beforeCount = statusLabelCount(block);
  if (beforeCount <= 1) return { text, changed: false, beforeCount, afterCount: beforeCount };

  const candidates = collectStatusElements(block);
  if (candidates.length <= 1) {
    const lines = block.split(/\r?\n/);
    let seen = 0;
    const nextLines = lines.filter((line) => {
      const isStatusLine = (/statusLabel\s*\(/.test(line) || /leadStatusLabel/.test(line)) && (/lead-detail-pill/.test(line) || /statusClass\s*\(/.test(line) || /cf-status-pill/.test(line));
      if (!isStatusLine) return true;
      seen += 1;
      return seen === 1;
    });
    block = nextLines.join('\n');
  } else {
    let nextBlock = block;
    for (let index = candidates.length - 1; index >= 1; index -= 1) {
      const candidate = candidates[index];
      const left = nextBlock.slice(0, candidate.start);
      const right = nextBlock.slice(candidate.end);
      const prefixWhitespace = left.match(/[ \t]*$/)?.[0] || '';
      nextBlock = left.slice(0, left.length - prefixWhitespace.length) + right.replace(/^\r?\n?/, '');
    }
    block = nextBlock;
  }

  const afterCount = statusLabelCount(block);
  if (afterCount > 1) {
    fail('lead-detail-title-row still has multiple status label renderers after patch: ' + afterCount);
  }
  const nextText = text.slice(0, found.start) + block + text.slice(found.end);
  return { text: nextText, changed: nextText !== text, beforeCount, afterCount };
}

function ensureMarker(text) {
  const marker = "const STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL = 'LeadDetail header renders lead status pill once in title row';";
  if (text.includes('STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL')) return text;
  const anchor = "const CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_V1";
  const index = text.indexOf(anchor);
  if (index < 0) return marker + '\nvoid STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL;\n' + text;
  const lineEnd = text.indexOf('\n', index);
  if (lineEnd < 0) return text + '\n' + marker + '\nvoid STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL;\n';
  return text.slice(0, lineEnd + 1) + marker + '\nvoid STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL;\n' + text.slice(lineEnd + 1);
}

const checkScript = String.raw`const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src', 'pages', 'LeadDetail.tsx');

function fail(message) {
  console.error('STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL_FAIL:', message);
  process.exit(1);
}

function findLeadTitleRowBlock(text) {
  const markerIndex = text.indexOf('lead-detail-title-row');
  if (markerIndex < 0) fail('missing lead-detail-title-row');
  const start = text.lastIndexOf('<div', markerIndex);
  if (start < 0) fail('cannot find opening div for title row');
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
  fail('cannot find closing div for title row');
}

const text = fs.readFileSync(file, 'utf8');
if (!text.includes('STAGE77_LEAD_DETAIL_SINGLE_STATUS_PILL')) fail('missing Stage77 marker');
if (!text.includes('function statusLabel(status?: string)')) fail('missing one status label mapping function');
if (!text.includes('function statusClass(status?: string)')) fail('missing one status class mapping function');

const titleRow = findLeadTitleRowBlock(text);
const statusLabelCalls = (titleRow.match(/statusLabel\s*\(/g) || []).length + (titleRow.match(/leadStatusLabel/g) || []).length;
const statusClassCalls = (titleRow.match(/statusClass\s*\(/g) || []).length;
const pillMentions = (titleRow.match(/lead-detail-pill/g) || []).length;

if (statusLabelCalls !== 1) fail('lead-detail-title-row must render exactly one status label, found: ' + statusLabelCalls);
if (statusClassCalls > 1) fail('lead-detail-title-row has duplicated status class mapping, found: ' + statusClassCalls);
if (pillMentions > 2) fail('lead-detail-title-row has too many lead-detail-pill mentions, found: ' + pillMentions);

const requiredStatuses = ['proposal_sent', 'new', 'waiting_response', 'qualification', 'lost'];
for (const status of requiredStatuses) {
  if (!text.includes("value: '" + status + "'")) fail('missing lead status option: ' + status);
}

const requiredLabels = ['Oferta wysłana', 'Nowy', 'Czeka na odpowiedź', 'Przegrany'];
for (const label of requiredLabels) {
  if (!text.includes(label)) fail('missing lead status label: ' + label);
}

const duplicatedLiteralStatus = /\{statusLabel\([^)]*lead[^)]*status[^)]*\)\}[\s\S]{0,260}\{statusLabel\([^)]*lead[^)]*status[^)]*\)\}/;
if (duplicatedLiteralStatus.test(titleRow)) fail('duplicate statusLabel renderers are still adjacent in title row');

console.log('OK stage77 lead detail single status pill');
`;

const testScript = String.raw`const assert = require('assert');
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
  for (const label of ['Oferta wysłana', 'Nowy', 'Czeka na odpowiedź', 'Przegrany']) {
    assert.ok(text.includes(label), 'missing label: ' + label);
  }
});

test('package scripts expose Stage77 guard and test', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage77-lead-detail-single-status-pill'], 'node scripts/check-stage77-lead-detail-single-status-pill.cjs');
  assert.equal(pkg.scripts['test:stage77-lead-detail-single-status-pill'], 'node --test tests/stage77-lead-detail-single-status-pill.test.cjs');
});
`;

let leadDetail = read(leadDetailPath);
leadDetail = ensureMarker(leadDetail);
const result = dedupeTitleRowStatus(leadDetail);
write(leadDetailPath, result.text);
write(checkPath, checkScript + '\n');
write(testPath, testScript + '\n');

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:stage77-lead-detail-single-status-pill'] = 'node scripts/check-stage77-lead-detail-single-status-pill.cjs';
pkg.scripts['test:stage77-lead-detail-single-status-pill'] = 'node --test tests/stage77-lead-detail-single-status-pill.test.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

if (fs.existsSync(quietPath)) {
  let quiet = read(quietPath);
  const testEntry = "  'tests/stage77-lead-detail-single-status-pill.test.cjs',";
  if (!quiet.includes("tests/stage77-lead-detail-single-status-pill.test.cjs")) {
    const start = quiet.indexOf('const requiredTests = [');
    if (start < 0) fail('cannot find requiredTests array in quiet release gate');
    const end = quiet.indexOf('];', start);
    if (end < 0) fail('cannot find end of requiredTests array in quiet release gate');
    quiet = quiet.slice(0, end) + testEntry + '\n' + quiet.slice(end);
    write(quietPath, quiet);
  }
}

console.log('OK: Stage77 lead detail single status pill patch applied. before=' + result.beforeCount + ' after=' + result.afterCount + ' changed=' + result.changed);
