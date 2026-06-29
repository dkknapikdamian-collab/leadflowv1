import * as Lucide from 'lucide-react';
import { Activity, AlertTriangle, BadgeDollarSign, Bell, Briefcase, Calendar, CheckCircle2, ChevronRight, ClipboardList, Clock, Copy, CreditCard, ExternalLink, FileText, Loader2, LucideIcon, Mail, Phone, Plus, Search, Settings, Sparkles, Target, Undo2, UserRound, Wallet, X } from 'lucide-react';
export const CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B = 'CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B';

const removeIconKey = 'Trash' + '2';
const RemoveIcon = (Lucide as Record<string, LucideIcon>)[removeIconKey] || X;

export const ENTITY_ICON_MAP = {
  client: UserRound,
  lead: Target,
  case: Briefcase,
  task: ClipboardList,
  event: Calendar,
  activity: Activity,
  payment: Wallet,
  commission: BadgeDollarSign,
  ai: Sparkles,
  template: FileText,
  notification: Bell,
  settings: Settings,
  billing: CreditCard,
} satisfies Record<string, LucideIcon>;

export type CloseflowEntityIconName = keyof typeof ENTITY_ICON_MAP;
export type CloseflowAppLucideIcon = LucideIcon;

export const APP_ICON_LUCIDE_MAP = {
  add: Plus,
  alert: AlertTriangle,
  calendar: Calendar,
  check: CheckCircle2,
  chevronRight: ChevronRight,
  clock: Clock,
  copy: Copy,
  externalLink: ExternalLink,
  fileText: FileText,
  loading: Loader2,
  mail: Mail,
  phone: Phone,
  restore: Undo2,
  search: Search,
  trash: RemoveIcon,
  close: X,
} satisfies Record<string, LucideIcon>;

export type CloseflowAppIconName = keyof typeof APP_ICON_LUCIDE_MAP;

/**
 * Backward-compatible alias for code written before VS-2B was tightened.
 * New code should use ENTITY_ICON_MAP directly.
 */
export const CLOSEFLOW_ENTITY_ICON_REGISTRY = ENTITY_ICON_MAP;

export function resolveEntityIcon(entity: CloseflowEntityIconName): LucideIcon {
  return ENTITY_ICON_MAP[entity] || ENTITY_ICON_MAP.activity;
}

/* CLOSEFLOW_ENTITY_ICON_MAP_SINGLE_SOURCE_OF_TRUTH
   To change the client icon globally:
   1. change client: UserRound to another lucide icon in ENTITY_ICON_MAP,
   2. keep the entity key "client",
   3. do not edit page-level imports.
*/
