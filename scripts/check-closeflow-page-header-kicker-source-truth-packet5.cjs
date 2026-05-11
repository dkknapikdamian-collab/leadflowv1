const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const failures = [];
function read(rel){ const file=path.join(repo,rel); return fs.existsSync(file)?fs.readFileSync(file,'utf8'):''; }
function expect(name, ok){ if(!ok) failures.push(name); }
const css = read('src/styles/closeflow-page-header-v2.css');
expect('css marker', css.includes('CLOSEFLOW_PAGE_HEADER_KICKER_SOURCE_TRUTH_PACKET5_2026_05_11'));
expect('kicker text source truth color', css.includes('--cf-ph-v2-kicker-text: #64748b;'));
expect('kicker border source truth color', css.includes('--cf-ph-v2-kicker-border: #cbd5e1;'));
expect('copy aligned left source truth', css.includes('place-self: center start'));
expect('actions aligned right source truth', css.includes('place-self: start end'));

const dupChecks = {
  'src/pages/ResponseTemplates.tsx': [
    'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. AI może później pracować na tych szablonach, ale źródłem prawdy jest Twoja biblioteka.',
  ],
  'src/pages/AiDrafts.tsx': [
    'Sprawdź, popraw i zatwierdź szkice przed zapisem w CRM.',
  ],
  'src/pages/NotificationsCenter.tsx': [
    'Przypomnienia, zaległe rzeczy i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.',
  ],
  'src/pages/AdminAiSettings.tsx': [
    'Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.',
  ],
};
for (const [rel, items] of Object.entries(dupChecks)) {
  const text = read(rel);
  for (const item of items) expect(`${rel} no duplicate copy: ${item.slice(0,40)}...`, !text.includes(item));
}

const auditFile = read('docs/ui/CLOSEFLOW_PAGE_HEADER_KICKER_SOURCE_TRUTH_PACKET5_AUDIT.generated.json');
expect('audit file generated', auditFile.includes('generatedAt'));

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_KICKER_SOURCE_TRUTH_PACKET5_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_PAGE_HEADER_KICKER_SOURCE_TRUTH_PACKET5_CHECK_OK');
