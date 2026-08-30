const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const clientsPath = path.join(root, 'src/pages/Clients.tsx');
const clients = fs.readFileSync(clientsPath, 'utf8');

const forbiddenScopeFiles = [
  'src/pages/TodayStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
];

const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

function includes(text) {
  return clients.includes(text);
}

check(
  includes("import { isActiveClientCase } from '../lib/client-cases';"),
  'Clients must use shared client-case activity truth',
);
check(
  includes('STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH'),
  'Clients must keep the STAGE232C relation tile marker',
);
check(
  includes('type ClientRelationFilterStage232C ='),
  'Clients must define explicit STAGE232C relation filter type',
);
check(
  includes('clientRelationFilterStage232C'),
  'Clients must keep one explicit relation filter state',
);
check(
  includes('applyClientRelationFilterStage232C'),
  'Clients must use one shared relation filter handler',
);
check(
  /for \(const caseRecord of cases\) \{\s+if \(!isActiveClientCase\(caseRecord\)\) continue;\s+const clientId = getStage35RelationClientId\(caseRecord\);/s.test(clients),
  'Client relation counters must count only active client cases',
);
check(
  /const clientsWithCases = useMemo\(\s*\(\) => clients\.filter\(\(client\) => !client\.archivedAt && \(countersByClientId\.get\(client\.id\)\?\.cases \|\| 0\) > 0\)\.length,/s.test(clients),
  'clientsWithCases must derive from the shared relation counter',
);
check(
  /forteca-frt-021-kpi-label">Wszyscy<\/span>[\s\S]*?forteca-frt-021-kpi-value">\{allLiveClientsStage021\.length\}[\s\S]*?forteca-frt-021-kpi-helper">niearchiwalni klienci/s.test(clients),
  'Wszyscy tile must show all non-archived clients',
);
check(
  /forteca-frt-021-kpi-label">Aktywni<\/span>[\s\S]*?forteca-frt-021-kpi-value">\{activeClientsStage021\.length\}/s.test(clients),
  'Aktywni tile must use the current active-status source',
);
check(
  /forteca-frt-021-kpi-label">Bez sprawy<\/span>[\s\S]*?forteca-frt-021-kpi-value">\{clientsWithoutCases\}/s.test(clients),
  'Bez sprawy tile must apply the real without_case filter',
);
check(
  includes("applyClientRelationFilterStage232C('without_case')"),
  'Bez sprawy tile must use the shared relation filter handler',
);
check(
  /clientRelationFilterStage232C === 'without_case'[\s\S]*?\(countersByClientId\.get\(client\.id\)\?\.cases \|\| 0\) === 0/s.test(clients),
  'filtered clients must apply cases === 0 for without_case',
);
check(
  !/staleClients\s*=\s*useMemo\(\s*\(\) => clients\.filter\(\(client\) => !client\.archivedAt && \(countersByClientId\.get\(client\.id\)\?\.leads \|\| 0\) === 0\)/s.test(clients),
  'Wymaga kontaktu / Bez ruchu must not be calculated as clients without leads',
);
check(
  includes('NEEDS_CONTACT_BUCKETS_STAGE232C') && includes('needsContactClientIdsStage232C') && includes('contactCadenceGrid.buckets[key]'),
  'needs_contact must use contactCadenceGrid buckets',
);
check(
  includes('relatedRecordsByClientIdStage232C') && includes('relatedRecordsById: relatedRecordsByClientIdStage232C'),
  'ContactCadenceGrid must receive client relation context',
);
check(
  includes('activeCommissionValueStage232C') && /activeCommissionValueStage232C[\s\S]*?activeCommission/s.test(clients),
  'Prowizja tile must use active commission source truth',
);
check(
  !/label="Prowizja"[\s\S]*?relationValue/s.test(clients),
  'Prowizja tile must not use relationValue',
);
check(
  includes('activeCommissionRowsStage024') && includes('activeCommissionValueStage024') && includes("applyClientRelationFilterStage232C('active_commission')"),
  'Active commission view must use the current active commission source',
);
check(
  ['without_case', 'needs_contact', 'active_commission', 'archived'].every((filter) => includes("applyClientRelationFilterStage232C('" + filter + "')")),
  'All relation views must use the shared relation filter handler',
);
check(
  /return clients\s*\.filter\(\(client\) => \{/s.test(clients),
  'Filtered list must still start from clients, not leads',
);
check(
  !includes('localStorage'),
  'Clients filters must not use localStorage',
);

for (const rel of forbiddenScopeFiles) {
  const absolute = path.join(root, rel);
  if (!fs.existsSync(absolute)) continue;
  const stat = fs.statSync(absolute);
  check(stat.isFile(), `${rel} must remain a file`);
}

if (failures.length) {
  console.error('STAGE232C clients relation tile source of truth guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE232C clients relation tile source of truth guard: PASS');
