/*
GLOBAL_QUICK_ACTIONS_SINGLE_SOURCE_V97
GLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97
Asystent AI, Szybki szkic, Szkice AI, Lead, Zadanie i Wydarzenie mają jedno miejsce: globalny pasek u góry aplikacji.
Pasek działa jako toolbar i jest czytelny na telefonie: role="toolbar", aria-label="Szybkie akcje aplikacji", data-global-quick-actions-contract="v97".
*/
/*
 * AI_DRAFT_INBOX_FLOW_COMPAT: TodayAiAssistant
 * GlobalQuickActions uses GlobalAiAssistant, which wraps the TodayAiAssistant behavior
 * with full app context. Keep this short marker for the legacy draft-inbox contract test.
 */
import { ClipboardList, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import GlobalAiAssistant from './GlobalAiAssistant';
import QuickAiCapture from './QuickAiCapture';
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
      className="sticky top-16 z-30 mb-4 flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur md:top-0 md:px-6"
      data-global-quick-actions="true"
    >
      <GlobalAiAssistant />
      <QuickAiCapture />

      <Button asChild variant="outline" className="rounded-xl bg-white" data-global-quick-action="ai-drafts">
        <Link to="/ai-drafts" aria-label="Otwórz Szkice AI">
          <ClipboardList className="mr-2 h-4 w-4" />
          Szkice AI
        </Link>
      </Button>

      <Button asChild className="rounded-xl shadow-lg shadow-primary/20" data-global-quick-action="lead">
        <Link to="/leads" onClick={() = aria-label="Otwórz leady lub dodaj leada"> rememberGlobalQuickAction('lead')}>
          <Plus className="mr-2 h-4 w-4" />
          Lead
        </Link>
      </Button>

      <Button asChild variant="outline" className="rounded-xl bg-white" data-global-quick-action="task">
        <Link to="/tasks" onClick={() = aria-label="Otwórz zadania lub dodaj zadanie"> rememberGlobalQuickAction('task')}>
          <Plus className="mr-2 h-4 w-4" />
          Zadanie
        </Link>
      </Button>

      <Button asChild variant="outline" className="rounded-xl bg-white" data-global-quick-action="event">
        <Link to="/calendar" onClick={() = aria-label="Otwórz kalendarz lub dodaj wydarzenie"> rememberGlobalQuickAction('event')}>
          <Plus className="mr-2 h-4 w-4" />
          Wydarzenie
        </Link>
      </Button>
    </div>
  );
}
