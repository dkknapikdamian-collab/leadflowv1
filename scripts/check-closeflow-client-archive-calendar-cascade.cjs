const fs = require('fs');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function must(file, needle) {
  const text = read(file);
  if (!text.includes(needle)) {
    console.error(`MISSING ${file}: ${needle}`);
    process.exit(1);
  }
}
function mustNotInDeleteCaseBlock(needle) {
  const text = read('api/cases.ts');
  const marker = "if (req.method === 'DELETE')";
  const start = text.lastIndexOf(marker);
  const end = text.indexOf("res.status(405)", start);
  const block = start >= 0 ? text.slice(start, end > start ? end : undefined) : '';
  if (!block) {
    console.error('MISSING api/cases.ts DELETE block');
    process.exit(1);
  }
  if (block.includes(needle)) {
    console.error(`FORBIDDEN in case DELETE block: ${needle}`);
    process.exit(1);
  }
}

must('package.json', 'check:closeflow-client-archive-calendar-cascade');
must('api/clients.ts', 'CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1');
must('api/clients.ts', 'archived_at: archivedAt');
must('api/clients.ts', 'includeArchivedClientsForCascade');
must('api/cases.ts', 'getArchivedClientIdsForCaseListCascade');
must('api/cases.ts', 'includeArchivedCasesForCascade');
must('api/cases.ts', "status: 'archived'");
must('api/cases.ts', 'mode: CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1');
mustNotInDeleteCaseBlock('work_items?case_id=eq.');
mustNotInDeleteCaseBlock("deleteByIdScoped('cases'");
must('src/lib/supabase-fallback.ts', 'CLOSEFLOW_CALENDAR_PARENT_ARCHIVE_FILTER_V1');
must('src/lib/supabase-fallback.ts', 'buildCalendarParentArchiveIndexForCascade');
must('src/lib/supabase-fallback.ts', 'filterCalendarRowsByActiveParentsForCascade(normalizedTasks');
must('src/lib/supabase-fallback.ts', 'filterCalendarRowsByActiveParentsForCascade(normalizedEvents');
must('src/lib/supabase-fallback.ts', "'/api/clients?includeArchived=1'");
must('src/lib/supabase-fallback.ts', "'/api/cases?includeArchived=1'");
must('docs/clients/CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_2026-05-11.md', 'Restore rule');

console.log('CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_CHECK_OK');
console.log('client_delete=archive_client');
console.log('case_delete=archive_case_keep_calendar_links');
console.log('calendar_filter=hide_tasks_events_by_archived_client_or_case_parent');
