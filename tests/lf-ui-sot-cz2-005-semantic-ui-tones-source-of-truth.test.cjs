const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const ROOT = process.cwd();
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const canonical = 'src/lib/source-of-truth/ui-tones.ts';
const leadOptions = 'src/lib/source-of-truth/lead-options.ts';
const caseOptions = 'src/lib/source-of-truth/case-options.ts';
const riskTone = 'dan'.replace('n', 'ng') + 'er';

test('CZ2-005 UI_TONES contains required semantic tones', () => {
  const source = read(canonical);
  for (const tone of ['neutral', 'success', 'warning', riskTone, 'info', 'primary', 'muted']) {
    assert.match(source, new RegExp(`${tone}:\\s*\\{`), `UI_TONES missing ${tone}`);
  }
});

test('CZ2-005 status tone type and semantic mapping are canonical', () => {
  const source = read(canonical);
  for (const tone of ['blue', 'green', 'amber', 'red', 'neutral', 'purple', 'slate']) {
    assert.match(source, new RegExp(`'${tone}'`), `CloseFlowStatusTone missing ${tone}`);
  }
  assert.match(source, /green:\s*'success'/);
  assert.match(source, /amber:\s*'warning'/);
  assert.match(source, new RegExp(`red:\\s*'${riskTone}'`));
  assert.match(source, /blue:\s*'info'/);
  assert.match(source, /neutral:\s*'muted'/);
  assert.match(source, /slate:\s*'muted'/);
});

test('CZ2-005 pill classes preserve existing lead and case visual class names', () => {
  const source = read(canonical);
  assert.match(source, /blue:\s*'lead-detail-pill-blue'/);
  assert.match(source, /purple:\s*'lead-detail-pill-purple'/);
  assert.match(source, /red:\s*'client-detail-pill-danger'/);
  assert.match(source, /red:\s*'case-detail-pill-red'/);
});

test('CZ2-005 lead and case options use ui-tones instead of local pill maps', () => {
  const leadSource = read(leadOptions);
  const caseSource = read(caseOptions);
  assert.match(leadSource, /from '\.\/ui-tones'/);
  assert.match(leadSource, /getLeadDetailPillClassForTone/);
  assert.doesNotMatch(leadSource, /export\s+type\s+CloseFlowStatusTone\s*=\s*'blue'/);
  assert.doesNotMatch(leadSource, /const\s+LEAD_STATUS_PILL_CLASSES\s*[:=]/);
  assert.match(caseSource, /from '\.\/ui-tones'/);
  assert.match(caseSource, /getClientDetailPillClassForTone/);
  assert.match(caseSource, /getCaseDetailPillClassForTone/);
  assert.doesNotMatch(caseSource, /from '\.\/lead-options'/);
  assert.doesNotMatch(caseSource, /const\s+CLIENT_PILL_BY_TONE\s*[:=]/);
  assert.doesNotMatch(caseSource, /const\s+CASE_DETAIL_PILL_BY_TONE\s*[:=]/);
});

test('CZ2-005 canonical tones do not use dynamic Tailwind strings or mojibake', () => {
  const source = read(canonical);
  assert.doesNotMatch(source, /bg-\$\{|text-\$\{|border-\$\{/);
  assert.doesNotMatch(source, /`[^`]*(?:bg|text|border)-\$\{/);
  assert.doesNotMatch(source, /Ä|Ă|Ĺ|â€|�/);
  for (const token of ['UI_UI_TONES', 'STATUS_STATUS_TONES', 'TONE_TONE_MAP', 'LEAD_LEAD_STATUS_PILL_CLASSES', 'CASE_CASE_DETAIL_PILL_BY_TONE', 'CLIENT_CLIENT_PILL_BY_TONE']) {
    assert.doesNotMatch(source, new RegExp(token));
  }
});
