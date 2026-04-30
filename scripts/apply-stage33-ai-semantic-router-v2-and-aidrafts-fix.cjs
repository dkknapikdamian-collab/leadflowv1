const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientPath = path.join(root, 'src/lib/ai-assistant.ts');
const serverPath = path.join(root, 'src/server/ai-assistant.ts');
const indexCssPath = path.join(root, 'src/index.css');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, body) {
  fs.writeFileSync(file, body, 'utf8');
}

function fail(message) {
  throw new Error(message);
}

function findFunctionEnd(text, start) {
  const braceStart = text.indexOf('{', start);
  if (braceStart === -1) return -1;

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = braceStart; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }

    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }

    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }

  return -1;
}

function patchClient() {
  let text = read(clientPath);
  if (text.includes('AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_CLIENT')) {
    console.log('stage33v2: client semantic router already patched');
    return;
  }

  const start = text.indexOf('export async function askTodayAiAssistant(input: TodayAiAssistantInput)');
  if (start === -1) fail('Cannot find askTodayAiAssistant start in src/lib/ai-assistant.ts');

  const end = findFunctionEnd(text, start);
  if (end === -1) fail('Cannot find askTodayAiAssistant end in src/lib/ai-assistant.ts');

  const nextFunction = `export async function askTodayAiAssistant(input: TodayAiAssistantInput) {
  // AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_CLIENT
  // Modelowy router semantyczny jest pierwszą ścieżką dla pytań o aplikację.
  // Lokalny Stage32 zostaje tylko jako offline/error fallback, a nie jako główny mózg oparty o frazy.
  const stage32LocalFallback = buildStage32LocalQueryBrainAnswer(input);
  const auth = getClientAuthSnapshot();
  const workspaceId = getContextWorkspaceId(input.context);

  try {
    const response = await fetch('/api/system?kind=ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': auth.uid,
        'x-user-email': auth.email,
        'x-user-name': auth.fullName,
        'x-workspace-id': workspaceId,
      },
      body: JSON.stringify({
        rawText: input.rawText,
        now: new Date().toISOString(),
        workspaceId,
        semanticRouter: true,
        context: {
          ...input.context,
          workspaceId,
          now: input.context.now || new Date().toISOString(),
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(String(data?.error || 'AI_ASSISTANT_FAILED'));
    }

    return data as TodayAiAssistantAnswer;
  } catch (error) {
    if (stage32LocalFallback) {
      return {
        ...stage32LocalFallback,
        warnings: [
          ...(stage32LocalFallback.warnings || []),
          'Fallback lokalny: modelowy router semantyczny nie odpowiedział, więc użyto awaryjnych reguł z danych aplikacji.',
        ],
      };
    }

    throw error;
  }
}`;

  text = text.slice(0, start) + nextFunction + text.slice(end);
  write(clientPath, text);
  console.log('stage33v2: patched src/lib/ai-assistant.ts semantic-first client path');
}

const semanticServerHelpers = String.raw`
// AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER
// To nie jest słownik fraz. Model dostaje mapę aplikacji i kompaktowy snapshot danych,
// sam tworzy plan odpowiedzi i zwraca ustrukturyzowany JSON zgodny z UI asystenta.
const AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER = true;

function stage33ParseRequestBody(req: any): Record<string, unknown> {
  const body = req?.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }
  return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {};
}

function stage33CompactRecord(kind: string, row: Record<string, unknown>, index: number) {
  const id = getId(row) || asText(row.id) || asText(row.uid) || String(index + 1);
  const title = kind === 'lead'
    ? getLeadDisplayName(row)
    : kind === 'client'
      ? getClientDisplayName(row)
      : kind === 'case'
        ? getCaseDisplayName(row)
        : asText(row.title || row.name || row.subject || row.rawText || row.raw_text) || kind + ' ' + String(index + 1);
  const moment = kind === 'task'
    ? getTaskMoment(row)
    : kind === 'event'
      ? getEventMoment(row)
      : asText(row.nextActionAt || row.next_action_at || row.updatedAt || row.updated_at || row.createdAt || row.created_at);
  return {
    kind,
    id,
    title,
    status: asText(row.status || row.state || row.stage),
    priority: asText(row.priority),
    moment,
    value: getRecordValue(row),
    email: asText(row.email || row.mail || row.contactEmail),
    phone: asText(row.phone || row.telefon || row.mobile || row.contactPhone),
    company: asText(row.company || row.clientName || row.client_name),
    leadId: asText(row.leadId || row.lead_id),
    clientId: asText(row.clientId || row.client_id),
    caseId: asText(row.caseId || row.case_id),
    notes: asText(row.notes || row.note || row.description || row.summary || row.rawText || row.raw_text).slice(0, 240),
  };
}

function stage33BuildCompactSnapshot(context: Record<string, unknown>) {
  const take = (kind: string, value: unknown, limit: number) => safeArray(value).slice(0, limit).map((row, index) => stage33CompactRecord(kind, row, index));
  return {
    appMap: {
      today: 'Dziś: priorytety, zadania, terminy, skróty pracy i szkice AI do sprawdzenia.',
      leads: 'Leady: kontakty sprzedażowe przed przejściem do klienta/sprawy.',
      clients: 'Klienci: kartoteka osób i firm oraz przejście do aktywnych spraw.',
      cases: 'Sprawy: obsługa procesu po sprzedaży lub przyjęciu zlecenia.',
      tasks: 'Zadania: rzeczy do wykonania, statusy, terminy, priorytety.',
      calendar: 'Kalendarz: wydarzenia, spotkania i plan najbliższych dni.',
      aiDrafts: 'Szkice AI: robocze zapisy do ręcznego zatwierdzenia.',
      notifications: 'Powiadomienia: alerty i przypomnienia.',
      billing: 'Rozliczenia: plan, trial, płatności.',
      settings: 'Ustawienia: profil, aplikacja, PWA, preferencje i konfiguracje.',
    },
    counts: {
      leads: safeArray(context.leads).length,
      clients: safeArray((context as any).clients).length,
      cases: safeArray(context.cases).length,
      tasks: safeArray(context.tasks).length,
      events: safeArray(context.events).length,
      drafts: safeArray((context as any).drafts).length,
    },
    leads: take('lead', context.leads, 80),
    clients: take('client', (context as any).clients, 80),
    cases: take('case', context.cases, 80),
    tasks: take('task', context.tasks, 140),
    events: take('event', context.events, 120),
    drafts: take('draft', (context as any).drafts, 40),
  };
}

function stage33SemanticRouterPrompt(rawText: string, context: Record<string, unknown>, nowIso: string) {
  const snapshot = stage33BuildCompactSnapshot(context);
  return [
    'Jesteś semantycznym operatorem danych aplikacji CloseFlow.',
    'Nie jesteś słownikiem fraz. Nie dopasowuj gotowych pytań do gotowych odpowiedzi.',
    'Zrozum intencję użytkownika dowolnie sformułowaną po polsku, utwórz plan zapytania, użyj WYŁĄCZNIE danych z JSON i odpowiedz krótko.',
    'Jeżeli pytanie dotyczy zapisu/utworzenia rekordu, nie twórz finalnego rekordu. Zwróć canAnswer=false, bo zapis obsługują Szkice AI.',
    'Jeżeli nie da się odpowiedzieć z danych aplikacji, zwróć canAnswer=false.',
    'Zwróć tylko poprawny JSON bez markdown. Kształt:',
    '{"canAnswer":true,"intent":"global_app_search|today_briefing|lead_lookup|unknown","title":"...","summary":"...","items":[{"label":"...","detail":"...","href":"/tasks","priority":"low|medium|high"}],"warnings":[]}',
    'Dzisiaj/teraz ISO: ' + nowIso,
    'Pytanie użytkownika: ' + rawText,
    'Snapshot aplikacji JSON:',
    JSON.stringify(snapshot),
  ].join('\n');
}

function stage33ValidIntent(value: unknown): AssistantIntent {
  const normalized = asText(value);
  if (normalized === 'today_briefing' || normalized === 'lead_lookup' || normalized === 'lead_capture' || normalized === 'global_app_search' || normalized === 'blocked_out_of_scope' || normalized === 'unknown') return normalized;
  return 'global_app_search';
}

function stage33ValidPriority(value: unknown): 'low' | 'medium' | 'high' {
  const normalized = asText(value);
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') return normalized;
  return 'medium';
}

function stage33CoerceItems(value: unknown): AssistantItem[] {
  return safeArray(value).slice(0, 10).map((item) => ({
    label: asText(item.label || item.title || item.name) || 'Wynik',
    detail: asText(item.detail || item.summary || item.description),
    href: asText(item.href || item.url || item.path) || undefined,
    priority: stage33ValidPriority(item.priority),
  })).filter((item) => Boolean(item.label));
}

function stage33CoerceWarnings(value: unknown) {
  return Array.isArray(value)
    ? value.map((entry) => asText(entry)).filter(Boolean).slice(0, 4)
    : [];
}

async function tryStage33SemanticAiAnswer(context: Record<string, unknown>, rawText: string, nowIso: string): Promise<AssistantResponse | null> {
  const command = asText(rawText);
  if (!command || command.length > ASSISTANT_MAX_COMMAND_LENGTH) return null;
  const normalized = normalizeText(command);
  if (!normalized) return null;
  if (detectCaptureIntent(normalized)) return null;
  if (OUT_OF_SCOPE_BLOCK_PATTERNS.some((pattern) => pattern.test(normalized))) return null;

  const prompt = stage33SemanticRouterPrompt(command, context, nowIso);
  const generated = await tryGenerateJsonWithAiProvider(prompt, {
    operation: 'ai_assistant_semantic_router_stage33',
    maxOutputTokens: 900,
    temperature: 0.05,
  });

  const json = generated?.json;
  if (!json || json.canAnswer !== true) return null;

  const title = asText(json.title) || 'Odpowiedź z danych aplikacji';
  const summary = asText(json.summary || json.answer) || 'Sprawdziłem dane aplikacji.';

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'semantic_ai:' + generated.provider,
    costGuard: 'external_ai',
    noAutoWrite: true,
    intent: stage33ValidIntent(json.intent),
    title,
    summary,
    rawText: command,
    items: stage33CoerceItems(json.items),
    warnings: stage33CoerceWarnings(json.warnings),
  };
}

async function tryStage33SemanticAssistantFromRequest(req: any): Promise<AssistantResponse | null> {
  const body = stage33ParseRequestBody(req);
  const rawText = asText((body as any).rawText);
  const context = ((body as any).context && typeof (body as any).context === 'object' && !Array.isArray((body as any).context))
    ? (body as any).context as Record<string, unknown>
    : {};
  const nowIso = asText((body as any).now || (context as any).now) || new Date().toISOString();
  return tryStage33SemanticAiAnswer(context, rawText, nowIso);
}

void AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER;
`;

function patchServer() {
  let text = read(serverPath);

  if (!text.includes("import { tryGenerateJsonWithAiProvider } from './ai-provider.js';")) {
    text = "import { tryGenerateJsonWithAiProvider } from './ai-provider.js';\n" + text;
  }

  text = text.replace(/provider:\s*'rules';/, 'provider: string;');

  if (!text.includes('AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER')) {
    const anchor = 'function detectCaptureIntent(query: string) {';
    if (!text.includes(anchor)) fail('Cannot find detectCaptureIntent anchor in src/server/ai-assistant.ts');
    text = text.replace(anchor, semanticServerHelpers + '\n\n' + anchor);
  }

  if (!text.includes('tryStage33SemanticAssistantFromRequest(req)')) {
    const exportRegex = /(export\s+default\s+async\s+function\s+\w+\s*\([^)]*\)\s*\{)/;
    if (!exportRegex.test(text)) fail('Cannot find exported ai assistant handler in src/server/ai-assistant.ts');
    text = text.replace(exportRegex, `$1
  const stage33SemanticEarlyAnswer = await tryStage33SemanticAssistantFromRequest(req).catch(() => null);
  if (stage33SemanticEarlyAnswer) {
    res.status(200).json(stage33SemanticEarlyAnswer);
    return;
  }
`);
  }

  write(serverPath, text);
  console.log('stage33v2: patched src/server/ai-assistant.ts semantic AI router');
}

function patchIndexCss() {
  const importLine = '@import "./styles/stage33a-ai-drafts-generated-text-contrast.css";';
  let text = read(indexCssPath);
  if (text.includes(importLine)) {
    console.log('stage33v2: AI drafts contrast CSS import already present');
    return;
  }

  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== importLine);
  lines.push(importLine);
  write(indexCssPath, lines.join('\n').replace(/\n{3,}/g, '\n\n') + '\n');
  console.log('stage33v2: patched src/index.css with AI drafts contrast CSS import');
}

patchClient();
patchServer();
patchIndexCss();
console.log('stage33v2-semantic-router-and-aidrafts-contrast: patch complete');
