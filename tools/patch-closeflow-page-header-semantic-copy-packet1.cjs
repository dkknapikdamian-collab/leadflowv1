const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();

function p(rel){ return path.join(repo, rel); }
function read(rel){ return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : ''; }
function write(rel, text){ fs.writeFileSync(p(rel), text, 'utf8'); }
function addImport(rel, importLine){
  let text = read(rel);
  if (!text) throw new Error(rel + ' not found');
  if (text.includes(importLine)) return false;
  const cssImports = [...text.matchAll(/^import\s+['"][^'"]+\.css['"];\s*$/gm)];
  if (cssImports.length){
    const last = cssImports[cssImports.length - 1];
    const idx = last.index + last[0].length;
    text = text.slice(0, idx) + '\n' + importLine + text.slice(idx);
  } else {
    text = importLine + '\n' + text;
  }
  write(rel, text);
  return true;
}
function ensureEmergencyImport(){
  const rel = 'src/styles/emergency/emergency-hotfixes.css';
  if (!fs.existsSync(p(rel))) return false;
  let text = read(rel);
  const lines = text.split(/\r?\n/).filter(line => !line.includes('closeflow-page-header-copy-source-truth.css') && !line.includes('closeflow-page-header-action-semantics-packet1.css'));
  lines.push('', '/* CLOSEFLOW_PAGE_HEADER_PACKET1_IMPORTS_2026_05_11 */', "@import '../closeflow-page-header-copy-source-truth.css';", "@import '../closeflow-page-header-action-semantics-packet1.css';");
  const next = lines.join('\n');
  if (next !== text){ write(rel, next); return true; }
  return false;
}
function patchPageHeaderContent(){
  const rel='src/lib/page-header-content.ts';
  if (!fs.existsSync(p(rel))) return {found:false, changed:false};
  let text=read(rel);
  const before=text;
  const replacements=[
    ['Sprawdź, popraw i zatwierdź szkice przed zapisem w CRM.', 'Sprawdź, popraw i zatwierdź szkice przed zapisem.'],
    ['Przypomnienia i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.', 'Przypomnienia i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić'],
    ['Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.', 'Ukryta warstwa diagnostyczna dla Quick Lead Capture.'],
  ];
  for (const [from,to] of replacements){ if (text.includes(from)) text=text.split(from).join(to); }
  write(rel,text);
  return {found:true, changed:text!==before};
}
function patchGlobalQuickActions(){
  const rel='src/components/GlobalQuickActions.tsx';
  if (!fs.existsSync(p(rel))) return {found:false, changed:false};
  let text=read(rel), before=read(rel);
  if (text.includes('data-global-quick-action="ai-drafts"') && !text.includes('data-cf-command-action="ai"')){
    text=text.replace('data-global-quick-action="ai-drafts"', 'data-global-quick-action="ai-drafts" data-cf-command-action="ai"');
  }
  if (text.includes('data-global-quick-action="lead"') && !text.includes('data-global-quick-action="lead" data-cf-command-action="neutral"')){
    text=text.replace('data-global-quick-action="lead"', 'data-global-quick-action="lead" data-cf-command-action="neutral"');
  }
  if (text.includes('data-global-quick-action="task"') && !text.includes('data-global-quick-action="task" data-cf-command-action="neutral"')){
    text=text.replace('data-global-quick-action="task"', 'data-global-quick-action="task" data-cf-command-action="neutral"');
  }
  if (text.includes('data-global-quick-action="event"') && !text.includes('data-global-quick-action="event" data-cf-command-action="neutral"')){
    text=text.replace('data-global-quick-action="event"', 'data-global-quick-action="event" data-cf-command-action="neutral"');
  }
  write(rel,text);
  return {found:true, changed:text!==before};
}
function patchQuickAiCapture(){
  const rel='src/components/QuickAiCapture.tsx';
  if (!fs.existsSync(p(rel))) return {found:false, changed:false};
  let text=read(rel), before=read(rel);
  const from='className="rounded-xl" disabled={!workspaceReady}';
  const to='className="rounded-xl" data-cf-command-action="ai" disabled={!workspaceReady}';
  if (text.includes(from) && !text.includes(to)) text=text.replace(from,to);
  write(rel,text);
  return {found:true, changed:text!==before};
}

const result={
  appImportCopy:addImport('src/App.tsx', "import './styles/closeflow-page-header-copy-source-truth.css';"),
  appImportActions:addImport('src/App.tsx', "import './styles/closeflow-page-header-action-semantics-packet1.css';"),
  emergencyImports:ensureEmergencyImport(),
  pageHeaderContent:patchPageHeaderContent(),
  globalQuickActions:patchGlobalQuickActions(),
  quickAiCapture:patchQuickAiCapture(),
};
console.log('CLOSEFLOW_PAGE_HEADER_SEMANTIC_COPY_PACKET1_PATCH_OK');
console.log(JSON.stringify(result,null,2));
