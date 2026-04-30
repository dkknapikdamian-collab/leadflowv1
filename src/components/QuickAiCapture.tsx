import { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { useWorkspace } from '../hooks/useWorkspace';
import { createQuickAiCaptureDraft, type QuickAiCaptureDraft } from '../lib/ai-capture';
import { saveAiLeadDraft, type AiLeadDraftSource } from '../lib/ai-drafts';
import {
  AI_COMMAND_MAX_LENGTH,
  buildAiUsageKey,
  getAiUsageSnapshot,
  registerAiUsage,
  type AiUsageSnapshot,
} from '../lib/ai-usage-guard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

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
  draftSource?: AiLeadDraftSource;
};

export default function QuickAiCapture({ initialText = '', openSignal = 0, draftSource = 'quick_capture' }: QuickAiCaptureProps) {
  const { workspace, profile, workspaceReady, isAdmin } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [draft, setDraft] = useState<QuickAiCaptureDraft | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const autoSpeechStartedRef = useRef(false);
  const speechSupported = typeof window !== 'undefined' && Boolean(getSpeechRecognitionConstructor());
  const aiUsageKey = buildAiUsageKey(workspace?.id, profile?.id);
  const [usage, setUsage] = useState<AiUsageSnapshot>(() => getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin }));

  useEffect(() => {
    setUsage(getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin }));
  }, [aiUsageKey, open, isAdmin]);

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
        // ignore
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
      toast.error('Dyktowanie nie jest dostępne w tej przeglądarce.');
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
          if (result?.isFinal) finalTranscript = joinTranscript(finalTranscript, transcript);
          else interimTranscript = joinTranscript(interimTranscript, transcript);
        }

        if (finalTranscript) appendVoiceText(finalTranscript);
        setInterimText(interimTranscript);
      };
      recognition.onerror = () => {
        toast.error('Nie udało się dokończyć dyktowania.');
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

  const handleSaveRawDraft = () => {
    const text = rawText.trim();
    if (!text) {
      toast.error('Wklej albo podyktuj notatkę przed zapisem szkicu.');
      return;
    }

    saveAiLeadDraft({
      rawText: text,
      parsedDraft: draft ? (draft as unknown as Record<string, unknown>) : null,
      source: draftSource,
    });
    toast.success('Szkic zapisany w Szkicach AI');
    setOpen(false);
    reset();
  };

  const handleBuildDraft = async () => {
    if (!rawText.trim()) {
      toast.error('Wklej albo podyktuj notatkę.');
      return;
    }

    const command = rawText.trim();
    const latestUsage = getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin });
    setUsage(latestUsage);

    if (command.length > AI_COMMAND_MAX_LENGTH) {
      toast.error(`Notatka jest za długa. Skróć ją do ${AI_COMMAND_MAX_LENGTH} znaków.`);
      return;
    }

    if (!latestUsage.canUse && !latestUsage.adminExempt) {
      toast.error('Dzisiejszy limit AI został wykorzystany.');
      return;
    }

    try {
      setDraftLoading(true);
      const nextDraft = normalizeDraft(await createQuickAiCaptureDraft(rawText));
      setDraft(nextDraft);
      const nextUsage = registerAiUsage(aiUsageKey, undefined, { isAdmin });
      setUsage(nextUsage);
      toast.success('Szkic gotowy do sprawdzenia');
    } catch (error: any) {
      toast.error('Błąd szkicu: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setDraftLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          if (speechSupported && !autoSpeechStartedRef.current) {
            autoSpeechStartedRef.current = true;
            window.setTimeout(() => {
              if (autoSpeechStartedRef.current && !recognitionRef.current) handleToggleSpeech();
            }, 900);
          }
          return;
        }

        autoSpeechStartedRef.current = false;
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="rounded-xl" disabled={!workspaceReady}>
          <Sparkles className="mr-2 h-4 w-4" /> Szybki szkic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Szybki szkic</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Wklej albo podyktuj notatkę. AI przygotuje szkic do sprawdzenia i zapisze go w Szkicach AI — bez automatycznego tworzenia leada, zadania ani wydarzenia.
          </div>

          <div className="space-y-2">
            <Label>Notatka źródłowa</Label>
            <Textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="np. Jan Kowalski dzwonił w sprawie strony WWW, tel. 500 000 000"
              className="min-h-32"
            />
            {interimText ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">Rozpoznaję: {interimText}</p> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => void handleBuildDraft()} disabled={draftLoading || !rawText.trim() || (!usage.canUse && !usage.adminExempt)}>
              {draftLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Zrób szkic
            </Button>
            <Button type="button" variant="outline" onClick={handleSaveRawDraft} disabled={!rawText.trim() || saving}>
              Zapisz szkic
            </Button>
            <Button type="button" variant="outline" onClick={handleToggleSpeech}>
              {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {listening ? 'Zatrzymaj dyktowanie' : 'Dyktuj'}
            </Button>
            {draft ? <Badge variant="outline">Tryb: szkic do potwierdzenia</Badge> : null}
            {draft ? <Badge variant="secondary">Parser: {draft.provider}</Badge> : null}
            <Badge variant="outline" data-ai-usage-badge="quick-capture">{usage.adminExempt ? 'Admin AI: bez limitu' : `Limit AI: ${usage.used}/${usage.limit}`}</Badge>
          </div>

          {!speechSupported ? <p className="text-xs text-slate-500">Dyktowanie może być niedostępne w tej przeglądarce.</p> : null}

          {draft ? (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              {draft.warnings.length ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  {draft.warnings.map((warning) => <p key={warning}>{warning}</p>)}
                </div>
              ) : null}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                Szkic jest gotowy. Zapisz go do Szkiców AI i tam zdecyduj, czy ma zostać leadem, zadaniem, wydarzeniem, notatką albo pozostać szkicem.
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleSaveRawDraft} disabled={saving}>
                  Zapisz szkic do AI Drafts
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

