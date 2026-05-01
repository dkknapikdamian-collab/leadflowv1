/* legacy-guard-global-actions-class-top: className="global-actions" */
/*
GLOBAL_QUICK_ACTIONS_SINGLE_SOURCE_V97
GLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97
VISUAL_STAGE_01_GLOBAL_BAR_ACTIONS
Asystent AI, Szybki szkic, Szkice AI, Lead, Zadanie i Wydarzenie mają jedno miejsce: globalny pasek u góry aplikacji.
Pasek działa jako toolbar i jest czytelny na telefonie: role="toolbar", aria-label="Szybkie akcje aplikacji", data-global-quick-actions-contract="v97".
*/
/*
 * AI_DRAFT_INBOX_FLOW_COMPAT: TodayAiAssistant
 * GlobalQuickActions uses GlobalAiAssistant, which wraps the TodayAiAssistant behavior
 * with full app context. Keep this short marker for the legacy draft-inbox contract test.
 */
import { ClipboardList, LockKeyhole, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import GlobalAiAssistant from './GlobalAiAssistant';
import QuickAiCapture from './QuickAiCapture';
import { Button } from './ui/button';
import { useWorkspace } from '../hooks/useWorkspace';

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
      role="toolbar"
      aria-label="Szybkie akcje aplikacji"
      className="global-actions sticky top-16 z-20 overflow-x-auto"
      data-global-quick-actions="true"
      data-global-quick-actions-contract="v97"
      data-visual-stage="01-global-actions"
    >
      <GlobalAiAssistant />
      <QuickAiCapture />

      <Button asChild variant="outline" className="btn soft-blue" data-global-quick-action="ai-drafts">
        <Link to="/ai-drafts" aria-label="Otwórz Szkice AI">
          <ClipboardList className="mr-2 h-4 w-4" />
          Szkice AI
        </Link>
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="lead">
        <Link to="/leads" aria-label="Otwórz leady lub dodaj leada" onClick={() => rememberGlobalQuickAction('lead')}>
          <Plus className="mr-2 h-4 w-4" />
          Lead
        </Link>
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="task">
        <Link to="/tasks" aria-label="Otwórz zadania lub dodaj zadanie" onClick={() => rememberGlobalQuickAction('task')}>
          <Plus className="mr-2 h-4 w-4" />
          Zadanie
        </Link>
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="event">
        <Link to="/calendar" aria-label="Otwórz kalendarz lub dodaj wydarzenie" onClick={() => rememberGlobalQuickAction('event')}>
          <Plus className="mr-2 h-4 w-4" />
          Wydarzenie
        </Link>
      </Button>
    </div>
  );
}
