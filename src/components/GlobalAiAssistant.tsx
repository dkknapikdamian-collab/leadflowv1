import { useEffect, useState } from 'react';

import { useWorkspace } from '../hooks/useWorkspace';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { fetchAssistantContextFromSupabase, fetchClientsFromSupabase, fetchLeadsFromSupabase } from '../lib/supabase-fallback';
import TodayAiAssistant from './TodayAiAssistant';

type AssistantContext = {
  leads: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  cases: Record<string, unknown>[];
  clients: Record<string, unknown>[];
  drafts: Record<string, unknown>[];
  operatorSnapshot?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  relations?: Record<string, unknown>;
  searchIndex?: Record<string, unknown>[];
};

const EMPTY_CONTEXT: AssistantContext = {
  leads: [],
  tasks: [],
  events: [],
  cases: [],
  clients: [],
  drafts: [],
  operatorSnapshot: {},
  summary: {},
  relations: {},
  searchIndex: [],
};

function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') as Record<string, unknown>[] : [];
}

export default function GlobalAiAssistant() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const [context, setContext] = useState<AssistantContext>(EMPTY_CONTEXT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setContext(EMPTY_CONTEXT);
      return;
    }

    let cancelled = false;

    const loadContext = async () => {
      setLoading(true);
      try {
        const appContext = await fetchAssistantContextFromSupabase().catch(async () => {
          const [bundle, leadRows, clientRows] = await Promise.all([
            fetchCalendarBundleFromSupabase(),
            fetchLeadsFromSupabase().catch(() => []),
            fetchClientsFromSupabase().catch(() => []),
          ]);

          return {
            leads: asRecordArray(leadRows),
            tasks: asRecordArray(bundle.tasks),
            events: asRecordArray(bundle.events),
            cases: asRecordArray(bundle.cases),
            clients: asRecordArray(clientRows),
            drafts: [],
          };
        });

        if (cancelled) return;

        setContext({
          leads: asRecordArray(appContext.leads),
          tasks: asRecordArray(appContext.tasks),
          events: asRecordArray(appContext.events),
          cases: asRecordArray(appContext.cases),
          clients: asRecordArray(appContext.clients),
          drafts: asRecordArray((appContext as any).drafts),
          // AI_OPERATOR_SNAPSHOT_STAGE02_CONTEXT: przekazujemy metadane snapshotu do asystenta bez dokładania osobnej funkcji Vercel.
          operatorSnapshot: ((appContext as any).operatorSnapshot && typeof (appContext as any).operatorSnapshot === 'object') ? (appContext as any).operatorSnapshot : {},
          summary: ((appContext as any).summary && typeof (appContext as any).summary === 'object') ? (appContext as any).summary : {},
          relations: ((appContext as any).relations && typeof (appContext as any).relations === 'object') ? (appContext as any).relations : {},
          searchIndex: asRecordArray((appContext as any).searchIndex),
        });
      } catch {
        if (!cancelled) {
          setContext(EMPTY_CONTEXT);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadContext();

    return () => {
      cancelled = true;
    };
  }, [workspace?.id, workspaceLoading]);

  return (
    <TodayAiAssistant
      leads={context.leads}
      tasks={context.tasks}
      events={context.events}
      cases={context.cases}
      clients={context.clients}
      drafts={context.drafts}
      operatorSnapshot={context.operatorSnapshot}
      summary={context.summary}
      relations={context.relations}
      searchIndex={context.searchIndex}
      disabled={loading || workspaceLoading || !workspace?.id}
    />
  );
}
