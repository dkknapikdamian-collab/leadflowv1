#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    results.push(['FAIL', rel, 'missing file']);
    return '';
  }
  const text = fs.readFileSync(full, 'utf8');
  results.push(['PASS', rel, 'file exists']);
  return text;
}
function pass(scope, msg) { results.push(['PASS', scope, msg]); }
function fail(scope, msg) { results.push(['FAIL', scope, msg]); }
function includes(scope, text, needle, msg) { text.includes(needle) ? pass(scope, msg) : fail(scope, `${msg} [missing ${JSON.stringify(needle)}]`); }
function notIncludes(scope, text, needle, msg) { !text.includes(needle) ? pass(scope, msg) : fail(scope, `${msg} [forbidden ${JSON.stringify(needle)}]`); }
function regex(scope, text, pattern, msg) { pattern.test(text) ? pass(scope, msg) : fail(scope, `${msg} [pattern ${pattern}]`); }

const clientDetailPath = 'src/pages/ClientDetail.tsx';
const packagePath = 'package.json';
const clientDetail = read(clientDetailPath);
const packageJson = read(packagePath);

includes(clientDetailPath, clientDetail, 'CLOSEFLOW_CLIENT_DETAIL_ID_ROUTE_HOTFIX_V1', 'hotfix marker exists');
regex(clientDetailPath, clientDetail, /const\s*\{\s*clientId\s*\}\s*=\s*useParams(?:<[^>]+>)?\(\)\s*;/, 'ClientDetail reads route param clientId');
regex(clientDetailPath, clientDetail, /const\s+id\s*=\s*clientId\s*;/, 'ClientDetail defines legacy id alias from clientId');
includes(clientDetailPath, clientDetail, 'fetchClientByIdFromSupabase', 'ClientDetail still reads client through Supabase helper');
notIncludes(clientDetailPath, clientDetail, 'const id = id;', 'No broken self alias');
notIncludes(clientDetailPath, clientDetail, 'fetchClientByIdFromSupabase(undefined', 'No undefined client fetch literal');
includes(packagePath, packageJson, 'check:client-detail-id-route-hotfix', 'package script wired');
includes(packagePath, packageJson, 'scripts/check-client-detail-id-route-hotfix.cjs', 'package script points to guard');

for (const [level, scope, msg] of results) console.log(`${level} ${scope}: ${msg}`);
const failed = results.filter(([level]) => level === 'FAIL');
console.log(`\nSummary: ${results.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) {
  console.error('\nFAIL CLIENT_DETAIL_ID_ROUTE_HOTFIX_FAILED');
  process.exit(1);
}
console.log('\nCLIENT_DETAIL_ID_ROUTE_HOTFIX_OK');
