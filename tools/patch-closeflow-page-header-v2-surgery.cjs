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
  if (!text) return false;
  const before = text;
  if (text.includes(importLine)) return false;

  const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
  if (imports.length) {
    const last = imports[imports.length - 1];
    const at = last.index + last[0].length;
    text = text.slice(0, at) + '\n' + importLine + text.slice(at);
  } else {
    text = importLine + '\n' + text;
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function removeOldPageHeaderCssImports(rel) {
  let text = read(rel);
  if (!text) return false;
  const before = text;

  const removeImports = [
    "import '../styles/closeflow-page-header-card-source-truth.css';",
    "import '../styles/closeflow-page-header-final-lock.css';",
    "import '../styles/closeflow-page-header-structure-lock.css';",
    "import '../styles/closeflow-page-header-copy-left-only.css';",
    "import '../styles/closeflow-page-header-copy-source-truth.css';",
    "import '../styles/closeflow-page-header-action-semantics-packet1.css';",
    "import '../styles/closeflow-command-actions-source-truth.css';",
  ];

  for (const imp of removeImports) {
    text = text.split(imp).join('');
  }

  text = text.replace(/\n{3,}/g, '\n\n');

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function findHeaderBlock(text) {
  const marker = 'data-cf-page-header="true"';
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) return null;

  const start = text.lastIndexOf('<header', markerIndex);
  if (start < 0) return null;

  const endTag = '</header>';
  const end = text.indexOf(endTag, markerIndex);
  if (end < 0) return null;

  return {
    start,
    end: end + endTag.length,
    block: text.slice(start, end + endTag.length),
  };
}

function findOpeningTagStart(block, attrIndex) {
  const candidates = ['<div', '<section', '<nav'];
  let best = -1;
  for (const candidate of candidates) {
    const idx = block.lastIndexOf(candidate, attrIndex);
    if (idx > best) best = idx;
  }
  return best;
}

function tagNameAt(block, start) {
  const match = block.slice(start).match(/^<([A-Za-z0-9_.$:-]+)/);
  return match ? match[1] : '';
}

function extractBalancedElement(block, start) {
  const tag = tagNameAt(block, start);
  if (!tag) return null;

  const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  tagRe.lastIndex = start;
  let depth = 0;
  let match;

  while ((match = tagRe.exec(block))) {
    const text = match[0];
    const closing = text.startsWith('</');
    const selfClosing = text.endsWith('/>');
    if (!closing && !selfClosing) depth += 1;
    if (closing) depth -= 1;

    if (depth === 0) {
      return {
        start,
        end: match.index + text.length,
        text: block.slice(start, match.index + text.length),
      };
    }
  }

  return null;
}

function extractActions(block) {
  const needles = [
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

  let index = -1;
  for (const needle of needles) {
    index = block.indexOf(needle);
    if (index >= 0) break;
  }
  if (index < 0) return '';

  const openStart = findOpeningTagStart(block, index);
  if (openStart < 0) return '';

  const extracted = extractBalancedElement(block, openStart);
  return extracted ? extracted.text.trim() : '';
}

function indentBlock(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() ? pad + line : line))
    .join('\n');
}

function replacementComponent(pageKey, actions) {
  if (!actions) {
    return `<CloseFlowPageHeaderV2 pageKey="${pageKey}" />`;
  }

  return `<CloseFlowPageHeaderV2
          pageKey="${pageKey}"
          actions={
            <>
${indentBlock(actions, 14)}
            </>
          }
        />`;
}

function replaceHeader(rel, pageKey) {
  let text = read(rel);
  if (!text) throw new Error(rel + ' not found');
  const before = text;

  const header = findHeaderBlock(text);
  if (!header) {
    if (text.includes(`pageKey="${pageKey}"`) && text.includes('CloseFlowPageHeaderV2')) return false;
    throw new Error('No legacy data-cf-page-header header found in ' + rel);
  }

  const actions = extractActions(header.block);
  const replacement = replacementComponent(pageKey, actions);
  text = text.slice(0, header.start) + replacement + text.slice(header.end);

  // Remove duplicated blank lines created by removing large header block.
  text = text.replace(/\n{3,}/g, '\n\n');

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

const targets = [
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/Clients.tsx', 'clients'],
];

const result = {
  copiedComponent: true,
  imports: [],
  removedOldImports: [],
  replacedHeaders: [],
};

for (const [rel, pageKey] of targets) {
  if (removeOldPageHeaderCssImports(rel)) result.removedOldImports.push(rel);
  if (ensureImport(rel, "import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';")) result.imports.push(rel);
  if (ensureImport(rel, "import '../styles/closeflow-page-header-v2.css';")) result.imports.push(rel + ':css');
  if (replaceHeader(rel, pageKey)) result.replacedHeaders.push(rel);
}

console.log('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
