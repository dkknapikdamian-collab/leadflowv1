/* LF-UI-SOT-007_OWNER {"schema":"LF-UI-SOT-007.owner.v1","ownerId":"semantic:icon-geometry","concerns":["ICON_GEOMETRY"],"scope":"global","consumerRoots":["src/components/ui-system/ActionIcon.tsx","src/components/ui-system/EntityIcon.tsx"],"role":"canonical-owner","boundary":"global-semantic","whyNotGlobal":"This component is the registered geometry owner for semantic icons.","whyNotDuplicate":"The registry maps ICON_GEOMETRY to this single reachable component.","activePatchLayer":false,"historicalImplementationHooks":[]} */
// CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1
// Jedno źródło prawdy dla standardowych ikon CloseFlow.
// Ten komponent jest fundamentem UI-2. Runtime migracja widoków idzie etapami.

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Loader2,
  Lightbulb,
  Link2,
  LogIn,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Pin,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Wallet,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import { ACTION_ICON_MAP } from '../../components/ui-system/action-icon-registry';

export type SemanticIconRole =
  | 'add'
  | 'ai'
  | 'auth'
  | 'case'
  | 'close'
  | 'company_property'
  | 'copy'
  | 'delete'
  | 'edit'
  | 'email'
  | 'event'
  | 'filter'
  | 'finance'
  | 'goal'
  | 'hint'
  | 'loading'
  | 'link'
  | 'navigation'
  | 'note'
  | 'notification'
  | 'person'
  | 'pause'
  | 'phone'
  | 'pin'
  | 'refresh'
  | 'risk_alert'
  | 'safety'
  | 'search'
  | 'send'
  | 'settings'
  | 'task_status'
  | 'time'
  | 'view';

export type SemanticIconTone =
  | 'primary'
  | 'neutral'
  | 'danger'
  | 'contact'
  | 'ai'
  | 'case'
  | 'event'
  | 'finance'
  | 'note'
  | 'notification'
  | 'person'
  | 'task'
  | 'time';

export type SemanticIconSize = 'xs' | 'sm' | 'md' | 'lg';

export type SemanticIconConfig = {
  role: SemanticIconRole;
  tone: SemanticIconTone;
  label: string;
  defaultIcon: LucideIcon;
  migrationStage: 'UI-2' | 'UI-3' | 'UI-4' | 'Finance V1' | 'later';
};

export const semanticIconConfig = {
  add: { role: 'add', tone: 'primary', label: 'Dodaj', defaultIcon: Plus, migrationStage: 'UI-2' },
  ai: { role: 'ai', tone: 'ai', label: 'AI', defaultIcon: Sparkles, migrationStage: 'UI-2' },
  auth: { role: 'auth', tone: 'neutral', label: 'Logowanie', defaultIcon: LogOut, migrationStage: 'later' },
  case: { role: 'case', tone: 'case', label: 'Sprawa', defaultIcon: Briefcase, migrationStage: 'UI-2' },
  close: { role: 'close', tone: 'neutral', label: 'Zamknij', defaultIcon: X, migrationStage: 'later' },
  company_property: { role: 'company_property', tone: 'neutral', label: 'Firma / nieruchomość', defaultIcon: Building2, migrationStage: 'later' },
  copy: { role: 'copy', tone: 'neutral', label: 'Kopiuj', defaultIcon: Copy, migrationStage: 'UI-2' },
  delete: { role: 'delete', tone: 'danger', label: 'Usuń', defaultIcon: ACTION_ICON_MAP.delete, migrationStage: 'UI-2' },
  edit: { role: 'edit', tone: 'neutral', label: 'Edytuj', defaultIcon: Pencil, migrationStage: 'UI-2' },
  email: { role: 'email', tone: 'contact', label: 'E-mail', defaultIcon: Mail, migrationStage: 'UI-3' },
  event: { role: 'event', tone: 'event', label: 'Wydarzenie', defaultIcon: CalendarClock, migrationStage: 'UI-2' },
  filter: { role: 'filter', tone: 'neutral', label: 'Filtr', defaultIcon: Filter, migrationStage: 'later' },
  finance: { role: 'finance', tone: 'finance', label: 'Finanse', defaultIcon: DollarSign, migrationStage: 'Finance V1' },
  goal: { role: 'goal', tone: 'primary', label: 'Cel', defaultIcon: Target, migrationStage: 'later' },
  hint: { role: 'hint', tone: 'neutral', label: 'Wskazówka', defaultIcon: Lightbulb, migrationStage: 'UI-2' },
  loading: { role: 'loading', tone: 'neutral', label: 'Ładowanie', defaultIcon: Loader2, migrationStage: 'later' },
  link: { role: 'link', tone: 'task', label: 'Link', defaultIcon: Link2, migrationStage: 'UI-3' },
  navigation: { role: 'navigation', tone: 'neutral', label: 'Nawigacja', defaultIcon: ArrowRight, migrationStage: 'later' },
  note: { role: 'note', tone: 'note', label: 'Notatka', defaultIcon: FileText, migrationStage: 'UI-4' },
  notification: { role: 'notification', tone: 'notification', label: 'Powiadomienie', defaultIcon: Bell, migrationStage: 'later' },
  person: { role: 'person', tone: 'person', label: 'Osoba', defaultIcon: UserRound, migrationStage: 'UI-3' },
  pause: { role: 'pause', tone: 'event', label: 'Wstrzymane', defaultIcon: PauseCircle, migrationStage: 'UI-2' },
  phone: { role: 'phone', tone: 'contact', label: 'Telefon', defaultIcon: Phone, migrationStage: 'UI-3' },
  pin: { role: 'pin', tone: 'neutral', label: 'Przypięte', defaultIcon: Pin, migrationStage: 'later' },
  refresh: { role: 'refresh', tone: 'neutral', label: 'Odśwież', defaultIcon: RefreshCw, migrationStage: 'later' },
  risk_alert: { role: 'risk_alert', tone: 'danger', label: 'Ryzyko / alert', defaultIcon: AlertTriangle, migrationStage: 'UI-2' },
  safety: { role: 'safety', tone: 'task', label: 'Bezpieczeństwo', defaultIcon: ShieldCheck, migrationStage: 'UI-2' },
  search: { role: 'search', tone: 'neutral', label: 'Szukaj', defaultIcon: Search, migrationStage: 'later' },
  send: { role: 'send', tone: 'primary', label: 'Wyślij', defaultIcon: Send, migrationStage: 'later' },
  settings: { role: 'settings', tone: 'neutral', label: 'Ustawienia', defaultIcon: Settings, migrationStage: 'later' },
  task_status: { role: 'task_status', tone: 'task', label: 'Zadanie / status', defaultIcon: CheckCircle2, migrationStage: 'UI-2' },
  time: { role: 'time', tone: 'time', label: 'Czas', defaultIcon: Clock, migrationStage: 'UI-2' },
  view: { role: 'view', tone: 'neutral', label: 'Podgląd', defaultIcon: Eye, migrationStage: 'later' },
} satisfies Record<SemanticIconRole, SemanticIconConfig>;

export const semanticIconCriticalRoles = [
  'add',
  'ai',
  'case',
  'copy',
  'delete',
  'edit',
  'event',
  'risk_alert',
  'task_status',
  'time',
] as const;

export type SemanticIconCriticalRole = (typeof semanticIconCriticalRoles)[number];

function semanticToneClassName(tone: SemanticIconTone) {
  // Color ownership lives in the canonical VST CSS adapter. Keeping the
  // tone in the class name preserves the public API without copying palette
  // values or Tailwind color utilities into this runtime component.
  return `cf-vst-semantic-icon-tone-${tone}`;
}

const sizeClassName: Record<SemanticIconSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type SemanticIconProps = Omit<LucideProps, 'ref' | 'role'> & {
  role: SemanticIconRole;
  size?: SemanticIconSize;
  tone?: SemanticIconTone;
  title?: string;
  decorative?: boolean;
  iconOverride?: LucideIcon;
  className?: string;
};

export function SemanticIcon({
  role,
  size = 'sm',
  tone,
  title,
  decorative = true,
  iconOverride,
  className,
  ...props
}: SemanticIconProps) {
  const config = semanticIconConfig[role];
  const Icon = iconOverride || config.defaultIcon;
  const resolvedTone = tone || config.tone;
  const accessibleProps = decorative
    ? { 'aria-hidden': true as const }
    : { 'aria-label': title || config.label, role: 'img' as const };

  return (
    <Icon
      className={cx(
        'cf-vst-semantic-icon',
        sizeClassName[size],
        semanticToneClassName(resolvedTone),
        role === 'loading' && 'animate-spin',
        className,
      )}
      data-cf-vst-icon-tone={resolvedTone}
      focusable="false"
      {...accessibleProps}
      {...props}
    />
  );
}

export function getSemanticIconLabel(role: SemanticIconRole) {
  return semanticIconConfig[role].label;
}

export function getSemanticIconTone(role: SemanticIconRole) {
  return semanticIconConfig[role].tone;
}

export function getSemanticIconMigrationStage(role: SemanticIconRole) {
  return semanticIconConfig[role].migrationStage;
}

export { LogIn, Wallet };
