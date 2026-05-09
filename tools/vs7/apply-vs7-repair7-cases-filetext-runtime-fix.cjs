#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/pages/Cases.tsx';
const filePath = path.join(root, rel);
if (!fs.existsSync(filePath)) {
  throw new Error(`Missing ${rel}`);
}

let text = fs.readFileSync(filePath, 'utf8');
const original = text;

if (!text.includes("from 'lucide-react'")) {
  throw new Error('Cases.tsx is missing lucide-react import block');
}

// The release gate requires FileText to be imported from lucide-react when the Cases metric icon uses it.
const lucideImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/;
const match = text.match(lucideImportRe);
if (!match) {
  throw new Error('Cannot locate lucide-react import block in Cases.tsx');
}

if (!match[1].split(',').map((item) => item.trim()).includes('FileText')) {
  const names = match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const insertAfter = names.indexOf('ExternalLink');
  if (insertAfter >= 0) {
    names.splice(insertAfter + 1, 0, 'FileText');
  } else {
    names.push('FileText');
  }
  const replacement = 'import {\n  ' + names.join(',\n  ') + "\n} from 'lucide-react';";
  text = text.replace(lucideImportRe, replacement);
}

const metricNeedle = /(<StatShortcutCard\s+\n\s*label="W realizacji"\s+\n\s*value=\{stats\.total\}\s+\n\s*icon=\{)TemplateEntityIcon(\})/;
if (metricNeedle.test(text)) {
  text = text.replace(metricNeedle, '$1FileText$2');
} else if (!/label="W realizacji"[\s\S]{0,220}icon=\{FileText\}/.test(text)) {
  throw new Error('Cannot patch W realizacji metric icon to FileText');
}

// If TemplateEntityIcon is no longer used on this page, remove it from the ui-system import to keep the file clean.
const withoutUiImport = text.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/ui-system['"];?/, (full, body) => {
  const names = body.split(',').map((item) => item.trim()).filter(Boolean);
  const usedNames = names.filter((name) => name !== 'TemplateEntityIcon' || new RegExp(`\\b${name}\\b`).test(text.replace(full, '')));
  return 'import {\n  ' + usedNames.join(',\n  ') + " } from '../components/ui-system';";
});
text = withoutUiImport;

if (!text.includes('FileText')) {
  throw new Error('Cases.tsx should expose FileText after patch');
}
const finalLucide = text.match(lucideImportRe);
if (!finalLucide || !finalLucide[1].split(',').map((item) => item.trim()).includes('FileText')) {
  throw new Error('FileText must be imported from lucide-react after patch');
}
if (!/label="W realizacji"[\s\S]{0,220}icon=\{FileText\}/.test(text)) {
  throw new Error('Cases W realizacji metric must use FileText after patch');
}

if (text !== original) {
  fs.writeFileSync(filePath, text);
}

console.log('CLOSEFLOW_VS7_REPAIR7_CASES_FILETEXT_RUNTIME_FIX_PATCHED');
