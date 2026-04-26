import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2, Mic, MicOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { auth } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { createQuickAiCaptureDraft, type QuickAiCaptureDraft } from '../lib/ai-capture';
import { insertLeadToSupabase, insertTaskToSupabase } from '../lib/supabase-fallback';
import { requireWorkspaceId } from '../lib/workspace-context';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Średni' },
  { value: 'high', label: 'Wysoki' },
];

const selectClassName = 'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getCreatedId(result: unknown) {
  const data = result as any;
  return String(
    data?.id
    || data?.lead?.id
    || data?.data?.id
    || data?.data?.[0]?.id
    || data?.[0]?.id
    || '',
  );
}

function normalizeDraft(input: QuickAiCaptureDraft): QuickAiCaptureDraft {
  return {
    ...input,
    lead: {
      name: input.lead?.name || '',
      company: input.lead?.company || '',
      email: input.lead?.email || '',
      phone: input.lead?.phone || '',
      source: input.lead?.source || 'other',
      dealValue: Number(input.lead?.dealValue || 0),
    },
    task: {
      enabled: Boolean(input.task?.enabled),
      title: input.task?.title || '',
      type: input.task?.type || 'follow_up',
      dueAt: input.task?.dueAt || '',
      priority: input.task?.priority || 'medium',
    },
    warnings: Array.isArray(input.warnings) ? input.warnings : [],
  };
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const browserWindow = window as any;
  return browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition || null;
}

function joinTranscript(previous: string, addition: string) {
  const base = previous.trim();
  const next = addition.trim();
  if (!next) return base;
  return base ? `${base} ${next}` : next;
}

type QuickAiCaptureProps = {
  onSaved?: () => void | Promise<void>;
  initialText?: string;
  openSignal?: number;
};

export default function QuickAiCapture({ onSaved, initialText = '', openSignal = 0 }: QuickAiCaptureProps) {
  const { workspace, hasAccess, workspaceReady } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [draft, setDraft] = useState<QuickAiCaptureDraft | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechSupported = typeof window !== 'undefined' && Boolean(getSpeechRecognitionConstructor());

  const stopSpeech = () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    setListening(false);
    setInterimText('');

    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort?.();
      } catch {
        // Browser speech engines may throw when already stopped.
      }
    }
  };

  useEffect(() => {
    if (!openSignal) return;
    const nextText = String(initialText || '').trim();
    if (!nextText) return;

    stopSpeech();
    setOpen(true);
    setRawText(nextText);
    setDraft(null);
    setDraftLoading(false);
    setSaving(false);
    setInterimText('');
  }, [openSignal, initialText]);

  const reset = () => {
    stopSpeech();
    setRawText('');
    setDraft(null);
    setDraftLoading(false);
    setSaving(false);
  };

  const appendVoiceText = (text: string) => {
    setRawText((current) => joinTranscript(current, text));
  };

  const handleToggleSpeech = () => {
    if (listening) {
      stopSpeech();
      return;
    }

    const RecognitionConstructor = getSpeechRecognitionConstructor();
    if (!RecognitionConstructor) {
      toast.error('Dyktowanie nie jest dostępne w tej przeglądarce. Możesz użyć mikrofonu z klawiatury telefonu.');
      return;
    }

    try {
      const recognition = new RecognitionConstructor();
      recognition.lang = 'pl-PL';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let index = event.resultIndex || 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const transcript = String(result?.[0]?.transcript || '').trim();
          if (!transcript) continue;
          if (result?.isFinal) {
            finalTranscript = joinTranscript(finalTranscript, transcript);
          } else {
            interimTranscript = joinTranscript(interimTranscript, transcript);
          }
        }

        if (finalTranscript) {
          appendVoiceText(finalTranscript);
        }
        setInterimText(interimTranscript);
      };
      recognition.onerror = () => {
        toast.error('Nie udało się dokończyć dyktowania. Sprawdź uprawnienia mikrofonu.');
        stopSpeech();
      };
      recognition.onend = () => {
        recognitionRef.current = null;
        setListening(false);
        setInterimText('');
      };
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
      toast.success('Dyktowanie włączone');
    } catch {
      toast.error('Nie udało się uruchomić dyktowania.');
      stopSpeech();
    }
  };

  const updateLeadDraft = (field: keyof QuickAiCaptureDraft['lead'], value: string | number) => {
    setDraft((prev) => prev ? { ...prev, lead: { ...prev.lead, [field]: value } } : prev);
  };

  const updateTaskDraft = (field: keyof QuickAiCaptureDraft['task'], value: string | boolean) => {
    setDraft((prev) => prev ? { ...prev, task: { ...prev.task, [field]: value } } : prev);
  };

  const handleBuildDraft = async () => {
    if (!rawText.trim()) {
      toast.error('Wklej albo podyktuj notatkę.');
      return;
    }

    try {
      setDraftLoading(true);
      const nextDraft = normalizeDraft(await createQuickAiCaptureDraft(rawText));
      setDraft(nextDraft);
      toast.success('Szkic gotowy do sprawdzenia');
    } catch (error: any) {
      toast.error('Błąd szkicu: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setDraftLoading(false);
    }
  };

  const handleSaveDraft = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || saving) return;
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      toast.error('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }

    if (!draft.lead.name.trim()) {
      toast.error('Uzupełnij nazwę leada przed zapisem.');
      return;
    }

    try {
      setSaving(true);
      const leadResult = await insertLeadToSupabase({
        name: draft.lead.name.trim(),
        company: draft.lead.company.trim(),
        email: draft.lead.email.trim(),
        phone: draft.lead.phone.trim(),
        source: draft.lead.source || 'other',
        dealValue: Number(draft.lead.dealValue || 0),
        nextActionAt: draft.task.enabled ? draft.task.dueAt : undefined,
        ownerId: auth.currentUser?.uid,
        workspaceId,
      });

      const leadId = getCreatedId(leadResult);

      if (draft.task.enabled && draft.task.title.trim() && draft.task.dueAt) {
        await insertTaskToSupabase({
          title: draft.task.title.trim(),
          type: draft.task.type || 'follow_up',
          date: draft.task.dueAt.slice(0, 10),
          scheduledAt: draft.task.dueAt,
          priority: draft.task.priority || 'medium',
          leadId: leadId || null,
          ownerId: auth.currentUser?.uid,
          workspaceId,
        });
      }

      await onSaved?.();
      toast.success(draft.task.enabled ? 'Lead i zadanie zapisane' : 'Lead zapisany');
      setOpen(false);
      reset();
    } catch (error: any) {
      toast.error('Błąd zapisu: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (!nextOpen) reset();
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="rounded-xl" disabled={!workspaceReady}>
          <Sparkles className="mr-2 h-4 w-4" /> Szybki szkic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Szybki szkic leada</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Wklej albo podyktuj notatkę po rozmowie. System przygotuje szkic, ale niczego nie zapisze bez Twojego potwierdzenia.
          </div>

          <div className="space-y-2">
            <Label>Notatka źródłowa</Label>
            <Textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="np. Jan Kowalski dzwonił w sprawie strony WWW, tel. 500 000 000, oddzwonić jutro rano, budżet około 3000 zł"
              className="min-h-32"
            />
            {interimText ? (
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">Rozpoznaję: {interimText}</p>
            ) : null}
            {draft?.rawText ? (
              <p className="text-xs text-slate-500">Tekst źródłowy zostaje widoczny do sprawdzenia przed zapisem.</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => void handleBuildDraft()} disabled={draftLoading || !rawText.trim()}>
              {draftLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Zrób szkic
            </Button>
            <Button type="button" variant="outline" onClick={handleToggleSpeech}>
              {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {listening ? 'Zatrzymaj dyktowanie' : 'Dyktuj'}
            </Button>
            {draft ? <Badge variant="outline">Tryb: szkic do potwierdzenia</Badge> : null}
            {draft ? <Badge variant="secondary">Parser: {draft.provider}</Badge> : null}
          </div>

          {!speechSupported ? (
            <p className="text-xs text-slate-500">Dyktowanie w przeglądarce może być niedostępne. Na telefonie możesz użyć mikrofonu z klawiatury systemowej.</p>
          ) : null}

          {draft ? (
            <form onSubmit={handleSaveDraft} className="space-y-5 border-t border-slate-100 pt-4">
              {draft.warnings.length ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  {draft.warnings.map((warning) => <p key={warning}>{warning}</p>)}
                </div>
              ) : null}

              <section className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Dane leada</h3>
                  <p className="text-sm text-slate-500">Popraw dane przed zapisem, jeśli parser czegoś nie wyłapał.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nazwa / osoba</Label>
                    <Input value={draft.lead.name} onChange={(event) => updateLeadDraft('name', event.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Firma</Label>
                    <Input value={draft.lead.company} onChange={(event) => updateLeadDraft('company', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input value={draft.lead.phone} onChange={(event) => updateLeadDraft('phone', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input type="email" value={draft.lead.email} onChange={(event) => updateLeadDraft('email', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Źródło</Label>
                    <select className={selectClassName} value={draft.lead.source} onChange={(event) => updateLeadDraft('source', event.target.value)}>
                      {SOURCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Wartość PLN</Label>
                    <Input type="number" value={draft.lead.dealValue || ''} onChange={(event) => updateLeadDraft('dealValue', Number(event.target.value || 0))} />
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
                <label className="flex items-start gap-3 text-sm font-semibold text-slate-900">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={draft.task.enabled}
                    onChange={(event) => updateTaskDraft('enabled', event.target.checked)}
                  />
                  Utwórz też zadanie follow-up
                </label>
                {draft.task.enabled ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tytuł zadania</Label>
                      <Input value={draft.task.title} onChange={(event) => updateTaskDraft('title', event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Termin</Label>
                      <Input type="datetime-local" value={draft.task.dueAt} onChange={(event) => updateTaskDraft('dueAt', event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Priorytet</Label>
                      <select className={selectClassName} value={draft.task.priority} onChange={(event) => updateTaskDraft('priority', event.target.value)}>
                        {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </div>
                  </div>
                ) : null}
              </section>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Anuluj</Button>
                <Button type="submit" disabled={saving || !hasAccess}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Zapisz po sprawdzeniu
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
