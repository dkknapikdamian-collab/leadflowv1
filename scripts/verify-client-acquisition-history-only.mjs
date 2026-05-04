import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const clientPath = path.join(repo, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');
const client = fs.readFileSync(clientPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

function fail(message) {
  console.error('FAIL client acquisition history only:', message);
  process.exit(1);
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}

function findTabBlock(source, tabName, nextTabNames) {
  const noComments = stripComments(source);
  const startPattern = new RegExp("\\{\\s*activeTab\\s*===\\s*['\\\"]" + tabName + "['\\\"]\\s*(?:\\?\\s*\\(|&&\\s*\\()", 'g');
  const startMatch = startPattern.exec(noComments);
  if (!startMatch) return '';
  const start = startMatch.index;
  const nextPattern = new RegExp("\\{\\s*activeTab\\s*===\\s*['\\\"](?:" + nextTabNames.join('|') + ")['\\\"]\\s*(?:\\?\\s*\\(|&&\\s*\\()", 'g');
  nextPattern.lastIndex = start + startMatch[0].length;
  const next = nextPattern.exec(noComments);
  return noComments.slice(start, next ? next.index : noComments.length);
}

const relationsBlock = findTabBlock(client, 'cases', ['summary', 'contact', 'history']);
if (!relationsBlock) fail('missing activeTab cases/relations block');
if (!client.includes('CLIENT_DETAIL_STAGE46_ACQUISITION_HISTORY_ONLY')) fail('missing Stage46 marker in ClientDetail');
if (!relationsBlock.includes('data-client-relations-acquisition-only="true"')) fail('relations tab is not marked acquisition-only');
if (!relationsBlock.includes('Historia pozyskania')) fail('relations tab does not show Historia pozyskania');
if (!relationsBlock.includes('data-client-acquisition-history-row="true"')) fail('relations tab does not render acquisition history rows');
if (relationsBlock.includes('clientCaseRows.map')) fail('relations tab still renders the old duplicate relation/case rows');
if (/<Link\b/.test(relationsBlock) || /to=\{?\s*[`'\"]\/leads\//.test(relationsBlock) || /navigate\(\s*[`'\"]\/leads\//.test(relationsBlock)) {
  fail('relations tab still exposes lead-detail route actions');
}
if (relationsBlock.includes('Otwórz lead') || relationsBlock.includes('Historia leada') || relationsBlock.includes('Zobacz lead')) {
  fail('relations tab still exposes duplicate lead actions');
}
if (!css.includes('CLIENT_DETAIL_STAGE46_ACQUISITION_HISTORY_ONLY')) fail('missing CSS Stage46 marker');
if (!css.includes('client-detail-relation-row-acquisition-only')) fail('missing acquisition-only CSS');
console.log('PASS client acquisition history only: Relacje tab has one acquisition history surface and no duplicate lead routes.');
