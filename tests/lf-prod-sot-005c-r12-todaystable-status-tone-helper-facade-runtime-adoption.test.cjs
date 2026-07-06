const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const todayPath = path.join(root, 'src/pages/TodayStable.tsx');
const guardPath = path.join(root, 'scripts/guards/verify-lf-prod-sot-005c-r12-todaystable-status-tone-helper-facade-runtime-adoption.cjs');

test('R12 guard passes', () => {
  execFileSync(process.execPath, [guardPath], { cwd: root, stdio: 'pipe' });
});

test('TodayStable delegates status helpers to the facade', () => {
  const today = fs.readFileSync(todayPath, 'utf8');

  assert.ok(today.includes('return isSotTodayWorkItemClosed(value);'));
  assert.ok(today.includes('return isSotTodayWorkItemOverdue(momentRaw, status, todayKey);'));
  assert.ok(today.includes('return getSotTodayWorkItemStatusLabel(kind, status, momentRaw, todayKey);'));
  assert.ok(today.includes("return getSotTodayWorkItemStatusTone('task', status, momentRaw, todayKey);"));
});