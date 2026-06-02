const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const lead = read('src/pages/LeadDetail.tsx');
const client = read('src/pages/ClientDetail.tsx');
const adapters = read('src/styles/page-adapters/page-adapters.css');
const css = read('src/styles/stage216m-r14-clean-copy-and-finance-mojibake.css');

const forbidden = [
  'Historia pojawi się po dodaniu notatek, zadań, wydarzeń, płatności albo zmian statusu.',
  'Robocze notatki operatora. Historia statusów, płatności i systemu jest oddzielona niżej.',
  'Robocze notatki klienta są w centrum pracy. Prawa szyna zostaje dla akcji, spraw i finansów.',
  'Ten lead może wypaść z procesu. Dodaj follow-up albo wydarzenie.',
  'powiązane zadania i wydarzenia sprzedażowe.',
  '5 najbliższych zadań i wydarzeń z datą powiązanych z tym leadem.',
  'Lead nie został jeszcze przejęty do obsługi.',
  'Ten lead nie ma zadania ani wydarzenia. Zaplanuj następny kontakt, żeby nie zniknął z procesu.',
  'Dodaj follow-up albo wydarzenie, żeby lead nie został bez ruchu.',
];

const mojibakeForbidden = ['Ĺ', 'Ä', 'Ăł', 'wpĹ', 'wartoĹ', 'domkniÄ'];
const requiredClient = ['Suma wartości spraw', 'Suma wpłat', 'Do domknięcia', 'Najpierw utwórz sprawę klienta.'];

const errors = [];
if (!adapters.includes("@import '../stage216m-r14-clean-copy-and-finance-mojibake.css';")) {
  errors.push('page-adapters import missing');
}
if (!css.includes('STAGE216M_R14_CLEAN_COPY_AND_FINANCE_MOJIBAKE')) {
  errors.push('R14 CSS marker missing');
}
if (!lead.includes('data-stage216m-r14-clean-copy-finance-mojibake-marker="true"')) {
  errors.push('LeadDetail R14 marker missing');
}
if (!client.includes('data-stage216m-r14-clean-copy-finance-mojibake-marker="true"')) {
  errors.push('ClientDetail R14 marker missing');
}
for (const token of forbidden) {
  if (lead.includes(token) || client.includes(token)) errors.push(`forbidden helper copy still present: ${token}`);
}
for (const token of mojibakeForbidden) {
  if (client.includes(token)) errors.push(`ClientDetail mojibake still present: ${token}`);
}
for (const token of requiredClient) {
  if (!client.includes(token)) errors.push(`ClientDetail required Polish copy missing: ${token}`);
}

if (errors.length) {
  console.error('FAIL stage216m-r14-clean-copy-and-finance-mojibake-contract');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('PASS stage216m-r14-clean-copy-and-finance-mojibake-contract');
