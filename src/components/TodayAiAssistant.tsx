// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1
// STAGE3_AI_APPLICATION_BRAIN_V1
// AI_DRAFT_CONFIRM_BRIDGE_STAGE4
// Assistant UI. It calls /api/assistant/query and saves write intents as Supabase-backed review drafts.

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

  async function askAssistant() {
    const text = query.trim();
    if (!text) {
      setError("Wpisz pytanie albo komendę.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await askAssistantQueryApi({ query: text, timezone: "Europe/Warsaw", snapshot });

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
    <section className="ai-assistant-card" data-stage="STAGE3_AI_APPLICATION_BRAIN_V1" data-stage4="AI_DRAFT_CONFIRM_BRIDGE_STAGE4" data-stage8="STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1">
      <div className="ai-assistant-card__header">
        <div>
          <strong>Asystent AI</strong>
          <p>Czyta dane aplikacji. Komendy zapisu tworzą tylko szkice do sprawdzenia.</p>
        </div>
      </div>
      <div className="ai-assistant-card__inputRow">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) askAssistant();
          }}
          placeholder="Np. Co mam jutro? / Znajdź numer do Marka / Zapisz zadanie jutro 12 rozgraniczenie"
          aria-label="Pytanie do asystenta AI"
        />
        <button type="button" onClick={askAssistant} disabled={loading}>
          {loading ? "Sprawdzam..." : "Zapytaj"}
        </button>
      </div>
      {error ? <p className="ai-assistant-card__error">{error}</p> : null}
      {result ? (
        <div className="ai-assistant-card__answer">
          <p>{result.answer}</p>
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
