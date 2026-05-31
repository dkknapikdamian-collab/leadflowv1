const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(p, out);
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

mustInclude('src/App.tsx', "import './styles/closeflow-main-search-source-truth-stage173.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-global-client-create-dialog-stage172.css")) {
  if (app.indexOf("closeflow-main-search-source-truth-stage173.css") < app.indexOf("closeflow-global-client-create-dialog-stage172.css")) {
    throw new Error('Stage173 CSS import must be after Stage172 CSS import.');
  }
}

[
  'CLOSEFLOW_STAGE173_MAIN_SEARCH_SOURCE_TRUTH',
  '--closeflow-stage173-main-search-source-truth: "active"',
  '--cf173-main-search-max-width: 1060px',
  '.cf-main-search',
  'data-cf-main-search-source="stage173"',
  'display: none !important',
  'padding-left: var(--cf173-main-search-padding-x) !important',
].forEach((marker) => mustInclude('src/styles/closeflow-main-search-source-truth-stage173.css', marker));

['src/pages/Clients.tsx', 'src/pages/Leads.tsx'].forEach((rel) => {
  mustInclude(rel, 'cf-main-search');
  mustInclude(rel, 'data-cf-main-search-source="stage173"');
});

const offenders = [];
for (const abs of walk(path.join(root, 'src', 'pages'))) {
  const rel = path.relative(root, abs);
  const text = fs.readFileSync(abs, 'utf8');
  if (!/Szukaj|searchQuery|setSearch|setSearchQuery|lead-search-suggestions/i.test(text)) continue;
  const rawSearchDivs = text.match(/<div\b[^>]*className=(["'])[^"']*\bsearch\b[^"']*\1[^>]*>/g) || [];
  for (const tag of rawSearchDivs) {
    if (!tag.includes('cf-main-search') || !tag.includes('data-cf-main-search-source="stage173"')) {
      offenders.push(`${rel}: ${tag.slice(0, 220)}`);
    }
  }
}

if (offenders.length) {
  throw new Error('Stage173 search bars without source-truth marker:\n' + offenders.join('\n'));
}

[
  'scripts/apply-stage173-main-search-source-truth.cjs',
  'scripts/check-stage173-main-search-source-truth.cjs',
  'docs/ui/CLOSEFLOW_STAGE173_MAIN_SEARCH_SOURCE_TRUTH.md',
  'docs/ui/CLOSEFLOW_STAGE173_RUNTIME_MAIN_SEARCH_AUDIT.js',
  '_project/STAGE173_MAIN_SEARCH_SOURCE_TRUTH_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage173 main search source truth.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage173 file: ${rel}`);
});

console.log('OK: Stage173 main search source truth guard passed.');
