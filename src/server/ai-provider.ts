type AiProviderName = 'gemini' | 'cloudflare';

export type AiJsonProviderResult = {
  provider: AiProviderName;
  model: string;
  json: Record<string, unknown>;
  rawText: string;
};

type AiProviderRuntimeItem = {
  provider: AiProviderName;
  configured: boolean;
  available: boolean;
  model: string;
  role: 'primary' | 'fallback';
};

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asBool(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  const normalized = asText(value).toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

function stripJsonFence(value: string) {
  return value
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

function safeJsonParse(value: string) {
  const cleaned = stripJsonFence(value);
  try {
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
}

function isAiEnabled() {
  return asBool(process.env.AI_ENABLED, false);
}

function normalizeProviderName(value: unknown): AiProviderName | null {
  const normalized = asText(value).toLowerCase();
  if (normalized === 'gemini' || normalized === 'google' || normalized === 'google_gemini') return 'gemini';
  if (normalized === 'cloudflare' || normalized === 'workers_ai' || normalized === 'cloudflare_ai') return 'cloudflare';
  return null;
}

function getPrimaryProvider(): AiProviderName {
  return normalizeProviderName(process.env.AI_PRIMARY_PROVIDER) || 'gemini';
}

function getFallbackProvider(primaryProvider: AiProviderName): AiProviderName {
  return normalizeProviderName(process.env.AI_FALLBACK_PROVIDER) || (primaryProvider === 'gemini' ? 'cloudflare' : 'gemini');
}

function getGeminiKey() {
  return asText(process.env.GEMINI_API_KEY);
}

function getGeminiModel() {
  return asText(process.env.GEMINI_MODEL) || 'gemini-2.5-flash-lite';
}

function getCloudflareAccountId() {
  return asText(process.env.CLOUDFLARE_ACCOUNT_ID);
}

function getCloudflareToken() {
  return asText(process.env.CLOUDFLARE_API_TOKEN);
}

function getCloudflareModel() {
  return asText(process.env.CLOUDFLARE_AI_MODEL) || '@cf/meta/llama-3.1-8b-instruct';
}

export function isGeminiModelAvailable() {
  return isAiEnabled() && Boolean(getGeminiKey());
}

export function isCloudflareModelAvailable() {
  return isAiEnabled() && Boolean(getCloudflareAccountId()) && Boolean(getCloudflareToken()) && Boolean(getCloudflareModel());
}

function buildRuntimeItem(provider: AiProviderName, role: 'primary' | 'fallback'): AiProviderRuntimeItem {
  if (provider === 'gemini') {
    return {
      provider,
      configured: Boolean(getGeminiKey()),
      available: isGeminiModelAvailable(),
      model: getGeminiModel(),
      role,
    };
  }

  return {
    provider,
    configured: Boolean(getCloudflareAccountId()) && Boolean(getCloudflareToken()) && Boolean(getCloudflareModel()),
    available: isCloudflareModelAvailable(),
    model: getCloudflareModel(),
    role,
  };
}

function orderedProviderCandidates() {
  const primaryProvider = getPrimaryProvider();
  const fallbackProvider = getFallbackProvider(primaryProvider);
  const providers: AiProviderRuntimeItem[] = [];
  const seen = new Set<string>();

  for (const [provider, role] of [[primaryProvider, 'primary'], [fallbackProvider, 'fallback']] as const) {
    if (seen.has(provider)) continue;
    seen.add(provider);
    providers.push(buildRuntimeItem(provider, role));
  }

  return providers;
}

export function buildAiProviderRuntimeStatus() {
  const enabled = isAiEnabled();
  const primaryProvider = getPrimaryProvider();
  const fallbackProvider = getFallbackProvider(primaryProvider);
  const orderedProviders = orderedProviderCandidates();
  const firstAvailable = orderedProviders.find((provider) => provider.available) || null;

  return {
    enabled,
    primaryProvider,
    fallbackProvider,
    geminiConfigured: Boolean(getGeminiKey()),
    geminiAvailable: isGeminiModelAvailable(),
    geminiModel: getGeminiModel(),
    cloudflareConfigured: Boolean(getCloudflareAccountId()) && Boolean(getCloudflareToken()) && Boolean(getCloudflareModel()),
    cloudflareAvailable: isCloudflareModelAvailable(),
    cloudflareModel: getCloudflareModel(),
    orderedProviders,
    activeProvider: firstAvailable?.provider || 'rule_parser',
    activeModel: firstAvailable?.model || 'rule_parser',
    mode: firstAvailable ? 'model_with_rule_fallback' : 'rule_parser_only',
  };
}

async function generateWithGemini(prompt: string, options: { operation: string; maxOutputTokens?: number; temperature?: number }): Promise<AiJsonProviderResult | null> {
  if (!isGeminiModelAvailable()) return null;

  const apiKey = getGeminiKey();
  const model = getGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const boundedPrompt = asText(prompt).slice(0, 12000);
  if (!boundedPrompt) return null;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: boundedPrompt }] }],
        generationConfig: {
          temperature: Number.isFinite(options.temperature) ? options.temperature : 0.1,
          maxOutputTokens: options.maxOutputTokens || 900,
          responseMimeType: 'application/json',
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) return null;
    const payload = await response.json();
    const text = asText(payload?.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!text) return null;
    const json = safeJsonParse(text);
    if (!json) return null;

    return {
      provider: 'gemini',
      model,
      json,
      rawText: text,
    };
  } catch {
    return null;
  }
}

function pickCloudflareResponseText(payload: any) {
  const result = payload?.result;
  if (typeof result === 'string') return result.trim();
  if (typeof result?.response === 'string') return result.response.trim();
  if (typeof result?.text === 'string') return result.text.trim();
  if (typeof result?.output_text === 'string') return result.output_text.trim();
  if (typeof payload?.response === 'string') return payload.response.trim();

  const output = result?.output || result?.content;
  if (Array.isArray(output)) {
    return output
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item?.text === 'string') return item.text;
        if (typeof item?.content === 'string') return item.content;
        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  return '';
}

async function generateWithCloudflare(prompt: string, options: { operation: string; maxOutputTokens?: number; temperature?: number }): Promise<AiJsonProviderResult | null> {
  if (!isCloudflareModelAvailable()) return null;

  const accountId = getCloudflareAccountId();
  const token = getCloudflareToken();
  const model = getCloudflareModel();
  const boundedPrompt = asText(prompt).slice(0, 12000);
  if (!boundedPrompt) return null;

  const normalizedModelPath = model.replace(/^\/+/, '');
  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${normalizedModelPath}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: [
              'Jesteś backendowym operatorem AI aplikacji CloseFlow.',
              'Odpowiadasz wyłącznie poprawnym JSON-em wymaganym przez aplikację.',
              'Nie odpowiadasz na pytania spoza aplikacji i nie wykonujesz akcji bez potwierdzenia użytkownika.',
            ].join(' '),
          },
          { role: 'user', content: boundedPrompt },
        ],
        temperature: Number.isFinite(options.temperature) ? options.temperature : 0.1,
        max_tokens: options.maxOutputTokens || 900,
      }),
    });

    if (!response.ok) return null;
    const payload = await response.json();
    if (payload?.success === false) return null;

    const text = pickCloudflareResponseText(payload);
    if (!text) return null;
    const json = safeJsonParse(text);
    if (!json) return null;

    return {
      provider: 'cloudflare',
      model,
      json,
      rawText: text,
    };
  } catch {
    return null;
  }
}

export async function tryGenerateJsonWithAiProvider(
  prompt: string,
  options: {
    operation: string;
    maxOutputTokens?: number;
    temperature?: number;
  },
): Promise<AiJsonProviderResult | null> {
  if (!isAiEnabled()) return null;

  for (const candidate of orderedProviderCandidates()) {
    if (!candidate.available) continue;

    const result = candidate.provider === 'cloudflare'
      ? await generateWithCloudflare(prompt, options)
      : await generateWithGemini(prompt, options);

    if (result) return result;
  }

  return null;
}
