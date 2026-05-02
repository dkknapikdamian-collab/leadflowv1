const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const problems = [];
const has = (file, needle) => read(file).includes(needle);
const selectedFiles = [
  'src/components/Layout.tsx',
  'src/pages/Login.tsx',
  'src/pages/Billing.tsx',
  'api/leads.ts',
  'src/server/billing-checkout-handler.ts',
  'src/pages/Settings.tsx',
  'src/pages/AdminAiSettings.tsx',
];

const layout = read('src/components/Layout.tsx');
if (!layout.includes('isAdmin')) problems.push('Layout.tsx: missing isAdmin from useWorkspace/nav guard.');
if (!layout.includes("...(isAdmin ? [{ icon: Settings, label: 'Admin AI', path: '/settings/ai' }] : []),")) {
  problems.push('Layout.tsx: Admin AI must be rendered only inside isAdmin conditional.');
}
if (!layout.includes(']), [isAdmin]);')) problems.push('Layout.tsx: navGroups dependency must include isAdmin.');

const login = read('src/pages/Login.tsx');
if (/14\s*dni|14-dni/i.test(login)) problems.push('Login.tsx: login/trial copy still mentions 14 days.');
if (!/21\s*dni|21-dni/i.test(login)) problems.push('Login.tsx: login/trial copy does not mention 21 days.');

const billing = read('src/pages/Billing.tsx');
if (billing.includes('Stripe nie jest jeszcze skonfigurowany w Vercel.')) problems.push('Billing.tsx: Stripe copy still says generic not configured instead of Wymaga konfiguracji.');
if (!billing.includes('Stripe wymaga konfiguracji w Vercel.')) problems.push('Billing.tsx: missing Stripe Wymaga konfiguracji copy.');
if (billing.includes("{ name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },")) problems.push('Billing.tsx: Google Calendar is still shown as fully available.');
if (!billing.includes("{ name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Beta' },")) problems.push('Billing.tsx: AI assistant must be marked Beta.');
if (!billing.includes("badge: 'Beta'")) problems.push('Billing.tsx: AI plan card must show Beta badge.');
if (!billing.includes('W przygotowaniu')) problems.push('Billing.tsx: missing W przygotowaniu state.');
if (!billing.includes('Wymaga konfiguracji')) problems.push('Billing.tsx: missing Wymaga konfiguracji state.');

const settings = read('src/pages/Settings.tsx');
for (const bad of ['Sprawdz konfiguracje', 'Wyslij test teraz', 'dziala raz dziennie']) {
  if (settings.includes(bad)) problems.push(`Settings.tsx: ASCII copy left: ${bad}`);
}

const adminAi = read('src/pages/AdminAiSettings.tsx');
if (adminAi.includes('Brak konfiguracji')) problems.push('AdminAiSettings.tsx: use Wymaga konfiguracji instead of Brak konfiguracji.');
if (adminAi.includes("|| '-'")) problems.push('AdminAiSettings.tsx: empty dash fallback left in AI status.');
if (!adminAi.includes('Wymaga konfiguracji')) problems.push('AdminAiSettings.tsx: missing Wymaga konfiguracji.');
if (!adminAi.includes('W przygotowaniu')) problems.push('AdminAiSettings.tsx: missing W przygotowaniu.');
if (!adminAi.includes('Beta')) problems.push('AdminAiSettings.tsx: missing Beta state.');

for (const file of selectedFiles) {
  const content = read(file);
  if (/\bUzupelnij\b/.test(content)) problems.push(`${file}: contains Uzupelnij without Polish character.`);
  if (/\bobsluga\b/.test(content)) problems.push(`${file}: contains obsluga without Polish character.`);
}

if (problems.length) {
  console.error('P14 UI truth/copy/menu guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('OK: P14 UI truth/copy/menu guard passed.');