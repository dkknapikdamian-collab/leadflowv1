type AiProviderName = 'gemini';

export type AiJsonProviderResult = {
  provider: AiProviderName;
  model: string;
  json: Record<string, unknown>;
  rawText: string;
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

function getGeminiKey() {
  return asText(process.env.GEMINI_API_KEY);
}

function getGeminiModel() {
  return asText(process.env.GEMINI_MODEL) || 'gemini-2.5-flash-lite';
}

export function isGeminiModelAvailable() {
  return isAiEnabled() && Boolean(getGeminiKey());
}

export function buildAiProviderRuntimeStatus() {
  return {
    enabled: isAiEnabled(),
    primaryProvider: asText(process.env.AI_PRIMARY_PROVIDER) || 'gemini',
    geminiConfigured: Boolean(getGeminiKey()),
    geminiAvailable: isGeminiModelAvailable(),
    geminiModel: getGeminiModel(),
    mode: isGeminiModelAvailable() ? 'model_with_rule_fallback' : 'rule_parser_only',
  };
}

export async function tryGenerateJsonWithAiProvider(
  prompt: string,
  options: {
    operation: string;
    maxOutputTokens?: number;
    temperature?: number;
  },
): Promise<AiJsonProviderResult | null> {
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
