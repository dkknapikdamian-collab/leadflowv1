#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function exists(file) {
  return fs.existsSync(path.join(root, file));
}
function expect(condition, message) {
  if (!condition) fail.push(message);
}

for (const file of ['api/daily-digest.ts', 'api/weekly-report.ts', 'api/response-templates.ts']) {
  expect(!exists(file), `${file} must not exist as a separate Vercel function`);
}

const system = read('api/system.ts');
expect(system.includes('responseTemplatesHandler'), 'api/system.ts must keep response templates handler');
expect(system.includes('dailyDigestHandler'), 'api/system.ts must keep daily digest handler');
expect(system.includes('weeklyReportHandler'), 'api/system.ts must import/use weekly report handler');
expect(system.includes('weekly-report'), 'api/system.ts must route weekly-report kind');
expect(system.includes('daily-digest'), 'api/system.ts must route daily-digest kind');
expect(system.includes('response-templates'), 'api/system.ts must route response-templates kind');

const vercel = JSON.parse(read('vercel.json'));
const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
function hasRewrite(source, destinationPart) {
  return rewrites.some((item) => item && item.source === source && String(item.destination || '').includes(destinationPart));
}
expect(hasRewrite('/api/daily-digest', '/api/system?kind=daily-digest'), 'vercel.json must rewrite /api/daily-digest to api/system');
expect(hasRewrite('/api/weekly-report', '/api/system?kind=weekly-report'), 'vercel.json must rewrite /api/weekly-report to api/system');
expect(hasRewrite('/api/response-templates', '/api/system?kind=response-templates'), 'vercel.json must rewrite /api/response-templates to api/system');

const crons = Array.isArray(vercel.crons) ? vercel.crons : [];
expect(crons.some((item) => item.path === '/api/daily-digest'), 'daily digest cron must stay');
expect(crons.some((item) => item.path === '/api/weekly-report'), 'weekly report cron must stay');

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a29f-vercel-deploy-hotfix'], 'package.json missing check:a29f-vercel-deploy-hotfix');

if (fail.length) {
  console.error('A29F Vercel deploy hotfix guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: A29F Vercel deploy hotfix guard passed.');
