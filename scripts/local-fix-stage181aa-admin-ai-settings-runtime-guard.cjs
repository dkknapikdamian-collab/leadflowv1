const fs = require('fs');

const file = 'src/pages/AdminAiSettings.tsx';
let src = fs.readFileSync(file, 'utf8');
const before = src;

// 1. Add a local runtime-safe fallback helper.
// It prevents /settings/ai from crashing when /api/system?kind=ai-config returns partial data.
if (!src.includes('CLOSEFLOW_STAGE181AA_ADMIN_AI_SETTINGS_RUNTIME_GUARD')) {
  const helperAnchor = `function ProviderCard({
  title,
  description,
  provider,
}: {
`;

  const helper = `const CLOSEFLOW_STAGE181AA_ADMIN_AI_SETTINGS_RUNTIME_GUARD = true;

const FALLBACK_AI_PROVIDER_DIAGNOSTICS: AiProviderDiagnostics = {
  configured: false,
  available: false,
  requiredEnv: [],
};

const FALLBACK_RULE_PROVIDER_DIAGNOSTICS: AiProviderDiagnostics = {
  configured: true,
  available: true,
  requiredEnv: [],
};

const FALLBACK_AI_DIAGNOSTICS: AiConfigDiagnostics['ai'] = {
  enabled: false,
  primaryProvider: 'Wymaga konfiguracji',
  fallbackProvider: 'ruleParser',
  quickLeadCaptureEnabled: false,
  draftTtlHours: 24,
  deleteRawTextOnConfirm: true,
  status: 'fallback',
};

const FALLBACK_AI_NOTES = [
  'Klucze API są trzymane wyłącznie po stronie backendu.',
  'Zwykły użytkownik nie widzi konfiguracji providerów.',
  'AI przygotowuje szkic. Zapis następuje dopiero po potwierdzeniu przez użytkownika.',
];

function getSafeAiDiagnostics(diagnostics: AiConfigDiagnostics | null) {
  return diagnostics?.ai || FALLBACK_AI_DIAGNOSTICS;
}

function getSafeProviderDiagnostics(diagnostics: AiConfigDiagnostics | null, key: 'ruleParser' | 'gemini' | 'cloudflare') {
  if (key === 'ruleParser') {
    return diagnostics?.providers?.ruleParser || FALLBACK_RULE_PROVIDER_DIAGNOSTICS;
  }

  return diagnostics?.providers?.[key] || FALLBACK_AI_PROVIDER_DIAGNOSTICS;
}

function getSafeAiNotes(diagnostics: AiConfigDiagnostics | null) {
  return Array.isArray(diagnostics?.notes) && diagnostics.notes.length ? diagnostics.notes : FALLBACK_AI_NOTES;
}

`;

  if (!src.includes(helperAnchor)) {
    throw new Error('Could not find ProviderCard helper anchor.');
  }

  src = src.replace(helperAnchor, helper + helperAnchor);
}

// 2. Add safe local values inside component.
if (!src.includes('const aiDiagnostics = getSafeAiDiagnostics(diagnostics);')) {
  const stateAnchor = `  const [diagnostics, setDiagnostics] = useState<AiConfigDiagnostics | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
`;

  const stateReplacement = `  const [diagnostics, setDiagnostics] = useState<AiConfigDiagnostics | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const aiDiagnostics = getSafeAiDiagnostics(diagnostics);
  const ruleProviderDiagnostics = getSafeProviderDiagnostics(diagnostics, 'ruleParser');
  const geminiProviderDiagnostics = getSafeProviderDiagnostics(diagnostics, 'gemini');
  const cloudflareProviderDiagnostics = getSafeProviderDiagnostics(diagnostics, 'cloudflare');
  const aiNotes = getSafeAiNotes(diagnostics);
`;

  if (!src.includes(stateAnchor)) {
    throw new Error('Could not find diagnostics state anchor.');
  }

  src = src.replace(stateAnchor, stateReplacement);
}

// 3. Replace brittle nested diagnostics access.
src = src.replace(/diagnostics\?\.ai\.enabled/g, 'aiDiagnostics.enabled');
src = src.replace(/diagnostics\?\.ai\.quickLeadCaptureEnabled/g, 'aiDiagnostics.quickLeadCaptureEnabled');
src = src.replace(/diagnostics\?\.ai\.primaryProvider/g, 'aiDiagnostics.primaryProvider');
src = src.replace(/diagnostics\?\.ai\.draftTtlHours/g, 'aiDiagnostics.draftTtlHours');

src = src.replace(
  /provider=\{diagnostics\?\.providers\.ruleParser \|\| \{ configured: true, available: true \}\}/g,
  'provider={ruleProviderDiagnostics}'
);

src = src.replace(
  /provider=\{diagnostics\?\.providers\.gemini \|\| \{ configured: false, available: false \}\}/g,
  'provider={geminiProviderDiagnostics}'
);

src = src.replace(
  /provider=\{diagnostics\?\.providers\.cloudflare \|\| \{ configured: false, available: false \}\}/g,
  'provider={cloudflareProviderDiagnostics}'
);

src = src.replace(
  /\(diagnostics\?\.notes \|\| \[\s*'Klucze API są trzymane wyłącznie po stronie backendu\.',\s*'Zwykły użytkownik nie widzi konfiguracji providerów\.',\s*'AI przygotowuje szkic\. Zapis następuje dopiero po potwierdzeniu przez użytkownika\.',\s*\]\)\.map\(\(note\) => \(/m,
  'aiNotes.map((note) => ('
);

// 4. Add a visible diagnostic fallback note so the page is honest when API fails.
if (!src.includes('data-stage181aa-ai-diagnostics-fallback')) {
  src = src.replace(
    `<CardContent className="grid gap-4 md:grid-cols-4">`,
    `<CardContent className="grid gap-4 md:grid-cols-4">
            {!diagnostics ? (
              <div className="md:col-span-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800" data-stage181aa-ai-diagnostics-fallback="true">
                Diagnostyka AI nie zwróciła pełnych danych. Pokazuję bezpieczny fallback zamiast wywracać widok.
              </div>
            ) : null}`
  );
}

fs.writeFileSync(file, src, 'utf8');

const next = fs.readFileSync(file, 'utf8');

const failures = [];

for (const token of [
  'CLOSEFLOW_STAGE181AA_ADMIN_AI_SETTINGS_RUNTIME_GUARD',
  'getSafeAiDiagnostics',
  'getSafeProviderDiagnostics',
  'getSafeAiNotes',
  'const aiDiagnostics = getSafeAiDiagnostics(diagnostics);',
  'provider={ruleProviderDiagnostics}',
  'provider={geminiProviderDiagnostics}',
  'provider={cloudflareProviderDiagnostics}',
  'aiNotes.map((note) => (',
  'data-stage181aa-ai-diagnostics-fallback',
]) {
  if (!next.includes(token)) failures.push('AdminAiSettings.tsx missing token: ' + token);
}

if (/diagnostics\?\.providers\.(ruleParser|gemini|cloudflare)/.test(next)) {
  failures.push('Brittle diagnostics?.providers direct access remains.');
}

if (/diagnostics\?\.ai\.(enabled|quickLeadCaptureEnabled|primaryProvider|draftTtlHours)/.test(next)) {
  failures.push('Brittle diagnostics?.ai direct access remains.');
}

if (failures.length) {
  console.error('Stage181AA local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('No changes needed. Stage181AA already present.');
} else {
  console.log('Patched Stage181AA locally.');
}

console.log('OK Stage181AA local: /settings/ai has runtime-safe diagnostics fallback.');
