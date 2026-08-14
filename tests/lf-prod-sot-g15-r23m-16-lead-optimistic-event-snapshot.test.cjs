const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-16-lead-optimistic-event-snapshot.cjs';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function handler(source) {
  const start = source.indexOf('const handleDeleteLinkedEvent = async');
  const end = source.indexOf('\n\n  const handleSaveLinkedTaskEdit', start);
  return source.slice(start, end);
}

test('A2-16 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-16/);
});

test('A2-16 declares the snapshot before try and restores it in catch', () => {
  const source = handler(read(sourcePath));
  const snapshot = source.indexOf('const optimisticEventSnapshot = linkedEvents;');
  assert.ok(snapshot >= 0);
  assert.ok(snapshot < source.indexOf('try {'));
  assert.ok(source.indexOf('setLinkedEvents(optimisticEventSnapshot);') > source.indexOf('} catch'));
});

test('A2-16 preserves optimistic removal, backend delete and silent refresh', () => {
  const source = handler(read(sourcePath));
  assert.match(source, /setLinkedEvents\(\(previous\) => previous\.filter/);
  assert.match(source, /await deleteEventFromSupabase\(eventId\);/);
  assert.match(source, /await loadLead\(\{ silent: true \}\);/);
});
