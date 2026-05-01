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
  'Globalny shell CloseFlow został przepięty',
  "label: 'Dziś'",
  "caption: 'Czas i obowiązki'",
  "label: 'Aktywność'",
  "label: 'Odpowiedzi', path: '/response-templates'",
  "const userName = user?.displayName || 'Użytkownik';",
  'aria-label="Otwórz menu"',
  'Wyloguj się',
  'Najważniejsze zakładki',
]) {
  requireIncludes(layoutFile, layout, marker);
}

for (const marker of [
  "import { Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags } from 'lucide-react';",
  'Nie udało się pobrać szablonów odpowiedzi',
  'Tryb podglądu blokuje zapis',
  'Nazwa i treść są wymagane',
  'Nie udało się zarchiwizować',
  'Skopiowano treść szablonu',
  'Własne gotowce do follow-upów',
  'Szukaj po nazwie, kategorii, tagach, zmiennych albo treści',
  'Szablony odpowiedzi są osobne od checklist spraw',
  'Ładowanie szablonów',
  'Brak szablonów odpowiedzi',
  'Podgląd',
  'Kopiuj treść',
  '<Archive className="h-4 w-4" />',
  'Treść',
  'Możesz używać',
]) {
  requireIncludes(pageFile, page, marker);
}

for (const marker of [
  'Ĺ',
  'Ä',
  'Ă',
  'â',
  'Ľ',
  '˘',
  'Trash2',
]) {
  requireNotIncludes(layoutFile, layout, marker);
  requireNotIncludes(pageFile, page, marker);
}

console.log('OK: A27G response template encoding guard passed.');
