type AiLeadDraft = {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  dealValue: number;
};

type AiTaskDraft = {
  enabled: boolean;
  title: string;
  type: string;
  dueAt: string;
  priority: string;
};

type AiCaptureDraft = {
  ok: boolean;
  mode: 'draft_only';
  provider: string;
  rawText: string;
  confidence: number;
  lead: AiLeadDraft;
  task: AiTaskDraft;
  warnings: string[];
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

function parseJsonBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}') as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function safeNumber(value: unknown) {
  const text = asText(value).replace(',', '.').replace(/[^0-9.]/g, '');
  const parsed = Number(text);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0;
}

function toLocalInputValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getTomorrowAtNine() {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  return next;
}

function resolveDueAt(rawText: string) {
  const lower = rawText.toLowerCase();
  const now = new Date();
  const target = new Date(now);

  if (/za\s*1\s*h|za\s*godzin[ęe]/u.test(lower)) {
    return toLocalInputValue(new Date(now.getTime() + 60 * 60_000));
  }

  if (/za\s*2\s*dni|pojutrze/u.test(lower)) {
    target.setDate(target.getDate() + 2);
    target.setHours(9, 0, 0, 0);
    return toLocalInputValue(target);
  }

  if (/przysz[łl]y\s*tydzie[ńn]|za\s*tydzie[ńn]/u.test(lower)) {
    target.setDate(target.getDate() + 7);
    target.setHours(9, 0, 0, 0);
    return toLocalInputValue(target);
  }

  if (/jutro/u.test(lower)) {
    return toLocalInputValue(getTomorrowAtNine());
  }

  if (/dzi[śs]|dzisiaj/u.test(lower)) {
    target.setHours(Math.max(now.getHours() + 1, 9), 0, 0, 0);
    return toLocalInputValue(target);
  }

  return toLocalInputValue(getTomorrowAtNine());
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
}

function extractPhone(text: string) {
  const match = text.match(/(?:\+?48[\s-]?)?(?:\d[\s-]?){9,}/);
  if (!match) return '';
  const digits = match[0].replace(/\D/g, '');
  if (digits.length < 9) return '';
  const normalized = digits.startsWith('48') && digits.length === 11 ? digits.slice(2) : digits.slice(-9);
  return normalized.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

function extractValue(text: string) {
  const lower = text.toLowerCase();
  const match = lower.match(/(?:warto[śćsc]|bud[żz]et|wycena|kwota|oko[łl]o|za)\s*[:\-]?\s*(\d+[\s\d]*(?:[,.]\d+)?)\s*(?:z[łl]|pln)?/u);
  if (match?.[1]) return safeNumber(match[1]);
  const fallback = lower.match(/(\d+[\s\d]{2,})\s*(?:z[łl]|pln)/u);
  return fallback?.[1] ? safeNumber(fallback[1]) : 0;
}

function extractName(text: string, phone: string, email: string) {
  const cleaned = normalizeWhitespace(
    text
      .replace(email, ' ')
      .replace(phone, ' ')
      .replace(/[0-9+()\-]{6,}/g, ' '),
  );

  const directPatterns = [
    /(?:kontakt|klient|lead|dzwoni[łl]a?|pani|pan)\s+([A-ZŁŚŻŹĆŃÓĘĄ][\p{L}'-]+(?:\s+[A-ZŁŚŻŹĆŃÓĘĄ][\p{L}'-]+){0,2})/u,
    /(?:nazywa\s+si[ęe]|to\s+jest)\s+([A-ZŁŚŻŹĆŃÓĘĄ][\p{L}'-]+(?:\s+[A-ZŁŚŻŹĆŃÓĘĄ][\p{L}'-]+){0,2})/u,
    /^([A-ZŁŚŻŹĆŃÓĘĄ][\p{L}'-]+(?:\s+[A-ZŁŚŻŹĆŃÓĘĄ][\p{L}'-]+){1,2})\b/u,
  ];

  for (const pattern of directPatterns) {
    const match = cleaned.match(pattern);
    if (match?.[1]) return normalizeWhitespace(match[1]);
  }

  return '';
}

function extractCompany(text: string) {
  const match = text.match(/(?:firma|sp[oó][łl]ka|dzia[łl]alno[śćsc])\s+([\p{L}0-9 .,&-]{2,40})/iu);
  return match?.[1] ? normalizeWhitespace(match[1]).replace(/[.,;:]$/, '') : '';
}

function extractTopic(text: string) {
  const match = text.match(/w\s+sprawie\s+([^,.\n]{3,80})/iu);
  if (match?.[1]) return normalizeWhitespace(match[1]).replace(/[.,;:]$/, '');
  const lower = text.toLowerCase();
  if (lower.includes('stron')) return 'strony WWW';
  if (lower.includes('sklep')) return 'sklepu internetowego';
  if (lower.includes('księg') || lower.includes('ksieg')) return 'obsługi księgowej';
  if (lower.includes('nieruchomo')) return 'nieruchomości';
  return '';
}

function inferSource(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('instagram') || lower.includes('insta')) return 'instagram';
  if (lower.includes('facebook') || lower.includes('fb')) return 'facebook';
  if (lower.includes('messenger')) return 'messenger';
  if (lower.includes('whatsapp')) return 'whatsapp';
  if (lower.includes('mail') || lower.includes('email') || lower.includes('e-mail')) return 'email';
  if (lower.includes('telefon') || lower.includes('dzwoni')) return 'phone';
  if (lower.includes('polecen')) return 'referral';
  return 'other';
}

function buildRuleDraft(rawText: string, provider = 'rule_parser'): AiCaptureDraft {
  const text = normalizeWhitespace(rawText);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const name = extractName(text, phone, email);
  const company = extractCompany(text);
  const topic = extractTopic(text);
  const dueAt = resolveDueAt(text);
  const warnings: string[] = [];

  if (!name && !company) warnings.push('Nie wykryto pewnej nazwy klienta. Uzupełnij ją przed zapisem.');
  if (!phone && !email) warnings.push('Nie wykryto telefonu ani e-maila. Sprawdź dane kontaktowe.');

  const displayName = name || company || 'Nowy lead';
  const taskTitle = topic ? `Follow-up: ${displayName} - ${topic}` : `Follow-up: ${displayName}`;

  return {
    ok: true,
    mode: 'draft_only',
    provider,
    rawText: text,
    confidence: name || phone || email ? 0.72 : 0.45,
    lead: {
      name: displayName,
      company,
      email,
      phone,
      source: inferSource(text),
      dealValue: extractValue(text),
    },
    task: {
      enabled: /oddzwo|follow|przypom|jutro|kontakt|za\s+\d|telefon/u.test(text.toLowerCase()),
      title: taskTitle,
      type: 'follow_up',
      dueAt,
      priority: /pilne|ważne|wazne|dzisiaj|dzi[śs]/u.test(text.toLowerCase()) ? 'high' : 'medium',
    },
    warnings,
  };
}

function sanitizeAiDraft(candidate: any, rawText: string, provider: string): AiCaptureDraft {
  const fallback = buildRuleDraft(rawText, provider);
  const lead = candidate?.lead && typeof candidate.lead === 'object' ? candidate.lead : {};
  const task = candidate?.task && typeof candidate.task === 'object' ? candidate.task : {};

  return {
    ...fallback,
    provider,
    confidence: Math.max(0, Math.min(1, Number(candidate?.confidence ?? fallback.confidence) || fallback.confidence)),
    lead: {
      name: asText(lead.name) || fallback.lead.name,
      company: asText(lead.company) || fallback.lead.company,
      email: asText(lead.email) || fallback.lead.email,
      phone: asText(lead.phone) || fallback.lead.phone,
      source: asText(lead.source) || fallback.lead.source,
      dealValue: safeNumber(lead.dealValue) || fallback.lead.dealValue,
    },
    task: {
      enabled: typeof task.enabled === 'boolean' ? task.enabled : fallback.task.enabled,
      title: asText(task.title) || fallback.task.title,
      type: asText(task.type) || fallback.task.type,
      dueAt: asText(task.dueAt) || fallback.task.dueAt,
      priority: asText(task.priority) || fallback.task.priority,
    },
    warnings: Array.isArray(candidate?.warnings) ? candidate.warnings.map(asText).filter(Boolean).slice(0, 5) : fallback.warnings,
  };
}

async function tryGeminiDraft(rawText: string) {
  const apiKey = asText(process.env.GEMINI_API_KEY);
  if (!apiKey) return null;

  const model = asText(process.env.GEMINI_MODEL) || 'gemini-2.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt = [
    'Zamień notatkę operatora sprzedaży na bezpieczny szkic JSON.',
    'Nie dopowiadaj danych, których nie ma w notatce.',
    'Zwróć wyłącznie JSON z polami: lead{name,company,email,phone,source,dealValue}, task{enabled,title,type,dueAt,priority}, confidence, warnings.',
    'dueAt zwracaj w formacie YYYY-MM-DDTHH:mm czasu lokalnego Europe/Warsaw.',
    `Notatka: ${rawText}`,
  ].join('\n');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    const text = asText(json?.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default async function aiCaptureHandler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseJsonBody(req);
    const rawText = normalizeWhitespace(asText((body as any).text || (body as any).rawText || (body as any).note));

    if (!rawText || rawText.length < 4) {
      res.status(400).json({ error: 'AI_CAPTURE_TEXT_REQUIRED' });
      return;
    }

    if (rawText.length > 4000) {
      res.status(400).json({ error: 'AI_CAPTURE_TEXT_TOO_LONG' });
      return;
    }

    const aiEnabled = asBool(process.env.AI_ENABLED, false);
    const quickLeadEnabled = asBool(process.env.QUICK_LEAD_CAPTURE_ENABLED, true);

    if (!quickLeadEnabled) {
      res.status(403).json({ error: 'QUICK_LEAD_CAPTURE_DISABLED' });
      return;
    }

    if (aiEnabled) {
      const geminiDraft = await tryGeminiDraft(rawText);
      if (geminiDraft) {
        res.status(200).json(sanitizeAiDraft(geminiDraft, rawText, 'gemini'));
        return;
      }
    }

    res.status(200).json(buildRuleDraft(rawText));
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'AI_CAPTURE_FAILED' });
  }
}
