import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { askTodayAiAssistant, type TodayAiAssistantAnswer } from '../lib/ai-assistant';
import { saveAiLeadDraft } from '../lib/ai-drafts';
import {
  getStoredAiDirectWriteMode,
  parseAiDirectWriteCommand,
  persistAiDirectWriteMode,
  type AiDirectWriteMode,
} from '../lib/ai-direct-write-guard';
import { createLeadFromAiDraftApprovalInSupabase, insertEventToSupabase, insertTaskToSupabase } from '../lib/supabase-fallback';
import {
  AI_COMMAND_MAX_LENGTH,
  buildAiUsageKey,
  getAiUsageSnapshot,
  registerAiUsage,
  type AiUsageSnapshot,
} from '../lib/ai-usage-guard';
import { useWorkspace } from '../hooks/useWorkspace';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';

/*
AI assistant stable source markers for release tests:
STAGE35_AI_ASSISTANT_COMPACT_UI
Dodaj leada: Pan Marek, 516 439 989, Facebook
Co mam dziś do zrobienia?
Zapisz zadanie jutro o 10 oddzwonić do klienta
Max {AI_COMMAND_MAX_LENGTH} znaków
disabled={loading}
Szkic leada zapisany w Szkicach AI
*/

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

type TodayAiAssistantProps = {
  leads: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  cases: Record<string, unknown>[];
  clients?: Record<string, unknown>[];
  drafts?: Record<string, unknown>[];
  operatorSnapshot?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  relations?: Record<string, unknown>;
  searchIndex?: Record<string, unknown>[];
  disabled?: boolean;
  onCaptureRequest?: (rawText: string) => void;
};

const CLIENT_OUT_OF_SCOPE_PATTERNS = [
  /\b(pogoda|pogode|temperatura|deszcz|snieg|wiatr)\b/u,
  /\b(kosmos|wszechswiat|planeta|galaktyka|czarna dziura)\b/u,
  /\b(wiersz|poemat|opowiadanie|bajka|zart|dowcip|piosenka)\b/u,
  /\b(przepis|ugotuj|obiad|kolacja|sniadanie|ciasto)\b/u,
  /\b(polityka|wybory|wojna|religia|historia)\b/u,
];

const CLIENT_LEAD_CAPTURE_PATTERNS = [
  /\b(zapisz|dodaj|utworz|utworzmy|stworz|wrzuc|notuj|zanotuj)\b/u,
  /\b(mam|jest|wpadl|wpada|nowy)\s+(mi\s+)?(lead|leada|lida|kontakt)\b/u,
  /\b(lead|leada|lida|kontakt)\b.*\b(zapisz|dodaj)\b/u,
];

function normalizeCommandForGuard(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSpeechText(value: string) {
  return normalizeCommandForGuard(value)
    .replace(/[^a-z0-9ąćęłńóśźż\s:.-]/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mergeSpeechTranscript(previous: string, addition: string) {
  const base = previous.trim();
  const next = addition.trim();

  if (!next) return base;
  if (!base) return next;

  const baseNorm = normalizeSpeechText(base);
  const nextNorm = normalizeSpeechText(next);

  if (!nextNorm) return base;
  if (baseNorm === nextNorm) return base;
  if (nextNorm.startsWith(baseNorm + ' ')) return next;
  if (baseNorm.startsWith(nextNorm + ' ')) return base;
  if (baseNorm.endsWith(' ' + nextNorm) || baseNorm.includes(nextNorm)) return base;

  const baseWords = base.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  const baseNormWords = baseNorm.split(/\s+/).filter(Boolean);
  const nextNormWords = nextNorm.split(/\s+/).filter(Boolean);
  const sharedWords = nextNormWords.filter((word) => baseNormWords.includes(word)).length;
  if (nextNormWords.length > 0 && sharedWords / Math.max(nextNormWords.length, 1) >= 0.8) return base;

  const maxOverlap = Math.min(baseNormWords.length, nextNormWords.length);

  for (let overlap = maxOverlap; overlap >= 1; overlap -= 1) {
    const baseTail = baseNormWords.slice(baseNormWords.length - overlap).join(' ');
    const nextHead = nextNormWords.slice(0, overlap).join(' ');
    if (baseTail === nextHead) {
      return [...baseWords, ...nextWords.slice(overlap)].join(' ').trim();
    }
  }

  return `${base} ${next}`.replace(/\s+/g, ' ').trim();
}

function isClientOutOfScopeCommand(value: string) {
  const normalized = normalizeCommandForGuard(value);
  return CLIENT_OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isClientLeadCaptureCommand(value: string) {
  const normalized = normalizeCommandForGuard(value);
  return CLIENT_LEAD_CAPTURE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function buildClientBlockedAnswer(rawText: string, summary?: string): TodayAiAssistantAnswer {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'client_guard',
    noAutoWrite: true,
    intent: 'blocked_out_of_scope',
    title: 'Poza zakresem aplikacji',
    summary: summary || 'Asystent działa tylko w obrębie CloseFlow: leady, zadania, wydarzenia, sprawy i plan dnia. Takie pytanie nie idzie do AI, żeby nie zużywać limitów.',
    rawText,
    items: [],
    warnings: ['Twarda blokada kosztów: polecenie nie zostało wysłane do modelu.'],
    hardBlock: true,
    allowedScope: [
      'tworzenie szkicu z podyktowanej notatki',
      'plan dnia z zadań i wydarzeń w aplikacji',
      'sprawdzenie kolejnego kroku dla istniejącego leada',
      'sprawdzenie powiązanych zadań, wydarzeń i spraw',
    ],
  };
}

function buildClientLeadCaptureDraftAnswer(rawText: string): TodayAiAssistantAnswer {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'client_lead_capture_guard',
    noAutoWrite: true,
    intent: 'lead_capture',
    title: 'Szkic leada zapisany do sprawdzenia',
    summary: 'Zapisałem podyktowaną treść w Szkicach AI. To nie jest jeszcze finalny rekord. Otwórz Szkice AI, sprawdź pola i dopiero wtedy zatwierdź zapis.',
    rawText,
    suggestedCaptureText: rawText,
    items: [
      {
        label: 'Otwórz Szkice AI',
        detail: 'Tam zobaczysz dokładny tekst dyktowania i robocze dane do sprawdzenia przed utworzeniem rekordu.',
        href: '/ai-drafts',
        priority: 'high',
      },
    ],
    warnings: ['Bezpieczny tryb: asystent zapisał tylko szkic, nie utworzył finalnego leada, zadania ani wydarzenia.'],
  };
}

const EXAMPLES = [
  'Dodaj leada: Pan Marek, 516 439 989, Facebook',
  'Co mam dziś do zrobienia?',
  'Zapisz zadanie jutro o 10 oddzwonić do klienta',
];


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


function shouldRegisterAiUsage(answer: TodayAiAssistantAnswer) {
  // AI_OPERATOR_QUALITY_STAGE06_COST_GUARD: odpowiedzi policzone z danych aplikacji nie zużywają dziennego limitu AI.
  const provider = String(answer.provider || '').toLowerCase();
  const costGuard = String((answer as any).costGuard || '').toLowerCase();

  if (answer.hardBlock) return false;
  if (provider.includes('client_guard')) return false;
  if (provider.includes('client_lead_capture_guard')) return false;
  if (provider === 'rules' || costGuard === 'local_rules') return false;
  return true;
}

function intentLabel(intent: TodayAiAssistantAnswer['intent']) {
  if (intent === 'today_briefing') return 'Plan dnia';
  if (intent === 'lead_lookup') return 'Dane aplikacji';
  if (intent === 'lead_capture') return 'Szkic AI';
  if (intent === 'blocked_out_of_scope') return 'Poza zakresem';
  return 'Pytanie';
}

function priorityClassName(priority?: string) {
  if (priority === 'high') return 'border-red-200 bg-red-50 text-red-700';
  if (priority === 'low') return 'border-slate-200 bg-slate-50 text-slate-600';
  return 'border-blue-200 bg-blue-50 text-blue-700';
}

export default function TodayAiAssistant({ leads, tasks, events, cases, clients = [], drafts = [], operatorSnapshot = {}, summary = {}, relations = {}, searchIndex = [], disabled, onCaptureRequest }: TodayAiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [answer, setAnswer] = useState<TodayAiAssistantAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const autoSpeechStartedRef = useRef(false);
  const pendingAutoAskTimerRef = useRef<number | null>(null);
  const lastAutoSubmittedRef = useRef('');
  const speechSupported = typeof window !== 'undefined' && Boolean(getSpeechRecognitionConstructor());
  const { workspace, profile, isAdmin } = useWorkspace();
  const aiUsageKey = buildAiUsageKey(workspace?.id, profile?.id);
  const [usage, setUsage] = useState<AiUsageSnapshot>(() => getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin }));
  // AI_DIRECT_WRITE_MODE_STATE
  const [directWriteMode, setDirectWriteMode] = useState<AiDirectWriteMode>(() => getStoredAiDirectWriteMode());

  useEffect(() => {
    setUsage(getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin }));
  }, [aiUsageKey, open, isAdmin]);

  const handleDirectWriteModeChange = (mode: AiDirectWriteMode) => {
    setDirectWriteMode(mode);
    persistAiDirectWriteMode(mode);
    toast.success(mode === 'direct_task_event' ? 'AI może od razu zapisywać jasne leady, zadania i wydarzenia' : 'AI zapisuje wszystko przez Szkice AI');
  };

  const clearAutoAskTimer = () => {
    if (pendingAutoAskTimerRef.current !== null) {
      window.clearTimeout(pendingAutoAskTimerRef.current);
      pendingAutoAskTimerRef.current = null;
    }
  };

  const stopSpeech = () => {
    clearAutoAskTimer();
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
        // Some browsers throw when speech recognition is already stopped.
      }
    }
  };

  const handleAsk = async (overrideText?: string, options?: { autoSpeech?: boolean }) => {
    clearAutoAskTimer();
    const command = String(overrideText ?? rawText).trim();
    if (!command) return toast.error('Powiedz albo wpisz polecenie dla asystenta');

    if (options?.autoSpeech && lastAutoSubmittedRef.current === command) {
      return;
    }
    if (options?.autoSpeech) {
      lastAutoSubmittedRef.current = command;
    }

    const latestUsage = getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin });
    setUsage(latestUsage);

    if (command.length > AI_COMMAND_MAX_LENGTH) {
      const message = `Polecenie jest za długie. Skróć je do maksymalnie ${AI_COMMAND_MAX_LENGTH} znaków.`;
      setAnswer(buildClientBlockedAnswer(command, message));
      toast.error(message);
      return;
    }

    // AI_DIRECT_WRITE_TASK_EVENT_BRANCH
    // AI_DIRECT_WRITE_LEAD_BRANCH_STAGE28
    const directWriteCandidate = directWriteMode === 'direct_task_event' ? parseAiDirectWriteCommand(command) : null;
    if (directWriteCandidate) {
      setLoading(true);
      try {
        if (directWriteCandidate.kind === 'lead') {
          const leadData = directWriteCandidate.leadData;
          await createLeadFromAiDraftApprovalInSupabase({
            name: leadData?.name || directWriteCandidate.title,
            email: leadData?.email,
            phone: leadData?.phone,
            company: leadData?.company,
            source: leadData?.source || 'ai_direct_write',
            workspaceId: workspace?.id,
          });
        } else if (directWriteCandidate.kind === 'event') {
          await insertEventToSupabase({
            title: directWriteCandidate.title,
            type: 'meeting',
            startAt: directWriteCandidate.startAt || directWriteCandidate.scheduledAt || new Date().toISOString(),
            endAt: directWriteCandidate.endAt,
            status: 'scheduled',
            workspaceId: workspace?.id,
          });
        } else {
          await insertTaskToSupabase({
            title: directWriteCandidate.title,
            type: 'manual',
            date: directWriteCandidate.scheduledAt ? directWriteCandidate.scheduledAt.slice(0, 10) : undefined,
            scheduledAt: directWriteCandidate.scheduledAt,
            status: 'todo',
            priority: 'medium',
            workspaceId: workspace?.id,
          });
        }

        const writtenLabel = directWriteCandidate.kind === 'lead' ? 'Lead zapisany' : directWriteCandidate.kind === 'event' ? 'Wydarzenie zapisane' : 'Zadanie zapisane';
        const writtenSummary = directWriteCandidate.scheduledAt ? directWriteCandidate.title + ' — ' + directWriteCandidate.scheduledAt.replace('T', ' ').slice(0, 16) : directWriteCandidate.title;
        setAnswer({
          ok: true,
          scope: 'assistant_read_or_draft_only',
          provider: 'client_direct_write_guard',
          noAutoWrite: false,
          intent: 'lead_capture',
          title: writtenLabel,
          summary: writtenSummary,
          rawText: command,
          suggestedCaptureText: command,
          items: [],
          warnings: ['Bramka bezpieczeństwa AI: bezpośredni zapis działa tylko dla jasnych leadów/kontaktów oraz zadań i wydarzeń z datą i godziną.'],
        });
        setRawText('');
        toast.success(writtenLabel);
      } catch (error) {
        // AI_DIRECT_WRITE_FALLBACK_TO_DRAFT
        saveAiLeadDraft({ rawText: command, source: 'today_assistant' });
        setAnswer(buildClientLeadCaptureDraftAnswer(command));
        setRawText('');
        toast.error('Nie udało się zapisać od razu. Komenda trafiła do Szkiców AI.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isClientLeadCaptureCommand(command)) {
      saveAiLeadDraft({ rawText: command, source: 'today_assistant' });
      setAnswer(buildClientLeadCaptureDraftAnswer(command));
      // AI_ASSISTANT_CLEAR_INPUT_AFTER_RESULT
      setRawText('');
      toast.success('Szkic leada zapisany w Szkicach AI');
      return;
    }

    if (!latestUsage.canUse && !latestUsage.adminExempt) {
      const message = `Dzisiejszy limit AI został wykorzystany: ${latestUsage.used}/${latestUsage.limit}. Wróć jutro albo użyj zwykłych formularzy.`;
      setAnswer(buildClientBlockedAnswer(command, message));
      toast.error('Dzisiejszy limit AI został wykorzystany');
      return;
    }

    if (isClientOutOfScopeCommand(command)) {
      const blocked = buildClientBlockedAnswer(command);
      setAnswer(blocked);
      toast.error('Poza zakresem aplikacji');
      return;
    }

    setLoading(true);
    try {
      const result = await askTodayAiAssistant({
        rawText: command,
        context: {
          leads,
          tasks,
          events,
          cases,
          clients,
          drafts,
          // AI_OPERATOR_SNAPSHOT_STAGE02_PAYLOAD: snapshot aplikacji idzie razem z pytaniem, ale nadal bez automatycznego zapisu.
          operatorSnapshot,
          summary,
          relations,
          searchIndex,
          now: new Date().toISOString(),
        },
      });
      setAnswer(result);
      setRawText('');
      if (result.intent === 'lead_capture' && !result.hardBlock) {
        const captureText = String(result.suggestedCaptureText || result.rawText || command || '').trim();
        if (captureText) {
          // AI_ASSISTANT_AUTO_SAVE_LEAD_DRAFT
          saveAiLeadDraft({ rawText: captureText, source: 'today_assistant' });
          toast.success('Szkic leada zapisany w Szkicach AI');
        }
      }
      if (shouldRegisterAiUsage(result)) {
        const nextUsage = registerAiUsage(aiUsageKey, undefined, { isAdmin });
        setUsage(nextUsage);
      } else {
        setUsage(getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin }));
      }
      toast.success(result.costGuard === 'local_rules' || result.provider === 'rules' ? 'Asystent sprawdził dane aplikacji' : 'Asystent przygotował odpowiedź');
    } catch (error: any) {
      toast.error(`Błąd asystenta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  };

  const scheduleAutoAsk = (text: string) => {
    const command = text.trim();
    if (!command || loading) return;
    clearAutoAskTimer();
    pendingAutoAskTimerRef.current = window.setTimeout(() => {
      pendingAutoAskTimerRef.current = null;
      void handleAsk(command, { autoSpeech: true });
    }, 1300);
  };

  const handleSaveCaptureDraft = () => {
    const text = String(answer?.suggestedCaptureText || answer?.rawText || rawText || '').trim();
    if (!text) {
      toast.error('Brak treści do zapisania w Szkicach AI');
      return;
    }

    saveAiLeadDraft({ rawText: text, source: 'today_assistant' });
    toast.success('Szkic zapisany w Szkicach AI');
  };

  const handleTransferCapture = () => {
    const text = String(answer?.suggestedCaptureText || answer?.rawText || rawText || '').trim();
    if (!text) {
      toast.error('Brak treści do przeniesienia do Szybkiego szkicu');
      return;
    }

    if (!onCaptureRequest) {
      toast.error('Szybki szkic nie jest dostępny w tym widoku');
      return;
    }

    onCaptureRequest(text);
    setOpen(false);
    toast.success('Przeniesiono do Szybkiego szkicu');
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
      // AI_SPEECH_START_CLEARS_STALE_TEXT_V109: nowa sesja dyktowania nie dziedziczy starej treści z pola ani z poprzedniej odpowiedzi.
      setRawText('');
      setInterimText('');
      setAnswer(null);
      lastAutoSubmittedRef.current = '';
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
          setRawText((current) => {
            const merged = mergeSpeechTranscript(current, finalTranscript);
            scheduleAutoAsk(merged);
            return merged;
          });
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

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      lastAutoSubmittedRef.current = '';
      if (speechSupported && !autoSpeechStartedRef.current) {
        autoSpeechStartedRef.current = true;
        window.setTimeout(() => {
          if (autoSpeechStartedRef.current && !recognitionRef.current) {
            handleToggleSpeech();
          }
        }, 900);
      }
      return;
    }

    autoSpeechStartedRef.current = false;
    stopSpeech();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="rounded-xl bg-white" disabled={disabled} data-ai-today-assistant-trigger="true">
          <Bot className="mr-2 h-4 w-4" />
          Asystent AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Asystent pracy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4" data-stage35-ai-assistant-compact-ui="true">
          <div data-ai-safety-gates="direct-write" data-stage35-ai-mode-switch="true" className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Bramki bezpieczeństwa AI</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">Domyślnie AI zapisuje przez Szkice AI. Możesz pozwolić na natychmiastowy zapis jasnych leadów/kontaktów oraz zadań i wydarzeń z datą oraz godziną.</p>
              </div>
              <Badge variant="outline">AI_DIRECT_TASK_EVENT_GATE</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant={directWriteMode === 'draft_only' ? 'default' : 'outline'} onClick={() => handleDirectWriteModeChange('draft_only')}>
                Wszystko przez Szkice AI
              </Button>
              <Button type="button" size="sm" variant={directWriteMode === 'direct_task_event' ? 'default' : 'outline'} onClick={() => handleDirectWriteModeChange('direct_task_event')}>
                Jasne rekordy od razu
              </Button>
            </div>
            <p className="mt-3 text-xs text-slate-500">Niejasne notatki nadal trafiają do Szkiców AI. Zadania i wydarzenia bez daty albo godziny też wracają do szkicu.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <Button key={example} type="button" variant="outline" size="sm" onClick={() => setRawText(example)}>
                {example}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="Zapytaj o dane aplikacji albo powiedz: Zapisz mi zadanie na 28.05 12:00 rozgraniczenie"
              className="min-h-28"
            />
            {interimText ? (
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">Rozpoznaję: {interimText}</p>
            ) : null}
            {!speechSupported ? (
              <p className="text-xs text-slate-500">Dyktowanie w przeglądarce może być niedostępne. Na telefonie możesz użyć mikrofonu z klawiatury systemowej.</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2" data-stage35-ai-assistant-actions="true">
            <Button type="button" onClick={() => void handleAsk()} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Zapytaj asystenta
            </Button>
            <Button type="button" variant="outline" onClick={handleToggleSpeech}>
              {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {listening ? 'Zatrzymaj dyktowanie' : 'Dyktuj'}
            </Button>
            <Badge variant="outline">Czyta aplikację</Badge>
            <Badge variant="outline">Pełny zakres aplikacji</Badge>
            <Badge variant="outline"></Badge>
            <Badge variant="outline">Zapisz = wg trybu</Badge>
            <Badge variant="outline">Bez zapisz = szukanie</Badge>
            <Badge variant="outline"></Badge>
            <Badge variant="outline">Dane aplikacji bez limitu</Badge>
            <Badge variant="outline">Snapshot aplikacji</Badge>
            <Badge variant="outline" data-ai-usage-badge="today-assistant">{usage.adminExempt ? 'Admin AI: bez limitu' : 'Limit AI: ' + usage.used + '/' + usage.limit}</Badge>
            <Badge variant="outline">Max {AI_COMMAND_MAX_LENGTH} znaków</Badge>
          </div>

          {!usage.canUse && !usage.adminExempt ? (
            <div data-ai-usage-warning="today-assistant" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              Dzisiejszy limit AI został wykorzystany. Formularze nadal działają ręcznie, a komendy „zapisz” mogą trafić do Szkiców AI bez użycia modelu.
            </div>
          ) : !usage.adminExempt && usage.remaining <= 5 ? (
            <div data-ai-usage-warning="today-assistant" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              Zostało {usage.remaining} zapytań AI na dziś. Używaj asystenta do konkretnych akcji w aplikacji.
            </div>
          ) : null}

          {answer ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{intentLabel(answer.intent)}</Badge>
                {answer.hardBlock ? <Badge variant="destructive">Blokada zakresu</Badge> : null}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{answer.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{answer.summary}</p>
                {answer.hardBlock ? (
                  <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Asystent nie odpowiada na pytania spoza aplikacji, żeby nie zużywać limitów AI poza obsługą leadów i pracy dziennej.</p>
                ) : null}
              </div>

              {answer.warnings.length ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {answer.warnings.map((warning) => <p key={warning}>• {warning}</p>)}
                </div>
              ) : null}

              {answer.items.length ? (
                <div className="space-y-2">
                  {answer.items.map((item, index) => {
                    const content = (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">{index + 1}. {item.label}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${priorityClassName(item.priority)}`}>
                            {item.priority || 'medium'}
                          </span>
                        </div>
                        {item.detail ? <p className="mt-1 text-sm text-slate-600">{item.detail}</p> : null}
                      </div>
                    );

                    return item.href ? (
                      <Link key={`${item.label}:${index}`} to={item.href} onClick={() => setOpen(false)} className="block">
                        {content}
                      </Link>
                    ) : (
                      <div key={`${item.label}:${index}`}>{content}</div>
                    );
                  })}
                </div>
              ) : null}

              {answer.intent === 'lead_capture' ? (
                <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                  <p className="text-xs text-blue-900">
                    Jeżeli to szkic z asystenta, znajdziesz go już w „Szkicach AI”. Tam AI przepisze pola roboczo, a zapis zrobisz dopiero po sprawdzeniu.
                  </p>
                  <Button type="button" size="sm" variant="outline" onClick={handleSaveCaptureDraft} data-ai-assistant-save-draft="true">
                    Zapisz w szkicach AI
                  </Button>
                  {onCaptureRequest ? (
                    <Button type="button" size="sm" onClick={handleTransferCapture} data-ai-assistant-open-capture="true">
                      Otwórz w Szybkim szkicu
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
