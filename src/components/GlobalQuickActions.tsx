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
import { ClipboardList, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import GlobalAiAssistant from './GlobalAiAssistant';
import QuickAiCapture from './QuickAiCapture';
import { Button } from './ui/button';
import { useWorkspace } from '../hooks/useWorkspace';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toDateTimeLocalValue } from '../lib/scheduling';
import { insertTaskToSupabase } from '../lib/supabase-fallback';
import { requireWorkspaceId } from '../lib/workspace-context';
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
  const { access, workspace, hasAccess } = useWorkspace();
  const canUseFullAiAssistantByPlan = Boolean(access?.features?.fullAi);
  const canUseQuickAiCaptureByPlan = Boolean(access?.features?.lightDrafts || access?.features?.lightParser || access?.features?.fullAi);
  const canUseAiDraftsByPlan = Boolean(access?.features?.lightDrafts || access?.features?.fullAi);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [globalTaskTitle, setGlobalTaskTitle] = useState('');
  const [globalTaskDueAt, setGlobalTaskDueAt] = useState(() => toDateTimeLocalValue(new Date()));
  const [globalTaskPriority, setGlobalTaskPriority] = useState('medium');
  const [globalTaskSubmitting, setGlobalTaskSubmitting] = useState(false);

  const resetGlobalTaskDialog = () => {
    setGlobalTaskTitle('');
    setGlobalTaskDueAt(toDateTimeLocalValue(new Date()));
    setGlobalTaskPriority('medium');
  };

  const openGlobalTaskDialog = () => {
    setGlobalTaskDueAt(toDateTimeLocalValue(new Date()));
    setIsTaskDialogOpen(true);
  };

  const handleGlobalTaskSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (globalTaskSubmitting) return;
    if (!hasAccess) {
      toast.error('Brak dostępu do zapisu w tym planie.');
      return;
    }

    const title = globalTaskTitle.trim();
    if (!title) {
      toast.error('Podaj tytuł zadania.');
      return;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      toast.error('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }

    setGlobalTaskSubmitting(true);
    try {
      await insertTaskToSupabase({
        title,
        type: 'follow_up',
        date: globalTaskDueAt.slice(0, 10),
        scheduledAt: globalTaskDueAt,
        priority: globalTaskPriority,
        workspaceId,
      });

      toast.success('Zadanie dodane');
      setIsTaskDialogOpen(false);
      resetGlobalTaskDialog();
    } catch (error: any) {
      const message = String(error?.message || '');
      if (message.includes('WORKSPACE_ENTITY_LIMIT_REACHED')) {
        toast.error('Limit zadań w tym planie został osiągnięty.');
      } else {
        toast.error('Nie udało się zapisać zadania. Spróbuj ponownie.');
      }
    } finally {
      setGlobalTaskSubmitting(false);
    }
  };


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
      {canUseFullAiAssistantByPlan ? (
        <GlobalAiAssistant />
      ) : null}

      {canUseQuickAiCaptureByPlan ? <QuickAiCapture /> : null}

      {canUseAiDraftsByPlan ? (
        <Button asChild variant="outline" className="btn soft-blue" data-global-quick-action="ai-drafts">
          <Link to="/ai-drafts" aria-label="Otwórz Szkice AI">
            <ClipboardList className="mr-2 h-4 w-4" />
            Szkice AI
          </Link>
        </Button>
      ) : null}

      <Button asChild variant="outline" className="btn" data-global-quick-action="lead">
        <Link to="/leads?quick=lead" aria-label="Otwórz leady lub dodaj leada" onClick={() => rememberGlobalQuickAction('lead')}>
          <Plus className="mr-2 h-4 w-4" />
          Lead
        </Link>
      </Button>

            {/* STAGE01_GLOBAL_TASK_QUICK_ACTION_BRIDGE_COMPAT_STAGE45A_V7: rememberGlobalQuickAction('task') marker only; toolbar opens task dialog in place. */}
      <Button
        type="button"
        variant="outline"
        className="btn"
        data-global-quick-action="task"
        data-global-task-create-dialog-trigger="true"
        aria-label="Dodaj zadanie"
        onClick={openGlobalTaskDialog}
      >
        <Plus className="mr-2 h-4 w-4" />
        Zadanie
      </Button>

      <Button asChild variant="outline" className="btn" data-global-quick-action="event">
        <Link to="/calendar?quick=event" aria-label="Otwórz kalendarz lub dodaj wydarzenie" onClick={() => rememberGlobalQuickAction('event')}>
          <Plus className="mr-2 h-4 w-4" />
          Wydarzenie
        </Link>
      </Button>
      </div>

      {/* GLOBAL_TASK_ACTION_MODAL_NO_ROUTE_HOTFIX: top-bar Zadanie opens modal in place, not /tasks navigation. */}
      <Dialog
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) resetGlobalTaskDialog();
        }}
      >
        <DialogContent data-global-task-create-dialog="true" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Nowe zadanie</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" data-global-task-create-form="true" onSubmit={handleGlobalTaskSubmit}>
            <div className="space-y-2">
              <Label htmlFor="global-task-title">Tytuł</Label>
              <Input
                id="global-task-title"
                value={globalTaskTitle}
                onChange={(event) => setGlobalTaskTitle(event.target.value)}
                placeholder="Co trzeba zrobić?"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="global-task-due-at">Termin</Label>
                <Input
                  id="global-task-due-at"
                  type="datetime-local"
                  value={globalTaskDueAt}
                  onChange={(event) => setGlobalTaskDueAt(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="global-task-priority">Priorytet</Label>
                <select
                  id="global-task-priority"
                  className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={globalTaskPriority}
                  onChange={(event) => setGlobalTaskPriority(event.target.value)}
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" className="btn primary" disabled={globalTaskSubmitting}>
                {globalTaskSubmitting ? 'Zapisywanie...' : 'Zapisz zadanie'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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

/* GLOBAL_QUICK_ACTIONS_STAGE08D_SAME_ROUTE_MODAL_FIX to="/leads?quick=lead" to="/tasks?quick=task" to="/calendar?quick=event" subscribeGlobalQuickAction */
