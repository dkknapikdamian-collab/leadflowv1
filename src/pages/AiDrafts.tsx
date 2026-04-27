import { useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, Clock, Clipboard, Pencil, Search, Sparkles, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  archiveAiLeadDraft,
  deleteAiLeadDraft,
  getAiLeadDrafts,
  markAiLeadDraftConverted,
  updateAiLeadDraft,
  type AiLeadDraft,
  type AiLeadDraftStatus,
} from '../lib/ai-drafts';

type DraftTab = AiLeadDraftStatus | 'all';

const DRAFT_TABS: { key: DraftTab; label: string; helper: string }[] = [
  { key: 'draft', label: 'Do sprawdzenia', helper: 'Notatki, z których jeszcze nie powstał lead.' },
  { key: 'converted', label: 'Zatwierdzone', helper: 'Szkice już przerobione na leady.' },
  { key: 'archived', label: 'Archiwum', helper: 'Odłożone notatki bez kasowania historii.' },
  { key: 'all', label: 'Wszystkie', helper: 'Pełna historia szkiców AI.' },
];

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

function statusLabel(status: AiLeadDraftStatus) {
  if (status === 'converted') return 'Zatwierdzony';
  if (status === 'archived') return 'Archiwum';
  return 'Do sprawdzenia';
}

function statusBadgeClassName(status: AiLeadDraftStatus) {
  if (status === 'converted') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'archived') return 'border-slate-200 bg-slate-50 text-slate-600';
  return 'border-blue-200 bg-blue-50 text-blue-700';
}

function matchesDraftSearch(draft: AiLeadDraft, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [draft.rawText, sourceLabel(draft.source), statusLabel(draft.status)]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

export default function AiDrafts() {
  const [drafts, setDrafts] = useState<AiLeadDraft[]>([]);
  const [quickCaptureSeed, setQuickCaptureSeed] = useState('');
  const [quickCaptureOpenSignal, setQuickCaptureOpenSignal] = useState(0);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DraftTab>('draft');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const reloadDrafts = () => setDrafts(getAiLeadDrafts());

  useEffect(() => {
    reloadDrafts();
  }, []);

  const stats = useMemo(() => {
    const draft = drafts.filter((entry) => entry.status === 'draft').length;
    const converted = drafts.filter((entry) => entry.status === 'converted').length;
    const archived = drafts.filter((entry) => entry.status === 'archived').length;
    return { draft, converted, archived, total: drafts.length };
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => {
      const tabMatch = activeTab === 'all' || draft.status === activeTab;
      return tabMatch && matchesDraftSearch(draft, searchQuery);
    });
  }, [activeTab, drafts, searchQuery]);

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
    const confirmed = window.confirm('Usunąć szkic AI? Tej operacji nie będzie można cofnąć.');
    if (!confirmed) return;

    deleteAiLeadDraft(draft.id);
    reloadDrafts();
    toast.success('Szkic usunięty');
  };

  const handleStartEdit = (draft: AiLeadDraft) => {
    setEditingDraftId(draft.id);
    setEditingText(draft.rawText);
  };

  const handleCancelEdit = () => {
    setEditingDraftId(null);
    setEditingText('');
  };

  const handleSaveEdit = (draft: AiLeadDraft) => {
    const nextText = editingText.trim();
    if (!nextText) {
      toast.error('Szkic nie może być pusty');
      return;
    }

    updateAiLeadDraft(draft.id, { rawText: nextText });
    handleCancelEdit();
    reloadDrafts();
    toast.success('Szkic zaktualizowany');
  };

  const handleCopyDraftText = async (draft: AiLeadDraft) => {
    try {
      if (!navigator?.clipboard) throw new Error('NO_CLIPBOARD');
      await navigator.clipboard.writeText(draft.rawText);
      toast.success('Treść szkicu skopiowana');
    } catch {
      toast.error('Nie udało się skopiować treści. Zaznacz ją ręcznie.');
    }
  };

  const renderDraftCard = (draft: AiLeadDraft) => {
    const editing = editingDraftId === draft.id;

    return (
      <Card key={draft.id} className="border-slate-200 shadow-sm" data-ai-draft-card="true">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClassName(draft.status)}`}>
                  {statusLabel(draft.status)}
                </span>
                <Badge variant="outline">{sourceLabel(draft.source)}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDraftDate(draft.createdAt)}
                </span>
              </div>

              {editing ? (
                <div className="space-y-2" data-ai-draft-edit-box="true">
                  <Textarea
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    className="min-h-32"
                    placeholder="Popraw treść podyktowanej notatki przed zatwierdzeniem."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={() => handleSaveEdit(draft)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Zapisz zmiany
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={handleCancelEdit}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Anuluj
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm text-slate-800">{draft.rawText}</p>
              )}
            </div>
          </div>

          {!editing ? (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              {draft.status === 'draft' ? (
                <Button type="button" size="sm" onClick={() => openDraftInCapture(draft)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Przejrzyj i zatwierdź
                </Button>
              ) : null}
              {draft.status === 'draft' ? (
                <Button type="button" size="sm" variant="outline" onClick={() => handleStartEdit(draft)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edytuj notatkę
                </Button>
              ) : null}
              <Button type="button" size="sm" variant="outline" onClick={() => handleCopyDraftText(draft)}>
                <Clipboard className="mr-2 h-4 w-4" />
                Kopiuj treść
              </Button>
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
          ) : null}
        </CardContent>
      </Card>
    );
  };

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
              Notatka głosowa najpierw trafia tutaj. Lead powstaje dopiero po kliknięciu „Przejrzyj i zatwierdź”, sprawdzeniu pól i ręcznym zapisie.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            {stats.draft} do sprawdzenia
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4" data-ai-draft-stats="true">
          <Card className="border-blue-100 bg-blue-50/70">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Do sprawdzenia</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.draft}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Zatwierdzone</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.converted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Archiwum</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.archived}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Łącznie</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            </CardContent>
          </Card>
        </div>
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm" data-ai-draft-command-center="true">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Centrum szkiców</h2>
              <p className="text-sm text-slate-500">Najpierw szkic, potem decyzja. Nic z tej listy nie staje się leadem bez ręcznego zatwierdzenia.</p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
                placeholder="Szukaj w podyktowanych notatkach..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2" data-ai-drafts-tab="true">
            {DRAFT_TABS.map((tab) => {
              const active = activeTab === tab.key;
              const count = tab.key === 'all' ? stats.total : stats[tab.key];
              return (
                <Button
                  key={tab.key}
                  type="button"
                  variant={active ? 'default' : 'outline'}
                  className="rounded-xl"
                  onClick={() => setActiveTab(tab.key)}
                  title={tab.helper}
                >
                  {tab.label} ({count})
                </Button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filteredDrafts.length ? filteredDrafts.map(renderDraftCard) : (
              <Card className="border-dashed border-slate-200 bg-white/70">
                <CardContent className="p-6 text-sm text-slate-500">
                  Brak szkiców w tym widoku. Gdy zapiszesz notatkę z Szybkiego szkicu albo Asystenta AI, pojawi się tutaj.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
