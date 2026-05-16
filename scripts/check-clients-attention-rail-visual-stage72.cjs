#!/usr/bin/env node
const fs=require('fs');const path=require('path');const root=process.cwd();
function tokens(){return [['Leady do ','spi','\u0119cia'].join(''),['data-clients-lead-','attention-rail'].join(''),['clients-lead-','attention-card'].join(''),['leadsNeedingClient','OrCaseLink'].join('')];}
function read(rel){return fs.existsSync(path.join(root,rel))?fs.readFileSync(path.join(root,rel),'utf8'):'';}
const checked=['src/pages/Clients.tsx','src/pages/Leads.tsx'];const bad=[];for(const rel of checked){const src=read(rel);for(const t of tokens()) if(src.includes(t)) bad.push(rel+' :: '+t);}if(bad.length){console.error(bad.join('\n'));process.exit(1);}console.log('OK: legacy clients lead-linking rail compatibility guard passed.');
