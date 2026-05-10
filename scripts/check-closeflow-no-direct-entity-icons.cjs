const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checkedRoots = ['src/pages', 'src/components'];
const ignoredPathParts = [
  `${path.sep}ui-system${path.sep}`,
  `${path.sep}icons${path.sep}`,
  `${path.sep}generated${path.sep}`,
];
const entityIconImports = new Set([
  'User', 'Users', 'UserRound', 'Contact',
  'Building', 'Building2', 'BriefcaseBusiness', 'Handshake',
  'FolderKanban', 'FileText', 'ClipboardList', 'Landmark',
]);
const entitySurfaceFiles = new Set([
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function normalize(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

const failures = [];
for (const base of checkedRoots) {
  for (const file of walk(path.join(root, base))) {
    const rel = normalize(file);
    if (ignoredPathParts.some((part) => file.includes(part))) continue;
    if (!entitySurfaceFiles.has(rel)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('@closeflow-allow-direct-entity-icon')) continue;
    const lucideImports = [...text.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)];
    for (const match of lucideImports) {
      const importedNames = match[1].split(',').map((item) => item.trim().split(/\s+as\s+/i)[0].trim()).filter(Boolean);
      const directEntityIcons = importedNames.filter((name) => entityIconImports.has(name));
      if (directEntityIcons.length && !text.includes('EntityIcon') && !text.includes('LeadEntityIcon') && !text.includes('ClientEntityIcon') && !text.includes('CaseEntityIcon')) {
        failures.push(`${rel}: direct entity lucide import without EntityIcon wrapper: ${directEntityIcons.join(', ')}`);
      }
    }
  }
}

if (failures.length) {
  console.error('CLOSEFLOW_NO_DIRECT_ENTITY_ICONS_VS9_FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('CLOSEFLOW_NO_DIRECT_ENTITY_ICONS_VS9_OK');
console.log('checked_surfaces=' + entitySurfaceFiles.size);
console.log('contract=EntityIcon');
