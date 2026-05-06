'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const ROOT = process.cwd();
const file = path.join(ROOT, 'docs/release/BUTTON_ACTION_MAP_2026-05-06.json');

test('button action map has release-candidate coverage for primary actions', () => {
  assert.ok(fs.existsSync(file), 'BUTTON_ACTION_MAP_2026-05-06.json must exist');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(data.manualQaRequired, true);
  assert.ok(Array.isArray(data.buttons));
  assert.ok(data.buttons.length >= 20, 'expected at least 20 mapped primary buttons/actions');
  const requiredFields = ['route', 'text', 'component', 'action', 'write', 'accessGate', 'toast', 'loading', 'error', 'status'];
  for (const [index, entry] of data.buttons.entries()) {
    for (const field of requiredFields) {
      assert.ok(String(entry[field] ?? '').trim(), `button[${index}] missing ${field}`);
    }
  }
  const routes = new Set(data.buttons.map((entry) => entry.route));
  for (const route of ['/', '/today', '/leads', '/clients', '/cases', '/tasks', '/calendar', '/activity', '/billing', '/settings', '/templates', '/ai-drafts', '/support']) {
    assert.ok(routes.has(route), `missing route in action map: ${route}`);
  }
});
