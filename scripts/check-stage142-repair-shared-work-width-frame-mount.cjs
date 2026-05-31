/* CLOSEFLOW_STAGE142_REPAIR_SHARED_WORK_WIDTH_FRAME_MOUNT_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

function count(content, marker) {
  return content.split(marker).length - 1;
}

const layout = read('src/components/Layout.tsx');
const frameCount = count(layout, 'data-cf-work-width-frame="true"');
if (frameCount !== 1) {
  throw new Error(`Layout.tsx must contain exactly one data-cf-work-width-frame, found ${frameCount}`);
}

mustInclude('src/components/Layout.tsx', '<div className="view active" data-shell-content="true"');
mustInclude('src/components/Layout.tsx', 'data-stage142-main-work-frame="true"');
mustInclude('src/components/Layout.tsx', 'data-cf-work-width-section={currentSection}');
mustInclude('src/components/Layout.tsx', '            {children}');

const viewIndex = layout.indexOf('<div className="view active" data-shell-content="true"');
const frameIndex = layout.indexOf('data-stage142-main-work-frame="true"');
if (viewIndex < 0 || frameIndex < 0 || frameIndex < viewIndex) {
  throw new Error('Stage142 frame must be mounted inside view.active[data-shell-content]');
}

mustInclude('src/App.tsx', "import './styles/closeflow-repair-shared-work-width-frame-stage142.css';");

const css = 'src/styles/closeflow-repair-shared-work-width-frame-stage142.css';
mustInclude(css, 'CLOSEFLOW_STAGE142_REPAIR_SHARED_WORK_WIDTH_FRAME_MOUNT');
mustInclude(css, '--closeflow-stage142-repair-shared-work-width-frame-mount: "active"');
mustInclude(css, '--cf142-work-width: 1440px');
mustInclude(css, '.view.active[data-shell-content="true"]');
mustInclude(css, '[data-stage142-main-work-frame="true"]');
mustInclude(css, '> .cf-work-width-frame[data-cf-work-width-frame="true"][data-stage142-main-work-frame="true"]');
mustInclude(css, '[data-p0-today-stable-rebuild="true"]');
mustInclude(css, '.main-clients-html');
mustInclude(css, '.main-leads-html');
mustInclude(css, '.main-cases-html');
mustInclude(css, '.activity-vnext-shell');

mustInclude('_project/STAGE142_REPAIR_SHARED_WORK_WIDTH_FRAME_MOUNT_REPORT.md', 'left: 12');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage142 repair shared work width frame mount.md', 'Stage142');

console.log('OK: Stage142 repair shared work width frame mount guard passed.');
