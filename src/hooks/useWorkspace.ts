import { useEffect, useState } from 'react';
import { getAccessSummary } from '../lib/access';
import {
  fetchMeFromSupabase,
  getStoredWorkspaceId,
  isSupabaseConfigured,
  normalizeWorkspaceContextId,
  persistWorkspaceId,
} from '../lib/supabase-fallback';
import { useClientAuthSnapshot } from './useClientAuthSnapshot';
import { buildPlanAccessModel } from '../lib/plans';

function buildLocalWorkspace(storedWorkspaceId: string, email: string) {
  const normalizedWorkspaceId = normalizeWorkspaceContextId(storedWorkspaceId);
  const workspaceId = normalizedWorkspaceId || (import.meta.env.DEV ? '11111111-1111-4111-8111-111111111111' : '');
  if (!workspaceId) return null;

  return {
    id: workspaceId,
    ownerId: null,
    planId: 'trial_21d',
    subscriptionStatus: 'trial_active',
    trialEndsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    billingProvider: 'manual',
    providerCustomerId: null,
    providerSubscriptionId: null,
    nextBillingAt: null,
    cancelAtPeriodEnd: false,
    timezone: 'Europe/Warsaw',
    dailyDigestEnabled: true,
    dailyDigestHour: 7,
    dailyDigestTimezone: 'Europe/Warsaw',
    dailyDigestRecipientEmail: email,
  };
}

function normalizeWorkspaceRecord(workspace: any) {
  const workspaceId = normalizeWorkspaceContextId(workspace?.id);
  if (!workspaceId) return null;
  return { ...workspace, id: workspaceId };
}



const CREATOR_FULL_FEATURES = {
  ai: true,
  fullAi: true,
  digest: true,
  lightParser: true,
  lightDrafts: true,
  googleCalendar: true,
  weeklyReport: true,
  csvImport: true,
  recurringReminders: true,
  browserNotifications: true,
};

const CREATOR_UNLIMITED_LIMITS = {
  activeLeads: null,
  activeTasks: null,
  activeEvents: null,
  activeDrafts: null,
};

function isCreatorProfile(profile: any) {
  const appRole = String(profile?.appRole ?? profile?.app_role ?? '').trim().toLowerCase();
  return profile?.isAppOwner === true || profile?.is_app_owner === true || appRole === 'creator' || appRole === 'app_owner';
}

function buildCreatorAccessOverride(access: any) {
  return {
    ...access,
    creatorOverride: true,
    adminOverride: false,
    hasAccess: true,
    isPaidActive: true,
    limits: {
      ...(access?.limits || {}),
      ...CREATOR_UNLIMITED_LIMITS,
    },
    features: {
      ...(access?.features || {}),
      ...CREATOR_FULL_FEATURES,
    },
  };
}

function buildLocalProfile(activeUserId: string, fullName: string, email: string) {
  return {
    id: activeUserId,
    fullName,
    companyName: '',
    email,
    role: 'member',
    isAdmin: false,
    isAppOwner: false,
    appRole: 'workspace',
    appearanceSkin: 'classic-light',
    planningConflictWarningsEnabled: true,
    browserNotificationsEnabled: true,
    forceLogoutAfter: null,
  };
}

export function useWorkspace() {
  const authSnapshot = useClientAuthSnapshot();
  const [workspace, setWorkspace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accessOverride, setAccessOverride] = useState<any>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const activeUserId = authSnapshot.uid || '';

    if (!activeUserId) {
      persistWorkspaceId(null);
      setWorkspace(null);
      setProfile(null);
      setAccessOverride(null);
      setWorkspaceError(null);
      setLoading(false);
      return;
    }

    const snapshotEmail = authSnapshot.email || '';
    const snapshotFullName = authSnapshot.fullName || '';

    if (!isSupabaseConfigured()) {
      const storedWorkspaceId = getStoredWorkspaceId();
      setWorkspace(buildLocalWorkspace(storedWorkspaceId, snapshotEmail));
      setProfile(buildLocalProfile(activeUserId, snapshotFullName, snapshotEmail));
      setAccessOverride(null);
      setWorkspaceError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadContext = async () => {
      setLoading(true);
      try {
        const me = await fetchMeFromSupabase({
          uid: activeUserId,
          email: snapshotEmail || undefined,
          fullName: snapshotFullName || undefined,
        });
        if (cancelled) return;
        const normalizedWorkspace = normalizeWorkspaceRecord(me.workspace);
        persistWorkspaceId(normalizedWorkspace?.id || null);
        setWorkspace(normalizedWorkspace);
        setProfile(me.profile);
        setAccessOverride(me.access);
        setWorkspaceError(normalizedWorkspace?.id ? null : 'WORKSPACE_CONTEXT_REQUIRED');
      } catch {
        if (cancelled) return;
        persistWorkspaceId(null);
        setWorkspace(null);
        setProfile(buildLocalProfile(activeUserId, snapshotFullName, snapshotEmail));
        setAccessOverride(null);
        setWorkspaceError('WORKSPACE_BOOTSTRAP_FAILED');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadContext();

    return () => {
      cancelled = true;
    };
  }, [authSnapshot.uid, authSnapshot.email, authSnapshot.fullName, refreshToken]);

  useEffect(() => {
    if (!workspace?.id) return;
    persistWorkspaceId(String(workspace.id));
  }, [workspace?.id]);

  const fallbackAccess = getAccessSummary(workspace);
  const fallbackPlanAccess = buildPlanAccessModel({
    planId: workspace?.planId,
    subscriptionStatus: fallbackAccess.status,
    isTrialActive: fallbackAccess.isTrialActive,
  });
  const accessOverridePlanAccess = accessOverride
    ? buildPlanAccessModel({
        planId: accessOverride.planId ?? workspace?.planId,
        subscriptionStatus: accessOverride.subscriptionStatus ?? accessOverride.status ?? fallbackAccess.status,
        isTrialActive:
          typeof accessOverride.isTrialActive === 'boolean' ? accessOverride.isTrialActive : fallbackAccess.isTrialActive,
      })
    : null;
  const access = accessOverride
    ? {
        ...fallbackAccess,
        ...(accessOverridePlanAccess || fallbackPlanAccess),
        status: accessOverride.status ?? fallbackAccess.status,
        subscriptionStatus: accessOverride.subscriptionStatus ?? accessOverride.status ?? fallbackAccess.status,
        planId: accessOverride.planId ?? accessOverridePlanAccess?.planId ?? fallbackPlanAccess.planId,
        hasAccess: typeof accessOverride.hasAccess === 'boolean' ? accessOverride.hasAccess : fallbackAccess.hasAccess,
        isTrialActive:
          typeof accessOverride.isTrialActive === 'boolean' ? accessOverride.isTrialActive : fallbackAccess.isTrialActive,
        isPaidActive:
          typeof accessOverride.isPaidActive === 'boolean' ? accessOverride.isPaidActive : fallbackAccess.isPaidActive,
        features: accessOverride.features ?? accessOverridePlanAccess?.features ?? fallbackPlanAccess.features,
        limits: accessOverride.limits ?? accessOverridePlanAccess?.limits ?? fallbackPlanAccess.limits,
      }
    : {
        ...fallbackAccess,
        ...fallbackPlanAccess,
        subscriptionStatus: fallbackAccess.status,
      };
  const isAdmin = profile?.role === 'admin' || profile?.isAdmin === true;
  const isAppOwner = isCreatorProfile(profile);
  const finalAccess = isAppOwner ? buildCreatorAccessOverride(access) : access;
  const refresh = () => setRefreshToken((prev) => prev + 1);
  const workspaceReady = Boolean(workspace?.id);

  return {
    workspace,
    profile,
    loading,
    workspaceReady,
    workspaceError,
    hasAccess: finalAccess.hasAccess || isAppOwner,
    isAdmin,
    isAppOwner,
    isTrialActive: finalAccess.isTrialActive,
    isPaidActive: finalAccess.isPaidActive,
    access: finalAccess,
    refresh,
  };
}
