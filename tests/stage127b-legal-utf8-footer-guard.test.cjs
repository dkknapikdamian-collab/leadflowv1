const fs = require('fs');

const files = [
  'src/pages/LegalPrivacy.tsx',
  'src/pages/LegalTerms.tsx',
  'src/pages/legal-public-pages.css',
  'src/pages/PublicLanding.tsx',
  'src/styles/closeflow-public-landing.css',
];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

const mojibakePattern = /(?:\uFFFD|\u00C4|\u0139|\u0102|Å|Ã|\u00C2|â€|’|“|”|–|—|prywatno\u0139|zarz\u00C4|użyć)/;

for (const file of files) {
  const text = read(file);
  if (mojibakePattern.test(text)) {
    const match = text.match(mojibakePattern);
    throw new Error(`[Stage127B] Mojibake detected in ${file}: ${match && match[0]}`);
  }
}

const privacy = read('src/pages/LegalPrivacy.tsx');
const terms = read('src/pages/LegalTerms.tsx');
const landing = read('src/pages/PublicLanding.tsx');
const landingCss = read('src/styles/closeflow-public-landing.css');

const requiredPrivacy = [
  'Polityka prywatności',
  'zarządzania leadami',
  'użytkownik',
  'może uzyskać dostęp',
  'odłączyć w ustawieniach',
  'bezpieczeństwa konta Google',
  'Wróć do strony głównej',
];

const requiredTerms = [
  'Warunki korzystania',
  'użytkownik potwierdza',
  'Opis usługi',
  'Konto użytkownika',
  'może dobrowolnie połączyć konto Google',
  'nie wolno próbować omijać zabezpieczeń',
  'Dostępność i zmiany',
];

for (const phrase of requiredPrivacy) {
  if (!privacy.includes(phrase)) throw new Error(`[Stage127B] Missing privacy phrase: ${phrase}`);
}

for (const phrase of requiredTerms) {
  if (!terms.includes(phrase)) throw new Error(`[Stage127B] Missing terms phrase: ${phrase}`);
}

if (!landing.includes('className="public-landing-footer"')) {
  throw new Error('[Stage127B] Public landing footer missing');
}
if (!landing.includes('to="/privacy"') || !landing.includes('Polityka prywatności')) {
  throw new Error('[Stage127B] Privacy link missing from public landing');
}
if (!landing.includes('to="/terms"') || !landing.includes('Warunki korzystania')) {
  throw new Error('[Stage127B] Terms link missing from public landing');
}
if (!landingCss.includes('.public-landing-footer')) {
  throw new Error('[Stage127B] Footer CSS missing');
}

console.log('[Stage127B] OK: legal UTF-8 pages and public footer links');
