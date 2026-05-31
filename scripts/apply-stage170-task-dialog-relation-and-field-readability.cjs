const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage170-task-dialog-relation-and-field-readability.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-task-dialog-relation-and-field-readability-stage170.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage170 import already present');
    return;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    "closeflow-topic-contact-picker-readable-stage169.css",
    "closeflow-modal-footer-in-flow-no-overlay-stage166.css",
    "closeflow-modal-unified-event-motif-source-truth-stage165.css"
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(marker)) { insertAfter = i; break; }
    }
  }
  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i++) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }
  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found.');

  lines.splice(insertAfter + 1, 0, importLine);
  write(appPath, lines.join('\n'));
  console.log('UPDATED src/App.tsx: added Stage170 CSS import');
}

function patchTaskCreateDialog() {
  const rel = 'src/components/TaskCreateDialog.tsx';
  let source = read(rel);
  const original = source;

  source = source.replace(
    "import { type FormEvent, useEffect, useState } from 'react';",
    "import { type FormEvent, useEffect, useMemo, useState } from 'react';"
  );

  if (!source.includes("import { TopicContactPicker } from './topic-contact-picker';")) {
    source = source.replace(
      "import { Label } from './ui/label';\n",
      "import { Label } from './ui/label';\nimport { TopicContactPicker } from './topic-contact-picker';\n"
    );
  }

  if (!source.includes("from '../lib/topic-contact';")) {
    source = source.replace(
      "import { requireWorkspaceId } from '../lib/workspace-context';\n",
      "import { requireWorkspaceId } from '../lib/workspace-context';\nimport {\n  buildTopicContactOptions,\n  findTopicContactOption,\n  resolveTopicContactLink,\n  type TopicContactOption,\n} from '../lib/topic-contact';\n"
    );
  }

  source = source.replace(
    "import { insertTaskToSupabase } from '../lib/supabase-fallback';",
    "import {\n  fetchCasesFromSupabase,\n  fetchClientsFromSupabase,\n  fetchLeadsFromSupabase,\n  insertTaskToSupabase,\n} from '../lib/supabase-fallback';"
  );

  source = source.replace(
    "  reminderMode: string;\n  reminderOffsetMinutes: number;\n};",
    "  reminderMode: string;\n  reminderOffsetMinutes: number;\n  relationQuery: string;\n  leadId: string;\n  caseId: string;\n  clientId: string;\n};"
  );

  source = source.replace(
    "    reminderMode: 'none',\n    reminderOffsetMinutes: 15,\n  };",
    "    reminderMode: 'none',\n    reminderOffsetMinutes: 15,\n    relationQuery: context?.recordLabel || '',\n    leadId: context?.leadId || '',\n    caseId: context?.caseId || '',\n    clientId: context?.clientId || '',\n  };"
  );

  const stateNeedle = "  const [form, setForm] = useState<TaskCreateFormState>(() => defaultTaskCreateForm(context));\n  const [saving, setSaving] = useState(false);\n";
  if (!source.includes("const [topicContactOptions, setTopicContactOptions] = useState<TopicContactOption[]>([]);")) {
    source = source.replace(
      stateNeedle,
      "  const [form, setForm] = useState<TaskCreateFormState>(() => defaultTaskCreateForm(context));\n  const [saving, setSaving] = useState(false);\n  const [topicContactOptions, setTopicContactOptions] = useState<TopicContactOption[]>([]);\n"
    );
  }

  const effectNeedle = "  useEffect(() => {\n    if (open) setForm(defaultTaskCreateForm(context));\n  }, [open, context?.recordType, context?.recordId, context?.recordLabel]);\n";
  const relationBlock = `  useEffect(() => {
    if (open) setForm(defaultTaskCreateForm(context));
  }, [open, context?.recordType, context?.recordId, context?.recordLabel, context?.leadId, context?.caseId, context?.clientId]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    Promise.all([
      fetchLeadsFromSupabase(),
      fetchCasesFromSupabase(),
      fetchClientsFromSupabase(),
    ])
      .then(([leads, cases, clients]) => {
        if (cancelled) return;
        setTopicContactOptions(buildTopicContactOptions({
          leads: Array.isArray(leads) ? leads as any[] : [],
          cases: Array.isArray(cases) ? cases as any[] : [],
          clients: Array.isArray(clients) ? clients as any[] : [],
        }));
      })
      .catch((error) => {
        console.warn('TASK_CREATE_DIALOG_STAGE170_RELATION_OPTIONS_FAILED', error);
        if (!cancelled) setTopicContactOptions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const selectedTaskRelationOption = useMemo(
    () => findTopicContactOption(topicContactOptions, {
      leadId: form.leadId || context?.leadId || null,
      caseId: form.caseId || context?.caseId || null,
      clientId: form.clientId || context?.clientId || null,
    }),
    [topicContactOptions, form.leadId, form.caseId, form.clientId, context?.leadId, context?.caseId, context?.clientId],
  );

  const handleSelectTaskRelation = (option: TopicContactOption | null) => {
    const relation = resolveTopicContactLink(option);
    setForm((prev) => ({
      ...prev,
      relationQuery: option?.label || '',
      leadId: relation.leadId || '',
      caseId: relation.caseId || '',
      clientId: relation.clientId || '',
    }));
  };
`;
  if (!source.includes("const selectedTaskRelationOption = useMemo(")) {
    if (!source.includes(effectNeedle)) throw new Error('TaskCreateDialog: expected open reset effect not found.');
    source = source.replace(effectNeedle, relationBlock);
  }

  source = source.replace(
    "      await insertTaskToSupabase({\n        title: form.title.trim(),",
    "      const relation = resolveTopicContactLink(selectedTaskRelationOption);\n\n      await insertTaskToSupabase({\n        title: form.title.trim(),"
  );

  source = source.replace(
    "        leadId: context?.leadId || undefined,\n        caseId: context?.caseId || undefined,\n        clientId: context?.clientId || undefined,\n        workspaceId,",
    "        leadId: relation.leadId || form.leadId || context?.leadId || undefined,\n        caseId: relation.caseId || form.caseId || context?.caseId || undefined,\n        clientId: relation.clientId || form.clientId || context?.clientId || undefined,\n        workspaceId,"
  );

  source = source.replace(
    "        data-task-create-dialog-stage105=\"event-form-vnext\"\n        data-event-form-stage22=\"true\"\n      >",
    "        data-task-create-dialog-stage105=\"event-form-vnext\"\n        data-task-create-dialog-stage170=\"true\"\n        data-event-form-stage22=\"true\"\n      >"
  );

  source = source.replace(
    "          data-task-create-dialog-stage105=\"event-form-vnext\"\n        >",
    "          data-task-create-dialog-stage105=\"event-form-vnext\"\n          data-task-create-dialog-stage170=\"true\"\n        >"
  );

  const insertAfterTitle = `          <div className="event-form-field">
            <Label>Tytuł</Label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Co trzeba zrobić?" />
          </div>
`;
  const pickerBlock = `          <div data-task-create-dialog-relation-picker="true">
            <TopicContactPicker
              options={topicContactOptions}
              selectedOption={selectedTaskRelationOption}
              query={form.relationQuery}
              onQueryChange={(value) => setForm((prev) => ({ ...prev, relationQuery: value, leadId: '', caseId: '', clientId: '' }))}
              onSelect={handleSelectTaskRelation}
              label="Powiąż z leadem, klientem albo sprawą"
              placeholder="Wpisz lead, klienta, sprawę, e-mail lub telefon"
            />
          </div>
`;
  if (!source.includes('data-task-create-dialog-relation-picker="true"')) {
    if (!source.includes(insertAfterTitle)) throw new Error('TaskCreateDialog: title field block not found for relation picker insertion.');
    source = source.replace(insertAfterTitle, insertAfterTitle + pickerBlock);
  }

  // Keep context banner if present, but it no longer substitutes the relation picker.

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/components/TaskCreateDialog.tsx: Stage170 relation picker + task dialog wiring');
  } else {
    console.log('SKIPPED src/components/TaskCreateDialog.tsx: Stage170 changes already present');
  }
}

insertStyleImport();
patchTaskCreateDialog();
