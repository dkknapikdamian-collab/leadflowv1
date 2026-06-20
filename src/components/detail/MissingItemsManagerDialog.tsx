// STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX
// STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT
// STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT
// STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH
// Shared Braki / Blokady manager dialog for LeadDetail and ClientDetail parity.
// STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX: compact one-row cards and readable add form.
// STAGE232I4_R16R_MISSING_MANAGER_PRODUCTION_FIT_NO_HORIZONTAL_SCROLL: no add form, no horizontal scroll, production compact rows.
// STAGE232I4_R16S_R2_MISSING_MANAGER_ALIGNED_COMPACT_COLUMNS_FINAL: aligned compact fixed columns, visible checkbox and narrow modal.
// STAGE232I4_R16T_MISSING_MANAGER_TOGGLE_AND_BADGE_CLEANUP: removes visual source badges, keeps visible checkbox-only blocker control and compact actions.
// STAGE232I4_R16V_TASK_UPDATE_SYSTEM_ROUTE_AND_BLOCKER_LABEL_FINAL: keeps compact visual layout and adds explicit blocker label while task updates use api/system route.
// STAGE232I4_R16X_MISSING_BLOCKER_TOGGLE_STATE_AND_ACTION_LABEL: preserves compact layout, visible blocker label, delete action and clearer completion action copy.
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { CloseFlowDialogBody, CloseFlowDialogShell } from '../ui/CloseFlowDialogShell';

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
  description = '',
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
        description={undefined}
        icon={<AlertTriangle className="h-4 w-4" />}
        className="cf-missing-manager-dialog-stage232i4-r14 cf-missing-manager-dialog-stage232i4-r10 cf-missing-manager-dialog-stage232i4-r11 cf-missing-manager-dialog-stage232i4-r12 cf-missing-manager-dialog-stage232i4-r16q cf-missing-manager-dialog-stage232i4-r16r cf-missing-manager-dialog-stage232i4-r16s-r2 cf-missing-manager-dialog-stage232i4-r16t cf-missing-manager-dialog-stage232i4-r16v cf-missing-manager-dialog-stage232i4-r16x !w-[560px] !max-w-[calc(100vw_-_32px)] sm:!max-w-[560px]"
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
          data-stage232i4-r16r-production-fit="no-horizontal-scroll-no-add-form"
          data-stage232i4-r16s-r2-aligned-compact-columns="true"
          data-stage232i4-r16t-badge-cleanup="checkbox-title-actions"
          data-stage232i4-r16v-blocker-label="visible-inline-label"
          data-stage232i4-r16x-toggle-state-visual-guard="checkbox-label-delete-action"
        >
          <CloseFlowDialogBody className="cf-missing-manager-list-stage232i4-r14 cf-missing-manager-list-stage232i4-r10 cf-missing-manager-list-stage232i4-r11 cf-missing-manager-list-stage232i4-r12 cf-missing-manager-list-stage232i4-r16r cf-missing-manager-list-stage232i4-r16s-r2 max-h-[54vh] space-y-1.5 overflow-y-auto overflow-x-hidden px-3 py-2" data-stage232i4-r12-list-section="true" data-stage232i4-r16r-list-section="no-horizontal-scroll">
            <div data-stage232i4-r14-manager-list="true" data-stage232i4-r10-manager-list="separated-scrollable-cards" data-stage232i4-r11-manager-list="wide-row-cards" data-stage232i4-r12-manager-list="title-first-cards" data-stage232i4-r16s-r2-manager-list="aligned-compact-columns" className="space-y-1.5 overflow-x-hidden">
              {items.length ? (
                items.map((item) => {
                  const itemId = String(item?.id || item?.raw?.id || item?.title || 'missing');
                  const itemTitle = managerItemTitle(item);



                  const isBlocker = isManagerItemBlocker(item);
                  return (
                    <article key={itemId} className="cf-missing-manager-row-stage232i4-r14 cf-missing-manager-row-stage232i4-r10 cf-missing-manager-row-stage232i4-r11 cf-missing-manager-row-stage232i4-r12 cf-missing-manager-row-stage232i4-r16q cf-missing-manager-row-stage232i4-r16r cf-missing-manager-row-stage232i4-r16s-r2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 shadow-sm" data-stage232i4-r14-manager-row="true" data-stage232i4-r10-manager-row="separated-card" data-stage232i4-r11-manager-row="compact-horizontal-card" data-stage232i4-r12-manager-row="shared-shell-compact-card" data-stage232i4-r16q-manager-row="compact-horizontal-card" data-stage232i4-r16r-manager-row="production-fit-compact-card" data-stage232i4-r16s-r2-manager-row="aligned-compact-fixed-columns" data-missing-item-card="true">
                                            <div className="grid w-full min-w-0 grid-cols-[92px_minmax(100px,1fr)_78px_54px] items-center gap-2 overflow-hidden" data-stage232i4-r16r-manager-card-layout="single-visible-row-no-horizontal-scroll" data-stage232i4-r16s-r2-manager-card-layout="badge-checkbox-title-done-delete-fixed-columns" data-stage232i4-r16t-manager-card-layout="checkbox-title-done-delete-fixed-columns-no-badges" data-stage232i4-r16v-manager-card-layout="blocker-label-title-actions" data-stage232i4-r16x-manager-card-layout="blocker-title-complete-delete">
                        <label className="cf-missing-manager-row-checkbox-stage232i4-r14 inline-flex h-7 w-[92px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/30 bg-slate-100 px-2 text-slate-950 shadow-sm" data-stage232i4-r14-manager-row-checkbox="true" data-stage232i4-r11-manager-blocker-column="blocker-inline" data-stage232i4-r16r-manager-blocker-compact="true" data-stage232i4-r16s-r2-manager-blocker-column="visible-fixed-checkbox" data-stage232i4-r16t-manager-blocker-column="checkbox-only-visible" data-stage232i4-r16v-manager-blocker-label="visible" data-missing-item-blocker-row="true" title={isBlocker ? 'Blokuje sprawę' : 'Nie blokuje sprawy'}>
                          <input
                            type="checkbox"
                            aria-label={isBlocker ? 'Brak blokuje sprawę' : 'Brak nie blokuje sprawy'}
                            checked={isBlocker}
                            disabled={!canMutate || isSaving}
                            onChange={(event) => void onToggleBlocker(item, event.target.checked)}
                            className="h-4 w-4 shrink-0 cursor-pointer rounded border border-slate-500 bg-white accent-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                          <span className="select-none text-[11px] font-semibold leading-none text-slate-800" data-stage232i4-r16v-manager-blocker-text="true">Blokuje</span>
                        </label>

                        <strong className="min-w-0 truncate text-[12px] font-semibold leading-5 text-slate-50" title={itemTitle} data-stage232i4-r11-manager-item-title="true" data-stage232i4-r12-manager-item-title="primary-visible-name" data-stage232i4-r16r-manager-item-title="inline-only" data-stage232i4-r16s-r2-manager-item-title="fixed-title-column" data-stage232i4-r16t-manager-item-title="compact-primary-name">{itemTitle}</strong>

                        <Button type="button" variant="outline" size="sm" disabled={!canMutate || isSaving} onClick={() => void onResolve(item)} className="h-7 min-h-0 w-[78px] rounded-md border-slate-600 bg-slate-100 px-0 text-[11px] font-semibold text-slate-950 hover:bg-white" aria-label="Oznacz brak jako uzupełniony" title="Oznacz jako uzupełnione" data-stage232i4-r14-manager-resolve-action="true" data-stage232i4-r16s-r2-manager-resolve-column="fixed" data-stage232i4-r16t-manager-resolve-column="fixed-small">
                          Uzupełnij
                        </Button>
                        <Button type="button" variant="outline" size="sm" disabled={!canMutate || isSaving} onClick={() => void onDelete(item)} className="h-7 min-h-0 w-[54px] rounded-md border-slate-600 bg-slate-100 px-0 text-[11px] font-semibold text-slate-950 hover:bg-white" data-stage232i4-r14-manager-delete-action="true" data-stage232i4-r16s-r2-manager-delete-column="fixed" data-stage232i4-r16t-manager-delete-column="fixed-small">
                          Usuń
                        </Button>
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
