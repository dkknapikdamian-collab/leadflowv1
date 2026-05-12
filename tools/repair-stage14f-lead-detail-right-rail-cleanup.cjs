const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadPath = path.join(repo, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage14-lead-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Brak pliku: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}
function normalizeEol(value) {
  return String(value || '').replace(/\r\n/g, '\n');
}
function replaceAllLiteral(source, needle, replacement, label) {
  if (!source.includes(needle)) return { source, changed: false };
  const next = source.split(needle).join(replacement);
  console.log('- replaced: ' + label);
  return { source: next, changed: true };
}
function removeEmptyParagraphs(source) {
  return source.replace(/\n\s*<p(?:\s+[^>]*)?>\s*<\/p>\s*/g, '\n');
}
function ensureTopMarker(source) {
  if (source.includes('STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP')) return source;
  const marker = '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP */\n';
  if (source.includes('/*\nLEAD_DETAIL_VISUAL_REBUILD_STAGE14')) {
    return source.replace('/*\nLEAD_DETAIL_VISUAL_REBUILD_STAGE14', marker + '/*\nLEAD_DETAIL_VISUAL_REBUILD_STAGE14');
  }
  return marker + source;
}
function ensureRiskReasonConst(source) {
  if (source.includes('leadRiskReasonStage14F')) return source;
  const needle = '  const leadInService = Boolean(leadOperationalArchive || isLeadInServiceStatus(lead?.status));\n';
  if (!source.includes(needle)) {
    console.log('- risk reason const anchor not found; skipped');
    return source;
  }
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
  console.log('- inserted: leadRiskReasonStage14F');
  return source.replace(needle, insert);
}
function replaceRiskReasonBlock(source) {
  const blockRegex = /<div\s+className="lead-detail-work-reason"[^>]*>[\s\S]*?<\/div>/;
  if (!blockRegex.test(source)) return source;
  const replacement = [
    '<div className="lead-detail-work-reason" data-lead-risk-reason="true">',
    '  <small>Powód ryzyka</small>',
    '  <p className="lead-detail-risk-reason" title={leadRiskReasonStage14F || undefined}>',
    "    Powód: {leadRiskReasonStage14F || '-'}",
    '  </p>',
    '</div>',
  ].join('\n');
  console.log('- replaced: risk reason block');
  return source.replace(blockRegex, replacement);
}
function patchLeadActionButton(source) {
  if (source.includes('data-lead-start-service={isStartServiceActionStage14F')) return source;
  const regex = /function\s+LeadActionButton\(\{\s*children,\s*onClick,\s*disabled\s*\}:\s*\{\s*children:\s*ReactNode;\s*onClick\?:\s*\(\)\s*=>\s*void;\s*disabled\?:\s*boolean\s*\}\)\s*\{[\s\S]*?\n\}/;
  const match = source.match(regex);
  if (!match) {
    console.log('- LeadActionButton anchor not found; skipped');
    return source;
  }
  const replacement = [
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
  ].join('\n');
  console.log('- patched: LeadActionButton visibility classes/data attr');
  return source.replace(match[0], replacement);
}
function patchNearestActionStrong(source) {
  if (source.includes('data-lead-next-action-empty="-"')) return source;
  const labels = ['Najbliższa akcja', 'Najbliższa zaplanowana akcja'];
  let idx = -1;
  for (const label of labels) {
    idx = source.indexOf(label);
    if (idx >= 0) break;
  }
  if (idx < 0) {
    console.log('- nearest action label not found; data attr skipped');
    return source;
  }
  const strongStart = source.indexOf('<strong', idx);
  if (strongStart < 0) return source;
  const strongOpenEnd = source.indexOf('>', strongStart);
  if (strongOpenEnd < 0) return source;
  let opening = source.slice(strongStart, strongOpenEnd + 1);
  if (!opening.includes('data-lead-next-action-empty')) {
    opening = opening.replace('>', ' data-lead-next-action-empty="-">');
  }
  if (opening.includes('className="')) {
    opening = opening.replace(/className="([^"]*)"/, (_m, cls) => 'className="' + cls + ' lead-detail-empty-value"');
  } else {
    opening = opening.replace('<strong', '<strong className="lead-detail-empty-value"');
  }
  console.log('- patched: nearest action strong marker');
  return source.slice(0, strongStart) + opening + source.slice(strongOpenEnd + 1);
}
function simplifyLinkedCaseCopy(source) {
  let next = source;
  const patterns = [
    /Po rozpoczęciu obsługi[^<\n{}]*/g,
    /Po rozpoczeciu obslugi[^<\n{}]*/g,
    /Po utworzeniu sprawy[^<\n{}]*/g,
  ];
  for (const pattern of patterns) {
    next = next.replace(pattern, 'Brak powiązanej sprawy');
  }
  if (next !== source) console.log('- simplified: linked case empty copy');
  return next;
}
function patchSource(source) {
  let changedAny = false;
  const original = source;
  source = ensureTopMarker(source);
  changedAny = changedAny || source !== original;

  let result = replaceAllLiteral(source, 'Co tu trzeba zrobić teraz', 'AI wsparcie', 'noisy work-center title');
  source = result.source; changedAny = changedAny || result.changed;

  source = source.replace(/<p(?:\s+[^>]*)?>\s*Krótki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii\.\s*<\/p>/g, '');
  result = replaceAllLiteral(source, 'Krótki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.', '', 'noisy decision panel paragraph');
  source = result.source; changedAny = changedAny || result.changed;
  source = removeEmptyParagraphs(source);

  result = replaceAllLiteral(source, 'Brak zaplanowanych działań.', '-', 'empty next action copy with dot');
  source = result.source; changedAny = changedAny || result.changed;
  result = replaceAllLiteral(source, 'Brak zaplanowanych działań', '-', 'empty next action copy');
  source = result.source; changedAny = changedAny || result.changed;

  result = replaceAllLiteral(source, 'Lead aktywny. Możesz prowadzić kontakt sprzedażowy.', 'Lead aktywny.', 'short lead active status copy');
  source = result.source; changedAny = changedAny || result.changed;
  result = replaceAllLiteral(source, 'Lead aktywny. Mozesz prowadzic kontakt sprzedazowy.', 'Lead aktywny.', 'short lead active status copy ascii');
  source = result.source; changedAny = changedAny || result.changed;

  const beforeRisk = source;
  source = ensureRiskReasonConst(source);
  source = replaceRiskReasonBlock(source);
  changedAny = changedAny || source !== beforeRisk;

  const beforeButton = source;
  source = patchLeadActionButton(source);
  changedAny = changedAny || source !== beforeButton;

  const beforeNearest = source;
  source = patchNearestActionStrong(source);
  changedAny = changedAny || source !== beforeNearest;

  const beforeCase = source;
  source = simplifyLinkedCaseCopy(source);
  changedAny = changedAny || source !== beforeCase;

  if (!changedAny) throw new Error('Stage14F nie zmienił LeadDetail.tsx. Przerywam, żeby nie robić pustego commita.');
  return source;
}
function patchCss(css) {
  if (css.includes('STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP')) return css;
  const block = [
    '',
    '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP */',
    '.lead-detail-vnext-page .lead-detail-right-rail {',
    '  max-height: none !important;',
    '  overflow: visible !important;',
    '  padding-right: 0 !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-right-card,',
    '.lead-detail-vnext-page .right-card.lead-detail-right-card {',
    '  height: auto !important;',
    '  min-height: 0 !important;',
    '  overflow: visible !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-right-card p,',
    '.lead-detail-vnext-page .lead-detail-right-card dd,',
    '.lead-detail-vnext-page .lead-detail-right-card li,',
    '.lead-detail-vnext-page .lead-detail-right-card strong,',
    '.lead-detail-vnext-page .lead-detail-right-card span {',
    '  min-width: 0 !important;',
    '  white-space: normal !important;',
    '  overflow-wrap: anywhere !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-right-card .one-line,',
    '.lead-detail-vnext-page .lead-detail-right-card [data-one-line="true"] {',
    '  overflow: hidden !important;',
    '  text-overflow: ellipsis !important;',
    '  white-space: nowrap !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-empty-value,',
    '.lead-detail-vnext-page [data-lead-next-action-empty="-"] {',
    '  display: inline-flex !important;',
    '  width: fit-content !important;',
    '  min-width: 0 !important;',
    '  align-items: center !important;',
    '  justify-content: flex-start !important;',
    '  white-space: nowrap !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-risk-reason {',
    '  margin: 0 !important;',
    '  color: #334155 !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-right-card [data-lead-start-service],',
    '.lead-detail-vnext-page .lead-detail-right-card .cf-action-button {',
    '  display: inline-flex !important;',
    '  width: 100% !important;',
    '  min-height: 38px !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  opacity: 1 !important;',
    '  visibility: visible !important;',
    '  text-align: center !important;',
    '}',
    '',
    '.lead-detail-vnext-page .lead-detail-right-card [data-lead-start-service]:disabled,',
    '.lead-detail-vnext-page .lead-detail-right-card .cf-action-button:disabled {',
    '  opacity: 0.72 !important;',
    '  visibility: visible !important;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');
  console.log('- appended: Stage14F CSS overrides');
  return css.replace(/\s*$/,'\n') + block;
}

let source = normalizeEol(read(leadPath));
let css = normalizeEol(read(cssPath));
const originalSource = source;
const originalCss = css;
source = patchSource(source);
css = patchCss(css);
if (source === originalSource) throw new Error('Brak realnej zmiany w LeadDetail.tsx.');
if (css === originalCss) throw new Error('Brak realnej zmiany w visual-stage14-lead-detail-vnext.css.');
write(leadPath, source);
write(cssPath, css);
console.log('OK: Stage14F LeadDetail right rail cleanup patch applied.');
