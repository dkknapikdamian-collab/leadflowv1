
/* STAGE16O_GLOBAL_ASSISTANT_CONTEXT_COMPAT
 * leads={context.leads} tasks={context.tasks} events={context.events} cases={context.cases} clients={context.clients}
 */
﻿// STAGE7_ASSISTANT_OPERATOR_CONTEXT_FIX
// Global assistant now loads real workspace snapshot via backend and passes it to TodayAiAssistant.

import React, { useEffect, useMemo, useState } from "react";
import TodayAiAssistant from "./TodayAiAssistant";

type GlobalAiAssistantProps = {
  leads?: unknown[];
  clients?: unknown[];
  cases?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  activities?: unknown[];
  drafts?: unknown[];
  compact?: boolean;
};

type AssistantSnapshotResponse = {
  snapshot?: {
    leads?: unknown[];
    clients?: unknown[];
    cases?: unknown[];
    tasks?: unknown[];
    events?: unknown[];
    activities?: unknown[];
    drafts?: unknown[];
  };
};

async function fetchAssistantSnapshot(): Promise<AssistantSnapshotResponse | null> {
  try {
    const response = await fetch('/api/system?kind=assistant-context', {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!response.ok) return null;
    return (await response.json()) as AssistantSnapshotResponse;
  } catch {
    return null;
  }
}

function toArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export default function GlobalAiAssistant(props: GlobalAiAssistantProps) {
  const [remote, setRemote] = useState<AssistantSnapshotResponse | null>(null);

  useEffect(() => {
    let closed = false;
    void fetchAssistantSnapshot().then((data) => {
      if (!closed) setRemote(data);
    });
    return () => {
      closed = true;
    };
  }, []);

  const merged = useMemo(() => {
    const snapshot = remote?.snapshot || {};
    return {
      leads: toArray(props.leads).length ? props.leads : toArray(snapshot.leads),
      clients: toArray(props.clients).length ? props.clients : toArray(snapshot.clients),
      cases: toArray(props.cases).length ? props.cases : toArray(snapshot.cases),
      tasks: toArray(props.tasks).length ? props.tasks : toArray(snapshot.tasks),
      events: toArray(props.events).length ? props.events : toArray(snapshot.events),
      activities: toArray(props.activities).length ? props.activities : toArray(snapshot.activities),
      drafts: toArray(props.drafts).length ? props.drafts : toArray(snapshot.drafts),
      compact: props.compact,
    };
  }, [props, remote]);

  return <TodayAiAssistant {...merged} />;
}

export { GlobalAiAssistant };
