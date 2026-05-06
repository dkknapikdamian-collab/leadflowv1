#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const file = path.join(ROOT, 'docs/release/BUTTON_ACTION_MAP_2026-05-06.json');
const requiredFields = ['route', 'text', 'component', 'action', 'write', 'accessGate', 'toast', 'loading', 'error', 'status'];
const requiredRoutes = ['/', '/today', '/leads', '/leads/:id', '/clients', '/clients/:id', '/cases', '/cases/:id', '/tasks', '/calendar', '/activity', '/billing', '/settings', '/templates', '/ai-drafts', '/support'];
const allowedStatuses = new Set(['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu']);

function fail(items) {
  console.error('Button action map guard failed.');
  for (const item of items) console.error(`- ${item}`);
  process.exit(1);
}

if (!fs.existsSync(file)) fail([`missing ${path.relative(ROOT, file)}`]);
let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  fail([`invalid JSON: ${error.message}`]);
}
const entries = Array.isArray(data?.buttons) ? data.buttons : [];
const errors = [];
if (!entries.length) errors.push('buttons array is empty');
entries.forEach((entry, index) => {
  for (const field of requiredFields) {
    const value = entry[field];
    if (value === undefined || value === null || String(value).trim() === '') errors.push(`button[${index}] missing ${field}`);
  }
  if (entry.status && !allowedStatuses.has(entry.status)) errors.push(`button[${index}] has invalid status ${entry.status}`);
  if (String(entry.action || '').match(/TODO|placeholder|stub/i)) errors.push(`button[${index}] has placeholder action`);
});
for (const route of requiredRoutes) {
  if (!entries.some((entry) => entry.route === route)) errors.push(`missing route coverage: ${route}`);
}
if (!data?.manualQaRequired) errors.push('manualQaRequired must be true');
if (!String(data?.releaseCandidate || '').includes('2026-05-06')) errors.push('releaseCandidate date marker missing');
if (errors.length) fail(errors);
console.log('OK: button action map guard passed.');
