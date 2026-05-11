const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MARK = 'CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1';

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(ROOT, rel), text, 'utf8');
}
function fail(msg) {
  console.error(msg);
  process.exit(1);
}
function ensureIncludes(file, text, label) {
  if (!text.includes(label)) fail(`${file}: missing ${label}`);
}
function replaceOnce(file, text, from, to) {
  if (!text.includes(from)) fail(`${file}: pattern not found`);
  return text.replace(from, to);
}
function upsertPackageScript(pkg, name, command) {
  const json = JSON.parse(pkg);
  json.scripts ||= {};
  json.scripts[name] = command;
  return JSON.stringify(json, null, 2) + '\n';
}

// package.json
{
  const rel = 'package.json';
  let text = read(rel);
  text = upsertPackageScript(text, 'check:closeflow-client-archive-calendar-cascade', 'node scripts/check-closeflow-client-archive-calendar-cascade.cjs');
  write(rel, text);
}

// api/clients.ts: delete client as archive, keep restoreable client id and make GET support includeArchived.
{
  const rel = 'api/clients.ts';
  let text = read(rel);

  if (!text.includes(MARK)) {
    text = text.replace(
      "const CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE = 'allowDuplicate is the API duplicate override flag';",
      "const CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE = 'allowDuplicate is the API duplicate override flag';\nconst CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1 = 'client delete archives client; active cases/tasks/events hide by archived parent';",
    );
  }

  if (!text.includes('includeArchivedClientsForCascade')) {
    const needle = `      const requestedId = asText(req.query?.id);\n      const base = withWorkspaceFilter(`;
    const replacement = `      const requestedId = asText(req.query?.id);\n      const includeArchivedClientsForCascade = ['1', 'true', 'yes'].includes(asText(req.query?.includeArchived).toLowerCase());\n      const activeClientArchiveFilterForCascade = !requestedId && !includeArchivedClientsForCascade ? 'archived_at=is.null&' : '';\n      const base = withWorkspaceFilter(`;
    text = replaceOnce(rel, text, needle, replacement);

    text = text.replace(
      "`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 300}`",
      "`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${activeClientArchiveFilterForCascade}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 300}`",
    );
    text = text.replace(
      "`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`",
      "`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${activeClientArchiveFilterForCascade}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`",
    );
  }

  const oldDelete = `      await requireScopedRow('clients', id, workspaceId, 'CLIENT_NOT_FOUND');\n      await deleteByIdScoped('clients', id, workspaceId);\n      res.status(200).json({ ok: true, id });\n      return;`;
  const newDelete = `      await requireScopedRow('clients', id, workspaceId, 'CLIENT_NOT_FOUND');\n      const archivedAt = new Date().toISOString();\n      await updateWithSchemaFallback(id, workspaceId, { archived_at: archivedAt, updated_at: archivedAt });\n      res.status(200).json({ ok: true, id, archivedAt, mode: CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1 });\n      return;`;
  if (text.includes(oldDelete)) {
    text = text.replace(oldDelete, newDelete);
  } else if (!text.includes('mode: CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1')) {
    fail(`${rel}: client DELETE block not recognized`);
  }

  write(rel, text);
}

// api/cases.ts: default list hides archived cases and cases whose client is archived; delete case archives it and keeps work item links.
{
  const rel = 'api/cases.ts';
  let text = read(rel);

  if (!text.includes(MARK)) {
    text = text.replace(
      "const CLOSEFLOW_CLIENT_PRIMARY_CASE_ETAP7_API_GUARD = 'primaryForClient replacePrimaryCase clients.primary_case_id';",
      "const CLOSEFLOW_CLIENT_PRIMARY_CASE_ETAP7_API_GUARD = 'primaryForClient replacePrimaryCase clients.primary_case_id';\nconst CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1 = 'case/client archive keeps calendar links and hides by parent archive';",
    );
  }

  if (!text.includes('getArchivedClientIdsForCaseListCascade')) {
    const insertAfter = `async function setClientPrimaryCaseForApi(workspaceId: string, clientId: string, caseId: string | null, nowIso: string) {\n  if (!clientId) return;\n  await bestEffortPatch(withWorkspaceFilter(\`clients?id=eq.\${encodeURIComponent(clientId)}\`, workspaceId), {\n    primary_case_id: caseId,\n    updated_at: nowIso,\n  });\n}\n`;
    const helper = `\nasync function getArchivedClientIdsForCaseListCascade(workspaceId: string) {\n  const rows = await safeSelectRows(withWorkspaceFilter('clients?select=id,archived_at&archived_at=not.is.null&limit=1000', workspaceId));\n  return new Set(rows.map((row) => asText(row.id)).filter(Boolean));\n}\n\nfunction caseRowIsArchivedByStatus(row: Record<string, unknown>) {\n  return asText(row.status).toLowerCase() === 'archived';\n}\n\nfunction caseRowClientId(row: Record<string, unknown>) {\n  return asText(row.client_id || row.clientId);\n}\n`;
    text = replaceOnce(rel, text, insertAfter, insertAfter + helper);
  }

  if (!text.includes('includeArchivedCasesForCascade')) {
    const needle = `      const requestedStatus = asText(req.query?.status);\n      const caseFilters = [`;
    const replacement = `      const requestedStatus = asText(req.query?.status);\n      const includeArchivedCasesForCascade = ['1', 'true', 'yes'].includes(asText(req.query?.includeArchived).toLowerCase());\n      const caseFilters = [`;
    text = replaceOnce(rel, text, needle, replacement);

    const afterRows = `        rows = result.data as Record<string, unknown>[];\n      } catch (error) {`;
    const withFilter = `        rows = result.data as Record<string, unknown>[];\n        if (!requestedId && !includeArchivedCasesForCascade) {\n          const archivedClientIdsForCascade = await getArchivedClientIdsForCaseListCascade(workspaceId);\n          rows = rows.filter((row) => !caseRowIsArchivedByStatus(row) && !archivedClientIdsForCascade.has(caseRowClientId(row)));\n        }\n      } catch (error) {`;
    text = replaceOnce(rel, text, afterRows, withFilter);
  }

  const oldDelete = `      await requireScopedRow('cases', id, workspaceId, 'CASE_NOT_FOUND');\n\n      const nowIso = new Date().toISOString();\n\n      await bestEffortPatch(withWorkspaceFilter(\`work_items?case_id=eq.\${encodeURIComponent(id)}\`, workspaceId), {\n        case_id: null,\n        case_title: null,\n        updated_at: nowIso,\n      });\n\n      await bestEffortPatch(withWorkspaceFilter(\`leads?linked_case_id=eq.\${encodeURIComponent(id)}\`, workspaceId), {\n        linked_case_id: null,\n        updated_at: nowIso,\n      });\n\n      await bestEffortPatch(withWorkspaceFilter(\`clients?primary_case_id=eq.\${encodeURIComponent(id)}\`, workspaceId), {\n        primary_case_id: null,\n        updated_at: nowIso,\n      });\n\n      await bestEffortDelete(\`client_portal_tokens?case_id=eq.\${encodeURIComponent(id)}\`);\n      await bestEffortDelete(\`case_items?case_id=eq.\${encodeURIComponent(id)}\`);\n      await bestEffortDelete(withWorkspaceFilter(\`activities?case_id=eq.\${encodeURIComponent(id)}\`, workspaceId));\n      await deleteByIdScoped('cases', id, workspaceId);\n\n      res.status(200).json({ ok: true, id });\n      return;`;
  const newDelete = `      await requireScopedRow('cases', id, workspaceId, 'CASE_NOT_FOUND');\n\n      const nowIso = new Date().toISOString();\n\n      await updateCaseWithSchemaFallback(id, workspaceId, {\n        status: 'archived',\n        updated_at: nowIso,\n        last_activity_at: nowIso,\n      });\n\n      await bestEffortPatch(withWorkspaceFilter(\`clients?primary_case_id=eq.\${encodeURIComponent(id)}\`, workspaceId), {\n        primary_case_id: null,\n        updated_at: nowIso,\n      });\n\n      res.status(200).json({ ok: true, id, archivedAt: nowIso, mode: CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1 });\n      return;`;
  if (text.includes(oldDelete)) {
    text = text.replace(oldDelete, newDelete);
  } else if (!text.includes("status: 'archived'")) {
    fail(`${rel}: case DELETE block not recognized`);
  }

  write(rel, text);
}

// src/lib/supabase-fallback.ts: allow includeArchived and filter tasks/events by archived client/case parents.
{
  const rel = 'src/lib/supabase-fallback.ts';
  let text = read(rel);

  if (!text.includes('CLOSEFLOW_CALENDAR_PARENT_ARCHIVE_FILTER_V1')) {
    const marker = `const API_GET_CACHE_TTL_MS = 10_000;`;
    text = replaceOnce(rel, text, marker, `const CLOSEFLOW_CALENDAR_PARENT_ARCHIVE_FILTER_V1 = 'calendar hides tasks/events whose client or case parent is archived';\n${marker}`);
  }

  if (!text.includes('function getRowIdForArchiveCascade')) {
    const marker = `function sanitizeLeadCompanyForNotNull(input: LeadInsertInput): LeadInsertInput {`;
    const helpers = `function getRowIdForArchiveCascade(row: Record<string, unknown>) {\n  return String((row as any).id || '').trim();\n}\n\nfunction getRowClientIdForArchiveCascade(row: Record<string, unknown>) {\n  return String((row as any).clientId || (row as any).client_id || '').trim();\n}\n\nfunction getRowCaseIdForArchiveCascade(row: Record<string, unknown>) {\n  return String((row as any).caseId || (row as any).case_id || '').trim();\n}\n\nfunction rowIsClientArchivedForCascade(row: Record<string, unknown>) {\n  return Boolean((row as any).archivedAt || (row as any).archived_at);\n}\n\nfunction rowIsCaseArchivedForCascade(row: Record<string, unknown>, archivedClientIds: Set<string>) {\n  const status = String((row as any).status || '').trim().toLowerCase();\n  return status === 'archived' || archivedClientIds.has(getRowClientIdForArchiveCascade(row));\n}\n\nasync function buildCalendarParentArchiveIndexForCascade() {\n  const [clientRows, caseRows] = await Promise.all([\n    callApi<Record<string, unknown>[]>('/api/clients?includeArchived=1').catch(() => []),\n    callApi<Record<string, unknown>[]>('/api/cases?includeArchived=1').catch(() => []),\n  ]);\n  const archivedClientIds = new Set(clientRows.filter(rowIsClientArchivedForCascade).map(getRowIdForArchiveCascade).filter(Boolean));\n  const archivedCaseIds = new Set(caseRows.filter((row) => rowIsCaseArchivedForCascade(row, archivedClientIds)).map(getRowIdForArchiveCascade).filter(Boolean));\n  return { archivedClientIds, archivedCaseIds };\n}\n\nfunction filterCalendarRowsByActiveParentsForCascade(rows: Record<string, unknown>[], index: { archivedClientIds: Set<string>; archivedCaseIds: Set<string> }) {\n  return rows.filter((row) => {\n    const clientId = getRowClientIdForArchiveCascade(row);\n    const caseId = getRowCaseIdForArchiveCascade(row);\n    if (clientId && index.archivedClientIds.has(clientId)) return false;\n    if (caseId && index.archivedCaseIds.has(caseId)) return false;\n    return true;\n  });\n}\n\n`;
    text = replaceOnce(rel, text, marker, helpers + marker);
  }

  // fetchClientsFromSupabase includeArchived support
  if (text.includes('export async function fetchClientsFromSupabase() {')) {
    text = text.replace(
      `export async function fetchClientsFromSupabase() {\n  if (isDevPreviewDataEnabled()) return getDevPreviewData().clients as Record<string, unknown>[];\n  return callApi<Record<string, unknown>[]>('/api/clients').then(normalizeClientListContract);\n}`,
      `export async function fetchClientsFromSupabase(params?: { includeArchived?: boolean }) {\n  if (isDevPreviewDataEnabled()) {\n    const rows = getDevPreviewData().clients as Record<string, unknown>[];\n    return params?.includeArchived ? rows : rows.filter((row) => !rowIsClientArchivedForCascade(row));\n  }\n  const query = params?.includeArchived ? '?includeArchived=1' : '';\n  return callApi<Record<string, unknown>[]>(\`/api/clients\${query}\`).then(normalizeClientListContract);\n}`,
    );
  }

  // fetchTasksFromSupabase parent archive filter
  if (text.includes(`export async function fetchTasksFromSupabase() {`) && !text.includes('filterCalendarRowsByActiveParentsForCascade(normalizedTasks')) {
    text = text.replace(
      `export async function fetchTasksFromSupabase() {\n  if (isDevPreviewDataEnabled()) return normalizeTaskListContract(getDevPreviewData().tasks as Record<string, unknown>[]);\n  if (shouldUseDevNoAuthMocks()) return [];\n  return callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);\n}`,
      `export async function fetchTasksFromSupabase() {\n  if (isDevPreviewDataEnabled()) {\n    const normalizedTasks = normalizeTaskListContract(getDevPreviewData().tasks as Record<string, unknown>[]);\n    const archivedClientIds = new Set((getDevPreviewData().clients as Record<string, unknown>[]).filter(rowIsClientArchivedForCascade).map(getRowIdForArchiveCascade).filter(Boolean));\n    const archivedCaseIds = new Set((getDevPreviewData().cases as Record<string, unknown>[]).filter((row) => rowIsCaseArchivedForCascade(row, archivedClientIds)).map(getRowIdForArchiveCascade).filter(Boolean));\n    return filterCalendarRowsByActiveParentsForCascade(normalizedTasks, { archivedClientIds, archivedCaseIds });\n  }\n  if (shouldUseDevNoAuthMocks()) return [];\n  const normalizedTasks = await callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);\n  const archiveIndex = await buildCalendarParentArchiveIndexForCascade();\n  return filterCalendarRowsByActiveParentsForCascade(normalizedTasks, archiveIndex);\n}`,
    );
  }

  // fetchEventsFromSupabase parent archive filter
  if (text.includes(`export async function fetchEventsFromSupabase() {`) && !text.includes('filterCalendarRowsByActiveParentsForCascade(normalizedEvents')) {
    text = text.replace(
      `export async function fetchEventsFromSupabase() {\n  if (isDevPreviewDataEnabled()) return normalizeEventListContract(getDevPreviewData().events as Record<string, unknown>[]);\n  if (shouldUseDevNoAuthMocks()) return [];\n  return callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);\n}`,
      `export async function fetchEventsFromSupabase() {\n  if (isDevPreviewDataEnabled()) {\n    const normalizedEvents = normalizeEventListContract(getDevPreviewData().events as Record<string, unknown>[]);\n    const archivedClientIds = new Set((getDevPreviewData().clients as Record<string, unknown>[]).filter(rowIsClientArchivedForCascade).map(getRowIdForArchiveCascade).filter(Boolean));\n    const archivedCaseIds = new Set((getDevPreviewData().cases as Record<string, unknown>[]).filter((row) => rowIsCaseArchivedForCascade(row, archivedClientIds)).map(getRowIdForArchiveCascade).filter(Boolean));\n    return filterCalendarRowsByActiveParentsForCascade(normalizedEvents, { archivedClientIds, archivedCaseIds });\n  }\n  if (shouldUseDevNoAuthMocks()) return [];\n  const normalizedEvents = await callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);\n  const archiveIndex = await buildCalendarParentArchiveIndexForCascade();\n  return filterCalendarRowsByActiveParentsForCascade(normalizedEvents, archiveIndex);\n}`,
    );
  }

  // fetchCasesFromSupabase includeArchived support
  if (text.includes('export async function fetchCasesFromSupabase(params?: { clientId?: string; leadId?: string; status?: string }) {')) {
    text = text.replace(
      `export async function fetchCasesFromSupabase(params?: { clientId?: string; leadId?: string; status?: string }) {`,
      `export async function fetchCasesFromSupabase(params?: { clientId?: string; leadId?: string; status?: string; includeArchived?: boolean }) {`,
    );
    text = text.replace(
      `      if (params?.status && String((row as any).status || '') !== params.status) return false;\n      return true;`,
      `      if (params?.status && String((row as any).status || '') !== params.status) return false;\n      if (!params?.includeArchived && String((row as any).status || '').toLowerCase() === 'archived') return false;\n      return true;`,
    );
    text = text.replace(
      `  if (params?.status) query.set('status', params.status);\n  return callApi<Record<string, unknown>[]>(\`/api/cases\${query.toString() ? \`?\${query.toString()}\` : ''}\`).then(normalizeCaseListContract);`,
      `  if (params?.status) query.set('status', params.status);\n  if (params?.includeArchived) query.set('includeArchived', '1');\n  return callApi<Record<string, unknown>[]>(\`/api/cases\${query.toString() ? \`?\${query.toString()}\` : ''}\`).then(normalizeCaseListContract);`,
    );
  }

  write(rel, text);
}

// docs
{
  const rel = 'docs/clients/CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_2026-05-11.md';
  const doc = `# CloseFlow - client/case archive cascade with calendar visibility\n\nStatus: implemented by ${MARK}\n\n## Decision\n\nDeleting a client archives the client through \`clients.archived_at\` instead of hard-deleting it. Cases keep their original operational status, but active case lists hide cases whose client is archived.\n\nDeleting a case archives the case through \`cases.status = archived\` and keeps task/event links. The calendar hides tasks and events whose \`clientId\` or \`caseId\` points to an archived parent.\n\n## Restore rule\n\nRestoring a client by clearing \`archived_at\` makes its cases and linked calendar items visible again, because task/event relations are preserved.\n\n## Guard\n\nRun:\n\n\`\`\`powershell\nnpm.cmd run check:closeflow-client-archive-calendar-cascade\n\`\`\`\n`;
  fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
  write(rel, doc);
}

console.log('CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_PATCH_OK');
