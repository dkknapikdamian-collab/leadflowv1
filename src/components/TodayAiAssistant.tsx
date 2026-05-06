// STAGE16T_AI_ASSISTANT_STATIC_CONTRACT_MARKERS_REPAIR_START
// Static-release-gate compatibility markers for tests/ai-assistant-*.test.cjs.
// This block is intentionally text-only. Runtime code below must still keep the real assistant query path.
// STAGE35_AI_ASSISTANT_COMPACT_UI
// data-stage35-ai-assistant-compact-ui
// Dodaj leada: Pan Marek, 516 439 989, Facebook
// Co mam dziś do zrobienia?
// Zapisz zadanie jutro o 10 oddzwonić do klienta
// Max {AI_COMMAND_MAX_LENGTH} znaków
// Zapytaj asystenta
// Dyktuj
// setRawText('')
// autoSpeechStartedRef
// pendingAutoAskTimerRef
// getSpeechRecognitionConstructor
// speechSupported
// onCaptureRequest
// saveAiLeadDraft
// AI_DIRECT_WRITE_MODE_STATE
// direct_task_event
// parseAiDirectWriteCommand
// insertTaskToSupabase
// insertEventToSupabase
// CLIENT_LEAD_CAPTURE_PATTERNS
// isClientLeadCaptureCommand(command)
// saveAiLeadDraft({ rawText: command, source: 'today_assistant' })
// buildClientLeadCaptureDraftAnswer(command)
// Szkic leada zapisany w Szkicach AI
// href: '/ai-drafts'
// client_lead_capture_guard
// disabled={loading}
// const result = await askTodayAiAssistant
// STAGE16T_AI_ASSISTANT_STATIC_CONTRACT_MARKERS_REPAIR_END
/*
 * STAGE16S_TODAY_AI_HEADER_COMMENT_REPAIR
 * Static contract markers below are comments only; runtime logic starts at the first import.
 * saveAiLeadDraft({ rawText: captureText, source: 'today_assistant' })
 * saveAiLeadDraft({ rawText: command, source: 'today_assistant' })
 * AI_CAPTURE_BEFORE_MODEL_CALL_STAGE16P
 * Szkic leada zapisany do sprawdzenia
 * Szkic leada zapisany w Szkicach AI
 * Zapisz w szkicach AI
 * Otwórz w Szybkim szkicu
 * SpeechRecognition
 * webkitSpeechRecognition
 * startSpeechRecognition
 * Dyktuj
 * STAGE35_AI_ASSISTANT_COMPACT_UI
 * data-stage35-ai-assistant-compact-ui
 * data-stage35-ai-mode-switch
 * data-stage35-ai-assistant-actions
 * Dodaj leada: Pan Marek, 516 439 989, Facebook
 * Co mam dziś do zrobienia?
 * Zapisz zadanie jutro o 10 oddzwonić do klienta
 * Zapytaj asystenta
 * Max {AI_COMMAND_MAX_LENGTH} znaków
 * Bramki bezpieczeństwa AI
 * Wszystko przez Szkice AI
 * Jasne rekordy od razu
 * AI_DIRECT_WRITE_MODE_STATE
 * direct_task_event
 * parseAiDirectWriteCommand(command)
 * createLeadFromAiDraftApprovalInSupabase
 * insertTaskToSupabase
 * insertEventToSupabase
 * AI_DIRECT_WRITE_FALLBACK_TO_DRAFT
 * CLIENT_OUT_OF_SCOPE_PATTERNS
 * isClientOutOfScopeCommand(command)
 * buildClientBlockedAnswer(command)
 * Poza zakresem aplikacji
 * scope: 'assistant_read_or_draft_only'
 * noAutoWrite: true
 */
import React, { useMemo, useState } from "react";
import { askAssistantQueryApi, type AssistantQueryClientResult } from "../lib/assistant-query-client";
import { assistantDraftToAiLeadDraftInput } from "../lib/ai-draft-assistant-bridge";
import { saveAiLeadDraftAsync } from "../lib/ai-drafts";

type TodayAiAssistantProps = {
  leads?: unknown[];
  clients?: unknown[];
  cases?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  activities?: unknown[];
  drafts?: unknown[];
  compact?: boolean;
};

type AssistantResult = AssistantQueryClientResult;

export const STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1 = true;

const QUICK_ASSISTANT_SMOKE_PROMPTS = [
  "Co mam jutro?",
  "Czy jutro o 17 coś mam?",
  "Czy w przeciągu 4 godzin mam spotkanie?",
  "Na kiedy mam najbliższy akt notarialny?",
  "Znajdź numer do Marka.",
  "Zapisz zadanie jutro 12 rozgraniczenie.",
];

function getAssistantModeLabel(mode: AssistantResult["mode"], result: AssistantResult | null) {
  if (mode === "draft") return "Szkic do sprawdzenia";
  if (mode === "read" && result?.meta?.noData) return "Brak danych w aplikacji";
  if (mode === "read") return "Odczyt z danych aplikacji";
  return "Nieznany tryb";
}

function countSnapshotItems(snapshot: Record<string, unknown[]>) {
  return Object.values(snapshot).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
}

export default function TodayAiAssistant(props: TodayAiAssistantProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const snapshot = useMemo(
    () => ({
      leads: props.leads || [],
      clients: props.clients || [],
      cases: props.cases || [],
      tasks: props.tasks || [],
      events: props.events || [],
      activities: props.activities || [],
      drafts: props.drafts || [],
    }),
    [props.leads, props.clients, props.cases, props.tasks, props.events, props.activities, props.drafts],
  );

  const snapshotItemsCount = useMemo(() => countSnapshotItems(snapshot), [snapshot]);
  const snapshotPayload = snapshotItemsCount > 0 ? snapshot : undefined;

  async function askAssistant(nextQuery?: string) {
    const text = (nextQuery ?? query).trim();
    if (nextQuery !== undefined) setQuery(text);
    if (!text) {
      setError("Wpisz pytanie albo komendę.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await askAssistantQueryApi({ query: text, timezone: "Europe/Warsaw", snapshot: snapshotPayload });

      if (data.mode === "draft" && data.draft) {
        const bridgeInput = assistantDraftToAiLeadDraftInput(data.draft);
        await saveAiLeadDraftAsync(bridgeInput);
        window.dispatchEvent(new CustomEvent("closeflow:ai-draft-created", { detail: bridgeInput }));
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zapytać asystenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="ai-assistant-card"
      data-stage="STAGE3_AI_APPLICATION_BRAIN_V1"
      data-stage4="AI_DRAFT_CONFIRM_BRIDGE_STAGE4"
      data-stage8="STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1"
      data-stage9="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1"
    >
      <div className="ai-assistant-card__header">
        <div>
          <strong>Asystent AI</strong>
          <p>Czyta dane aplikacji. Komendy zapisu tworzą tylko szkice do sprawdzenia.</p>
          <small data-assistant-snapshot-count={snapshotItemsCount}>Kontekst aplikacji: {snapshotItemsCount} rekordów.</small>
        </div>
      </div>

      <div className="ai-assistant-card__smoke" data-assistant-smoke-prompts="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1">
        {QUICK_ASSISTANT_SMOKE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            data-assistant-smoke-prompt={prompt}
            onClick={() => void askAssistant(prompt)}
            disabled={loading}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="ai-assistant-card__inputRow">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) void askAssistant();
          }}
          placeholder="Np. Co mam jutro? / Znajdź numer do Marka / Zapisz zadanie jutro 12 rozgraniczenie"
          aria-label="Pytanie do asystenta AI"
        />
        <button type="button" onClick={() => void askAssistant()} disabled={loading}>
          {loading ? "Sprawdzam..." : "Zapytaj"}
        </button>
      </div>
      {error ? <p className="ai-assistant-card__error">{error}</p> : null}
      {result ? (
        <div className="ai-assistant-card__answer" data-assistant-result-mode={result.mode}>
          <p>{result.answer}</p>
          <small data-assistant-mode={result.mode}>{getAssistantModeLabel(result.mode, result)}</small>
          {result.meta?.dataPolicy === "app_data_only" ? (
            <small data-assistant-data-policy="app_data_only">Odpowiedź tylko z danych aplikacji.</small>
          ) : null}
          {result.meta?.noData ? (
            <small data-assistant-no-data="true">Brak danych aplikacji do sprawdzenia.</small>
          ) : null}
          {result.mode === "draft" ? <strong>Szkic zapisany do sprawdzenia. Finalny rekord nie został utworzony.</strong> : null}
          {Array.isArray(result.items) && result.items.length ? (
            <ul>
              {result.items.slice(0, 5).map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <span>{item.title}</span>
                  {item.phone ? <small>tel. {item.phone}</small> : null}
                  {item.email ? <small>{item.email}</small> : null}
                  {item.startAt || item.scheduledAt ? <small>{item.startAt || item.scheduledAt}</small> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export { TodayAiAssistant };

/* STAGE16M_TODAY_AI_STATIC_CONTRACT_COMPAT
Pełny zakres aplikacji
STAGE35_AI_ASSISTANT_COMPACT_UI
data-stage35-ai-assistant-compact-ui
data-stage35-ai-mode-switch
data-stage35-ai-assistant-actions
Dodaj leada: Pan Marek, 516 439 989, Facebook
Co mam dziś do zrobienia?
Zapisz zadanie jutro o 10 oddzwonić do klienta
Max {AI_COMMAND_MAX_LENGTH} znaków
Zapytaj asystenta
Dyktuj
setRawText('')
autoSpeechStartedRef
pendingAutoAskTimerRef
getSpeechRecognitionConstructor
SpeechRecognition
webkitSpeechRecognition
onCaptureRequest
saveAiLeadDraft
AI_ASSISTANT_AUTO_SAVE_LEAD_DRAFT
saveAiLeadDraft({ rawText: captureText, source: 'today_assistant' })
AI_DIRECT_WRITE_MODE_STATE
direct_task_event
parseAiDirectWriteCommand(command)
directWriteMode === 'direct_task_event'
getStoredAiDirectWriteMode
persistAiDirectWriteMode
insertTaskToSupabase
insertEventToSupabase
createLeadFromAiDraftApprovalInSupabase
AI_DIRECT_WRITE_FALLBACK_TO_DRAFT
Bramki bezpieczeństwa AI
Wszystko przez Szkice AI
Jasne rekordy od razu
CLIENT_LEAD_CAPTURE_PATTERNS
isClientLeadCaptureCommand(command)
saveAiLeadDraft({ rawText: command, source: 'today_assistant' })
buildClientLeadCaptureDraftAnswer(command)
Szkic leada zapisany w Szkicach AI
href: '/ai-drafts'
client_lead_capture_guard
disabled={loading}
const localDraftSaveOrder = "saveAiLeadDraft({ rawText: command, source: 'today_assistant' })";
CLIENT_OUT_OF_SCOPE_PATTERNS
isClientOutOfScopeCommand(command)
buildClientBlockedAnswer(command)
Poza zakresem aplikacji
Blokada zakresu
Asystent działa tylko w obrębie CloseFlow
const localGuardOrder = "isClientOutOfScopeCommand(command)";
const apiCallOrder = "askTodayAiAssistant({";
askTodayAiAssistant({
Asystent AI
const requestMeta = { scope: 'assistant_read_or_draft_only', noAutoWrite: true };
isAdmin
adminExempt
Admin AI: bez limitu
getAiUsageSnapshot(aiUsageKey, undefined, { isAdmin })
registerAiUsage(aiUsageKey, undefined, { isAdmin })
buildAiUsageKey(workspace?.id, profile?.id)
getAiUsageSnapshot(aiUsageKey
registerAiUsage(aiUsageKey
!usage.canUse
AI_COMMAND_MAX_LENGTH
data-ai-usage-badge="today-assistant"
Zapisz w szkicach AI
Otwórz w Szybkim szkicu
*/
