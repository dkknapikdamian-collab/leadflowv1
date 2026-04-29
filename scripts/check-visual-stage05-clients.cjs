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
expectIncludes('src/styles/visual-stage05-clients.css', 'VISUAL_STAGE_05_CLIENTS', 'Stage 05 CSS marker');
expectIncludes('src/styles/visual-stage05-clients.css', '.main-clients', 'scoped Clients selector');
expectIncludes('src/styles/visual-stage05-clients.css', 'table-card', 'table-card pattern');
expectIncludes('src/styles/visual-stage05-clients.css', 'right-card', 'right-card pattern');
expectIncludes('src/styles/visual-stage05-clients.css', '@media (max-width: 760px)', 'mobile polish');
expectIncludes('src/index.css', '@import "./styles/visual-stage05-clients.css";', 'Stage 05 CSS import');
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
