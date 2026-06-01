const fs = require('fs');
const path = require('path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const client = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');
const adapters = fs.readFileSync(path.join(root, 'src/styles/page-adapters/page-adapters.css'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/stage216m-r3-r1-header-actions-repair.css'), 'utf8');

function headerSection(source, className) {
  const start = source.indexOf(`<header className="${className}">`);
  if (start < 0) throw new Error(`Missing header: ${className}`);
  const end = source.indexOf('</header>', start);
  if (end < 0) throw new Error(`Missing header close: ${className}`);
  return source.slice(start, end + '</header>'.length);
}

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL ' + message);
    process.exit(1);
  }
}

const leadHeader = headerSection(lead, 'lead-detail-header');
const clientHeader = headerSection(client, 'client-detail-header');

assert(leadHeader.includes('Zapytaj AI'), 'Lead header must include Zapytaj AI');
assert(leadHeader.includes('Rozpocznij obsługę'), 'Lead header must keep Rozpocznij obsługę service action');
assert(!leadHeader.includes('handleStartLeadEditing'), 'Lead header must not open lead edit');
assert(!leadHeader.includes('>Edytuj<') && !leadHeader.includes('Edytuj dane'), 'Lead header must not render edit action');

assert(clientHeader.includes('Zapytaj AI'), 'Client header must include Zapytaj AI');
assert(clientHeader.includes('Otwórz główną sprawę'), 'Client header must keep main case action');
assert(!clientHeader.includes('Nowa sprawa dla klienta'), 'Client header must not include new case action');
assert(!clientHeader.includes('handleClientPanelEditToggle'), 'Client header must not include edit action');
assert(!clientHeader.includes('client-detail-header-meta'), 'Client header meta must be removed from visible header');

assert(adapters.includes("stage216m-r3-r1-header-actions-repair.css"), 'page adapters must import R3-R1 CSS');
assert(css.includes('client-detail-header-meta') && css.includes('display: none'), 'R3-R1 CSS must hard-hide client header meta fallback');

console.log('PASS stage216m-r3-r1-header-actions-repair-contract');
