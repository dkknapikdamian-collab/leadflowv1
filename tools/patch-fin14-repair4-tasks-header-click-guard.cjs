const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/TasksStable.tsx');

function fail(message) {
  throw new Error(message);
}

if (!fs.existsSync(file)) {
  fail('Brak src/pages/TasksStable.tsx');
}

let source = fs.readFileSync(file, 'utf8');
const before = source;

const directPattern = /onClick=\{\s*openNewTask\s*\}/g;
const matches = source.match(directPattern) || [];

if (matches.length > 0) {
  source = source.replace(directPattern, 'onClick={() => openNewTask()}');
}

if (/onClick=\{\s*openNewTask\s*\}/.test(source)) {
  fail('TasksStable nadal ma stary handler onClick={openNewTask}');
}

if (!source.includes('onClick={() => openNewTask()}')) {
  fail('TasksStable nie ma nowego handlera onClick={() => openNewTask()}');
}

const marker = "const FIN14_REPAIR4_TASKS_HEADER_CLICK_GUARD = 'FIN-14_REPAIR4_TASKS_HEADER_CLICK_GUARD_inline_openNewTask';";
if (!source.includes(marker)) {
  const anchor = "const CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK = 'tasks metric tile compact parity final lock';\nvoid CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK;";
  if (source.includes(anchor)) {
    source = source.replace(anchor, `${anchor}\n${marker}\nvoid FIN14_REPAIR4_TASKS_HEADER_CLICK_GUARD;`);
  } else {
    source = `${source.trimEnd()}\n\n${marker}\nvoid FIN14_REPAIR4_TASKS_HEADER_CLICK_GUARD;\n`;
  }
}

fs.writeFileSync(file, source, 'utf8');

if (source === before) {
  console.log('[FIN-14 REPAIR4] TasksStable.tsx już był zgodny z guardem onClick.');
} else {
  console.log(`[FIN-14 REPAIR4] TasksStable.tsx: zamieniono ${matches.length} wystąpień onClick={openNewTask} na inline callback i dodano marker.`);
}
