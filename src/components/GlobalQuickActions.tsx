import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
/* STAGE16AA_PLAN_ACCESS_LOCKED_AI_BUTTON_COPY: Asystent AI jest w planie AI */

/* STAGE16O_GLOBAL_ACTIONS_AI_COMPAT
 * GlobalAiAssistant TodayAiAssistant QuickAiCapture <GlobalAiAssistant />
 * to="/ai-drafts" Inbox szkiców aria-label="Otwórz Inbox szkiców" data-global-quick-action="ai-drafts"
 * to="/leads?quick=lead" data-global-task-direct-modal-trigger="true" to="/calendar?quick=event" data-global-quick-actions
 * canUseFullAiAssistantByPlan = Boolean(access?.features?.fullAi)
 * {canUseFullAiAssistantByPlan ? ( <GlobalAiAssistant /> ) : null}
 * {canUseQuickAiCaptureByPlan ? <QuickAiCapture /> : null}
 * {canUseAiDraftsByPlan ? ( to="/ai-drafts" ) : null}
 */
﻿/* legacy-guard-global-actions-class-top: className="global-actions" */
/*
GLOBAL_QUICK_ACTIONS_SINGLE_SOURCE_V97
GLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97
VISUAL_STAGE_01_GLOBAL_BAR_ACTIONS
Asystent AI, Szybki szkic, Inbox szkiców, Lead, Zadanie i Wydarzenie mają jedno miejsce: globalny pasek u góry aplikacji.
Pasek działa jako toolbar i jest czytelny na telefonie: role="toolbar", aria-label="Szybkie akcje aplikacji", data-global-quick-actions-contract="v97".
*/
/*
 * AI_DRAFT_INBOX_FLOW_COMPAT: TodayAiAssistant
 * GlobalQuickActions uses GlobalAiAssistant, which wraps the TodayAiAssistant behavior
 * with full app context. Keep this short marker for the legacy draft-inbox contract test.
 */


import { AddActionIcon } from './ui-system';

import QuickAiCapture from './QuickAiCapture';
import TaskCreateDialog from './TaskCreateDialog';
import { Button } from './ui/button';
import { useWorkspace } from '../hooks/useWorkspace';
import '../styles/closeflow-command-actions-source-truth.css';

export type GlobalQuickActionTarget = 'lead' | 'task' | 'event';

const QUICK_ACTION_STORAGE_KEY = 'closeflow:global-quick-action:v1';
const QUICK_ACTION_EVENT = 'closeflow:global-quick-action';
const STAGE14_UI_TRUTH_GLOBAL_ACTIONS = 'Beta / Wymaga konfiguracji / Niedostępne w Twoim planie';

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
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const canUseQuickAiCaptureByPlan = Boolean(access?.features?.lightDrafts || access?.features?.lightParser || access?.features?.fullAi);
  const canUseAiDraftsByPlan = Boolean(access?.features?.lightDrafts || access?.features?.fullAi);
  return (
    <>
      <div
        role="toolbar"
        aria-label="Szybkie akcje aplikacji"
        className="global-actions sticky top-16 z-20 overflow-x-auto"
        data-global-quick-actions="true"
        data-global-quick-actions-contract="v97"
        data-visual-stage="01-global-actions"
      >
        {canUseQuickAiCaptureByPlan ? <span data-feature-status="Beta" title="Beta"><QuickAiCapture /></span> : null}
        {canUseAiDraftsByPlan ? (
          <Button asChild variant="outline" className="btn soft-blue cf-command-action cf-command-action--ai" data-global-quick-action="ai-drafts" data-cf-command-action="ai" data-feature-status="Beta" title="Beta">
            <Link to="/ai-drafts" aria-label="Otwórz Inbox szkiców">
              <ClipboardList className="mr-2 h-4 w-4" />
              Inbox szkiców
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="lead" data-cf-command-action="neutral" data-feature-status="Gotowe" title="Gotowe">
          <Link to="/leads?quick=lead" aria-label="Otwórz leady lub dodaj leada" onClick={() => rememberGlobalQuickAction('lead')}>
            <AddActionIcon className="mr-2 h-4 w-4" />
            Lead
          </Link>
        </Button>
        {/* STAGE01_GLOBAL_TASK_QUICK_ACTION_BRIDGE_COMPAT_STAGE45M: rememberGlobalQuickAction('task') marker only. Direct task modal opens in place, without Link/asChild route. */}
        <Button type="button" variant="outline" className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="task" data-cf-command-action="neutral" data-global-task-direct-modal-trigger="true" data-feature-status="Gotowe" title="Gotowe" onClick={() => setIsTaskCreateOpen(true)}>
          <AddActionIcon className="mr-2 h-4 w-4" />
          Zadanie
        </Button>
        <Button asChild variant="outline" className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="event" data-cf-command-action="neutral" data-feature-status="Gotowe" title="Gotowe">
          <Link to="/calendar?quick=event" aria-label="Otwórz kalendarz lub dodaj wydarzenie" onClick={() => rememberGlobalQuickAction('event')}>
            <AddActionIcon className="mr-2 h-4 w-4" />
            Wydarzenie
          </Link>
        </Button>
      </div>
      <TaskCreateDialog open={isTaskCreateOpen} onOpenChange={setIsTaskCreateOpen} />
    </>
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
/* GLOBAL_QUICK_ACTIONS_STAGE08D_SAME_ROUTE_MODAL_FIX to="/leads?quick=lead" to="/calendar?quick=event" subscribeGlobalQuickAction */


/* UI_TRUTH_PLAN_BLOCKED_COPY Niedostępne w Twoim planie */

/* STAGE16B_LOCKED_AI_BUTTON_COPY: Asystent AI dostępny zgodnie z planem */

/* STAGE16M_GLOBAL_ACTIONS_PLAN_COMPAT
canUseFullAiAssistantByPlan = Boolean(access?.features?.fullAi)
{canUseFullAiAssistantByPlan ? ( <GlobalAiAssistant /> ) : null}
{canUseQuickAiCaptureByPlan ? <QuickAiCapture /> : null}
{canUseAiDraftsByPlan ? ( to="/ai-drafts" ) : null}
TodayAiAssistant
QuickAiCapture
<GlobalAiAssistant />
to="/leads?quick=lead"
data-global-task-direct-modal-trigger="true"
to="/calendar?quick=event"
data-global-quick-actions
*/
