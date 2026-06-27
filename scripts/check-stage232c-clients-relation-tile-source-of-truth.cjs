const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const clientsPath = path.join(root, 'src/pages/Clients.tsx');
const clients = fs.readFileSync(clientsPath, 'utf8');

const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

check(
  clients.includes("import { isActiveClientCase } from '../lib/client-cases';"),
  'Clients must use shared client-case activity truth',
);
check(
  clients.includes('STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH'),
  'Clients must keep the STAGE232C relation tile marker',
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
  /label="Aktywni"[\s\S]*?value=\{activeCount\}[\s\S]*?helper="niearchiwalni klienci"/s.test(clients),
  'Aktywni tile must show all non-archived clients',
);
check(
  !/label="Aktywni"[\s\S]*?value=\{clientsWithCases\}/s.test(clients),
  'Aktywni tile must not use clientsWithCases',
);

if (failures.length) {
  console.error('STAGE232C clients relation tile source of truth guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE232C clients relation tile source of truth guard: PASS');
