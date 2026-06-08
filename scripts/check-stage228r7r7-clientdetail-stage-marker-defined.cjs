const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R7R7_CLIENTDETAIL_STAGE_MARKER_DEFINED_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function requireOrder(text, first, second, label) {
  const firstIndex = text.indexOf(first);
  const secondIndex = text.indexOf(second);
  if (firstIndex === -1 || secondIndex === -1 || firstIndex > secondIndex) {
    fail(label + ' order invalid: ' + first + ' must appear before ' + second);
  }
}

function findVoidMarkersWithoutConst(text) {
  const voidMatches = [...text.matchAll(/\bvoid\s+([A-Z0-9_]+)\s*;/g)].map((match) => match[1]);
  const failures = [];

  for (const name of voidMatches) {
    const before = text.slice(0, text.indexOf('void ' + name + ';'));
    const hasConstBefore = new RegExp('const\\s+' + name + '\\s*=').test(before);
    // Some imported identifiers may be voided rarely; this guard intentionally targets STAGE/CLOSEFLOW/CLIENT markers.
    const isStageMarker = /^(STAGE|CLOSEFLOW|CLIENT|FIN|A16|VS)/.test(name);
    if (isStageMarker && !hasConstBefore) failures.push(name);
  }

  return [...new Set(failures)];
}

const clientDetail = read('src/pages/ClientDetail.tsx');
const pkg = JSON.parse(read('package.json'));

const constToken = "const STAGE220A35_R2_BUILD_GUARD_COMPATIBILITY_FIX = 'Stage220A35 R2 compatibility marker must be defined before void to avoid runtime ReferenceError';";
const voidToken = 'void STAGE220A35_R2_BUILD_GUARD_COMPATIBILITY_FIX;';

[
  constToken,
  voidToken,
  'STAGE228R7_R7_CLIENTDETAIL_UNDEFINED_STAGE_MARKER_HOTFIX',
].forEach((token) => requireText(clientDetail, token, 'ClientDetail marker definition'));

requireOrder(clientDetail, constToken, voidToken, 'ClientDetail STAGE220A35_R2 marker');

const undefinedMarkers = findVoidMarkersWithoutConst(clientDetail);
if (undefinedMarkers.length) {
  fail('ClientDetail has void markers without previous const declaration: ' + undefinedMarkers.join(', '));
}

if (pkg.scripts['check:stage228r7r7-clientdetail-stage-marker-defined'] !== 'node scripts/check-stage228r7r7-clientdetail-stage-marker-defined.cjs') {
  fail('package.json missing check:stage228r7r7-clientdetail-stage-marker-defined script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r7r7-clientdetail-stage-marker-defined.cjs')) {
  fail('package.json prebuild missing Stage228R7R7 marker guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R7_R7_CLIENTDETAIL_UNDEFINED_STAGE_MARKER_HOTFIX',
  contract: 'ClientDetail stage markers are declared before void usage'
}, null, 2));
