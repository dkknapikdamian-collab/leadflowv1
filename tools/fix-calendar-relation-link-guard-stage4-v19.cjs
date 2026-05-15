#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const shouldFix = process.argv.includes('--fix');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function write(relativePath, body) {
  fs.mkdirSync(path.dirname(path.join(repoRoot, relativePath)), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, relativePath), body, 'utf8');
}

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function importBlocks(source, moduleName) {
  const blocks = [];
  const re = /import\b[\s\S]*?;\s*/g;
  for (const match of source.matchAll(re)) {
    const declaration = match[0];
    const moduleMatch = declaration.match(/\bfrom\s+['"]([^'"]+)['"]/);
    if (moduleMatch && moduleMatch[1] === moduleName) blocks.push(declaration.trim());
  }
  return blocks;
}

function namesFromImportBlock(block) {
  const named = block.match(/\{([\s\S]*?)\}/);
  if (!named) return new Set();
  return new Set(
    named[1]
      .split(',')
      .map((part) => part.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/g, '').trim())
      .filter(Boolean)
      .map((part) => part.replace(/^type\s+/, '').trim())
      .map((part) => {
        const alias = part.match(/\s+as\s+(.+)$/);
        return (alias ? alias[1] : part).trim();
      })
  );
}

function namesFromModule(source, moduleName) {
  const names = new Set();
  for (const block of importBlocks(source, moduleName)) {
    for (const name of namesFromImportBlock(block)) names.add(name);
  }
  return names;
}

function updatePackageJson() {
  const packagePath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(packagePath)) return;
  const raw = stripBom(fs.readFileSync(packagePath, 'utf8'));
  const json = JSON.parse(raw);
  json.scripts = json.scripts || {};
  json.scripts['check:stage87-calendar-relation-link-guard'] = 'node --test tests/stage87-calendar-relation-link-guard.test.cjs';
  fs.writeFileSync(packagePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
}

function buildCalendarRelationLinksTest() {
  return String.raw`const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function importBlocks(source, moduleName) {
  const blocks = [];
  const re = /import\b[\s\S]*?;\s*/g;
  for (const match of source.matchAll(re)) {
    const declaration = match[0];
    const moduleMatch = declaration.match(/\bfrom\s+['"]([^'"]+)['"]/);
    if (moduleMatch && moduleMatch[1] === moduleName) blocks.push(declaration.trim());
  }
  return blocks;
}

function namesFromImportBlock(block) {
  const named = block.match(/\{([\s\S]*?)\}/);
  if (!named) return new Set();
  return new Set(
    named[1]
      .split(',')
      .map((part) => part.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/g, '').trim())
      .filter(Boolean)
      .map((part) => part.replace(/^type\s+/, '').trim())
      .map((part) => {
        const alias = part.match(/\s+as\s+(.+)$/);
        return (alias ? alias[1] : part).trim();
      })
  );
}

function namesFromModule(source, moduleName) {
  const names = new Set();
  for (const block of importBlocks(source, moduleName)) {
    for (const name of namesFromImportBlock(block)) names.add(name);
  }
  return names;
}

test('Calendar imports router Link for relation navigation', () => {
  const source = read('src/pages/Calendar.tsx');
  const routerNames = namesFromModule(source, 'react-router-dom');
  assert.ok(routerNames.has('Link'), 'Calendar.tsx must import Link from react-router-dom for relation navigation');
});

test('Calendar entry card links to related lead and case', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.ok(source.includes('/leads/${entry.raw.leadId}'));
  assert.ok(source.includes('/cases/${entry.raw.caseId}'));

  assert.ok(source.includes('Otwórz lead'));
  assert.ok(source.includes('Otwórz sprawę'));
});

test('Calendar entry relation links documentation exists', () => {
  const doc = read('docs/CALENDAR_ENTRY_RELATION_LINKS_2026-04-24.md');

  assert.ok(doc.includes('leadId -> Otwórz lead'));
  assert.ok(doc.includes('caseId -> Otwórz sprawę'));
  assert.match(doc, /centrum operacyjnym/);
});
`;
}

function buildStage87Test() {
  return String.raw`const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('calendar relation link guard checks import semantics instead of exact import formatting', () => {
  const guard = read('tests/calendar-entry-relation-links.test.cjs');
  assert.ok(guard.includes('namesFromModule'), 'guard should parse imports semantically');
  assert.ok(!guard.includes("/import \\{ Link \\} from 'react-router-dom'/"), 'guard must not require one exact import formatting line');
});
`;
}

function buildReport() {
  return [
    '# Stage 4 V19 - calendar relation link guard repair',
    '',
    '## Cel',
    'Naprawic kruchy test kalendarza, ktory wymagal literalnej linii importu `import { Link } from react-router-dom`, mimo ze realny kontrakt jest prostszy: Calendar.tsx musi importowac `Link` z `react-router-dom`.',
    '',
    '## Zakres',
    '- Zmieniono test `tests/calendar-entry-relation-links.test.cjs` na semantyczne parsowanie importow.',
    '- Dodano guard jakosci `tests/stage87-calendar-relation-link-guard.test.cjs`, ktory pilnuje, zeby test nie wrocil do kruchego regexu po jednej linii.',
    '- Nie zmieniono logiki UI kalendarza.',
    '- Nie usunieto testu i nie wylaczono release gate.',
    '',
    '## Powod',
    'Lokalny `Calendar.tsx` moze miec `import { Link, useSearchParams } from react-router-dom`; to jest poprawne, bo `Link` nadal pochodzi z routera. Stary guard wymagal konkretnego formatu, a nie realnego kontraktu.',
    '',
    '## Weryfikacja',
    '- `node --test tests/calendar-entry-relation-links.test.cjs`',
    '- `node --test tests/stage87-calendar-relation-link-guard.test.cjs`',
    '- `npm run build`',
    '- `npm run verify:closeflow:quiet`',
    '',
    '## Commit / push',
    'Nie wykonywac automatycznie w tej paczce.',
    '',
  ].join('\n');
}

function main() {
  const calendarPath = 'src/pages/Calendar.tsx';
  const calendar = read(calendarPath);
  const routerNames = namesFromModule(calendar, 'react-router-dom');
  assert.ok(routerNames.has('Link'), 'Calendar.tsx does not import Link from react-router-dom. This is a real UI contract failure, not a guard-format issue.');

  if (!shouldFix) {
    console.log('OK: Calendar imports Link from react-router-dom. Run with --fix to repair the brittle guard.');
    return;
  }

  write('tests/calendar-entry-relation-links.test.cjs', buildCalendarRelationLinksTest());
  write('tests/stage87-calendar-relation-link-guard.test.cjs', buildStage87Test());
  write('docs/audits/calendar-relation-link-guard-stage4-v19-2026-05-15.md', buildReport());
  updatePackageJson();

  const updatedGuard = read('tests/calendar-entry-relation-links.test.cjs');
  assert.ok(updatedGuard.includes('namesFromModule'));
  assert.ok(!updatedGuard.includes("/import \\{ Link \\} from 'react-router-dom'/"));
  console.log('OK: Stage 4 V19 repaired calendar relation link guard without hiding the UI contract.');
}

main();
