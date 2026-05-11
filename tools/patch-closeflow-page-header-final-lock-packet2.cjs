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
  ['src/pages/TodayStable.tsx', 'today'],
  ['src/pages/Leads.tsx', 'leads'],
  ['src/pages/Clients.tsx', 'clients'],
  ['src/pages/Cases.tsx', 'cases'],
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Calendar.tsx', 'calendar'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/ResponseTemplates.tsx', 'responseTemplates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/AiDrafts.tsx', 'aiDrafts'],
  ['src/pages/NotificationsCenter.tsx', 'notifications'],
  ['src/pages/Billing.tsx', 'billing'],
  ['src/pages/SupportCenter.tsx', 'support'],
  ['src/pages/Settings.tsx', 'settings'],
  ['src/pages/AdminAiSettings.tsx', 'adminAi'],
];

function ensureCssImportLast(rel) {
  let text = read(rel);
  if (!text) return false;
  const before = text;
  const importLine = "import '../styles/closeflow-page-header-final-lock.css';";

  text = text
    .split(/\r?\n/)
    .filter((line) => !line.includes('closeflow-page-header-final-lock.css'))
    .join('\n');

  const cssImports = [...text.matchAll(/^import\s+['"][^'"]+\.css['"];\s*$/gm)];
  if (cssImports.length) {
    const last = cssImports[cssImports.length - 1];
    const insertAt = last.index + last[0].length;
    text = text.slice(0, insertAt) + "\n" + importLine + text.slice(insertAt);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    if (imports.length) {
      const last = imports[imports.length - 1];
      const insertAt = last.index + last[0].length;
      text = text.slice(0, insertAt) + "\n" + importLine + text.slice(insertAt);
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
    .filter((line) => !line.includes('closeflow-page-header-final-lock.css'))
    .join('\n')
    .trimEnd();

  text += "\n\n/* CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_ENTRY\n   Final source of truth for top page header layout/copy/actions. Must stay last.\n*/\n@import '../closeflow-page-header-final-lock.css';\n";

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function markFirstHeaderCopy(text) {
  return text.replace(
    /(<header\b[^>]*data-cf-page-header="true"[^>]*>\s*)<div(?![^>]*data-cf-page-header-part=)/g,
    '$1<div data-cf-page-header-part="copy"'
  );
}

function markHeaderKicker(text) {
  text = text.replace(/<p className="([^"]*kicker[^"]*)">/g, (m, cls) => {
    if (m.includes('data-cf-page-header-part')) return m;
    return `<p data-cf-page-header-part="kicker" className="${cls}">`;
  });
  text = text.replace(/<div className="([^"]*kicker[^"]*)">/g, (m, cls) => {
    if (m.includes('data-cf-page-header-part')) return m;
    return `<div data-cf-page-header-part="kicker" className="${cls}">`;
  });
  return text;
}

function normalizeDescriptionNodes(text, key) {
  const descriptionExpr = `PAGE_HEADER_CONTENT.${key}.description`;
  if (!text.includes(descriptionExpr)) return text;

  // Normalize all description nodes that already use PAGE_HEADER_CONTENT.
  const descNodeRe = new RegExp(`<p[^>]*>\\s*\\{${descriptionExpr.replaceAll('.', '\\.')}\\}\\s*</p>`, 'g');
  text = text.replace(
    descNodeRe,
    `<p data-cf-page-header-part="description" className="cf-page-header-description">{${descriptionExpr}}</p>`
  );

  // Remove duplicates of the same exact description node after the first occurrence.
  const exact = `<p data-cf-page-header-part="description" className="cf-page-header-description">{${descriptionExpr}}</p>`;
  const parts = text.split(exact);
  if (parts.length > 2) {
    text = parts[0] + exact + parts.slice(1).join('');
  }

  return text;
}

function markActionContainers(text) {
  const replacements = [
    ['className="head-actions"', 'className="head-actions" data-cf-page-header-part="actions"'],
    ['className="cf-page-hero-actions flex flex-wrap gap-2"', 'className="cf-page-hero-actions flex flex-wrap gap-2" data-cf-page-header-part="actions"'],
    ['className="ai-drafts-header-actions"', 'className="ai-drafts-header-actions" data-cf-page-header-part="actions"'],
    ['className="activity-header-actions"', 'className="activity-header-actions" data-cf-page-header-part="actions"'],
    ['className="notifications-header-actions"', 'className="notifications-header-actions" data-cf-page-header-part="actions"'],
    ['className="billing-header-actions"', 'className="billing-header-actions" data-cf-page-header-part="actions"'],
    ['className="settings-header-actions"', 'className="settings-header-actions" data-cf-page-header-part="actions"'],
    ['className="support-header-actions"', 'className="support-header-actions" data-cf-page-header-part="actions"'],
  ];

  for (const [from, to] of replacements) {
    if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);
  }

  // Common header action div in Tailwind pages.
  text = text.replace(
    /<div className="flex flex-col gap-2 sm:flex-row sm:items-center">/g,
    '<div data-cf-page-header-part="actions" className="flex flex-col gap-2 sm:flex-row sm:items-center">'
  );
  text = text.replace(
    /<div className="flex flex-col gap-2 sm:flex-row">/g,
    '<div data-cf-page-header-part="actions" className="flex flex-col gap-2 sm:flex-row">'
  );

  return text;
}

function markActionSemantics(text) {
  // AI buttons.
  text = text.replace(/data-stage26-leads-head-ai="true"(?![^>]*data-cf-header-action)/g, 'data-stage26-leads-head-ai="true" data-cf-header-action="ai"');
  text = text.replace(/className="([^"]*\bsoft-blue\b[^"]*)"(?![^>]*data-cf-header-action)/g, 'className="$1" data-cf-header-action="ai"');

  // Danger/trash.
  text = text.replace(/className="([^"]*\bcf-trash-action-button\b[^"]*)"(?![^>]*data-cf-header-action)/g, 'className="$1" data-cf-header-action="danger"');
  text = text.replace(/className="([^"]*\bcf-entity-action-danger\b[^"]*)"(?![^>]*data-cf-header-action)/g, 'className="$1" data-cf-header-action="danger"');

  return text;
}

function patchCalendarHeader(text) {
  if (!text.includes('src/pages/Calendar.tsx') && !text.includes('PAGE_HEADER_CONTENT.calendar')) {
    // file content test, not path.
  }

  if (text.includes('data-calendar-header-add-event="true"')) return text;

  const headerStart = text.indexOf('<header');
  const cfStart = text.indexOf('data-cf-page-header="true"', Math.max(0, headerStart));
  if (headerStart < 0 || cfStart < 0) return text;

  const actualHeaderStart = text.lastIndexOf('<header', cfStart);
  const headerEnd = text.indexOf('</header>', cfStart);
  if (actualHeaderStart < 0 || headerEnd < 0) return text;

  const header = text.slice(actualHeaderStart, headerEnd + '</header>'.length);
  if (!header.includes('PAGE_HEADER_CONTENT.calendar') && !header.includes('Kalendarz')) return text;

  const actions = `
          <div data-cf-page-header-part="actions" className="cf-page-hero-actions flex flex-wrap gap-2">
            <Button type="button" variant="outline" data-cf-header-action="primary" data-calendar-header-add-task="true" onClick={() => setIsNewTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj zadanie
            </Button>
            <Button type="button" variant="outline" data-cf-header-action="primary" data-calendar-header-add-event="true" onClick={() => setIsNewEventOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj wydarzenie
            </Button>
          </div>`;

  const nextHeader = header.replace('</header>', `${actions}\n        </header>`);
  return text.slice(0, actualHeaderStart) + nextHeader + text.slice(headerEnd + '</header>'.length);
}

function patchPage(rel, key) {
  let text = read(rel);
  if (!text) return false;
  const before = text;

  text = markFirstHeaderCopy(text);
  text = markHeaderKicker(text);
  text = normalizeDescriptionNodes(text, key);
  text = markActionContainers(text);
  text = markActionSemantics(text);

  if (rel.endsWith('Calendar.tsx')) {
    text = patchCalendarHeader(text);
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }

  return false;
}

const result = {
  emergencyImport: ensureEmergencyImport(),
  pageImports: [],
  pagePatches: [],
};

for (const [rel, key] of pages) {
  if (ensureCssImportLast(rel)) result.pageImports.push(rel);
  if (patchPage(rel, key)) result.pagePatches.push(rel);
}

console.log('CLOSEFLOW_PAGE_HEADER_FINAL_LOCK_PACKET2_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
