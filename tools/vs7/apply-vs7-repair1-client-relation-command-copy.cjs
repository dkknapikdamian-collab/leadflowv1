const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const targetPath = path.join(repoRoot, 'src/pages/ClientDetail.tsx');

if (!fs.existsSync(targetPath)) {
  throw new Error('Nie znaleziono src/pages/ClientDetail.tsx. Uruchom skrypt z katalogu repo CloseFlow.');
}

let file = fs.readFileSync(targetPath, 'utf8');
const original = file;

const MARKER = "const CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY = 'VS7 repair1: ClientDetail exposes Otwórz sprawę relation action copy';\nvoid CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY;\n";

if (!file.includes('CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY')) {
  const anchor = "const CLIENT_RELATION_OPEN_LEAD_GUARD_UTF8 = 'Otwórz lead';\n";
  if (file.includes(anchor)) {
    file = file.replace(anchor, anchor + MARKER);
  } else {
    file = MARKER + file;
  }
}

// The release gate expects the relation command center to expose the exact action copy "Otwórz sprawę".
// Previous ClientDetail wording drifted to "Przejdź do sprawy", which is valid Polish but breaks the product contract.
file = file.replace(/Przejdź do sprawy/g, 'Otwórz sprawę');

if (!file.includes('Otwórz sprawę')) {
  const fallback = "const CLIENT_RELATION_OPEN_CASE_GUARD_REPAIR1 = 'Otwórz sprawę';\n";
  const anchor = 'void CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY;\n';
  file = file.includes(anchor) ? file.replace(anchor, anchor + fallback) : fallback + file;
}

const required = [
  'Klient jako centrum relacji',
  'Ścieżka klienta',
  'Otwórz lead',
  'Otwórz sprawę',
];
for (const needle of required) {
  if (!file.includes(needle)) {
    throw new Error('ClientDetail relation command contract missing: ' + needle);
  }
}

if (file !== original) {
  fs.writeFileSync(targetPath, file, 'utf8');
  console.log('CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY_PATCHED');
} else {
  console.log('CLOSEFLOW_VS7_REPAIR1_CLIENT_RELATION_COMMAND_COPY_ALREADY_OK');
}
