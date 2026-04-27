import { selectFirstAvailable } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';

type RecordMap = Record<string, unknown>;

function safeArray(value: unknown) {
  return Array.isArray(value) ? value.filter((row) => row && typeof row === 'object') as RecordMap[] : [];
}

async function safeSelect(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return safeArray(result.data);
  } catch {
    return [] as RecordMap[];
  }
}

function mapAiDraft(row: RecordMap) {
  return {
    id: row.id,
    type: row.type || 'lead',
    kind: row.kind || 'lead_capture',
    source: row.source || 'manual',
    provider: row.provider || 'local',
    status: row.status || 'draft',
    rawText: row.raw_text || '',
    parsedData: row.parsed_data || {},
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const workspaceId = await resolveRequestWorkspaceId(req);
    if (!workspaceId) {
      res.status(401).json({ error: 'ASSISTANT_CONTEXT_WORKSPACE_REQUIRED' });
      return;
    }

    const [leads, tasks, events, cases, clients, drafts] = await Promise.all([
      safeSelect(withWorkspaceFilter('leads?select=id,name,company,email,phone,source,status,value,next_action_title,next_action_at,is_at_risk,linked_case_id,client_id,updated_at,created_at&order=updated_at.desc.nullslast&limit=300', workspaceId)),
      safeSelect(withWorkspaceFilter('work_items?select=id,title,record_type,type,status,priority,date,scheduled_at,start_at,end_at,lead_id,case_id,client_id,reminder_at,updated_at,created_at&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=300', workspaceId)),
      safeSelect(withWorkspaceFilter('work_items?select=id,title,record_type,type,status,priority,date,scheduled_at,start_at,end_at,lead_id,case_id,client_id,reminder_at,updated_at,created_at&record_type=eq.event&order=start_at.asc.nullslast&limit=300', workspaceId)),
      safeSelect(withWorkspaceFilter('cases?select=id,title,client_name,status,lead_id,client_id,completeness_percent,portal_ready,updated_at,created_at&order=updated_at.desc.nullslast&limit=300', workspaceId)),
      safeSelect(withWorkspaceFilter('clients?select=id,name,company,email,phone,source_primary,last_activity_at,updated_at,created_at&order=updated_at.desc.nullslast&limit=300', workspaceId)),
      safeSelect(withWorkspaceFilter('ai_drafts?select=id,type,kind,source,provider,status,raw_text,parsed_data,created_at,updated_at&order=created_at.desc&limit=100', workspaceId)),
    ]);

    res.status(200).json({
      ok: true,
      workspaceId,
      now: new Date().toISOString(),
      leads,
      tasks,
      events,
      cases,
      clients,
      drafts: drafts.map(mapAiDraft),
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'ASSISTANT_CONTEXT_FAILED' });
  }
}
