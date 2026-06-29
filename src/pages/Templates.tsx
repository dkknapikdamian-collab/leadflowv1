import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, FolderKanban, MoreVertical, Plus, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { AiEntityIcon, TemplateEntityIcon } from '../components/ui-system';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle, DialogDescription
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { EntityActionButton, EntityTrashButton, trashActionIconClass } from '../components/entity-actions';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import {
  // CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_TEMPLATES
  createCaseTemplateInSupabase,
  deleteCaseTemplateFromSupabase,
  fetchCaseTemplatesFromSupabase,
  updateCaseTemplateInSupabase
} from '../lib/supabase-fallback';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
import '../styles/visual-stage22-event-form-vnext.css';
import '../styles/closeflow-template-modal-source-truth-stage181l.css';
import '../styles/closeflow-template-modal-source-truth-stage181n.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
import {
  TEMPLATE_ITEM_TYPE_OPTIONS,
  createEmptyTemplateDraft,
  createEmptyTemplateItem,
  getRequiredTemplateItemCount,
  getTemplateItemCount,
  getTemplateItemTypeLabel,
  getTemplateItemTypeMeta,
  normalizeTemplateItems,
  type TemplateItemDraft,
  type TemplateItemTypeValue,
  type TemplateRecord,
} from '../lib/source-of-truth/template-options';

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
      <StatShortcutCard label="Szablony" value={stats.totalTemplates} icon={AiEntityIcon} iconClassName="bg-emerald-50 text-emerald-700" />
      <StatShortcutCard label="Pozycje" value={stats.totalItems} icon={TemplateEntityIcon} iconClassName="bg-indigo-50 text-indigo-700" />
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
  const [draft, setDraft] = useState(createEmptyTemplateDraft());

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
    const requiredItems = templates.reduce((acc, template) => acc + getRequiredTemplateItemCount(template), 0);
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
      toast.error('Dostęp jest tylko w trybie podglądu. Włącz plan, żeby dodawać i edytować szablony.');
      return;
    }

    setEditingTemplateId(null);
    setDraft(createEmptyTemplateDraft());
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
      items: normalizeTemplateItems(template.items).length ? normalizeTemplateItems(template.items) : [createEmptyTemplateItem()],
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
    setDraft((prev) => ({ ...prev, items: [...prev.items, createEmptyTemplateItem()] }));
  }

  function removeDraftItem(index: number) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? [createEmptyTemplateItem()] : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSaveTemplate() {
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
        await updateCaseTemplateInSupabase({ id: editingTemplateId, name: sanitizedName, items: sanitizedItems });
        toast.success('Szablon został zaktualizowany.');
      } else {
        await createCaseTemplateInSupabase({ name: sanitizedName, items: sanitizedItems });
        toast.success('Szablon został dodany.');
      }

      setDialogOpen(false);
      setEditingTemplateId(null);
      setDraft(createEmptyTemplateDraft());
      await loadTemplates();
    } catch (error: any) {
      toast.error(`Nie udało się zapisać szablonu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDuplicateTemplate(template: TemplateRecord) {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }

    try {
      await createCaseTemplateInSupabase({
        name: `${template.name || 'Szablon'} (kopia)`,
        items: normalizeTemplateItems(template.items),
      });
      toast.success('Utworzono kopię szablonu.');
      await loadTemplates();
    } catch (error: any) {
      toast.error(`Nie udało się skopiować szablonu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  }

  async function handleDeleteTemplate(template: TemplateRecord) {
    if (!hasAccess) {
      toast.error('Tryb podglądu blokuje zapis.');
      return;
    }

    const templateName = template.name || 'Szablon bez nazwy';
    const itemCount = getTemplateItemCount(template);
    const firstConfirm = window.confirm(
      `Usunąć szablon "${templateName}"?\n\nTo usuwa wzorzec szablonu oraz ${itemCount} pozycji checklisty zapisanych w tym szablonie. Pozycje już skopiowane do istniejących spraw nie są usuwane z tego ekranu.`,
    );
    if (!firstConfirm) return;

    if (itemCount > 0) {
      const itemConfirm = window.confirm(
        `Potwierdź usunięcie pozycji checklisty z szablonu "${templateName}".\n\nNie usuwaj szablonu, jeśli nadal jest potrzebny jako wzorzec dla aktywnych spraw.`,
      );
      if (!itemConfirm) return;
    }

    try {
      await deleteCaseTemplateFromSupabase(template.id);
      toast.success('Szablon został usunięty.');
      await loadTemplates();
    } catch (error: any) {
      toast.error(`Nie udało się usunąć szablonu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  }

  return (
    <Layout>
      <div className="cf-html-view main-templates-html cf-route-work-root flex w-full flex-col gap-6 px-4 py-4 text-slate-900 md:px-8 md:py-8" data-cf-templates-page-source="record-list-source-truth">
        <CloseFlowPageHeaderV2
          pageKey="templates"
          actions={
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            {!hasAccess ? (
                              <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                                <ShieldAlert className="h-4 w-4" /> Tryb podglądu blokuje zapis szablonów
                              </div>
                            ) : null}
                            <Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700" data-cf-header-action="primary" onClick={openCreateDialog}>
                              <Plus className="h-4 w-4" /> Nowy szablon
                            </Button>
                          </div>
            </>
          }
        />

        <LightMetricCardRow stats={stats} />

        <Card className="cf-readable-card border border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 cf-main-search cf-main-search-stage175" data-cf-main-search-source="stage173" data-cf-main-search-stage175="true">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Szukaj po nazwie szablonu albo pozycjach checklisty..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
              />
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {loading ? (
            <Card className="cf-readable-card border border-slate-200 bg-white shadow-sm">
              <CardContent className="cf-empty-state flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
                <p className="text-sm font-semibold text-slate-500">Ładowanie szablonów...</p>
              </CardContent>
            </Card>
          ) : filteredTemplates.length === 0 ? (
            <Card className="cf-readable-card border border-dashed border-slate-300 bg-white shadow-sm">
              <CardContent className="cf-empty-state flex min-h-[260px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700"><FolderKanban className="h-8 w-8" /></div>
                <div>
                  <p className="cf-readable-title text-xl font-black text-slate-950">Brak szablonów w tym widoku</p>
                  <p className="mt-2 max-w-md cf-readable-muted text-sm leading-6 text-slate-500">
                    Dodaj pierwszy szablon, jeśli chcesz szybciej zamieniać pozyskany temat w sprawę z checklistą.
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
                <Card key={template.id} data-cf-template-card-source="record-list-source-truth" data-cf-template-card-delete-visible="true" className="cf-template-card cf-readable-card border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="cf-readable-title text-xl font-black text-slate-950">{template.name || 'Szablon bez nazwy'}</h3>
                          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">{items.length} pozycji</Badge>
                          {requiredCount > 0 ? <Badge className="border border-amber-200 bg-amber-50 text-amber-700">{requiredCount} obowiązkowych</Badge> : null}
                        </div>
                        <p className="cf-readable-muted text-sm leading-6 text-slate-500">
                          Po wybraniu szablonu pozycje zostaną skopiowane do checklisty nowej sprawy.
                        </p>
                      </div>
                      <div className="cf-template-card-actions" data-cf-template-card-actions="true">
                        <Button type="button" variant="outline" className="cf-template-card-action" onClick={() => openEditDialog(template)}>Edytuj</Button>
                        <Button type="button" variant="outline" className="cf-template-card-action" onClick={() => void handleDuplicateTemplate(template)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplikuj
                        </Button>
                        <EntityTrashButton
                          type="button"
                          variant="outline"
                          className="cf-template-card-action cf-template-delete-action"
                          data-cf-template-delete-action="true"
                          onClick={() => void handleDeleteTemplate(template)}
                        >
                          <Trash2 className={trashActionIconClass("mr-2 h-4 w-4")} /> Usuń
                        </EntityTrashButton>
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
                            <EntityTrashButton type="button" className="w-full justify-start rounded-sm px-2 py-1.5 text-sm font-normal shadow-none" data-cf-template-delete-action="menu" onClick={() => void handleDeleteTemplate(template)}>
                            <Trash2 className={trashActionIconClass("mr-2 h-4 w-4")} /> Usuń
                            </EntityTrashButton>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="cf-template-card-items grid gap-3 md:grid-cols-2 xl:grid-cols-3" data-cf-template-card-items="true">
                      {items.map((item, index) => {
                        const meta = getTemplateItemTypeMeta(item.type);
                        return (
                          <div key={`${template.id}-${index}`} className="cf-readable-panel rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={meta.badgeClassName}>{getTemplateItemTypeLabel(item)}</Badge>
                              {item.isRequired ? <Badge className="cf-status-pill" data-cf-status-tone="red">Obowiązkowe</Badge> : <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">Opcjonalne</Badge>}
                            </div>
                            <p className="font-bold text-slate-950">{item.title}</p>
                            <p className="mt-2 cf-readable-muted text-sm leading-6 text-slate-500">
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
        <DialogContent className="cf-template-modal-v2" data-template-modal-stage181n="true" aria-describedby={undefined}>
          <DialogHeader className="cf-template-modal-v2-header">
            <DialogTitle className="cf-template-modal-v2-title">{editingTemplateId ? 'Edytuj szablon sprawy' : 'Nowy szablon sprawy'}</DialogTitle>
            <DialogDescription className="cf-template-modal-v2-description">Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów.</DialogDescription>
          </DialogHeader>

          <div className="cf-template-modal-v2-body">
            <section className="cf-template-modal-v2-name-card">
              <Label htmlFor="template-name" className="cf-template-modal-v2-label">Nazwa szablonu</Label>
              <Input
                id="template-name"
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Np. Strona internetowa + formularz"
                className="cf-template-modal-v2-input"
              />
            </section>

            <section className="cf-template-modal-v2-items" aria-label="Pozycje szablonu">
              {draft.items.map((item, index) => (
                <div key={`draft-item-${index}`} className="cf-template-modal-v2-item-card">
                  <div className="cf-template-modal-v2-item-head">
                    <div>
                      <p className="cf-template-modal-v2-item-title">Pozycja {index + 1}</p>
                      <p className="cf-template-modal-v2-item-subtitle">To zobaczy operator i klient w dalszym flow.</p>
                    </div>
                    <EntityActionButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      tone="danger"
                      iconOnly
                      className="cf-template-modal-v2-delete"
                      onClick={() => removeDraftItem(index)}
                      aria-label="Usuń pozycję"
                      title="Usuń pozycję"
                    >
                      <Trash2 className="h-4 w-4" />
                    </EntityActionButton>
                  </div>

                  <div className="cf-template-modal-v2-fields">
                    <div className="cf-template-modal-v2-field">
                      <Label className="cf-template-modal-v2-label cf-template-modal-v2-label-on-dark">Tytuł pozycji</Label>
                      <Input
                        value={item.title}
                        onChange={(event) => updateDraftItem(index, { title: event.target.value })}
                        placeholder="Np. Dostęp do hostingu"
                        className="cf-template-modal-v2-input"
                      />
                    </div>

                    <div className="cf-template-modal-v2-field">
                      <Label className="cf-template-modal-v2-label cf-template-modal-v2-label-on-dark">Opis / instrukcja</Label>
                      <Textarea
                        value={item.description}
                        onChange={(event) => updateDraftItem(index, { description: event.target.value })}
                        placeholder="Dopisz, co dokładnie klient ma przygotować albo zatwierdzić."
                        rows={3}
                        className="cf-template-modal-v2-textarea"
                      />
                    </div>

                    <div className="cf-template-modal-v2-bottom-row">
                      <div className="cf-template-modal-v2-field">
                        <Label className="cf-template-modal-v2-label cf-template-modal-v2-label-on-dark">Typ pozycji</Label>
                        <div className="cf-template-modal-v2-type-grid">
                          <select
                            className="cf-template-modal-v2-select-native"
                            value={item.type}
                            onChange={(event) => {
                              const nextType = event.target.value as TemplateItemTypeValue;
                              updateDraftItem(index, {
                                type: nextType,
                                customTypeName: nextType === 'other' ? item.customTypeName || '' : '',
                              });
                            }}
                          >
                            {TEMPLATE_ITEM_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>

                          {item.type === 'other' ? (
                            <Input
                              value={item.customTypeName || ''}
                              onChange={(event) => updateDraftItem(index, { customTypeName: event.target.value })}
                              placeholder="Wpisz własną nazwę typu, np. Audyt, Umowa, Zdjęcia..."
                              className="cf-template-modal-v2-input cf-template-modal-v2-custom-type-input"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="cf-template-modal-v2-required">
                        <div>
                          <p className="cf-template-modal-v2-required-title">Obowiązkowe</p>
                          <p className="cf-template-modal-v2-required-text">Brak tej pozycji będzie blokował sprawę.</p>
                        </div>
                        <Checkbox checked={item.isRequired} onCheckedChange={(checked) => updateDraftItem(index, { isRequired: checked === true })} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" className="cf-template-modal-v2-add" onClick={addDraftItem}>
                <Plus className="h-4 w-4" /> Dodaj następną pozycję
              </Button>
            </section>
          </div>

          <DialogFooter className="cf-template-modal-v2-footer">
            <Button type="button" variant="outline" className="cf-template-modal-v2-cancel" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button type="button" className="cf-template-modal-v2-submit" onClick={() => void handleSaveTemplate()} disabled={saving}>
              {saving ? 'Zapisywanie...' : editingTemplateId ? 'Zapisz zmiany' : 'Utwórz szablon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
