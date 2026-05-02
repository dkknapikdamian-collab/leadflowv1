import { useEffect, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useWorkspace } from '../hooks/useWorkspace';
import { fetchAiConfigDiagnostics, type AiConfigDiagnostics, type AiProviderDiagnostics } from '../lib/ai-config';

function StatusBadge({ configured, available }: { configured: boolean; available?: boolean }) {
  if (available) {
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Aktywny</Badge>;
  }

  if (configured) {
    return <Badge variant="outline">Skonfigurowany</Badge>;
  }

  return <Badge variant="secondary">Brak konfiguracji</Badge>;
}

function ProviderCard({
  title,
  description,
  provider,
}: {
  title: string;
  description: string;
  provider: AiProviderDiagnostics;
}) {
  return (
    <Card className="border-none app-surface-strong">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <StatusBadge configured={provider.configured} available={provider.available} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {provider.model ? (
          <p className="text-slate-600">
            Model: <span className="font-semibold text-slate-900">{provider.model}</span>
          </p>
        ) : null}
        {provider.requiredEnv?.length ? (
          <div>
            <p className="mb-2 font-semibold text-slate-900">Wymagane zmienne:</p>
            <div className="flex flex-wrap gap-2">
              {provider.requiredEnv.map((item) => (
                <code key={item} className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {item}
                </code>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function AdminAiSettings() {
  const { isAdmin, loading } = useWorkspace();
  const [diagnostics, setDiagnostics] = useState<AiConfigDiagnostics | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);

  const loadDiagnostics = async () => {
    setLoadingDiagnostics(true);
    try {
      const data = await fetchAiConfigDiagnostics();
      setDiagnostics(data);
    } catch (error: any) {
      setDiagnostics(null);
      toast.error(`Błąd diagnostyki AI: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    void loadDiagnostics();
  }, [isAdmin]);

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto w-full max-w-5xl p-4 md:p-8">Ładowanie ustawień AI...</div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
                Dostęp tylko dla admina
              </CardTitle>
              <CardDescription>Ten ekran służy do diagnostyki warstwy AI i nie jest widoczny dla zwykłego użytkownika.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Bot className="h-3.5 w-3.5" />
              AI admin
            </div>
            <div>
              <h1 className="text-3xl font-bold app-text">Konfiguracja AI</h1>
              <p className="max-w-2xl text-sm md:text-base app-muted">
                Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => void loadDiagnostics()} disabled={loadingDiagnostics}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingDiagnostics ? 'animate-spin' : ''}`} />
            Odśwież status
          </Button>
        </header>

        <Card className="border-none app-surface-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-slate-400" />
              Stan warstwy AI
            </CardTitle>
            <CardDescription>Klucze są sprawdzane po stronie backendu. Frontend dostaje tylko informację, czy dana konfiguracja istnieje.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">AI</p>
              <p className="mt-2 text-lg font-bold app-text">{diagnostics?.ai.enabled ? 'Włączone' : 'Wymaga konfiguracji'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Quick Capture</p>
              <p className="mt-2 text-lg font-bold app-text">{diagnostics?.ai.quickLeadCaptureEnabled ? 'Beta' : 'W przygotowaniu'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Główny provider</p>
              <p className="mt-2 text-lg font-bold app-text">{diagnostics?.ai.primaryProvider || 'Wymaga konfiguracji'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">TTL szkicu</p>
              <p className="mt-2 text-lg font-bold app-text">{diagnostics?.ai.draftTtlHours || 24} h</p>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-3">
          <ProviderCard
            title="Parser regułowy"
            description="Zawsze dostępny fallback bez kosztów API."
            provider={diagnostics?.providers.ruleParser || { configured: true, available: true }}
          />
          <ProviderCard
            title="Gemini"
            description="Główny provider do porządkowania notatek w szkic leada."
            provider={diagnostics?.providers.gemini || { configured: false, available: false }}
          />
          <ProviderCard
            title="Cloudflare AI"
            description="Może działać jako główny provider albo fallback, zależnie od zmiennych w Vercel."
            provider={diagnostics?.providers.cloudflare || { configured: false, available: false }}
          />
        </section>

        <Card className="border-none app-surface-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Zasada bezpieczeństwa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {(diagnostics?.notes || [
              'Klucze API są trzymane wyłącznie po stronie backendu.',
              'Zwykły użytkownik nie widzi konfiguracji providerów.',
              'AI przygotowuje szkic. Zapis następuje dopiero po potwierdzeniu przez użytkownika.',
            ]).map((note) => (
              <div key={note} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p>{note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
