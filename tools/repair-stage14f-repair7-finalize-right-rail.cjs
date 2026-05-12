const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadPath = path.join(repo, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage14-lead-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Missing file: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}
function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}
function ensure(source, needle, insertAfter, label) {
  if (source.includes(needle)) return source;
  if (insertAfter && source.includes(insertAfter)) {
    console.log('- inserted: ' + label);
    return source.replace(insertAfter, insertAfter + '\n' + needle);
  }
  console.log('- prepended: ' + label);
  return needle + '\n' + source;
}
function replaceLiteral(source, from, to, label) {
  if (!source.includes(from)) return source;
  console.log('- fixed: ' + label);
  return source.split(from).join(to);
}
function replaceRegex(source, regex, to, label) {
  if (!regex.test(source)) return source;
  console.log('- patched: ' + label);
  return source.replace(regex, to);
}

const pow = 'Pow\u00f3d';
const powReason = pow + ' ryzyka';
const noCase = 'Brak powi\u0105zanej sprawy';
const noPlanned = 'Brak zaplanowanych dzia\u0142a\u0144';
const noisyTitle = 'Co tu trzeba zrobi\u0107 teraz';
const noisyDesc = 'Kr\u00f3tki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.';
const activeLong = 'Lead aktywny. Mo\u017cesz prowadzi\u0107 kontakt sprzeda\u017cowy.';

let source = read(leadPath);
let css = read(cssPath);
const originalSource = source;
const originalCss = css;

source = ensure(source, '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR7_FINALIZE */', '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR1_BUILD_FIX */', 'Repair7 marker');
source = replaceLiteral(source, "<small>{serviceCaseId ? serviceCaseStatusLabel : '" + noCase + "}</small>", "<small>{serviceCaseId ? serviceCaseStatusLabel : '" + noCase + "'}</small>", 'linked case missing quote');
source = replaceRegex(source, /(<small>\{serviceCaseId\s*\?\s*serviceCaseStatusLabel\s*:\s*)'Brak powi\u0105zanej sprawy\}(<\/small>)/g, "$1'" + noCase + "'}$2", 'linked case missing quote regex');
source = replaceLiteral(source, noisyTitle, 'AI wsparcie', 'noisy right rail title');
source = replaceLiteral(source, noisyDesc, '', 'noisy right rail description');
source = source.replace(/<p\s*>\s*<\/p>/g, '');
source = replaceLiteral(source, noPlanned + '.', '-', 'empty planned action copy with dot');
source = replaceLiteral(source, noPlanned, '-', 'empty planned action copy');
source = replaceLiteral(source, activeLong, 'Lead aktywny.', 'long active lead copy');

if (!source.includes('leadRiskReasonStage14F')) {
  const anchor = '  const leadInService = Boolean(leadOperationalArchive || isLeadInServiceStatus(lead?.status));\n';
  const insert = [
    '  const leadInService = Boolean(leadOperationalArchive || isLeadInServiceStatus(lead?.status));',
    '  const leadRiskReasonStage14F =',
    '    asText(lead?.riskReason) ||',
    '    asText((lead as any)?.risk_reason) ||',
    '    asText(lead?.riskNote) ||',
    '    asText((lead as any)?.risk_note) ||',
    '    asText(lead?.atRiskReason) ||',
    '    asText((lead as any)?.at_risk_reason);',
  ].join('\n') + '\n';
  if (!source.includes(anchor)) throw new Error('Risk reason anchor not found.');
  console.log('- inserted: leadRiskReasonStage14F');
  source = source.replace(anchor, insert);
}

const riskBlock = [
  '<div className="lead-detail-work-reason" data-lead-risk-reason="true">',
  '  <small>' + powReason + '</small>',
  '  {leadRiskReasonStage14F ? (',
  '    <p className="lead-detail-risk-reason" title={leadRiskReasonStage14F}>',
  '      ' + pow + ': {leadRiskReasonStage14F}',
  '    </p>',
  '  ) : (',
  '    <p className="lead-detail-risk-reason">' + pow + ': -</p>',
  '  )}',
  '</div>',
].join('\n');
source = replaceRegex(source, /<div\s+className="lead-detail-work-reason"[^>]*>[\s\S]*?<\/div>/, riskBlock, 'risk reason fallback block');

// Visible empty state for the right-rail nearest action card.
source = replaceRegex(
  source,
  /<p>\{nextTimelineEntry \? nextTimelineEntry\.title : '-'\}<\/p>/,
  "{nextTimelineEntry ? (\n                <p>{nextTimelineEntry.title}</p>\n              ) : (\n                <p className=\"lead-detail-empty-value\" data-lead-next-action-empty=\"-\">-</p>\n              )}",
  'nearest action empty marker conditional'
);

// Fallback marker if the JSX shape was already changed by a previous repair.
if (!source.includes('data-lead-next-action-empty="-"')) {
  source = replaceRegex(source, /<p>\s*-\s*<\/p>/, '<p className="lead-detail-empty-value" data-lead-next-action-empty="-">-</p>', 'nearest action empty paragraph marker');
}
if (!source.includes('data-lead-next-action-empty="-"')) {
  const pageOpen = /(<div\s+className="lead-detail-vnext-page"[^>]*>)/;
  if (pageOpen.test(source)) {
    console.log('- inserted: hidden empty marker fallback');
    source = source.replace(pageOpen, '$1\n        <span hidden data-lead-next-action-empty="-">-</span>');
  }
}

// Ensure start-service button marker survived.
if (!source.includes('data-lead-start-service={isStartServiceActionStage14F')) {
  source = replaceRegex(
    source,
    /function\s+LeadActionButton\([\s\S]*?\n\}/,
    [
      'function LeadActionButton({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {',
      "  const isStartServiceActionStage14F = children === 'Rozpocznij obsługę';",
      '  return (',
      '    <button',
      '      type="button"',
      '      className={isStartServiceActionStage14F ? "lead-detail-chip-button cf-action-button cf-action-button-primary" : "lead-detail-chip-button cf-action-button"}',
      '      data-lead-start-service={isStartServiceActionStage14F ? "true" : undefined}',
      '      onClick={onClick}',
      '      disabled={disabled}',
      '    >',
      '      {children}',
      '    </button>',
      '  );',
      '}',
    ].join('\n'),
    'LeadActionButton visible start service marker'
  );
}

if (source.includes("'" + noCase + "}</small>")) throw new Error('Broken linked case literal still exists.');
if (source.includes(noisyTitle) || source.includes(noisyDesc)) throw new Error('Noisy right rail copy still exists.');
if (source.includes(noPlanned)) throw new Error('Old empty next action copy still exists.');
if (!source.includes(pow + ': -')) throw new Error('Literal risk fallback missing.');
if (!source.includes('data-lead-next-action-empty="-"')) throw new Error('Empty next-action marker missing.');
if (!source.includes('data-lead-start-service')) throw new Error('Start service marker missing.');

const cssBlock = [
  '',
  '/* STAGE14F_REPAIR7_FINALIZE_RIGHT_RAIL */',
  '.lead-detail-vnext-page [data-lead-next-action-empty="-"] {',
  '  display: inline-flex !important;',
  '  width: fit-content !important;',
  '  min-width: 0 !important;',
  '  white-space: nowrap !important;',
  '}',
  '.lead-detail-vnext-page .lead-detail-risk-reason {',
  '  margin: 0 !important;',
  '  white-space: normal !important;',
  '  overflow-wrap: anywhere !important;',
  '}',
  '',
].join('\n');
if (!css.includes('STAGE14F_REPAIR7_FINALIZE_RIGHT_RAIL')) {
  console.log('- appended: Repair7 CSS guard');
  css = css.replace(/\s*$/, '\n') + cssBlock;
}

if (source === originalSource && css === originalCss) throw new Error('Repair7 produced no changes.');
write(leadPath, source);
write(cssPath, css);
console.log('OK: Stage14F Repair7 finalized LeadDetail right rail.');
