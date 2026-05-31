const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (message) => {
  console.error(`[stage180-support-requests] ${message}`);
  process.exit(1);
};
const assertIncludes = (content, needle, label) => {
  if (!content.includes(needle)) fail(`${label}: missing ${needle}`);
};
const assertNotIncludes = (content, needle, label) => {
  if (content.includes(needle)) fail(`${label}: forbidden ${needle}`);
};

const support = read('src/pages/SupportCenter.tsx');
const layout = read('src/components/Layout.tsx');
const header = read('src/components/CloseFlowPageHeaderV2.tsx');
const css = read('src/styles/visual-stage17-support-vnext.css');

assertIncludes(support, 'SUPPORT_REQUESTS_OPERATIONAL_PAGE_STAGE180', 'SupportCenter stage marker');
assertIncludes(support, "const [composeKind, setComposeKind]", 'SupportCenter composer kind state');
assertIncludes(support, "const [kindFilter, setKindFilter]", 'SupportCenter list filter kind state');
assertIncludes(support, "Zgłoszenie / sugestia", 'SupportCenter visible compose title');
assertIncludes(support, "Problem z aplikacją", 'SupportCenter problem category');
assertIncludes(support, "Sugestia poprawki", 'SupportCenter suggestion category');
assertIncludes(support, "Pytanie / pomoc", 'SupportCenter support category');
assertIncludes(support, "Sugerowane zgłoszenia", 'SupportCenter suggestion rail');
assertIncludes(support, "Wyślij zgłoszenie", 'SupportCenter submit CTA');
assertIncludes(support, "Wszystkie zgłoszenia", 'SupportCenter admin/user list copy');
assertIncludes(support, "kindFilter === 'all'", 'SupportCenter all-category filter');
assertNotIncludes(support, "{!isAdmin ? (", 'SupportCenter must not hide submit form from admin/operator');
assertNotIncludes(support, "Zapisz zgłoszenie", 'SupportCenter old submit copy removed');

assertIncludes(layout, "label: 'Zgłoszenia'", 'Layout sidebar label');
assertNotIncludes(layout, "label: 'Pomoc', path: '/help'", 'Layout old help label removed');

assertIncludes(header, "kicker: 'ZGŁOSZENIA'", 'Page header support kicker');
assertIncludes(header, "title: 'Zgłoszenia'", 'Page header support title');
assertNotIncludes(header, "title: 'Pomoc'", 'Page header old title removed');

assertIncludes(css, 'SUPPORT_REQUESTS_OPERATIONAL_PAGE_STAGE180', 'Support CSS stage marker');
assertIncludes(css, '.support-hero-card-button', 'Support CSS clickable hero');
assertIncludes(css, '.support-faq-grid-single', 'Support CSS right rail FAQ');

console.log('[stage180-support-requests] OK');
