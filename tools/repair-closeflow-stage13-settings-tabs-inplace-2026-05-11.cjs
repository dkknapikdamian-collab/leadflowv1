const fs = require('fs');
const path = require('path');

const STAGE = 'CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE_2026_05_11';
const repo = process.cwd();

function abs(p) { return path.join(repo, p); }
function exists(p) { return fs.existsSync(abs(p)); }
function read(p) { return fs.readFileSync(abs(p), 'utf8'); }
function write(p, value) { fs.mkdirSync(path.dirname(abs(p)), { recursive: true }); fs.writeFileSync(abs(p), value, 'utf8'); }
function normalize(value) { return String(value).replace(/\r\n/g, '\n'); }

function backup(paths) {
  const dir = abs(`.closeflow-recovery-backups/stage13-settings-tabs-inplace-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const p of paths) {
    if (!exists(p)) continue;
    const dst = path.join(dir, p);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(abs(p), dst);
  }
  console.log(`${STAGE}: backup ${dir}`);
}

function removeOldStage13Artifacts() {
  const files = [
    'src/pages/SettingsLegacy.tsx',
    'scripts/check-closeflow-settings-tabs-layout.cjs',
    'scripts/check-closeflow-settings-layout-repair1.cjs',
    'tools/repair-closeflow-stage13-settings-tabs-layout-2026-05-11.cjs',
    'tools/repair-closeflow-stage13-settings-layout-repair1-2026-05-11.cjs',
    'docs/release/CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_2026-05-11.md',
    'docs/release/CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_2026-05-11.md',
  ];
  for (const p of files) {
    if (exists(p)) fs.rmSync(abs(p), { force: true });
  }
}

function cleanupCss() {
  const cssPath = 'src/styles/Settings.css';
  if (!exists(cssPath)) return;
  let css = normalize(read(cssPath));
  css = css.replace(/\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_START\s*\*\/[\s\S]*?\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_END\s*\*\//g, '');
  css = css.replace(/\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_START\s*\*\/[\s\S]*?\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_END\s*\*\//g, '');
  css = css.replace(/\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE_START\s*\*\/[\s\S]*?\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE_END\s*\*\//g, '');
  write(cssPath, css.trim() + '\n');
}

function detectNamedExport(rel, name) {
  if (!exists(rel)) return false;
  const source = read(rel);
  const patterns = [
    new RegExp(`export\\s+function\\s+${name}\\b`),
    new RegExp(`export\\s+const\\s+${name}\\b`),
    new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`),
  ];
  return patterns.some((pattern) => pattern.test(source));
}

function hasImport(source, name, modulePath) {
  const re = new RegExp(`import\\s+[^;]*\\b${name}\\b[^;]*from\\s+['\"]${modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`, 'm');
  return re.test(source);
}

function addNamedImport(source, name, modulePath) {
  if (hasImport(source, name, modulePath)) return source;
  const importRe = new RegExp(`import\\s+([^;]*?)from\\s+['\"]${modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"];?`, 'm');
  const match = source.match(importRe);
  if (match) {
    const full = match[0];
    if (/import\s+\{/.test(full)) {
      return source.replace(full, full.replace(/\{([^}]*)\}/, (_, inner) => `{ ${inner.trim() ? inner.trim() + ', ' : ''}${name} }`));
    }
  }
  return `import { ${name} } from '${modulePath}';\n${source}`;
}

function renameDefaultSettingsComponent(source) {
  if (source.includes('CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE')) {
    throw new Error('Settings tabs inplace marker already exists. Roll back or remove existing stage before reapplying.');
  }

  let s = source;
  // Common pattern: export default function Settings(...)
  if (/export\s+default\s+function\s+Settings\s*\(/.test(s)) {
    s = s.replace(/export\s+default\s+function\s+Settings\s*\(/, 'function SettingsOriginalContent(');
    return s;
  }

  // Common pattern with another function name.
  const namedDefault = s.match(/export\s+default\s+function\s+([A-Za-z0-9_$]+)\s*\(/);
  if (namedDefault) {
    s = s.replace(new RegExp(`export\\s+default\\s+function\\s+${namedDefault[1]}\\s*\\(`), 'function SettingsOriginalContent(');
    return s;
  }

  // Pattern: function Settings(...) ... export default Settings;
  if (/function\s+Settings\s*\(/.test(s) && /export\s+default\s+Settings\s*;?/.test(s)) {
    s = s.replace(/function\s+Settings\s*\(/, 'function SettingsOriginalContent(');
    s = s.replace(/\n?export\s+default\s+Settings\s*;?\s*$/m, '\n');
    return s;
  }

  // Pattern: const Settings = (...) => ... export default Settings;
  if (/const\s+Settings\s*=/.test(s) && /export\s+default\s+Settings\s*;?/.test(s)) {
    s = s.replace(/const\s+Settings\s*=/, 'const SettingsOriginalContent =');
    s = s.replace(/\n?export\s+default\s+Settings\s*;?\s*$/m, '\n');
    return s;
  }

  throw new Error('Could not find default Settings component pattern. Expected export default function Settings or export default Settings.');
}

function buildInjectedCode({ hasWorkspaceHook, hasSessionHook }) {
  const workspaceLine = hasWorkspaceHook ? '  const workspaceState = useWorkspace() as any;' : '  const workspaceState = null as any;';
  const sessionLine = hasSessionHook ? '  const sessionState = useSupabaseSession() as any;' : '  const sessionState = null as any;';
  return `

// CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE

type SettingsTab = 'plans' | 'account' | 'security' | 'workspace' | 'notifications' | 'integrations';

const SETTINGS_TABS = [
  { id: 'plans', label: 'Plany' },
  { id: 'account', label: 'Konto' },
  { id: 'security', label: 'Bezpieczeństwo' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'notifications', label: 'Powiadomienia' },
  { id: 'integrations', label: 'Integracje' },
] satisfies Array<{ id: SettingsTab; label: string }>;

type SettingsAccountSnapshot = {
  email: string;
  workspaceName: string;
  planName: string;
  accessStatus: string;
  periodLabel: string;
  roleLabel: string;
};

function pickSettingsString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function formatSettingsDateLabel(value: unknown) {
  const raw = pickSettingsString(value);
  if (!raw) return '-';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function formatSettingsPlan(value: unknown) {
  const raw = pickSettingsString(value);
  if (!raw) return 'Brak planu';
  const normalized = raw.toLowerCase();
  if (normalized === 'free') return 'Free';
  if (normalized === 'basic') return 'Basic';
  if (normalized === 'pro') return 'Pro';
  if (normalized === 'ai') return 'AI';
  if (normalized.includes('trial')) return 'Trial';
  return raw;
}

function formatSettingsAccess(value: unknown) {
  const raw = pickSettingsString(value).toLowerCase();
  if (['active', 'paid_active', 'trial_active'].includes(raw)) return 'Aktywny';
  if (raw === 'trial_ending') return 'Trial kończy się';
  if (['trial_expired', 'expired'].includes(raw)) return 'Wygasł';
  if (raw === 'payment_failed') return 'Problem z płatnością';
  if (['canceled', 'cancelled'].includes(raw)) return 'Anulowany';
  if (raw === 'inactive') return 'Nieaktywny';
  return 'Status nieznany';
}

function buildSettingsAccountSnapshot(workspaceState: any, sessionState: any): SettingsAccountSnapshot {
  const workspace = workspaceState?.workspace ?? workspaceState?.currentWorkspace ?? workspaceState?.data?.workspace ?? workspaceState ?? {};
  const subscription = workspaceState?.subscription ?? workspaceState?.billing ?? workspace?.subscription ?? workspace?.billing ?? {};
  const session = sessionState?.session ?? sessionState?.data?.session ?? sessionState ?? {};
  const user = sessionState?.user ?? session?.user ?? workspaceState?.user ?? {};

  const email = pickSettingsString(
    user?.email,
    session?.user?.email,
    workspaceState?.profile?.email,
    workspace?.ownerEmail,
    workspace?.email,
  ) || 'Brak e-maila';

  const workspaceName = pickSettingsString(
    workspace?.name,
    workspace?.workspaceName,
    workspace?.title,
    workspace?.id,
    workspaceState?.workspaceId,
  ) || 'Brak workspace';

  const planName = formatSettingsPlan(
    subscription?.planName ?? subscription?.planId ?? subscription?.currentPlanId ?? workspace?.planName ?? workspace?.planId ?? workspace?.currentPlanId ?? workspaceState?.planName ?? workspaceState?.planId,
  );

  const accessStatus = formatSettingsAccess(
    subscription?.status ?? subscription?.accessStatus ?? workspace?.accessStatus ?? workspace?.subscriptionStatus ?? workspaceState?.accessStatus ?? workspaceState?.status,
  );

  const periodLabel = formatSettingsDateLabel(
    subscription?.currentPeriodEnd ?? subscription?.periodEnd ?? subscription?.nextBillingAt ?? workspace?.currentPeriodEnd ?? workspace?.trialEndsAt,
  );

  const roleLabel = pickSettingsString(workspaceState?.role, workspaceState?.membership?.role, workspace?.role) || 'Użytkownik';

  return { email, workspaceName, planName, accessStatus, periodLabel, roleLabel };
}

function SettingsStatusBadge({ children, tone = 'neutral' }: { children: string; tone?: 'ready' | 'beta' | 'warning' | 'neutral' }) {
  return (
    <span className="settings-inpage-status-badge" data-tone={tone}>
      {children}
    </span>
  );
}

function SettingsMiniAccount({ account }: { account: SettingsAccountSnapshot }) {
  return (
    <section className="settings-inpage-account-strip" data-settings-account-strip="true">
      <div>
        <span>Email</span>
        <strong>{account.email}</strong>
      </div>
      <div>
        <span>Workspace</span>
        <strong>{account.workspaceName}</strong>
      </div>
      <div>
        <span>Plan</span>
        <strong>{account.planName}</strong>
      </div>
      <div>
        <span>Status</span>
        <strong>{account.accessStatus}</strong>
      </div>
    </section>
  );
}

function SettingsPlansPanel({ account }: { account: SettingsAccountSnapshot }) {
  return (
    <section className="settings-inpage-panel" data-settings-panel="plans">
      <div className="settings-inpage-panel-head">
        <p>Plany</p>
        <h2>Twój plan</h2>
        <span>Krótki status dostępu. Pełne rozliczenia zostają w zakładce Billing.</span>
      </div>
      <dl className="settings-inpage-grid settings-inpage-plan-grid">
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
      <div className="settings-inpage-actions">
        <a className="settings-inpage-primary" href="/billing">Przejdź do rozliczeń</a>
        <a className="settings-inpage-secondary" href="/billing">Zarządzaj płatnością</a>
      </div>
    </section>
  );
}

function SettingsAccountPanel({ account }: { account: SettingsAccountSnapshot }) {
  return (
    <section className="settings-inpage-panel" data-settings-panel="account">
      <div className="settings-inpage-panel-head">
        <p>Konto</p>
        <h2>Dane konta</h2>
        <span>Stały kontekst konta oraz dotychczasowe ustawienia, bez ruszania bocznego panelu aplikacji.</span>
      </div>
      <SettingsMiniAccount account={account} />
      <div className="settings-inpage-original-content" data-settings-original-content="true">
        <SettingsOriginalContent />
      </div>
    </section>
  );
}

function SettingsSecurityPanel() {
  return (
    <section className="settings-inpage-panel" data-settings-panel="security">
      <div className="settings-inpage-panel-head">
        <p>Bezpieczeństwo</p>
        <h2>Hasło i logowanie</h2>
        <span>Nie udajemy funkcji, których backend jeszcze nie obsługuje.</span>
      </div>
      <div className="settings-inpage-feature-list">
        <div><strong>Logowanie do aplikacji</strong><SettingsStatusBadge tone="ready">Gotowe</SettingsStatusBadge><p>Dostęp zależy od aktualnej konfiguracji logowania.</p></div>
        <div><strong>Reset hasła</strong><SettingsStatusBadge tone="warning">W przygotowaniu</SettingsStatusBadge><p>Reset dostępny tylko wtedy, gdy wspiera go aktualny provider auth.</p></div>
        <div><strong>Sesje</strong><SettingsStatusBadge tone="warning">W przygotowaniu</SettingsStatusBadge><p>Osobne zarządzanie sesjami wymaga osobnego etapu.</p></div>
      </div>
    </section>
  );
}

function SettingsWorkspacePanel({ account }: { account: SettingsAccountSnapshot }) {
  return (
    <section className="settings-inpage-panel" data-settings-panel="workspace">
      <div className="settings-inpage-panel-head">
        <p>Workspace</p>
        <h2>Workspace</h2>
        <span>Podgląd danych workspace. Bez edycji, jeśli backend jej jeszcze nie obsługuje.</span>
      </div>
      <dl className="settings-inpage-grid">
        <div><dt>Nazwa workspace</dt><dd>{account.workspaceName}</dd></div>
        <div><dt>Rola użytkownika</dt><dd>{account.roleLabel}</dd></div>
        <div><dt>Dostęp</dt><dd>{account.accessStatus}</dd></div>
      </dl>
    </section>
  );
}

function SettingsNotificationsPanel() {
  return (
    <section className="settings-inpage-panel" data-settings-panel="notifications">
      <div className="settings-inpage-panel-head">
        <p>Powiadomienia</p>
        <h2>Powiadomienia</h2>
        <span>Status funkcji powiadomień bez obiecywania rzeczy wymagających konfiguracji.</span>
      </div>
      <div className="settings-inpage-feature-list">
        <div><strong>Powiadomienia w aplikacji</strong><SettingsStatusBadge tone="beta">Beta</SettingsStatusBadge><p>Widoczne w aplikacji zależnie od runtime powiadomień.</p></div>
        <div><strong>Email digest</strong><SettingsStatusBadge tone="warning">Wymaga konfiguracji</SettingsStatusBadge><p>Wysyłka maili wymaga providera i sekretów poza repo.</p></div>
        <div><strong>Google Calendar</strong><SettingsStatusBadge tone="warning">Wymaga konfiguracji</SettingsStatusBadge><p>Synchronizacja kalendarza wymaga osobnego etapu.</p></div>
      </div>
    </section>
  );
}

function SettingsIntegrationsPanel() {
  return (
    <section className="settings-inpage-panel" data-settings-panel="integrations">
      <div className="settings-inpage-panel-head">
        <p>Integracje</p>
        <h2>Integracje</h2>
        <span>Prawdziwy status techniczny, nie marketingowa lista obietnic.</span>
      </div>
      <div className="settings-inpage-feature-list">
        <div><strong>Supabase</strong><SettingsStatusBadge tone="beta">Beta</SettingsStatusBadge><p>Dane zależą od konfiguracji środowiska i workspace.</p></div>
        <div><strong>Google Calendar</strong><SettingsStatusBadge tone="warning">Wymaga konfiguracji</SettingsStatusBadge><p>OAuth i sync wymagają osobnego etapu oraz env.</p></div>
        <div><strong>Stripe</strong><SettingsStatusBadge tone="warning">Wymaga konfiguracji</SettingsStatusBadge><p>Billing UI nie oznacza gotowego checkoutu produkcyjnego.</p></div>
        <div><strong>AI</strong><SettingsStatusBadge tone="beta">Beta</SettingsStatusBadge><p>AI tworzy szkice i działa w trybie sprawdzenia przez użytkownika.</p></div>
        <div><strong>PWA</strong><SettingsStatusBadge tone="beta">Beta</SettingsStatusBadge><p>Tryb aplikacji webowej zależy od manifestu, service workera i przeglądarki.</p></div>
      </div>
    </section>
  );
}

export default function Settings() {
${workspaceLine}
${sessionLine}
  const [activeTab, setActiveTab] = useState<SettingsTab>('plans');
  const account = buildSettingsAccountSnapshot(workspaceState, sessionState);

  return (
    <div className="settings-inpage-card" data-settings-tabs-inplace="true">
      <header className="settings-inpage-header">
        <p>USTAWIENIA</p>
        <h1>Ustawienia aplikacji</h1>
      </header>

      <nav className="settings-tabs settings-inpage-tabs" aria-label="Zakładki ustawień">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="settings-tab settings-inpage-tab"
            data-active={activeTab === tab.id ? 'true' : 'false'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'plans' ? <SettingsPlansPanel account={account} /> : null}
      {activeTab === 'account' ? <SettingsAccountPanel account={account} /> : null}
      {activeTab === 'security' ? <SettingsSecurityPanel /> : null}
      {activeTab === 'workspace' ? <SettingsWorkspacePanel account={account} /> : null}
      {activeTab === 'notifications' ? <SettingsNotificationsPanel /> : null}
      {activeTab === 'integrations' ? <SettingsIntegrationsPanel /> : null}
    </div>
  );
}
`;
}

function patchSettings() {
  const p = 'src/pages/Settings.tsx';
  if (!exists(p)) throw new Error('Missing src/pages/Settings.tsx');
  let source = normalize(read(p));

  // If a failed Stage13 wrapper survived, stop early. User asked to reapply after rollback.
  if (source.includes('SettingsLegacy')) {
    throw new Error('Settings.tsx still references SettingsLegacy. Run rollback first or remove failed Stage13 files.');
  }

  source = addNamedImport(source, 'useState', 'react');

  const hasWorkspaceHook = detectNamedExport('src/hooks/useWorkspace.ts', 'useWorkspace') || detectNamedExport('src/hooks/useWorkspace.tsx', 'useWorkspace');
  const hasSessionHook = detectNamedExport('src/hooks/useSupabaseSession.ts', 'useSupabaseSession') || detectNamedExport('src/hooks/useSupabaseSession.tsx', 'useSupabaseSession');

  if (hasWorkspaceHook) source = addNamedImport(source, 'useWorkspace', '../hooks/useWorkspace');
  if (hasSessionHook) source = addNamedImport(source, 'useSupabaseSession', '../hooks/useSupabaseSession');

  source = renameDefaultSettingsComponent(source);
  source = source.trimEnd() + buildInjectedCode({ hasWorkspaceHook, hasSessionHook });
  write(p, source + '\n');
}

function appendCss() {
  const cssPath = 'src/styles/Settings.css';
  const existing = exists(cssPath) ? normalize(read(cssPath)) : '';
  const start = '/* CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE_START */';
  const end = '/* CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE_END */';
  const block = `${start}
.settings-inpage-card {
  width: 100%;
  max-width: 100%;
  display: grid;
  gap: 1rem;
}

.settings-inpage-header {
  display: grid;
  gap: 0.25rem;
  margin: 0 0 0.25rem;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.settings-inpage-header p,
.settings-inpage-panel-head p {
  margin: 0;
  color: var(--cf-text-muted, #64748b);
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.settings-inpage-header h1,
.settings-inpage-panel h2 {
  margin: 0;
  color: var(--cf-text, #0f172a);
}

.settings-inpage-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.settings-inpage-tab,
.settings-tab.settings-inpage-tab {
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: var(--cf-card-bg, #fff);
  color: var(--cf-text, #0f172a);
  border-radius: 999px;
  padding: 0.5rem 0.85rem;
  font-weight: 850;
  cursor: pointer;
  line-height: 1;
}

.settings-inpage-tab[data-active="true"],
.settings-tab.settings-inpage-tab[data-active="true"] {
  background: var(--cf-text, #0f172a);
  color: #fff;
  border-color: var(--cf-text, #0f172a);
}

.settings-inpage-panel {
  width: 100%;
  max-width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  background: var(--cf-card-bg, #fff);
  box-shadow: var(--cf-card-shadow, 0 18px 45px rgba(15, 23, 42, 0.08));
  padding: 1rem;
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.settings-inpage-panel-head {
  display: grid;
  gap: 0.35rem;
}

.settings-inpage-panel-head span,
.settings-inpage-feature-list p {
  color: var(--cf-text-muted, #64748b);
  margin: 0;
}

.settings-inpage-grid,
.settings-inpage-account-strip {
  display: grid;
  gap: 0.75rem;
}

.settings-inpage-plan-grid,
.settings-inpage-account-strip {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.settings-inpage-grid div,
.settings-inpage-account-strip div {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 0.75rem;
  min-width: 0;
}

.settings-inpage-grid dt,
.settings-inpage-account-strip span {
  color: var(--cf-text-muted, #64748b);
  font-size: 0.73rem;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.settings-inpage-grid dd,
.settings-inpage-account-strip strong {
  display: block;
  margin: 0.2rem 0 0;
  color: var(--cf-text, #0f172a);
  font-weight: 850;
  overflow-wrap: anywhere;
}

.settings-inpage-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.settings-inpage-primary,
.settings-inpage-secondary {
  border-radius: 999px;
  padding: 0.65rem 0.9rem;
  font-weight: 900;
  text-decoration: none;
}

.settings-inpage-primary {
  background: var(--cf-text, #0f172a);
  color: #fff;
}

.settings-inpage-secondary {
  border: 1px solid rgba(148, 163, 184, 0.28);
  color: var(--cf-text, #0f172a);
  background: var(--cf-card-bg, #fff);
}

.settings-inpage-feature-list {
  display: grid;
  gap: 0.75rem;
}

.settings-inpage-feature-list > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.3rem 0.75rem;
  align-items: center;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 0.85rem;
  min-width: 0;
}

.settings-inpage-feature-list p {
  grid-column: 1 / -1;
}

.settings-inpage-status-badge {
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.74rem;
  font-weight: 900;
  background: rgba(100, 116, 139, 0.12);
  color: #334155;
  white-space: nowrap;
}

.settings-inpage-status-badge[data-tone="ready"] {
  background: rgba(22, 163, 74, 0.12);
  color: #166534;
}

.settings-inpage-status-badge[data-tone="beta"] {
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
}

.settings-inpage-status-badge[data-tone="warning"] {
  background: rgba(217, 119, 6, 0.12);
  color: #92400e;
}

.settings-inpage-original-content {
  min-width: 0;
}

.settings-inpage-original-content > * {
  max-width: 100%;
}

@media (max-width: 980px) {
  .settings-inpage-plan-grid,
  .settings-inpage-account-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .settings-inpage-panel {
    border-radius: 18px;
    padding: 0.85rem;
  }

  .settings-inpage-plan-grid,
  .settings-inpage-account-strip,
  .settings-inpage-feature-list > div {
    grid-template-columns: 1fr;
  }
}
${end}
`;
  const cleaned = existing.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, 'm'), '').trim();
  write(cssPath, `${cleaned}\n\n${block}\n`);
}

function patchPackage() {
  const p = 'package.json';
  if (!exists(p)) throw new Error('Missing package.json');
  const pkg = JSON.parse(read(p));
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts['check:settings-tabs-layout'];
  delete pkg.scripts['check:settings-layout-repair1'];
  pkg.scripts['check:settings-tabs-inplace'] = 'node scripts/check-closeflow-settings-tabs-inplace.cjs';
  write(p, JSON.stringify(pkg, null, 2) + '\n');
}

function main() {
  console.log(`${STAGE}: start`);
  backup(['src/pages/Settings.tsx', 'src/styles/Settings.css', 'package.json']);
  removeOldStage13Artifacts();
  cleanupCss();
  patchSettings();
  appendCss();
  patchPackage();
  console.log(`${STAGE}: finished`);
}

main();
