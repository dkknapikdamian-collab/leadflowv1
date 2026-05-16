const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(process.cwd(), rel));
}

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};

assert(exists('scripts/print-release-evidence.cjs'), 'Etap 0.1 missing scripts/print-release-evidence.cjs');
assert(Boolean(scripts['audit:release-evidence']), 'Etap 0.1 missing npm script audit:release-evidence');
assert(String(scripts['audit:release-evidence']).includes('RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md'), 'audit:release-evidence must write the exact Etap 0.1 evidence filename');
assert(Boolean(scripts['check:faza0-release-governance']), 'missing check:faza0-release-governance script');

assert(exists('docs/release/RELEASE_GOVERNANCE_STAGE_INDEX_2026-05-03.md'), 'missing FAZA 0 stage index');
assert(exists('docs/release/CLOSEFLOW_PUBLIC_SOURCE_MAP_2026-05-02.md'), 'Etap 0.2 missing public source map');

const stageIndex = read('docs/release/RELEASE_GOVERNANCE_STAGE_INDEX_2026-05-03.md');
const sourceMap = read('docs/release/CLOSEFLOW_PUBLIC_SOURCE_MAP_2026-05-02.md');

assert(stageIndex.includes('FAZA 0 \u2014 Release governance i jedno \u017Ar\u00F3d\u0142o prawdy'), 'stage index missing exact FAZA 0 name');
assert(stageIndex.includes('Etap 0.1 \u2014 Release Candidate Evidence Gate'), 'stage index missing exact Etap 0.1 name');
assert(stageIndex.includes('Etap 0.2 \u2014 Mapa domen / deployment\u00F3w / publicznych \u017Ar\u00F3de\u0142'), 'stage index missing exact Etap 0.2 name');
assert(stageIndex.includes('FAZA 1 \u2014 UI truth, copy truth, legal truth'), 'stage index missing next FAZA 1 name');

assert(sourceMap.includes('FAZA 0 \u2014 Etap 0.2 \u2014 Mapa domen / deployment\u00F3w / publicznych \u017Ar\u00F3de\u0142'), 'source map missing exact Etap 0.2 title');
assert(sourceMap.includes('github.com/dkknapikdamian-collab/leadflowv1'), 'source map missing repo source of truth');
assert(sourceMap.includes('dev-rollout-freeze'), 'source map missing branch source of truth');
assert(sourceMap.includes('closeflow.studio'), 'source map must classify closeflow.studio');
assert(sourceMap.includes('getcloseflow.com'), 'source map must classify getcloseflow.com');
assert(sourceMap.includes('RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md'), 'source map must point auditors to evidence gate');

console.log('PASS FAZA 0 release governance naming and Etap 0.2 public source map');
