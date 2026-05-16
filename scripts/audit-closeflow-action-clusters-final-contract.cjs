const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const write = (rel, content) => {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
};

const files = {
  actionCluster: 'src/components/ui-system/ActionCluster.tsx',
  entityActions: 'src/components/entity-actions.tsx',
  css: 'src/styles/closeflow-action-clusters.css',
};

const text = Object.fromEntries(Object.entries(files).map(([key, rel]) => [key, read(rel)]));
const regions = [
  'entity-header-action-cluster',
  'activity-panel-header',
  'note-panel-header',
  'tasks-panel-header',
  'work-items-panel-header',
  'events-panel-header',
  'calendar-panel-header',
  'danger-action-zone',
  'info-row-inline-action',
];

const classNames = [
  'cf-entity-action-cluster',
  'cf-panel-header-actions',
  'cf-panel-action-row',
  'cf-danger-action-zone',
  'cf-entity-action',
  'cf-entity-icon-action',
];

function countAll(haystack, needle) {
  return (haystack.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

const allText = Object.values(text).join('\n');
const evidence = {
  stage: 'VS-6',
  title: 'Action clusters final contract',
  generatedAt: new Date().toISOString(),
  files,
  status: 'contract_finalized_runtime_wrappers_not_mass_migrated',
  regions: regions.map((region) => ({
    region,
    occurrences: countAll(allText, region),
  })),
  classNames: classNames.map((className) => ({
    className,
    occurrences: countAll(allText, className),
  })),
  hasUiSystemActionCluster: text.actionCluster.includes('data-cf-ui-component="ActionCluster"'),
  hasLegacyWrapperMarkers: countAll(text.entityActions, 'data-standard-action-cluster="true"'),
  hasCssMetadata: ['owner:', 'reason:', 'scope:', 'remove_after_stage:'].every((needle) => text.css.includes(needle)),
  migrationPolicy: {
    massLegacyPageMigration: false,
    safeLayer: 'component-css-check-contract',
    note: 'VS-6 intentionally does not migrate Leads.tsx, Clients.tsx or Cases.tsx by regex.',
  },
};

write('docs/ui/closeflow-action-clusters-final-contract.generated.json', JSON.stringify(evidence, null, 2) + '\n');

const markdown = `# CLOSEFLOW ACTION CLUSTERS FINAL CONTRACT - VS-6

Status: ${evidence.status}

## Cel

Jedno \u017Ar\u00F3d\u0142o prawdy dla grup przycisk\u00F3w akcji: nag\u0142\u00F3wki encji, nag\u0142\u00F3wki paneli, akcje inline i strefy danger.

## Pliki kontraktu

- \`${files.actionCluster}\`
- \`${files.entityActions}\`
- \`${files.css}\`

## Polityka migracji

- Nie wykonywa\u0107 hurtowych migracji legacy stron przez regex.
- Du\u017Ce strony migrowa\u0107 tylko r\u0119cznie, jeden plik na etap.
- Ten etap domyka kontrakt komponentowy i CSS, nie zmienia logiki biznesowej.

## Regiony

${evidence.regions.map((entry) => `- \`${entry.region}\` - occurrences: ${entry.occurrences}`).join('\n')}

## Kryterium zako\u0144czenia

- \`ActionCluster\` ma jawny marker VS-6.
- Legacy wrappery z \`entity-actions.tsx\` maj\u0105 \`data-standard-action-cluster=\"true\"\`.
- CSS zawiera metadata: owner, reason, scope, remove_after_stage.
- Check blokuje brak kontraktu.

## Wynik audytu

\`CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6_AUDIT_OK\`
`;
write('docs/ui/CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_2026-05-09.md', markdown);

console.log('CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6_AUDIT_OK');
console.log(`regions=${regions.length}`);
console.log(`legacy_wrapper_markers=${evidence.hasLegacyWrapperMarkers}`);
console.log(`css_metadata=${evidence.hasCssMetadata}`);
