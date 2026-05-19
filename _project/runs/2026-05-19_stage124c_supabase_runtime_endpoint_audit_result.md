# Stage124C - Supabase runtime endpoint audit result

Generated: 2026-05-19T07:03:48.023Z

## Summary
- Runtime files scanned: 431
- /api/tasks|/api/events call sites: 20
- API route candidates found: NONE
- heavy work_items select=* task/event hits: 8
- runtime select=* hits: 149
- blockers: 2

## Blockers
- Runtime calls /api/tasks or /api/events exist, but no matching API route file was found in the tracked local source tree. Do not patch blindly; resolve route source first.
- Heavy work_items select=* task/event query exists in runtime code. Replace with explicit task/event list DTO fields and date range query.

## /api/tasks and /api/events call sites

- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:132 :: `if (normalized.includes('/api/tasks') || normalized.includes('kind=tasks')) return 'task';`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:133 :: `if (normalized.includes('/api/events') || normalized.includes('kind=events')) return 'event';`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:332 :: `export async function insertTaskToSupabase(input: TaskInsertInput) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'POST', body: JSON.stringify(input) }); }`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:333 :: `export async function insertEventToSupabase(input: EventInsertInput) { return callApi<SupabaseInsertResult>('/api/events', { method: 'POST', body: JSON.stringify(applyGoogleCalendarReminderPreferenceToEventPayload(input `
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:415 :: `return callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:420 :: `return callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:483 :: `export async function updateTaskInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'PATCH', body: JSON.stringify(input) }); }`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:484 :: `export async function deleteTaskFromSupabase(id: string) { return callApi<SupabaseInsertResult>('/api/tasks?id=${encodeURIComponent(id)}', { method: 'DELETE' }); }`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:485 :: `export async function updateEventInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/events', { method: 'PATCH', body: JSON.stringify(applyGoogleCalendarReminderPrefer`
- .closeflow-recovery-backups/stage3-note-actions-1778477498377/src/lib/supabase-fallback.ts:486 :: `export async function deleteEventFromSupabase(id: string) { return callApi<SupabaseInsertResult>('/api/events?id=${encodeURIComponent(id)}', { method: 'DELETE' }); }`
- src/lib/supabase-fallback.ts:134 :: `if (normalized.includes('/api/tasks') || normalized.includes('kind=tasks')) return 'task';`
- src/lib/supabase-fallback.ts:135 :: `if (normalized.includes('/api/events') || normalized.includes('kind=events')) return 'event';`
- src/lib/supabase-fallback.ts:381 :: `export async function insertTaskToSupabase(input: TaskInsertInput) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'POST', body: JSON.stringify(input) }); }`
- src/lib/supabase-fallback.ts:382 :: `export async function insertEventToSupabase(input: EventInsertInput) { return callApi<SupabaseInsertResult>('/api/events', { method: 'POST', body: JSON.stringify(applyGoogleCalendarReminderPreferenceToEventPayload(input `
- src/lib/supabase-fallback.ts:469 :: `const normalizedTasks = await callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);`
- src/lib/supabase-fallback.ts:481 :: `const normalizedEvents = await callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);`
- src/lib/supabase-fallback.ts:547 :: `export async function updateTaskInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'PATCH', body: JSON.stringify(input) }); }`
- src/lib/supabase-fallback.ts:548 :: `export async function deleteTaskFromSupabase(id: string) { return callApi<SupabaseInsertResult>('/api/tasks?id=${encodeURIComponent(id)}', { method: 'DELETE' }); }`
- src/lib/supabase-fallback.ts:549 :: `export async function updateEventInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/events', { method: 'PATCH', body: JSON.stringify(applyGoogleCalendarReminderPrefer`
- src/lib/supabase-fallback.ts:550 :: `export async function deleteEventFromSupabase(id: string) { return callApi<SupabaseInsertResult>('/api/events?id=${encodeURIComponent(id)}', { method: 'DELETE' }); }`

## Heavy work_items task/event selects

- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:338 :: `safeSelect(withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=${SNAPSHOT_LIMITS.tasks}', workspaceId)),`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:339 :: `safeSelect(withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=${SNAPSHOT_LIMITS.events}', workspaceId)),`
- api/work-items.ts:508 :: `withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=200', workspaceId),`
- api/work-items.ts:517 :: `withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=200', workspaceId),`
- api/work-items.ts:518 :: `withWorkspaceFilter('work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=200', workspaceId),`
- src/server/daily-digest-handler.ts:165 :: `withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=2000', workspaceId),`
- src/server/daily-digest-handler.ts:170 :: `withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=2000', workspaceId),`
- src/server/daily-digest-handler.ts:171 :: `withWorkspaceFilter('work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=2000', workspaceId),`

## Runtime select star hits

- .closeflow-recovery-backups/payments_normalize_datetime_hotfix_20260511_073739/api/payments.ts:151 :: `withWorkspaceFilter('payments?select=*&${filters}order=paid_at.desc.nullslast,due_at.asc.nullslast,created_at.desc.nullslast&limit=${limit}', workspaceId),`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:196 :: `queries.push('profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1');`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:199 :: `queries.push('profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:200 :: `queries.push('profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:201 :: `queries.push('profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:202 :: `if (isUuid(userId)) queries.push('profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:583 :: `? await safeSelect('workspaces?select=*&id=in.(${candidateWorkspaceIds.map((id) => '"${id}"').join(',')})&limit=2000')`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:584 :: `: await safeSelect('workspaces?select=*&limit=2000');`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:595 :: `'profiles?firebase_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:596 :: `'profiles?auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:597 :: `'profiles?external_auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- .stage10b_vercel_hobby_assistant_route_runner_repair_backup_20260506_074117/api/system.ts:600 :: `if (targetEmail) queries.push('profiles?email=eq.${encodeURIComponent(targetEmail)}&select=*&limit=1');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:196 :: `queries.push('profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:199 :: `queries.push('profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:200 :: `queries.push('profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:201 :: `queries.push('profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:202 :: `if (isUuid(userId)) queries.push('profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:583 :: `? await safeSelect('workspaces?select=*&id=in.(${candidateWorkspaceIds.map((id) => '"${id}"').join(',')})&limit=2000')`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:584 :: `: await safeSelect('workspaces?select=*&limit=2000');`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:595 :: `'profiles?firebase_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:596 :: `'profiles?auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:597 :: `'profiles?external_auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- .stage10c_assistant_route_collapse_resilient_backup_20260506_074607/api/system.ts:600 :: `if (targetEmail) queries.push('profiles?email=eq.${encodeURIComponent(targetEmail)}&select=*&limit=1');`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:337 :: `safeSelect(withWorkspaceFilter('leads?select=*&order=updated_at.desc.nullslast&limit=${SNAPSHOT_LIMITS.leads}', workspaceId)),`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:338 :: `safeSelect(withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=${SNAPSHOT_LIMITS.tasks}', workspaceId)),`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:339 :: `safeSelect(withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=${SNAPSHOT_LIMITS.events}', workspaceId)),`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:340 :: `safeSelect(withWorkspaceFilter('cases?select=*&order=updated_at.desc.nullslast&limit=${SNAPSHOT_LIMITS.cases}', workspaceId)),`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:341 :: `safeSelect(withWorkspaceFilter('clients?select=*&order=updated_at.desc.nullslast&limit=${SNAPSHOT_LIMITS.clients}', workspaceId)),`
- .stage5_ai_read_query_hardening_v1_backup_20260506_070753/src/server/assistant-context.ts:342 :: `safeSelect(withWorkspaceFilter('ai_drafts?select=*&order=created_at.desc&limit=${SNAPSHOT_LIMITS.drafts}', workspaceId)),`
- api/activities.ts:66 :: `const result = await selectFirstAvailable(['activities?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=created_at.desc&limit=${limit}']);`
- api/activities.ts:79 :: `const result = await selectFirstAvailable([withWorkspaceFilter('activities?select=*&order=created_at.desc&limit=${limit}${filterQuery}', workspaceId)]);`
- api/case-items.ts:108 :: `const result = await selectFirstAvailable(['case_items?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=item_order.asc,created_at.asc&limit=500']);`
- api/case-items.ts:128 :: `const current = await selectFirstAvailable(['case_items?select=*&id=eq.${encodeURIComponent(id)}&case_id=eq.${encodeURIComponent(caseId)}&limit=1']);`
- api/cases.ts:195 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&id=eq.${encodeURIComponent(explicitClientId)}&limit=1', workspaceId));`
- api/cases.ts:201 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&email=eq.${encodeURIComponent(email)}&limit=1', workspaceId));`
- api/cases.ts:207 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&phone=eq.${encodeURIComponent(phone)}&limit=1', workspaceId));`
- api/cases.ts:213 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&name=ilike.${encodeURIComponent(name)}&limit=1', workspaceId));`
- api/cases.ts:325 :: `? await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.${encodeURIComponent(normalizedLeadId)}&limit=1', finalWorkspaceId))`
- api/cases.ts:432 :: `? await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.${encodeURIComponent(normalizedLeadId)}&limit=1', workspaceId))`
- api/leads.ts:403 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&id=eq.${encodeURIComponent(explicitClientId)}&limit=1', workspaceId));`
- api/leads.ts:409 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&email=eq.${encodeURIComponent(email)}&limit=1', workspaceId));`
- api/leads.ts:415 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&phone=eq.${encodeURIComponent(phone)}&limit=1', workspaceId));`
- api/leads.ts:421 :: `const rows = await safeSelectRows(withWorkspaceFilter('clients?select=*&name=ilike.${encodeURIComponent(name)}&limit=1', workspaceId));`
- api/leads.ts:455 :: `const leadRows = await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1', workspaceId));`
- api/leads.ts:571 :: `const refreshedLeadRows = await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1', workspaceId));`
- api/leads.ts:795 :: `queries.push(withWorkspaceFilter('leads?select=*&email=eq.' + encodeURIComponent(email) + '&limit=10', workspaceId));`
- api/leads.ts:798 :: `queries.push(withWorkspaceFilter('leads?select=*&phone=eq.' + encodeURIComponent(phone) + '&limit=10', workspaceId));`
- api/leads.ts:801 :: `queries.push(withWorkspaceFilter('leads?select=*&name=ilike.' + encodeURIComponent(name) + '&limit=10', workspaceId));`
- api/leads.ts:857 :: `const rows = await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.' + encodeURIComponent(leadId) + '&limit=1', workspaceId));`
- api/leads.ts:950 :: `const leadRows = await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1', workspaceId));`
- api/me.ts:110 :: `queries.push('app_owners?status=eq.active&auth_uid=eq.${encodeURIComponent(candidate)}&select=*&limit=1');`
- api/me.ts:114 :: `queries.push('app_owners?status=eq.active&user_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1');`
- api/me.ts:115 :: `queries.push('app_owners?status=eq.active&profile_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1');`
- api/me.ts:119 :: `queries.push('app_owners?status=eq.active&email=eq.${encodeURIComponent(normalizedEmail)}&select=*&limit=1');`
- api/me.ts:416 :: `queries.push('profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1');`
- api/me.ts:420 :: `queries.push('profiles?firebase_uid=eq.${encodeURIComponent(uid)}&select=*&limit=1');`
- api/me.ts:421 :: `queries.push('profiles?auth_uid=eq.${encodeURIComponent(uid)}&select=*&limit=1');`
- api/me.ts:422 :: `queries.push('profiles?external_auth_uid=eq.${encodeURIComponent(uid)}&select=*&limit=1');`
- api/me.ts:443 :: `'workspaces?id=eq.${encodeURIComponent(workspaceId)}&select=*&limit=1',`
- api/me.ts:491 :: `'workspaces?owner_user_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1',`
- api/me.ts:492 :: `'workspaces?owner_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1',`
- api/me.ts:493 :: `'workspaces?created_by_user_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1',`
- api/me.ts:533 :: `'workspaces?select=*&order=updated_at.desc.nullslast&limit=2',`
- api/me.ts:534 :: `'workspaces?select=*&order=created_at.desc.nullslast&limit=2',`
- api/me.ts:535 :: `'workspaces?select=*&limit=2',`
- api/system.ts:204 :: `queries.push('profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1');`
- api/system.ts:207 :: `queries.push('profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- api/system.ts:208 :: `queries.push('profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- api/system.ts:209 :: `queries.push('profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- api/system.ts:210 :: `if (isUuid(userId)) queries.push('profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1');`
- api/system.ts:597 :: `? await safeSelect('workspaces?select=*&id=in.(${candidateWorkspaceIds.map((id) => '"${id}"').join(',')})&limit=2000')`
- api/system.ts:598 :: `: await safeSelect('workspaces?select=*&limit=2000');`
- api/system.ts:609 :: `'profiles?firebase_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- api/system.ts:610 :: `'profiles?auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- api/system.ts:611 :: `'profiles?external_auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1',`
- api/system.ts:614 :: `if (targetEmail) queries.push('profiles?email=eq.${encodeURIComponent(targetEmail)}&select=*&limit=1');`
- api/work-items.ts:507 :: `withWorkspaceFilter('work_items?select=*&show_in_tasks=is.true&order=created_at.desc.nullslast&limit=200', workspaceId),`
- api/work-items.ts:508 :: `withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=200', workspaceId),`
- api/work-items.ts:509 :: `withWorkspaceFilter('work_items?select=*&type=eq.task&order=created_at.desc.nullslast&limit=200', workspaceId),`
- api/work-items.ts:510 :: `withWorkspaceFilter('work_items?select=*&order=created_at.desc.nullslast&limit=200', workspaceId),`
- ... truncated 69 additional hits

## Calendar/task/event fetch functions

- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/CaseDetail.tsx:76 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/CaseDetail.tsx:78 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/CaseDetail.tsx:857 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/CaseDetail.tsx:858 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx:44 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx:46 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx:273 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx:274 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx:304 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx:305 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-detail-loading-reference-20260511163706/src/pages/CaseDetail.tsx:76 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/case-detail-loading-reference-20260511163706/src/pages/CaseDetail.tsx:78 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/case-detail-loading-reference-20260511163706/src/pages/CaseDetail.tsx:857 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-detail-loading-reference-20260511163706/src/pages/CaseDetail.tsx:858 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-detail-loading-scope-20260511164228/src/pages/CaseDetail.tsx:76 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/case-detail-loading-scope-20260511164228/src/pages/CaseDetail.tsx:78 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/case-detail-loading-scope-20260511164228/src/pages/CaseDetail.tsx:857 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-detail-loading-scope-20260511164228/src/pages/CaseDetail.tsx:858 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/CaseDetail.tsx:76 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/CaseDetail.tsx:78 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/CaseDetail.tsx:840 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/CaseDetail.tsx:841 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/etap8-repair3-2026-05-11T17-46-18-779Z/src/pages/Clients.tsx:80 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/etap8-repair3-2026-05-11T17-46-18-779Z/src/pages/Clients.tsx:83 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/etap8-repair3-2026-05-11T17-46-18-779Z/src/pages/Clients.tsx:223 :: `fetchTasksFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/etap8-repair3-2026-05-11T17-46-18-779Z/src/pages/Clients.tsx:224 :: `fetchEventsFromSupabase().catch(() => []),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair1-2026-05-10T21-09-29-683/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair1-2026-05-10T21-09-29-683/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair1-2026-05-10T21-09-29-683/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair1-2026-05-10T21-09-29-683/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair2-2026-05-10T21-17-36-571/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair2-2026-05-10T21-17-36-571/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair2-2026-05-10T21-17-36-571/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair2-2026-05-10T21-17-36-571/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-23-53-548/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-23-53-548/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-23-53-548/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-23-53-548/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-28-14-923/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-28-14-923/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-28-14-923/src/pages/ClientDetail.tsx:1006 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair3-2026-05-10T21-28-14-923/src/pages/ClientDetail.tsx:1007 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair4-2026-05-10T21-33-00-132/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair4-2026-05-10T21-33-00-132/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair4-2026-05-10T21-33-00-132/src/pages/ClientDetail.tsx:1006 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair4-2026-05-10T21-33-00-132/src/pages/ClientDetail.tsx:1007 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair5-2026-05-10T21-37-05-174/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair5-2026-05-10T21-37-05-174/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair5-2026-05-10T21-37-05-174/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair5-2026-05-10T21-37-05-174/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair6-2026-05-10T21-48-59-720/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair6-2026-05-10T21-48-59-720/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair6-2026-05-10T21-48-59-720/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair6-2026-05-10T21-48-59-720/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair7-2026-05-10T21-51-40-674/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair7-2026-05-10T21-51-40-674/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair7-2026-05-10T21-51-40-674/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-bulk-diagnostic-repair7-2026-05-10T21-51-40-674/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-20260510-220125/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-20260510-220125/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-20260510-220125/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-20260510-220125/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix1-20260510-220421/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix1-20260510-220421/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix1-20260510-220421/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix1-20260510-220421/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix2-20260510-221010/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix2-20260510-221010/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix2-20260510-221010/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix2-20260510-221010/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix3-20260510-221636/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix3-20260510-221636/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix3-20260510-221636/src/pages/ClientDetail.tsx:1004 :: `fetchTasksFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix3-20260510-221636/src/pages/ClientDetail.tsx:1005 :: `fetchEventsFromSupabase(),`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix4-20260510-221918/src/pages/ClientDetail.tsx:38 :: `fetchEventsFromSupabase,`
- .closeflow-recovery-backups/fb5-final-safe-reset-fix4-20260510-221918/src/pages/ClientDetail.tsx:40 :: `fetchTasksFromSupabase,`
- ... truncated 127 additional hits

## Recommendation

If blockers are present, Stage124C should stay audit-only. Next code stage must first resolve the real API route source and only then introduce range queries and ListDTO selects for tasks/events.
