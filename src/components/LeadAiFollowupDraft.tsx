import { useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, Copy, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { createLeadFollowupDraft, type LeadFollowupDraft } from '../lib/ai-followup';

type LeadAiFollowupDraftProps = {
  lead: Record<string, unknown> | null;
  tasks?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
  activities?: Record<string, unknown>[];
  disabled?: boolean;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : value === null || value === undefined ? '' : String(value).trim();
}

function getLeadTitle(lead: Record<string, unknown> | null) {
  return asText(lead?.name || lead?.company || lead?.email || lead?.phone) || 'Lead';
}

export default function LeadAiFollowupDraft({ lead, tasks = [], events = [], activities = [], disabled = false }: LeadAiFollowupDraftProps) {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('Przypomnij się i zaproponuj następny krok');
  const [tone, setTone] = useState('Krótko, konkretnie i po ludzku');
  const [channel, setChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('');
  const [draft, setDraft] = useState<LeadFollowupDraft | null>(null);
  const [message, setMessage] = useState('');

  const leadTitle = useMemo(() => getLeadTitle(lead), [lead]);

  if (!lead) return null;

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    if (disabled) {
      toast.error('Ten lead nie przyjmuje już działań sprzedażowych.');
      return;
    }

    setLoading(true);
    try {
      const result = await createLeadFollowupDraft({
        lead,
        tasks,
        events,
        activities,
        goal,
        tone,
        channel,
      });
      setDraft(result.draft);
      setMessage(result.draft.message);
      setProvider(result.provider);
      toast.success('Szkic follow-upu gotowy');
    } catch (error: any) {
      toast.error(`Błąd szkicu AI: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = message.trim();
    if (!text) return toast.error('Nie ma treści do skopiowania');

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Szkic skopiowany');
    } catch {
      toast.error('Nie udało się skopiować. Zaznacz tekst ręcznie.');
    }
  };

  return (
    <Card className="border-blue-100 bg-blue-50/40 shadow-sm" data-ai-followup-draft-card="true">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" />
            AI follow-up
          </CardTitle>
          <p className="mt-1 text-sm text-slate-600">Szkic odpowiedzi dla leada: {leadTitle}. AI niczego nie wysyła automatycznie.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="rounded-xl bg-white" disabled={disabled}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Szkic odpowiedzi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Szkic follow-upu do sprawdzenia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGenerate} className="space-y-4 py-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cel wiadomości</Label>
                  <Input value={goal} onChange={(event) => setGoal(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ton</Label>
                  <Input value={tone} onChange={(event) => setTone(event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kanał opcjonalnie</Label>
                <Input placeholder="np. email, SMS, Messenger" value={channel} onChange={(event) => setChannel(event.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Wygeneruj szkic
                </Button>
                <Badge variant="outline">Szkic do potwierdzenia</Badge>
                {provider ? <Badge variant="secondary">Parser: {provider}</Badge> : null}
              </div>
            </form>

            {draft ? (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="mb-2 font-semibold text-slate-900">Kontekst użyty do szkicu:</p>
                  <ul className="space-y-1">
                    {draft.sourceSummary.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                {draft.warnings.length ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    {draft.warnings.map((warning) => <p key={warning}>• {warning}</p>)}
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label>Temat</Label>
                  <Input value={draft.subject} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Treść do poprawy i skopiowania</Label>
                  <Textarea className="min-h-56" value={message} onChange={(event) => setMessage(event.target.value)} />
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{draft.copyHint}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopiuj treść
                  </Button>
                </DialogFooter>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
}
