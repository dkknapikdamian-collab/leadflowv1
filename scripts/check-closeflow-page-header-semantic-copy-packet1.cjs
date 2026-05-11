const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const failures=[];
function read(rel){ const full=path.join(repo,rel); return fs.existsSync(full)?fs.readFileSync(full,'utf8'):''; }
function expect(name, cond){ if(!cond) failures.push(name); }
const app=read('src/App.tsx');
const copyCss=read('src/styles/closeflow-page-header-copy-source-truth.css');
const actionCss=read('src/styles/closeflow-page-header-action-semantics-packet1.css');
const emergency=read('src/styles/emergency/emergency-hotfixes.css');
const qac=read('src/components/QuickAiCapture.tsx');
const gqa=read('src/components/GlobalQuickActions.tsx');
const phc=read('src/lib/page-header-content.ts');
expect('copy css marker', copyCss.includes('CLOSEFLOW_PAGE_HEADER_COPY_SOURCE_TRUTH_PACKET1_2026_05_11'));
expect('action css marker', actionCss.includes('CLOSEFLOW_PAGE_HEADER_ACTION_SEMANTICS_PACKET1_2026_05_11'));
expect('copy import app', app.includes("closeflow-page-header-copy-source-truth.css"));
expect('action import app', app.includes("closeflow-page-header-action-semantics-packet1.css"));
expect('emergency imports', emergency.includes('closeflow-page-header-copy-source-truth.css') && emergency.includes('closeflow-page-header-action-semantics-packet1.css'));
expect('duplicate hide rule', copyCss.includes('> p + p') || copyCss.includes('cf-page-header-description + .cf-page-header-description'));
expect('ai violet token', actionCss.includes('--cf-page-header-ai-text: #7c3aed'));
expect('danger tied to trash token', actionCss.includes('var(--cf-trash-icon-color'));
expect('quick ai marked ai', qac.includes('data-cf-command-action="ai"'));
expect('global actions markers', gqa.includes('data-cf-command-action="ai"') || gqa.includes('data-cf-command-action="neutral"'));
expect('crm suffix removed', !phc.includes('zapisem w CRM'));
if(failures.length){ console.error('CLOSEFLOW_PAGE_HEADER_SEMANTIC_COPY_PACKET1_CHECK_FAILED'); console.error(failures.join('\n')); process.exit(1); }
console.log('CLOSEFLOW_PAGE_HEADER_SEMANTIC_COPY_PACKET1_CHECK_OK');
