const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const packagePath = path.join(root, 'package.json');

const REPAIR = 'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_REPAIR_2026_05_12';
const PADDING = 'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING_2026_05_12';

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, value) {
  fs.writeFileSync(filePath, value, 'utf8');
}

function maskCode(source) {
  let out = '';
  let i = 0;
  let mode = 'code';
  let quote = '';
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (mode === 'code') {
      if (ch === '/' && next === '/') {
        out += '  ';
        i += 2;
        mode = 'line';
        continue;
      }
      if (ch === '/' && next === '*') {
        out += '  ';
        i += 2;
        mode = 'block';
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch;
        out += ' ';
        i += 1;
        mode = 'string';
        continue;
      }
      out += ch;
      i += 1;
      continue;
    }
    if (mode === 'line') {
      if (ch === '\n') {
        out += '\n';
        mode = 'code';
      } else {
        out += ' ';
      }
      i += 1;
      continue;
    }
    if (mode === 'block') {
      if (ch === '*' && next === '/') {
        out += '  ';
        i += 2;
        mode = 'code';
      } else {
        out += ch === '\n' ? '\n' : ' ';
        i += 1;
      }
      continue;
    }
    if (mode === 'string') {
      if (ch === '\\') {
        out += ' ';
        if (i + 1 < source.length) out += source[i + 1] === '\n' ? '\n' : ' ';
        i += 2;
        continue;
      }
      if (ch === quote) {
        out += ' ';
        i += 1;
        mode = 'code';
        quote = '';
        continue;
      }
      out += ch === '\n' ? '\n' : ' ';
      i += 1;
    }
  }
  return out;
}

function findMatchingBrace(source, openIndex) {
  const masked = maskCode(source);
  let depth = 0;
  for (let i = openIndex; i < masked.length; i += 1) {
    if (masked[i] === '{') depth += 1;
    if (masked[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function buildDepthMap(source, start, end) {
  const masked = maskCode(source);
  const depthAt = new Array(source.length).fill(0);
  let depth = 0;
  for (let i = start; i <= end; i += 1) {
    const ch = masked[i];
    if (ch === '{') {
      depth += 1;
      depthAt[i] = depth;
      continue;
    }
    depthAt[i] = depth;
    if (ch === '}') depth -= 1;
  }
  return { masked, depthAt };
}

function findParenEnd(masked, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < masked.length; i += 1) {
    if (masked[i] === '(') depth += 1;
    if (masked[i] === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findStatementEnd(masked, index) {
  let depthParen = 0;
  let depthBrace = 0;
  for (let i = index; i < masked.length; i += 1) {
    const ch = masked[i];
    if (ch === '(') depthParen += 1;
    else if (ch === ')') depthParen -= 1;
    else if (ch === '{') depthBrace += 1;
    else if (ch === '}') {
      depthBrace -= 1;
      if (depthBrace === 0) return i + 1;
    } else if (ch === ';' && depthParen === 0 && depthBrace === 0) {
      return i + 1;
    }
  }
  return -1;
}

function hookDummy(name) {
  if (name === 'useMemo') return 'useMemo(() => null, []);';
  if (name === 'useCallback') return 'useCallback(() => undefined, []);';
  if (name === 'useEffect') return 'useEffect(() => undefined, []);';
  if (name === 'useRef') return 'useRef(null);';
  if (name === 'useState') return 'useState(undefined);';
  if (name === 'useWorkspace') return 'useWorkspace();';
  if (name === 'useNavigate') return 'useNavigate();';
  if (name === 'useParams') return 'useParams();';
  return null;
}

function uniqueHookCallsBetween(source, masked, depthAt, start, end) {
  const hooks = [];
  const rx = /\b(useMemo|useCallback|useEffect|useRef|useState|useWorkspace|useNavigate|useParams)\s*\(/g;
  rx.lastIndex = start;
  let match;
  while ((match = rx.exec(masked)) && match.index < end) {
    const index = match.index;
    if (depthAt[index] === 1) hooks.push({ name: match[1], index });
  }
  return hooks;
}

function findMainReturn(masked, depthAt, bodyStart, bodyEnd) {
  const rx = /\breturn\s*\(/g;
  let last = -1;
  rx.lastIndex = bodyStart;
  let match;
  while ((match = rx.exec(masked)) && match.index < bodyEnd) {
    if (depthAt[match.index] === 1) last = match.index;
  }
  return last;
}

function findTopLevelIfBlocksWithReturn(masked, depthAt, bodyStart, bodyEnd, mainReturn) {
  const blocks = [];
  const rx = /\bif\s*\(/g;
  rx.lastIndex = bodyStart;
  let match;
  while ((match = rx.exec(masked)) && match.index < mainReturn) {
    const ifIndex = match.index;
    if (depthAt[ifIndex] !== 1) continue;
    const openParen = masked.indexOf('(', ifIndex);
    const closeParen = findParenEnd(masked, openParen);
    if (closeParen < 0) continue;
    const condition = masked.slice(openParen + 1, closeParen);
    if (!/(loading|client|clientId|notFound|error|missing)/i.test(condition)) continue;

    let cursor = closeParen + 1;
    while (/\s/.test(masked[cursor] || '')) cursor += 1;
    let end = -1;
    if (masked[cursor] === '{') {
      end = findMatchingBrace(masked, cursor) + 1;
    } else {
      end = findStatementEnd(masked, cursor);
    }
    if (end < 0 || end > bodyEnd) continue;
    const block = masked.slice(ifIndex, end);
    const returnRelative = block.search(/\breturn\s*\(/);
    if (returnRelative < 0) continue;
    if (block.includes(PADDING)) continue;
    blocks.push({ start: ifIndex, end, returnIndex: ifIndex + returnRelative });
  }
  return blocks;
}

if (!fs.existsSync(file)) {
  throw new Error('Missing src/pages/ClientDetail.tsx');
}

let source = read(file);

if (!source.includes(REPAIR)) {
  source = source.replace(
    /\/\* STAGE14B_CLIENT_NEXT_ACTION_CONTEXT \*\//,
    `/* STAGE14B_CLIENT_NEXT_ACTION_CONTEXT */\n/* ${REPAIR}: stabilizes ClientDetail early return hook order after React #310 */`,
  );
}

const exportIndex = source.indexOf('export default function ClientDetail');
if (exportIndex < 0) throw new Error('Cannot find export default function ClientDetail.');
const functionOpen = source.indexOf('{', exportIndex);
const functionClose = findMatchingBrace(source, functionOpen);
if (functionOpen < 0 || functionClose < 0) throw new Error('Cannot parse ClientDetail function body.');

let { masked, depthAt } = buildDepthMap(source, functionOpen, functionClose);
const mainReturn = findMainReturn(masked, depthAt, functionOpen + 1, functionClose);
if (mainReturn < 0) throw new Error('Cannot find main top-level return in ClientDetail.');

const earlyBlocks = findTopLevelIfBlocksWithReturn(masked, depthAt, functionOpen + 1, functionClose, mainReturn);
if (!earlyBlocks.length && !source.includes(PADDING)) {
  throw new Error('No unpadded early return block found in ClientDetail. Run a manual hook-order audit.');
}

let inserts = [];
for (const block of earlyBlocks) {
  const skipped = uniqueHookCallsBetween(source, masked, depthAt, block.end, mainReturn)
    .map((entry) => entry.name)
    .filter((name) => Boolean(hookDummy(name)));
  if (!skipped.length) continue;
  const uniqueKey = `${PADDING}_${block.returnIndex}`;
  if (source.includes(uniqueKey)) continue;
  const lines = [];
  lines.push(`/* ${PADDING} ${uniqueKey}`);
  lines.push('   Keeps hook order stable for loading/not-found ClientDetail renders.');
  lines.push(`   Mirrors skipped hooks: ${skipped.join(', ')}`);
  lines.push('*/');
  for (const hook of skipped) lines.push(hookDummy(hook));
  inserts.push({ index: block.returnIndex, text: lines.map((line) => '      ' + line).join('\n') + '\n' });
}

if (inserts.length) {
  inserts.sort((a, b) => b.index - a.index);
  for (const insert of inserts) {
    source = source.slice(0, insert.index) + insert.text + source.slice(insert.index);
  }
  write(file, source);
} else if (!source.includes(PADDING)) {
  throw new Error('ClientDetail hook-order repair found early returns but no skipped hooks to pad.');
}

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-clientdetail-hook-order-310-repair'] = 'node scripts/check-closeflow-clientdetail-hook-order-310-repair.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('OK patch-closeflow-clientdetail-hook-order-310-repair: ClientDetail early return hook order stabilized.');
