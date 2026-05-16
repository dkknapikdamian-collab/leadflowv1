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
    'W\u0142asne gotowce do follow-up\u00F3w, przypomnie\u0144 i wiadomo\u015Bci do klient\u00F3w. AI mo\u017Ce p\u00F3\u017Aniej pracowa\u0107 na tych szablonach, ale \u017Ar\u00F3d\u0142em prawdy jest Twoja biblioteka.',
  ],
  'src/pages/AiDrafts.tsx': [
    'Sprawd\u017A, popraw i zatwierd\u017A szkice przed zapisem w CRM.',
  ],
  'src/pages/NotificationsCenter.tsx': [
    'Przypomnienia, zaleg\u0142e rzeczy i alerty z aplikacji. Tu widzisz zaleg\u0142e rzeczy, nadchodz\u0105ce terminy i sprawy, kt\u00F3rych nie mo\u017Cna przegapi\u0107.',
  ],
  'src/pages/AdminAiSettings.tsx': [
    'Ukryta warstwa diagnostyczna dla Quick Lead Capture. U\u017Cytkownik ko\u0144cowy widzi tylko prosty szkic do potwierdzenia, nie provider\u00F3w ani kluczy.',
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
