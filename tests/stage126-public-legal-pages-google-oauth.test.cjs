const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

const app = read('src/App.tsx');
const privacy = read('src/pages/LegalPrivacy.tsx');
const terms = read('src/pages/LegalTerms.tsx');

const checks = [
  ['privacy page file exists', exists('src/pages/LegalPrivacy.tsx')],
  ['terms page file exists', exists('src/pages/LegalTerms.tsx')],
  ['legal CSS file exists', exists('src/pages/legal-public-pages.css')],
  ['App lazy imports LegalPrivacy', app.includes("const LegalPrivacy = lazyPage(() => import('./pages/LegalPrivacy'), 'LegalPrivacy');")],
  ['App lazy imports LegalTerms', app.includes("const LegalTerms = lazyPage(() => import('./pages/LegalTerms'), 'LegalTerms');")],
  ['App exposes /privacy public route', app.includes('<Route path="/privacy" element={<LegalPrivacy />} />')],
  ['App exposes /terms public route', app.includes('<Route path="/terms" element={<LegalTerms />} />')],
  ['Privacy mentions Google Calendar data usage', privacy.includes('Dane Google Calendar') && privacy.includes('Google Calendar')],
  ['Privacy states Google data is not sold', privacy.includes('nie są sprzedawane') || privacy.includes('nie jest sprzedawane')],
  ['Terms mentions Google Calendar integration', terms.includes('Integracja Google Calendar') && terms.includes('odłączyć integrację')],
  ['Pages import shared legal css', privacy.includes("import './legal-public-pages.css';") && terms.includes("import './legal-public-pages.css';")],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('[Stage126] FAIL');
  for (const [name] of failed) console.error(' - ' + name);
  process.exit(1);
}
console.log('[Stage126] OK: public privacy/terms routes for Google OAuth verification');

