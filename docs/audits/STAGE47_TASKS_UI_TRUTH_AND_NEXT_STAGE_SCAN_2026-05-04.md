# Stage47 — Tasks UI truth/readability + current-state scan

Data: 2026-05-04  
Branch: dev-rollout-freeze

## Decyzja

Ten etap jest mały i celowy. Przed większym etapem z listy produktu trzeba domknąć widoczną niespójność UI w zadaniach:

- usunąć widoczny techniczny tekst o Supabase/Firebase,
- wymusić czytelność akcji `Zrobione/Przywróć` i `Edytuj`,
- dodać guard, żeby regresja nie wróciła.

## Co przeskanowano

- package scripts: check/test/verify surface,
- src pages/components/styles pod kątem technicznego copy,
- TasksStable action surface,
- istniejący Stage45 UI surface audit, jeśli jest obecny w reports.

## Wynik skanu

```json
{
  "stage": "Stage47",
  "purpose": "Tasks UI truth/readability after Stage45/46 and current-state scan before heavier AI/voice-note stages.",
  "scannedAt": "2026-05-04T18:01:06.796Z",
  "branchExpectation": "dev-rollout-freeze",
  "observedFazaScripts": [
    "check:faza5-etap51-ai-read-vs-draft-intent",
    "test:faza2-etap21-workspace-isolation",
    "test:faza2-etap22-rls-backend-security-proof",
    "test:faza3-etap31-plan-source-of-truth",
    "test:faza3-etap32-plan-feature-access-gate",
    "test:faza3-etap32b-plan-visibility-contract",
    "test:faza3-etap32c-access-gate-runtime-hotfix-v3",
    "test:faza3-etap32d-plan-based-ui-visibility",
    "test:faza3-etap32e-settings-digest-billing-visibility-smoke",
    "test:faza3-etap32f-backend-entity-limits-smoke",
    "test:faza3-etap32g-ai-draft-cancel-smoke",
    "test:faza3-etap32h-lead-limit-placement-hotfix",
    "test:faza4-etap41-data-contract-map",
    "test:faza4-etap42-task-event-contract-normalization",
    "test:faza4-etap43-critical-crud-smoke",
    "test:faza4-etap44a-live-refresh-mutation-bus",
    "test:faza4-etap44b-today-live-refresh-import-hotfix",
    "test:faza4-etap44b-today-live-refresh-listener",
    "test:faza4-etap44c-mutation-bus-coverage-smoke",
    "test:faza5-etap51-ai-read-vs-draft-intent"
  ],
  "observedVerifyScripts": [
    "verify:architecture:supabase-first",
    "verify:auth:supabase-stage01",
    "verify:client-acquisition-history-only",
    "verify:closeflow",
    "verify:closeflow:quiet",
    "verify:data-contract-stage05",
    "verify:global-task-unified-modal",
    "verify:migrations:supabase",
    "verify:security:firebase-stage03",
    "verify:security:gemini-client",
    "verify:security:server-only-secrets",
    "verify:task-reminders",
    "verify:tasks-header-cleanup",
    "verify:tasks-visible-actions-stage47"
  ],
  "removedTechnicalCopyFrom": [
    "src/pages/TasksStable.tsx"
  ],
  "immediateFixes": [
    "Remove visible technical Supabase/Firebase copy from source UI surface if present.",
    "Force readable TasksStable Zrobione/Przywróć and Edytuj action buttons.",
    "Add guard verify:tasks-visible-actions-stage47."
  ],
  "nextLargerStageCandidate": "Voice note capture in lead/client/case context, but only after UI truth/readability guards stay green.",
  "uiSurfaceAuditSummary": {
    "hasAudit": true,
    "keys": [
      "generatedAt",
      "routeMap",
      "tasksRoute",
      "counts",
      "findings"
    ]
  }
}
```

## Zmienione pliki

- `src/pages/TasksStable.tsx`
- `src/styles/tasks-header-stage45b-cleanup.css`
- `scripts/verify-tasks-visible-actions-stage47.mjs`
- `package.json`
- `reports/stage47-tasks-ui-truth-scan.json`

## Kryterium zakończenia

- `npm.cmd run verify:tasks-visible-actions-stage47` przechodzi.
- `npm.cmd run lint` przechodzi.
- `npm.cmd run build` przechodzi.
- `npm.cmd run verify:closeflow:quiet` przechodzi.
