'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const ROOT = process.cwd();
const appPath = path.join(ROOT, 'src/App.tsx');

function normalizeRoute(route) {
  return String(route || '').replace(/:\w+/g, ':id');
}

function extractRoutePaths(source) {
  const out = [];
  const re = /<Route\s+[^>]*path="([^"]+)"/g;
  let match;
  while ((match = re.exec(source))) out.push(match[1]);
  return out;
}

test('release candidate route smoke contract covers primary app routes', () => {
  assert.ok(fs.existsSync(appPath), 'src/App.tsx must exist');
  const source = fs.readFileSync(appPath, 'utf8');
  const routes = extractRoutePaths(source);
  const normalized = new Set(routes.map(normalizeRoute));
  const required = [
    '/',
    '/login',
    '/today',
    '/leads',
    '/leads/:id',
    '/clients',
    '/clients/:id',
    '/cases',
    '/cases/:id',
    '/tasks',
    '/calendar',
    '/activity',
    '/billing',
    '/settings',
    '/templates',
    '/ai-drafts',
    '/support'
  ];
  const missing = required.filter((route) => !normalized.has(route));
  assert.deepEqual(missing, [], `missing routes: ${missing.join(', ')}`);
  for (const marker of ['Today', 'Leads', 'LeadDetail', 'Clients', 'ClientDetail', 'Cases', 'CaseDetail', 'Tasks', 'Calendar', 'Activity', 'Billing', 'Settings', 'Templates', 'AiDrafts', 'SupportCenter']) {
    assert.ok(source.includes(marker), `App route wiring should include ${marker}`);
  }
});
