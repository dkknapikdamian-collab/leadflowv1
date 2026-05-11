const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const failures = [];
function read(rel) { const full = path.join(repo, rel); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function expect(name, cond) { if (!cond) failures.push(name); }
const content = read('src/lib/page-header-content.ts');
const css = read('src/styles/closeflow-page-header-card-source-truth.css');
const today = read('src/pages/TodayStable.tsx');
const aiDrafts = read('src/pages/AiDrafts.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const adminAi = read('src/pages/AdminAiSettings.tsx');
expect('stage5 css marker', css.includes('CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_2026_05_11_START'));
expect('content source includes aiDrafts shortened copy', content.includes("description: 'Sprawdź, popraw i zatwierdź szkice przed zapisem.'"));
expect('content source includes notifications shortened copy', content.includes("description: 'Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.'"));
expect('content source includes adminAi final copy', content.includes("Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy."));
expect('today action layout source truth token', css.includes('--cf-page-header-actions-row-justify: flex-end'));
expect('header buttons use blue accent', css.includes('--cf-page-header-action-accent: #2563eb'));
expect('today has no duplicate desc nodes', (today.match(/PAGE_HEADER_CONTENT\.today\.description/g) || []).length <= 1);
expect('ai drafts no old crm text', !aiDrafts.includes('zapisem w CRM'));
expect('notifications no old long text', !notifications.includes('Przypomnienia i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.'));
expect('admin ai no provider duplicate old text', !adminAi.includes('Ukryta diagnostyka providerów i szkiców AI. Użytkownik końcowy widzi prosty szkic do potwierdzenia, nie klucze ani providery.'));
if (failures.length) { console.error('CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_CHECK_FAILED'); console.error(failures.join('\n')); process.exit(1); }
console.log('CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_CHECK_OK');
