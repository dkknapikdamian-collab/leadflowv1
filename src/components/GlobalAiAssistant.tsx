// STAGE3_AI_APPLICATION_BRAIN_V1
// Global wrapper kept intentionally thin so existing screens can pass their loaded data into TodayAiAssistant.

import React from "react";
import TodayAiAssistant from "./TodayAiAssistant";

type GlobalAiAssistantProps = {
  leads?: unknown[];
  clients?: unknown[];
  cases?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  activities?: unknown[];
  drafts?: unknown[];
  compact?: boolean;
};

export default function GlobalAiAssistant(props: GlobalAiAssistantProps) {
  return <TodayAiAssistant {...props} />;
}

export { GlobalAiAssistant };
