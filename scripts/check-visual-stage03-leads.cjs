#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(file){return fs.readFileSync(path.join(root,file),'utf8').replace(/^\uFEFF/,'');}
function expect(file,text,label=text){const body=read(file); if(!body.includes(text)){throw new Error(`${file}: missing ${label}`)} console.log(`OK: ${file} contains ${label}`)}
expect('src/components/Layout.tsx','VISUAL_STAGE_03_LEADS_ROUTE_SCOPE','Stage 03 route marker');
expect('src/components/Layout.tsx',"const isLeadsRoute = location.pathname === '/leads';",'leads route detection');
expect('src/components/Layout.tsx','main-leads','main-leads class');
expect('src/components/Layout.tsx',"data-visual-stage-leads={isLeadsRoute ? '03-leads' : undefined}",'Stage 03 data marker');
expect('src/pages/Leads.tsx',"consumeGlobalQuickAction() === 'lead'",'global lead trigger');
expect('src/pages/Leads.tsx','const [isNewLeadOpen, setIsNewLeadOpen]','add lead modal');
expect('src/pages/Leads.tsx','handleCreateLead','create lead flow');
expect('src/pages/Leads.tsx','insertLeadToSupabase','Supabase insert');
expect('src/pages/Leads.tsx','handleArchiveLead','archive lead');
expect('src/pages/Leads.tsx','handleRestoreLead','restore lead');
expect('src/pages/Leads.tsx','toggleTrashView','trash toggle');
expect('src/pages/Leads.tsx','searchQuery','search state');
expect('src/pages/Leads.tsx','StatShortcutCard','metric cards');
expect('src/pages/Leads.tsx','data-stage32-leads-value-rail','valuable relations rail');
expect('src/styles/visual-stage03-leads.css','VISUAL_STAGE_03_LEADS_UI_SYSTEM','Stage 03 CSS marker');
expect('src/styles/visual-stage03-leads.css','.main-leads','scoped CSS');
expect('src/styles/visual-stage03-leads.css','grid-template-columns: repeat(5','grid-5 styling');
expect('src/styles/visual-stage03-leads.css',"data-stage32-leads-value-layout",'right rail styling');
expect('src/styles/visual-stage03-leads.css','@media (max-width:760px)','mobile polish');
expect('src/index.css','@import "./styles/visual-stage03-leads.css";','Stage 03 CSS import');
console.log('OK: Visual Stage 03 Leads guard passed.');
