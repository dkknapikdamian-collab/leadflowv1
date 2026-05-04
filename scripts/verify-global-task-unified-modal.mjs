import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(repo, relativePath), 'utf8');
const blockComment = new RegExp('/\\*[\\s\\S]*?\\*/', 'g');
const jsxComment = new RegExp('\\{\/\\*[\\s\\S]*?\\*\/\\}', 'g');
const stripComments = (source) => source.replace(blockComment, '').replace(jsxComment, '');
const fail = (message) => { console.error('FAIL global task direct modal:', message); process.exit(1); };

const globalRaw = read('src/components/GlobalQuickActions.tsx');
const global = stripComments(globalRaw);
const taskDialog = read('src/components/TaskCreateDialog.tsx');
const taskButton = global.match(/<Button[^>]*data-global-quick-action="task"[\s\S]*?<\/Button>/)?.[0] || '';

if (!taskButton) fail('global task button missing');
if (!/type="button"/.test(taskButton)) fail('global task button must be a button, not a route link');
if (!/setIsTaskCreateOpen\(true\)/.test(taskButton)) fail('global task button does not open the modal directly');
if (/asChild/.test(taskButton) || /<Link\b/.test(taskButton) || /to="\/tasks/.test(taskButton)) fail('global task button still routes to Tasks instead of opening direct modal');
if (!/<TaskCreateDialog open=\{isTaskCreateOpen\}/.test(global)) fail('shared TaskCreateDialog not mounted from global toolbar');
if (!/data-task-create-dialog-stage45m="true"/.test(taskDialog)) fail('TaskCreateDialog Stage45M marker missing');
if (!/insertTaskToSupabase/.test(taskDialog)) fail('TaskCreateDialog does not save tasks');
if (!/Przypomnienie/.test(taskDialog)) fail('TaskCreateDialog does not expose reminder field');

console.log('PASS global task direct modal: global Zadanie opens shared task dialog without route navigation.');
