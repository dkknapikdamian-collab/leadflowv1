import { useEffect, useState } from 'react';

import { useWorkspace } from '../hooks/useWorkspace';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { fetchClientsFromSupabase, fetchLeadsFromSupabase } from '../lib/supabase-fallback';
import TodayAiAssistant from './TodayAiAssistant';

type AssistantContext = {
  leads: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  cases: Record<string, unknown>[];
  clients: Record<string, unknown>[];
};

const EMPTY_CONTEXT: AssistantContext = {
  leads: [],
  tasks: [],
  events: [],
  cases: [],
  clients: [],
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
        const [bundle, leadRows, clientRows] = await Promise.all([
          fetchCalendarBundleFromSupabase(),
          fetchLeadsFromSupabase().catch(() => []),
          fetchClientsFromSupabase().catch(() => []),
        ]);

        if (cancelled) return;

        setContext({
          leads: asRecordArray(leadRows),
          tasks: asRecordArray(bundle.tasks),
          events: asRecordArray(bundle.events),
          cases: asRecordArray(bundle.cases),
          clients: asRecordArray(clientRows),
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
      disabled={loading || workspaceLoading || !workspace?.id}
    />
  );
}
