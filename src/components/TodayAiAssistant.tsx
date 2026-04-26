import { useRef, useState } from 'react';
import { Bot, Loader2, Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { askTodayAiAssistant, type TodayAiAssistantAnswer } from '../lib/ai-assistant';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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

type TodayAiAssistantProps = {
  leads: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  cases: Record<string, unknown>[];
  disabled?: boolean;
};

const EXAMPLES = [
  'Co mam dzisiaj zrobić?',
  'Co dalej z tym leadem?',
  'Mam leada Warszawa zainteresowany sprzedażą działki, zapisz to',
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

function intentLabel(intent: TodayAiAssistantAnswer['intent']) {
  if (intent === 'today_briefing') return 'Plan dnia';
  if (intent === 'lead_lookup') return 'Lead';
  if (intent === 'lead_capture') return 'Szkic leada';
  if (intent === 'blocked_out_of_scope') return 'Poza zakresem';
  return 'Pytanie';
}

function priorityClassName(priority?: string) {
  if (priority === 'high') return 'border-red-200 bg-red-50 text-red-700';
  if (priority === 'low') return 'border-slate-200 bg-slate-50 text-slate-600';
  return 'border-blue-200 bg-blue-50 text-blue-700';
}

export default function TodayAiAssistant({ leads, tasks, events, cases, disabled }: TodayAiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [answer, setAnswer] = useState<TodayAiAssistantAnswer | null>(null);
  const [loading, setLoading] = useState(false);
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
        // Some browsers throw when speech recognition is already stopped.
      }
    }
  };

  const handleAsk = async () => {
    const command = rawText.trim();
    if (!command) return toast.error('Powiedz albo wpisz polecenie dla asystenta');

    setLoading(true);
    try {
      const result = await askTodayAiAssistant({
        rawText: command,
        context: {
          leads,
          tasks,
          events,
          cases,
          now: new Date().toISOString(),
        },
      });
      setAnswer(result);
      toast.success('Asystent przygotował odpowiedź');
    } catch (error: any) {
      toast.error(`Błąd asystenta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
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
          setRawText((current) => joinTranscript(current, finalTranscript));
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
    if (!nextOpen) stopSpeech();
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

        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
            Powiedz normalnie, czego potrzebujesz w aplikacji. Przykład: „co mam dzisiaj zrobić”, „co dalej z Janem Kowalskim” albo „mam leada, zapisz...”. Asystent działa tylko w obrębie CloseFlow i niczego nie zapisuje bez Twojej akceptacji.
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
              placeholder="np. Co mam dzisiaj zrobić? / Co dalej z Janem? / Mam leada Warszawa, zainteresowany działką..."
              className="min-h-28"
            />
            {interimText ? (
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">Rozpoznaję: {interimText}</p>
            ) : null}
            {!speechSupported ? (
              <p className="text-xs text-slate-500">Dyktowanie w przeglądarce może być niedostępne. Na telefonie możesz użyć mikrofonu z klawiatury systemowej.</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={handleAsk} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Zapytaj asystenta
            </Button>
            <Button type="button" variant="outline" onClick={handleToggleSpeech}>
              {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {listening ? 'Zatrzymaj dyktowanie' : 'Dyktuj'}
            </Button>
            <Badge variant="outline">Bez autopilota</Badge>
            <Badge variant="outline">Tylko CloseFlow</Badge>
          </div>

          {answer ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{intentLabel(answer.intent)}</Badge>
                <Badge variant="outline">Parser: {answer.provider}</Badge>
                {answer.noAutoWrite ? <Badge variant="outline">Bez zapisu automatycznego</Badge> : null}
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
                <p className="text-xs text-slate-500">
                  Żeby zapisać tego leada, użyj przycisku „Szybki szkic”. Tam AI przepisze pola roboczo, a zapis zrobisz dopiero po sprawdzeniu.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
