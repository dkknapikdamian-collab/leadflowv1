from pathlib import Path

def replace_once(file, old, new):
    path = Path(file)
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'PATCH_MATCH_COUNT:{file}:{count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8', newline='\n')

r1_guard = 'scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs'
replace_once(
    r1_guard,
    "  rel.test,\n  rel.appReport,\n]);",
    "  rel.test,\n  rel.appReport,\n  rel.event,\n  'tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs',\n  '_project/runs/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md',\n  'scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs',\n  'tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',\n]);",
)
replace_once(
    r1_guard,
    "  for (const file of files) {\n    if (file.startsWith('src/')) throw new Error(`${label}_SRC_CHANGE:${file}`);\n    if (!allowed.has(file)) throw new Error(`${label}_OUT_OF_SCOPE:${file}`);\n  }",
    "  for (const file of files) {\n    if (!allowed.has(file)) throw new Error(`${label}_OUT_OF_SCOPE:${file}`);\n    if (file.startsWith('src/') && file !== rel.event) throw new Error(`${label}_SRC_CHANGE:${file}`);\n  }",
)
replace_once(
    r1_guard,
    'function assertNoFutureArtifact() {\n  const roots = [',
    "function assertNoFutureArtifact() {\n  const allowedR2 = new Set([\n    '_project/runs/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md',\n    'scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs',\n    'tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',\n    `${PROJECT_ROOT}/STAGES/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md`,\n  ]);\n  const roots = [",
)
replace_once(
    r1_guard,
    "      if (/LF-PROD-SOT-G15-R2_|lf-prod-sot-g15-r2_|LF-PROD-SOT-G16_|lf-prod-sot-g16_/i.test(entry.name)) {\n        throw new Error(`FUTURE_ARTIFACT_CREATED:${path.join(relDir, entry.name)}`);\n      }",
    "      const candidate = `${relDir}/${entry.name}`.replaceAll('\\\\', '/');\n      if (/LF-PROD-SOT-G15-R2_|lf-prod-sot-g15-r2_/i.test(entry.name) && !allowedR2.has(candidate)) {\n        throw new Error(`UNKNOWN_G15_R2_ARTIFACT:${candidate}`);\n      }\n      if (/LF-PROD-SOT-G16_|lf-prod-sot-g16_/i.test(entry.name)) {\n        throw new Error(`FUTURE_ARTIFACT_CREATED:${candidate}`);\n      }",
)
replace_once(
    r1_guard,
    "for (const [name, text] of [['task', taskDelete], ['event', eventDelete]]) {\n  must(text, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', `${name} exact workspace read`);\n  must(text, 'selectFirstAvailable([selectPathStage228R23])', `${name} id-only fallback`);\n  must(text, \"updateById('work_items', id, payloadStage228R23)\", `${name} legacy unscoped write`);\n  mustNot(text, 'created_by_user_id', `${name} owner evidence absent`);\n  mustNot(text, 'markGoogleCalendarMutationSyncState({', `${name} G9 unwired`);\n}",
    "must(taskDelete, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', 'task exact workspace read');\nmust(taskDelete, 'selectFirstAvailable([selectPathStage228R23])', 'task id-only fallback');\nmust(taskDelete, \"updateById('work_items', id, payloadStage228R23)\", 'task legacy unscoped write');\nmustNot(taskDelete, 'created_by_user_id', 'task owner evidence absent');\nmustNot(taskDelete, 'markGoogleCalendarMutationSyncState({', 'task G9 unwired');\nmust(eventDelete, 'withWorkspaceFilter(selectPathStage228R23, workspaceId)', 'event exact workspace read');\nmust(eventDelete, 'selectFirstAvailable([selectPathStage228R23])', 'event id-only discovery fallback');\nmust(eventDelete, 'created_by_user_id', 'event owner evidence adopted');\nmust(eventDelete, 'verifiedRequestUserIdStageG15R2', 'event verified user comparison');\nmust(eventDelete, 'workspace_id=is.null&created_by_user_id=eq.', 'event owner-filtered legacy write');\nmustNot(eventDelete, \"updateById('work_items'\", 'event unscoped write removed');\nmustNot(eventDelete, 'markGoogleCalendarMutationSyncState({', 'event G9 unwired');",
)

r1_test = 'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs'
replace_once(
    r1_test,
    "test('05 G15-R1 changes no runtime src file', () => {\n  const files = new Set();\n  for (const args of [\n    ['diff', '--name-only', `${baseHead}..HEAD`],\n    ['diff', '--name-only'],\n    ['diff', '--cached', '--name-only'],\n  ]) {\n    for (const file of sh(args).split(/\\r?\\n/).filter(Boolean)) files.add(file);\n  }\n  assert.deepEqual([...files].filter((file) => file.startsWith('src/')), []);\n});",
    "test('05 later authorized runtime adoption changes only Event route', () => {\n  const files = new Set();\n  for (const args of [\n    ['diff', '--name-only', `${baseHead}..HEAD`],\n    ['diff', '--name-only'],\n    ['diff', '--cached', '--name-only'],\n  ]) {\n    for (const file of sh(args).split(/\\r?\\n/).filter(Boolean)) files.add(file);\n  }\n  assert.deepEqual([...files].filter((file) => file.startsWith('src/')), ['src/server/event-route-stage124f.ts']);\n});",
)
replace_once(
    r1_test,
    "test('20 current DELETE select paths still omit owner evidence', () => {\n  assert.doesNotMatch(taskDelete, /created_by_user_id/);\n  assert.doesNotMatch(eventDelete, /created_by_user_id/);\n  assert.match(report, /DELETE select paths currently omit `created_by_user_id`/);\n});",
    "test('20 Task remains unchanged while Event adopts owner evidence', () => {\n  assert.doesNotMatch(taskDelete, /created_by_user_id/);\n  assert.match(eventDelete, /created_by_user_id/);\n  assert.match(eventDelete, /verifiedRequestUserIdStageG15R2/);\n  assert.match(report, /DELETE select paths currently omit `created_by_user_id`/);\n});",
)
replace_once(
    r1_test,
    "test('21 current legacy fallback and unscoped writer are documented', () => {\n  for (const source of [taskDelete, eventDelete]) {\n    assert.match(source, /selectFirstAvailable\\(\\[selectPathStage228R23\\]\\)/);\n    assert.match(source, /updateById\\('work_items', id, payloadStage228R23\\)/);\n  }\n});",
    "test('21 Task keeps legacy writer while Event replaces it with owner-filtered update', () => {\n  assert.match(taskDelete, /selectFirstAvailable\\(\\[selectPathStage228R23\\]\\)/);\n  assert.match(taskDelete, /updateById\\('work_items', id, payloadStage228R23\\)/);\n  assert.match(eventDelete, /selectFirstAvailable\\(\\[selectPathStage228R23\\]\\)/);\n  assert.match(eventDelete, /workspace_id=is\\.null&created_by_user_id=eq\\./);\n  assert.doesNotMatch(eventDelete, /updateById\\('work_items', id, payloadStage228R23\\)/);\n});",
)
