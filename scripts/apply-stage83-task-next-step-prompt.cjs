const fs = require('fs');
const path = require('path');

const root = process.cwd();
const tasksPath = path.join(root, 'src', 'pages', 'TasksStable.tsx');
const packagePath = path.join(root, 'package.json');

function fail(message) {
  console.error('FAIL APPLY_STAGE83_TASK_DONE_NEXT_STEP_PROMPT: ' + message);
  process.exit(1);
}

function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) fail('missing anchor: ' + label);
  return source.replace(search, replacement);
}

if (!fs.existsSync(tasksPath)) fail('missing src/pages/TasksStable.tsx');
if (!fs.existsSync(packagePath)) fail('missing package.json');

let tasks = fs.readFileSync(tasksPath, 'utf8');

if (!tasks.includes('STAGE83_TASK_DONE_NEXT_STEP_PROMPT')) {
  tasks = replaceOnce(
    tasks,
    "const TASKS_VISIBLE_ACTIONS_STAGE47 = 'TASKS_VISIBLE_ACTIONS_STAGE47';\nvoid TASKS_VISIBLE_ACTIONS_STAGE47;",
    "const TASKS_VISIBLE_ACTIONS_STAGE47 = 'TASKS_VISIBLE_ACTIONS_STAGE47';\nvoid TASKS_VISIBLE_ACTIONS_STAGE47;\nconst STAGE83_TASK_DONE_NEXT_STEP_PROMPT = 'STAGE83_TASK_DONE_NEXT_STEP_PROMPT';\nvoid STAGE83_TASK_DONE_NEXT_STEP_PROMPT;",
    'stage marker after TASKS_VISIBLE_ACTIONS_STAGE47',
  );

  tasks = replaceOnce(
    tasks,
    "type TaskScope = 'active' | 'today' | 'overdue' | 'done';\n\ntype TaskFormState = {",
    "type TaskScope = 'active' | 'today' | 'overdue' | 'done';\n\ntype NextStepPromptState = {\n  sourceTask: any;\n  title: string;\n  dueAt: string;\n  priority: string;\n};\n\ntype TaskFormState = {",
    'NextStepPromptState type',
  );

  tasks = replaceOnce(
    tasks,
    "function getBadgeClass(task: any) {\n  if (isTaskDone(task)) return 'bg-emerald-50 text-emerald-700 border-emerald-100';\n  if (isTaskOverdue(task)) return 'bg-rose-50 text-rose-700 border-rose-100';\n  if (isTaskToday(task)) return 'bg-blue-50 text-blue-700 border-blue-100';\n  return 'bg-slate-50 text-slate-700 border-slate-100';\n}\n\nexport default function TasksStable() {",
    "function getBadgeClass(task: any) {\n  if (isTaskDone(task)) return 'bg-emerald-50 text-emerald-700 border-emerald-100';\n  if (isTaskOverdue(task)) return 'bg-rose-50 text-rose-700 border-rose-100';\n  if (isTaskToday(task)) return 'bg-blue-50 text-blue-700 border-blue-100';\n  return 'bg-slate-50 text-slate-700 border-slate-100';\n}\n\nfunction getTaskRelationIds(task: any) {\n  return {\n    leadId: task?.leadId || task?.lead_id || null,\n    caseId: task?.caseId || task?.case_id || null,\n    clientId: task?.clientId || task?.client_id || null,\n  };\n}\n\nfunction shouldOfferNextStepPrompt(task: any) {\n  const relationIds = getTaskRelationIds(task);\n  const taskType = readText(task, ['type'], '').toLowerCase();\n  return Boolean(relationIds.leadId || relationIds.caseId || relationIds.clientId || taskType.includes('follow'));\n}\n\nfunction buildNextStepDefaultDueAt() {\n  const date = new Date();\n  date.setDate(date.getDate() + 1);\n  date.setHours(9, 0, 0, 0);\n  return toDateTimeLocalValue(date);\n}\n\nfunction buildNextStepPromptState(task: any): NextStepPromptState {\n  const cleanTitle = getTaskTitle(task).replace(/^follow[- ]?up:\\s*/i, '').trim();\n  return {\n    sourceTask: task,\n    title: cleanTitle ? 'Kolejny krok: ' + cleanTitle : 'Kolejny follow-up',\n    dueAt: buildNextStepDefaultDueAt(),\n    priority: readText(task, ['priority'], 'medium') || 'medium',\n  };\n}\n\nexport default function TasksStable() {",
    'stage83 helper block',
  );

  tasks = replaceOnce(
    tasks,
    "  const [isDialogOpen, setIsDialogOpen] = useState(false);\n  const [form, setForm] = useState<TaskFormState>(() => defaultTaskForm());",
    "  const [isDialogOpen, setIsDialogOpen] = useState(false);\n  const [form, setForm] = useState<TaskFormState>(() => defaultTaskForm());\n  const [nextStepPrompt, setNextStepPrompt] = useState<NextStepPromptState | null>(null);\n  const [nextStepSaving, setNextStepSaving] = useState(false);",
    'nextStepPrompt state',
  );

  tasks = replaceOnce(
    tasks,
    "  const toggleTask = async (task: any) => {\n    const nextStatus = isTaskDone(task) ? 'todo' : 'done';\n    try {\n      await updateTaskInSupabase({\n        id: String(task.id),\n        title: getTaskTitle(task),\n        type: readText(task, ['type'], 'follow_up'),\n        date: getTaskDateKey(task),\n        scheduledAt: getTaskMomentRaw(task),\n        priority: readText(task, ['priority'], 'medium'),\n        status: nextStatus,\n        leadId: task.leadId || task.lead_id || null,\n        caseId: task.caseId || task.case_id || null,\n        clientId: task.clientId || task.client_id || null,\n      });\n      await refreshData();\n    } catch {\n      toast.error('Nie uda\u0142o si\u0119 zapisa\u0107 zadania.');\n    }\n  };",
    "  const toggleTask = async (task: any) => {\n    const nextStatus = isTaskDone(task) ? 'todo' : 'done';\n    try {\n      const relationIds = getTaskRelationIds(task);\n      await updateTaskInSupabase({\n        id: String(task.id),\n        title: getTaskTitle(task),\n        type: readText(task, ['type'], 'follow_up'),\n        date: getTaskDateKey(task),\n        scheduledAt: getTaskMomentRaw(task),\n        priority: readText(task, ['priority'], 'medium'),\n        status: nextStatus,\n        leadId: relationIds.leadId,\n        caseId: relationIds.caseId,\n        clientId: relationIds.clientId,\n      });\n      await refreshData();\n\n      if (nextStatus === 'done') {\n        toast.success('Zadanie oznaczone jako zrobione');\n        if (shouldOfferNextStepPrompt(task)) {\n          setNextStepPrompt(buildNextStepPromptState(task));\n        }\n      } else {\n        toast.success('Zadanie przywr\u00F3cone');\n      }\n    } catch {\n      toast.error('Nie uda\u0142o si\u0119 zapisa\u0107 zadania.');\n    }\n  };\n\n  const closeNextStepPrompt = () => {\n    if (nextStepSaving) return;\n    setNextStepPrompt(null);\n  };\n\n  const handleCreateNextStepTask = async (event: FormEvent) => {\n    event.preventDefault();\n    if (!nextStepPrompt) return;\n    if (!hasAccess) return toast.error('Trial wygas\u0142.');\n    if (!nextStepPrompt.title.trim()) return toast.error('Podaj tytu\u0142 kolejnego kroku.');\n\n    const workspaceId = requireWorkspaceId(workspace);\n    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');\n\n    const relationIds = getTaskRelationIds(nextStepPrompt.sourceTask);\n\n    setNextStepSaving(true);\n    try {\n      await insertTaskToSupabase({\n        title: nextStepPrompt.title.trim(),\n        type: 'follow_up',\n        date: nextStepPrompt.dueAt.slice(0, 10),\n        scheduledAt: nextStepPrompt.dueAt,\n        priority: nextStepPrompt.priority || 'medium',\n        status: 'todo',\n        leadId: relationIds.leadId,\n        caseId: relationIds.caseId,\n        clientId: relationIds.clientId,\n        workspaceId,\n      });\n      toast.success('Kolejny krok dodany');\n      setNextStepPrompt(null);\n      await refreshData();\n    } catch {\n      toast.error('Nie uda\u0142o si\u0119 doda\u0107 kolejnego kroku.');\n    } finally {\n      setNextStepSaving(false);\n    }\n  };",
    'toggleTask and stage83 handlers',
  );

  tasks = replaceOnce(
    tasks,
    '      <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 sm:p-6" data-p0-tasks-stable-rebuild="true" data-tasks-compact-stage48="true">',
    '      <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 sm:p-6" data-p0-tasks-stable-rebuild="true" data-tasks-compact-stage48="true" data-stage83-task-done-next-step-prompt="true">',
    'stage83 main data marker',
  );

  tasks = replaceOnce(
    tasks,
    "        </Dialog>\n      </main>",
    "        </Dialog>\n\n        <Dialog open={Boolean(nextStepPrompt)} onOpenChange={(open) => (!open ? closeNextStepPrompt() : undefined)}>\n          <DialogContent className=\"max-w-lg\" data-stage83-task-done-next-step-prompt=\"dialog\">\n            <DialogHeader>\n              <DialogTitle>Ustaw kolejny krok</DialogTitle>\n            </DialogHeader>\n            <form onSubmit={handleCreateNextStepTask} className=\"space-y-4\">\n              <p className=\"text-sm text-slate-600\">\n                Zadanie jest zrobione. Ustaw nast\u0119pny follow-up, \u017Ceby lead albo sprawa nie wypad\u0142y z procesu.\n              </p>\n              <div className=\"space-y-2\">\n                <Label>Tytu\u0142 kolejnego kroku</Label>\n                <Input\n                  value={nextStepPrompt?.title || ''}\n                  onChange={(event) => setNextStepPrompt((current) => (current ? { ...current, title: event.target.value } : current))}\n                  placeholder=\"Np. Zadzwoni\u0107 ponownie / wys\u0142a\u0107 ofert\u0119\"\n                />\n              </div>\n              <div className=\"grid gap-4 sm:grid-cols-2\">\n                <div className=\"space-y-2\">\n                  <Label>Termin</Label>\n                  <Input\n                    type=\"datetime-local\"\n                    value={nextStepPrompt?.dueAt || ''}\n                    onChange={(event) => setNextStepPrompt((current) => (current ? { ...current, dueAt: event.target.value } : current))}\n                  />\n                </div>\n                <div className=\"space-y-2\">\n                  <Label>Priorytet</Label>\n                  <select\n                    className=\"h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm\"\n                    value={nextStepPrompt?.priority || 'medium'}\n                    onChange={(event) => setNextStepPrompt((current) => (current ? { ...current, priority: event.target.value } : current))}\n                  >\n                    <option value=\"low\">Niski</option>\n                    <option value=\"medium\">\u015Aredni</option>\n                    <option value=\"normal\">Normalny</option>\n                    <option value=\"high\">Wysoki</option>\n                  </select>\n                </div>\n              </div>\n              <DialogFooter>\n                <Button type=\"button\" variant=\"outline\" onClick={closeNextStepPrompt} disabled={nextStepSaving}>Pomi\u0144</Button>\n                <Button type=\"submit\" disabled={nextStepSaving}>\n                  {nextStepSaving ? <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" /> : null}\n                  Ustaw kolejny krok\n                </Button>\n              </DialogFooter>\n            </form>\n          </DialogContent>\n        </Dialog>\n      </main>",
    'stage83 next step dialog',
  );
}

fs.writeFileSync(tasksPath, tasks, 'utf8');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:stage83-task-done-next-step-prompt'] = 'node scripts/check-stage83-task-done-next-step-prompt.cjs';
pkg.scripts['verify:stage83-task-next-step'] = 'npm.cmd run check:stage83-task-done-next-step-prompt && npm.cmd run build';
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('PASS APPLY_STAGE83_TASK_DONE_NEXT_STEP_PROMPT');
