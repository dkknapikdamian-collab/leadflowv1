#!/usr/bin/env node
/* CLOSEFLOW_WIDE_SYNTAX_GATE_BASELINE_SAFE_2026_05_09_REPAIR
   Baseline-safe guard:
   - fatal: TS/TSX syntax transform errors, broken import braces, text leaked into import blocks
   - warning: legacy BOM/FEFF and pre-existing import debt
   - Windows-safe: uses esbuild JS API, never spawns node_modules/.bin/esbuild.cmd
*/
const fs = require('fs');
const path = require('path');

let esbuild = null;
try {
  esbuild = require('esbuild');
} catch {
  esbuild = null;
}

const repo = process.cwd();
const failures = [];
const warnings = [];

const suspiciousUiSystemNames = [
  'ActionIcon',
  'AddActionIcon',
  'EditActionIcon',
  'DeleteActionIcon',
  'RestoreActionIcon',
  'SearchActionIcon',
  'SaveActionIcon',
  'CancelActionIcon',
  'BackActionIcon',
  'CopyActionIcon',
  'OpenActionIcon',
  'ArchiveActionIcon',
  'FilterActionIcon',
  'SettingsActionIcon',
  'EntityIcon',
  'ClientEntityIcon',
  'LeadEntityIcon',
  'CaseEntityIcon',
  'TaskEntityIcon',
  'EventEntityIcon',
  'ActivityEntityIcon',
  'PaymentEntityIcon',
  'CommissionEntityIcon',
  'AiEntityIcon',
  'TemplateEntityIcon',
  'NotificationEntityIcon',
];

const reactOnlyNames = [
  'useState',
  'useEffect',
  'useMemo',
  'useRef',
  'useCallback',
  'useReducer',
  'useLayoutEffect',
  'FormEvent',
  'ReactNode',
  'ComponentPropsWithoutRef',
  'PropsWithChildren',
];

function toRel(file) {
  return path.relative(repo, file).split(path.sep).join('/');
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function hasBom(file) {
  const buf = fs.readFileSync(file);
  return buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
}

function fail(rel, msg) {
  failures.push(`${rel}: ${msg}`);
}

function warn(rel, msg) {
  warnings.push(`${rel}: ${msg}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function importedNameRegex(name) {
  return new RegExp(`(^|[\\s,{])(?:type\\s+)?${escapeRegExp(name)}(?:\\s+as\\s+\\w+)?([\\s,}]|$)`);
}

function hasUiSystemImportPath(source) {
  return /(^\.\/ui-system$)|(^\.\.\/ui-system$)|(components\/ui-system$)/.test(source);
}

const srcFiles = walk(path.join(repo, 'src')).filter((file) => /\.(ts|tsx)$/.test(file));
const scriptFiles = walk(path.join(repo, 'scripts')).filter((file) => /\.cjs$/.test(file));

for (const file of srcFiles) {
  const rel = toRel(file);
  const text = readText(file);

  if (hasBom(file) || text.includes('\uFEFF')) {
    warn(rel, 'Source file contains legacy BOM/FEFF');
  }

  if (/import\s*\{\s*[\]\[]/.test(text)) {
    fail(rel, 'Broken import brace near start of import block');
  }

  if (/import\s*\{[^}]*\b(?:dni bez ruchu|najblizsza akcja|asystent aplikacji|Pe\u0142ny asystent AI|Digest gotowy|workspace\?\.)/s.test(text)) {
    fail(rel, 'Non-import text leaked into import block');
  }

  const imports = [...text.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"];?/g)];
  for (const match of imports) {
    const body = match[1];
    const source = match[2];

    if (hasUiSystemImportPath(source)) {
      const badReact = reactOnlyNames.filter((name) => importedNameRegex(name).test(body));
      if (badReact.length) fail(rel, `React hooks/types imported from ui-system: ${badReact.join(', ')}`);
    }

    if (source === 'react' || source === 'lucide-react') {
      const suspicious = suspiciousUiSystemNames.filter((name) => importedNameRegex(name).test(body));
      if (suspicious.length) {
        warn(rel, `ui-system-like names imported from ${source}: ${suspicious.join(', ')}`);
      }
    }
  }
}

for (const file of scriptFiles) {
  const rel = toRel(file);
  if (hasBom(file)) {
    if (rel === 'scripts/check-closeflow-wide-syntax-gate.cjs') {
      fail(rel, 'Current wide syntax gate starts with BOM');
    } else {
      warn(rel, 'Legacy CJS script starts with BOM before shebang');
    }
  }
}

if (esbuild) {
  for (const file of srcFiles) {
    const rel = toRel(file);
    const loader = file.endsWith('.tsx') ? 'tsx' : 'ts';
    const code = readText(file);
    try {
      esbuild.transformSync(code, {
        loader,
        sourcefile: rel,
        format: 'esm',
        jsx: 'automatic',
        target: 'es2020',
        tsconfigRaw: {
          compilerOptions: {
            jsx: 'react-jsx',
            experimentalDecorators: true,
            useDefineForClassFields: false,
          },
        },
      });
    } catch (error) {
      const details = String(error && error.message ? error.message : error).split(/\r?\n/).slice(0, 6).join(' | ');
      fail(rel, `esbuild transform failed: ${details || 'UNKNOWN_ESBUILD_ERROR'}`);
    }
  }
} else {
  warn('repo', 'esbuild package could not be required; TS/TSX transform check skipped');
}

if (warnings.length) {
  console.log('CLOSEFLOW_WIDE_SYNTAX_GATE_WARNINGS');
  for (const item of warnings) console.log(item);
}

if (failures.length) {
  console.error('CLOSEFLOW_WIDE_SYNTAX_GATE_FAIL');
  for (const item of failures) console.error(item);
  process.exit(1);
}

console.log('CLOSEFLOW_WIDE_SYNTAX_GATE_OK');
console.log(`src_files_checked=${srcFiles.length}`);
console.log(`warnings=${warnings.length}`);
console.log(`esbuild_api_check=${esbuild ? 'enabled' : 'skipped'}`);
