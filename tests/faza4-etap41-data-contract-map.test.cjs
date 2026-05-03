const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

nodeTest('Faza 4 Etap 4.1 runtime map covers core entities and aliases', () => {
  const dataContract = read('src/lib/data-contract.ts');

  assert.match(dataContract, /export const DATA_CONTRACT_FIELD_MAP/);
  for (const entity of ['leads', 'clients', 'cases', 'tasks', 'events', 'ai_drafts', 'activities', 'workspaces']) {
    assert.match(dataContract, new RegExp('\\b' + entity + '\\s*:\\s*\\{'));
  }

  for (const alias of ['workspace_id', 'client_id', 'lead_id', 'case_id', 'scheduled_at', 'due_at', 'start_at', 'end_at', 'raw_text', 'parsed_draft', 'actor_type', 'event_type', 'plan_id']) {
    assert.match(dataContract, new RegExp(alias));
  }
});

nodeTest('Faza 4 Etap 4.1 adds Workspace DTO and normalizer', () => {
  const dataContract = read('src/lib/data-contract.ts');

  assert.match(dataContract, /export type WorkspaceDto/);
  assert.match(dataContract, /export function normalizeWorkspaceContract/);
  assert.match(dataContract, /export function normalizeWorkspaceListContract/);
  assert.match(dataContract, /ownerId: pickOptionalText\(row, \['ownerId', 'owner_id', 'userId', 'user_id'\]\)/);
  assert.match(dataContract, /planId: pickText\(row, \['planId', 'plan_id', 'plan'\], 'free'\)/);
});

nodeTest('Faza 4 Etap 4.1 docs, package and quiet release gate are wired', () => {
  const releaseDoc = read('docs/release/FAZA4_ETAP41_DATA_CONTRACT_MAP_2026-05-03.md');
  const technicalDoc = read('docs/technical/DATA_CONTRACT_MAP_2026-05-03.md');
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(releaseDoc, /FAZA 4 - Etap 4\.1 - Data contract map/);
  assert.match(technicalDoc, /DATA CONTRACT MAP 2026-05-03/);
  assert.equal(pkg.scripts['check:faza4-etap41-data-contract-map'], 'node scripts/check-faza4-etap41-data-contract-map.cjs');
  assert.equal(pkg.scripts['test:faza4-etap41-data-contract-map'], 'node --test tests/faza4-etap41-data-contract-map.test.cjs');
  assert.match(quiet, /tests\/faza4-etap41-data-contract-map\.test\.cjs/);
});
