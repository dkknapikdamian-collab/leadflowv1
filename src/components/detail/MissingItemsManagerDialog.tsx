// STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX
// STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT
// STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT
// STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH
// Shared Braki / Blokady manager dialog for LeadDetail and ClientDetail parity.
// STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX: compact one-row cards and readable add form.
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CloseFlowDialogBody, CloseFlowDialogSection, CloseFlowDialogShell } from '../ui/CloseFlowDialogShell';

export type MissingItemsManagerItem = {
  id?: string | null;
  title?: string | null;
  status?: unknown;
  priority?: unknown;
  blocksProgress?: unknown;
  blocks_progress?: unknown;
  isBlocker?: boolean;
  sourceLabel?: string | null;
  sourceTitle?: string | null;
  note?: string | null;
  payload?: Record<string, unknown> | null;
  raw?: Record<string, unknown> | null;
};

type MissingItemsManagerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scopeLabel: 'Lead' | 'Klient';
  title?: string;
  description?: string;
  titleValue: string;
  blockerValue: boolean;
  error?: string;
  isSaving?: boolean;
  canMutate?: boolean;
  items: MissingItemsManagerItem[];
  onTitleChange: (value: string) => void;
  onBlockerChange: (value: boolean) => void;
  onAdd: () => void | Promise<void>;
  onToggleBlocker: (item: MissingItemsManagerItem, blocksProgress: boolean) => void | Promise<void>;
  onResolve: (item: MissingItemsManagerItem) => void | Promise<void>;
  onDelete: (item: MissingItemsManagerItem) => void | Promise<void>;
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asText(value: unknown) {
  return String(value || '').trim();
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
}

function isTruthyBooleanLike(value: unknown) {
  return value === true || String(value || '').trim().toLowerCase() === 'true';
}

function isManagerItemBlocker(item: MissingItemsManagerItem) {
  const payload = asObject(item?.payload);
  const raw = asObject(item?.raw);
  const status = asText(item?.status || raw?.status || payload?.status).toLowerCase();
  const priority = asText(item?.priority || raw?.priority || payload?.priority).toLowerCase();
  const direct = item?.isBlocker ?? item?.blocksProgress ?? item?.blocks_progress ?? raw?.blocksProgress ?? raw?.blocks_progress ?? payload?.blocksProgress ?? payload?.blocks_progress;
  return Boolean(
    status === 'blocking_missing_item'
    || priority === 'high'
    || isTruthyBooleanLike(direct)
  );
}

function managerItemTitle(item: MissingItemsManagerItem) {
  const payload = asObject(item?.payload);
  const raw = asObject(item?.raw);
  return firstText(
    item?.title,
    raw?.title,
    raw?.name,
    raw?.label,
    payload?.title,
    payload?.name,
    payload?.label,
    payload?.missingTitle,
    payload?.missing_title,
    payload?.missingItemTitle,
    payload?.missing_item_title,
    payload?.content,
    payload?.note,
    'Brak bez nazwy'
  );
}

function managerItemNote(item: MissingItemsManagerItem) {
  const payload = asObject(item?.payload);
  const raw = asObject(item?.raw);
  return firstText(item?.note, raw?.note, payload?.note, payload?.description, payload?.content);
}

export function MissingItemsManagerDialog({
  open,
  onOpenChange,
  scopeLabel,
  title = 'Braki / Blokady',
  description = 'Dodaj brak, ustaw czy blokuje sprawę, oznacz jako uzupełniony albo usuń.',
  titleValue,
  blockerValue,
  error,
  isSaving = false,
  canMutate = true,
  items,
  onTitleChange,
  onBlockerChange,
  onAdd,
  onToggleBlocker,
  onResolve,
  onDelete,
}: MissingItemsManagerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CloseFlowDialogShell
        title={title}
        description={description}
        icon={<AlertTriangle className="h-4 w-4" />}
        className="cf-missing-manager-dialog-stage232i4-r14 cf-missing-manager-dialog-stage232i4-r10 cf-missing-manager-dialog-stage232i4-r11 cf-missing-manager-dialog-stage232i4-r12 !max-w-none sm:!max-w-none cf-missing-manager-dialog-stage232i4-r16q w-[calc(100vw-48px)] xl:w-[1180px]"
        footer={(
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving} className="rounded-xl border-slate-600 bg-slate-100 px-5 font-semibold text-slate-950 hover:bg-white">
            Zamknij
          </Button>
        )}
      >
        <div
          data-stage232i4-r14-missing-manager-dialog={scopeLabel.toLowerCase()}
          data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"
          data-stage232i4-r10-readable-layout="true"
          data-stage232i4-r11-row-layout="title-first-control-row"
          data-stage232i4-r12-uses-shared-dialog-shell="true"
          data-stage232i4-r16-manager-wide-readable="true"
          data-stage232i4-r16q-compact-row-readability="true"
        >
          <CloseFlowDialogSection className="cf-missing-manager-add-form-stage232i4-r14 cf-missing-manager-add-form-stage232i4-r10 cf-missing-manager-add-form-stage232i4-r16q !rounded-2xl !border !border-slate-700 !bg-slate-950/80 p-3" data-stage232i4-r12-add-section="true">
            <form
              data-stage232i4-r14-manager-add-form="true"
              data-stage232i4-r10-manager-add-form="true"
              data-stage232i4-r12-manager-add-form="shell-section"
              onSubmit={(event) => {
                event.preventDefault();
                void onAdd();
              }}
            >
              <div className="space-y-4">
                <Label className="cf-missing-manager-title-field-stage232i4-r14 block text-sm font-semibold text-slate-100">
                  Nazwa braku
                  <Input
                    value={titleValue}
                    onChange={(event) => onTitleChange(event.target.value)}
                    placeholder="np. Brak dokumentu"
                    disabled={!canMutate || isSaving}
                    className="mt-2 h-10 rounded-xl border-slate-600 bg-slate-900 text-slate-50 placeholder:text-slate-500 focus-visible:ring-blue-500"
                    data-stage232i4-r14-manager-title-input="true"
                  />
                </Label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="cf-missing-manager-checkbox-stage232i4-r14 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 text-sm text-slate-200" data-stage232i4-r14-manager-add-blocker-checkbox="true">
                    <input
                      type="checkbox"
                      checked={blockerValue}
                      onChange={(event) => onBlockerChange(event.target.checked)}
                      disabled={!canMutate || isSaving}
                      className="h-4 w-4 rounded border-slate-500 accent-blue-500"
                    />
                    <span>Blokuje sprawę</span>
                  </label>

                  <Button
                    type="submit"
                    disabled={!canMutate || isSaving || !titleValue.trim()}
                    className="min-h-10 w-full justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
                    data-stage232i4-r14-manager-add-action="true"
                  >
                    <Plus className="h-4 w-4" />
                    {isSaving ? 'Dodawanie...' : 'Dodaj brak'}
                  </Button>
                </div>
              </div>
            </form>

            {error ? <p className="cf-missing-manager-error-stage232i4-r14 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
          </CloseFlowDialogSection>

          <CloseFlowDialogBody className="cf-missing-manager-list-stage232i4-r14 cf-missing-manager-list-stage232i4-r10 cf-missing-manager-list-stage232i4-r11 cf-missing-manager-list-stage232i4-r12 max-h-[46vh] space-y-3 overflow-y-auto" data-stage232i4-r12-list-section="true">
            <div data-stage232i4-r14-manager-list="true" data-stage232i4-r10-manager-list="separated-scrollable-cards" data-stage232i4-r11-manager-list="wide-row-cards" data-stage232i4-r12-manager-list="title-first-cards" className="space-y-3">
              {items.length ? (
                items.map((item) => {
                  const itemId = String(item?.id || item?.raw?.id || item?.title || 'missing');
                  const itemTitle = managerItemTitle(item);
                  const itemSource = String(item?.sourceLabel || scopeLabel || 'Źródło');
                  const itemSourceTitle = asText(item?.sourceTitle);
                  const itemNote = managerItemNote(item);
                  const isBlocker = isManagerItemBlocker(item);
                  return (
                    <article key={itemId} className="cf-missing-manager-row-stage232i4-r14 cf-missing-manager-row-stage232i4-r10 cf-missing-manager-row-stage232i4-r11 cf-missing-manager-row-stage232i4-r12 cf-missing-manager-row-stage232i4-r16q rounded-2xl border border-slate-700 bg-slate-900/75 p-3 shadow-sm" data-stage232i4-r14-manager-row="true" data-stage232i4-r10-manager-row="separated-card" data-stage232i4-r11-manager-row="compact-horizontal-card" data-stage232i4-r12-manager-row="shared-shell-compact-card" data-stage232i4-r16q-manager-row="compact-horizontal-card" data-missing-item-card="true">
                      <div className="grid gap-3 xl:grid-cols-[auto_minmax(180px,1fr)_minmax(200px,1.2fr)_auto_auto] xl:items-center" data-stage232i4-r16q-manager-card-layout="single-horizontal-row">
                        <div className="flex min-w-[150px] flex-wrap items-center gap-2 text-xs" data-stage232i4-r16q-manager-badges-cell="true">
                          <span className="rounded-full border border-slate-600 bg-slate-950/80 px-2 py-0.5 font-medium text-slate-300" data-stage232i4-r14-manager-source-badge="true">{itemSource}</span>
                          {isBlocker ? <span className="rounded-full border border-red-400/30 bg-red-500/15 px-2 py-0.5 font-semibold text-red-200">Priorytet blokujący</span> : <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2 py-0.5 font-semibold text-blue-200">Brak informacyjny</span>}
                        </div>

                        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/55 px-3 py-2" data-missing-item-title-block="true">
                          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Nazwa braku</span>
                          <strong className="mt-1 block truncate text-sm font-semibold leading-5 text-slate-50" title={itemTitle} data-stage232i4-r11-manager-item-title="true" data-stage232i4-r12-manager-item-title="primary-visible-name">{itemTitle}</strong>
                        </div>

                        <p className="min-w-0 truncate text-sm leading-5 text-slate-300" title={[itemSourceTitle, itemNote].filter(Boolean).join(' · ') || 'Kartoteka klienta'} data-stage232i4-r16q-manager-source-note-cell="true">
                          {[itemSourceTitle, itemNote].filter(Boolean).join(' · ') || 'Kartoteka klienta'}
                        </p>

                        <label className="cf-missing-manager-row-checkbox-stage232i4-r14 inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200" data-stage232i4-r14-manager-row-checkbox="true" data-stage232i4-r11-manager-blocker-column="blocker-inline" data-missing-item-blocker-row="true">
                          <input
                            type="checkbox"
                            aria-label="Blokuje sprawę"
                            checked={isBlocker}
                            disabled={!canMutate || isSaving}
                            onChange={(event) => void onToggleBlocker(item, event.target.checked)}
                            className="h-4 w-4 rounded border-slate-500 accent-blue-500"
                          />
                          <span className={isBlocker ? 'whitespace-nowrap text-sm font-semibold leading-5 text-red-200' : 'whitespace-nowrap text-sm font-medium leading-5 text-slate-300'}>{isBlocker ? 'Blokuje sprawę' : 'Nie blokuje'}</span>
                        </label>

                        <div className="cf-missing-manager-row-actions-stage232i4-r11 flex shrink-0 flex-row items-center justify-end gap-2" data-stage232i4-r10-manager-row-actions="compact-inline-actions" data-stage232i4-r11-manager-actions-column="actions-inline-right" data-missing-item-actions-row="true">
                          <Button type="button" variant="outline" size="sm" disabled={!canMutate || isSaving} onClick={() => void onResolve(item)} className="min-h-9 gap-2 rounded-lg border-slate-600 bg-slate-100 px-3 text-slate-950 hover:bg-white" data-stage232i4-r14-manager-resolve-action="true">
                            <CheckCircle2 className="h-4 w-4" />
                            Uzupełnione
                          </Button>
                          <Button type="button" variant="outline" size="sm" disabled={!canMutate || isSaving} onClick={() => void onDelete(item)} className="min-h-9 gap-2 rounded-lg border-slate-600 bg-slate-100 px-3 text-slate-950 hover:bg-white" data-stage232i4-r14-manager-delete-action="true">
                            <Trash2 className="h-4 w-4" />
                            Usuń
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="cf-missing-manager-empty-stage232i4-r14 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-center" data-stage232i4-r14-manager-empty="true">
                  <strong className="block text-sm font-semibold text-slate-100">Brak otwartych braków.</strong>
                  <p className="mt-1 text-sm text-slate-400">Nowe braki pojawią się tutaj po dodaniu.</p>
                </div>
              )}
            </div>
          </CloseFlowDialogBody>
        </div>
      </CloseFlowDialogShell>
    </Dialog>
  );
}
