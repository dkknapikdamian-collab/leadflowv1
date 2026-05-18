const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const targetFiles = [
  'src/pages/CaseDetail.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/Templates.tsx',
];
const testPath = 'tests/stage116-dialog-description-accessibility-contract.test.cjs';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content, 'utf8');
}

function ensureDialogDescriptionImport(text, relativePath) {
  if (!text.includes("../components/ui/dialog")) return text;
  if (!/\bDialogContent\b/.test(text)) return text;

  const importPattern = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/ui\/dialog['"];?/;
  const match = text.match(importPattern);
  if (!match) {
    throw new Error(`${relativePath}: could not find ui dialog import block`);
  }
  if (/\bDialogDescription\b/.test(match[1])) return text;

  const names = match[1];
  let nextNames;
  if (/\bDialogTitle\b/.test(names)) {
    nextNames = names.replace(/\bDialogTitle\b/, 'DialogTitle, DialogDescription');
  } else {
    nextNames = names.trimEnd() + ', DialogDescription';
  }
  return text.replace(importPattern, `import {${nextNames}} from '../components/ui/dialog';`);
}

function normalizeTitle(rawTitle) {
  return String(rawTitle || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function descriptionFor(relativePath, title) {
  const normalized = String(title || '').toLowerCase();
  if (relativePath.endsWith('Calendar.tsx')) {
    if (normalized.includes('usu')) return 'Potwierdź usunięcie wpisu z kalendarza albo wróć bez zmian.';
    if (normalized.includes('wydarzenie') || normalized.includes('zadanie') || normalized.includes('kalendarz')) {
      return 'Zmień dane wpisu i zapisz, aby zaktualizować kalendarz.';
    }
    return 'Uzupełnij dane wpisu i zapisz, aby zaktualizować kalendarz.';
  }

  if (relativePath.endsWith('CaseDetail.tsx')) {
    if (normalized.includes('wpłat') || normalized.includes('płatno') || normalized.includes('prowizj') || normalized.includes('wartość')) {
      return 'Uzupełnij dane rozliczenia i zapisz, aby zaktualizować finanse sprawy.';
    }
    if (normalized.includes('brak')) return 'Uzupełnij brakujący element i zapisz go w checklistach sprawy.';
    if (normalized.includes('spraw')) return 'Uzupełnij dane sprawy i zapisz zmiany w kartotece.';
    return 'Uzupełnij dane i zapisz zmiany w sprawie.';
  }

  if (relativePath.endsWith('LeadDetail.tsx')) {
    if (normalized.includes('zadanie')) return 'Uzupełnij dane zadania i zapisz, aby zaplanować pracę przy leadzie.';
    if (normalized.includes('wydarzenie')) return 'Uzupełnij dane wydarzenia i zapisz, aby zaplanować termin przy leadzie.';
    if (normalized.includes('notat')) return 'Uzupełnij treść notatki i zapisz ją w historii leada.';
    if (normalized.includes('płat')) return 'Uzupełnij dane płatności i zapisz je przy leadzie.';
    if (normalized.includes('lead')) return 'Uzupełnij dane leada i zapisz zmiany w kartotece.';
    return 'Uzupełnij dane i zapisz zmiany w kartotece leada.';
  }

  if (relativePath.endsWith('Templates.tsx')) {
    if (normalized.includes('usu')) return 'Potwierdź usunięcie szablonu albo wróć bez zmian.';
    return 'Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów.';
  }

  return 'Uzupełnij dane i zapisz zmiany.';
}

function insertHeaderDescriptions(text, relativePath) {
  return text.replace(/<DialogHeader>([\s\S]*?)<\/DialogHeader>/g, (full, inner) => {
    if (!/<DialogTitle\b/.test(inner)) return full;
    if (/<DialogDescription\b/.test(inner)) return full;

    const titleMatch = inner.match(/<DialogTitle[^>]*>([\s\S]*?)<\/DialogTitle>/);
    const titleText = normalizeTitle(titleMatch?.[1] || '');
    const description = descriptionFor(relativePath, titleText);
    const titleCloseIndex = inner.indexOf('</DialogTitle>');
    if (titleCloseIndex === -1) return full;

    const titleStart = inner.lastIndexOf('\n', titleCloseIndex);
    const titleLine = titleStart >= 0 ? inner.slice(titleStart + 1, inner.indexOf('<DialogTitle', titleStart)) : '';
    const indentMatch = titleLine.match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : '  ';
    const insertion = `\n${indent}<DialogDescription>${description}</DialogDescription>`;
    const nextInner = inner.slice(0, titleCloseIndex + '</DialogTitle>'.length) + insertion + inner.slice(titleCloseIndex + '</DialogTitle>'.length);
    return `<DialogHeader>${nextInner}</DialogHeader>`;
  });
}

function addAriaFallbackForHeaderlessContent(text) {
  let cursor = 0;
  let output = '';
  const openPattern = /<DialogContent\b[^>]*>/g;
  let match;

  while ((match = openPattern.exec(text)) !== null) {
    const openStart = match.index;
    const openTag = match[0];
    const closeStart = text.indexOf('</DialogContent>', openPattern.lastIndex);
    if (closeStart === -1) continue;
    const closeEnd = closeStart + '</DialogContent>'.length;
    const block = text.slice(openStart, closeEnd);

    output += text.slice(cursor, openStart);
    if (!/<DialogDescription\b/.test(block) && !/aria-describedby\s*=/.test(openTag)) {
      const patchedOpenTag = openTag.replace('<DialogContent', '<DialogContent aria-describedby={undefined}');
      output += patchedOpenTag + text.slice(openStart + openTag.length, closeEnd);
    } else {
      output += block;
    }
    cursor = closeEnd;
    openPattern.lastIndex = closeEnd;
  }

  if (cursor === 0) return text;
  output += text.slice(cursor);
  return output;
}

function patchPage(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing target file: ${relativePath}`);
  }
  const before = read(relativePath);
  let after = before;
  after = ensureDialogDescriptionImport(after, relativePath);
  after = insertHeaderDescriptions(after, relativePath);
  after = addAriaFallbackForHeaderlessContent(after);

  if (after !== before) {
    write(relativePath, after);
    console.log(`Stage116 patched ${relativePath}`);
    return true;
  }

  console.log(`Stage116 already satisfied ${relativePath}`);
  return false;
}

function patchQuietGate() {
  const relativePath = 'scripts/closeflow-release-check-quiet.cjs';
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing ${relativePath}`);
  let text = read(relativePath);
  if (text.includes(testPath)) {
    console.log('Stage116 quiet gate already includes dialog description contract.');
    return false;
  }

  const stage115Entry = "  'tests/stage115-case-detail-render-runtime-contract.test.cjs',";
  if (text.includes(stage115Entry)) {
    text = text.replace(stage115Entry, stage115Entry + `\n  '${testPath}',`);
  } else {
    const marker = '];';
    const index = text.indexOf(marker);
    if (index === -1) throw new Error('Could not find requiredTests array end in quiet gate.');
    text = text.slice(0, index) + `  '${testPath}',\n` + text.slice(index);
  }
  write(relativePath, text);
  console.log('Stage116 patched scripts/closeflow-release-check-quiet.cjs');
  return true;
}

for (const relativePath of targetFiles) patchPage(relativePath);
patchQuietGate();

console.log('Stage116 DialogDescription accessibility patch completed.');
