const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(relativePath) {
  const target = path.join(repo, relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(target, 'utf8');
}

function expectIncludes(content, text, label, filePath) {
  if (!content.includes(text)) {
    throw new Error(`${filePath}: missing ${label || text}`);
  }
  console.log(`OK: ${filePath} contains ${label || text}`);
}

function chars() {
  return String.fromCharCode.apply(String, arguments);
}

const badPatterns = [
  chars(0x0139),
  chars(0x00c4),
  chars(0x0102),
  chars(0x00e2, 0x20ac),
  chars(0x00c5, 0x00bc),
  chars(0x00c5, 0x00ba),
  chars(0x00c5, 0x201a),
  chars(0x00c5, 0x201e),
  chars(0x00c5, 0x203a),
  chars(0x00c3, 0x00b3),
];

const files = {
  layout: { path: 'src/components/Layout.tsx', content: read('src/components/Layout.tsx') },
  todayCss: { path: 'src/styles/visual-stage02-today.css', content: read('src/styles/visual-stage02-today.css') },
  indexCss: { path: 'src/index.css', content: read('src/index.css') },
  today: { path: 'src/pages/Today.tsx', content: read('src/pages/Today.tsx') },
};

expectIncludes(files.layout.content, 'VISUAL_STAGE_02_TODAY_ROUTE_SCOPE', 'Stage 02 route scope marker', files.layout.path);
expectIncludes(files.layout.content, "const isTodayRoute = location.pathname === '/'", 'today route detection', files.layout.path);
expectIncludes(files.layout.content, "main-today", 'main-today scoped class', files.layout.path);
if (files.layout.content.includes("data-current-section={isTodayRoute ? 'today'") || files.layout.content.includes('data-current-section={currentSection}')) {
  console.log(`OK: ${files.layout.path} contains current section marker`);
} else {
  throw new Error(`${files.layout.path}: missing current section marker`);
}
if (files.layout.content.includes("data-visual-stage-today={isTodayRoute ? '02-today'") || files.layout.content.includes('data-visual-stage-today={isTodayRoute')) {
  console.log(`OK: ${files.layout.path} contains today visual data marker`);
} else {
  throw new Error(`${files.layout.path}: missing today visual data marker`);
}

expectIncludes(files.todayCss.content, 'VISUAL_STAGE_02_TODAY_CSS', 'Stage 02 CSS marker', files.todayCss.path);
expectIncludes(files.todayCss.content, '.closeflow-visual-stage01 .main-today', 'scoped Today selector', files.todayCss.path);
expectIncludes(files.todayCss.content, '[data-today-tile-card="true"]', 'Today tile card styling', files.todayCss.path);
expectIncludes(files.todayCss.content, '[data-today-tile-header="true"]', 'Today tile header styling', files.todayCss.path);
expectIncludes(files.todayCss.content, '[data-today-quick-snooze-bar="true"]', 'Today snooze bar styling', files.todayCss.path);
expectIncludes(files.todayCss.content, '@media (max-width: 760px)', 'mobile polish', files.todayCss.path);

expectIncludes(files.indexCss.content, '@import "./styles/visual-stage02-today.css";', 'Stage 02 CSS import', files.indexCss.path);

expectIncludes(files.today.content, 'TODAY_GLOBAL_QUICK_ACTIONS_DEDUPED_V97', 'global actions dedupe contract', files.today.path);
expectIncludes(files.today.content, 'data-today-tile-header="true"', 'clickable/collapsible tile headers', files.today.path);
expectIncludes(files.today.content, 'data-today-tile-card="true"', 'tile cards remain present', files.today.path);
expectIncludes(files.today.content, 'data-today-quick-snooze-bar="true"', 'quick snooze remains present', files.today.path);
expectIncludes(files.today.content, 'openTodayTopTileShortcut', 'top tile shortcut handler remains present', files.today.path);
expectIncludes(files.today.content, 'getAiLeadDraftsAsync', 'AI drafts remain loaded in Today', files.today.path);
expectIncludes(files.today.content, 'insertTaskToSupabase', 'task create flow remains present', files.today.path);
expectIncludes(files.today.content, 'insertEventToSupabase', 'event create flow remains present', files.today.path);
expectIncludes(files.today.content, 'updateTaskInSupabase', 'task update flow remains present', files.today.path);
expectIncludes(files.today.content, 'updateEventInSupabase', 'event update flow remains present', files.today.path);

for (const file of Object.values(files)) {
  const lines = file.content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (badPatterns.some((pattern) => line.includes(pattern))) {
      throw new Error(`Polish mojibake detected in ${file.path}:${index + 1}: ${line.trim().slice(0, 180)}`);
    }
  });
}

console.log('OK: Visual Stage 02 Today guard passed.');
