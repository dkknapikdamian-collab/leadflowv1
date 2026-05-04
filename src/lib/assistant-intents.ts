export const AI_ASSISTANT_INTENTS = {
  read: 'read',
  search: 'search',
  answer: 'answer',
  createDraftLead: 'create_draft_lead',
  createDraftTask: 'create_draft_task',
  createDraftEvent: 'create_draft_event',
  createDraftNote: 'create_draft_note',
  unknown: 'unknown',
} as const;

export type AssistantIntent = (typeof AI_ASSISTANT_INTENTS)[keyof typeof AI_ASSISTANT_INTENTS];

export const READ_ONLY_INTENTS: readonly AssistantIntent[] = [
  AI_ASSISTANT_INTENTS.read,
  AI_ASSISTANT_INTENTS.search,
  AI_ASSISTANT_INTENTS.answer,
  AI_ASSISTANT_INTENTS.unknown,
] as const;

export const WRITE_DRAFT_INTENTS: readonly AssistantIntent[] = [
  AI_ASSISTANT_INTENTS.createDraftLead,
  AI_ASSISTANT_INTENTS.createDraftTask,
  AI_ASSISTANT_INTENTS.createDraftEvent,
  AI_ASSISTANT_INTENTS.createDraftNote,
] as const;

export const UNKNOWN_INTENT: AssistantIntent = AI_ASSISTANT_INTENTS.unknown;

export type AssistantIntentClassification = {
  intent: AssistantIntent;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  requiresExplicitUserConfirmation: boolean;
  mayCreateDraft: boolean;
  mayCreateFinalRecord: false;
};

const WRITE_VERB_RE = /\b(zapisz|dodaj|utw[oó]rz|stw[oó]rz|zaplanuj|przypomnij|um[oó]w|wpisz|zanotuj|zarejestruj)\b/i;
const READ_VERB_RE = /\b(co mam|poka[zż]|znajd[zź]|wyszukaj|sprawd[zź]|czy mam|jakie mam|gdzie jest|podsumuj|odczytaj)\b/i;
const LEAD_HINT_RE = /\b(lead|leada|kontakt|klient|klienta|prospekt|zapytanie|telefon|dzwoni[łlła]|napisa[łlła])\b/i;
const TASK_HINT_RE = /\b(zadanie|task|follow[- ]?up|oddzwoni[ćc]|odpisa[ćc]|przypomnienie|do zrobienia|todo)\b/i;
const EVENT_HINT_RE = /\b(wydarzenie|spotkanie|termin|call|rozmowa|kalendarz|wizyta|demo|prezentacja|jutro o|dzi[sś] o|o \d{1,2}[:.]\d{2})\b/i;
const NOTE_HINT_RE = /\b(notatka|notatk[ęe]|uwaga|memo|opis|podsumowanie rozmowy)\b/i;
const SINGLE_NAME_RE = /^[A-ZĄĆĘŁŃÓŚŹŻ][\p{L}'-]+(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][\p{L}'-]+){0,3}$/u;

export function isWriteDraftIntent(intent: AssistantIntent): boolean {
  return WRITE_DRAFT_INTENTS.includes(intent);
}

export function isReadOnlyIntent(intent: AssistantIntent): boolean {
  return READ_ONLY_INTENTS.includes(intent);
}

export function shouldCreateDraftForIntent(intent: AssistantIntent): boolean {
  return isWriteDraftIntent(intent);
}

export function classifyAssistantIntent(rawText: unknown): AssistantIntentClassification {
  const text = String(rawText || '').trim();

  if (!text) {
    return {
      intent: AI_ASSISTANT_INTENTS.unknown,
      confidence: 'low',
      reason: 'empty_input',
      requiresExplicitUserConfirmation: false,
      mayCreateDraft: false,
      mayCreateFinalRecord: false,
    };
  }

  if (SINGLE_NAME_RE.test(text) && !WRITE_VERB_RE.test(text)) {
    return {
      intent: AI_ASSISTANT_INTENTS.search,
      confidence: 'medium',
      reason: 'single_name_without_write_verb_is_search',
      requiresExplicitUserConfirmation: false,
      mayCreateDraft: false,
      mayCreateFinalRecord: false,
    };
  }

  if (WRITE_VERB_RE.test(text)) {
    if (TASK_HINT_RE.test(text)) {
      return {
        intent: AI_ASSISTANT_INTENTS.createDraftTask,
        confidence: 'high',
        reason: 'explicit_write_verb_with_task_hint',
        requiresExplicitUserConfirmation: true,
        mayCreateDraft: true,
        mayCreateFinalRecord: false,
      };
    }

    if (EVENT_HINT_RE.test(text)) {
      return {
        intent: AI_ASSISTANT_INTENTS.createDraftEvent,
        confidence: 'high',
        reason: 'explicit_write_verb_with_event_hint',
        requiresExplicitUserConfirmation: true,
        mayCreateDraft: true,
        mayCreateFinalRecord: false,
      };
    }

    if (LEAD_HINT_RE.test(text)) {
      return {
        intent: AI_ASSISTANT_INTENTS.createDraftLead,
        confidence: 'high',
        reason: 'explicit_write_verb_with_lead_hint',
        requiresExplicitUserConfirmation: true,
        mayCreateDraft: true,
        mayCreateFinalRecord: false,
      };
    }

    if (NOTE_HINT_RE.test(text)) {
      return {
        intent: AI_ASSISTANT_INTENTS.createDraftNote,
        confidence: 'high',
        reason: 'explicit_write_verb_with_note_hint',
        requiresExplicitUserConfirmation: true,
        mayCreateDraft: true,
        mayCreateFinalRecord: false,
      };
    }

    return {
      intent: AI_ASSISTANT_INTENTS.unknown,
      confidence: 'low',
      reason: 'write_verb_without_safe_entity_hint',
      requiresExplicitUserConfirmation: false,
      mayCreateDraft: false,
      mayCreateFinalRecord: false,
    };
  }

  if (READ_VERB_RE.test(text)) {
    if (/\b(znajd[zź]|wyszukaj|gdzie jest)\b/i.test(text)) {
      return {
        intent: AI_ASSISTANT_INTENTS.search,
        confidence: 'high',
        reason: 'read_only_search_phrase',
        requiresExplicitUserConfirmation: false,
        mayCreateDraft: false,
        mayCreateFinalRecord: false,
      };
    }

    return {
      intent: AI_ASSISTANT_INTENTS.read,
      confidence: 'high',
      reason: 'read_only_question_or_command',
      requiresExplicitUserConfirmation: false,
      mayCreateDraft: false,
      mayCreateFinalRecord: false,
    };
  }

  return {
    intent: AI_ASSISTANT_INTENTS.answer,
    confidence: 'medium',
    reason: 'default_answer_without_write_verb',
    requiresExplicitUserConfirmation: false,
    mayCreateDraft: false,
    mayCreateFinalRecord: false,
  };
}

export const STAGE51_INTENT_FIXTURES = [
  {
    input: 'Co mam jutro?',
    expectedIntent: AI_ASSISTANT_INTENTS.read,
    expectedMayCreateDraft: false,
  },
  {
    input: 'Znajdź numer do Marka',
    expectedIntent: AI_ASSISTANT_INTENTS.search,
    expectedMayCreateDraft: false,
  },
  {
    input: 'Dorota Kołodziej',
    expectedIntent: AI_ASSISTANT_INTENTS.search,
    expectedMayCreateDraft: false,
  },
  {
    input: 'Zapisz zadanie jutro 12:00 oddzwonić do Anny',
    expectedIntent: AI_ASSISTANT_INTENTS.createDraftTask,
    expectedMayCreateDraft: true,
  },
  {
    input: 'Dodaj wydarzenie spotkanie z klientem jutro o 12:00',
    expectedIntent: AI_ASSISTANT_INTENTS.createDraftEvent,
    expectedMayCreateDraft: true,
  },
  {
    input: 'Zapisz kontakt Jan Kowalski, dzwonił w sprawie strony',
    expectedIntent: AI_ASSISTANT_INTENTS.createDraftLead,
    expectedMayCreateDraft: true,
  },
  {
    input: 'Zanotuj notatkę: klient chce ofertę do piątku',
    expectedIntent: AI_ASSISTANT_INTENTS.createDraftNote,
    expectedMayCreateDraft: true,
  },
  {
    input: 'Zapisz to',
    expectedIntent: AI_ASSISTANT_INTENTS.unknown,
    expectedMayCreateDraft: false,
  },
] as const;
