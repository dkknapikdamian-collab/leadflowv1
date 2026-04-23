import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileText,
  FolderKanban,
  MoreVertical,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { auth, db } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';

type TemplateItemType = 'file' | 'text' | 'decision' | 'access';

type TemplateItemDraft = {
  title: string;
  description: string;
  type: TemplateItemType;
  isRequired: boolean;
};

type TemplateRecord = {
  id: string;
  name?: string;
  ownerId?: string;
  items?: TemplateItemDraft[];
};

const ITEM_TYPE_OPTIONS: { value: TemplateItemType; label: string; badgeClassName: string }[] = [
  { value: 'file', label: 'Plik', badgeClassName: 'bg-sky-500/12 text-sky-500 border-sky-500/20' },
  { value: 'text', label: 'Tekst / brief', badgeClassName: 'bg-indigo-500/12 text-indigo-500 border-indigo-500/20' },
  { value: 'decision', label: 'Decyzja / akceptacja', badgeClassName: 'bg-amber-500/12 text-amber-600 border-amber-500/20' },
  { value: 'access', label: 'Dostęp / login', badgeClassName: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20' },
];

const EMPTY_ITEM: TemplateItemDraft = {
  title: '',
  description: '',
  type: 'file',
  isRequired: true,
};

function createEmptyDraft() {
  return {
    name: '',
    items: [structuredClone(EMPTY_ITEM)],
  };
}

function normalizeTemplateItems(items?: TemplateItemDraft[]) {
  if (!items?.length) return [];
  return items.map((item) => ({
    title: item.title?.trim() || '',
    description: item.description?.trim() || '',
    type: item.type || 'file',
    isRequired: item.isRequired !== false,
  }));
}

function itemTypeMeta(type?: TemplateItemType) {
  return ITEM_TYPE_OPTIONS.find((entry) => entry.value === type) || ITEM_TYPE_OPTIONS[0];
}

export default function Templates() {
  const { hasAccess } = useWorkspace();
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [draft, setDraft] = useState(createEmptyDraft());

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'templates'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTemplates(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<TemplateRecord, 'id'>) })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const totalItems = templates.reduce((acc, template) => acc + (template.items?.length || 0), 0);
    const requiredItems = templates.reduce(
      (acc, template) => acc + (template.items?.filter((item) => item.isRequired).length || 0),
      0
    );
    const decisionItems = templates.reduce(
      (acc, template) => acc + (template.items?.filter((item) => item.type === 'decision').length || 0),
      0
    );

    return {
      totalTemplates: templates.length,
      totalItems,
      requiredItems,
      decisionItems,
    };
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return templates;

    return templates.filter((template) => {
      const haystack = [
        template.name,
        ...(template.items?.flatMap((item) => [item.title, item.description, item.type]) || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [searchQuery, templates]);

  function openCreateDialog() {
    if (!hasAccess) {
      toast.error('Dostęp jest tylko w trybie podglądu. Włącz plan, żeby dodawać i edytować szablony.');
      return;
    }

    setEditingTemplateId(null);
    setDraft(createEmptyDraft());
    setDialogOpen(true);
  }

  function openEditDialog(template: TemplateRecord) {
    if (!hasAccess) {
      toast.error('Dostęp jest tylko w trybie podglądu. Włącz plan, żeby edytować szablony.');
      return;
    }

    setEditingTemplateId(template.id);
    setDraft({
      name: template.name || '',
      items: normalizeTemplateItems(template.items) || [structuredClone(EMPTY_ITEM)],
    });
    setDialogOpen(true);
  }

  function updateDraftItem(index: number, patch: Partial<TemplateItemDraft>) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addDraftItem() {
    setDraft((prev) => ({ ...prev, items: [...prev.items, structuredClone(EMPTY_ITEM)] }));
  }

  function removeDraftItem(index: number) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? [structuredClone(EMPTY_ITEM)] : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSaveTemplate() {
    if (!auth.currentUser) return;
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }

    const sanitizedName = draft.name.trim();
    const sanitizedItems = normalizeTemplateItems(draft.items).filter((item) => item.title.length > 0);

    if (!sanitizedName) {
      toast.error('Nadaj nazwę szablonu.');
      return;
    }

    if (!sanitizedItems.length) {
      toast.error('Dodaj przynajmniej jedną pozycję checklisty.');
      return;
    }

    setSaving(true);
    try {
      if (editingTemplateId) {
        await updateDoc(doc(db, 'templates', editingTemplateId), {
          name: sanitizedName,
          items: sanitizedItems,
          updatedAt: serverTimestamp(),
        });
        toast.success('Szablon został zaktualizowany.');
      } else {
        await addDoc(collection(db, 'templates'), {
          name: sanitizedName,
          items: sanitizedItems,
          ownerId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success('Szablon został dodany.');
      }

      setDialogOpen(false);
      setEditingTemplateId(null);
      setDraft(createEmptyDraft());
    } catch (error: any) {
      toast.error(`Nie udało się zapisać szablonu: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDuplicateTemplate(template: TemplateRecord) {
    if (!auth.currentUser) return;
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }

    try {
      await addDoc(collection(db, 'templates'), {
        name: `${template.name || 'Szablon'} (kopia)`,
        items: normalizeTemplateItems(template.items),
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Utworzono kopię szablonu.');
    } catch (error: any) {
      toast.error(`Nie udało się skopiować szablonu: ${error.message}`);
    }
  }

  async function handleDeleteTemplate(templateId: string) {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'templates', templateId));
      toast.success('Szablon został usunięty.');
    } catch (error: any) {
      toast.error(`Nie udało się usunąć szablonu: ${error.message}`);
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <FolderKanban className="h-3.5 w-3.5" /> Szablony startu
            </div>
            <div>
              <h1 className="text-3xl font-bold app-text">Szablony</h1>
              <p className="max-w-2xl text-sm md:text-base app-muted">
                Tutaj budujesz gotowce dla najczęstszych typów realizacji. Dzięki temu lead wygrany przechodzi w sprawę bez ręcznego układania checklisty od zera.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {!hasAccess ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <ShieldAlert className="h-4 w-4" /> Tryb podglądu blokuje zapis szablonów
              </div>
            ) : null}
            <Button className="rounded-2xl" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" /> Nowy szablon
            </Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Szablony</p>
                <p className="mt-2 text-2xl font-bold app-text">{stats.totalTemplates}</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><Sparkles className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Pozycje</p>
                <p className="mt-2 text-2xl font-bold app-text">{stats.totalItems}</p>
              </div>
              <div className="rounded-2xl bg-indigo-500/12 p-3 text-indigo-500"><FileText className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Obowiązkowe</p>
                <p className="mt-2 text-2xl font-bold text-amber-500">{stats.requiredItems}</p>
              </div>
              <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-500"><AlertTriangle className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Akceptacje</p>
                <p className="mt-2 text-2xl font-bold text-emerald-500">{stats.decisionItems}</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-none app-surface-strong">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
              <Input
                placeholder="Szukaj po nazwie szablonu albo pozycjach checklisty..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <div className="rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] app-muted app-border app-surface">
              Buduj gotowce pod typ realizacji, nie od zera za każdym razem
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {loading ? (
            <Card className="border-none app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[color:var(--app-primary)]" />
                <p className="text-sm font-medium app-muted">Ładowanie szablonów...</p>
              </CardContent>
            </Card>
          ) : filteredTemplates.length === 0 ? (
            <Card className="border-dashed app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="rounded-full p-4 app-primary-chip"><FolderKanban className="h-7 w-7" /></div>
                <div>
                  <p className="text-lg font-semibold app-text">Brak szablonów w tym widoku</p>
                  <p className="mt-1 max-w-md text-sm app-muted">
                    Dodaj pierwszy szablon, jeśli chcesz szybciej zamieniać wygranego leada w gotową sprawę z checklistą.
                  </p>
                </div>
                <Button className="rounded-2xl" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4" /> Dodaj pierwszy szablon
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTemplates.map((template) => {
              const items = normalizeTemplateItems(template.items);
              const requiredCount = items.filter((item) => item.isRequired).length;

              return (
                <Card key={template.id} className="border-none app-surface-strong app-shadow">
                  <CardContent className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold app-text">{template.name || 'Szablon bez nazwy'}</h3>
                          <Badge variant="outline">{items.length} pozycji</Badge>
                          {requiredCount > 0 ? <Badge className="bg-amber-500/12 text-amber-600 border-amber-500/20">{requiredCount} obowiązkowych</Badge> : null}
                        </div>
                        <p className="text-sm app-muted">
                          Wybierzesz go podczas przejścia z leada do sprawy. Pozycje poniżej będą od razu skopiowane do checklisty realizacji.
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-2xl">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(template)}>Edytuj</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplikuj
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-500 focus:text-rose-500" onClick={() => handleDeleteTemplate(template.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item, index) => {
                        const meta = itemTypeMeta(item.type);
                        return (
                          <div key={`${template.id}-${index}`} className="rounded-2xl border p-4 app-border app-surface">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <Badge className={meta.badgeClassName}>{meta.label}</Badge>
                              {item.isRequired ? <Badge variant="destructive">Obowiązkowe</Badge> : <Badge variant="outline">Opcjonalne</Badge>}
                            </div>
                            <p className="font-semibold app-text">{item.title}</p>
                            <p className={cn('mt-2 text-sm', item.description ? 'app-muted' : 'app-muted')}>
                              {item.description || 'Bez opisu. Warto dopisać krótkie wyjaśnienie dla klienta.'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingTemplateId ? 'Edytuj szablon' : 'Nowy szablon'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 overflow-y-auto py-2 pr-1 md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Nazwa szablonu</Label>
                <Input
                  id="template-name"
                  value={draft.name}
                  onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Np. Landing page + formularz"
                />
              </div>
              <div className="rounded-2xl border p-4 text-sm app-border app-surface">
                <p className="font-semibold app-text">Jak tego używać</p>
                <p className="mt-2 app-muted">
                  Ten szablon pojawi się przy akcji „Rozpocznij obsługę”. Wszystkie pozycje zostaną automatycznie skopiowane do checklisty nowej realizacji.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {draft.items.map((item, index) => (
                <div key={`draft-item-${index}`} className="rounded-2xl border p-4 app-border app-surface-strong">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold app-text">Pozycja {index + 1}</p>
                      <p className="text-xs app-muted">To dokładnie zobaczy operator i klient w dalszym flow.</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-2xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-500" onClick={() => removeDraftItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Tytuł pozycji</Label>
                      <Input value={item.title} onChange={(event) => updateDraftItem(index, { title: event.target.value })} placeholder="Np. Dostęp do hostingu" />
                    </div>
                    <div className="space-y-2">
                      <Label>Opis / instrukcja</Label>
                      <Textarea
                        value={item.description}
                        onChange={(event) => updateDraftItem(index, { description: event.target.value })}
                        placeholder="Dopisz, co dokładnie klient ma przygotować albo zatwierdzić."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-end">
                      <div className="space-y-2">
                        <Label>Typ pozycji</Label>
                        <Select value={item.type} onValueChange={(value) => updateDraftItem(index, { type: value as TemplateItemType })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ITEM_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border px-4 py-3 app-border app-surface">
                        <div>
                          <p className="text-sm font-semibold app-text">Obowiązkowe</p>
                          <p className="text-xs app-muted">Brak tej pozycji będzie blokował sprawę.</p>
                        </div>
                        <Checkbox checked={item.isRequired} onCheckedChange={(checked) => updateDraftItem(index, { isRequired: checked === true })} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full rounded-2xl" onClick={addDraftItem}>
                <Plus className="h-4 w-4" /> Dodaj następną pozycję
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button onClick={handleSaveTemplate} disabled={saving}>
              {saving ? 'Zapisywanie...' : editingTemplateId ? 'Zapisz zmiany' : 'Utwórz szablon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
