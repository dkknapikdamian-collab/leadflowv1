import { ReactNode } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { isPlanFeatureEnabled, type PlanFeatureKey } from '../lib/plans';

type AccessGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  requireAccess?: boolean;
  feature?: PlanFeatureKey;
};

export default function AccessGate({
  children,
  fallback = null,
  requireAccess = true,
  feature,
}: AccessGateProps) {
  const { access, hasAccess, isAdmin, isAppOwner } = useWorkspace();

  if ((isAdmin || isAppOwner) && hasAccess) return <>{children}</>;
  if (requireAccess && !hasAccess) return <>{fallback}</>;
  if (feature && !isPlanFeatureEnabled(access?.planId, feature, access?.subscriptionStatus)) return <>{fallback}</>;
  return <>{children}</>;
}
