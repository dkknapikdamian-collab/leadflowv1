#!/usr/bin/env node
/* CLOSEFLOW_ETAP7_ADMIN_FEEDBACK_SAFE_FINAL_REPAIR
 * No embedded generated guard strings here. The ZIP copies guards as standalone files.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const relPath = (rel) => path.join(root, rel);
const exists = (rel) => fs.existsSync(relPath(rel));
const read = (rel) => fs.existsSync(relPath(rel)) ? fs.readFileSync(relPath(rel), 'utf8') : '';
const write = (rel, text) => {
  fs.mkdirSync(path.dirname(relPath(rel)), { recursive: true });
  fs.writeFileSync(relPath(rel), text, 'utf8');
  console.log('updated ' + rel.replace(/\\/g, '/'));
};
const fail = (message) => {
  console.error('✖ ' + message);
  process.exit(1);
};

const casesRel = 'src/pages/Cases.tsx';
const todayRel = 'src/pages/Today.tsx';
const pkgRel = 'package.json';
if (!exists(casesRel)) fail('missing ' + casesRel);
if (!exists(pkgRel)) fail('missing ' + pkgRel);

let cases = read(casesRel);

if (!cases.includes('function cleanCaseListTitle(')) {
  const compactRegex = /function compactNextAction\(value: string\) \{[\s\S]*?\n\}\n\nfunction formatNearestCaseAction/;
  const match = cases.match(compactRegex);
  if (!match) fail('could not locate compactNextAction block');
  const compactBlock = match[0].replace('\n\nfunction formatNearestCaseAction', '');
  const helper = compactBlock + '\n\n'
    + 'function cleanCaseListTitle(value: unknown): string {\n'
    + "  const text = typeof value === 'string' ? value.trim() : '';\n"
    + "  if (!text) return '';\n"
    + '  return text\n'
    + '    .replace(/\\s*-\\s*obsługa\\s*$/i, \'\')\n'
    + '    .replace(/\\s*-\\s*obs(?:ł|l|\\u0142|\\u0139\\u201a|\\u253c\\u00e9)uga\\s*$/i, \'\')\n'
    + '    .trim();\n'
    + '}\n\n'
    + 'function formatNearestCaseAction';
  cases = cases.replace(compactRegex, helper);
}

const oldClientGenerator = "title: prev.title.trim() ? prev.title : `${String(client?.name || client?.company || 'Klient')} - obsługa`,";
const newClientGenerator = "title: prev.title.trim() ? cleanCaseListTitle(prev.title) : String(client?.name || client?.company || 'Sprawa bez nazwy'),";
cases = cases.replace(oldClientGenerator, newClientGenerator);

const oldSuggestionGenerator = "title: prev.title.trim() ? prev.title : `${option.name} - obsługa`,";
const newSuggestionGenerator = "title: prev.title.trim() ? cleanCaseListTitle(prev.title) : option.name || 'Sprawa bez nazwy',";
cases = cases.replace(oldSuggestionGenerator, newSuggestionGenerator);

const titleLinkRegex = /<Link to=\{`\/case\/\$\{record\.id\}`\} className="title">[\s\S]*?<\/Link>/;
const cleanedTitleLink = '<Link to={`/case/${record.id}`} className="title">{cleanCaseListTitle(record.title || record.clientName || \'Sprawa bez nazwy\')}</Link>';
if (titleLinkRegex.test(cases)) {
  cases = cases.replace(titleLinkRegex, cleanedTitleLink);
}

const oldCompleteness = 'lifecycle.missingRequiredCount > 0 ? `brakuje ${lifecycle.missingRequiredCount} elementów` : `${percent}% kompletności`,';
const newCompleteness = 'lifecycle.missingRequiredCount > 0 ? `brakuje ${lifecycle.missingRequiredCount} elementów` : null,';
cases = cases.replace(oldCompleteness, newCompleteness);

if (!cases.includes('function cleanCaseListTitle(value: unknown): string')) fail('ETAP6 cleanCaseListTitle helper missing');
if (!cases.includes("cleanCaseListTitle(record.title || record.clientName || 'Sprawa bez nazwy')")) fail('ETAP6 list title render not cleaned');
if (cases.includes(oldClientGenerator)) fail('client title suffix generator still present');
if (cases.includes(oldSuggestionGenerator)) fail('suggestion title suffix generator still present');
if (cases.includes('`${percent}% kompletności`')) fail('percent completeness literal still present');
if (cases.includes('obs┼éuga')) fail('literal mojibake obs┼éuga still present in Cases');
if (cases.includes('obsĹ‚uga')) fail('literal mojibake obsĹ‚uga still present in Cases');
write(casesRel, cases);

if (exists(todayRel)) {
  let today = read(todayRel);
  const before = today;
  today = today
    .replace(/obs┼é/g, 'obsł')
    .replace(/Obs┼é/g, 'Obsł')
    .replace(/OBS┼É/g, 'OBSŁ');
  if (today !== before) write(todayRel, today);
  else console.log('unchanged ' + todayRel + ' (no obs mojibake found)');
}

let pkg = JSON.parse(read(pkgRel));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:etap6-cases-clean-list-title-completeness'] = 'node scripts/check-closeflow-etap6-cases-clean-list-title-completeness.cjs';
pkg.scripts['check:closeflow-admin-feedback-2026-05-11'] = 'node scripts/check-closeflow-admin-feedback-2026-05-11.cjs';
write(pkgRel, JSON.stringify(pkg, null, 2) + '\n');

console.log('✔ CLOSEFLOW_ETAP7_ADMIN_FEEDBACK_SAFE_FINAL repair applied');
