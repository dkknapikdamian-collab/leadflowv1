import { useState } from 'react';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { useWorkspace } from '../hooks/useWorkspace';
import SettingsLegacyContent from './SettingsLegacy';
import '../styles/Settings.css';

// CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT
type SettingsTab =
  | 'plans'
  | 'account'
  | 'security'
  | 'workspace'
  | 'notifications'
  | 'integrations';

const SETTINGS_TABS = [
  { id: 'plans', label: 'Plany' },
  { id: 'account', label: 'Konto' },
  { id: 'security', label: 'Bezpieczeństwo' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'notifications', label: 'Powiadomienia' },
  { id: 'integrations', label: 'Integracje' },
] satisfies Array<{ id: SettingsTab; label: string }>;

type AccountSummary = {
  email: string;
  workspaceName: string;
  planName: string;
  accessStatus: string;
  periodLabel: string;
  roleLabel: string;
};

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function formatAccessStatus(value: unknown) {
  const status = String(value || '').toLowerCase();
  if (['active', 'paid_active', 'trial_active'].includes(status)) return 'Aktywny';
  if (['trial_ending'].includes(status)) return 'Trial kończy się';
  if (['trial_expired', 'expired'].includes(status)) return 'Wygasł';
  if (['payment_failed'].includes(status)) return 'Problem z płatnością';
  if (['canceled', 'cancelled'].includes(status)) return 'Anulowany';
  if (['inactive'].includes(status)) return 'Nieaktywny';
  return 'Status nieznany';
}

function formatPlanName(value: unknown) {
  const raw = String(value || '').trim();
  if (!raw) return 'Brak planu';
  const normalized = raw.toLowerCase();
  if (normalized === 'free') return 'Free';
  if (normalized === 'trial' || normalized === 'trial_pro') return 'Trial';
  if (normalized === 'basic') return 'Basic';
  if (normalized === 'pro') return 'Pro';
  if (normalized === 'ai') return 'AI';
  return raw;
}

function makeAccountSummary(workspaceState: any, sessionState: any): AccountSummary {
  const workspace = workspaceState?.workspace ?? workspaceState?.currentWorkspace ?? workspaceState?.data?.workspace ?? workspaceState;
  const subscription = workspaceState?.subscription ?? workspaceState?.billing ?? workspace?.subscription ?? workspace?.billing ?? {};
  const session = sessionState?.session ?? sessionState?.data?.session ?? sessionState;
  const user = sessionState?.user ?? session?.user ?? workspaceState?.user ?? {};

  const email = pickFirstString(
    user?.email,
    session?.user?.email,
    workspaceState?.profile?.email,
    workspace?.ownerEmail,
    workspace?.email,
  ) || 'Brak e-maila';

  const workspaceName = pickFirstString(
    workspace?.name,
    workspace?.workspaceName,
    workspace?.title,
    workspace?.id,
    workspaceState?.workspaceId,
  ) || 'Brak workspace';

  const planName = formatPlanName(
    subscription?.planName ??
      subscription?.planId ??
      subscription?.currentPlanId ??
      workspace?.planName ??
      workspace?.planId ??
      workspace?.currentPlanId ??
      workspaceState?.planName ??
      workspaceState?.planId,
  );

  const accessStatus = formatAccessStatus(
    subscription?.status ??
      subscription?.accessStatus ??
      workspace?.accessStatus ??
      workspace?.subscriptionStatus ??
      workspaceState?.accessStatus ??
      workspaceState?.status,
  );

  const periodLabel = pickFirstString(
    subscription?.currentPeriodEnd,
    subscription?.periodEnd,
    subscription?.nextBillingAt,
    workspace?.currentPeriodEnd,
    workspace?.trialEndsAt,
  ) || 'Brak daty';

  const roleLabel = pickFirstString(
    workspaceState?.role,
    workspaceState?.membership?.role,
    workspace?.role,
  ) || 'Właściciel / użytkownik';

  return { email, workspaceName, planName, accessStatus, periodLabel, roleLabel };
}

function StatusBadge({ children, tone = 'neutral' }: { children: string; tone?: 'ready' | 'beta' | 'warning' | 'neutral' }) {
  return (
    <span className="settings-status-badge" data-tone={tone}>
      {children}
    </span>
  );
}

function SettingsPlansPanel({ account }: { account: AccountSummary }) {
  return (
    <section className="settings-panel-card" data-settings-panel="plans">
      <header>
        <p className="settings-panel-eyebrow">Plany</p>
        <h2>Twój plan</h2>
        <p>Krótki status dostępu. Pełne rozliczenia zostają w osobnej zakładce Billing.</p>
      </header>

      <dl className="settings-plan-summary">
        <div>
          <dt>Plan</dt>
          <dd>{account.planName}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{account.accessStatus}</dd>
        </div>
        <div>
          <dt>Okres do</dt>
          <dd>{account.periodLabel}</dd>
        </div>
      </dl>

      <div className="settings-panel-actions">
        <a className="settings-primary-link" href="/billing">
          Przejdź do rozliczeń
        </a>
        <a className="settings-secondary-link" href="/billing">
          Zarządzaj płatnością
        </a>
      </div>
    </section>
  );
}

function SettingsAccountPanel() {
  return (
    <section className="settings-panel-card" data-settings-panel="account">
      <header>
        <p className="settings-panel-eyebrow">Konto</p>
        <h2>Ustawienia konta</h2>
        <p>Dotychczasowe ustawienia są zachowane tutaj, żeby nie zgubić żadnej działającej opcji.</p>
      </header>
      <div className="settings-legacy-panel">
        <SettingsLegacyContent />
      </div>
    </section>
  );
}

function SettingsSecurityPanel() {
  return (
    <section className="settings-panel-card" data-settings-panel="security">
      <header>
        <p className="settings-panel-eyebrow">Bezpieczeństwo</p>
        <h2>Hasło i logowanie</h2>
        <p>Nie pokazujemy tu atrap. Funkcje bez pełnego backendu są oznaczone jako w przygotowaniu.</p>
      </header>
      <div className="settings-feature-list">
        <div>
          <strong>Logowanie do aplikacji</strong>
          <StatusBadge tone="ready">Gotowe</StatusBadge>
          <p>Dostęp zależy od aktualnej konfiguracji logowania w aplikacji.</p>
        </div>
        <div>
          <strong>Reset hasła</strong>
          <StatusBadge tone="warning">W przygotowaniu</StatusBadge>
          <p>Nie udajemy pełnego panelu resetu, jeśli działa tylko ekran logowania lub provider auth.</p>
        </div>
        <div>
          <strong>Sesje i urządzenia</strong>
          <StatusBadge tone="warning">W przygotowaniu</StatusBadge>
          <p>Osobne zarządzanie sesjami wymaga kolejnego etapu.</p>
        </div>
      </div>
    </section>
  );
}

function SettingsWorkspacePanel({ account }: { account: AccountSummary }) {
  return (
    <section className="settings-panel-card" data-settings-panel="workspace">
      <header>
        <p className="settings-panel-eyebrow">Workspace</p>
        <h2>Workspace</h2>
        <p>Informacje robocze o przestrzeni. Edycja workspace nie jest dodawana w tym etapie.</p>
      </header>
      <dl className="settings-details-list">
        <div>
          <dt>Nazwa workspace</dt>
          <dd>{account.workspaceName}</dd>
        </div>
        <div>
          <dt>Rola użytkownika</dt>
          <dd>{account.roleLabel}</dd>
        </div>
        <div>
          <dt>Dostęp</dt>
          <dd>{account.accessStatus}</dd>
        </div>
      </dl>
    </section>
  );
}

function SettingsNotificationsPanel() {
  return (
    <section className="settings-panel-card" data-settings-panel="notifications">
      <header>
        <p className="settings-panel-eyebrow">Powiadomienia</p>
        <h2>Powiadomienia</h2>
        <p>Status funkcji powiadomień bez obiecywania rzeczy, które wymagają konfiguracji.</p>
      </header>
      <div className="settings-feature-list">
        <div>
          <strong>Powiadomienia w aplikacji</strong>
          <StatusBadge tone="beta">Beta</StatusBadge>
          <p>Widoczne w aplikacji, zależnie od aktualnego runtime powiadomień.</p>
        </div>
        <div>
          <strong>Email digest</strong>
          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>
          <p>Wysyłka maili wymaga skonfigurowanego providera i sekretów poza repo.</p>
        </div>
        <div>
          <strong>Google Calendar</strong>
          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>
          <p>Synchronizacja kalendarza nie jest udawana w ustawieniach.</p>
        </div>
      </div>
    </section>
  );
}

function SettingsIntegrationsPanel() {
  return (
    <section className="settings-panel-card" data-settings-panel="integrations">
      <header>
        <p className="settings-panel-eyebrow">Integracje</p>
        <h2>Integracje</h2>
        <p>Lista technicznych integracji z prawdziwym statusem wdrożeniowym, nie marketingiem.</p>
      </header>
      <div className="settings-feature-list">
        <div>
          <strong>Supabase</strong>
          <StatusBadge tone="beta">Beta</StatusBadge>
          <p>Dane aplikacji zależą od konfiguracji środowiska i aktualnego workspace.</p>
        </div>
        <div>
          <strong>Google Calendar</strong>
          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>
          <p>OAuth i synchronizacja wymagają osobnego etapu oraz env.</p>
        </div>
        <div>
          <strong>Stripe</strong>
          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>
          <p>Billing UI nie oznacza automatycznie gotowego checkoutu produkcyjnego.</p>
        </div>
        <div>
          <strong>AI</strong>
          <StatusBadge tone="beta">Beta</StatusBadge>
          <p>AI tworzy szkice i odpowiedzi zgodnie z zasadą sprawdzenia przez użytkownika.</p>
        </div>
        <div>
          <strong>PWA</strong>
          <StatusBadge tone="beta">Beta</StatusBadge>
          <p>Tryb aplikacji webowej zależy od manifestu, service workera i przeglądarki.</p>
        </div>
      </div>
    </section>
  );
}

function SettingsAccountSummary({ account }: { account: AccountSummary }) {
  return (
    <aside className="settings-account-rail" data-settings-account-rail="true">
      <section className="right-card settings-account-card">
        <h2>Dane konta</h2>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>{account.email}</dd>
          </div>
          <div>
            <dt>Workspace</dt>
            <dd>{account.workspaceName}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>{account.planName}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{account.accessStatus}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}

export default function Settings() {
  const workspaceState = useWorkspace() as any;
  const sessionState = useSupabaseSession() as any;
  const account = makeAccountSummary(workspaceState, sessionState);
  const [activeTab, setActiveTab] = useState<SettingsTab>('plans');

  return (
    <main className="settings-vnext-page">
      <header className="settings-header">
        <p className="settings-kicker">USTAWIENIA</p>
        <h1>Ustawienia aplikacji</h1>
      </header>

      <div className="settings-shell">
        <section className="settings-main-column">
          <nav className="settings-tabs" aria-label="Zakładki ustawień">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="settings-tab"
                data-active={activeTab === tab.id ? 'true' : 'false'}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === 'plans' ? <SettingsPlansPanel account={account} /> : null}
          {activeTab === 'account' ? <SettingsAccountPanel /> : null}
          {activeTab === 'security' ? <SettingsSecurityPanel /> : null}
          {activeTab === 'workspace' ? <SettingsWorkspacePanel account={account} /> : null}
          {activeTab === 'notifications' ? <SettingsNotificationsPanel /> : null}
          {activeTab === 'integrations' ? <SettingsIntegrationsPanel /> : null}
        </section>

        <SettingsAccountSummary account={account} />
      </div>
    </main>
  );
}
