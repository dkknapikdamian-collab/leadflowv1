import { useEffect, useMemo, useState } from 'react';
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
import { EntityActionButton } from '../components/entity-actions';
import { useWorkspace } from '../hooks/useWorkspace';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Textarea } from '../components/ui/textarea';
import {
  createCaseTemplateInSupabase,
  deleteCaseTemplateFromSupabase,
  fetchCaseTemplatesFromSupabase,
  updateCaseTemplateInSupabase,
} from '../lib/supabase-fallback';

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
  items?: TemplateItemDraft[];
};

const ITEM_TYPE_OPTIONS: { value: TemplateItemType; label: string; badgeClassName: string }[] = [
  { value: 'file', label: 'Plik', badgeClassName: 'border-sky-200 bg-sky-50 text-sky-700' },
  { value: 'text', label: 'Tekst / brief', badgeClassName: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
  { value: 'decision', label: 'Decyzja / akceptacja', badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700' },
  { value: 'access', label: 'Dostp / login', badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
];

const EMPTY_ITEM: TemplateItemDraft = {
  title: '',
  description: '',
  type: 'file',
  isRequired: true,
};

function cloneEmptyItem(): TemplateItemDraft {
  return { ...EMPTY_ITEM };
}

function createEmptyDraft() {
  return {
    name: '',
    items: [cloneEmptyItem()],
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

function getTemplateItemCount(template: TemplateRecord) {
  return normalizeTemplateItems(template.items).length;
}

function getRequiredItemCount(template: TemplateRecord) {
  return normalizeTemplateItems(template.items).filter((item) => item.isRequired).length;
}

function LightMetricCardRow({
  stats,
}: {
  stats: {
    totalTemplates: number;
    totalItems: number;
    requiredItems: number;
    decisionItems: number;
  };
}) {
  return (
    <section className="grid-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatShortcutCard label="Szablony" value={stats.totalTemplates} icon={Sparkles} iconClassName="bg-emerald-50 text-emerald-700" />
      <StatShortcutCard label="Pozycje" value={stats.totalItems} icon={FileText} iconClassName="bg-indigo-50 text-indigo-700" />
      <StatShortcutCard label="Obowiązkowe" value={stats.requiredItems} icon={AlertTriangle} iconClassName="bg-amber-50 text-amber-700" valueClassName="text-amber-600" />
      <StatShortcutCard label="Akceptacje" value={stats.decisionItems} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-700" valueClassName="text-emerald-600" />
    </section>
  );
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

  async function loadTemplates() {
    setLoading(true);
    try {
      const data = await fetchCaseTemplatesFromSupabase({ includeArchived: false });
      setTemplates((Array.isArray(data) ? data : []) as TemplateRecord[]);
    } catch (error: any) {
      setTemplates([]);
      toast.error(`Nie udało się pobrać szablonów: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTemplates();
  }, []);

  const stats = useMemo(() => {
    const totalItems = templates.reduce((acc, template) => acc + getTemplateItemCount(template), 0);
    const requiredItems = templates.reduce((acc, template) => acc + getRequiredItemCount(template), 0);
    const decisionItems = templates.reduce(
      (acc, template) => acc + normalizeTemplateItems(template.items).filter((item) => item.type === 'decision').length,
      0,
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
        ...normalizeTemplateItems(template.items).flatMap((item) => [item.title, item.description, item.type]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [searchQuery, templates]);

  function openCreateDialog() {
    if (!hasAccess) {
      toast.error('Dostp jest tylko w trybie podgldu. WBcz plan, |eby dodawa i edytowa szablony.');
      return;
    }

    setEditingTemplateId(null);
    setDraft(createEmptyDraft());
    setDialogOpen(true);
  }

  function openEditDialog(template: TemplateRecord) {
    if (!hasAccess) {
      toast.error('Dostp jest tylko w trybie podgldu. WBcz plan, |eby edytowa szablony.');
      return;
    }

    setEditingTemplateId(template.id);
    setDraft({
      name: template.name || '',
      items: normalizeTemplateItems(template.items).length ? normalizeTemplateItems(template.items) : [cloneEmptyItem()],
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
    setDraft((prev) => ({ ...prev, items: [...prev.items, cloneEmptyItem()] }));
  }

  function removeDraftItem(index: number) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? [cloneEmptyItem()] : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSaveTemplate() {
    if (!hasAccess) {
      toast.error('Tryb podgldu blokuje zapis.');
      return;
    }

    const sanitizedName = draft.name.trim();
    const sanitizedItems = normalizeTemplateItems(draft.items).filter((item) => item.title.length > 0);

    if (!sanitizedName) {
      toast.error('Nadaj nazw szablonu.');
      return;
    }

    if (!sanitizedItems.length) {
      toast.error('Dodaj przynajmniej jedn pozycj checklisty.');
      return;
    }

    setSaving(true);
    try {
      if (editingTemplateId) {
        await updateCaseTemplateInSupabase({ id: editingTemplateId, name: sanitizedName, items: sanitizedItems });
        toast.success('Szablon zostaB zaktualizowany.');
      } else {
        await createCaseTemplateInSupabase({ name: sanitizedName, items: sanitizedItems });
        toast.success('Szablon zostaB dodany.');
      }

      setDialogOpen(false);
      setEditingTemplateId(null);
      setDraft(createEmptyDraft());
      await loadTemplates();
    } catch (error: any) {
      toast.error(`Nie udało się zapisać szablonu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDuplicateTemplate(template: TemplateRecord) {
    if (!hasAccess) {
      toast.error('Tryb podgldu blokuje zapis.');
      return;
    }

    try {
      await createCaseTemplateInSupabase({
        name: `${template.name || 'Szablon'} (kopia)`,
        items: normalizeTemplateItems(template.items),
      });
      toast.success('Utworzono kopi szablonu.');
      await loadTemplates();
    } catch (error: any) {
      toast.error(`Nie udało się skopiować szablonu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  }

  async function handleDeleteTemplate(templateId: string) {
    if (!hasAccess) {
      toast.error('Tryb podgldu blokuje zapis.');
      return;
    }

    try {
      await deleteCaseTemplateFromSupabase(templateId);
      toast.success('Szablon zostaB usunity.');
      await loadTemplates();
    } catch (error: any) {
      toast.error(`Nie udało się usunąć szablonu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  }

  return (
    <Layout>
      <div className="cf-html-view mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 text-slate-900 md:px-8 md:py-8" data-a16-template-light-ui="true">
        <header className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                <FolderKanban className="h-3.5 w-3.5" /> Szablony spraw
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">Szablony spraw i checklist</h1>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {!hasAccess ? (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                  <ShieldAlert className="h-4 w-4" /> Tryb podgldu blokuje zapis szablonów
                </div>
              ) : null}
              <Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={openCreateDialog}>
                <Plus className="h-4 w-4" /> Nowy szablon
              </Button>
            </div>
          </div>
        </header>

        <LightMetricCardRow stats={stats} />

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Szukaj po nazwie szablonu albo pozycjach checklisty..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
              Gotowce do spraw, nie szablony odpowiedzi
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {loading ? (
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
                <p className="text-sm font-semibold text-slate-500">Ładowanie szablonów...</p>
              </CardContent>
            </Card>
          ) : filteredTemplates.length === 0 ? (
            <Card className="border border-dashed border-slate-300 bg-white shadow-sm">
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700"><FolderKanban className="h-8 w-8" /></div>
                <div>
                  <p className="text-xl font-black text-slate-950">Brak szablonów w tym widoku</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Dodaj pierwszy szablon, je[li chcesz szybciej zamienia pozyskany temat w spraw z checklist.
                  </p>
                </div>
                <Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4" /> Dodaj pierwszy szablon
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTemplates.map((template) => {
              const items = normalizeTemplateItems(template.items);
              const requiredCount = items.filter((item) => item.isRequired).length;

              return (
                <Card key={template.id} className="border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-black text-slate-950">{template.name || 'Szablon bez nazwy'}</h3>
                          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">{items.length} pozycji</Badge>
                          {requiredCount > 0 ? <Badge className="border border-amber-200 bg-amber-50 text-amber-700">{requiredCount} obowizkowych</Badge> : null}
                        </div>
                        <p className="text-sm leading-6 text-slate-500">
                          Po wybraniu szablonu pozycje zostan skopiowane do checklisty nowej sprawy.
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(template)}>Edytuj</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void handleDuplicateTemplate(template)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplikuj
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <EntityActionButton type="button" tone="danger" className="w-full justify-start rounded-sm px-2 py-1.5 text-sm font-normal shadow-none" onClick={() => void handleDeleteTemplate(template.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> UsuD
                            </EntityActionButton>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item, index) => {
                        const meta = itemTypeMeta(item.type);
                        return (
                          <div key={`${template.id}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={meta.badgeClassName}>{meta.label}</Badge>
                              {item.isRequired ? <Badge className="bg-rose-600 text-white">Obowizkowe</Badge> : <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">Opcjonalne</Badge>}
                            </div>
                            <p className="font-bold text-slate-950">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {item.description || 'Bez opisu. Warto dopisa krótkie wyjaśnienie dla klienta.'}
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
        <DialogContent className="max-h-[90vh] overflow-hidden border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-slate-950">{editingTemplateId ? 'Edytuj szablon sprawy' : 'Nowy szablon sprawy'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 overflow-y-auto py-2 pr-1 md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name" className="text-slate-700">Nazwa szablonu</Label>
                <Input
                  id="template-name"
                  value={draft.name}
                  onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Np. Strona internetowa + formularz"
                  className="border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="font-bold text-slate-950">Jak tego u|ywa</p>
                <p className="mt-2 leading-6 text-slate-500">
                  Ten szablon pojawi si przy akcji Rozpocznij obsBug. Wszystkie pozycje zostan automatycznie skopiowane do checklisty nowej sprawy.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {draft.items.map((item, index) => (
                <div key={`draft-item-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950">Pozycja {index + 1}</p>
                      <p className="text-xs text-slate-500">To dokBadnie zobaczy operator i klient w dalszym flow.</p>
                    </div>
                    <EntityActionButton type="button" variant="ghost" size="icon" tone="danger" iconOnly className="rounded-2xl" onClick={() => removeDraftItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </EntityActionButton>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">TytuB pozycji</Label>
                      <Input value={item.title} onChange={(event) => updateDraftItem(index, { title: event.target.value })} placeholder="Np. Dostp do hostingu" className="border-slate-200 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Opis / instrukcja</Label>
                      <Textarea
                        value={item.description}
                        onChange={(event) => updateDraftItem(index, { description: event.target.value })}
                        placeholder="Dopisz, co dokBadnie klient ma przygotowa albo zatwierdzi."
                        rows={3}
                        className="border-slate-200 bg-white text-slate-900"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-end">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Typ pozycji</Label>
                        <Select value={item.type} onValueChange={(value) => updateDraftItem(index, { type: value as TemplateItemType })}>
                          <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ITEM_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-slate-950">Obowizkowe</p>
                          <p className="text-xs text-slate-500">Brak tej pozycji bdzie blokowaB spraw.</p>
                        </div>
                        <Checkbox checked={item.isRequired} onCheckedChange={(checked) => updateDraftItem(index, { isRequired: checked === true })} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full rounded-2xl border-slate-200 bg-white text-slate-800 hover:bg-slate-50" onClick={addDraftItem}>
                <Plus className="h-4 w-4" /> Dodaj nastpn pozycj
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-slate-200 bg-white text-slate-800 hover:bg-slate-50" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => void handleSaveTemplate()} disabled={saving}>
              {saving ? 'Zapisywanie...' : editingTemplateId ? 'Zapisz zmiany' : 'Utwórz szablon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
