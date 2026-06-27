const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8').replace(/^\uFEFF/, '');
}

function expectIncludes(file, text, label) {
  const content = read(file);
  if (!content.includes(text)) throw new Error(`${file}: missing ${label || text}`);
  console.log(`OK: ${file} contains ${label || text}`);
}

expectIncludes('src/components/Layout.tsx', 'VISUAL_STAGE_05_CLIENTS_ROUTE_SCOPE', 'Stage 05 route scope marker');
expectIncludes('src/components/Layout.tsx', "const isClientsRoute = location.pathname === '/clients';", 'clients route detection');
expectIncludes('src/components/Layout.tsx', 'main-clients', 'main-clients scoped class');
expectIncludes('src/components/Layout.tsx', "data-visual-stage-clients={isClientsRoute ? '05-clients' : undefined}", 'clients visual data marker');
expectIncludes('src/pages/Clients.tsx', "import '../styles/visual-stage23-client-case-forms-vnext.css';", 'active Clients case form CSS import');
expectIncludes('src/pages/Clients.tsx', "import '../styles/clients-next-action-layout.css';", 'active Clients next-action CSS import');
expectIncludes('src/pages/Clients.tsx', "import '../styles/closeflow-record-list-source-truth.css';", 'active Clients record-list CSS import');
expectIncludes('src/pages/Clients.tsx', "import '../styles/closeflow-unified-page-canvas-stage211c.css';", 'active Clients unified canvas CSS import');
expectIncludes('src/pages/Clients.tsx', "import '../styles/closeflow-canvas-source-truth-stage211e.css';", 'active Clients canvas source CSS import');
expectIncludes('src/pages/Clients.tsx', 'data-clients-real-view="true"', 'Clients real-view marker');
expectIncludes('src/pages/Clients.tsx', 'createClientInSupabase', 'client create flow remains present');
expectIncludes('src/pages/Clients.tsx', 'fetchClientsFromSupabase', 'client read flow remains present');
expectIncludes('src/pages/Clients.tsx', 'fetchLeadsFromSupabase', 'lead counters remain present');
expectIncludes('src/pages/Clients.tsx', 'fetchCasesFromSupabase', 'case counters remain present');
expectIncludes('src/pages/Clients.tsx', 'fetchPaymentsFromSupabase', 'payment counters remain present');
expectIncludes('src/pages/Clients.tsx', 'updateClientInSupabase', 'archive/restore flow remains present');
expectIncludes('src/pages/Clients.tsx', 'showArchived', 'trash view remains present');
expectIncludes('src/pages/Clients.tsx', 'setSearch', 'search remains present');
expectIncludes('src/pages/Clients.tsx', 'Link to={`/clients/${client.id}`}', 'ClientDetail link remains present');
console.log('OK: Visual Stage 05 Clients guard passed.');
