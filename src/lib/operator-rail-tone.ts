export type OperatorRailTone =
  | 'blue'
  | 'green'
  | 'amber'
  | 'red'
  | 'purple'
  | 'slate'
  | 'neutral';

const ALLOWED_TONES = new Set<OperatorRailTone>([
  'blue',
  'green',
  'amber',
  'red',
  'purple',
  'slate',
  'neutral',
]);

type ResolveOperatorRailToneInput = {
  key?: string;
  label?: string;
  explicitTone?: OperatorRailTone | string | null;
};

function normalizeTone(value: unknown): OperatorRailTone | null {
  const normalized = String(value || '').trim().toLowerCase();

  if (ALLOWED_TONES.has(normalized as OperatorRailTone)) {
    return normalized as OperatorRailTone;
  }

  return null;
}

export function resolveOperatorRailTone({
  key,
  label,
  explicitTone,
}: ResolveOperatorRailToneInput): OperatorRailTone {
  const explicit = normalizeTone(explicitTone);
  if (explicit) return explicit;

  const text = `${key || ''} ${label || ''}`.toLowerCase();

  if (
    text.includes('kosz') ||
    text.includes('trash') ||
    text.includes('archiw') ||
    text.includes('ryzy') ||
    text.includes('blok')
  ) {
    return 'red';
  }

  if (
    text.includes('bez ruchu') ||
    text.includes('stale') ||
    text.includes('czeka') ||
    text.includes('brak')
  ) {
    return 'amber';
  }

  if (
    text.includes('aktyw') ||
    text.includes('active') ||
    text.includes('wszyst')
  ) {
    return 'blue';
  }

  if (
    text.includes('done') ||
    text.includes('zrob') ||
    text.includes('gotow')
  ) {
    return 'green';
  }

  return 'blue';
}
