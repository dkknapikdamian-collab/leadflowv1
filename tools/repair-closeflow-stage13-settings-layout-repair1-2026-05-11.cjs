#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const write = (rel, content) => fs.writeFileSync(path.join(root, rel), content, 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const ensureDir = (rel) => fs.mkdirSync(path.join(root, rel), { recursive: true });

function normalizeLf(value) {
  return String(value).replace(/\r\n/g, '\n');
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

function addPackageScript(name, command) {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) throw new Error('package.json not found');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[name] = command;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

function ensureLegacySettings() {
  const settingsPath = 'src/pages/Settings.tsx';
  const legacyPath = 'src/pages/SettingsLegacy.tsx';
  if (!exists(settingsPath)) throw new Error('src/pages/Settings.tsx not found');
  if (exists(legacyPath)) return;

  const current = normalizeLf(read(settingsPath));
  const isGenerated = current.includes('CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT') || current.includes('CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1');
  if (isGenerated) {
    write(legacyPath, `import React from 'react';\n\nexport default function SettingsLegacyContent() {\n  return (\n    <section className="settings-card">\n      <h2>Konto</h2>\n      <p>Poprzednia zawartosc ustawien nie byla dostepna podczas tworzenia kopii legacy.</p>\n    </section>\n  );\n}\n`);
    return;
  }
  write(legacyPath, current);
}

function buildSettingsTsx() {
  const hasUseWorkspace = detectNamedExport('src/hooks/useWorkspace.ts', 'useWorkspace') || detectNamedExport('src/hooks/useWorkspace.tsx', 'useWorkspace');
  const hasUseSupabaseSession = detectNamedExport('src/hooks/useSupabaseSession.ts', 'useSupabaseSession') || detectNamedExport('src/hooks/useSupabaseSession.tsx', 'useSupabaseSession');

  const imports = [
    `import { useMemo, useState } from 'react';`,
    `import SettingsLegacyContent from './SettingsLegacy';`,
    `import '../styles/Settings.css';`,
  ];
  if (hasUseWorkspace) imports.splice(1, 0, `import { useWorkspace } from '../hooks/useWorkspace';`);
  if (hasUseSupabaseSession) imports.splice(1, 0, `import { useSupabaseSession } from '../hooks/useSupabaseSession';`);

  const workspaceHook = hasUseWorkspace ? `const workspaceState = useWorkspace() as any;` : `const workspaceState = null as any;`;
  const sessionHook = hasUseSupabaseSession ? `const sessionState = useSupabaseSession() as any;` : `const sessionState = null as any;`;

  return `${imports.join('\n')}\n\n// CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1\ntype SettingsTab =\n  | 'plans'\n  | 'account'\n  | 'security'\n  | 'workspace'\n  | 'notifications'\n  | 'integrations';\n\nconst SETTINGS_TABS = [\n  { id: 'plans', label: 'Plany' },\n  { id: 'account', label: 'Konto' },\n  { id: 'security', label: 'Bezpieczeństwo' },\n  { id: 'workspace', label: 'Workspace' },\n  { id: 'notifications', label: 'Powiadomienia' },\n  { id: 'integrations', label: 'Integracje' },\n] satisfies Array<{ id: SettingsTab; label: string }>;\n\ntype AccountSummary = {\n  email: string;\n  workspaceName: string;\n  planName: string;\n  accessStatus: string;\n  periodLabel: string;\n  roleLabel: string;\n};\n\nfunction pickFirstString(...values: unknown[]) {\n  for (const value of values) {\n    if (typeof value === 'string' && value.trim()) return value.trim();\n    if (typeof value === 'number' && Number.isFinite(value)) return String(value);\n  }\n  return '';\n}\n\nfunction formatDateLabel(value: unknown) {\n  const raw = pickFirstString(value);\n  if (!raw) return 'Brak daty';\n  const date = new Date(raw);\n  if (Number.isNaN(date.getTime())) return raw;\n  try {\n    return new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);\n  } catch {\n    return raw.slice(0, 10);\n  }\n}\n\nfunction formatAccessStatus(value: unknown) {\n  const status = String(value || '').toLowerCase();\n  if (['active', 'paid_active', 'trial_active', 'enabled'].includes(status)) return 'Aktywny';\n  if (['trial_ending'].includes(status)) return 'Trial kończy się';\n  if (['trial_expired', 'expired'].includes(status)) return 'Wygasł';\n  if (['payment_failed'].includes(status)) return 'Problem z płatnością';\n  if (['canceled', 'cancelled'].includes(status)) return 'Anulowany';\n  if (['inactive', 'disabled'].includes(status)) return 'Nieaktywny';\n  if (!status) return 'Brak danych';\n  return value ? String(value) : 'Brak danych';\n}\n\nfunction formatPlanName(value: unknown) {\n  const raw = String(value || '').trim();\n  if (!raw) return 'Brak planu';\n  const normalized = raw.toLowerCase();\n  if (normalized === 'free') return 'Free';\n  if (normalized === 'trial' || normalized === 'trial_pro') return 'Trial';\n  if (normalized === 'basic') return 'Basic';\n  if (normalized === 'pro') return 'Pro';\n  if (normalized === 'ai') return 'AI';\n  return raw;\n}\n\nfunction makeAccountSummary(workspaceState: any, sessionState: any): AccountSummary {\n  const workspace = workspaceState?.workspace ?? workspaceState?.currentWorkspace ?? workspaceState?.data?.workspace ?? workspaceState?.workspaceData ?? {};\n  const subscription =\n    workspaceState?.subscription ??\n    workspaceState?.billing ??\n    workspace?.subscription ??\n    workspace?.billing ??\n    workspaceState?.data?.subscription ??\n    {};\n  const session = sessionState?.session ?? sessionState?.data?.session ?? sessionState ?? {};\n  const user = sessionState?.user ?? session?.user ?? workspaceState?.user ?? workspaceState?.profile ?? {};\n  const profile = workspaceState?.profile ?? sessionState?.profile ?? workspace?.profile ?? {};\n\n  const email =\n    pickFirstString(\n      user?.email,\n      session?.user?.email,\n      profile?.email,\n      workspaceState?.email,\n      workspaceState?.userEmail,\n      workspace?.ownerEmail,\n      workspace?.owner_email,\n      workspace?.email,\n    ) || 'Brak e-maila';\n\n  const workspaceName =\n    pickFirstString(\n      workspace?.name,\n      workspace?.workspaceName,\n      workspace?.workspace_name,\n      workspace?.title,\n      workspaceState?.workspaceName,\n      workspaceState?.workspace_name,\n      workspaceState?.workspaceId,\n      workspace?.id,\n    ) || 'Brak workspace';\n\n  const planName = formatPlanName(\n    subscription?.planName ??\n      subscription?.plan_name ??\n      subscription?.planId ??\n      subscription?.plan_id ??\n      subscription?.currentPlanId ??\n      subscription?.current_plan_id ??\n      workspace?.planName ??\n      workspace?.plan_name ??\n      workspace?.planId ??\n      workspace?.plan_id ??\n      workspace?.currentPlanId ??\n      workspace?.current_plan_id ??\n      workspaceState?.planName ??\n      workspaceState?.planId,\n  );\n\n  const accessStatus = formatAccessStatus(\n    subscription?.status ??\n      subscription?.accessStatus ??\n      subscription?.access_status ??\n      workspace?.accessStatus ??\n      workspace?.access_status ??\n      workspace?.subscriptionStatus ??\n      workspace?.subscription_status ??\n      workspaceState?.accessStatus ??\n      workspaceState?.status,\n  );\n\n  const periodLabel = formatDateLabel(\n    subscription?.currentPeriodEnd ??\n      subscription?.current_period_end ??\n      subscription?.periodEnd ??\n      subscription?.period_end ??\n      subscription?.nextBillingAt ??\n      subscription?.next_billing_at ??\n      workspace?.currentPeriodEnd ??\n      workspace?.current_period_end ??\n      workspace?.trialEndsAt ??\n      workspace?.trial_ends_at,\n  );\n\n  const roleLabel =\n    pickFirstString(\n      workspaceState?.role,\n      workspaceState?.membership?.role,\n      workspace?.role,\n      profile?.role,\n    ) || 'Właściciel / użytkownik';\n\n  return { email, workspaceName, planName, accessStatus, periodLabel, roleLabel };\n}\n\nfunction StatusBadge({ children, tone = 'neutral' }: { children: string; tone?: 'ready' | 'beta' | 'warning' | 'neutral' }) {\n  return (\n    <span className="settings-status-badge" data-tone={tone}>\n      {children}\n    </span>\n  );\n}\n\nfunction SettingsPlansPanel({ account }: { account: AccountSummary }) {\n  return (\n    <section className="settings-panel-card" data-settings-panel="plans">\n      <header className="settings-panel-head">\n        <p className="settings-panel-eyebrow">Plany</p>\n        <h2>Twój plan</h2>\n        <p>Tu jest tylko skrót dostępu. Pełne rozliczenia zostają w zakładce Billing.</p>\n      </header>\n\n      <dl className="settings-plan-summary">\n        <div>\n          <dt>Plan</dt>\n          <dd>{account.planName}</dd>\n        </div>\n        <div>\n          <dt>Status</dt>\n          <dd>{account.accessStatus}</dd>\n        </div>\n        <div>\n          <dt>Okres do</dt>\n          <dd>{account.periodLabel}</dd>\n        </div>\n      </dl>\n\n      <div className="settings-panel-actions">\n        <a className="settings-primary-link" href="/billing">\n          Przejdź do rozliczeń\n        </a>\n        <a className="settings-secondary-link" href="/billing">\n          Zarządzaj płatnością\n        </a>\n      </div>\n    </section>\n  );\n}\n\nfunction SettingsAccountPanel() {\n  return (\n    <section className="settings-panel-card" data-settings-panel="account">\n      <header className="settings-panel-head">\n        <p className="settings-panel-eyebrow">Konto</p>\n        <h2>Ustawienia konta</h2>\n        <p>Dotychczasowe ustawienia są zachowane tutaj, żeby nie zgubić działających opcji.</p>\n      </header>\n      <div className="settings-legacy-panel">\n        <SettingsLegacyContent />\n      </div>\n    </section>\n  );\n}\n\nfunction SettingsSecurityPanel() {\n  return (\n    <section className="settings-panel-card" data-settings-panel="security">\n      <header className="settings-panel-head">\n        <p className="settings-panel-eyebrow">Bezpieczeństwo</p>\n        <h2>Hasło i logowanie</h2>\n        <p>Funkcje bez pełnego backendu są oznaczone jako w przygotowaniu.</p>\n      </header>\n      <div className="settings-feature-list">\n        <div>\n          <strong>Logowanie do aplikacji</strong>\n          <StatusBadge tone="ready">Gotowe</StatusBadge>\n          <p>Dostęp zależy od aktualnej konfiguracji logowania.</p>\n        </div>\n        <div>\n          <strong>Reset hasła</strong>\n          <StatusBadge tone="warning">W przygotowaniu</StatusBadge>\n          <p>Nie udajemy pełnego panelu resetu, jeśli działa tylko provider auth.</p>\n        </div>\n        <div>\n          <strong>Sesje i urządzenia</strong>\n          <StatusBadge tone="warning">W przygotowaniu</StatusBadge>\n          <p>Osobne zarządzanie sesjami wymaga kolejnego etapu.</p>\n        </div>\n      </div>\n    </section>\n  );\n}\n\nfunction SettingsWorkspacePanel({ account }: { account: AccountSummary }) {\n  return (\n    <section className="settings-panel-card" data-settings-panel="workspace">\n      <header className="settings-panel-head">\n        <p className="settings-panel-eyebrow">Workspace</p>\n        <h2>Workspace</h2>\n        <p>Podgląd kontekstu pracy bez udawania edycji, jeśli backend jej nie obsługuje.</p>\n      </header>\n      <dl className="settings-details-list">\n        <div>\n          <dt>Nazwa workspace</dt>\n          <dd>{account.workspaceName}</dd>\n        </div>\n        <div>\n          <dt>Rola użytkownika</dt>\n          <dd>{account.roleLabel}</dd>\n        </div>\n        <div>\n          <dt>Dostęp</dt>\n          <dd>{account.accessStatus}</dd>\n        </div>\n      </dl>\n    </section>\n  );\n}\n\nfunction SettingsNotificationsPanel() {\n  return (\n    <section className="settings-panel-card" data-settings-panel="notifications">\n      <header className="settings-panel-head">\n        <p className="settings-panel-eyebrow">Powiadomienia</p>\n        <h2>Powiadomienia</h2>\n        <p>Status funkcji bez obiecywania rzeczy, które wymagają konfiguracji.</p>\n      </header>\n      <div className="settings-feature-list">\n        <div>\n          <strong>Powiadomienia w aplikacji</strong>\n          <StatusBadge tone="beta">Beta</StatusBadge>\n          <p>Widoczne w aplikacji, zależnie od runtime powiadomień.</p>\n        </div>\n        <div>\n          <strong>Email digest</strong>\n          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>\n          <p>Wysyłka maili wymaga providera i sekretów poza repo.</p>\n        </div>\n        <div>\n          <strong>Google Calendar</strong>\n          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>\n          <p>Synchronizacja kalendarza wymaga osobnego etapu.</p>\n        </div>\n      </div>\n    </section>\n  );\n}\n\nfunction SettingsIntegrationsPanel() {\n  return (\n    <section className="settings-panel-card" data-settings-panel="integrations">\n      <header className="settings-panel-head">\n        <p className="settings-panel-eyebrow">Integracje</p>\n        <h2>Integracje</h2>\n        <p>Lista integracji z prawdziwym statusem, nie marketingiem.</p>\n      </header>\n      <div className="settings-feature-list">\n        <div>\n          <strong>Supabase</strong>\n          <StatusBadge tone="beta">Beta</StatusBadge>\n          <p>Dane aplikacji zależą od konfiguracji środowiska i workspace.</p>\n        </div>\n        <div>\n          <strong>Google Calendar</strong>\n          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>\n          <p>OAuth i synchronizacja wymagają osobnego etapu oraz env.</p>\n        </div>\n        <div>\n          <strong>Stripe</strong>\n          <StatusBadge tone="warning">Wymaga konfiguracji</StatusBadge>\n          <p>Billing UI nie oznacza gotowego checkoutu produkcyjnego.</p>\n        </div>\n        <div>\n          <strong>AI</strong>\n          <StatusBadge tone="beta">Beta</StatusBadge>\n          <p>AI tworzy szkice i odpowiedzi zgodnie z zasadą sprawdzenia przez użytkownika.</p>\n        </div>\n        <div>\n          <strong>PWA</strong>\n          <StatusBadge tone="beta">Beta</StatusBadge>\n          <p>Tryb aplikacji webowej zależy od manifestu, service workera i przeglądarki.</p>\n        </div>\n      </div>\n    </section>\n  );\n}\n\nfunction SettingsAccountSummary({ account }: { account: AccountSummary }) {\n  const rows = [\n    { label: 'Email', value: account.email },\n    { label: 'Workspace', value: account.workspaceName },\n    { label: 'Plan', value: account.planName },\n    { label: 'Status dostępu', value: account.accessStatus },\n  ];\n\n  return (\n    <aside className="settings-account-rail" data-settings-account-rail="true">\n      <section className="settings-account-card">\n        <header>\n          <p className="settings-panel-eyebrow">Konto</p>\n          <h2>Dane konta</h2>\n        </header>\n        <div className="settings-account-list">\n          {rows.map((row) => (\n            <div className="settings-account-row" key={row.label}>\n              <span>{row.label}</span>\n              <strong title={row.value}>{row.value}</strong>\n            </div>\n          ))}\n        </div>\n      </section>\n    </aside>\n  );\n}\n\nexport default function Settings() {\n  ${workspaceHook}\n  ${sessionHook}\n  const account = useMemo(() => makeAccountSummary(workspaceState, sessionState), [workspaceState, sessionState]);\n  const [activeTab, setActiveTab] = useState<SettingsTab>('plans');\n\n  return (\n    <main className="settings-vnext-page">\n      <header className="settings-header">\n        <p className="settings-kicker">USTAWIENIA</p>\n        <h1>Ustawienia aplikacji</h1>\n      </header>\n\n      <div className="settings-shell">\n        <section className="settings-main-column">\n          <nav className="settings-tabs" aria-label="Zakładki ustawień">\n            {SETTINGS_TABS.map((tab) => (\n              <button\n                key={tab.id}\n                type="button"\n                className="settings-tab"\n                data-active={activeTab === tab.id ? 'true' : 'false'}\n                onClick={() => setActiveTab(tab.id)}\n              >\n                {tab.label}\n              </button>\n            ))}\n          </nav>\n\n          {activeTab === 'plans' ? <SettingsPlansPanel account={account} /> : null}\n          {activeTab === 'account' ? <SettingsAccountPanel /> : null}\n          {activeTab === 'security' ? <SettingsSecurityPanel /> : null}\n          {activeTab === 'workspace' ? <SettingsWorkspacePanel account={account} /> : null}\n          {activeTab === 'notifications' ? <SettingsNotificationsPanel /> : null}\n          {activeTab === 'integrations' ? <SettingsIntegrationsPanel /> : null}\n        </section>\n\n        <SettingsAccountSummary account={account} />\n      </div>\n    </main>\n  );\n}\n`;
}

function appendSettingsCss() {
  ensureDir('src/styles');
  const cssPath = 'src/styles/Settings.css';
  const existing = exists(cssPath) ? normalizeLf(read(cssPath)) : '';
  const markers = [
    ['/* CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_START */', '/* CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_END */'],
    ['/* CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_START */', '/* CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_END */'],
  ];
  let cleaned = existing;
  for (const [start, end] of markers) {
    if (cleaned.includes(start)) {
      cleaned = cleaned.replace(new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`, 'm'), '');
    }
  }

  const start = '/* CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_START */';
  const end = '/* CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_END */';
  const block = `${start}
.settings-vnext-page {
  width: min(1180px, calc(100vw - 48px));
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.5rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.settings-header {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  gap: 0.2rem !important;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  text-align: left !important;
}

.settings-kicker,
.settings-panel-eyebrow {
  margin: 0;
  color: var(--cf-text-muted, #64748b);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.settings-header h1 {
  margin: 0;
  color: var(--cf-text, #0f172a);
  font-size: clamp(1.55rem, 2vw, 2.1rem);
  line-height: 1.05;
  font-weight: 950;
}

.settings-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
  align-items: start;
  width: 100%;
}

.settings-main-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.settings-tab {
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: var(--cf-card-bg, #fff);
  color: var(--cf-text, #0f172a);
  border-radius: 999px;
  padding: 0.52rem 0.82rem;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

.settings-tab[data-active="true"] {
  background: var(--cf-text, #0f172a);
  color: #fff;
  border-color: var(--cf-text, #0f172a);
}

.settings-panel-card,
.settings-account-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 22px;
  background: var(--cf-card-bg, #fff) !important;
  color: var(--cf-text, #0f172a) !important;
  box-shadow: var(--cf-card-shadow, 0 18px 45px rgba(15, 23, 42, 0.08));
  padding: 1rem;
}

.settings-panel-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-panel-head,
.settings-account-card header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0;
}

.settings-panel-card h2,
.settings-account-card h2 {
  margin: 0;
  color: var(--cf-text, #0f172a) !important;
  font-size: 1.1rem;
  font-weight: 950;
}

.settings-panel-card p,
.settings-account-card p {
  margin: 0;
  color: var(--cf-text-muted, #64748b) !important;
  line-height: 1.45;
}

.settings-plan-summary,
.settings-details-list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.settings-plan-summary {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.settings-plan-summary div,
.settings-details-list div {
  min-width: 0;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 0.75rem;
  background: rgba(248, 250, 252, 0.72);
}

.settings-plan-summary dt,
.settings-details-list dt {
  color: var(--cf-text-muted, #64748b);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.settings-plan-summary dd,
.settings-details-list dd {
  margin: 0.24rem 0 0;
  color: var(--cf-text, #0f172a);
  font-weight: 900;
  overflow-wrap: anywhere;
}

.settings-panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.settings-primary-link,
.settings-secondary-link {
  border-radius: 999px;
  padding: 0.65rem 0.9rem;
  font-weight: 900;
  text-decoration: none;
  line-height: 1;
}

.settings-primary-link {
  background: var(--cf-text, #0f172a);
  color: #fff;
}

.settings-secondary-link {
  border: 1px solid rgba(148, 163, 184, 0.32);
  color: var(--cf-text, #0f172a);
  background: #fff;
}

.settings-feature-list {
  display: grid;
  gap: 0.75rem;
}

.settings-feature-list > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.35rem 0.75rem;
  align-items: center;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 0.85rem;
  background: rgba(248, 250, 252, 0.72);
}

.settings-feature-list p {
  grid-column: 1 / -1;
}

.settings-status-badge {
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 900;
  background: rgba(100, 116, 139, 0.12);
  color: #334155;
  white-space: nowrap;
}

.settings-status-badge[data-tone="ready"] {
  background: rgba(22, 163, 74, 0.12);
  color: #166534;
}

.settings-status-badge[data-tone="beta"] {
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
}

.settings-status-badge[data-tone="warning"] {
  background: rgba(217, 119, 6, 0.12);
  color: #92400e;
}

.settings-account-rail {
  position: sticky;
  top: 1rem;
  min-width: 0;
  align-self: start;
}

.settings-account-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.settings-account-list {
  display: grid;
  gap: 0.65rem;
}

.settings-account-row {
  min-width: 0;
  display: grid;
  gap: 0.2rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 15px;
  padding: 0.72rem;
  background: rgba(248, 250, 252, 0.82);
}

.settings-account-row span {
  color: var(--cf-text-muted, #64748b) !important;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.settings-account-row strong {
  min-width: 0;
  color: var(--cf-text, #0f172a) !important;
  font-size: 0.92rem;
  line-height: 1.25;
  font-weight: 950;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-legacy-panel {
  min-width: 0;
  display: block;
}

.settings-legacy-panel > * {
  max-width: 100%;
}

@media (max-width: 1120px) {
  .settings-vnext-page {
    width: min(100%, calc(100vw - 32px));
  }

  .settings-shell {
    grid-template-columns: 1fr;
  }

  .settings-account-rail {
    position: static;
  }
}

@media (max-width: 760px) {
  .settings-vnext-page {
    width: min(100%, calc(100vw - 24px));
    padding-top: 1rem;
  }

  .settings-plan-summary {
    grid-template-columns: 1fr;
  }

  .settings-feature-list > div {
    grid-template-columns: 1fr;
  }
}
${end}
`;

  write(cssPath, `${cleaned.trim()}\n\n${block}\n`);
}

function main() {
  ensureLegacySettings();
  write('src/pages/Settings.tsx', buildSettingsTsx());
  appendSettingsCss();
  addPackageScript('check:settings-tabs-layout', 'node scripts/check-closeflow-settings-tabs-layout.cjs');
  addPackageScript('check:settings-layout-repair1', 'node scripts/check-closeflow-settings-layout-repair1.cjs');
  console.log('Stage 13 Settings layout repair1 applied.');
}

main();
