// STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX
// Shared Braki / Blokady manager dialog for LeadDetail and ClientDetail parity.
import { AlertTriangle, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export type MissingItemsManagerItem = {
  id?: string | null;
  title?: string | null;
  status?: unknown;
  blocksProgress?: unknown;
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

function isManagerItemBlocker(item: MissingItemsManagerItem) {
  const payload = item?.payload && typeof item.payload === 'object' ? item.payload : {};
  const raw = item?.raw && typeof item.raw === 'object' ? item.raw : {};
  const status = String(item?.status || raw?.status || payload?.status || '').trim().toLowerCase();
  const direct = item?.isBlocker ?? item?.blocksProgress ?? raw?.blocksProgress ?? raw?.blocks_progress ?? payload?.blocksProgress ?? payload?.blocks_progress;
  return Boolean(status === 'blocking_missing_item' || direct === true || String(direct || '').toLowerCase() === 'true');
}

function managerItemNote(item: MissingItemsManagerItem) {
  const payload = item?.payload && typeof item.payload === 'object' ? item.payload : {};
  const raw = item?.raw && typeof item.raw === 'object' ? item.raw : {};
  return String(item?.note || raw?.note || payload?.note || payload?.content || '').trim();
}

export function MissingItemsManagerDialog({
  open,
  onOpenChange,
  scopeLabel,
  title = 'Braki / Blokady',
  description = 'Dodaj brak, ustaw czy blokuje, oznacz jako uzupełniony albo usuń.',
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
      <DialogContent
        className="cf-missing-manager-dialog-stage232i4-r14"
        data-stage232i4-r14-missing-manager-dialog={scopeLabel.toLowerCase()}
        data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          className="cf-missing-manager-add-form-stage232i4-r14"
          data-stage232i4-r14-manager-add-form="true"
          onSubmit={(event) => {
            event.preventDefault();
            void onAdd();
          }}
        >
          <Label className="cf-missing-manager-title-field-stage232i4-r14">
            Nazwa braku
            <Input
              value={titleValue}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="np. Brak dokumentu"
              disabled={!canMutate || isSaving}
              data-stage232i4-r14-manager-title-input="true"
            />
          </Label>
          <label className="cf-missing-manager-checkbox-stage232i4-r14" data-stage232i4-r14-manager-add-blocker-checkbox="true">
            <input
              type="checkbox"
              checked={blockerValue}
              onChange={(event) => onBlockerChange(event.target.checked)}
              disabled={!canMutate || isSaving}
            />
            <span>Blokuje sprawę</span>
          </label>
          <Button type="submit" disabled={!canMutate || isSaving || !titleValue.trim()} data-stage232i4-r14-manager-add-action="true">
            <Plus className="h-4 w-4" />
            {isSaving ? 'Dodawanie...' : 'Dodaj brak'}
          </Button>
          {error ? <p className="cf-missing-manager-error-stage232i4-r14">{error}</p> : null}
        </form>

        <div className="cf-missing-manager-list-stage232i4-r14" data-stage232i4-r14-manager-list="true">
          {items.length ? (
            items.map((item) => {
              const itemId = String(item?.id || item?.raw?.id || item?.title || 'missing');
              const itemTitle = String(item?.title || item?.raw?.title || 'Brak bez nazwy');
              const itemSource = String(item?.sourceLabel || scopeLabel || 'Źródło');
              const itemSourceTitle = String(item?.sourceTitle || '').trim();
              const itemNote = managerItemNote(item);
              const isBlocker = isManagerItemBlocker(item);
              return (
                <article key={itemId} className="cf-missing-manager-row-stage232i4-r14" data-stage232i4-r14-manager-row="true">
                  <span className="cf-missing-manager-row-icon-stage232i4-r14" aria-hidden="true"><AlertTriangle className="h-4 w-4" /></span>
                  <div className="cf-missing-manager-row-title-stage232i4-r14">
                    <small data-stage232i4-r14-manager-source-badge="true">[{itemSource}] {isBlocker ? 'Blokada' : 'Brak'}</small>
                    <strong>{itemTitle}</strong>
                    {itemSourceTitle || itemNote ? <p>{[itemSourceTitle, itemNote].filter(Boolean).join(' · ')}</p> : null}
                  </div>
                  <label className="cf-missing-manager-row-checkbox-stage232i4-r14" data-stage232i4-r14-manager-row-checkbox="true">
                    <input
                      type="checkbox"
                      aria-label="Blokuje"
                      checked={isBlocker}
                      disabled={!canMutate || isSaving}
                      onChange={(event) => void onToggleBlocker(item, event.target.checked)}
                    />
                    <span>Blokuje</span>
                  </label>
                  <Button type="button" variant="outline" size="sm" disabled={!canMutate || isSaving} onClick={() => void onResolve(item)} data-stage232i4-r14-manager-resolve-action="true">
                    Uzupełnione
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled={!canMutate || isSaving} onClick={() => void onDelete(item)} data-stage232i4-r14-manager-delete-action="true">
                    Usuń
                  </Button>
                </article>
              );
            })
          ) : (
            <div className="cf-missing-manager-empty-stage232i4-r14" data-stage232i4-r14-manager-empty="true">
              <strong>Brak otwartych braków.</strong>
              <p>Nowe braki pojawią się tutaj po dodaniu.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Zamknij
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
