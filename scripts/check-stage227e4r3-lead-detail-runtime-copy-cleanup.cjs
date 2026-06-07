const fs = require('fs');
const path = require('path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-lead-detail-sales-signal-stage227e4.css'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8').replace(/^\uFEFF/, '');

function fail(message) { console.error('FAIL STAGE227E4R3_RUNTIME_COPY_CLEANUP: ' + message); process.exit(1); }
function pass(message) { console.log('PASS ' + message); }
function mustContain(source, fragment, label) { if (!source.includes(fragment)) fail('missing: ' + label); pass('contains: ' + label); }
function mustNotContain(source, fragment, label) { if (source.includes(fragment)) fail('forbidden runtime copy remains: ' + label); pass('not contains: ' + label); }

mustContain(lead, 'STAGE227E4R3_LEAD_DETAIL_RUNTIME_COPY_CLEANUP', 'Stage227E4R3 marker');
mustContain(lead, 'Kontekst sprzedażowy', 'sales context title');
mustContain(lead, 'Do decyzji', 'short decision pill');
mustContain(lead, 'Potrzeba / problem', 'need/problem field');
mustContain(lead, 'Termin / pilność', 'urgency field');
mustContain(lead, 'Budżet / potencjał', 'budget field');
mustContain(lead, 'Decyzja', 'decision field');
mustContain(lead, 'Blokada', 'blocker field');
mustNotContain(lead, 'Krótko: co pomaga wykonać następny ruch', 'sales context helper paragraph');
mustNotContain(lead, 'Najbliższe zadania, wydarzenia i braki przypięte do tego leada.', 'work action center helper paragraph');
mustNotContain(lead, 'Krótki kontekst z utworzenia leada', 'source note helper paragraph');
mustNotContain(lead, '<p>{item.hint}</p>', 'sales context item hint paragraph');
mustNotContain(lead, 'Lekki kontekst', 'helper pill copy');

const salesSectionMatch = lead.match(/data-stage227e4r2-sales-context-section="true"[\s\S]*?data-stage228b-lead-work-action-center="true"/);
if (!salesSectionMatch) fail('cannot isolate sales context section before work action center');
const salesSection = salesSectionMatch[0];
['Jest jasny powód pracy z leadem.', 'Jest termin, pilność albo konkretny następny ruch.', 'Jest budżet albo potencjał sprzedaży.', 'Jest informacja o decyzji lub decydencie.', 'Widać ryzyko, brak albo blokadę.'].forEach((text) => {
  mustNotContain(salesSection, text, text);
});

mustContain(css, 'STAGE227E4R3_RUNTIME_COPY_CLEANUP', 'CSS cleanup marker');
mustContain(css, 'min-height: 72px', 'compact card height');
const packageJson = JSON.parse(pkg);
mustContain(JSON.stringify(packageJson.scripts || {}), 'check:stage227e4r3-lead-detail-runtime-copy-cleanup', 'package check script');
mustContain(JSON.stringify(packageJson.scripts || {}), 'test:stage227e4r3-lead-detail-runtime-copy-cleanup', 'package test script');
console.log('PASS STAGE227E4R3_RUNTIME_COPY_CLEANUP');
