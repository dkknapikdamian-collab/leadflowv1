const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const sourceImport = "import '../styles/closeflow-page-header-card-source-truth.css';";

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

function file(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  return fs.readFileSync(file(rel), 'utf8');
}

function write(rel, content) {
  fs.writeFileSync(file(rel), content, 'utf8');
}

function ensureSourceImportLast(rel) {
  const full = file(rel);
  if (!fs.existsSync(full)) return false;

  let text = read(rel);
  const before = text;

  text = text
    .split('\n')
    .filter((line) => !line.includes("closeflow-page-header-card-source-truth.css"))
    .join('\n');

  const cssImportRe = /^import\s+['"][^'"]+\.css['"];\s*$/gm;
  let lastCss = null;
  for (const match of text.matchAll(cssImportRe)) lastCss = match;

  if (lastCss) {
    const insertAt = lastCss.index + lastCss[0].length;
    text = text.slice(0, insertAt) + "\n" + sourceImport + text.slice(insertAt);
  } else {
    const importRe = /^import[\s\S]*?;\s*$/gm;
    let lastImport = null;
    for (const match of text.matchAll(importRe)) lastImport = match;
    if (!lastImport) throw new Error(`No import found in ${rel}`);
    const insertAt = lastImport.index + lastImport[0].length;
    text = text.slice(0, insertAt) + "\n" + sourceImport + text.slice(insertAt);
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function addHeaderAttrsToTag(text, tagStart) {
  if (tagStart.includes('data-cf-page-header="true"')) return tagStart;

  let out = tagStart.replace(/<([a-zA-Z]+)\s+/, '<$1 data-cf-page-header="true" ');

  if (/className="([^"]*)"/.test(out)) {
    out = out.replace(/className="([^"]*)"/, (m, cls) => {
      const classes = cls.split(/\s+/).filter(Boolean);
      if (!classes.includes('cf-page-header')) classes.unshift('cf-page-header');
      return `className="${classes.join(' ')}"`;
    });
  } else {
    out = out.replace(/>$/, ' className="cf-page-header">');
  }

  return out;
}

function patchKnownHeaders(rel) {
  const full = file(rel);
  if (!fs.existsSync(full)) return false;

  let text = read(rel);
  const before = text;

  const patterns = [
    /<div className="page-head"([^>]*)>/,
    /<div className="page-head ([^"]*)"([^>]*)>/,
    /<section className="cf-page-hero ([^"]*)"([^>]*)>/,
    /<header className="ai-drafts-page-header"([^>]*)>/,
    /<header className="activity-page-header"([^>]*)>/,
    /<header className="notifications-page-header"([^>]*)>/,
    /<header className="billing-header"([^>]*)>/,
    /<header className="support-header"([^>]*)>/,
    /<header className="settings-header"([^>]*)>/,
    /<header className="rounded-\[28px\] border border-slate-200 bg-white p-5 shadow-sm md:p-6"([^>]*)>/,
    /<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"([^>]*)>/,
    /<header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"([^>]*)>/,
  ];

  for (const pattern of patterns) {
    text = text.replace(pattern, (match) => addHeaderAttrsToTag(text, match));
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function ensureEmergencyImportLast() {
  const rel = 'src/styles/emergency/emergency-hotfixes.css';
  const full = file(rel);
  if (!fs.existsSync(full)) return false;

  let text = read(rel);
  const before = text;

  text = text
    .split('\n')
    .filter((line) => !line.includes("closeflow-page-header-card-source-truth.css"))
    .join('\n')
    .trimEnd();

  text += "\n\n/* CLOSEFLOW_EMERGENCY_HOTFIX_ENTRY\n   owner: CloseFlow Visual System\n   reason: final page header source-of-truth must load after old page adapters and hotfixes.\n   scope: [data-cf-page-header=\"true\"] top page headers only.\n   remove_after_stage: after all page headers are native PageHeader components.\n*/\n@import '../closeflow-page-header-card-source-truth.css';\n";

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function patchTasksHeader() {
  const rel = 'src/pages/TasksStable.tsx';
  const full = file(rel);
  if (!fs.existsSync(full)) return false;

  let text = read(rel);
  const before = text;

  if (!/import \{[^}]*\bPlus\b[^}]*\} from 'lucide-react';/.test(text)) {
    text = text.replace(/import \{ ([^}]*?) \} from 'lucide-react';/, (match, inside) => {
      const names = inside.split(',').map((x) => x.trim()).filter(Boolean);
      if (!names.includes('Plus')) names.push('Plus');
      return `import { ${names.join(', ')} } from 'lucide-react';`;
    });
  }

  if (!text.includes('data-tasks-new-task-header-action="true"')) {
    const needle = '            <div className="cf-page-hero-actions flex flex-wrap gap-2">\n';
    const insert = `              <Button type="button" className="cf-header-action cf-header-action--primary" onClick={openNewTask} disabled={!hasAccess || workspaceLoading} data-tasks-new-task-header-action="true" data-cf-header-action="primary">
                <Plus className="mr-2 h-4 w-4" />
                Nowe zadanie
              </Button>
`;
    if (!text.includes(needle)) {
      throw new Error('Tasks header action container not found.');
    }
    text = text.replace(needle, needle + insert);
  } else if (!text.includes('data-cf-header-action="primary"')) {
    text = text.replace('data-tasks-new-task-header-action="true"', 'data-tasks-new-task-header-action="true" data-cf-header-action="primary"');
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

let importsChanged = 0;
let headersChanged = 0;

for (const rel of pages) {
  if (ensureSourceImportLast(rel)) importsChanged += 1;
  if (patchKnownHeaders(rel)) headersChanged += 1;
}

const emergencyChanged = ensureEmergencyImportLast();
const tasksChanged = patchTasksHeader();

console.log('CLOSEFLOW_PAGE_HEADER_SOURCE_TRUTH_REBUILD_STAGE2_PATCH_OK');
console.log(JSON.stringify({ importsChanged, headersChanged, emergencyChanged, tasksChanged }, null, 2));
