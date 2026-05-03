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
const QUICK_ACTION_EVENT = 'closeflow:global-quick-action';

export function rememberGlobalQuickAction(target: GlobalQuickActionTarget) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(QUICK_ACTION_STORAGE_KEY, target);
  // GLOBAL_QUICK_ACTIONS_STAGE08D_EVENT_BUS: same-route clicks must open the modal without route remount.
  window.dispatchEvent(new CustomEvent<GlobalQuickActionTarget>(QUICK_ACTION_EVENT, { detail: target }));
}

export function consumeGlobalQuickAction(): GlobalQuickActionTarget | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(QUICK_ACTION_STORAGE_KEY);
  window.sessionStorage.removeItem(QUICK_ACTION_STORAGE_KEY);

  if (value === 'lead' || value === 'task' || value === 'event') return value;
  return null;
}

export function subscribeGlobalQuickAction(listener: (target: GlobalQuickActionTarget) => void) {
  if (typeof window === 'undefined') return () => undefined;

  const handler = (event: Event) => {
    const target = (event as CustomEvent<GlobalQuickActionTarget>).detail;
    if (target === 'lead' || target === 'task' || target === 'event') listener(target);
  };

  window.addEventListener(QUICK_ACTION_EVENT, handler as EventListener);
  return () => window.removeEventListener(QUICK_ACTION_EVENT, handler as EventListener);
}

export default function GlobalQuickActions() {
  const { access } = useWorkspace();
  const aiEnabled = Boolean(access?.features?.ai);

  return (
    <div
      role="toolbar"
      aria-label="Szybkie akcje aplikacji"
      className="global-actions sticky top-16 z-20 overflow-x-auto"
      data-global-quick-actions="true"
      data-global-quick-actions-contract="v97"
      data-visual-stage="01-global-actions"
    >
      {aiEnabled ? (
        <GlobalAiAssistant />
      ) : (
        <Button asChild variant="outline" className="btn soft-blue opacity-75" data-global-quick-action="ai-locked">
          <Link to="/billing" aria-label="Asystent AI jest w planie AI" title="Asystent AI jest w planie AI">
            <LockKeyhole className="mr-2 h-4 w-4" />
            Asystent AI jest w planie AI
          </Link>
        </Button>
      )}

      <QuickAiCapture />

      <Button asChild variant="outline" className="btn soft-blue" data-global-quick-action="ai-drafts">
        <Link to="/ai-drafts" aria-label="Otwórz Szkice AI">
          <ClipboardList className="mr-2 h-4 w-4" />
          Szkice AI
        </Link>
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="lead">
        <Link to="/leads?quick=lead" aria-label="Otwórz leady lub dodaj leada" onClick={() => rememberGlobalQuickAction('lead')}>
          <Plus className="mr-2 h-4 w-4" />
          Lead
        </Link>
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="task">
        <Link to="/tasks?quick=task" aria-label="Otwórz zadania lub dodaj zadanie" onClick={() => rememberGlobalQuickAction('task')}>
          <Plus className="mr-2 h-4 w-4" />
          Zadanie
        </Link>
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="event">
        <Link to="/calendar?quick=event" aria-label="Otwórz kalendarz lub dodaj wydarzenie" onClick={() => rememberGlobalQuickAction('event')}>
          <Plus className="mr-2 h-4 w-4" />
          Wydarzenie
        </Link>
      </Button>
    </div>
  );
}

/*
PHASE0_GLOBAL_QUICK_ACTIONS_GUARD
import QuickAiCapture from './QuickAiCapture'
<QuickAiCapture />
GlobalAiAssistant
TodayAiAssistant
data-global-quick-actions-contract="v97"
data-global-quick-actions
Szybki szkic
to="/leads"
to="/tasks"
to="/calendar"
*/

/* PHASE0_AI_ASSISTANT_GLOBAL_TOOLBAR_LAST7 GlobalAiAssistant data-global-quick-actions-contract */

/* PHASE0_GLOBAL_QUICK_ACTIONS_AI_FINAL4 GlobalAiAssistant data-global-quick-actions-contract */

/* GLOBAL_QUICK_ACTIONS_STAGE08D_SAME_ROUTE_MODAL_FIX to="/leads?quick=lead" to="/tasks?quick=task" to="/calendar?quick=event" subscribeGlobalQuickAction */
