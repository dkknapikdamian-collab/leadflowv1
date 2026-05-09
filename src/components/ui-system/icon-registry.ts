import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BadgeDollarSign,
  Bell,
  Briefcase,
  Calendar,
  ClipboardList,
  FileText,
  Sparkles,
  Target,
  UserRound,
  Wallet,
} from 'lucide-react';

export type CloseflowEntityIconName =
  | 'client'
  | 'lead'
  | 'case'
  | 'task'
  | 'event'
  | 'activity'
  | 'payment'
  | 'commission'
  | 'ai'
  | 'template'
  | 'notification';

export const CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B = 'CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B';

export const CLOSEFLOW_ENTITY_ICON_REGISTRY: Record<CloseflowEntityIconName, LucideIcon> = {
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
};

export function resolveEntityIcon(entity: CloseflowEntityIconName): LucideIcon {
  return CLOSEFLOW_ENTITY_ICON_REGISTRY[entity] || CLOSEFLOW_ENTITY_ICON_REGISTRY.activity;
}
