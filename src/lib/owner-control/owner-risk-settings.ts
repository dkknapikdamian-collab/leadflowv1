import { DEFAULT_HIGH_VALUE_THRESHOLD_PLN, normalizeOwnerRiskSettings, type OwnerRiskSettings } from './owner-risk-rules';

const OWNER_RISK_SETTINGS_STORAGE_KEY = 'closeflow:owner-risk-settings:v1';

const STAGE222_OWNER_RISK_SETTINGS_FALLBACK = 'DO POTWIERDZENIA: owner risk threshold uses local/client settings fallback until workspace settings storage is confirmed';
void STAGE222_OWNER_RISK_SETTINGS_FALLBACK;

export function readOwnerRiskSettings(workspaceSettings?: unknown): OwnerRiskSettings {
  const workspace = normalizeOwnerRiskSettings(workspaceSettings || {});
  const hasWorkspaceSettings = Boolean(workspaceSettings && typeof workspaceSettings === 'object' && (
    'ownerControlWarningDays' in (workspaceSettings as Record<string, unknown>)
    || 'owner_control_warning_days' in (workspaceSettings as Record<string, unknown>)
  ));
  if (hasWorkspaceSettings) return workspace;

  if (typeof window === 'undefined') {
    return normalizeOwnerRiskSettings({ highValueThresholdPln: DEFAULT_HIGH_VALUE_THRESHOLD_PLN });
  }

  try {
    const raw = window.localStorage.getItem(OWNER_RISK_SETTINGS_STORAGE_KEY);
    return normalizeOwnerRiskSettings(raw ? JSON.parse(raw) : {});
  } catch {
    return normalizeOwnerRiskSettings({ highValueThresholdPln: DEFAULT_HIGH_VALUE_THRESHOLD_PLN });
  }
}

export function writeOwnerRiskSettings(settings: Partial<OwnerRiskSettings>) {
  if (typeof window === 'undefined') return normalizeOwnerRiskSettings(settings);

  const normalized = normalizeOwnerRiskSettings(settings);
  try {
    window.localStorage.setItem(OWNER_RISK_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('closeflow:owner-risk-settings-updated', { detail: normalized }));
  } catch {
    // Local/client fallback only. App continues with normalized runtime value.
  }
  return normalized;
}

export function getOwnerRiskSettingsStorageNote() {
  return 'Progi są wspólne dla całego workspace. Lokalny zapis działa tylko jako fallback.';
}
