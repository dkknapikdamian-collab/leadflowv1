from pathlib import Path

def replace_once(file, old, new):
    path = Path(file)
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'PATCH_MATCH_COUNT:{file}:{count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8', newline='\n')

alias = "node scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs && node --test tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs"
replace_once(
    'package.json',
    '    "scripts":  {\n                                                "verify:lf-prod-sot-g15-r1":',
    '    "scripts":  {\n                                                "verify:lf-prod-sot-g15-r2": "' + alias + '",\n                                                "verify:lf-prod-sot-g15-r1":',
)

replace_once(
    'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
    "  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',\n  'tsconfig.g14.json',",
    "  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',\n  'src/server/event-route-stage124f.ts',\n  '_project/runs/LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION.md',\n  'scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs',\n  'tests/lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs',\n  'tests/lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.test.cjs',\n  'scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs',\n  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',\n  'tsconfig.g14.json',",
)

replace_once(
    'scripts/guards/verify-lf-prod-sot-g15-r2-event-delete-owner-evidence-fail-closed-runtime-adoption.cjs',
    "  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',\n]);",
    "  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',\n  'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',\n]);",
)
