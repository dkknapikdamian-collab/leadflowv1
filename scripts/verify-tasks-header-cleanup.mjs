import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(repo, relativePath), 'utf8');
const blockComment = new RegExp('/\\*[\\s\\S]*?\\*/', 'g');
const jsxComment = new RegExp('\\{\/\\*[\\s\\S]*?\\*\/\\}', 'g');
const stripComments = (source) => source.replace(blockComment, '').replace(jsxComment, '');
const fail = (message) => { console.error('FAIL tasks header cleanup:', message); process.exit(1); };

const tasksStable = read('src/pages/TasksStable.tsx');
const executable = stripComments(tasksStable);
const css = read('src/styles/tasks-header-stage45b-cleanup.css');

if (/Stabilny widok Supabase bez bramki Firebase/.test(executable)) fail('technical Supabase/Firebase copy is visible in real TasksStable screen');
if (/onClick=\{openNewTask\}/.test(executable)) fail('real TasksStable header still has openNewTask CTA');
if (/<Plus[\s\S]{0,120}Nowe zadanie[\s\S]{0,180}<\/Button>/.test(executable)) fail('real TasksStable header still renders + Nowe zadanie');
if (!/data-tasks-refresh-visible-stage45m="true"/.test(executable)) fail('real TasksStable refresh button lacks Stage45M visibility marker');
if (!/TASKS_HEADER_STAGE45B_CLEANUP/.test(css)) fail('tasks cleanup css marker missing');

console.log('PASS tasks header cleanup: real TasksStable header CTA removed, technical copy removed, refresh visible.');
