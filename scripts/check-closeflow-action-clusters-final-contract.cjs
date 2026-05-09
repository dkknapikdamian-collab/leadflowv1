const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredFiles = [
  'src/components/ui-system/ActionCluster.tsx',
  'src/components/entity-actions.tsx',
  'src/styles/closeflow-action-clusters.css',
  'docs/ui/CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_2026-05-09.md',
  'docs/ui/closeflow-action-clusters-final-contract.generated.json',
];
for (const file of requiredFiles) assert(exists(file), `Missing required file: ${file}`);

const actionCluster = read('src/components/ui-system/ActionCluster.tsx');
const entityActions = read('src/components/entity-actions.tsx');
const css = read('src/styles/closeflow-action-clusters.css');
const pkg = JSON.parse(read('package.json'));
const doc = read('docs/ui/CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_2026-05-09.md');
const json = JSON.parse(read('docs/ui/closeflow-action-clusters-final-contract.generated.json'));

assert(actionCluster.includes('CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6'), 'ActionCluster missing VS-6 marker');
assert(actionCluster.includes('data-cf-ui-component="ActionCluster"'), 'ActionCluster missing ui-system component marker');
assert(actionCluster.includes('data-standard-action-cluster="true"'), 'ActionCluster missing standard action cluster marker');
assert(actionCluster.includes('data-cf-action-cluster-contract="VS6"'), 'ActionCluster missing VS6 data contract marker');
assert(actionCluster.includes("density?: 'default' | 'compact'"), 'ActionCluster missing density contract');

assert(entityActions.includes('CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6'), 'entity-actions missing VS-6 contract object');
assert((entityActions.match(/data-standard-action-cluster="true"/g) || []).length >= 4, 'entity-actions wrappers missing standard markers');
assert(entityActions.includes('data-cf-action-cluster-contract="VS6"'), 'entity-actions missing VS6 data marker');

for (const needle of ['owner:', 'reason:', 'scope:', 'remove_after_stage:']) {
  assert(css.includes(needle), `CSS contract missing metadata: ${needle}`);
}
for (const cls of ['cf-entity-action-cluster', 'cf-panel-header-actions', 'cf-panel-action-row', 'cf-danger-action-zone']) {
  assert(css.includes(cls), `CSS missing action cluster class: ${cls}`);
}
assert(css.includes('CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6_START'), 'CSS missing VS-6 start marker');
assert(css.includes('CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6_END'), 'CSS missing VS-6 end marker');

assert(pkg.scripts['audit:closeflow-action-clusters-final-contract'], 'package missing audit script');
assert(pkg.scripts['check:closeflow-action-clusters-final-contract'], 'package missing check script');
assert(pkg.scripts['check:closeflow-metric-tiles-real-parity-repair'], 'package missing VS-5R metric tile check, do not regress task/notification tiles');

assert(doc.includes('CLOSEFLOW ACTION CLUSTERS FINAL CONTRACT'), 'doc missing title');
assert(json.stage === 'VS-6', 'generated JSON has wrong stage');
assert(json.migrationPolicy && json.migrationPolicy.massLegacyPageMigration === false, 'generated JSON must document no mass legacy migration');

console.log('CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6_CHECK_OK');
console.log('standard_action_cluster_markers=' + (entityActions.match(/data-standard-action-cluster="true"/g) || []).length);
console.log('migration=component_css_contract_no_mass_legacy_page_regex');
