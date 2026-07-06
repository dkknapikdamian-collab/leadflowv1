const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const contractPath = path.join(root, 'src/lib/source-of-truth/today-work-item-status.ts');
const guardPath = path.join(root, 'scripts/guards/verify-lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.cjs');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('R10 guard passes', () => {
  execFileSync(process.execPath, [guardPath], { cwd: root, stdio: 'pipe' });
});

test('R10 contract documents required Today work-item label and tone parity', () => {
  const source = read(contractPath);

  for (const label of [
    'Zrobione',
    'Zaległe',
    'Dziś',
    'Zaplanowane zadanie',
    'Zaplanowane wydarzenie',
  ]) {
    assert.match(source, new RegExp(label), `missing label parity token: ${label}`);
  }

  for (const tone of ["'success'", "'danger'", "'neutral'"]) {
    assert.ok(source.includes(tone), `missing tone parity token: ${tone}`);
  }

  assert.ok(source.includes('isTodayWorkItemClosed(status)'), 'closed status branch must own success parity');
  assert.ok(source.includes('isTodayWorkItemOverdue(momentRaw, status, todayKey)'), 'overdue branch must own danger parity');
  assert.ok(source.includes("kind === 'task'"), 'task/event split must stay explicit');
});
