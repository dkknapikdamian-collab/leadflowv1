const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }
function read(rel) { const full = path.join(root, rel); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }

const generator = read('tools/stage216d-generate-portal-storage-uploads-qa.cjs');
const smoke = read('tools/stage216d-portal-storage-uploads-runtime-smoke.cjs');
const report = read('_project/reports/STAGE216D_PORTAL_STORAGE_UPLOADS_QA_LOCAL_ONLY_2026-06-01.md');
const obs = read('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-D portal storage uploads QA local only.md');
const apply = read('APPLY_CLOSEFLOW_STAGE216D_PORTAL_STORAGE_UPLOADS_QA_LOCAL_ONLY_2026-06-01.ps1');

check('artifact exists: tools/stage216d-generate-portal-storage-uploads-qa.cjs', exists('tools/stage216d-generate-portal-storage-uploads-qa.cjs'));
check('artifact exists: tools/stage216d-portal-storage-uploads-runtime-smoke.cjs', exists('tools/stage216d-portal-storage-uploads-runtime-smoke.cjs'));
check('artifact exists: scripts/check-stage216d-portal-storage-uploads-qa.cjs', exists('scripts/check-stage216d-portal-storage-uploads-qa.cjs'));
check('artifact exists: _project report', exists('_project/reports/STAGE216D_PORTAL_STORAGE_UPLOADS_QA_LOCAL_ONLY_2026-06-01.md'));
check('artifact exists: Obsidian update', exists('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-D portal storage uploads QA local only.md'));
check('generator scans/reference includes vercel.json', generator.includes('vercel.json'));
check('generator scans/reference includes api/storage-upload.ts', generator.includes('api/storage-upload.ts'));
check('generator scans/reference includes api/portal.ts as route-risk check', generator.includes('api/portal.ts'));
check('generator scans/reference includes src/server/_portal-token.ts', generator.includes('src/server/_portal-token.ts'));
check('generator scans/reference includes src/server/_portal-storage.ts', generator.includes('src/server/_portal-storage.ts'));
check('runtime smoke includes /api/storage-upload-health', smoke.includes('/api/storage-upload-health'));
check('runtime smoke includes /api/storage-upload', smoke.includes('/api/storage-upload'));
check('runtime smoke includes /api/client-portal-session', smoke.includes('/api/client-portal-session'));
check('runtime smoke includes /api/client-portal-tokens', smoke.includes('/api/client-portal-tokens'));
check('runtime smoke includes /api/portal?route=session', smoke.includes('/api/portal?route=session'));
check('runtime smoke includes /api/cases portal session probe', smoke.includes('/api/cases?id=__stage216d_smoke__&portalSession=__stage216d_smoke__'));
check('runtime smoke includes /api/case-items portal session probe', smoke.includes('/api/case-items?caseId=__stage216d_smoke__&portalSession=__stage216d_smoke__'));
check('runtime smoke is explicitly GET', smoke.includes("method: 'GET'"));
check('runtime smoke contains no write HTTP methods', !/method:\s*['"](POST|PATCH|DELETE|PUT)['"]/i.test(smoke));
check('runtime smoke classifies NON_JSON_HTML_RESPONSE', smoke.includes('NON_JSON_HTML_RESPONSE'));
check('runtime smoke classifies VITE_DEV_API_SOURCE_RESPONSE', smoke.includes('VITE_DEV_API_SOURCE_RESPONSE'));
check('runtime smoke classifies CONFIG_REQUIRED_500', smoke.includes('CONFIG_REQUIRED_500'));
check('runtime smoke fails on non-config 5xx', smoke.includes('SERVER_ERROR_500'));
check('report contains Stage216-D heading', /STAGE216-D/.test(report));
check('report states local-only/no git', /LOCAL-ONLY|bez commita|bez push/i.test(report + obs + apply));
check('obsidian contains FAKTY/DECYZJE/HIPOTEZY', obs.includes('## FAKTY') && obs.includes('## DECYZJE DAMIANA') && obs.includes('## HIPOTEZY AI'));
check('apply script does not run git add/commit/push', !/git\s+-C\s+\$Repo\s+(add|commit|push)|git\s+(add|commit|push)/i.test(apply));
check('generator contains no executable SQL/RLS/GRANT mutation text', !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(generator));
check('runtime smoke contains no executable SQL/RLS/GRANT mutation text', !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(smoke));

for (const item of checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);
