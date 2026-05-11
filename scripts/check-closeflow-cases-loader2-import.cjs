#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casesPath = path.join(repo, 'src', 'pages', 'Cases.tsx');
const failures = [];

function fail(message) {
  failures.push(message);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function importBlocks(moduleName) {
  const blocks = [];
  const re = /^import\b[\s\S]*?;\s*/gm;
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

function singleImport(moduleName) {
  const blocks = importBlocks(moduleName);
  if (blocks.length !== 1) {
    fail(`${moduleName} import count must be exactly 1, got ${blocks.length}`);
    return '';
  }
  return blocks[0];
}

function requireNames(moduleName, names) {
  const block = singleImport(moduleName);
  const found = namesFromImportBlock(block);
  for (const name of names) {
    if (!found.has(name)) fail(`${moduleName} import is missing ${name}`);
  }
  return found;
}

if (!fs.existsSync(casesPath)) {
  console.error(`FAILED closeflow cases import contract: missing ${casesPath}`);
  process.exit(1);
}

const source = fs.readFileSync(casesPath, 'utf8');

const reactNames = requireNames('react', ['useEffect', 'useMemo', 'useRef', 'useState', 'FormEvent']);
const routerNames = requireNames('react-router-dom', ['Link', 'useSearchParams']);
const lucideNames = requireNames('lucide-react', [
  'AlertTriangle',
  'CheckCircle2',
  'ChevronRight',
  'Clock',
  'ExternalLink',
  'FileText',
  'Loader2',
  'Plus',
  'Search',
  'Trash2',
  'X',
]);
const dateFnsNames = requireNames('date-fns', ['format']);
const dateFnsLocaleNames = requireNames('date-fns/locale', ['pl']);
const entityIconNames = requireNames('../components/ui-system/EntityIcon', ['EntityIcon']);

for (const forbidden of ['useEffect', 'useMemo', 'useRef', 'useState', 'FormEvent']) {
  if (routerNames.has(forbidden)) fail(`${forbidden} must not be imported from react-router-dom`);
  if (lucideNames.has(forbidden)) fail(`${forbidden} must not be imported from lucide-react`);
}

if (lucideNames.has('Link')) fail('Link must not be imported from lucide-react in Cases.tsx');
if (reactNames.has('Link')) fail('Link must not be imported from react in Cases.tsx');
if (routerNames.has('Clock')) fail('Clock must not be imported from react-router-dom in Cases.tsx');
if (reactNames.has('Clock')) fail('Clock must not be imported from react in Cases.tsx');
if (routerNames.has('format')) fail('format must not be imported from react-router-dom in Cases.tsx');
if (lucideNames.has('format')) fail('format must not be imported from lucide-react in Cases.tsx');
if (routerNames.has('pl')) fail('pl must not be imported from react-router-dom in Cases.tsx');
if (lucideNames.has('pl')) fail('pl must not be imported from lucide-react in Cases.tsx');

const requiredLiteralImports = [
  "import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';",
  "import { Link, useSearchParams } from 'react-router-dom';",
  "import { AlertTriangle, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Loader2, Plus, Search, Trash2, X } from 'lucide-react';",
  "import { format } from 'date-fns';",
  "import { pl } from 'date-fns/locale';",
  "import { EntityIcon } from '../components/ui-system/EntityIcon';",
];

for (const literal of requiredLiteralImports) {
  if (!source.includes(literal)) fail(`missing canonical import line: ${literal}`);
}

if (failures.length) {
  console.error(`FAILED closeflow cases import contract: ${failures.join('; ')}`);
  process.exit(1);
}

console.log('CLOSEFLOW_CASES_IMPORT_CONTRACT_OK');
