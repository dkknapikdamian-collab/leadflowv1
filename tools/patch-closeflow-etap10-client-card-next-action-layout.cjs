const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const clientsPath = path.join(repo, 'src/pages/Clients.tsx');
const packagePath = path.join(repo, 'package.json');
const cssImport = "import '../styles/clients-next-action-layout.css';";
const scriptName = 'check:closeflow-client-card-next-action-layout';
const scriptCommand = 'node scripts/check-closeflow-client-card-next-action-layout.cjs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function ensureIncludes(text, needle, message) {
  if (!text.includes(needle)) throw new Error(message);
}

let clients = read(clientsPath);

if (!clients.includes(cssImport)) {
  const anchor = "import '../styles/visual-stage23-client-case-forms-vnext.css';";
  if (!clients.includes(anchor)) {
    throw new Error('Nie znaleziono importu visual-stage23 w Clients.tsx. Nie zgaduję miejsca importu CSS.');
  }
  clients = clients.replace(anchor, `${anchor}\n${cssImport}`);
}

clients = clients.replace(/Brak zaplanowanych działań/g, 'Brak zaplanowanej akcji');
clients = clients.replace(/Najbliższa zaplanowana akcja/g, 'Najbliższa akcja');

if (clients.includes('className="lead-action-cell"')) {
  clients = clients.replace(/className="lead-action-cell"/g, 'className="lead-action-cell client-card-next-action-block"');
} else if (!clients.includes('client-card-next-action-block')) {
  throw new Error('Nie znaleziono className="lead-action-cell" ani client-card-next-action-block w Clients.tsx.');
}

// Guard class for actions area. The existing class name can vary across older visual stages, so patch several safe variants.
const actionClassReplacements = [
  ['className="lead-actions-cell"', 'className="lead-actions-cell client-card-action-buttons"'],
  ['className="lead-actions"', 'className="lead-actions client-card-action-buttons"'],
  ['className="row-actions"', 'className="row-actions client-card-action-buttons"'],
  ['className="client-actions"', 'className="client-actions client-card-action-buttons"'],
];
let patchedActions = clients.includes('client-card-action-buttons');
for (const [from, to] of actionClassReplacements) {
  if (clients.includes(from)) {
    clients = clients.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
    patchedActions = true;
  }
}
if (!patchedActions) {
  // Do not fail here. CSS has broad fallbacks for direct action buttons. The check accepts this fallback.
  clients = clients.replace(
    'const CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 =',
    "const CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10 = 'nearest action is full-width before client card buttons';\n\nconst CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 ="
  );
} else if (!clients.includes('CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10')) {
  clients = clients.replace(
    'const CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 =',
    "const CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10 = 'nearest action is full-width before client card buttons';\n\nconst CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 ="
  );
}

ensureIncludes(clients, 'client-card-next-action-block', 'Clients.tsx nie ma klasy client-card-next-action-block.');
ensureIncludes(clients, 'Najbliższa akcja', 'Clients.tsx nie ma skróconej etykiety Najbliższa akcja.');
ensureIncludes(clients, 'Brak zaplanowanej akcji', 'Clients.tsx nie ma fallbacku Brak zaplanowanej akcji.');
write(clientsPath, clients);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts[scriptName] = scriptCommand;
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('CLOSEFLOW_ETAP10_CLIENT_CARD_NEXT_ACTION_LAYOUT_PATCH_OK');
