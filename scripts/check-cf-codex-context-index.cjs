const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const read = (p) => fs.readFileSync(path.join(repo, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(repo, p));

const failures = [];
function assert(condition, message) {
  if (!condition) failures.push(message);
}
function pass(message) {
  console.log(`PASS ${message}`);
}

const indexPath = '_project/CODEX_CONTEXT_INDEX.md';
assert(exists(indexPath), 'missing _project/CODEX_CONTEXT_INDEX.md');
const index = exists(indexPath) ? read(indexPath) : '';

assert(index.includes('CloseFlow / LeadFlow'), 'index must identify CloseFlow / LeadFlow');
assert(index.includes('dkknapikdamian-collab/leadflowv1'), 'index must identify repo');
assert(index.includes('dev-rollout-freeze'), 'index must identify dev-rollout-freeze branch');
assert(index.includes('10_PROJEKTY/CloseFlow_Lead_App'), 'index must identify Obsidian folder');
assert(index.includes('STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH'), 'index must preserve canonical next stage pointer');
assert(index.includes('READ_CODEX_CONTEXT_INDEX_FIRST'), 'index must include read-first token');
assert(index.includes('NO_RUNTIME_UI_MUTATION_FOR_CONTEXT_INDEX_STAGE'), 'index must block runtime UI mutation for this stage');
assert(index.includes('NO_SQL_SUPABASE_OR_UI_CHANGE'), 'index must block SQL/Supabase/UI changes for this stage');
assert(index.includes('NO_GIT_ADD_DOT'), 'index must preserve git add dot ban');
assert(index.includes('GUARDS_AND_DIFFCHECK_REQUIRED'), 'index must require guards and diffcheck');
assert(index.includes('node_modules/') && index.includes('.vercel/') && index.includes('the whole Obsidian vault'), 'index must list excluded broad scans');
if (failures.length === 0) pass('CloseFlow CODEX context index exists and routes bounded project memory');

const helperPath = 'scripts/codex-context-pack.ps1';
assert(exists(helperPath), 'missing scripts/codex-context-pack.ps1');
const helper = exists(helperPath) ? read(helperPath) : '';
assert(helper.includes('$Files = @('), 'context pack helper must use exact $Files list');
assert(helper.includes('closeflow-context-pack.md'), 'context pack helper must write CloseFlow-specific pack');
assert(!/Get-ChildItem\s+.*-Recurse/i.test(helper), 'context pack helper must not recurse');
assert(!/00_OBSIDIAN_VAULT/i.test(helper), 'context pack helper must not read vault directly');
assert(helper.includes('_project/04_ETAPY_ROZWOJU_APLIKACJI.md'), 'helper must include canonical stage queue');
assert(helper.includes('_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md'), 'helper must include found-problems ledger');
if (failures.length === 0) pass('context pack helper is exact-list based and does not recurse repo or vault');

const agents = exists('AGENTS.md') ? read('AGENTS.md') : '';
assert(agents.includes('CF-CODEX-CONTEXT-INDEX-004'), 'AGENTS.md must contain CF context routing marker');
assert(agents.includes('_project/CODEX_CONTEXT_INDEX.md'), 'AGENTS.md must point operators to CODEX_CONTEXT_INDEX first');
if (failures.length === 0) pass('AGENTS.md points operators to CODEX_CONTEXT_INDEX first');

const guardLedger = exists('_project/06_GUARDS_AND_TESTS.md') ? read('_project/06_GUARDS_AND_TESTS.md') : '';
const changelog = exists('_project/08_CHANGELOG_AI.md') ? read('_project/08_CHANGELOG_AI.md') : '';
const testHistory = exists('_project/13_TEST_HISTORY.md') ? read('_project/13_TEST_HISTORY.md') : '';
const currentStage = exists('_project/03_CURRENT_STAGE.md') ? read('_project/03_CURRENT_STAGE.md') : '';
assert(guardLedger.includes('CF-CODEX-CONTEXT-INDEX-004'), 'guards ledger must record CF context index stage');
assert(changelog.includes('CF-CODEX-CONTEXT-INDEX-004'), 'changelog must record CF context index stage');
assert(testHistory.includes('CF-CODEX-CONTEXT-INDEX-004'), 'test history must record CF context index guard result');
assert(currentStage.includes('CF-CODEX-CONTEXT-INDEX-004'), 'current stage file must record CF context index stage');
if (failures.length === 0) pass('CloseFlow ledgers record CF Codex context index stage');

if (failures.length > 0) {
  console.error('FAIL CF Codex context index guard');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PASS CloseFlow Codex context index contract is valid');
