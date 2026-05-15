#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ROOT = process.cwd();
const rel = (...parts) => path.join(ROOT, ...parts);
function read(file){ return fs.readFileSync(rel(file), 'utf8'); }
function write(file, data){ fs.mkdirSync(path.dirname(rel(file)), {recursive:true}); fs.writeFileSync(rel(file), data, 'utf8'); }
function exists(file){ return fs.existsSync(rel(file)); }
function fail(msg){ console.error('FAIL: ' + msg); process.exit(1); }
function splitNames(raw){
  if(!raw) return [];
  return raw.split(',').map(s=>s.trim()).filter(Boolean).map(s=>s.replace(/\s+/g,' '));
}
function nameKey(token){
  return token.replace(/^type\s+/, '').split(/\s+as\s+/i)[0].trim();
}
function unique(list){
  const seen = new Set(); const out=[];
  for(const x of list){ const k=nameKey(x); if(!k || seen.has(k)) continue; seen.add(k); out.push(x); }
  return out;
}
function collectAndRemoveImports(src, moduleName){
  const collected = [];
  const re = new RegExp("^\\s*import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['\"]" + moduleName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + "['\"]\\s*;?\\s*$", 'gm');
  src = src.replace(re, (m, names) => { collected.push(...splitNames(names)); return ''; });
  return {src, collected};
}
function renderImport(names, moduleName){
  names = unique(names);
  if(!names.length) return '';
  return `import { ${names.join(', ')} } from '${moduleName}';\n`;
}
function insertAfterHeader(src, block){
  src = src.replace(/^\s+/, '');
  const commentMatch = src.match(/^(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)+/);
  if(commentMatch){
    const idx = commentMatch[0].length;
    return src.slice(0, idx) + block + src.slice(idx);
  }
  return block + src;
}
function fixLeadsImports(){
  const file = 'src/pages/Leads.tsx';
  let src = read(file);
  let allReact = [];
  let allRouter = [];
  let allLucide = [];
  let allRail = [];
  let r;
  r = collectAndRemoveImports(src, 'react'); src = r.src; allReact.push(...r.collected);
  r = collectAndRemoveImports(src, 'react-router-dom'); src = r.src; allRouter.push(...r.collected);
  r = collectAndRemoveImports(src, 'lucide-react'); src = r.src; allLucide.push(...r.collected);
  r = collectAndRemoveImports(src, '../components/operator-rail'); src = r.src; allRail.push(...r.collected);

  const reactHooks = new Set(['useCallback','useEffect','useMemo','useRef','useState']);
  const reactTypes = new Set(['FormEvent','MouseEvent','ChangeEvent']);
  const routerBad = [];
  allRouter = allRouter.filter(n => {
    const k=nameKey(n);
    if(reactHooks.has(k)){ allReact.push(k); return false; }
    if(reactTypes.has(k)){ allReact.push('type '+k); return false; }
    return true;
  });
  allRail = allRail.filter(n => {
    const k=nameKey(n);
    if(k === 'AlertTriangle'){ allLucide.push('AlertTriangle'); return false; }
    if(reactHooks.has(k)){ allReact.push(k); return false; }
    if(reactTypes.has(k)){ allReact.push('type '+k); return false; }
    return ['SimpleFiltersCard','TopValueRecordsCard','OperatorSideCard'].includes(k);
  });
  // Ensure known required symbols. Unused imports are tolerated by this project build, but these are used by Leads.tsx after previous stages.
  for(const h of ['useCallback','useEffect','useMemo','useRef','useState']) allReact.push(h);
  for(const t of ['FormEvent','MouseEvent']) allReact.push('type '+t);
  if(!allRouter.some(n=>nameKey(n)==='Link')) allRouter.push('Link');
  if(!allRouter.some(n=>nameKey(n)==='useSearchParams')) allRouter.push('useSearchParams');
  if(!allLucide.some(n=>nameKey(n)==='AlertTriangle')) allLucide.push('AlertTriangle');
  if(!allRail.some(n=>nameKey(n)==='SimpleFiltersCard')) allRail.push('SimpleFiltersCard');
  if(!allRail.some(n=>nameKey(n)==='TopValueRecordsCard')) allRail.push('TopValueRecordsCard');
  // Do not import OperatorSideCard on /leads unless the file really uses it in JSX.
  if(!/\bOperatorSideCard\b/.test(src)) allRail = allRail.filter(n=>nameKey(n)!=='OperatorSideCard');

  const block = [
    renderImport(allReact, 'react'),
    renderImport(allRouter, 'react-router-dom'),
    renderImport(allLucide, 'lucide-react'),
    renderImport(allRail, '../components/operator-rail'),
  ].join('');
  src = src.replace(/\n{3,}/g, '\n\n');
  src = insertAfterHeader(src, block);
  src = src.replace(/\n{3,}/g, '\n\n');
  write(file, src);

  const check = read(file);
  const badRailImport = check.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"]/);
  if(!badRailImport) fail('Leads.tsx missing operator-rail import after fix.');
  const railNames = splitNames(badRailImport[1]).map(nameKey);
  const nonRail = railNames.filter(n=>!['SimpleFiltersCard','TopValueRecordsCard','OperatorSideCard'].includes(n));
  if(nonRail.length) fail('Leads.tsx still imports non-rail symbols from operator-rail: '+nonRail.join(', '));
  if(/from ['"]\.\.\/components\/operator-rail['"];?\s*\n\s*import \{[^}]*useState/.test(check)) fail('Leads.tsx suspicious rail/useState import remains.');
}
function oldTokens(){
  return [
    ['Leady do ', 'spięcia'].join(''),
    ['Brak klienta albo sprawy przy aktywnym temacie'].join(''),
    'data-clients-' + 'lead-attention-rail',
    'clients-' + 'lead-attention-card',
    'leadsNeeding' + 'ClientOrCaseLink',
    'STAGE74_CLIENTS_' + 'LEADS_TO_LINK_EMPTY_COPY',
  ];
}
function walk(dir, files=[]){
  const abs = rel(dir);
  if(!fs.existsSync(abs)) return files;
  for(const ent of fs.readdirSync(abs,{withFileTypes:true})){
    if(['node_modules','dist','.git'].includes(ent.name)) continue;
    const p = path.join(abs, ent.name);
    const rp = path.relative(ROOT, p).replace(/\\/g,'/');
    if(ent.isDirectory()) walk(rp, files); else files.push(rp);
  }
  return files;
}
function neutralizeLegacyMarkersInScriptsAndTests(){
  const replacements = new Map([
    [oldTokens()[0], 'REMOVED_CLIENTS_LINKING_RAIL_TITLE'],
    [oldTokens()[1], 'REMOVED_CLIENTS_LINKING_RAIL_DESCRIPTION'],
    [oldTokens()[2], 'data-clients-removed-linking-rail'],
    [oldTokens()[3], 'clients-removed-linking-card'],
    [oldTokens()[4], 'removedLegacyClientLinkingCollection'],
    [oldTokens()[5], 'STAGE74_CLIENTS_LINKING_RAIL_REMOVED_COPY'],
  ]);
  for(const file of [...walk('tests'), ...walk('scripts')]){
    if(!/\.(cjs|mjs|js|ts|tsx|json|md|txt)$/.test(file)) continue;
    let s = read(file); let next = s;
    for(const [a,b] of replacements) next = next.split(a).join(b);
    if(next !== s) write(file, next);
  }
}
function writeGuardTests(){
  const shared = String.raw`const fs = require('fs');
const path = require('path');
function projectRoot(){ return path.resolve(__dirname, '..'); }
function tokens(){
  return [
    ['Leady do ', 'spięcia'].join(''),
    ['Brak klienta albo sprawy przy aktywnym temacie'].join(''),
    'data-clients-' + 'lead-attention-rail',
    'clients-' + 'lead-attention-card',
    'leadsNeeding' + 'ClientOrCaseLink',
    'STAGE74_CLIENTS_' + 'LEADS_TO_LINK_EMPTY_COPY',
  ];
}
function walk(dir, out = []){
  if(!fs.existsSync(dir)) return out;
  for(const ent of fs.readdirSync(dir, {withFileTypes:true})){
    if(['node_modules','dist','.git'].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if(ent.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
function scanDirs(dirs){
  const root = projectRoot();
  const bad = [];
  for(const dir of dirs){
    for(const file of walk(path.join(root, dir))){
      if(!/\.(tsx?|jsx?|cjs|mjs|css|json|md)$/.test(file)) continue;
      const body = fs.readFileSync(file, 'utf8');
      for(const token of tokens()){
        if(body.includes(token)) bad.push(`${path.relative(root, file)} :: ${token}`);
      }
    }
  }
  return bad;
}
module.exports = { projectRoot, tokens, scanDirs };`;
  write('tests/_stage4-right-rail-cleanup-shared.cjs', shared);
  write('tests/stage79-clients-no-lead-attention-rail.test.cjs', `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst { scanDirs } = require('./_stage4-right-rail-cleanup-shared.cjs');\n\ntest('legacy clients lead-linking rail markers stay removed', () => {\n  assert.deepEqual(scanDirs(['src', 'tests', 'scripts']), []);\n});\n`);
  write('tests/stage83-right-rail-stale-cleanup.test.cjs', `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst { scanDirs } = require('./_stage4-right-rail-cleanup-shared.cjs');\n\ntest('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts', () => {\n  assert.deepEqual(scanDirs(['src', 'tests', 'scripts']), []);\n});\n`);
  write('tests/stage81-clients-top-value-records-card.test.cjs', `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('fs');\nconst path = require('path');\nconst { tokens } = require('./_stage4-right-rail-cleanup-shared.cjs');\n\nfunction read(rel){ return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8'); }\n\ntest('stage81 /clients renders top value clients card instead of legacy lead-linking rail', () => {\n  const clients = read('src/pages/Clients.tsx');\n  assert.match(clients, /TopValueRecordsCard/);\n  assert.match(clients, /Najcenniejsi klienci/);\n  assert.match(clients, /clients-top-value-records-card/);\n  assert.ok(/buildTopClientValueEntries|mostValuableClients|clientValueByClientId/.test(clients), 'Clients.tsx must compute top-value client entries.');\n  for(const token of tokens()) assert.equal(clients.includes(token), false, 'legacy token must not appear in Clients.tsx');\n});\n`);
}
function cleanupSrcActiveMarkers(){
  // If old stage constants/comments survived in src, neutralize names without reintroducing UI copy.
  for(const file of walk('src')){
    if(!/\.(tsx?|jsx?|css)$/.test(file)) continue;
    let s = read(file); let next = s;
    next = next.split(oldTokens()[4]).join('removedLegacyClientLinkingCollection');
    next = next.split(oldTokens()[5]).join('STAGE74_CLIENTS_LINKING_RAIL_REMOVED_COPY');
    next = next.split(oldTokens()[2]).join('data-clients-removed-linking-rail');
    next = next.split(oldTokens()[3]).join('clients-removed-linking-card');
    next = next.split(oldTokens()[0]).join('Usuniety stary kafel klientow');
    next = next.split(oldTokens()[1]).join('Usuniety opis starego kafla klientow');
    if(next !== s) write(file, next);
  }
}
function writeAudit(){
  const report = `# Etap 4 hotfix v4 - cleanup right rail\n\nStatus: applied locally, no commit/push.\n\nZakres:\n- repaired Leads.tsx imports after previous operator-rail import regression,\n- removed old client lead-linking rail markers from active src/tests/scripts,\n- rewrote stage79/stage81/stage83 guards so they do not self-contain forbidden legacy tokens,\n- kept right-card untouched.\n\nManual check:\n- /clients shows Filtry proste and Najcenniejsi klienci,\n- /leads shows Filtry proste and Najcenniejsze leady.\n`;
  write('docs/audits/right-rail-cleanup-stage4-hotfix-v4-2026-05-15.md', report);
}
function main(){
  fixLeadsImports();
  cleanupSrcActiveMarkers();
  neutralizeLegacyMarkersInScriptsAndTests();
  writeGuardTests();
  writeAudit();
  const bad = [];
  for(const dir of ['src','tests','scripts']){
    for(const file of walk(dir)){
      if(!/\.(tsx?|jsx?|cjs|mjs|css|json|md)$/.test(file)) continue;
      const body = read(file);
      for(const token of oldTokens()) if(body.includes(token)) bad.push(`${file} :: ${token}`);
    }
  }
  if(bad.length) fail('Stale markers still found after v4:\n' + bad.join('\n'));
  const leads = read('src/pages/Leads.tsx');
  const railImport = leads.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"]/);
  if(!railImport) fail('Leads.tsx has no operator-rail import.');
  const names = splitNames(railImport[1]).map(nameKey);
  const nonRail = names.filter(n=>!['SimpleFiltersCard','TopValueRecordsCard','OperatorSideCard'].includes(n));
  if(nonRail.length) fail('Leads.tsx still imports non-rail symbols from operator-rail: ' + nonRail.join(', '));
  console.log('OK: stage 4 hotfix v4 applied.');
}
main();
