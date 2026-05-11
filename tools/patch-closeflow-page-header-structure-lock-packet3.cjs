const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function p(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  const full = p(rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function write(rel, text) {
  fs.writeFileSync(p(rel), text, 'utf8');
}

const pages = [
  'src/pages/TodayStable.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/Activity.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Billing.tsx',
  'src/pages/SupportCenter.tsx',
  'src/pages/Settings.tsx',
  'src/pages/AdminAiSettings.tsx',
];

function ensureCssImportLast(rel) {
  let text = read(rel);
  if (!text) return false;
  const before = text;
  const importLine = "import '../styles/closeflow-page-header-structure-lock.css';";

  text = text
    .split(/\r?\n/)
    .filter((line) => !line.includes('closeflow-page-header-structure-lock.css'))
    .join('\n');

  const cssImports = [...text.matchAll(/^import\s+['"][^'"]+\.css['"];\s*$/gm)];
  if (cssImports.length) {
    const last = cssImports[cssImports.length - 1];
    const at = last.index + last[0].length;
    text = text.slice(0, at) + "\n" + importLine + text.slice(at);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    if (imports.length) {
      const last = imports[imports.length - 1];
      const at = last.index + last[0].length;
      text = text.slice(0, at) + "\n" + importLine + text.slice(at);
    } else {
      text = importLine + "\n" + text;
    }
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function ensureEmergencyImport() {
  const rel = 'src/styles/emergency/emergency-hotfixes.css';
  let text = read(rel);
  if (!text) return false;
  const before = text;
  text = text
    .split(/\r?\n/)
    .filter((line) => !line.includes('closeflow-page-header-structure-lock.css'))
    .join('\n')
    .trimEnd();

  text += "\n\n/* CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_ENTRY\n   Final source of truth for kicker/title/description placement. Must stay last.\n*/\n@import '../closeflow-page-header-structure-lock.css';\n";

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function patchActivity() {
  const rel = 'src/pages/Activity.tsx';
  let text = read(rel);
  if (!text) return false;
  const before = text;

  // Remove local activity-page-header class from the top header; that local CSS was still influencing layout.
  text = text.replace(
    'className="cf-page-header activity-page-header"',
    'className="cf-page-header"'
  );

  // Ensure the only header copy block is explicitly marked.
  text = text.replace(
    '<header data-cf-page-header="true" className="cf-page-header">',
    '<header data-cf-page-header="true" className="cf-page-header">'
  );

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function patchTemplates() {
  const rel = 'src/pages/Templates.tsx';
  let text = read(rel);
  if (!text) return false;
  const before = text;

  // The outer row was incorrectly marked as copy while it also contained actions.
  text = text.replace(
    '<div data-cf-page-header-part="copy" className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">',
    '<div className="cf-page-header-row flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">'
  );

  // The real copy column is the inner text block.
  text = text.replace(
    '<div className="space-y-3">\n              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">',
    '<div data-cf-page-header-part="copy" className="space-y-3">\n              <div data-cf-page-header-part="kicker" className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">'
  );

  // If the old inner line was already transformed partially, keep it stable.
  text = text.replace(
    '<div data-cf-page-header-part="copy" className="space-y-3">\n              <div data-cf-page-header-part="kicker" data-cf-page-header-part="kicker"',
    '<div data-cf-page-header-part="copy" className="space-y-3">\n              <div data-cf-page-header-part="kicker"'
  );

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function patchGenericRowClasses(rel) {
  let text = read(rel);
  if (!text) return false;
  const before = text;

  // Make common row wrappers explicit and layout-only.
  text = text.replace(
    'className="cf-page-hero-layout flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"',
    'className="cf-page-header-row cf-page-hero-layout flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"'
  );
  text = text.replace(
    'className="cf-page-hero-layout flex flex-col gap-4 md:flex-row md:items-end md:justify-between"',
    'className="cf-page-header-row cf-page-hero-layout flex flex-col gap-4 md:flex-row md:items-end md:justify-between"'
  );

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

const result = {
  emergencyImport: ensureEmergencyImport(),
  imports: [],
  pagePatches: [],
};

for (const rel of pages) {
  if (ensureCssImportLast(rel)) result.imports.push(rel);
  if (patchGenericRowClasses(rel)) result.pagePatches.push(rel + ':row');
}

if (patchActivity()) result.pagePatches.push('src/pages/Activity.tsx:local-class-removed');
if (patchTemplates()) result.pagePatches.push('src/pages/Templates.tsx:copy-row-fixed');

console.log('CLOSEFLOW_PAGE_HEADER_STRUCTURE_LOCK_PACKET3_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
