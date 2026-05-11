const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function full(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  const file = full(rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function write(rel, text) {
  fs.writeFileSync(full(rel), text, 'utf8');
}

function ensureImport(rel, importLine) {
  let text = read(rel);
  if (!text) throw new Error(rel + ' not found');
  if (text.includes(importLine)) return false;
  const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
  if (imports.length) {
    const last = imports[imports.length - 1];
    const at = last.index + last[0].length;
    text = text.slice(0, at) + '\n' + importLine + text.slice(at);
  } else {
    text = importLine + '\n' + text;
  }
  write(rel, text);
  return true;
}

function cleanupImports(rel) {
  let text = read(rel);
  if (!text) return false;
  const before = text;
  const lines = [
    "import '../styles/closeflow-page-header-card-source-truth.css';",
    "import '../styles/closeflow-page-header-final-lock.css';",
    "import '../styles/closeflow-page-header-structure-lock.css';",
    "import '../styles/closeflow-page-header-copy-left-only.css';",
    "import '../styles/closeflow-page-header-copy-source-truth.css';",
    "import '../styles/closeflow-page-header-action-semantics-packet1.css';",
    "import '../styles/closeflow-command-actions-source-truth.css';",
    "import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';",
  ];
  for (const line of lines) {
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

function findOpeningTagWithAttribute(text, attr) {
  const attrIndex = text.indexOf(attr);
  if (attrIndex < 0) return null;
  let best = -1;
  for (const tag of ['<header', '<section', '<div']) {
    const idx = text.lastIndexOf(tag, attrIndex);
    if (idx > best) best = idx;
  }
  return best >= 0 ? best : null;
}

function extractBalancedElement(text, start) {
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
      return { start, end: match.index + token.length, text: text.slice(start, match.index + token.length) };
    }
  }
  return null;
}

function findLegacyHeader(text) {
  const attrs = [
    'data-cf-page-header="true"',
    'className="cf-page-header page-head"',
    'className="cf-page-header"',
    'className="cf-page-header rounded',
  ];
  for (const attr of attrs) {
    const start = findOpeningTagWithAttribute(text, attr);
    if (start === null) continue;
    const element = extractBalancedElement(text, start);
    if (element) return element;
  }
  return null;
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
    const attrIndex = block.indexOf(marker);
    if (attrIndex < 0) continue;
    const start = findOpeningTagWithAttribute(block, marker);
    if (start === null) continue;
    const element = extractBalancedElement(block, start);
    if (element) return element.text.trim();
  }
  return '';
}

function indent(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text.split(/\r?\n/).map((line) => line.trim() ? pad + line : line).join('\n');
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

function replaceHeader(rel, pageKey) {
  let text = read(rel);
  if (!text) throw new Error(rel + ' not found');

  const legacy = findLegacyHeader(text);
  if (!legacy) {
    return false;
  }

  const actions = findActionWrapper(legacy.text);
  const replacement = componentMarkup(pageKey, actions);
  text = text.slice(0, legacy.start) + replacement + text.slice(legacy.end);
  text = text.replace(/\n{3,}/g, '\n\n');
  write(rel, text);
  return true;
}

const targets = [
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/Clients.tsx', 'clients'],
];

const result = { cleanupImports: [], imports: [], replaced: [] };

for (const [rel, pageKey] of targets) {
  if (cleanupImports(rel)) result.cleanupImports.push(rel);
  if (ensureImport(rel, "import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';")) result.imports.push(rel + ':component');
  if (ensureImport(rel, "import '../styles/closeflow-page-header-v2.css';")) result.imports.push(rel + ':css');
  if (replaceHeader(rel, pageKey)) result.replaced.push(rel);
}

console.log('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_REPAIR2_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
