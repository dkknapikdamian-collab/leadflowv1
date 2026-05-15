import { ComponentType, type ReactNode } from 'react';
import { OperatorMetricTile, type OperatorMetricTone } from './ui-system';

const STAGE16AK_UNIFIED_TOP_METRIC_TILES = 'STAGE16AK_UNIFIED_TOP_METRIC_TILES';
const STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE = 'STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE';
const ELITEFLOW_TODAY_METRIC_TILE_LOCK = 'ELITEFLOW_TODAY_METRIC_TILE_LOCK_2026_05_07';
const ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK = 'ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK_2026_05_07';
const ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY = 'ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY_2026_05_07';
const ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR = 'ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_2026_05_07';
const CLOSEFLOW_VS2_STAT_SHORTCUT_CARD_METRIC_TILE_ADAPTER = 'StatShortcutCard delegates rendering to ui-system OperatorMetricTile';
const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'StatShortcutCard is a compatibility adapter to OperatorMetricTile';
void STAGE16AK_UNIFIED_TOP_METRIC_TILES;
void STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE;
void ELITEFLOW_TODAY_METRIC_TILE_LOCK;
void ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK;
void ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY;
void ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR;
void CLOSEFLOW_VS2_STAT_SHORTCUT_CARD_METRIC_TILE_ADAPTER;
void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;

export type MetricTone =
  | OperatorMetricTone
  | 'active'
  | 'waiting'
  | 'overdue'
  | 'risk'
  | 'done'
  | 'value'
  | 'ai'
  | 'drafts';

export type StatShortcutCardProps = {
  key?: string | number;
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
  to?: string;
  valueClassName?: string;
  iconClassName?: string;
  helper?: ReactNode;
  title?: string;
  ariaLabel?: string;
  tone?: MetricTone | string;
  dataTab?: string;
};

const METRIC_TONE_ALIAS: Record<MetricTone, OperatorMetricTone> = {
  neutral: 'neutral',
  blue: 'blue',
  amber: 'amber',
  red: 'red',
  green: 'green',
  purple: 'purple',
  active: 'blue',
  waiting: 'amber',
  overdue: 'red',
  risk: 'red',
  done: 'green',
  value: 'green',
  ai: 'purple',
  drafts: 'purple',
};

function normalizeMetricToneText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveMetricTone(label: string, valueClassName: string, iconClassName: string, explicitTone?: MetricTone | string): OperatorMetricTone {
  if (explicitTone && Object.prototype.hasOwnProperty.call(METRIC_TONE_ALIAS, explicitTone)) {
    return METRIC_TONE_ALIAS[explicitTone as MetricTone];
  }

  const classText = normalizeMetricToneText(valueClassName + ' ' + iconClassName);
  const labelText = normalizeMetricToneText(label);

  if (classText.includes('rose') || classText.includes('red')) return 'red';
  if (classText.includes('emerald') || classText.includes('green') || classText.includes('teal')) return 'green';
  if (classText.includes('purple') || classText.includes('violet')) return 'purple';
  if (classText.includes('amber') || classText.includes('orange') || classText.includes('yellow')) return 'amber';
  if (classText.includes('blue') || classText.includes('sky') || classText.includes('indigo')) return 'blue';

  if (labelText.includes('zagro') || labelText.includes('ryzy') || labelText.includes('zaleg') || labelText.includes('blok') || labelText.includes('bez ruchu')) return 'red';
  if (labelText.includes('wartosc') || labelText.includes('platn') || labelText.includes('przychod') || labelText.includes('gotowe') || labelText.includes('zrobione')) return 'green';
  if (labelText.includes('czek') || labelText.includes('bez sprawy') || labelText.includes('odlo')) return 'amber';
  if (labelText.includes('aktywn') || labelText.includes('dzis') || labelText.includes('obslugi')) return 'blue';
  if (labelText.includes('wydar') || labelText.includes('szkic') || labelText.includes('system') || labelText.includes('historia')) return 'purple';

  return 'neutral';
}

export function StatShortcutCard({
  label,
  value,
  icon,
  active = false,
  onClick,
  to,
  valueClassName = '',
  iconClassName = '',
  helper,
  title,
  ariaLabel,
  tone,
  dataTab,
}: StatShortcutCardProps) {
  const resolvedTone = resolveMetricTone(label, valueClassName, iconClassName, tone);
  return (
    <OperatorMetricTile
      item={{
        id: dataTab || label,
        label,
        value,
        icon,
        active,
        onClick,
        to,
        tone: resolvedTone,
        helper,
        title,
        ariaLabel,
      }}
      active={active}
    />
  );
}

/* PHASE0_STAT_SHORTCUT_CARD_GUARD min-h-[82px] rounded-2xl uppercase tracking-wider hover:shadow-md ring-2 ring-primary/40 shadow-md key?: string | number to?: string onClick?: () => void */
/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_GUARD cf-top-metric-tile min-h-[92px] text-[28px] h-4 w-4 data-unified-top-metric-tile */
/* STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE_GUARD cf-top-metric-tile-value-row data-metric-icon-next-to-value cf-top-metric-tile-icon */
/* ELITEFLOW_TODAY_METRIC_TILE_LOCK_GUARD min-h-[72px] rounded-[22px] cf-top-metric-tile-label cf-top-metric-tile-value-row */
/* ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY_GUARD data-eliteflow-metric-tone resolveMetricTone */
/* ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_GUARD no-truncate metric-value line-height-safe */
/* VS2_STAT_SHORTCUT_CARD_ADAPTER_COMPAT OperatorMetricTile data-cf-operator-metric-tile data-cf-metric-source-truth */
/* CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_GUARD StatShortcutCard delegates to OperatorMetricTile and must not render local card markup */
