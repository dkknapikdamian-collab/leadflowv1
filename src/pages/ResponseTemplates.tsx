import { useEffect, useMemo, useState } from 'react';
import { MessageSquareText, Plus, Save, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  createResponseTemplateInSupabase,
  deleteResponseTemplateFromSupabase,
  fetchResponseTemplatesFromSupabase,
  updateResponseTemplateInSupabase,
} from '../lib/supabase-fallback';

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
    return rows.filter((row) => `${row.name} ${row.category || ''} ${(row.tags || []).join(' ')} ${row.body}`.toLowerCase().includes(q));
  }, [rows, query]);

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
      toast.success('Usunięto szablon.');
      await load();
    } catch (error: any) {
      toast.error(`Nie udało się usunąć: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] app-muted">Komunikacja</p>
            <h1 className="text-3xl font-bold app-text">Szablony odpowiedzi</h1>
            <p className="app-muted">Osobny moduł gotowych odpowiedzi. Niezależny od szablonów spraw/checklist.</p>
          </div>
          <div className="flex items-center gap-2">
            {!hasAccess ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 px-3 py-2 text-sm text-amber-600">
                <ShieldAlert className="h-4 w-4" /> Tryb podglądu: zapis zablokowany
              </div>
            ) : null}
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Nowy szablon</Button>
          </div>
        </header>

        <Card className="border-none app-surface-strong">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Szukaj po nazwie, kategorii, tagach, treści..." />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="border-none app-surface-strong"><CardContent className="p-6">Ładowanie...</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((item) => (
              <Card key={item.id} className="border-none app-surface-strong">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="inline-flex items-center gap-2"><MessageSquareText className="h-4 w-4" /> {item.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edytuj</Button>
                      <Button variant="outline" size="sm" onClick={() => void remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm app-muted">Kategoria: {item.category || '—'}</p>
                  <p className="text-sm app-muted">Tagi: {(item.tags || []).join(', ') || '—'}</p>
                  <p className="text-sm app-muted">Zmienne: {(item.variables || []).join(', ') || '—'}</p>
                  <pre className="whitespace-pre-wrap rounded-xl border p-3 text-sm">{item.body}</pre>
                </CardContent>
              </Card>
            ))}
            {!filtered.length ? <Card className="border-none app-surface-strong"><CardContent className="p-6">Brak szablonów odpowiedzi.</CardContent></Card> : null}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edytuj szablon odpowiedzi' : 'Nowy szablon odpowiedzi'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Nazwa</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>Kategoria</Label>
                <Input value={category} onChange={(event) => setCategory(event.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>Tagi (po przecinku)</Label>
                <Input value={tags} onChange={(event) => setTags(event.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>Zmienne (po przecinku)</Label>
                <Input value={variables} onChange={(event) => setVariables(event.target.value)} placeholder="np. firstName, caseTitle" />
              </div>
              <div className="grid gap-1">
                <Label>Treść</Label>
                <Textarea rows={8} value={body} onChange={(event) => setBody(event.target.value)} />
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
