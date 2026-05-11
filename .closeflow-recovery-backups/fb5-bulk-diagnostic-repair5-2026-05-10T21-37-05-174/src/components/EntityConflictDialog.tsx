// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
// CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1
// CLOSEFLOW_A2_DUPLICATE_WARNING_ACTIONS: Pokaż / Przywróć / Dodaj mimo to / Anuluj
// CLOSEFLOW_FIN9_ENTITY_CONFLICT_CASE_SUPPORT
// CLOSEFLOW_CONFLICT_DELETE_COMPANY_NOT_NULL_V25
import { AlertTriangle } from 'lucide-react';
import { DeleteActionIcon, OpenActionIcon, RestoreActionIcon } from './ui-system';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { actionIconClass } from './entity-actions';

export type EntityConflictCandidate = {
  id: string;
  entityType: 'lead' | 'client' | 'case';
  label: string;
  name?: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  statusLabel?: string;
  hiddenReason?: string;
  matchFields?: string[];
  canRestore?: boolean;
  url?: string;
};

function getEntityLabel(type: string) {
  if (type === 'case') return 'sprawa';
  return type === 'client' ? 'klient' : 'lead';
}

function getMatchLabel(field: string) {
  if (field === 'email') return 'e-mail';
  if (field === 'phone') return 'telefon';
  if (field === 'name') return 'nazwa / imię';
  if (field === 'company') return 'firma';
  return field;
}

type EntityConflictDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  candidates: EntityConflictCandidate[];
  createAnywayLabel?: string;
  onOpenChange: (open: boolean) => void;
  onShow: (candidate: EntityConflictCandidate) => void;
  onRestore?: (candidate: EntityConflictCandidate) => void | Promise<void>;
  onDeleteCandidate?: (candidate: EntityConflictCandidate) => void | Promise<void>;
  onCreateAnyway: () => void | Promise<void>;
  onCancel: () => void;
  busy?: boolean;
};

export function EntityConflictDialog({
  open,
  title = 'Możliwy duplikat w bazie',
  description = 'Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to.',
  candidates,
  createAnywayLabel = 'Dodaj mimo to',
  onOpenChange,
  onShow,
  onRestore,
  onDeleteCandidate,
  onCreateAnyway,
  onCancel,
  busy,
}: EntityConflictDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className="mt-1 rounded-2xl bg-amber-50 p-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {candidates.map((candidate) => (
            <div key={candidate.entityType + '-' + candidate.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm text-slate-950">{candidate.label}</strong>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{getEntityLabel(candidate.entityType)}</span>
                    {candidate.statusLabel ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">{candidate.statusLabel}</span> : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Pokrywa się: {(candidate.matchFields || []).map(getMatchLabel).join(', ') || 'dane kontaktowe'}.</p>
                  <p className="mt-2 text-sm text-slate-700">{[candidate.company, candidate.email, candidate.phone].filter(Boolean).join(' · ') || 'Brak dodatkowych danych kontaktowych.'}</p>
                  {candidate.hiddenReason === 'service_history' ? <p className="mt-2 text-xs text-slate-500">Ten rekord wygląda na przeniesiony do obsługi lub historii. Najbezpieczniej najpierw go otworzyć.</p> : null}
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={() => onShow(candidate)} disabled={busy}>
                    <OpenActionIcon className="mr-1 h-4 w-4" />Pokaż
                  </Button>
                  {candidate.canRestore && onRestore ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => onRestore(candidate)} disabled={busy}>
                      <RestoreActionIcon className="mr-1 h-4 w-4" />Przywróć
                    </Button>
                  ) : null}
                  {onDeleteCandidate ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => onDeleteCandidate(candidate)} disabled={busy} className={actionIconClass('danger')}>
                      <DeleteActionIcon className="mr-1 h-4 w-4" />Usuń
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>Anuluj</Button>
          <Button type="button" onClick={onCreateAnyway} disabled={busy}>{busy ? 'Zapisywanie...' : createAnywayLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
