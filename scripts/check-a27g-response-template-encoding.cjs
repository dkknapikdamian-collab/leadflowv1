#!/usr/bin/env node
const fs = require('node:fs');

function read(file) {
  if (!fs.existsSync(file)) {
    console.error(`A27G guard failed: missing ${file}`);
    process.exit(1);
  }
  return fs.readFileSync(file, 'utf8');
}

function requireIncludes(file, content, marker) {
  if (!content.includes(marker)) {
    console.error(`A27G guard failed: ${file} missing marker: ${marker}`);
    process.exit(1);
  }
}

function requireOneOf(file, content, markers, label) {
  if (!markers.some((marker) => content.includes(marker))) {
    console.error(`A27G guard failed: ${file} missing one of ${label}: ${markers.join(' OR ')}`);
    process.exit(1);
  }
}

function requireNotIncludes(file, content, marker) {
  if (content.includes(marker)) {
    console.error(`A27G guard failed: ${file} still contains bad marker: ${marker}`);
    process.exit(1);
  }
}

const layoutFile = 'src/components/Layout.tsx';
const pageFile = 'src/pages/ResponseTemplates.tsx';

const layout = read(layoutFile);
const page = read(pageFile);

for (const marker of [
  'Globalny shell CloseFlow zosta\u0142 przepi\u0119ty',
  "label: 'Dzi\u015B'",
  "caption: 'Czas i obowi\u0105zki'",
  "label: 'Aktywno\u015B\u0107'",
  "label: 'Odpowiedzi', path: '/response-templates'",
  'aria-label="Otw\u00F3rz menu"',
  'Wyloguj si\u0119',
  'Najwa\u017Cniejsze zak\u0142adki',
]) {
  requireIncludes(layoutFile, layout, marker);
}

requireOneOf(
  layoutFile,
  layout,
  [
    "const userName = user?.displayName || 'U\u017Cytkownik';",
    "const userName = profile?.fullName || supabaseUser?.displayName || userEmail || 'U\u017Cytkownik';",
  ],
  'user name marker',
);

for (const marker of [
  "import { Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags } from 'lucide-react';",
  'Nie uda\u0142o si\u0119 pobra\u0107 szablon\u00F3w odpowiedzi',
  'Tryb podgl\u0105du blokuje zapis',
  'Nazwa i tre\u015B\u0107 s\u0105 wymagane',
  'Nie uda\u0142o si\u0119 zarchiwizowa\u0107',
  'Skopiowano tre\u015B\u0107 szablonu',
  'W\u0142asne gotowce do follow-up\u00F3w',
  'Szukaj po nazwie, kategorii, tagach, zmiennych albo tre\u015Bci',
  'Szablony odpowiedzi s\u0105 osobne od checklist spraw',
  '\u0141adowanie szablon\u00F3w',
  'Brak szablon\u00F3w odpowiedzi',
  'Podgl\u0105d',
  'Kopiuj tre\u015B\u0107',
  '<Archive className="h-4 w-4" />',
  'Tre\u015B\u0107',
  'Mo\u017Cesz u\u017Cywa\u0107',
]) {
  requireIncludes(pageFile, page, marker);
}

for (const marker of [
  '\u0139',
  '\u00c4',
  '\u0102',
  '\u00E2',
  '\u013D',
  '\u02D8',
  'Trash2',
]) {
  requireNotIncludes(layoutFile, layout, marker);
  requireNotIncludes(pageFile, page, marker);
}

console.log('OK: A27G response template encoding guard passed.');
