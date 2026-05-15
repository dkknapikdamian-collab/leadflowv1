import { Activity, BadgeDollarSign, Bell, Briefcase, Calendar, ClipboardList, CreditCard, FileText, LucideIcon, Settings, Sparkles, Target, UserRound, Wallet } from 'lucide-react';
export const CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B = 'CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B';

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
