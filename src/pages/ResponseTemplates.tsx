import {
  AiEntityIcon } from '../components/ui-system';
import {
  useEffect,
  useMemo,
  useState } from 'react';
import { Archive,
  Copy,
  MessageSquareText,
  Plus,
  Save,
  Search,
  ShieldAlert,
  Tags
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useWorkspace } from '../hooks/useWorkspace';
import {
// CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_RESPONSE_TEMPLATES
  createResponseTemplateInSupabase,
  deleteResponseTemplateFromSupabase,
  fetchResponseTemplatesFromSupabase,
  updateResponseTemplateInSupabase,
} from '../lib/supabase-fallback';

import '../styles/closeflow-page-header-card-source-truth.css';
import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';
type ResponseTemplate = {
  id: string;
  name: string;
  category?: string;
  tags?: string[];
  body: string;
  variables?: string[];
  archivedAt?: string | null;
};

function toList(value: string) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function countTags(rows: ResponseTemplate[]) {
  const unique = new Set<string>();
  rows.forEach((row) => (row.tags || []).forEach((tag) => unique.add(tag.toLowerCase())));
  return unique.size;
}

async function copyToClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  throw new Error('CLIPBOARD_UNAVAILABLE');
}

export default function ResponseTemplates() {
  const { hasAccess } = useWorkspace();
  const [rows, setRows] = useState<ResponseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [variables, setVariables] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchResponseTemplatesFromSupabase({ includeArchived: false });
      setRows((Array.isArray(data) ? data : []) as ResponseTemplate[]);
    } catch (error: any) {
      toast.error(`Nie udało się pobrać szablonów odpowiedzi: ${error?.message || 'REQUEST_FAILED'}`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => `${row.name} ${row.category || ''} ${(row.tags || []).join(' ')} ${(row.variables || []).join(' ')} ${row.body}`.toLowerCase().includes(q));
  }, [rows, query]);

  const selectedTemplate = filtered[0] || rows[0] || null;

  const stats = useMemo(() => ({
    total: rows.length,
    categories: new Set(rows.map((row) => row.category || 'Ogólne')).size,
    tags: countTags(rows),
    withVariables: rows.filter((row) => (row.variables || []).length > 0).length,
  }), [rows]);

  const openCreate = () => {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }
    setEditingId(null);
    setName('');
    setCategory('');
    setTags('');
    setBody('');
    setVariables('');
    setOpen(true);
  };

  const openEdit = (item: ResponseTemplate) => {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }
    setEditingId(item.id);
    setName(item.name || '');
    setCategory(item.category || '');
    setTags((item.tags || []).join(', '));
    setBody(item.body || '');
    setVariables((item.variables || []).join(', '));
    setOpen(true);
  };

  const save = async () => {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }
    if (!name.trim() || !body.trim()) {
      toast.error('Nazwa i treść są wymagane.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category: category.trim(),
        tags: toList(tags),
        body: body.trim(),
        variables: toList(variables),
      };
      if (editingId) {
        await updateResponseTemplateInSupabase({ id: editingId, ...payload });
      } else {
        await createResponseTemplateInSupabase(payload);
      }
      toast.success('Zapisano szablon odpowiedzi.');
      setOpen(false);
      await load();
    } catch (error: any) {
      toast.error(`Nie udało się zapisać: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }
    try {
      await deleteResponseTemplateFromSupabase(id);
      toast.success('Zarchiwizowano szablon.');
      await load();
    } catch (error: any) {
      toast.error(`Nie udało się zarchiwizować: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleCopy = async (item: ResponseTemplate) => {
    try {
      await copyToClipboard(item.body || '');
      toast.success('Skopiowano treść szablonu.');
    } catch {
      toast.error('Nie udało się skopiować treści w tej przeglądarce.');
    }
  };

  return (
    <Layout>
      <div className="cf-html-view mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8" data-a13-template-style="response-templates-v2">
        <header data-cf-page-header="true" className="cf-page-header flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div data-cf-page-header-part="kicker" className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">{PAGE_HEADER_CONTENT.responseTemplates.kicker}</div>
            <div>
              <h1 data-cf-page-header-part="title" className="text-3xl font-bold app-text">{PAGE_HEADER_CONTENT.responseTemplates.title}</h1>
              <p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.responseTemplates.description}</p>
              <p className="mt-2 max-w-2xl text-sm md:text-base app-muted">
                Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. AI może później pracować na tych szablonach, ale źródłem prawdy jest Twoja biblioteka.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {!hasAccess ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <ShieldAlert className="h-4 w-4" /> Tryb podglądu blokuje zapis
              </div>
            ) : null}
            <Button className="rounded-2xl" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Nowy szablon
            </Button>
          </div>
        </header>

        <section className="grid-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatShortcutCard label="Szablony" value={stats.total} icon={AiEntityIcon} iconClassName="app-primary-chip" valueClassName="app-text" />
          <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" />
          <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" />
          <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" />
        </section>

        <Card className="cf-readable-card border-none app-surface-strong app-shadow">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Szukaj po nazwie, kategorii, tagach, zmiennych albo treści..." />
            </div>
            <div className="rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] app-muted app-border app-surface">
              Szablony odpowiedzi są osobne od checklist spraw
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="cf-readable-card border-none app-surface-strong app-shadow"><CardContent className="p-6 app-muted">Ładowanie szablonów...</CardContent></Card>
        ) : (
          <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
            <div className="space-y-3">
              {filtered.map((item) => (
                <Card key={item.id} className="cf-readable-card border-none app-surface-strong app-shadow">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold app-text">{item.name}</h3>
                          <Badge variant="outline">{item.category || 'Ogólne'}</Badge>
                        </div>
                        <p className="line-clamp-2 text-sm app-muted">{item.body || 'Brak treści.'}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" className="rounded-2xl" onClick={() => void handleCopy(item)}>
                          <Copy className="h-4 w-4" /> Kopiuj
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-2xl" onClick={() => openEdit(item)}>Edytuj</Button>
                        <Button variant="outline" size="icon" className="rounded-2xl text-amber-600 hover:bg-amber-500/10 hover:text-amber-700" onClick={() => void remove(item.id)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(item.tags || []).length ? (item.tags || []).map((tag) => <Badge key={tag} variant="outline">#{tag}</Badge>) : <Badge variant="outline">bez tagów</Badge>}
                      {(item.variables || []).length ? (item.variables || []).map((variable) => <Badge key={variable} className="bg-emerald-500/12 text-emerald-600 border-emerald-500/20">{`{{${variable}}}`}</Badge>) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!filtered.length ? (
                <Card className="cf-readable-card border-dashed app-surface-strong app-shadow">
                  <CardContent className="cf-empty-state flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="rounded-full p-4 app-primary-chip"><MessageSquareText className="h-7 w-7" /></div>
                    <div>
                      <p className="cf-readable-title text-lg font-semibold app-text">Brak szablonów odpowiedzi</p>
                      <p className="cf-readable-muted mt-1 max-w-md text-sm app-muted">Dodaj pierwszy gotowiec, żeby szybciej odpowiadać na powtarzalne sytuacje.</p>
                    </div>
                    <Button className="rounded-2xl" onClick={openCreate}>
                      <Plus className="h-4 w-4" /> Dodaj pierwszy szablon
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <Card className="cf-readable-card border-none app-surface-strong app-shadow xl:sticky xl:top-6 xl:self-start">
              <CardContent className="space-y-5 p-5">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Podgląd</p>
                  <h3 className="cf-readable-title text-xl font-bold app-text">{selectedTemplate?.name || 'Wybierz szablon'}</h3>
                  <p className="text-sm app-muted">{selectedTemplate?.category || 'Ogólne'}</p>
                </div>
                {selectedTemplate ? (
                  <>
                    <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl border p-4 text-sm app-border app-surface app-text">{selectedTemplate.body}</pre>
                    <div className="flex flex-wrap gap-2">
                      {(selectedTemplate.variables || []).map((variable) => <Badge key={variable} className="bg-emerald-500/12 text-emerald-600 border-emerald-500/20">{`{{${variable}}}`}</Badge>)}
                      {!(selectedTemplate.variables || []).length ? <span className="text-sm app-muted">Ten szablon nie ma zmiennych.</span> : null}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button className="rounded-2xl" onClick={() => void handleCopy(selectedTemplate)}><Copy className="h-4 w-4" /> Kopiuj treść</Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => openEdit(selectedTemplate)}>Edytuj</Button>
                    </div>
                  </>
                ) : (
                  <div className="cf-readable-panel rounded-2xl border border-dashed p-6 text-sm app-border app-muted">Po dodaniu szablonu zobaczysz tutaj szybki podgląd treści.</div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edytuj szablon odpowiedzi' : 'Nowy szablon odpowiedzi'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Nazwa</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Np. Przypomnienie po braku odpowiedzi" />
              </div>
              <div className="grid gap-2">
                <Label>Kategoria</Label>
                <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Np. Follow-up" />
              </div>
              <div className="grid gap-2">
                <Label>Tagi (po przecinku)</Label>
                <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="np. lead, oferta, przypomnienie" />
              </div>
              <div className="grid gap-2">
                <Label>Zmienne (po przecinku)</Label>
                <Input value={variables} onChange={(event) => setVariables(event.target.value)} placeholder="np. client_name, case_title, my_name" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>Treść</Label>
                <Textarea rows={10} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Wpisz treść odpowiedzi. Możesz używać zmiennych typu {{client_name}}." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Anuluj</Button>
              <Button onClick={() => void save()} disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Zapisywanie...' : 'Zapisz'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
