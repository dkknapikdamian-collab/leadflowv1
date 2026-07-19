from pathlib import Path

def replace_once(file, old, new):
    path = Path(file)
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'PATCH_MATCH_COUNT:{file}:{count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8', newline='\n')

g15_guard = 'scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs'
replace_once(
    g15_guard,
    '  "tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs"\n]);',
    '  "tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs",\n  "src/server/event-route-stage124f.ts",\n  "_project/runs/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md",\n  "scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs",\n  "tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs"\n]);',
)
replace_once(
    g15_guard,
    "  for (const file of files) {\n    if (file.startsWith('src/')) throw new Error(`${label}_SRC_CHANGE:${file}`);\n    if (!allowed.has(file)) throw new Error(`${label}_OUT_OF_SCOPE:${file}`);\n  }",
    "  for (const file of files) {\n    if (!allowed.has(file)) throw new Error(`${label}_OUT_OF_SCOPE:${file}`);\n    if (file.startsWith('src/') && file !== rel.event) throw new Error(`${label}_SRC_CHANGE:${file}`);\n  }",
)
replace_once(
    g15_guard,
    'function assertNoFutureArtifact() {\n  const allowedR1 = new Set([',
    "function assertNoFutureArtifact() {\n  const allowedR2 = new Set([\n    '_project/runs/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md',\n    'scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs',\n    'tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',\n    `${PROJECT_ROOT}/STAGES/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md`,\n  ]);\n  const allowedR1 = new Set([",
)
replace_once(
    g15_guard,
    "      if (/LF-PROD-SOT-G15-R2_|lf-prod-sot-g15-r2_|LF-PROD-SOT-G16_|lf-prod-sot-g16_/i.test(entry.name)) {\n        throw new Error(`FUTURE_ARTIFACT_CREATED:${candidate}`);\n      }",
    "      if (/LF-PROD-SOT-G15-R2_|lf-prod-sot-g15-r2_/i.test(entry.name) && !allowedR2.has(candidate)) {\n        throw new Error(`UNKNOWN_G15_R2_ARTIFACT:${candidate}`);\n      }\n      if (/LF-PROD-SOT-G16_|lf-prod-sot-g16_/i.test(entry.name)) {\n        throw new Error(`FUTURE_ARTIFACT_CREATED:${candidate}`);\n      }",
)
replace_once(
    g15_guard,
    "for (const [name, text] of [['task', taskDelete], ['event', eventDelete]]) {\n  must(text, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', `${name} scoped read`);\n  must(text, 'selectFirstAvailable([selectPathStage228R23])', `${name} unscoped fallback`);\n  must(text, \"status: 'deleted'\", `${name} soft delete`);\n  must(text, 'show_in_tasks: false', `${name} hidden tasks`);\n  must(text, 'show_in_calendar: false', `${name} hidden calendar`);\n  mustNot(text, 'markGoogleCalendarMutationSyncState({', `${name} G9 wiring`);\n}",
    "must(taskDelete, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', 'task scoped read');\nmust(taskDelete, 'selectFirstAvailable([selectPathStage228R23])', 'task unscoped fallback');\nmust(taskDelete, \"updateById('work_items', id, payloadStage228R23)\", 'task legacy writer unchanged');\nmustNot(taskDelete, 'created_by_user_id', 'task owner adoption not authorized');\nfor (const [name, text] of [['task', taskDelete], ['event', eventDelete]]) {\n  must(text, \"status: 'deleted'\", `${name} soft delete`);\n  must(text, 'show_in_tasks: false', `${name} hidden tasks`);\n  must(text, 'show_in_calendar: false', `${name} hidden calendar`);\n  mustNot(text, 'markGoogleCalendarMutationSyncState({', `${name} G9 wiring`);\n}\nmust(eventDelete, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', 'event scoped read');\nmust(eventDelete, 'selectFirstAvailable([selectPathStage228R23])', 'event id-only discovery fallback');\nmust(eventDelete, 'created_by_user_id', 'event owner evidence');\nmust(eventDelete, 'workspace_id=is.null&created_by_user_id=eq.', 'event legacy owner filter');\nmustNot(eventDelete, \"updateById('work_items'\", 'event unscoped writer removed');",
)

replace_once(
    'tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs',
    "test('05 G15 changes no runtime src file', () => {\n  const files = new Set();\n  for (const args of [\n    ['diff', '--name-only', `${baseHead}..HEAD`],\n    ['diff', '--name-only'],\n    ['diff', '--cached', '--name-only'],\n  ]) {\n    for (const file of sh(args).split(/\\r?\\n/).filter(Boolean)) files.add(file);\n  }\n  assert.deepEqual([...files].filter((file) => file.startsWith('src/')), []);\n});",
    "test('05 later runtime adoption changes only Event route', () => {\n  const files = new Set();\n  for (const args of [\n    ['diff', '--name-only', `${baseHead}..HEAD`],\n    ['diff', '--name-only'],\n    ['diff', '--cached', '--name-only'],\n  ]) {\n    for (const file of sh(args).split(/\\r?\\n/).filter(Boolean)) files.add(file);\n  }\n  assert.deepEqual([...files].filter((file) => file.startsWith('src/')), ['src/server/event-route-stage124f.ts']);\n});",
)
