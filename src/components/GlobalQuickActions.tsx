import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import QuickAiCapture from './QuickAiCapture';
import TodayAiAssistant from './TodayAiAssistant';
import { Button } from './ui/button';

export type GlobalQuickActionTarget = 'lead' | 'task' | 'event';

const QUICK_ACTION_STORAGE_KEY = 'closeflow:global-quick-action:v1';

export function rememberGlobalQuickAction(target: GlobalQuickActionTarget) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(QUICK_ACTION_STORAGE_KEY, target);
}

export function consumeGlobalQuickAction(): GlobalQuickActionTarget | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(QUICK_ACTION_STORAGE_KEY);
  window.sessionStorage.removeItem(QUICK_ACTION_STORAGE_KEY);

  if (value === 'lead' || value === 'task' || value === 'event') return value;
  return null;
}

export default function GlobalQuickActions() {
  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm"
      data-global-quick-actions="true"
    >
      <TodayAiAssistant leads={[]} tasks={[]} events={[]} cases={[]} />
      <QuickAiCapture />

      <Button asChild className="rounded-xl shadow-lg shadow-primary/20" data-global-quick-action="lead">
        <Link to="/leads" onClick={() => rememberGlobalQuickAction('lead')}>
          <Plus className="mr-2 h-4 w-4" />
          Lead
        </Link>
      </Button>

      <Button asChild variant="outline" className="rounded-xl bg-white" data-global-quick-action="task">
        <Link to="/tasks" onClick={() => rememberGlobalQuickAction('task')}>
          <Plus className="mr-2 h-4 w-4" />
          Zadanie
        </Link>
      </Button>

      <Button asChild variant="outline" className="rounded-xl bg-white" data-global-quick-action="event">
        <Link to="/calendar" onClick={() => rememberGlobalQuickAction('event')}>
          <Plus className="mr-2 h-4 w-4" />
          Wydarzenie
        </Link>
      </Button>
    </div>
  );
}
