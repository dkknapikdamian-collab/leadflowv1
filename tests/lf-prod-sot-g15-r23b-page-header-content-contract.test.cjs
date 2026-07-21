const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const componentPath = path.join(root, 'src/components/CloseFlowPageHeaderV2.tsx');
const contentPath = path.join(root, 'src/lib/page-header-content.ts');
const guardPath = path.join(root, 'scripts/check-g15-r23b-page-header-content-contract.cjs');

const component = fs.readFileSync(componentPath, 'utf8');
const content = fs.readFileSync(contentPath, 'utf8');

function occurrences(text, value) {
  return text.split(value).length - 1;
}

test('R23B focused guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23B/);
});

test('both leads maps contain the exact LEADY kicker once', () => {
  assert.equal(occurrences(component, "kicker: 'LEADY'"), 1);
  assert.equal(occurrences(content, "kicker: 'LEADY'"), 1);
  assert.match(component, /leads:\s*\{\s*kicker: 'LEADY',\s*title: 'Leady'/);
  assert.match(content, /leads:\s*\{\s*kicker: 'LEADY',\s*title: 'Leady'/);
});

test('the content type remains strict and the component still renders the kicker', () => {
  assert.match(content, /export type CloseFlowPageHeaderContent\s*=\s*\{[\s\S]*?kicker: string;/);
  assert.doesNotMatch(content, /kicker\s*\?:/);
  assert.match(component, /\{content\.kicker\}/);
});

test('R23B preserves the established leads title and description', () => {
  const description = 'Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.';
  for (const source of [component, content]) {
    assert.match(source, /title: 'Leady'/);
    assert.ok(source.includes(`description: '${description}'`));
  }
});

test('R23B keeps both typed maps and does not deduplicate their architecture', () => {
  assert.match(component, /const CLOSEFLOW_PAGE_HEADER_COPY: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent>/);
  assert.match(content, /export const PAGE_HEADER_CONTENT: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent>/);
});
