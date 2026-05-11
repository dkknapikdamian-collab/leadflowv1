const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
function walk(dir){
  const out=[];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && /\.(css|tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}
const files=[...walk(path.join(repo,'src','styles')),...walk(path.join(repo,'src','components')),...walk(path.join(repo,'src','pages')),...walk(path.join(repo,'src','lib'))];
const patterns=['head-actions','cf-page-hero-actions','soft-blue','bg-green','bg-emerald','cf-trash-action-button','cf-entity-action-danger','cf-section-head-action-stack','cf-page-header-description'];
const hits=[];
for(const full of files){
  const rel=path.relative(repo,full).replaceAll('\\','/');
  const lines=fs.readFileSync(full,'utf8').split(/\r?\n/);
  lines.forEach((line,i)=>{ if(patterns.some(p=>line.includes(p))) hits.push({file:rel,line:i+1,text:line.trim().slice(0,260)}); });
}
const byFile={};
for(const hit of hits) byFile[hit.file]=(byFile[hit.file]||0)+1;
fs.mkdirSync(path.join(repo,'docs','ui'),{recursive:true});
fs.writeFileSync(path.join(repo,'docs','ui','CLOSEFLOW_PAGE_HEADER_SEMANTIC_COPY_PACKET1_AUDIT.generated.json'), JSON.stringify({count:hits.length,byFile,hits},null,2), 'utf8');
console.log('CLOSEFLOW_PAGE_HEADER_SEMANTIC_COPY_PACKET1_AUDIT_OK');
console.log(JSON.stringify({files:Object.keys(byFile).length, hits:hits.length}, null, 2));
