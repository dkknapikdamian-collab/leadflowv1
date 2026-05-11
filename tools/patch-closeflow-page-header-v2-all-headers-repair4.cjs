const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function p(rel) {
  return path.join(repo, rel);
}

function exists(rel) {
  return fs.existsSync(p(rel));
}

function read(rel) {
  return exists(rel) ? fs.readFileSync(p(rel), 'utf8') : '';
}

function write(rel, text) {
  fs.writeFileSync(p(rel), text, 'utf8');
}

function ensureImport(rel, importLine) {
  let text = read(rel);
  if (!text) return false;
  if (text.includes(importLine)) return false;

  const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
  if (imports.length) {
    const last = imports[imports.length - 1];
    const at = last.index + last[0].length;
    text = text.slice(0, at) + '\n' + importLine + text.slice(at);
  } else {
    text = importLine + '\n' + text;
  }

  write(rel, text.replace(/\n{3,}/g, '\n\n'));
  return true;
}

function cleanupImports(rel) {
  let text = read(rel);
  if (!text) return false;
  const before = text;

  const removeLines = [
    "import '../styles/closeflow-page-header-card-source-truth.css';",
    "import '../styles/closeflow-page-header-final-lock.css';",
    "import '../styles/closeflow-page-header-structure-lock.css';",
    "import '../styles/closeflow-page-header-copy-left-only.css';",
    "import '../styles/closeflow-page-header-copy-source-truth.css';",
    "import '../styles/closeflow-page-header-action-semantics-packet1.css';",
    "import '../styles/closeflow-command-actions-source-truth.css';",
    "import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';",
  ];

  for (const line of removeLines) {
    text = text.split(line).join('');
  }

  text = text.replace(/\n{3,}/g, '\n\n');
  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function tagNameAt(text, start) {
  const match = text.slice(start).match(/^<([A-Za-z][A-Za-z0-9_.$:-]*)\b/);
  return match ? match[1] : '';
}

function findOpeningTagWithNeedle(text, needle) {
  const idx = text.indexOf(needle);
  if (idx < 0) return null;
  let best = -1;
  for (const tag of ['<header', '<section', '<div']) {
    const found = text.lastIndexOf(tag, idx);
    if (found > best) best = found;
  }
  return best >= 0 ? best : null;
}

function extractBalanced(text, start) {
  const tag = tagNameAt(text, start);
  if (!tag) return null;
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  re.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = re.exec(text))) {
    const token = match[0];
    const closing = token.startsWith('</');
    const selfClosing = token.endsWith('/>');
    if (!closing && !selfClosing) depth += 1;
    if (closing) depth -= 1;
    if (depth === 0) {
      return { start, end: match.index + token.length, text: text.slice(start, match.index + token.length), tag };
    }
  }
  return null;
}

function findLegacyHeader(text) {
  const needles = [
    'data-cf-page-header="true"',
    'className="cf-page-header',
    'className="page-head',
    'className="activity-page-header',
    'className="notifications-page-header',
    'className="ai-drafts-header',
  ];

  for (const needle of needles) {
    const start = findOpeningTagWithNeedle(text, needle);
    if (start === null) continue;
    const element = extractBalanced(text, start);
    if (element) return element;
  }
  return null;
}

function stripPageHeaderPartAttrs(text) {
  return text
    .replace(/\s*data-cf-page-header-part="(?:copy|actions|kicker|title|description)"/g, '')
    .replace(/\s*data-cf-page-header-part='(?:copy|actions|kicker|title|description)'/g, '');
}

function findActionWrapper(block) {
  const markers = [
    'data-cf-page-header-part="actions"',
    'className="head-actions"',
    'className="cf-page-hero-actions',
    'className="ai-drafts-header-actions"',
    'className="activity-header-actions"',
    'className="notifications-header-actions"',
    'className="billing-header-actions"',
    'className="settings-header-actions"',
    'className="support-header-actions"',
  ];

  for (const marker of markers) {
    const start = findOpeningTagWithNeedle(block, marker);
    if (start === null) continue;
    const element = extractBalanced(block, start);
    if (element) return stripPageHeaderPartAttrs(element.text.trim());
  }

  return '';
}

function indent(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() ? pad + line : line))
    .join('\n');
}

function componentMarkup(pageKey, actions) {
  if (!actions) return `<CloseFlowPageHeaderV2 pageKey="${pageKey}" />`;

  return `<CloseFlowPageHeaderV2
          pageKey="${pageKey}"
          actions={
            <>
${indent(actions, 14)}
            </>
          }
        />`;
}

function replaceLegacyHeader(rel, pageKey) {
  let text = read(rel);
  if (!text) return 'missing';

  if (text.includes(`pageKey="${pageKey}"`) && !findLegacyHeader(text)) {
    const cleaned = stripPageHeaderPartAttrs(text).replace(/\n{3,}/g, '\n\n');
    if (cleaned !== text) {
      write(rel, cleaned);
      return 'already-v2-cleaned-attrs';
    }
    return 'already-v2';
  }

  const header = findLegacyHeader(text);
  if (!header) {
    const cleaned = stripPageHeaderPartAttrs(text).replace(/\n{3,}/g, '\n\n');
    if (cleaned !== text) {
      write(rel, cleaned);
      return 'no-header-cleaned-attrs';
    }
    return 'no-header';
  }

  const actions = findActionWrapper(header.text);
  const replacement = componentMarkup(pageKey, actions);
  text = text.slice(0, header.start) + replacement + text.slice(header.end);
  text = stripPageHeaderPartAttrs(text).replace(/\n{3,}/g, '\n\n');
  write(rel, text);
  return 'replaced';
}

function removeDuplicateCopies(rel, descriptions) {
  let text = read(rel);
  if (!text) return false;
  const before = text;

  for (const desc of descriptions) {
    const escaped = desc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Remove JSX paragraph/div/span lines containing old duplicate copy.
    text = text.replace(new RegExp(`\\n\\s*<p[^>]*>\\s*${escaped}\\s*</p>\\s*`, 'g'), '\n');
    text = text.replace(new RegExp(`\\n\\s*<div[^>]*>\\s*${escaped}\\s*</div>\\s*`, 'g'), '\n');
    text = text.replace(new RegExp(`\\n\\s*<span[^>]*>\\s*${escaped}\\s*</span>\\s*`, 'g'), '\n');

    // Remove raw JSX text node lines.
    text = text
      .split('\n')
      .filter((line) => !line.includes(desc))
      .join('\n');
  }

  text = text.replace(/\n{3,}/g, '\n\n');
  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

const targets = [
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

const staleDescriptions = [
  'Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.',
  'Baza osób i firm w tle. Klient łączy kontakt, leady, sprawy i historię relacji.',
  'Tematy już prowadzone operacyjnie. Tutaj pilnujesz obsługi, blokad, checklist i kolejnych działań po pozyskaniu klienta.',
  'Konkretne rzeczy do wykonania. Zadania mają pilnować ruchu, a nie leżeć jako martwe notatki.',
  'Tydzień, spotkania i deadline’y w jednym miejscu. Terminy mają być widoczne bez szukania po modułach.',
  'Gotowe checklisty do powtarzalnych spraw. Szablon ma skrócić start obsługi, nie zastępować decyzji operatora.',
  'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. AI może później pracować na tych szablonach, ale źródłem prawdy jest Twoja biblioteka.',
  'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. Źródłem prawdy jest Twoja biblioteka.',
  'Historia ruchów w aplikacji. Tu sprawdzasz, co zostało zrobione i gdzie coś mogło wypaść z procesu.',
  'Sprawdź, popraw i zatwierdź szkice przed zapisem w CRM.',
  'Sprawdź, popraw i zatwierdź szkice przed zapisem.',
  'Przypomnienia, zaległe rzeczy i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.',
  'Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.',
  'Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.',
  'Diagnostyka Quick Lead Capture i operatora AI. Ekran techniczny, bez providerów i kluczy dla użytkownika końcowego.',
];

const result = {
  importsAdded: [],
  importsCleaned: [],
  headers: {},
  duplicateCleanup: [],
};

for (const [rel, key] of targets) {
  if (!exists(rel)) continue;

  if (cleanupImports(rel)) result.importsCleaned.push(rel);
  if (ensureImport(rel, "import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';")) {
    result.importsAdded.push(rel + ':component');
  }
  if (ensureImport(rel, "import '../styles/closeflow-page-header-v2.css';")) {
    result.importsAdded.push(rel + ':css');
  }

  result.headers[rel] = replaceLegacyHeader(rel, key);

  if (removeDuplicateCopies(rel, staleDescriptions)) {
    result.duplicateCleanup.push(rel);
  }
}

// Write audit.
const auditRows = [];
for (const [rel] of targets) {
  const text = read(rel);
  if (!text) continue;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (
      line.includes('CloseFlowPageHeaderV2') ||
      line.includes('data-cf-page-header') ||
      line.includes('cf-page-header-row') ||
      line.includes('cf-page-hero-layout') ||
      line.includes('closeflow-page-header-card-source-truth') ||
      line.includes('closeflow-page-header-final-lock') ||
      line.includes('closeflow-page-header-structure-lock') ||
      line.includes('closeflow-page-header-copy-left-only') ||
      line.includes('PAGE_HEADER_CONTENT')
    ) {
      auditRows.push({ file: rel, line: index + 1, text: line.trim().slice(0, 260) });
    }
  });
}
fs.mkdirSync(p('docs/ui'), { recursive: true });
fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_AUDIT.generated.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), result, rows: auditRows }, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
