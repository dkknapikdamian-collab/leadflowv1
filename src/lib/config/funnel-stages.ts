import type { SalesFunnelMovementRiskLevel } from '../owner-control/sales-funnel-movement';
import { resolveCloseflowMetricIconTone } from '../../components/ui-system';
import type { CloseFlowStatusTone } from './lead-status';

export type FunnelStageTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';
export type FunnelOwnerFilter = 'move_now' | 'no_next_move' | 'silent_7' | 'high_risk' | 'money';

export const FUNNEL_STAGE_CONFIG = [
  { key: 'new', label: 'Nowe', tone: 'blue' },
  { key: 'contact', label: 'Kontakt', tone: 'blue' },
  { key: 'qualification', label: 'Kwalifikacja', tone: 'blue' },
  { key: 'proposal_sent', label: 'Oferta wyslana', tone: 'amber' },
  { key: 'waiting_response', label: 'Czeka na odpowiedz', tone: 'amber' },
  { key: 'negotiation', label: 'Negocjacje', tone: 'amber' },
  { key: 'service', label: 'Do obslugi', tone: 'green' },
  { key: 'lost', label: 'Utracone', tone: 'neutral' },
  { key: 'other', label: 'Inne', tone: 'neutral' },
] as const;

export const FUNNEL_OWNER_TILE_CONFIG: Record<FunnelOwnerFilter, {
  label: string;
  helper: string;
  tone: FunnelStageTone;
  iconToneKey: string;
  valueKind: 'count' | 'money';
}> = {
  move_now: { label: 'Do ruchu teraz', helper: 'Ryzyko, cisza albo brak kroku.', tone: 'blue', iconToneKey: 'funnel:move_now:blue:Target', valueKind: 'count' },
  no_next_move: { label: 'Bez kroku', helper: 'Rekordy bez akcji.', tone: 'amber', iconToneKey: 'funnel:no_next_move:amber:Filter', valueKind: 'count' },
  silent_7: { label: 'Cisza 7+', helper: 'Brak kontaktu 7+ dni.', tone: 'purple', iconToneKey: 'funnel:silent_7:purple:Clock3', valueKind: 'count' },
  high_risk: { label: 'Wysokie ryzyko', helper: 'High i critical.', tone: 'red', iconToneKey: 'funnel:high_risk:red:ShieldAlert', valueKind: 'count' },
  money: { label: 'Pieniadze', helper: 'Kliknij - pokaz rekordy, z ktorych liczona jest kwota.', tone: 'green', iconToneKey: 'funnel:money:green:PaymentEntityIcon', valueKind: 'money' },
};

export function resolveFunnelStageFilterTone(key: string, label: string): FunnelStageTone {
  const source = `${key} ${label}`.toLowerCase();
  if (key === 'all' || source.includes('wszystkie')) return resolveCloseflowMetricIconTone({ id: 'all', label, semantic: 'all' });
  if (source.includes('utrac') || source.includes('lost')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'lost' });
  if (source.includes('obslug') || source.includes('moved_to_service')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'do obslugi' });
  if (source.includes('negocj')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'negocjacje' });
  if (source.includes('kontakt')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'kontakt' });
  if (source.includes('kwalifik')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'kwalifikacja' });
  if (source.includes('oferta') || source.includes('czeka') || source.includes('odp')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'waiting' });
  if (source.includes('now')) return resolveCloseflowMetricIconTone({ id: key, label, semantic: 'lead' });
  return resolveCloseflowMetricIconTone({ id: key, label, semantic: label, fallback: 'neutral' });
}

export function getOwnerRiskLabel(level: SalesFunnelMovementRiskLevel | string) {
  if (level === 'critical') return 'krytyczne';
  if (level === 'high') return 'wysokie';
  if (level === 'medium') return 'srednie';
  return 'niskie';
}

export function getOwnerRiskBadgeClass(level: SalesFunnelMovementRiskLevel | string) {
  if (level === 'critical') return 'border-red-200 bg-red-50 text-red-700';
  if (level === 'high') return 'border-amber-200 bg-amber-50 text-amber-800';
  if (level === 'medium') return 'border-sky-200 bg-sky-50 text-sky-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function getOwnerRiskTone(level: string): CloseFlowStatusTone {
  if (level === 'high' || level === 'critical') return 'red';
  if (level === 'medium') return 'amber';
  return 'blue';
}
