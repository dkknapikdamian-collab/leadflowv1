import { ArrowRight, CalendarDays, CheckCircle2, CheckSquare, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EntityActionButton } from './entity-actions';
import { Button } from './ui/button';
import { EntityIcon } from './ui-system';
import '../styles/work-item-card.css';

const STAGE227G1_TODAY_RESCHEDULE_SOURCE_OF_TRUTH = 'Today work item card exposes calendar-like +1D/+3D/+1W reschedule actions from one visual source';
void STAGE227G1_TODAY_RESCHEDULE_SOURCE_OF_TRUTH;

export type WorkItemCardKind = 'task' | 'event';
export type WorkItemCardTone = 'neutral' | 'danger' | 'success';

const STAGE227G1R1_TODAY_REASON_COPY_FINAL_REMOVAL = 'WorkItemCard never renders Powod/Powód helper copy and always exposes Today reschedule actions when passed';
void STAGE227G1R1_TODAY_REASON_COPY_FINAL_REMOVAL;

export function getWorkItemCardStatusTone(statusLabel: string, options?: { completed?: boolean; overdue?: boolean }): WorkItemCardTone {
  if (options?.completed || /zrobione|wykonane|completed|done/i.test(statusLabel)) return 'success';
  if (options?.overdue || /zaleg|po terminie|overdue/i.test(statusLabel)) return 'danger';
  return 'neutral';
}

function normalizeWorkItemHelperStage227G1R1(value?: string) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return '';
  if (/^pow[oó]d\s*:/i.test(text)) return '';
  if (/zaplanowane\s+(zadanie|wydarzenie)\s+w\s+najbli/i.test(text)) return '';
  return text;
}

type WorkItemCardProps = {
  kind: WorkItemCardKind;
  title: string;
  dateLabel: string;
  statusLabel: string;
  tone?: WorkItemCardTone;
  href?: string;
  helper?: string;
  compact?: boolean;
  completed?: boolean;
  onOpen?: () => void;
  onDone?: () => void;
  doneBusy?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteBusy?: boolean;
  shiftActions?: Array<{
    label: string;
    busy?: boolean;
    onClick: () => void;
  }>;
};

export default function WorkItemCard({
  kind,
  title,
  dateLabel,
  statusLabel,
  tone = 'neutral',
  href,
  helper,
  compact = false,
  completed = false,
  onOpen,
  onDone,
  doneBusy = false,
  onEdit,
  onDelete,
  deleteBusy = false,
  shiftActions = [],
}: WorkItemCardProps) {
  const label = kind === 'task' ? 'Zadanie' : 'Wydarzenie';
  const Icon = kind === 'task' ? CheckSquare : CalendarDays;
  const visibleHelperStage227G1R1 = normalizeWorkItemHelperStage227G1R1(helper);
  const titleNode = href ? (
    <Link to={href} className="cf-work-item-card-title" onClick={onOpen}>
      {title}
    </Link>
  ) : (
    <button type="button" className="cf-work-item-card-title cf-work-item-card-title-button" onClick={onOpen}>
      {title}
    </button>
  );

  return (
    <article
      className="cf-work-item-card"
      data-stage116-today-work-item-card-source-truth="true"
      data-stage227g1-today-calendar-action-source="calendar-selected-day-v9-actions"
      data-work-item-kind={kind}
      data-work-item-tone={tone}
      data-work-item-completed={completed ? 'true' : 'false'}
      data-work-item-compact={compact ? 'true' : 'false'}
    >
      <div className="cf-work-item-card-icon" aria-hidden="true">
        {kind === 'task' ? <Icon className="h-4 w-4" /> : <EntityIcon entity="event" className="h-4 w-4" />}
      </div>
      <div className="cf-work-item-card-main">
        <div className="cf-work-item-card-topline">
          <span className="cf-work-item-card-kind">{label}</span>
          <span className="cf-work-item-card-status">{statusLabel}</span>
        </div>
        {titleNode}
        {visibleHelperStage227G1R1 ? <p className="cf-work-item-card-helper">{visibleHelperStage227G1R1}</p> : null}
        <p className="cf-work-item-card-date">{dateLabel}</p>
      </div>
      <div className="cf-work-item-card-actions">
        {shiftActions.map((action) => (
          <Button
            key={action.label}
            type="button"
            size="sm"
            variant="outline"
            className="cf-vst-button cf-selected-day-v9-action cf-work-item-card-shift"
            data-stage227g1-today-reschedule-action="true"
            disabled={Boolean(action.busy)}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              action.onClick();
            }}
          >
            {action.busy ? '...' : action.label}
          </Button>
        ))}
        {onDone ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cf-work-item-card-done"
            data-stage116-work-item-done-action="true"
            disabled={doneBusy || completed}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDone();
            }}
          >
            {doneBusy ? 'Zapisywanie...' : <><CheckCircle2 className="h-4 w-4" /> Zrobione</>}
          </Button>
        ) : null}
        {onEdit ? <Button type="button" size="sm" variant="outline" onClick={onEdit}>Edytuj</Button> : null}
        {onDelete ? (
          <EntityActionButton
            type="button"
            size="sm"
            variant="ghost"
            tone="danger"
            onClick={onDelete}
            disabled={deleteBusy}
            aria-label={deleteBusy ? 'Usuwanie' : 'Kosz'}
            title={deleteBusy ? 'Usuwanie' : 'Kosz'}
          >
            {deleteBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </EntityActionButton>
        ) : null}
        {href ? (
          <Link to={href} className="cf-work-item-card-open" aria-label="Otwórz wpis">
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
