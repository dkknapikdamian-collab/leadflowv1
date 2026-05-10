import type { ReactNode } from 'react';

export type StatusPillTone = 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple';

export type StatusPillProps = {
  tone?: StatusPillTone;
  children: ReactNode;
  className?: string;
};

const TONE_CLASS: Record<StatusPillTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-rose-50 text-rose-700 border-rose-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
};

export function StatusPill({ children, tone = 'neutral', className = '' }: StatusPillProps) {
  return (
    <span
      className={['cf-status-pill inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-[0.04em]', TONE_CLASS[tone], className].filter(Boolean).join(' ')}
      data-cf-ui-component="StatusPill"
      data-cf-status-tone={tone}
      data-cf-status-pill-contract="component-registry-vs2"
    >
      {children}
    </span>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API StatusPill: tone, children */
