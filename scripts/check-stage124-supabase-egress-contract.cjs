#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p), 'utf8') : '';
const fail = (msg) => { console.error(`✖ ${msg}`); process.exitCode = 1; };
const ok = (msg) => console.log(`✔ ${msg}`);

const files = {
  leads: read('api/leads.ts'),
  clients: read('api/clients.ts'),
  cases: read('api/cases.ts'),
  tasks: read('api/tasks.ts'),
  events: read('api/events.ts'),
  fallback: read('src/lib/supabase-fallback.ts'),
  packageJson: read('package.json'),
};

if (!files.leads) fail('missing api/leads.ts');
if (!files.clients) fail('missing api/clients.ts');
if (!files.cases) fail('missing api/cases.ts');
if (!files.fallback) fail('missing src/lib/supabase-fallback.ts');

const heavyPatterns = [
  ['api/leads.ts', files.leads, /leads\?select=\*[^`'\"]*limit=\$\{leadLimit\}|leads\?select=\*[^`'\"]*limit=300/],
  ['api/clients.ts', files.clients, /clients\?select=\*[^`'\"]*limit=\$\{requestedId \? 1 : 300\}|clients\?select=\*[^`'\"]*limit=300/],
  ['api/cases.ts', files.cases, /cases\?select=\*[^`'\"]*limit=\$\{caseLimit\}|cases\?select=\*[^`'\"]*limit=250/],
  ['api/tasks.ts', files.tasks, /work_items\?select=\*[^`'\"]*limit=200/],
  ['api/events.ts', files.events, /work_items\?select=\*[^`'\"]*limit=200/],
];

for (const [file, text, pattern] of heavyPatterns) {
  if (!text) continue;
  if (pattern.test(text)) fail(`${file} still contains heavy list select=* pattern`);
}

const required = [
  ['api/leads.ts', files.leads, 'LEAD_LIST_SELECT_STAGE124'],
  ['api/clients.ts', files.clients, 'CLIENT_LIST_SELECT_STAGE124'],
  ['api/cases.ts', files.cases, 'CASE_LIST_SELECT_STAGE124'],
  ['src/lib/supabase-fallback.ts', files.fallback, 'API_GET_CACHE_TTL_MS = 30_000'],
  ['package.json', files.packageJson, 'check:stage124-supabase-egress-contract'],
];

for (const [file, text, marker] of required) {
  if (!text.includes(marker)) fail(`${file} missing ${marker}`);
}

for (const [file, text] of [['api/leads.ts', files.leads], ['api/clients.ts', files.clients], ['api/cases.ts', files.cases]]) {
  if (!text.includes('DETAIL_SELECT_STAGE124')) fail(`${file} missing detail/list split marker`);
}

if (files.tasks && files.tasks.includes('work_items?select=') && !files.tasks.includes('TASK_LIST_SELECT_STAGE124')) fail('api/tasks.ts missing TASK_LIST_SELECT_STAGE124');
if (files.events && files.events.includes('work_items?select=') && !files.events.includes('EVENT_LIST_SELECT_STAGE124')) fail('api/events.ts missing EVENT_LIST_SELECT_STAGE124');

if (process.exitCode) {
  console.error('Stage124A Supabase egress guard failed. Do not push.');
  process.exit(process.exitCode);
}

ok('Stage124A Supabase egress API list DTO contract holds');
