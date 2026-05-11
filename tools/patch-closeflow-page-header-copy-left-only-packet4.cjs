const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function p(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : '';
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
  const importLine = "import '../styles/closeflow-page-header-copy-left-only.css';";

  text = text
    .split(/\r?\n/)
    .filter((line) => !line.includes('closeflow-page-header-copy-left-only.css'))
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
    .filter((line) => !line.includes('closeflow-page-header-copy-left-only.css'))
    .join('\n')
    .trimEnd();

  text += "\n\n/* CLOSEFLOW_PAGE_HEADER_COPY_LEFT_ONLY_PACKET4_ENTRY\n   Final narrow lock: copy left, kicker above title. Must stay last.\n*/\n@import '../closeflow-page-header-copy-left-only.css';\n";

  if (text !== before) {
    write(rel, text);
    return true;
  }

  return false;
}

/* Do not change business logic. Only normalize accidental structure flags where they break source truth. */
function patchTasksAccidentalCopyOnList() {
  const rel = 'src/pages/TasksStable.tsx';
  let text = read(rel);
  if (!text) return false;
  const before = text;

  // This section is the task list, not a page-header copy column. Remove the misleading data attribute.
  text = text.replace(
    '<section className="space-y-2" data-cf-page-header-part="copy" data-tasks-compact-list-stage48="true">',
    '<section className="space-y-2" data-tasks-compact-list-stage48="true">'
  );

  if (text !== before) {
    write(rel, text);
    return true;
  }

  return false;
}

const result = {
  emergencyImport: ensureEmergencyImport(),
  pageImports: [],
  tasksListCopyFlagRemoved: patchTasksAccidentalCopyOnList(),
};

for (const page of pages) {
  if (ensureCssImportLast(page)) result.pageImports.push(page);
}

console.log('CLOSEFLOW_PAGE_HEADER_COPY_LEFT_ONLY_PACKET4_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
