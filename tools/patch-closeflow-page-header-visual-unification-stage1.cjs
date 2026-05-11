const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const sourceCss = "import '../styles/closeflow-page-header-card-source-truth.css';";

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

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function ensureImport(rel) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) return false;

  let text = fs.readFileSync(full, 'utf8');
  if (text.includes("closeflow-page-header-card-source-truth.css")) return false;

  const cssImportRe = /^import\s+['"][^'"]+\.css['"];\s*$/gm;
  let last = null;
  for (const match of text.matchAll(cssImportRe)) last = match;

  if (last) {
    const insertAt = last.index + last[0].length;
    text = text.slice(0, insertAt) + "\n" + sourceCss + text.slice(insertAt);
  } else {
    const importRe = /^import[\s\S]*?;\s*$/gm;
    let lastImport = null;
    for (const match of text.matchAll(importRe)) lastImport = match;
    if (!lastImport) throw new Error(`No import block found in ${rel}`);
    const insertAt = lastImport.index + lastImport[0].length;
    text = text.slice(0, insertAt) + "\n" + sourceCss + text.slice(insertAt);
  }

  fs.writeFileSync(full, text, 'utf8');
  return true;
}

function patchTasksHeader() {
  const rel = 'src/pages/TasksStable.tsx';
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) return false;

  let text = fs.readFileSync(full, 'utf8');
  let changed = false;

  if (!/\bPlus\b/.test(text.split("from 'lucide-react'")[0].split("import").pop() || '')) {
    text = text.replace(
      /import \{ ([^}]*?) \} from 'lucide-react';/,
      (match, inside) => {
        const names = inside.split(',').map((x) => x.trim()).filter(Boolean);
        if (!names.includes('Plus')) names.push('Plus');
        return `import { ${names.join(', ')} } from 'lucide-react';`;
      },
    );
    changed = true;
  }

  if (!text.includes('data-tasks-new-task-header-action="true"')) {
    const needle = '            <div className="cf-page-hero-actions flex flex-wrap gap-2">\n';
    const button = `              <Button type="button" className="cf-header-action cf-header-action--primary" onClick={openNewTask} disabled={!hasAccess || workspaceLoading} data-tasks-new-task-header-action="true">
                <Plus className="mr-2 h-4 w-4" />
                Nowe zadanie
              </Button>
`;
    if (!text.includes(needle)) {
      throw new Error('Tasks header action container not found.');
    }
    text = text.replace(needle, needle + button);
    changed = true;
  }

  if (changed) fs.writeFileSync(full, text, 'utf8');
  return changed;
}

let changedImports = 0;
for (const page of pages) {
  if (ensureImport(page)) changedImports += 1;
}

const tasksChanged = patchTasksHeader();

console.log('CLOSEFLOW_PAGE_HEADER_VISUAL_UNIFICATION_STAGE1_PATCH_OK');
console.log(JSON.stringify({ changedImports, tasksChanged }, null, 2));
