import { useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, Clock, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import QuickAiCapture from '../components/QuickAiCapture';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  archiveAiLeadDraft,
  deleteAiLeadDraft,
  getAiLeadDrafts,
  markAiLeadDraftConverted,
  type AiLeadDraft,
} from '../lib/ai-drafts';

function formatDraftDate(value: string) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return 'Brak daty';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sourceLabel(source: string) {
  if (source === 'today_assistant') return 'Asystent AI';
  if (source === 'quick_capture') return 'Szybki szkic';
  return 'Ręcznie';
}

export default function AiDrafts() {
  const [drafts, setDrafts] = useState<AiLeadDraft[]>([]);
  const [quickCaptureSeed, setQuickCaptureSeed] = useState('');
  const [quickCaptureOpenSignal, setQuickCaptureOpenSignal] = useState(0);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const reloadDrafts = () => setDrafts(getAiLeadDrafts());

  useEffect(() => {
    reloadDrafts();
  }, []);

  const openDraftInCapture = (draft: AiLeadDraft) => {
    setActiveDraftId(draft.id);
    setQuickCaptureSeed(draft.rawText);
    setQuickCaptureOpenSignal((current) => current + 1);
  };

  const handleCaptureSaved = async () => {
    if (activeDraftId) {
      markAiLeadDraftConverted(activeDraftId);
      setActiveDraftId(null);
      reloadDrafts();
      toast.success('Szkic oznaczony jako zatwierdzony');
      return;
    }
    reloadDrafts();
  };

  const handleArchive = (draft: AiLeadDraft) => {
    archiveAiLeadDraft(draft.id);
    reloadDrafts();
    toast.success('Szkic przeniesiony do archiwum');
  };

  const handleDelete = (draft: AiLeadDraft) => {
    deleteAiLeadDraft(draft.id);
    reloadDrafts();
    toast.success('Szkic usunięty');
  };

  const activeDrafts = useMemo(() => drafts.filter((draft) => draft.status === 'draft'), [drafts]);
  const convertedDrafts = useMemo(() => drafts.filter((draft) => draft.status === 'converted'), [drafts]);
  const archivedDrafts = useMemo(() => drafts.filter((draft) => draft.status === 'archived'), [drafts]);

  const renderDraftCard = (draft: AiLeadDraft) => (
    <Card key={draft.id} className="border-slate-200 shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={draft.status === 'draft' ? 'secondary' : 'outline'}>
                {draft.status === 'draft' ? 'Do sprawdzenia' : draft.status === 'converted' ? 'Zatwierdzony' : 'Archiwum'}
              </Badge>
              <Badge variant="outline">{sourceLabel(draft.source)}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {formatDraftDate(draft.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-800">{draft.rawText}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {draft.status === 'draft' ? (
            <Button type="button" size="sm" onClick={() => openDraftInCapture(draft)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Przejrzyj i zatwierdź
            </Button>
          ) : null}
          {draft.status === 'draft' ? (
            <Button type="button" size="sm" variant="outline" onClick={() => handleArchive(draft)}>
              <Archive className="mr-2 h-4 w-4" />
              Archiwizuj
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="outline" onClick={() => handleDelete(draft)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Usuń
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              AI inbox
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Szkice AI</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Tutaj trafiają podyktowane notatki i szkice leadów. Możesz zapisać je szybko w aucie, a dopiero później spokojnie sprawdzić pola i zatwierdzić jako lead.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            {activeDrafts.length} do sprawdzenia
          </div>
        </div>

        <QuickAiCapture
          initialText={quickCaptureSeed}
          openSignal={quickCaptureOpenSignal}
          onSaved={handleCaptureSaved}
          draftSource="manual"
        />

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Do sprawdzenia</h2>
          {activeDrafts.length ? activeDrafts.map(renderDraftCard) : (
            <Card className="border-dashed border-slate-200 bg-white/70">
              <CardContent className="p-6 text-sm text-slate-500">
                Brak szkiców do sprawdzenia. Gdy zapiszesz notatkę z Szybkiego szkicu albo Asystenta AI, pojawi się tutaj.
              </CardContent>
            </Card>
          )}
        </section>

        {convertedDrafts.length ? (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Zatwierdzone</h2>
            {convertedDrafts.slice(0, 8).map(renderDraftCard)}
          </section>
        ) : null}

        {archivedDrafts.length ? (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Archiwum</h2>
            {archivedDrafts.slice(0, 8).map(renderDraftCard)}
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
