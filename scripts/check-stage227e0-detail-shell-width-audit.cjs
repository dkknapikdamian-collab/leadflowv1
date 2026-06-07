const fs = require('fs');

const layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
const unified = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const clientCss = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
const caseCss = fs.readFileSync('src/styles/visual-stage13-case-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT: ' + message); process.exit(1); }
function mustContain(source, fragment, label = fragment) { if (!source.includes(fragment)) fail('missing: ' + label); pass('contains: ' + label); }

mustContain(layout, 'data-shell-content="true"', 'Layout shell content owner');
mustContain(layout, 'data-current-section={currentSection}', 'Layout current section marker');
mustContain(unified, 'STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT', 'Stage227E0 CSS marker');
mustContain(unified, '--cf-detail-shell-gutter-x', 'shared fixed gutter token');
mustContain(unified, 'clamp(16px, 1.6vw, 24px)', 'bounded gutter clamp');
mustContain(unified, '.lead-detail-vnext-page', 'LeadDetail page included');
mustContain(unified, '.client-detail-vnext-page', 'ClientDetail page included');
mustContain(unified, '.case-detail-vnext-page', 'CaseDetail page included');
mustContain(unified, '.lead-detail-shell', 'LeadDetail shell included');
mustContain(unified, '.client-detail-shell', 'ClientDetail shell included');
mustContain(unified, '.case-detail-shell', 'CaseDetail shell included');
mustContain(unified, 'max-width: none !important', 'max-width override');
mustContain(unified, 'margin-left: 0 !important', 'left moat override');
mustContain(unified, 'margin-right: 0 !important', 'right moat override');
mustContain(unified, 'padding-left: var(--cf-detail-shell-gutter-x) !important', 'left stable gutter');
mustContain(unified, 'padding-right: var(--cf-detail-shell-gutter-x) !important', 'right stable gutter');

mustContain(leadCss, 'max-width: 1480px', 'LeadDetail old max-width documented/routed through override');
mustContain(clientCss, 'max-width: 1480px', 'ClientDetail old max-width documented/routed through override');
mustContain(caseCss, 'max-width: 1480px', 'CaseDetail old max-width documented/routed through override');

mustContain(pkg, 'check:stage227e0-detail-shell-width-audit', 'package check script');
mustContain(pkg, 'test:stage227e0-detail-shell-width-audit', 'package test script');

console.log('PASS STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT');
