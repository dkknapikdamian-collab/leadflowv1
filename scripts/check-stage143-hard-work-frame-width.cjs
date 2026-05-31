/* CLOSEFLOW_STAGE143_HARD_WORK_FRAME_WIDTH_GUARD */
const fs=require('fs');const path=require('path');const root=process.cwd();
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(rel,m)=>{const c=read(rel);if(!c.includes(m))throw new Error(`${rel} missing marker: ${m}`);};
const layout=read('src/components/Layout.tsx');
must('src/components/Layout.tsx','data-cf-work-width-frame="true"');
must('src/components/Layout.tsx','data-stage143-work-width-frame="true"');
must('src/components/Layout.tsx','data-cf-work-width-section={currentSection}');
const frameCount=(layout.match(/data-cf-work-width-frame="true"/g)||[]).length;
if(frameCount!==1)throw new Error(`Layout.tsx must contain exactly one data-cf-work-width-frame, found ${frameCount}`);
must('src/App.tsx',"import './styles/closeflow-hard-work-frame-width-stage143.css';");
const css='src/styles/closeflow-hard-work-frame-width-stage143.css';
[
'CLOSEFLOW_STAGE143_HARD_WORK_FRAME_WIDTH',
'--closeflow-stage143-hard-work-frame-width:"active"',
'--cf143-work-width:1480px',
'[data-shell-content="true"]>[data-cf-work-width-frame="true"]',
'[data-shell-content="true"]>[data-stage143-work-width-frame="true"]',
'calc(100vw - var(--cf143-sidebar-width)',
'max-width:var(--cf143-work-width)!important',
'.main-clients-html',
'.main-leads-html',
'.main-cases-html',
'[data-p0-today-stable-rebuild="true"]',
'[data-p0-tasks-stable-rebuild="true"]',
'.activity-vnext-shell'
].forEach(m=>must(css,m));
must('_project/STAGE143_HARD_WORK_FRAME_WIDTH_REPORT.md','left 12 / width 262');
must('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage143 hard work frame width.md','Stage143');
console.log('OK: Stage143 hard work frame width guard passed.');
