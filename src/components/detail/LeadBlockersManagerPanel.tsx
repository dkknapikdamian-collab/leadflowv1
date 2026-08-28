import {
  AddActionIcon,
  DeleteActionIcon,
  EditActionIcon,
  OpenActionIcon,
} from '../ui-system/ActionIcon';
import { SemanticIcon } from '../ui-system';
import { Button } from '../ui/button';
import type { MissingItemsManagerItem } from './MissingItemsManagerDialog';

export const FRT_018_LEAD_BLOCKERS_MANAGER_PANEL = 'FRT_018_LEAD_BLOCKERS_MANAGER_PANEL';

type LeadBlockersManagerPanelProps = {
  items: MissingItemsManagerItem[];
  resolvedCount?: number;
  canMutate?: boolean;
  isSaving?: boolean;
  onAdd: () => void | Promise<unknown>;
  onEdit: (item: MissingItemsManagerItem) => void | Promise<unknown>;
  onToggleBlocker: (item: MissingItemsManagerItem, blocksProgress: boolean) => void | Promise<unknown>;
  onResolve: (item: MissingItemsManagerItem) => void | Promise<unknown>;
  onResolveAll?: () => void | Promise<unknown>;
  onDelete: (item: MissingItemsManagerItem) => void | Promise<unknown>;
  onShowHistory: () => void | Promise<unknown>;
};

type Tone = 'danger' | 'warning' | 'success';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asText(value: unknown): string {
  return String(value || '').trim();
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
}

function itemRecord(item: MissingItemsManagerItem) {
  return {
    raw: asRecord(item?.raw),
    payload: asRecord(item?.payload),
  };
}

function isTruthyBooleanLike(value: unknown): boolean {
  return value === true || ['true', '1', 'yes', 'tak'].includes(asText(value).toLowerCase());
}

function isBlocker(item: MissingItemsManagerItem): boolean {
  const { raw, payload } = itemRecord(item);
  const direct = item?.isBlocker ?? item?.blocksProgress ?? item?.blocks_progress;
  if (direct !== undefined && direct !== null) return isTruthyBooleanLike(direct);
  const fallback = raw.blocksProgress ?? raw.blocks_progress ?? payload.blocksProgress ?? payload.blocks_progress;
  if (fallback !== undefined && fallback !== null) return isTruthyBooleanLike(fallback);
  return asText(item?.status ?? raw.status ?? payload.status).toLowerCase() === 'blocking_missing_item';
}

function isResolved(item: MissingItemsManagerItem): boolean {
  const { raw, payload } = itemRecord(item);
  const status = asText(item?.status ?? raw.status ?? payload.status).toLowerCase();
  return ['done', 'completed', 'resolved', 'closed'].includes(status) || Boolean(raw.completedAt || raw.completed_at || payload.resolvedAt || payload.resolved_at);
}

function itemTitle(item: MissingItemsManagerItem): string {
  const { raw, payload } = itemRecord(item);
  return firstText(
    item?.title,
    raw.title,
    raw.name,
    raw.label,
    payload.title,
    payload.name,
    payload.label,
    payload.missingTitle,
    payload.missing_title,
    payload.content,
    payload.note,
    'Brak bez nazwy',
  );
}

function itemCategory(item: MissingItemsManagerItem): string {
  const { raw, payload } = itemRecord(item);
  const value = firstText(
    raw.missingKind,
    raw.missing_kind,
    raw.category,
    raw.kind,
    payload.missingKind,
    payload.missing_kind,
    payload.category,
  );
  const labels: Record<string, string> = {
    document: 'Dokument',
    decision: 'Decyzja',
    contact: 'Kontakt',
    payment: 'Płatność',
    data: 'Dane',
    other: 'Inne',
    missing_item: 'Brak',
  };
  return labels[value.toLowerCase()] || value || 'Brak danych';
}

function itemResponsible(item: MissingItemsManagerItem): string {
  const { raw, payload } = itemRecord(item);
  return firstText(
    raw.responsibleName,
    raw.responsible_name,
    raw.assigneeName,
    raw.assignee_name,
    raw.ownerName,
    raw.owner_name,
    payload.responsibleName,
    payload.responsible_name,
    payload.assigneeName,
    payload.assignee_name,
    'Brak danych',
  );
}

function itemDueDate(item: MissingItemsManagerItem): string {
  const { raw, payload } = itemRecord(item);
  const value = firstText(raw.dueAt, raw.due_at, raw.scheduledAt, raw.scheduled_at, raw.date, payload.dueAt, payload.due_at);
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function itemPriority(item: MissingItemsManagerItem): string {
  const { raw, payload } = itemRecord(item);
  const priority = firstText(item?.priority, raw.priority, payload.priority, isBlocker(item) ? 'high' : 'medium').toLowerCase();
  return priority === 'high' ? 'Wysoki' : 'Średni';
}

function statusFor(item: MissingItemsManagerItem): { label: string; tone: Tone } {
  if (isResolved(item)) return { label: 'Rozwiązany', tone: 'success' };
  if (isBlocker(item)) return { label: 'Blokuje', tone: 'danger' };
  return { label: 'Oczekujący', tone: 'warning' };
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function exportItemsToCsv(items: MissingItemsManagerItem[]) {
  const rows = [
    ['Tytuł', 'Kategoria', 'Odpowiedzialny', 'Termin', 'Status', 'Wpływ'],
    ...items.map((item) => {
      const status = statusFor(item);
      return [itemTitle(item), itemCategory(item), itemResponsible(item), itemDueDate(item), status.label, itemPriority(item)];
    }),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(';')).join('\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'closeflow-braki-i-blokady.csv';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function LeadBlockersManagerPanel({
  items,
  resolvedCount: resolvedCountProp,
  canMutate = true,
  isSaving = false,
  onAdd,
  onEdit,
  onToggleBlocker,
  onResolve,
  onResolveAll,
  onDelete,
  onShowHistory,
}: LeadBlockersManagerPanelProps) {
  const blockingCount = items.filter((item) => !isResolved(item) && isBlocker(item)).length;
  const pendingCount = items.filter((item) => !isResolved(item) && !isBlocker(item)).length;
  const resolvedCount = resolvedCountProp ?? items.filter(isResolved).length;

  return (
    <section className="forteca-frt-018-manager" data-forteca-frt-018-manager="true" data-forteca-frt-018-source="lead-missing-items">
      <header className="forteca-frt-018-manager-header">
        <div>
          <span className="forteca-frt-018-eyebrow">Kontrola postępu</span>
          <h2>Braki i blokady</h2>
          <p>Zarządzaj brakami informacji, decyzji i zasobów, które blokują postęp sprzedaży.</p>
        </div>
        <div className="forteca-frt-018-manager-header-actions">
          <Button type="button" className="forteca-frt-018-action forteca-frt-018-action-primary" onClick={() => void onAdd()} disabled={!canMutate || isSaving} data-forteca-frt-018-add="true">
            <AddActionIcon size="sm" tone="strong" />
            Dodaj brak
          </Button>
          <Button type="button" className="forteca-frt-018-action" onClick={() => void onResolveAll?.()} disabled={!canMutate || isSaving || !items.length || !onResolveAll} data-forteca-frt-018-resolve-all="true">
            <SemanticIcon role="task_status" size="sm" className="forteca-frt-018-status-icon" />
            Oznacz jako rozwiązane
          </Button>
        </div>
      </header>

      <div className="forteca-frt-018-summary-grid" aria-label="Podsumowanie braków i blokad" data-forteca-frt-018-summary="true">
        <article className="forteca-frt-018-summary-card" data-forteca-frt-018-tone="danger">
          <span>Braki blokujące</span>
          <strong>{blockingCount}</strong>
          <small>Wymagają reakcji przed kolejnym krokiem</small>
        </article>
        <article className="forteca-frt-018-summary-card" data-forteca-frt-018-tone="warning">
          <span>Oczekujące</span>
          <strong>{pendingCount}</strong>
          <small>Otwarte, ale bez oznaczenia blokady</small>
        </article>
        <article className="forteca-frt-018-summary-card" data-forteca-frt-018-tone="success">
          <span>Rozwiązane</span>
          <strong>{resolvedCount || '—'}</strong>
          <small>{resolvedCount ? 'Z bieżących zadań i historii leada' : 'Brak danych w bieżącym źródle'}</small>
        </article>
      </div>

      <div className="forteca-frt-018-manager-grid">
        <div className="forteca-frt-018-table-card" data-forteca-frt-018-table="true">
          <div className="forteca-frt-018-table-toolbar">
            <div>
              <strong>Aktywne braki</strong>
              <span>{items.length ? `${items.length} pozycji` : 'Brak otwartych pozycji'}</span>
            </div>
            <span className="forteca-frt-018-source-note">Źródło: aktywne zadania leada</span>
          </div>

          {items.length ? (
            <div className="forteca-frt-018-table" role="table" aria-label="Lista braków i blokad">
              <div className="forteca-frt-018-table-head" role="row">
                <span role="columnheader">Blokada</span>
                <span role="columnheader">Brak</span>
                <span role="columnheader">Kategoria</span>
                <span role="columnheader">Odpowiedzialny</span>
                <span role="columnheader">Termin</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Wpływ</span>
                <span role="columnheader" aria-label="Akcje" />
              </div>
              <div className="forteca-frt-018-table-body">
                {items.map((item) => {
                  const itemId = String(item?.id || item?.raw?.id || itemTitle(item));
                  const status = statusFor(item);
                  const blocker = isBlocker(item);
                  return (
                    <article key={itemId} className="forteca-frt-018-row" role="row" data-forteca-frt-018-row="true" data-forteca-frt-018-row-id={itemId}>
                      <label className="forteca-frt-018-blocker-toggle" title={blocker ? 'Brak blokuje postęp' : 'Brak nie blokuje postępu'}>
                        <input
                          type="checkbox"
                          checked={blocker}
                          disabled={!canMutate || isSaving || isResolved(item)}
                          aria-label={`${itemTitle(item)} — blokuje postęp`}
                          onChange={(event) => void onToggleBlocker(item, event.target.checked)}
                        />
                        <span aria-hidden="true" />
                      </label>
                      <div className="forteca-frt-018-row-title" role="cell">
                        <strong title={itemTitle(item)}>{itemTitle(item)}</strong>
                        <small>{firstText(item?.note, asRecord(item?.payload).note, 'Brak dodatkowego opisu')}</small>
                      </div>
                      <span className="forteca-frt-018-row-meta" role="cell">{itemCategory(item)}</span>
                      <span className="forteca-frt-018-row-meta" role="cell">{itemResponsible(item)}</span>
                      <span className="forteca-frt-018-row-meta" role="cell">{itemDueDate(item)}</span>
                      <span className="forteca-frt-018-status-badge" data-forteca-frt-018-tone={status.tone} role="cell">{status.label}</span>
                      <span className="forteca-frt-018-status-badge" data-forteca-frt-018-tone={blocker ? 'danger' : 'warning'} role="cell">{itemPriority(item)}</span>
                      <div className="forteca-frt-018-row-actions" role="cell">
                        <Button type="button" className="forteca-frt-018-icon-action" onClick={() => void onEdit(item)} disabled={!canMutate || isSaving || isResolved(item)} aria-label={`Edytuj ${itemTitle(item)}`} title="Edytuj">
                          <EditActionIcon size="sm" />
                        </Button>
                        <Button type="button" className="forteca-frt-018-icon-action" onClick={() => void onResolve(item)} disabled={!canMutate || isSaving || isResolved(item)} aria-label={`Rozwiąż ${itemTitle(item)}`} title="Oznacz jako rozwiązany">
                          <SemanticIcon role="task_status" size="sm" className="forteca-frt-018-status-icon" />
                        </Button>
                        <Button type="button" className="forteca-frt-018-icon-action forteca-frt-018-icon-action-delete" onClick={() => void onDelete(item)} disabled={!canMutate || isSaving} aria-label={`Usuń ${itemTitle(item)}`} title="Usuń">
                          <DeleteActionIcon size="sm" tone="danger" />
                        </Button>
                        <span className="forteca-frt-018-more-icon" aria-hidden="true">⋮</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="forteca-frt-018-empty" data-forteca-frt-018-empty="true">
              <SemanticIcon role="task_status" size="lg" />
              <strong>Brak otwartych braków</strong>
              <p>Nowe braki pojawią się tutaj po dodaniu ich do tego leada.</p>
              <Button type="button" className="forteca-frt-018-action forteca-frt-018-action-primary" onClick={() => void onAdd()} disabled={!canMutate || isSaving}>
                <AddActionIcon size="sm" tone="strong" />
                Dodaj pierwszy brak
              </Button>
            </div>
          )}
        </div>

        <aside className="forteca-frt-018-rail" aria-label="Akcje braków i blokad">
          <section className="forteca-frt-018-rail-card">
            <div className="forteca-frt-018-rail-heading">
              <strong>Szybkie akcje</strong>
              <span className="forteca-frt-018-more-icon" aria-hidden="true">⋮</span>
            </div>
            <Button type="button" className="forteca-frt-018-rail-action" onClick={() => void onAdd()} disabled={!canMutate || isSaving}>
              <AddActionIcon size="sm" />
              Dodaj brak
            </Button>
            <Button type="button" className="forteca-frt-018-rail-action" disabled title="Obecny runtime nie ma bezpiecznej zbiorczej wysyłki przypomnień.">
              <SemanticIcon role="send" size="sm" className="forteca-frt-018-rail-icon" />
              Wyślij przypomnienie do wszystkich
              <span className="forteca-frt-018-unavailable">Niedostępne</span>
            </Button>
            <Button type="button" className="forteca-frt-018-rail-action" onClick={() => exportItemsToCsv(items)} disabled={!items.length}>
              <OpenActionIcon size="sm" className="forteca-frt-018-rail-icon" />
              Eksportuj do CSV
            </Button>
            <Button type="button" className="forteca-frt-018-rail-action" onClick={() => void onShowHistory()}>
              <SemanticIcon role="time" size="sm" className="forteca-frt-018-rail-icon" />
              Zobacz historię zmian
            </Button>
          </section>

          <section className="forteca-frt-018-info-card">
            <div className="forteca-frt-018-info-heading">
              <SemanticIcon role="view" size="sm" className="forteca-frt-018-info-icon" />
              <strong>Jak działają braki?</strong>
            </div>
            <p>Brak opisuje informację, decyzję lub zasób potrzebny do wykonania kolejnego kroku. Zaznacz Blokada, gdy bez tej pozycji postęp nie powinien iść dalej.</p>
            <Button type="button" className="forteca-frt-018-link-action" onClick={() => void onShowHistory()}>Dowiedz się więcej</Button>
          </section>
        </aside>
      </div>
    </section>
  );
}
