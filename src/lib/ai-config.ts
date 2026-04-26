import { getClientAuthSnapshot } from './client-auth';

export type AiProviderDiagnostics = {
  configured: boolean;
  available: boolean;
  model?: string;
  role?: string;
  requiredEnv?: string[];
  hasAccountId?: boolean;
  hasToken?: boolean;
};

export type AiConfigDiagnostics = {
  ok: boolean;
  scope: 'admin_only';
  ai: {
    enabled: boolean;
    primaryProvider: string;
    fallbackProvider: string;
    quickLeadCaptureEnabled: boolean;
    draftTtlHours: number;
    deleteRawTextOnConfirm: boolean;
    status: string;
  };
  providers: {
    ruleParser: AiProviderDiagnostics;
    gemini: AiProviderDiagnostics;
    cloudflare: AiProviderDiagnostics;
  };
  notes: string[];
};

export async function fetchAiConfigDiagnostics() {
  const auth = getClientAuthSnapshot();
  const response = await fetch('/api/system?kind=ai-config', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': auth.uid,
      'x-user-email': auth.email,
      'x-user-name': auth.fullName,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(data?.error || 'AI_CONFIG_DIAGNOSTICS_FAILED'));
  }

  return data as AiConfigDiagnostics;
}
