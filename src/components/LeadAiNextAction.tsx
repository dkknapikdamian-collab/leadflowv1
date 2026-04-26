import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, Copy, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { createLeadNextActionSuggestion, type LeadNextActionSuggestion } from '../lib/ai-next-action';
import { useWorkspace } from '../hooks/useWorkspace';
import { insertTaskToSupabase } from '../lib/supabase-fallback';
import { requireWorkspaceId } from '../lib/workspace-context';

type LeadAiNextActionProps = {
  lead: Record<string, unknown> | null;
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  activities: Record<string, unknown>[];
  disabled?: boolean;
  onTaskCreated?: () => void | Promise<void>;
};

function getLeadTitle(lead: Record<string, unknown> | null) {
  return String(lead?.name || lead?.company || lead?.email || lead?.phone || 'lead');
}

function formatDateTime(value: string) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return 'Bez terminu';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildPlanText(suggestion: LeadNextActionSuggestion | null) {
  if (!suggestion) return '';

  return [
    `Ruch: ${suggestion.title}`,
    `Priorytet: ${suggestion.priority}`,
    `Termin: ${formatDateTime(suggestion.dueAt)}`,
    '',
    suggestion.summary,
    '',
    `Dlaczego: ${suggestion.reason}`,
    '',
    `Zadanie do utworzenia: ${suggestion.suggestedTask.title}`,
    '',
    'Proponowana wiadomość:',
    suggestion.messageHint,
  ].join('\n');
}

export default function LeadAiNextAction({ lead, tasks, events, activities, disabled, onTaskCreated }: LeadAiNextActionProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('');
  const [suggestion, setSuggestion] = useState<LeadNextActionSuggestion | null>(null);
  const [planText, setPlanText] = useState('');
  const [taskSaving, setTaskSaving] = useState(false);
  const { workspace } = useWorkspace();
  const leadTitle = useMemo(() => getLeadTitle(lead), [lead]);

  const handleGenerate = async () => {
    if (!lead) return toast.error('Brak danych leada do analizy');

    setLoading(true);
    try {
      const response = await createLeadNextActionSuggestion({
        lead,
        tasks,
        events,
        activities,
        now: new Date().toISOString(),
      });
      setProvider(response.provider);
      setSuggestion(response.suggestion);
      setPlanText(buildPlanText(response.suggestion));
      toast.success('Podpowiedź kolejnego ruchu gotowa');
    } catch (error: any) {
      toast.error(`Błąd podpowiedzi AI: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = planText.trim();
    if (!text) return toast.error('Nie ma planu do skopiowania');

    try {
      if (!navigator?.clipboard) throw new Error('NO_CLIPBOARD');
      await navigator.clipboard.writeText(text);
      toast.success('Plan skopiowany');
    } catch {
      toast.error('Nie udało się skopiować. Zaznacz tekst ręcznie.');
    }
  };

  const handleCreateSuggestedTask = async () => {
    if (!lead) return toast.error('Brak danych leada');
    if (!suggestion) return toast.error('Najpierw wygeneruj sugestię');

    const leadId = String(lead.id || '');
    if (!leadId) return toast.error('Brak ID leada');

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    const dueAt = suggestion.suggestedTask.dueAt || suggestion.dueAt || new Date().toISOString();
    const scheduledAt = Number.isFinite(new Date(dueAt).getTime()) ? dueAt : new Date().toISOString();

    try {
      setTaskSaving(true);
      await insertTaskToSupabase({
        title: suggestion.suggestedTask.title || suggestion.title || 'Follow-up z leadem',
        type: suggestion.suggestedTask.type || 'follow_up',
        date: scheduledAt.slice(0, 10),
        scheduledAt,
        priority: suggestion.suggestedTask.priority || suggestion.priority || 'medium',
        status: 'todo',
        leadId,
        workspaceId,
      });
      toast.success('Zadanie z sugestii AI utworzone');
      await onTaskCreated?.();
    } catch (error: any) {
      toast.error(`Błąd tworzenia zadania: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setTaskSaving(false);
    }
  };

  return (
    <Card className="border-emerald-100 bg-emerald-50/40 shadow-sm" data-ai-next-action-card="true">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            AI następny ruch
          </CardTitle>
          <p className="mt-1 text-sm text-slate-600">Podpowiedź kolejnego kroku dla leada: {leadTitle}. AI niczego nie tworzy bez Twojego kliknięcia.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="rounded-xl bg-white" disabled={disabled}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Podpowiedz ruch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Następny najlepszy ruch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" onClick={handleGenerate} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Analizuj leada
                </Button>
                <Badge variant="outline">Tylko sugestia</Badge>
                {provider ? <Badge variant="secondary">Parser: {provider}</Badge> : null}
              </div>

              {suggestion ? (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    <p className="mb-2 font-semibold text-slate-900">Kontekst użyty do sugestii:</p>
                    <ul className="space-y-1">
                      {suggestion.sourceSummary.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                  {suggestion.warnings.length ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      {suggestion.warnings.map((warning) => <p key={warning}>• {warning}</p>)}
                    </div>
                  ) : null}
                  <div className="rounded-xl border border-emerald-100 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Rekomendacja</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{suggestion.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{suggestion.summary}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">Termin: {formatDateTime(suggestion.dueAt)} · Priorytet: {suggestion.priority}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Plan do poprawy i skopiowania</Label>
                    <Textarea className="min-h-56" value={planText} onChange={(event) => setPlanText(event.target.value)} />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Kopiuj plan
                    </Button>
                    <Button type="button" onClick={handleCreateSuggestedTask} disabled={taskSaving}>
                      {taskSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      Utwórz zadanie
                    </Button>
                  </DialogFooter>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
}
