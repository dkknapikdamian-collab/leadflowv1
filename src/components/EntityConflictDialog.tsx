import { useState } from 'react';
import { AlertTriangle, ArrowRight, Check, Eye, Info, UsersRound } from 'lucide-react';
// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
// CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1
// CLOSEFLOW_A2_DUPLICATE_WARNING_ACTIONS: Pokaż / Przywróć / Dodaj mimo to / Anuluj
// CLOSEFLOW_FIN9_ENTITY_CONFLICT_CASE_SUPPORT
// CLOSEFLOW_CONFLICT_DELETE_COMPANY_NOT_NULL_V25

import { DeleteActionIcon, OpenActionIcon, RestoreActionIcon } from './ui-system';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { actionButtonClass } from './entity-actions';

export type EntityConflictCandidate = {
  id: string;
  entityType: 'lead' | 'client' | 'case';
  label: string;
  name?: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  sourceLabel?: string | null;
  owner?: string | null;
  ownerName?: string | null;
  ownerId?: string | null;
  lastContactAt?: string | null;
  last_contact_at?: string | null;
  status?: string | null;
  statusLabel?: string;
  hiddenReason?: string;
  reason?: string;
  matches?: string[];
  matchFields?: string[];
  canRestore?: boolean;
  url?: string;
};

export type EntityConflictDraft = {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  lastContactAt?: string | null;
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
  variant?: 'default' | 'forteca-lead-duplicate';
  draft?: EntityConflictDraft | null;
  createAnywayLabel?: string;
  onOpenChange: (open: boolean) => void;
  onShow: (candidate: EntityConflictCandidate) => void;
  onRestore?: (candidate: EntityConflictCandidate) => void | Promise<void>;
  onDeleteCandidate?: (candidate: EntityConflictCandidate) => void | Promise<void>;
  onCreateAnyway: () => void | Promise<void>;
  onCancel: () => void;
  busy?: boolean;
};

function textOrDash(value: unknown) {
  const text = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
  return text || '—';
}

function displayName(candidate: EntityConflictCandidate) {
  return textOrDash(candidate.name || candidate.label || candidate.company);
}

function displayInitials(value: unknown) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '—';
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function formatSource(value: unknown) {
  const source = String(value || '').trim().toLowerCase();
  const labels: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    messenger: 'Messenger',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    'e-mail': 'E-mail',
    form: 'Formularz',
    formularz: 'Formularz',
    phone: 'Telefon',
    telefon: 'Telefon',
    referral: 'Polecenie',
    polecenie: 'Polecenie',
    cold_outreach: 'Cold outreach',
    other: 'Inne',
    inne: 'Inne',
  };
  return labels[source] || textOrDash(value);
}

function formatDate(value: unknown) {
  const raw = String(value || '').trim();
  if (!raw) return '—';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function getMatchFields(candidate: EntityConflictCandidate) {
  const fields = candidate.matchFields || candidate.matches || [];
  return Array.from(new Set(fields));
}

function getFortecaReason(candidate: EntityConflictCandidate) {
  const fields = getMatchFields(candidate).map(getMatchLabel);
  if (fields.length) return `Dopasowanie po: ${fields.join(', ')}`;
  if (candidate.reason) return candidate.reason;
  return 'Zgodne dane kontaktowe';
}

function getCandidateOwner(candidate: EntityConflictCandidate) {
  const owner = candidate.ownerName || candidate.owner || '';
  return owner && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(owner) ? owner : '—';
}

export function EntityConflictDialog({
  open,
  title = 'Możliwy duplikat w bazie',
  description = 'Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to.',
  candidates,
  variant = 'default',
  draft,
  createAnywayLabel = 'Dodaj mimo to',
  onOpenChange,
  onShow,
  onRestore,
  onDeleteCandidate,
  onCreateAnyway,
  onCancel,
  busy,
}: EntityConflictDialogProps) {
  const [previewCandidateKey, setPreviewCandidateKey] = useState<string | null>(null);
  const isFortecaLeadDuplicate = variant === 'forteca-lead-duplicate';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={isFortecaLeadDuplicate ? 'forteca-frt-013-dialog' : 'max-w-2xl'}
        data-forteca-frt-013-lead-duplicate={isFortecaLeadDuplicate ? 'true' : undefined}
      >
        {isFortecaLeadDuplicate ? (
          <>
            <DialogHeader className="forteca-frt-013-header">
              <div className="forteca-frt-013-header-inner">
                <span className="forteca-frt-013-header-icon" aria-hidden="true"><UsersRound /></span>
                <div className="forteca-frt-013-header-copy">
                  <DialogTitle className="forteca-frt-013-title">{title === 'Możliwy duplikat w bazie' ? 'Podobny lead już istnieje' : title}</DialogTitle>
                  <p className="forteca-frt-013-description">
                    {description === 'Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to.'
                      ? `Znaleźliśmy ${candidates.length} ${candidates.length === 1 ? 'podobny lead' : 'podobne leady'}. Sprawdź istniejące rekordy albo świadomie utwórz nowy mimo to.`
                      : description}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="forteca-frt-013-body" data-forteca-frt-013-body="true">
              <section className="forteca-frt-013-draft-card" data-forteca-frt-013-new-lead="true">
                <span className="forteca-frt-013-draft-badge">NOWY LEAD</span>
                <div className="forteca-frt-013-draft-grid">
                  <div className="forteca-frt-013-draft-identity">
                    <strong>{textOrDash(draft?.company)}</strong>
                    <span>{textOrDash(draft?.name)}</span>
                  </div>
                  <div className="forteca-frt-013-draft-meta">
                    <span>{textOrDash(draft?.email)}</span>
                    <span>{textOrDash(draft?.phone)}</span>
                  </div>
                </div>
              </section>

              <div className="forteca-frt-013-section-heading">
                <h3>Możliwe dopasowania</h3>
                <span title="Dopasowania wynikają z danych bieżącego formularza i rekordów w workspace." aria-label="Informacja o dopasowaniu"><Info /></span>
              </div>

              <div className="forteca-frt-013-candidates" data-forteca-frt-013-candidates="true">
                {candidates.map((candidate, index) => {
                  const candidateKey = candidate.entityType + '-' + candidate.id;
                  const isPreviewOpen = previewCandidateKey === candidateKey;
                  return (
                    <article className="forteca-frt-013-candidate-card" key={candidateKey} data-forteca-frt-013-candidate={candidateKey}>
                      <div className="forteca-frt-013-candidate-head">
                        <span className={index === 0 ? 'forteca-frt-013-match-badge forteca-frt-013-match-badge--best' : 'forteca-frt-013-match-badge'}>
                          {index === 0 ? 'Najlepsze dopasowanie' : 'Inne dopasowanie'}
                        </span>
                        <span className="forteca-frt-013-entity-kind">{getEntityLabel(candidate.entityType)}</span>
                      </div>

                      <div className="forteca-frt-013-candidate-main">
                        <span className="forteca-frt-013-initials" aria-hidden="true">{displayInitials(displayName(candidate))}</span>
                        <div className="forteca-frt-013-candidate-identity">
                          <strong>{displayName(candidate)}</strong>
                          <span>{textOrDash(candidate.company)}</span>
                        </div>
                        <dl className="forteca-frt-013-candidate-meta">
                          <div><dt>E-mail</dt><dd>{textOrDash(candidate.email)}</dd></div>
                          <div><dt>Telefon</dt><dd>{textOrDash(candidate.phone)}</dd></div>
                          <div><dt>Źródło</dt><dd>{formatSource(candidate.sourceLabel || candidate.source)}</dd></div>
                          <div><dt>Właściciel</dt><dd>{getCandidateOwner(candidate)}</dd></div>
                          <div><dt>Ostatni kontakt</dt><dd>{formatDate(candidate.lastContactAt || candidate.last_contact_at)}</dd></div>
                        </dl>
                      </div>

                      <div className={index === 0 ? 'forteca-frt-013-reason forteca-frt-013-reason--best' : 'forteca-frt-013-reason'}>
                        <Check aria-hidden="true" />
                        <span>{getFortecaReason(candidate)}</span>
                      </div>

                      <div className="forteca-frt-013-candidate-actions">
                        <Button type="button" variant="outline" className="forteca-frt-013-open" onClick={() => onShow(candidate)} disabled={busy}>
                          Otwórz istniejący
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="forteca-frt-013-preview"
                          onClick={() => setPreviewCandidateKey(isPreviewOpen ? null : candidateKey)}
                          aria-expanded={isPreviewOpen}
                          disabled={busy}
                        >
                          <Eye aria-hidden="true" /> Podgląd <ArrowRight aria-hidden="true" />
                        </Button>
                      </div>

                      {isPreviewOpen ? (
                        <div className="forteca-frt-013-preview-panel" data-forteca-frt-013-preview="true">
                          <strong>Podgląd bieżącego rekordu</strong>
                          <span>{textOrDash(candidate.email)} · {textOrDash(candidate.phone)} · {formatSource(candidate.sourceLabel || candidate.source)}</span>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>

              <div className="forteca-frt-013-info-callout" data-forteca-frt-013-force-create-note="true">
                <Info aria-hidden="true" />
                <p>Nie masz pewności? Utworzymy nowy lead jako osobny rekord po świadomym potwierdzeniu. Automatyczne scalanie nie jest wykonywane.</p>
              </div>
            </div>

            <DialogFooter className="forteca-frt-013-footer">
              <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>Anuluj</Button>
              <Button type="button" onClick={onCreateAnyway} disabled={busy} data-forteca-frt-013-force-create="true">
                {busy ? 'Zapisywanie...' : createAnywayLabel}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
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
                    <Button type="button" variant="outline" size="sm" onClick={() => onDeleteCandidate(candidate)} disabled={busy} className={actionButtonClass('danger')}>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
