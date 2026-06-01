const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const cssPath = path.join(root, 'src/styles/stage216l-client-detail-lead-layout-cumulative.css');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const client = fs.readFileSync(clientPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

assert(client.includes('STAGE216L_CLIENT_DETAIL_LEAD_LAYOUT_SOURCE'), 'Brak markera Stage216L w ClientDetail.tsx');
assert(client.includes('data-stage216l-header-edit-action="true"'), 'Brak headerowego Edytuj dane jak w LeadDetail');
assert(client.includes('data-stage216l-client-top-tiles-in-main-column="true"'), 'ClientTopTiles nie zostały przeniesione do głównej kolumny');
assert(client.includes('data-stage216l-client-notes-center="true"'), 'Notatki klienta nie zostały przeniesione do centrum pracy');
assert(client.includes('clientVisibleNotesForRenderStage216L'), 'Brak wyliczonej listy notatek do renderu w centrum');
assert(client.includes('data-stage216l-client-avatar-removed="true"'), 'Brak markera usunięcia awatara klienta');
assert(!client.includes('className="client-detail-avatar-row"'), 'Awatar/inicjały klienta nadal są renderowane w TSX');
assert(client.includes('data-stage216l-client-right-notes-moved-to-center="true"'), 'Prawa szyna nadal zawiera stary panel notatek albo brak markera migracji');

const shellIndex = client.indexOf('<div className="client-detail-shell">');
assert(shellIndex > 0, 'Brak client-detail-shell');
const beforeShell = client.slice(0, shellIndex);
assert(!beforeShell.includes('<ClientTopTiles'), 'ClientTopTiles nadal siedzą nad całym shellem, a nie w centrum');
const mainColumnIndex = client.indexOf('<section className="client-detail-main-column">');
const movedTilesIndex = client.indexOf('data-stage216l-client-top-tiles-in-main-column="true"');
assert(mainColumnIndex > 0 && movedTilesIndex > mainColumnIndex, 'ClientTopTiles nie są wewnątrz main-column');

assert(adapters.includes("@import '../stage216l-client-detail-lead-layout-cumulative.css';"), 'Brak importu CSS Stage216L w page-adapters.css');
assert(css.includes('.client-detail-vnext-page .client-detail-shell'), 'CSS Stage216L nie kontroluje layoutu shell');
assert(css.includes('.client-detail-vnext-page .client-detail-notes-center-section'), 'CSS Stage216L nie styluje centralnych notatek');

console.log('PASS stage216l-client-detail-lead-layout-cumulative-contract');
