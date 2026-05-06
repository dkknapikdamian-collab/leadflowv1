# FINAL QA FAILED DETAILS — 2026-05-06

Cel: zebrać dokładne assertiony dla wszystkich czerwonych gateów bez zatrzymywania się na pierwszym błędzie.

- Passed: 0
- Failed: 26
- Logi: `test-results/stage16l-failed-details/`

## Failed summary

1. `npm run verify:closeflow:quiet` exit=1 log=`test-results/stage16l-failed-details/npm-run-verify_closeflow_quiet.log`
2. `npm run test:critical` exit=1 log=`test-results/stage16l-failed-details/npm-run-test_critical.log`
3. `node --test tests/ai-assistant-admin-and-app-scope.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-admin-and-app-scope.test.cjs.log`
4. `node --test tests/ai-assistant-autospeech-and-clear-input.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-autospeech-and-clear-input.test.cjs.log`
5. `node --test tests/ai-assistant-capture-handoff.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-capture-handoff.test.cjs.log`
6. `node --test tests/ai-assistant-command-center.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-command-center.test.cjs.log`
7. `node --test tests/ai-assistant-global-app-search.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-global-app-search.test.cjs.log`
8. `node --test tests/ai-assistant-save-vs-search-rule.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-save-vs-search-rule.test.cjs.log`
9. `node --test tests/ai-assistant-scope-budget-guard.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-assistant-scope-budget-guard.test.cjs.log`
10. `node --test tests/ai-direct-write-respects-mode-stage28.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-direct-write-respects-mode-stage28.test.cjs.log`
11. `node --test tests/ai-draft-inbox-command-center.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-draft-inbox-command-center.test.cjs.log`
12. `node --test tests/ai-draft-inbox-flow.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-draft-inbox-flow.test.cjs.log`
13. `node --test tests/ai-safety-gates-direct-write.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-safety-gates-direct-write.test.cjs.log`
14. `node --test tests/ai-usage-limit-guard.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ai-usage-limit-guard.test.cjs.log`
15. `node --test tests/billing-ui-polish-and-diagnostics.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_billing-ui-polish-and-diagnostics.test.cjs.log`
16. `node --test tests/case-detail-write-access-gate-stage02b.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_case-detail-write-access-gate-stage02b.test.cjs.log`
17. `node --test tests/faza2-etap21-workspace-isolation.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_faza2-etap21-workspace-isolation.test.cjs.log`
18. `node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_faza3-etap32d-plan-based-ui-visibility.test.cjs.log`
19. `node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs.log`
20. `node --test tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_faza5-etap51-ai-read-vs-draft-intent.test.cjs.log`
21. `node --test tests/request-identity-vercel-api-signature.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_request-identity-vercel-api-signature.test.cjs.log`
22. `node --test tests/stage35-ai-assistant-compact-ui.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_stage35-ai-assistant-compact-ui.test.cjs.log`
23. `node --test tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_stage35c-ai-autospeech-compact-contract-fix.test.cjs.log`
24. `node --test tests/stage94-ai-layer-separation-copy.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_stage94-ai-layer-separation-copy.test.cjs.log`
25. `node --test tests/ui-completed-label-consistency.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ui-completed-label-consistency.test.cjs.log`
26. `node --test tests/ui-copy-and-billing-cleanup.test.cjs` exit=1 log=`test-results/stage16l-failed-details/tests_ui-copy-and-billing-cleanup.test.cjs.log`

## Failure details

### 1. npm run verify:closeflow:quiet

- Command: `npm.cmd run verify:closeflow:quiet`
- Exit: `1`
- Duration: `11.5s`
- Full log: `test-results/stage16l-failed-details/npm-run-verify_closeflow_quiet.log`

```text
FAILED: tests/billing-ui-polish-and-diagnostics.test.cjs
✖ Billing page hides technical payment diagnostics from customer plan view (2.1755ms)
✔ Billing page has corrected Polish user-facing labels (1.0044ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 71.8496
✖ failing tests:
test at tests\billing-ui-polish-and-diagnostics.test.cjs:8:1
  AssertionError [ERR_ASSERTION]: The input was expected to not match the regular expression /dryRun:\s*true/. Input:
  
  "const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';\n" +
    'const STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [\n' +
    "  { name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },\n" +
    "  { name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' },\n" +
    '] as const;\n' +
    '\n' +
    '/*\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';\nconst STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [\n  { name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },\n  { name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' },\n] as const;\n\n/*\nSTAGE16B_BILLING_TRUTH_COPY\nGoogle Calendar sync\nPełny asystent AI\nRaport tygodniowy\n*/\n\nconst BILLING_UI_STRIPE_BLIK_LABEL_GUARD = 'Stripe/BLIK';\nconst BILLING_UI_STRIPE_BLIK_COPY_GUARD = 'BLIK przez Stripe';\nconst BILLING_UI_STRIPE_BLIK_ERROR_UTF8_GUARD = 'Błąd uruchamiania płatności Stripe/BLIK';\nimport { useEffect, useMemo, useState } from 'react';\nimport { format, parseISO } from 'date-fns';\nimport { pl } from 'date-fns/locale';\nimport {\n  AlertTriangle,\n  ArrowRight,\n  BadgeCheck,\n  CalendarClock,\n  Check,\n  CreditCard,\n  Loader2,\n  LockKeyhole,\n  RefreshCw,\n  Shield,\n  Sparkles,\n} from 'lucide-react';\nimport { toast } from 'sonner';\n\nimport Layout from '../components/Layout';\nimport { Button } from '../components/ui/button';\nimport { useWorkspace } from '../hooks/useWorkspace';\nimport {\n  billingActionInSupabase,\n  fetchCasesFromSupabase,\n  fetchClientsFromSupabase,\n  fetchLeadsFromSupabase,\n  fetchPaymentsFromSupabase,\n  createBillingCheckoutSessionInSupabase,\n} from '../lib/supabase-fallback';\nimport '../styles/visual-stage16-billing-vnext.css';\n\ntype BillingPeriod = 'monthly' | 'yearly';\ntype BillingTab = 'plan' | 'settlements';\ntype CheckoutPlanKey = 'basic' | 'pro' | 'ai';\ntype PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';\n\nconst UI_TRUTH_BADGE_LABELS_STAGE14E = ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu'] as const;\n\nconst BILLING_VISUAL_REBUILD_STAGE16 = 'BILLING_VISUAL_REBUILD_STAGE16';\nconst BILLING_STRIPE_BLIK_CONTRACT = 'Stripe';\nconst BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J = 'paid plan appears only after Stripe webhook confirmation';\nconst BILLING_STRIPE_STAGE86_E2E_GATE = 'checkout → webhook → paid_active → access refresh → cancel/resume';\n\ntype PlanCard = {\n  id: string;\n  key: 'free' | 'basic' | 'pro' | 'ai';\n  checkoutKey?: CheckoutPlanKey;\n  name: string;\n  monthlyPrice: number;\n  yearlyPrice: number;\n  description: string;\n  badge?: string;\n  features: string[];\n  availabilityHint?: string;\n};\n\nconst BILLING_PLANS: PlanCard[] = [\n  {\n    id: 'free',\n    key: 'free',\n    name: 'Free',\n    monthlyPrice: 0,\n    yearlyPrice: 0,\n    description: 'Tryb demo i awaryjny po trialu, z limitami Free.',\n    features: [\n      'Podgląd podstawowego workflow',\n      'Dobry etap na pierwsze sprawdzenie aplikacji',\n      'Po zakończeniu triala dane zostają w systemie',\n    ],\n    availabilityHint: 'Dostęp przez trial albo tryb podglądu.',\n  },\n  {\n    id: 'closeflow_basic',\n    key: 'basic',\n    checkoutKey: 'basic',\n    name: 'Basic',\n    monthlyPrice: 19,\n    yearlyPrice: 190,\n    description: 'Najprostszy płatny start dla jednej osoby.',\n    features: [\n      'Leady, klienci i zadania',\n      'Dziś, kalendarz w aplikacji, digest po konfiguracji mail providera i powiadomienia',\n      'Lekki parser tekstu i szkice bez pełnego asystenta AI',\n    ],\n  },\n  {\n    id: 'closeflow_pro',\n    key: 'pro',\n    checkoutKey: 'pro',\n    name: 'Pro',\n    monthlyPrice: 39,\n    yearlyPrice: 390,\n    badge: 'Najlepszy wybór',\n    description: 'Pełny workflow lead -> klient -> sprawa -> rozliczenie.',\n    features: [\n      'Wszystko z Basic',\n      'Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth',\n      'Raport tygodniowy, import CSV i cykliczne przypomnienia po konfiguracji',\n      'Bez pełnego asystenta AI',\n    ],\n  },\n  {\n    id: 'closeflow_ai',\n    key: 'ai',\n    checkoutKey: 'ai',\n    name: 'AI',\n    monthlyPrice: 69,\n    yearlyPrice: 690,\n    badge: 'Beta',\n    description: 'Plan przygotowany pod dodatki AI i większy zakres automatyzacji.',\n    features: [\n      'Wszystko z Pro',\n      'Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)',\n      'AI lokalne/regułowe i szkice do ręcznego zatwierdzenia działają także bez zewnętrznego modelu',\n      'Limity AI: 30/dzień i 300/miesiąc',\n    ],\n    availabilityHint: 'Beta. Wymaga konfiguracji AI w Vercel. Nie obiecujemy funkcji, które nie są jeszcze realnie podpięte.',\n  },\n];\n\nconst ACCESS_COPY: Record<string, { label: string; headline: string; description: string; tone: 'green' | 'amber' | 'red' | 'slate'; cta: string }> = {\n  trial_active: {\n    label: 'Trial aktywny',\n    headline: 'Masz aktywny okres testowy',\n    description: 'Możesz sprawdzić główny workflow aplikacji przed wyborem płatnego planu.',\n    tone: 'amber',\n    cta: 'Przejdź do płatności',\n  },\n  trial_ending: {\n    label: 'Trial kończy się',\n    headline: 'Trial zaraz się skończy',\n    description: 'Dane zostają. Wybierz plan, żeby nie blokować dodawania nowych rekordów.',\n    tone: 'amber',\n    cta: 'Przejdź do płatności',\n  },\n  paid_active: {\n    label: 'Dostęp aktywny',\n    headline: 'Plan jest aktywny',\n    description: 'Masz aktywny dostęp do pracy w aplikacji.',\n    tone: 'green',\n    cta: 'Zarządzaj planem',\n  },\n  trial_expired: {\n    label: 'Trial wygasł',\n    headline: 'Trial się zakończył',\n    description: 'Twoje dane zostają. Aby dodawać nowe leady, zadania i wydarzenia, wybierz plan.',\n    tone: 'red',\n    cta: 'Wznów dostęp',\n  },\n  payment_failed: {\n    label: 'Płatność wymaga reakcji',\n    headline: 'Dostęp wymaga odnowienia',\n    description: 'Dane zostają, ale tworzenie nowych rzeczy może być zablokowane do czasu odnowienia planu.',\n    tone: 'red',\n    cta: 'Wznów dostęp',\n  },\n  canceled: {\n    label: 'Plan wyłączony',\n    headline: 'Plan jest nieaktywny',\n    description: 'Workspace jest w trybie bez aktywnej subskrypcji. Dane zostają dostępne do podglądu.',\n    tone: 'slate',\n    cta: 'Wznów dostęp',\n  },\n  inactive: {\n    label: 'Brak aktywnego dostępu',\n    headline: 'Dostęp nie jest aktywny',\n    description: 'Wybierz plan, żeby odblokować pracę na leadach, zadaniach i wydarzeniach.',\n    tone: 'slate',\n    cta: 'Przejdź do płatności',\n  },\n  free_active: {\n    label: 'Free aktywny',\n    headline: 'Masz aktywny tryb Free',\n    description: 'Tryb Free ma limity: 5 aktywnych leadów, 5 aktywnych zadań/wydarzeń, 3 szkice i brak AI.',\n    tone: 'slate',\n    cta: 'Przejdź do płatności',\n  },\n};\n\nconst LIMIT_ITEMS = [\n  { name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Poranny digest', basic: 'Wymaga konfiguracji', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n  { name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Google Calendar', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n  { name: 'Asystent AI (provider + env)', basic: 'Niedostępne w Twoim planie', pro: 'Niedostępne w Twoim planie', ai: 'Beta' },\n  { name: 'Raport tygodniowy', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n];\nconst SETTLEMENT_STATUS_LABELS: Record<string, string> = {\n  awaiting_payment: 'Czeka na płatność',\n  partially_paid: 'Częściowo opłacone',\n  fully_paid: 'Opłacone',\n  commission_pending: 'Prowizja do rozliczenia',\n  paid: 'Zapłacone',\n  not_started: 'Nierozpoczęte',\n  refunded: 'Zwrot',\n  written_off: 'Spisane',\n};\n\nfunction getPlanPrice(plan: PlanCard, period: BillingPeriod) {\n  return period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;\n}\n\nfunction getPlanPeriodLabel(period: BillingPeriod) {\n  return period === 'yearly' ? '/rok' : '/30 dni';\n}\n\nfunction formatMoney(value: unknown) {\n  const amount = Number(value || 0);\n  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';\n}\n\nfunction safeDateLabel(value?: string | null) {\n  if (!value) return 'Nie ustawiono';\n  try {\n    return format(parseISO(value), 'd MMMM yyyy', { locale: pl });\n  } catch {\n    return 'Nie ustawiono';\n  }\n}\n\nfunction getAccessCopy(status?: string | null) {\n  return ACCESS_COPY[String(status || 'inactive')] || ACCESS_COPY.inactive;\n}\n\nfunction getDisplayPlanId(planId?: string | null, subscriptionStatus?: string | null) {\n  const normalized = String(planId || '');\n  if (['closeflow_basic', 'closeflow_basic_yearly', 'closeflow_pro', 'closeflow_pro_yearly', 'closeflow_business', 'closeflow_business_yearly'].includes(normalized)) {\n    return normalized;\n  }\n  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(normalized)) {\n    return 'closeflow_pro';\n  }\n  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';\n  return 'trial_21d';\n}\n\nfunction getCurrentPlanName(displayPlanId: string, isPaidActive: boolean, isTrialActive: boolean) {\n  if (isPaidActive) {\n    const plan = BILLING_PLANS.find((entry) => displayPlanId === entry.id || displayPlanId === `${entry.id}_yearly`);\n    return plan?.name || 'Pro';\n  }\n  if (isTrialActive) return 'Free / trial';\n  return 'Nie ustawiono';\n}\n\nfunction isPlanCurrent(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean) {\n  if (plan.key === 'free') return !isPaidActive && (isTrialActive || displayPlanId === 'free');\n  if (!isPaidActive) return false;\n  return displayPlanId === plan.id || displayPlanId === `${plan.id}_yearly`;\n}\n\nfunction getPlanAvailability(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean): PlanAvailability {\n  if (isPlanCurrent(displayPlanId, plan, isPaidActive, isTrialActive)) return 'current';\n  if (!plan.checkoutKey) return plan.key === 'free' ? 'disabled' : 'soon';\n  return 'available';\n}\n\nfunctio"... 22535 more characters,
    expected: /dryRun:\s*true/,
    operator: 'doesNotMatch',
    diff: 'simple'
  }
```

### 2. npm run test:critical

- Command: `npm.cmd run test:critical`
- Exit: `1`
- Duration: `0.7s`
- Full log: `test-results/stage16l-failed-details/npm-run-test_critical.log`

```text
> closeflow@0.0.0 test:critical
> node scripts/run-tests-compact.cjs --critical

== CloseFlow compact test summary ==
Mode: critical
Critical files: 6
Tests: 13 | Pass: 12 | Fail: 1 | 238 ms
Full log: test-results\last-test-full.log

FAIL: testy nie przeszły. Pokazuję tylko krótką listę, bez pełnych diffów i bez zawartości plików.

1. A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions
```

### 3. node --test tests/ai-assistant-admin-and-app-scope.test.cjs

- Command: `node --test tests/ai-assistant-admin-and-app-scope.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-admin-and-app-scope.test.cjs.log`

```text
✖ Today assistant keeps only off-topic hard blocks and allows full app scope (2.3258ms)
✖ admin AI usage is exempt in Today assistant and Quick Capture (1.8604ms)
✖ lead capture command from assistant is saved as AI draft, not as final lead (0.9915ms)
✔ AI admin app scope test is included in quiet release gate (0.6451ms)
ℹ tests 4
ℹ suites 0
ℹ pass 1
ℹ fail 3
ℹ cancelled 0
---
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 78.8165

✖ failing tests:
test at tests\ai-assistant-admin-and-app-scope.test.cjs:15:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /wantsOverview/. Input:
  
  '﻿// STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1\n' +
    '// STAGE5_AI_READ_QUERY_HARDENING_V1\n' +
    '// STAGE3_AI_APPLICATION_BRAIN_V1\n' +
    '// Deterministic AI Application Brain V1. It reads CloseFlow data and creates review drafts only.\n' +
    '\n' +
    'import { buildAssistantContextFromRequest, type AssistantContext, type AssistantContextItem } from "./assistant-context";\n' +
    'import { getItemDate, itemSearchText } from "./assistant-context";\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '﻿// STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1\n// STAGE5_AI_READ_QUERY_HARDENING_V1\n// STAGE3_AI_APPLICATION_BRAIN_V1\n// Deterministic AI Application Brain V1. It reads CloseFlow data and creates review drafts only.\n\nimport { buildAssistantContextFromRequest, type AssistantContext, type AssistantContextItem } from "./assistant-context";\nimport { getItemDate, itemSearchText } from "./assistant-context";\nimport { detectAssistantIntent as detectAssistantIntentV1 } from "../lib/assistant-intents";\nimport { normalizeAssistantResult } from "../lib/assistant-result-schema";\n\nexport type AssistantIntent = "read" | "draft" | "unknown";\nexport type AssistantMode = "read" | "draft" | "unknown";\nexport type AssistantDraftType = "task" | "event" | "lead" | "note";\n\nexport type AssistantStructuredItem = {\n  id: string;\n  kind: string;\n  title: string;\n  subtitle?: string | null;\n  scheduledAt?: string | null;\n  startAt?: string | null;\n  endAt?: string | null;\n  phone?: string | null;\n  email?: string | null;\n  reason?: string | null;\n};\n\nexport type AssistantDraft = {\n  id: string;\n  draftType: AssistantDraftType;\n  title: string;\n  rawText: string;\n  status: "pending_review";\n  scheduledAt?: string | null;\n  startAt?: string | null;\n  endAt?: string | null;\n  parsedData: Record<string, unknown>;\n  warnings: string[];\n  createdAt: string;\n};\n\nexport type AssistantQueryResult = {\n  mode: AssistantMode;\n  intent: AssistantIntent;\n  answer: string;\n  items: AssistantStructuredItem[];\n  draft: AssistantDraft | null;\n  meta: {\n    generatedAt: string;\n    timezone: string;\n    source: "app_snapshot";\n    safety: "read_only_or_draft_only";\n    matchedItems: number;\n    dataPolicy: "app_data_only";\n    noData: boolean;\n    emptyPrompt: boolean;\n  };\n};\n\nexport type RunAssistantQueryInput = {\n  query: string;\n  context: AssistantContext;\n  now?: string | Date;\n};\n\nconst WRITE_RE = /\\b(zapisz|dodaj|utworz|stworz|zaloz|wpisz|przygotuj\\s+szkic|mam\\s+leada)\\b/i;\nconst READ_RE = /\\b(co|czy|kiedy|na\\s+kiedy|znajdz|pokaz|wyszukaj|mam|najblizszy|najblizsza|gdzie|ile)\\b/i;\nconst PHONE_RE = /(?:numer|telefon|tel\\.?|komorka|kontakt)\\s+(?:do\\s+)?([\\p{L}][\\p{L}\\-\']*)/iu;\n\nexport const STAGE6_EMPTY_PROMPT_ANSWER = "Napisz pytanie albo komende. Nie odpowiadam z pustego prompta.";\nexport const STAGE6_NO_DATA_ANSWER = "Nie znalazłem tego w danych aplikacji.";\n\nfunction normalizeText(value: string): string {\n  return value\n    .toLowerCase()\n    .normalize("NFD")\n    .replace(/[\\u0300-\\u036f]/g, "")\n    .replace(/[^\\p{L}\\p{N}\\s:.+-]/gu, " ")\n    .replace(/\\s+/g, " ")\n    .trim();\n}\n\nfunction pad(value: number): string {\n  return String(value).padStart(2, "0");\n}\n\nfunction dateAt(date: Date, days: number, hour = 0, minute = 0): Date {\n  const next = new Date(date);\n  next.setHours(hour, minute, 0, 0);\n  next.setDate(next.getDate() + days);\n  return next;\n}\n\nfunction windowForDay(now: Date, offsetDays: number): { start: Date; end: Date } {\n  const start = dateAt(now, offsetDays, 0, 0);\n  const end = dateAt(now, offsetDays + 1, 0, 0);\n  return { start, end };\n}\n\nfunction isWithin(date: Date | null, start: Date, end: Date): boolean {\n  if (!date) return false;\n  const time = date.getTime();\n  return time >= start.getTime() && time < end.getTime();\n}\n\nfunction addMinutes(date: Date, minutes: number): Date {\n  return new Date(date.getTime() + minutes * 60 * 1000);\n}\n\nfunction itemDateRange(item: AssistantContextItem): { start: Date; end: Date } | null {\n  const start = getItemDate(item);\n  if (!start) return null;\n\n  const rawEnd = item.endAt ? new Date(item.endAt) : null;\n  const end = rawEnd && Number.isFinite(rawEnd.getTime()) && rawEnd.getTime() > start.getTime()\n    ? rawEnd\n    : item.kind === "event"\n      ? addMinutes(start, 60)\n      : start;\n\n  return { start, end };\n}\n\nfunction itemOverlapsWindow(item: AssistantContextItem, start: Date, end: Date): boolean {\n  const range = itemDateRange(item);\n  if (!range) return false;\n\n  if (range.start.getTime() === range.end.getTime()) {\n    return range.start.getTime() >= start.getTime() && range.start.getTime() < end.getTime();\n  }\n\n  return range.start.getTime() < end.getTime() && range.end.getTime() > start.getTime();\n}\n\nconst NAME_INFLECTIONS: Record<string, string[]> = {\n  "marka": ["marek"],\n  "markowi": ["marek"],\n  "markiem": ["marek"],\n  "anny": ["anna"],\n  "anne": ["anna"],\n  "jana": ["jan"],\n  "janowi": ["jan"],\n  "piotra": ["piotr"],\n  "piotrowi": ["piotr"],\n  "tomka": ["tomek"],\n  "tomaszowi": ["tomasz"],\n  "doroty": ["dorota"],\n  "dorote": ["dorota"],\n};\n\nfunction expandLookupTerms(value: string): string[] {\n  const base = normalizeText(value);\n  const terms = new Set<string>();\n  if (base) terms.add(base);\n  for (const token of base.split(" ")) {\n    if (!token) continue;\n    terms.add(token);\n    for (const mapped of NAME_INFLECTIONS[token] || []) terms.add(mapped);\n    if (token.length > 4 && token.endsWith("a")) terms.add(token.slice(0, -1));\n    if (token.length > 5 && token.endsWith("owi")) terms.add(token.slice(0, -3));\n    if (token.length > 5 && token.endsWith("em")) terms.add(token.slice(0, -2));\n  }\n  return Array.from(terms).filter((term) => term.length >= 3);\n}\n\nfunction itemMatchesLookup(item: AssistantContextItem, wanted: string): boolean {\n  const haystack = normalizeText(itemSearchText(item));\n  return expandLookupTerms(wanted).some((term) => haystack.includes(term));\n}\n\nfunction structured(item: AssistantContextItem, reason?: string): AssistantStructuredItem {\n  return {\n    id: item.id,\n    kind: item.kind,\n    title: item.title,\n    subtitle: item.subtitle,\n    scheduledAt: item.scheduledAt,\n    startAt: item.startAt,\n    endAt: item.endAt,\n    phone: item.phone,\n    email: item.email,\n    reason: reason || null,\n  };\n}\n\nfunction sortByDate(items: AssistantContextItem[]): AssistantContextItem[] {\n  return items.slice().sort((a, b) => {\n    const da = getItemDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;\n    const db = getItemDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;\n    return da - db;\n  });\n}\n\nfunction formatDate(value: string | null | undefined): string {\n  if (!value) return "bez terminu";\n  const date = new Date(value);\n  if (Number.isNaN(date.getTime())) return value;\n  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;\n}\n\nexport function detectAssistantIntent(query: string): AssistantIntent {\n  return detectAssistantIntentV1(query) as AssistantIntent;\n}\n\nfunction parseHour(text: string): number | null {\n  const match = text.match(/(?:o|na|po)?\\s*(\\d{1,2})(?::(\\d{2}))?\\b/iu);\n  if (!match) return null;\n  const hour = Number(match[1]);\n  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;\n  return hour;\n}\n\nfunction parseRelativeWindow(query: string, now: Date): { start: Date; end: Date; label: string } | null {\n  const text = normalizeText(query);\n  if (text.includes("jutro")) {\n    const hour = /\\bo\\s+\\d|\\bpo\\s+\\d/.test(text) ? parseHour(text) : null;\n    if (hour !== null) {\n      return { start: dateAt(now, 1, hour, 0), end: dateAt(now, 1, hour + 1, 0), label: `jutro o ${hour}:00` };\n    }\n    const day = windowForDay(now, 1);\n    return { ...day, label: "jutro" };\n  }\n  if (text.includes("dzis") || text.includes("dzisiaj")) {\n    const day = windowForDay(now, 0);\n    return { ...day, label: "dziĹ›" };\n  }\n  const hoursMatch = text.match(/(?:w\\s+przeciagu|przez|za)\\s+(\\d{1,2})\\s+godzin/);\n  if (hoursMatch) {\n    const hours = Math.max(1, Math.min(48, Number(hoursMatch[1])));\n    return { start: now, end: new Date(now.getTime() + hours * 60 * 60 * 1000), label: `w ciÄ…gu ${hours} godzin` };\n  }\n  return null;\n}\n\nfunction relevantTimedItems(context: AssistantContext): AssistantContextItem[] {\n  return [...context.tasks, ...context.events, ...context.cases, ...context.leads].filter((item) => getItemDate(item));\n}\n\nfunction hasReadableApplicationData(context: AssistantContext): boolean {\n  return Boolean(\n    context &&\n      context.stats &&\n      Number(context.stats.totalItems || 0) > 0\n  );\n}\n\nfunction answerTimeWindow(query: string, context: AssistantContext, now: Date): AssistantQueryResult | null {\n  const window = parseRelativeWindow(query, now);\n  if (!window) return null;\n  let candidates = relevantTimedItems(context).filter((item) => itemOverlapsWindow(item, window.start, window.end));\n\n  if (/spotkanie|meeting|rozmow|call|telefon/i.test(query)) {\n    candidates = candidates.filter((item) => /spotkanie|meeting|rozmow|call|telefon/i.test(itemSearchText(item)));\n  }\n\n  const items = sortByDate(candidates).map((item) => structured(item, `Pasuje do okna: ${window.label}`));\n  const answer = items.length\n    ? `Masz ${items.length} pozycj${items.length === 1 ? "Ä™" : "e"} ${window.label}: ${items\n        .slice(0, 5)\n        .map((item) => `${item.title} (${formatDate(item.startAt || item.scheduledAt)})`)\n        .join("; ")}.`\n    : `Nie znalazĹ‚em zaplanowanych pozycji ${window.label} w danych aplikacji.`;\n\n  return result("read", answer, items, null, context);\n}\n\nfunction answerNearest(query: string, context: AssistantContext): AssistantQueryResult | null {\n  const text = normalizeText(query);\n  const phrase = text.includes("akt notarialny") ? "akt notarialny" : null;\n  if (!phrase && !text.includes("najblizszy")) return null;\n\n  const now = new Date(context.generatedAt);\n  const words = phrase ? phrase.split(" ") : text.split(" ").filter((word) => word.length > 3).slice(-3);\n  const candidates = relevantTimedItems(context).filter((item) => {\n    const date = getItemDate(item);\n    const haystack = normalizeText(itemSearchText(item));\n    return !!date && date.getTime() >= now.getTime() && words.every((word) => haystack.includes(word));\n  });\n\n  const first = sortByDate(candidates)[0];\n  if (!first) {\n    return result("read", `Nie znalazĹ‚em w danych aplikacji najbliĹĽszego terminu dla: ${words.join(" ")}.`, [], null, context);\n  }\n  return result("read", `NajbliĹĽszy termin: ${fi'... 9386 more characters,
    expected: /wantsOverview/,
    operator: 'match',
    diff: 'simple'
  }
test at tests\ai-assistant-admin-and-app-scope.test.cjs:32:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /isAdmin/. Input:
  '// STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1\n' +
    '// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1\n' +
    '// AI_DRAFT_CONFIRM_BRIDGE_STAGE4\n' +
    '// Assistant UI. It calls /api/assistant/query through one client and exposes smoke prompts for manual QA.\n' +
```

### 4. node --test tests/ai-assistant-autospeech-and-clear-input.test.cjs

- Command: `node --test tests/ai-assistant-autospeech-and-clear-input.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-autospeech-and-clear-input.test.cjs.log`

```text
✖ Today assistant uses compact save/search guidance and clears input after answer (1.6333ms)
✖ Today assistant and quick capture keep speech start support after opening (1.2352ms)
✔ autospeech test is included in quiet release gate (0.3447ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 73.2886

✖ failing tests:
test at tests\ai-assistant-autospeech-and-clear-input.test.cjs:25:1
  AssertionError [ERR_ASSERTION]: compact assistant marker: missing STAGE35_AI_ASSISTANT_COMPACT_UI
      at assertIncludes (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-autospeech-and-clear-input.test.cjs:18:10)
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-autospeech-and-clear-input.test.cjs:30:3)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\ai-assistant-autospeech-and-clear-input.test.cjs:45:1
  AssertionError [ERR_ASSERTION]: assistant auto speech guard: missing autoSpeechStartedRef
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-autospeech-and-clear-input.test.cjs:54:3)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
```

### 5. node --test tests/ai-assistant-capture-handoff.test.cjs

- Command: `node --test tests/ai-assistant-capture-handoff.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-capture-handoff.test.cjs.log`

```text
✖ Today assistant can hand a lead-capture command to Quick AI Capture without auto-saving (1.5661ms)
✖ Today assistant saves obvious lead commands into AI drafts without model usage (0.3476ms)
✔ AI assistant capture handoff test is included in quiet release gate (0.2865ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 61.6733

✖ failing tests:
test at tests\ai-assistant-capture-handoff.test.cjs:11:1
  AssertionError [ERR_ASSERTION]: assistant keeps capture handoff prop
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-capture-handoff.test.cjs:18:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\ai-assistant-capture-handoff.test.cjs:28:1
  AssertionError [ERR_ASSERTION]: assistant should have a local lead-capture guard
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-capture-handoff.test.cjs:31:10)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
```

### 6. node --test tests/ai-assistant-command-center.test.cjs

- Command: `node --test tests/ai-assistant-command-center.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-command-center.test.cjs.log`

```text
✖ AI assistant command center is consolidated under system API without a new Vercel function (3.4044ms)
✖ AI assistant is available from global toolbar for daily plan lead lookup and lead capture intent (1.4848ms)
✖ AI assistant writes tasks and events only behind explicit safety gate (0.5376ms)
✖ AI assistant hard-blocks out-of-scope questions to protect usage limits (1.6537ms)
✔ AI assistant test is included in quiet release gate (0.3484ms)
ℹ tests 5
ℹ suites 0
ℹ pass 1
ℹ fail 4
---
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 83.2482

✖ failing tests:
test at tests\ai-assistant-command-center.test.cjs:18:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /scope: 'assistant_read_or_draft_only'/. Input:
  
  '﻿// STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1\n' +
    '// STAGE5_AI_READ_QUERY_HARDENING_V1\n' +
    '// STAGE3_AI_APPLICATION_BRAIN_V1\n' +
    '// Deterministic AI Application Brain V1. It reads CloseFlow data and creates review drafts only.\n' +
    '\n' +
    'import { buildAssistantContextFromRequest, type AssistantContext, type AssistantContextItem } from "./assistant-context";\n' +
    'import { getItemDate, itemSearchText } from "./assistant-context";\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '﻿// STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1\n// STAGE5_AI_READ_QUERY_HARDENING_V1\n// STAGE3_AI_APPLICATION_BRAIN_V1\n// Deterministic AI Application Brain V1. It reads CloseFlow data and creates review drafts only.\n\nimport { buildAssistantContextFromRequest, type AssistantContext, type AssistantContextItem } from "./assistant-context";\nimport { getItemDate, itemSearchText } from "./assistant-context";\nimport { detectAssistantIntent as detectAssistantIntentV1 } from "../lib/assistant-intents";\nimport { normalizeAssistantResult } from "../lib/assistant-result-schema";\n\nexport type AssistantIntent = "read" | "draft" | "unknown";\nexport type AssistantMode = "read" | "draft" | "unknown";\nexport type AssistantDraftType = "task" | "event" | "lead" | "note";\n\nexport type AssistantStructuredItem = {\n  id: string;\n  kind: string;\n  title: string;\n  subtitle?: string | null;\n  scheduledAt?: string | null;\n  startAt?: string | null;\n  endAt?: string | null;\n  phone?: string | null;\n  email?: string | null;\n  reason?: string | null;\n};\n\nexport type AssistantDraft = {\n  id: string;\n  draftType: AssistantDraftType;\n  title: string;\n  rawText: string;\n  status: "pending_review";\n  scheduledAt?: string | null;\n  startAt?: string | null;\n  endAt?: string | null;\n  parsedData: Record<string, unknown>;\n  warnings: string[];\n  createdAt: string;\n};\n\nexport type AssistantQueryResult = {\n  mode: AssistantMode;\n  intent: AssistantIntent;\n  answer: string;\n  items: AssistantStructuredItem[];\n  draft: AssistantDraft | null;\n  meta: {\n    generatedAt: string;\n    timezone: string;\n    source: "app_snapshot";\n    safety: "read_only_or_draft_only";\n    matchedItems: number;\n    dataPolicy: "app_data_only";\n    noData: boolean;\n    emptyPrompt: boolean;\n  };\n};\n\nexport type RunAssistantQueryInput = {\n  query: string;\n  context: AssistantContext;\n  now?: string | Date;\n};\n\nconst WRITE_RE = /\\b(zapisz|dodaj|utworz|stworz|zaloz|wpisz|przygotuj\\s+szkic|mam\\s+leada)\\b/i;\nconst READ_RE = /\\b(co|czy|kiedy|na\\s+kiedy|znajdz|pokaz|wyszukaj|mam|najblizszy|najblizsza|gdzie|ile)\\b/i;\nconst PHONE_RE = /(?:numer|telefon|tel\\.?|komorka|kontakt)\\s+(?:do\\s+)?([\\p{L}][\\p{L}\\-\']*)/iu;\n\nexport const STAGE6_EMPTY_PROMPT_ANSWER = "Napisz pytanie albo komende. Nie odpowiadam z pustego prompta.";\nexport const STAGE6_NO_DATA_ANSWER = "Nie znalazłem tego w danych aplikacji.";\n\nfunction normalizeText(value: string): string {\n  return value\n    .toLowerCase()\n    .normalize("NFD")\n    .replace(/[\\u0300-\\u036f]/g, "")\n    .replace(/[^\\p{L}\\p{N}\\s:.+-]/gu, " ")\n    .replace(/\\s+/g, " ")\n    .trim();\n}\n\nfunction pad(value: number): string {\n  return String(value).padStart(2, "0");\n}\n\nfunction dateAt(date: Date, days: number, hour = 0, minute = 0): Date {\n  const next = new Date(date);\n  next.setHours(hour, minute, 0, 0);\n  next.setDate(next.getDate() + days);\n  return next;\n}\n\nfunction windowForDay(now: Date, offsetDays: number): { start: Date; end: Date } {\n  const start = dateAt(now, offsetDays, 0, 0);\n  const end = dateAt(now, offsetDays + 1, 0, 0);\n  return { start, end };\n}\n\nfunction isWithin(date: Date | null, start: Date, end: Date): boolean {\n  if (!date) return false;\n  const time = date.getTime();\n  return time >= start.getTime() && time < end.getTime();\n}\n\nfunction addMinutes(date: Date, minutes: number): Date {\n  return new Date(date.getTime() + minutes * 60 * 1000);\n}\n\nfunction itemDateRange(item: AssistantContextItem): { start: Date; end: Date } | null {\n  const start = getItemDate(item);\n  if (!start) return null;\n\n  const rawEnd = item.endAt ? new Date(item.endAt) : null;\n  const end = rawEnd && Number.isFinite(rawEnd.getTime()) && rawEnd.getTime() > start.getTime()\n    ? rawEnd\n    : item.kind === "event"\n      ? addMinutes(start, 60)\n      : start;\n\n  return { start, end };\n}\n\nfunction itemOverlapsWindow(item: AssistantContextItem, start: Date, end: Date): boolean {\n  const range = itemDateRange(item);\n  if (!range) return false;\n\n  if (range.start.getTime() === range.end.getTime()) {\n    return range.start.getTime() >= start.getTime() && range.start.getTime() < end.getTime();\n  }\n\n  return range.start.getTime() < end.getTime() && range.end.getTime() > start.getTime();\n}\n\nconst NAME_INFLECTIONS: Record<string, string[]> = {\n  "marka": ["marek"],\n  "markowi": ["marek"],\n  "markiem": ["marek"],\n  "anny": ["anna"],\n  "anne": ["anna"],\n  "jana": ["jan"],\n  "janowi": ["jan"],\n  "piotra": ["piotr"],\n  "piotrowi": ["piotr"],\n  "tomka": ["tomek"],\n  "tomaszowi": ["tomasz"],\n  "doroty": ["dorota"],\n  "dorote": ["dorota"],\n};\n\nfunction expandLookupTerms(value: string): string[] {\n  const base = normalizeText(value);\n  const terms = new Set<string>();\n  if (base) terms.add(base);\n  for (const token of base.split(" ")) {\n    if (!token) continue;\n    terms.add(token);\n    for (const mapped of NAME_INFLECTIONS[token] || []) terms.add(mapped);\n    if (token.length > 4 && token.endsWith("a")) terms.add(token.slice(0, -1));\n    if (token.length > 5 && token.endsWith("owi")) terms.add(token.slice(0, -3));\n    if (token.length > 5 && token.endsWith("em")) terms.add(token.slice(0, -2));\n  }\n  return Array.from(terms).filter((term) => term.length >= 3);\n}\n\nfunction itemMatchesLookup(item: AssistantContextItem, wanted: string): boolean {\n  const haystack = normalizeText(itemSearchText(item));\n  return expandLookupTerms(wanted).some((term) => haystack.includes(term));\n}\n\nfunction structured(item: AssistantContextItem, reason?: string): AssistantStructuredItem {\n  return {\n    id: item.id,\n    kind: item.kind,\n    title: item.title,\n    subtitle: item.subtitle,\n    scheduledAt: item.scheduledAt,\n    startAt: item.startAt,\n    endAt: item.endAt,\n    phone: item.phone,\n    email: item.email,\n    reason: reason || null,\n  };\n}\n\nfunction sortByDate(items: AssistantContextItem[]): AssistantContextItem[] {\n  return items.slice().sort((a, b) => {\n    const da = getItemDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;\n    const db = getItemDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;\n    return da - db;\n  });\n}\n\nfunction formatDate(value: string | null | undefined): string {\n  if (!value) return "bez terminu";\n  const date = new Date(value);\n  if (Number.isNaN(date.getTime())) return value;\n  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;\n}\n\nexport function detectAssistantIntent(query: string): AssistantIntent {\n  return detectAssistantIntentV1(query) as AssistantIntent;\n}\n\nfunction parseHour(text: string): number | null {\n  const match = text.match(/(?:o|na|po)?\\s*(\\d{1,2})(?::(\\d{2}))?\\b/iu);\n  if (!match) return null;\n  const hour = Number(match[1]);\n  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;\n  return hour;\n}\n\nfunction parseRelativeWindow(query: string, now: Date): { start: Date; end: Date; label: string } | null {\n  const text = normalizeText(query);\n  if (text.includes("jutro")) {\n    const hour = /\\bo\\s+\\d|\\bpo\\s+\\d/.test(text) ? parseHour(text) : null;\n    if (hour !== null) {\n      return { start: dateAt(now, 1, hour, 0), end: dateAt(now, 1, hour + 1, 0), label: `jutro o ${hour}:00` };\n    }\n    const day = windowForDay(now, 1);\n    return { ...day, label: "jutro" };\n  }\n  if (text.includes("dzis") || text.includes("dzisiaj")) {\n    const day = windowForDay(now, 0);\n    return { ...day, label: "dziĹ›" };\n  }\n  const hoursMatch = text.match(/(?:w\\s+przeciagu|przez|za)\\s+(\\d{1,2})\\s+godzin/);\n  if (hoursMatch) {\n    const hours = Math.max(1, Math.min(48, Number(hoursMatch[1])));\n    return { start: now, end: new Date(now.getTime() + hours * 60 * 60 * 1000), label: `w ciÄ…gu ${hours} godzin` };\n  }\n  return null;\n}\n\nfunction relevantTimedItems(context: AssistantContext): AssistantContextItem[] {\n  return [...context.tasks, ...context.events, ...context.cases, ...context.leads].filter((item) => getItemDate(item));\n}\n\nfunction hasReadableApplicationData(context: AssistantContext): boolean {\n  return Boolean(\n    context &&\n      context.stats &&\n      Number(context.stats.totalItems || 0) > 0\n  );\n}\n\nfunction answerTimeWindow(query: string, context: AssistantContext, now: Date): AssistantQueryResult | null {\n  const window = parseRelativeWindow(query, now);\n  if (!window) return null;\n  let candidates = relevantTimedItems(context).filter((item) => itemOverlapsWindow(item, window.start, window.end));\n\n  if (/spotkanie|meeting|rozmow|call|telefon/i.test(query)) {\n    candidates = candidates.filter((item) => /spotkanie|meeting|rozmow|call|telefon/i.test(itemSearchText(item)));\n  }\n\n  const items = sortByDate(candidates).map((item) => structured(item, `Pasuje do okna: ${window.label}`));\n  const answer = items.length\n    ? `Masz ${items.length} pozycj${items.length === 1 ? "Ä™" : "e"} ${window.label}: ${items\n        .slice(0, 5)\n        .map((item) => `${item.title} (${formatDate(item.startAt || item.scheduledAt)})`)\n        .join("; ")}.`\n    : `Nie znalazĹ‚em zaplanowanych pozycji ${window.label} w danych aplikacji.`;\n\n  return result("read", answer, items, null, context);\n}\n\nfunction answerNearest(query: string, context: AssistantContext): AssistantQueryResult | null {\n  const text = normalizeText(query);\n  const phrase = text.includes("akt notarialny") ? "akt notarialny" : null;\n  if (!phrase && !text.includes("najblizszy")) return null;\n\n  const now = new Date(context.generatedAt);\n  const words = phrase ? phrase.split(" ") : text.split(" ").filter((word) => word.length > 3).slice(-3);\n  const candidates = relevantTimedItems(context).filter((item) => {\n    const date = getItemDate(item);\n    const haystack = normalizeText(itemSearchText(item));\n    return !!date && date.getTime() >= now.getTime() && words.every((word) => haystack.includes(word));\n  });\n\n  const first = sortByDate(candidates)[0];\n  if (!first) {\n    return result("read", `Nie znalazĹ‚em w danych aplikacji najbliĹĽszego terminu dla: ${words.join(" ")}.`, [], null, context);\n  }\n  return result("read", `NajbliĹĽszy termin: ${fi'... 9386 more characters,
    expected: /scope: 'assistant_read_or_draft_only'/,
    operator: 'match',
    diff: 'simple'
  }
test at tests\ai-assistant-command-center.test.cjs:31:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /leads=\{context\.leads\}/. Input:
  '﻿// STAGE7_ASSISTANT_OPERATOR_CONTEXT_FIX\n' +
    '// Global assistant now loads real
```

### 7. node --test tests/ai-assistant-global-app-search.test.cjs

- Command: `node --test tests/ai-assistant-global-app-search.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-global-app-search.test.cjs.log`

```text
✖ assistant recognizes value questions before contact lookup (1.4809ms)
✖ assistant global app search scans all core app records and broad fields (0.3897ms)
✖ assistant uses global app search as final in-app fallback (0.2728ms)
✔ global app search test is included in quiet release gate (0.9952ms)
ℹ tests 4
ℹ suites 0
ℹ pass 1
ℹ fail 3
ℹ cancelled 0
---
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 67.2134

✖ failing tests:
test at tests\ai-assistant-global-app-search.test.cjs:24:1
  AssertionError [ERR_ASSERTION]: value question keywords missing
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-global-app-search.test.cjs:27:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\ai-assistant-global-app-search.test.cjs:31:1
  AssertionError [ERR_ASSERTION]: global app search intent: missing 'global_app_search'
      at assertIncludes (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-global-app-search.test.cjs:13:10)
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-global-app-search.test.cjs:34:3)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
test at tests\ai-assistant-global-app-search.test.cjs:45:1
  AssertionError [ERR_ASSERTION]: global app search answer builder: missing function buildGlobalAppSearchAnswer
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-global-app-search.test.cjs:48:3)
      at async Test.processPendingSubtests (node:internal/test_runner/test:787:7) {
```

### 8. node --test tests/ai-assistant-save-vs-search-rule.test.cjs

- Command: `node --test tests/ai-assistant-save-vs-search-rule.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-save-vs-search-rule.test.cjs.log`

```text
✖ assistant uses save word for drafts and otherwise searches app data (1.4068ms)
✖ assistant keeps capture before global search fallback (0.4718ms)
✔ save versus search test is included in quiet release gate (0.3479ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 71.2181

✖ failing tests:
test at tests\ai-assistant-save-vs-search-rule.test.cjs:16:1
  AssertionError [ERR_ASSERTION]: explicit save command pattern: missing saveCommandPattern
      at assertIncludes (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-save-vs-search-rule.test.cjs:13:10)
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-save-vs-search-rule.test.cjs:19:3)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\ai-assistant-save-vs-search-rule.test.cjs:26:1
  AssertionError [ERR_ASSERTION]: capture branch missing
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-save-vs-search-rule.test.cjs:31:10)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
```

### 9. node --test tests/ai-assistant-scope-budget-guard.test.cjs

- Command: `node --test tests/ai-assistant-scope-budget-guard.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-assistant-scope-budget-guard.test.cjs.log`

```text
✖ Today AI assistant has hard scope and cost guards before any model usage (1.274ms)
✔ AI assistant scope guard test is included in quiet release gate (0.4174ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
---
ℹ duration_ms 69.2521

✖ failing tests:
test at tests\ai-assistant-scope-budget-guard.test.cjs:11:1
  AssertionError [ERR_ASSERTION]: assistant should cap command length
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-assistant-scope-budget-guard.test.cjs:14:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
```

### 10. node --test tests/ai-direct-write-respects-mode-stage28.test.cjs

- Command: `node --test tests/ai-direct-write-respects-mode-stage28.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-direct-write-respects-mode-stage28.test.cjs.log`

```text
✖ Stage28 direct write mode can create clear leads, tasks and events (1.3897ms)
✖ Stage28 keeps unclear commands in draft fallback path (0.4209ms)
✔ Stage28 test is included in quiet release gate (0.286ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 63.5533

✖ failing tests:
test at tests\ai-direct-write-respects-mode-stage28.test.cjs:18:1
  AssertionError [ERR_ASSERTION]: Missing Stage28 contract snippet: safe lead creation alias
      at assertHas (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-direct-write-respects-mode-stage28.test.cjs:12:10)
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-direct-write-respects-mode-stage28.test.cjs:29:3)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\ai-direct-write-respects-mode-stage28.test.cjs:36:1
  AssertionError [ERR_ASSERTION]: Missing Stage28 contract snippet: assistant draft source
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-direct-write-respects-mode-stage28.test.cjs:44:3)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
```

### 11. node --test tests/ai-draft-inbox-command-center.test.cjs

- Command: `node --test tests/ai-draft-inbox-command-center.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_ai-draft-inbox-command-center.test.cjs.log`

```text
✖ AI draft inbox is a real command center before lead creation (4.404ms)
✔ AI draft inbox allows safe review actions without auto-creating leads (0.9659ms)
✔ Global quick actions link to AI drafts from every protected screen (0.2596ms)
✔ AI draft command center test is included in quiet release gate (0.3444ms)
ℹ tests 4
ℹ suites 0
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
---
ℹ duration_ms 75.6553

✖ failing tests:
test at tests\ai-draft-inbox-command-center.test.cjs:9:1
  AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
  
    assert.ok(page.includes('Centrum szkiców'))
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-draft-inbox-command-center.test.cjs:12:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
```

### 12. node --test tests/ai-draft-inbox-flow.test.cjs

- Command: `node --test tests/ai-draft-inbox-flow.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-draft-inbox-flow.test.cjs.log`

```text
✔ AI draft inbox stores dictated notes before lead conversion (1.0956ms)
✔ Quick AI Capture saves notes as drafts and requires explicit lead confirmation (0.2701ms)
✖ Today assistant can save lead-capture commands into AI drafts (3.6916ms)
✔ Global quick actions are available from protected app layout (0.7503ms)
✔ AI draft inbox test is included in quiet release gate (0.2521ms)
ℹ tests 5
ℹ suites 0
ℹ pass 4
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
---
ℹ duration_ms 68.7989

✖ failing tests:
test at tests\ai-draft-inbox-flow.test.cjs:29:1
  AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
  
    assert.ok(source.includes('Zapisz w szkicach AI'))
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-draft-inbox-flow.test.cjs:32:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
```

### 13. node --test tests/ai-safety-gates-direct-write.test.cjs

- Command: `node --test tests/ai-safety-gates-direct-write.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ai-safety-gates-direct-write.test.cjs.log`

```text
✖ AI safety gates allow direct clear records only behind explicit mode (3.1384ms)
✔ AI safety gate test is included in quiet release gate (0.386ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
---
ℹ duration_ms 72.1928

✖ failing tests:
test at tests\ai-safety-gates-direct-write.test.cjs:9:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /Bramki bezpieczeństwa AI/. Input:
  
  '// STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1\n' +
    '// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1\n' +
    '// STAGE3_AI_APPLICATION_BRAIN_V1\n' +
    '// AI_DRAFT_CONFIRM_BRIDGE_STAGE4\n' +
    '// Assistant UI. It calls /api/assistant/query through one client and exposes smoke prompts for manual QA.\n' +
    '\n' +
    'import React, { useMemo, useState } from "react";\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '// STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1\n// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1\n// STAGE3_AI_APPLICATION_BRAIN_V1\n// AI_DRAFT_CONFIRM_BRIDGE_STAGE4\n// Assistant UI. It calls /api/assistant/query through one client and exposes smoke prompts for manual QA.\n\nimport React, { useMemo, useState } from "react";\nimport { askAssistantQueryApi, type AssistantQueryClientResult } from "../lib/assistant-query-client";\nimport { assistantDraftToAiLeadDraftInput } from "../lib/ai-draft-assistant-bridge";\nimport { saveAiLeadDraftAsync } from "../lib/ai-drafts";\n\ntype TodayAiAssistantProps = {\n  leads?: unknown[];\n  clients?: unknown[];\n  cases?: unknown[];\n  tasks?: unknown[];\n  events?: unknown[];\n  activities?: unknown[];\n  drafts?: unknown[];\n  compact?: boolean;\n};\n\ntype AssistantResult = AssistantQueryClientResult;\n\nexport const STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1 = true;\n\nconst QUICK_ASSISTANT_SMOKE_PROMPTS = [\n  "Co mam jutro?",\n  "Czy jutro o 17 coś mam?",\n  "Czy w przeciągu 4 godzin mam spotkanie?",\n  "Na kiedy mam najbliższy akt notarialny?",\n  "Znajdź numer do Marka.",\n  "Zapisz zadanie jutro 12 rozgraniczenie.",\n];\n\nfunction getAssistantModeLabel(mode: AssistantResult["mode"], result: AssistantResult | null) {\n  if (mode === "draft") return "Szkic do sprawdzenia";\n  if (mode === "read" && result?.meta?.noData) return "Brak danych w aplikacji";\n  if (mode === "read") return "Odczyt z danych aplikacji";\n  return "Nieznany tryb";\n}\n\nfunction countSnapshotItems(snapshot: Record<string, unknown[]>) {\n  return Object.values(snapshot).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);\n}\n\nexport default function TodayAiAssistant(props: TodayAiAssistantProps) {\n  const [query, setQuery] = useState("");\n  const [loading, setLoading] = useState(false);\n  const [result, setResult] = useState<AssistantResult | null>(null);\n  const [error, setError] = useState<string | null>(null);\n\n  const snapshot = useMemo(\n    () => ({\n      leads: props.leads || [],\n      clients: props.clients || [],\n      cases: props.cases || [],\n      tasks: props.tasks || [],\n      events: props.events || [],\n      activities: props.activities || [],\n      drafts: props.drafts || [],\n    }),\n    [props.leads, props.clients, props.cases, props.tasks, props.events, props.activities, props.drafts],\n  );\n\n  const snapshotItemsCount = useMemo(() => countSnapshotItems(snapshot), [snapshot]);\n  const snapshotPayload = snapshotItemsCount > 0 ? snapshot : undefined;\n\n  async function askAssistant(nextQuery?: string) {\n    const text = (nextQuery ?? query).trim();\n    if (nextQuery !== undefined) setQuery(text);\n    if (!text) {\n      setError("Wpisz pytanie albo komendę.");\n      return;\n    }\n    setLoading(true);\n    setError(null);\n    try {\n      const data = await askAssistantQueryApi({ query: text, timezone: "Europe/Warsaw", snapshot: snapshotPayload });\n\n      if (data.mode === "draft" && data.draft) {\n        const bridgeInput = assistantDraftToAiLeadDraftInput(data.draft);\n        await saveAiLeadDraftAsync(bridgeInput);\n        window.dispatchEvent(new CustomEvent("closeflow:ai-draft-created", { detail: bridgeInput }));\n      }\n\n      setResult(data);\n    } catch (err) {\n      setError(err instanceof Error ? err.message : "Nie udało się zapytać asystenta.");\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <section\n      className="ai-assistant-card"\n      data-stage="STAGE3_AI_APPLICATION_BRAIN_V1"\n      data-stage4="AI_DRAFT_CONFIRM_BRIDGE_STAGE4"\n      data-stage8="STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1"\n      data-stage9="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1"\n    >\n      <div className="ai-assistant-card__header">\n        <div>\n          <strong>Asystent AI</strong>\n          <p>Czyta dane aplikacji. Komendy zapisu tworzą tylko szkice do sprawdzenia.</p>\n          <small data-assistant-snapshot-count={snapshotItemsCount}>Kontekst aplikacji: {snapshotItemsCount} rekordów.</small>\n        </div>\n      </div>\n\n      <div className="ai-assistant-card__smoke" data-assistant-smoke-prompts="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1">\n        {QUICK_ASSISTANT_SMOKE_PROMPTS.map((prompt) => (\n          <button\n            key={prompt}\n            type="button"\n            data-assistant-smoke-prompt={prompt}\n            onClick={() => void askAssistant(prompt)}\n            disabled={loading}\n          >\n            {prompt}\n          </button>\n        ))}\n      </div>\n\n      <div className="ai-assistant-card__inputRow">\n        <input\n          value={query}\n          onChange={(event) => setQuery(event.target.value)}\n          onKeyDown={(event) => {\n            if (event.key === "Enter" && !event.shiftKey) void askAssistant();\n          }}\n          placeholder="Np. Co mam jutro? / Znajdź numer do Marka / Zapisz zadanie jutro 12 rozgraniczenie"\n          aria-label="Pytanie do asystenta AI"\n        />\n        <button type="button" onClick={() => void askAssistant()} disabled={loading}>\n          {loading ? "Sprawdzam..." : "Zapytaj"}\n        </button>\n      </div>\n      {error ? <p className="ai-assistant-card__error">{error}</p> : null}\n      {result ? (\n        <div className="ai-assistant-card__answer" data-assistant-result-mode={result.mode}>\n          <p>{result.answer}</p>\n          <small data-assistant-mode={result.mode}>{getAssistantModeLabel(result.mode, result)}</small>\n          {result.meta?.dataPolicy === "app_data_only" ? (\n            <small data-assistant-data-policy="app_data_only">Odpowiedź tylko z danych aplikacji.</small>\n          ) : null}\n          {result.meta?.noData ? (\n            <small data-assistant-no-data="true">Brak danych aplikacji do sprawdzenia.</small>\n          ) : null}\n          {result.mode === "draft" ? <strong>Szkic zapisany do sprawdzenia. Finalny rekord nie został utworzony.</strong> : null}\n          {Array.isArray(result.items) && result.items.length ? (\n            <ul>\n              {result.items.slice(0, 5).map((item) => (\n                <li key={`${item.kind}-${item.id}`}>\n                  <span>{item.title}</span>\n                  {item.phone ? <small>tel. {item.phone}</small> : null}\n                  {item.email ? <small>{item.email}</small> : null}\n                  {item.startAt || item.scheduledAt ? <small>{item.startAt || item.scheduledAt}</small> : null}\n                </li>\n              ))}\n            </ul>\n          ) : null}\n        </div>\n      ) : null}\n    </section>\n  );\n}\n\nexport { TodayAiAssistant };\n',
    expected: /Bramki bezpieczeństwa AI/,
    operator: 'match',
    diff: 'simple'
  }
```

### 14. node --test tests/ai-usage-limit-guard.test.cjs

- Command: `node --test tests/ai-usage-limit-guard.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_ai-usage-limit-guard.test.cjs.log`

```text
✔ AI usage guard defines daily limit, command length and local storage accounting (0.8481ms)
✖ Today assistant blocks off-topic commands locally before spending AI usage (0.7437ms)
✖ Today assistant and Quick Capture show and enforce the shared AI usage limit (1.2451ms)
✔ AI usage guard test is included in quiet release gate (0.5143ms)
ℹ tests 4
ℹ suites 0
ℹ pass 2
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 88.8066

✖ failing tests:
test at tests\ai-usage-limit-guard.test.cjs:24:1
  AssertionError [ERR_ASSERTION]: Today assistant needs client-side off-topic guard
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-usage-limit-guard.test.cjs:27:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\ai-usage-limit-guard.test.cjs:37:1
  AssertionError [ERR_ASSERTION]: usage must be scoped by workspace/profile
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ai-usage-limit-guard.test.cjs:42:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:787:7) {
```

### 15. node --test tests/billing-ui-polish-and-diagnostics.test.cjs

- Command: `node --test tests/billing-ui-polish-and-diagnostics.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_billing-ui-polish-and-diagnostics.test.cjs.log`

```text
✖ Billing page hides technical payment diagnostics from customer plan view (2.1316ms)
✔ Billing page has corrected Polish user-facing labels (1.0422ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
---
ℹ duration_ms 76.3812

✖ failing tests:
test at tests\billing-ui-polish-and-diagnostics.test.cjs:8:1
  AssertionError [ERR_ASSERTION]: The input was expected to not match the regular expression /dryRun:\s*true/. Input:
  
  "const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';\n" +
    'const STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [\n' +
    "  { name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },\n" +
    "  { name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' },\n" +
    '] as const;\n' +
    '\n' +
    '/*\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';\nconst STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [\n  { name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },\n  { name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' },\n] as const;\n\n/*\nSTAGE16B_BILLING_TRUTH_COPY\nGoogle Calendar sync\nPełny asystent AI\nRaport tygodniowy\n*/\n\nconst BILLING_UI_STRIPE_BLIK_LABEL_GUARD = 'Stripe/BLIK';\nconst BILLING_UI_STRIPE_BLIK_COPY_GUARD = 'BLIK przez Stripe';\nconst BILLING_UI_STRIPE_BLIK_ERROR_UTF8_GUARD = 'Błąd uruchamiania płatności Stripe/BLIK';\nimport { useEffect, useMemo, useState } from 'react';\nimport { format, parseISO } from 'date-fns';\nimport { pl } from 'date-fns/locale';\nimport {\n  AlertTriangle,\n  ArrowRight,\n  BadgeCheck,\n  CalendarClock,\n  Check,\n  CreditCard,\n  Loader2,\n  LockKeyhole,\n  RefreshCw,\n  Shield,\n  Sparkles,\n} from 'lucide-react';\nimport { toast } from 'sonner';\n\nimport Layout from '../components/Layout';\nimport { Button } from '../components/ui/button';\nimport { useWorkspace } from '../hooks/useWorkspace';\nimport {\n  billingActionInSupabase,\n  fetchCasesFromSupabase,\n  fetchClientsFromSupabase,\n  fetchLeadsFromSupabase,\n  fetchPaymentsFromSupabase,\n  createBillingCheckoutSessionInSupabase,\n} from '../lib/supabase-fallback';\nimport '../styles/visual-stage16-billing-vnext.css';\n\ntype BillingPeriod = 'monthly' | 'yearly';\ntype BillingTab = 'plan' | 'settlements';\ntype CheckoutPlanKey = 'basic' | 'pro' | 'ai';\ntype PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';\n\nconst UI_TRUTH_BADGE_LABELS_STAGE14E = ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu'] as const;\n\nconst BILLING_VISUAL_REBUILD_STAGE16 = 'BILLING_VISUAL_REBUILD_STAGE16';\nconst BILLING_STRIPE_BLIK_CONTRACT = 'Stripe';\nconst BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J = 'paid plan appears only after Stripe webhook confirmation';\nconst BILLING_STRIPE_STAGE86_E2E_GATE = 'checkout → webhook → paid_active → access refresh → cancel/resume';\n\ntype PlanCard = {\n  id: string;\n  key: 'free' | 'basic' | 'pro' | 'ai';\n  checkoutKey?: CheckoutPlanKey;\n  name: string;\n  monthlyPrice: number;\n  yearlyPrice: number;\n  description: string;\n  badge?: string;\n  features: string[];\n  availabilityHint?: string;\n};\n\nconst BILLING_PLANS: PlanCard[] = [\n  {\n    id: 'free',\n    key: 'free',\n    name: 'Free',\n    monthlyPrice: 0,\n    yearlyPrice: 0,\n    description: 'Tryb demo i awaryjny po trialu, z limitami Free.',\n    features: [\n      'Podgląd podstawowego workflow',\n      'Dobry etap na pierwsze sprawdzenie aplikacji',\n      'Po zakończeniu triala dane zostają w systemie',\n    ],\n    availabilityHint: 'Dostęp przez trial albo tryb podglądu.',\n  },\n  {\n    id: 'closeflow_basic',\n    key: 'basic',\n    checkoutKey: 'basic',\n    name: 'Basic',\n    monthlyPrice: 19,\n    yearlyPrice: 190,\n    description: 'Najprostszy płatny start dla jednej osoby.',\n    features: [\n      'Leady, klienci i zadania',\n      'Dziś, kalendarz w aplikacji, digest po konfiguracji mail providera i powiadomienia',\n      'Lekki parser tekstu i szkice bez pełnego asystenta AI',\n    ],\n  },\n  {\n    id: 'closeflow_pro',\n    key: 'pro',\n    checkoutKey: 'pro',\n    name: 'Pro',\n    monthlyPrice: 39,\n    yearlyPrice: 390,\n    badge: 'Najlepszy wybór',\n    description: 'Pełny workflow lead -> klient -> sprawa -> rozliczenie.',\n    features: [\n      'Wszystko z Basic',\n      'Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth',\n      'Raport tygodniowy, import CSV i cykliczne przypomnienia po konfiguracji',\n      'Bez pełnego asystenta AI',\n    ],\n  },\n  {\n    id: 'closeflow_ai',\n    key: 'ai',\n    checkoutKey: 'ai',\n    name: 'AI',\n    monthlyPrice: 69,\n    yearlyPrice: 690,\n    badge: 'Beta',\n    description: 'Plan przygotowany pod dodatki AI i większy zakres automatyzacji.',\n    features: [\n      'Wszystko z Pro',\n      'Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)',\n      'AI lokalne/regułowe i szkice do ręcznego zatwierdzenia działają także bez zewnętrznego modelu',\n      'Limity AI: 30/dzień i 300/miesiąc',\n    ],\n    availabilityHint: 'Beta. Wymaga konfiguracji AI w Vercel. Nie obiecujemy funkcji, które nie są jeszcze realnie podpięte.',\n  },\n];\n\nconst ACCESS_COPY: Record<string, { label: string; headline: string; description: string; tone: 'green' | 'amber' | 'red' | 'slate'; cta: string }> = {\n  trial_active: {\n    label: 'Trial aktywny',\n    headline: 'Masz aktywny okres testowy',\n    description: 'Możesz sprawdzić główny workflow aplikacji przed wyborem płatnego planu.',\n    tone: 'amber',\n    cta: 'Przejdź do płatności',\n  },\n  trial_ending: {\n    label: 'Trial kończy się',\n    headline: 'Trial zaraz się skończy',\n    description: 'Dane zostają. Wybierz plan, żeby nie blokować dodawania nowych rekordów.',\n    tone: 'amber',\n    cta: 'Przejdź do płatności',\n  },\n  paid_active: {\n    label: 'Dostęp aktywny',\n    headline: 'Plan jest aktywny',\n    description: 'Masz aktywny dostęp do pracy w aplikacji.',\n    tone: 'green',\n    cta: 'Zarządzaj planem',\n  },\n  trial_expired: {\n    label: 'Trial wygasł',\n    headline: 'Trial się zakończył',\n    description: 'Twoje dane zostają. Aby dodawać nowe leady, zadania i wydarzenia, wybierz plan.',\n    tone: 'red',\n    cta: 'Wznów dostęp',\n  },\n  payment_failed: {\n    label: 'Płatność wymaga reakcji',\n    headline: 'Dostęp wymaga odnowienia',\n    description: 'Dane zostają, ale tworzenie nowych rzeczy może być zablokowane do czasu odnowienia planu.',\n    tone: 'red',\n    cta: 'Wznów dostęp',\n  },\n  canceled: {\n    label: 'Plan wyłączony',\n    headline: 'Plan jest nieaktywny',\n    description: 'Workspace jest w trybie bez aktywnej subskrypcji. Dane zostają dostępne do podglądu.',\n    tone: 'slate',\n    cta: 'Wznów dostęp',\n  },\n  inactive: {\n    label: 'Brak aktywnego dostępu',\n    headline: 'Dostęp nie jest aktywny',\n    description: 'Wybierz plan, żeby odblokować pracę na leadach, zadaniach i wydarzeniach.',\n    tone: 'slate',\n    cta: 'Przejdź do płatności',\n  },\n  free_active: {\n    label: 'Free aktywny',\n    headline: 'Masz aktywny tryb Free',\n    description: 'Tryb Free ma limity: 5 aktywnych leadów, 5 aktywnych zadań/wydarzeń, 3 szkice i brak AI.',\n    tone: 'slate',\n    cta: 'Przejdź do płatności',\n  },\n};\n\nconst LIMIT_ITEMS = [\n  { name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Poranny digest', basic: 'Wymaga konfiguracji', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n  { name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Google Calendar', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n  { name: 'Asystent AI (provider + env)', basic: 'Niedostępne w Twoim planie', pro: 'Niedostępne w Twoim planie', ai: 'Beta' },\n  { name: 'Raport tygodniowy', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n];\nconst SETTLEMENT_STATUS_LABELS: Record<string, string> = {\n  awaiting_payment: 'Czeka na płatność',\n  partially_paid: 'Częściowo opłacone',\n  fully_paid: 'Opłacone',\n  commission_pending: 'Prowizja do rozliczenia',\n  paid: 'Zapłacone',\n  not_started: 'Nierozpoczęte',\n  refunded: 'Zwrot',\n  written_off: 'Spisane',\n};\n\nfunction getPlanPrice(plan: PlanCard, period: BillingPeriod) {\n  return period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;\n}\n\nfunction getPlanPeriodLabel(period: BillingPeriod) {\n  return period === 'yearly' ? '/rok' : '/30 dni';\n}\n\nfunction formatMoney(value: unknown) {\n  const amount = Number(value || 0);\n  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';\n}\n\nfunction safeDateLabel(value?: string | null) {\n  if (!value) return 'Nie ustawiono';\n  try {\n    return format(parseISO(value), 'd MMMM yyyy', { locale: pl });\n  } catch {\n    return 'Nie ustawiono';\n  }\n}\n\nfunction getAccessCopy(status?: string | null) {\n  return ACCESS_COPY[String(status || 'inactive')] || ACCESS_COPY.inactive;\n}\n\nfunction getDisplayPlanId(planId?: string | null, subscriptionStatus?: string | null) {\n  const normalized = String(planId || '');\n  if (['closeflow_basic', 'closeflow_basic_yearly', 'closeflow_pro', 'closeflow_pro_yearly', 'closeflow_business', 'closeflow_business_yearly'].includes(normalized)) {\n    return normalized;\n  }\n  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(normalized)) {\n    return 'closeflow_pro';\n  }\n  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';\n  return 'trial_21d';\n}\n\nfunction getCurrentPlanName(displayPlanId: string, isPaidActive: boolean, isTrialActive: boolean) {\n  if (isPaidActive) {\n    const plan = BILLING_PLANS.find((entry) => displayPlanId === entry.id || displayPlanId === `${entry.id}_yearly`);\n    return plan?.name || 'Pro';\n  }\n  if (isTrialActive) return 'Free / trial';\n  return 'Nie ustawiono';\n}\n\nfunction isPlanCurrent(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean) {\n  if (plan.key === 'free') return !isPaidActive && (isTrialActive || displayPlanId === 'free');\n  if (!isPaidActive) return false;\n  return displayPlanId === plan.id || displayPlanId === `${plan.id}_yearly`;\n}\n\nfunction getPlanAvailability(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean): PlanAvailability {\n  if (isPlanCurrent(displayPlanId, plan, isPaidActive, isTrialActive)) return 'current';\n  if (!plan.checkoutKey) return plan.key === 'free' ? 'disabled' : 'soon';\n  return 'available';\n}\n\nfunctio"... 22535 more characters,
    expected: /dryRun:\s*true/,
    operator: 'doesNotMatch',
    diff: 'simple'
  }
```

### 16. node --test tests/case-detail-write-access-gate-stage02b.test.cjs

- Command: `node --test tests/case-detail-write-access-gate-stage02b.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_case-detail-write-access-gate-stage02b.test.cjs.log`

```text
✔ CaseDetail has explicit write access gate for case mutations (0.9271ms)
✖ CaseDetail write handlers call the local write access guard (0.7968ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 75.4092
---

✖ failing tests:
test at tests\case-detail-write-access-gate-stage02b.test.cjs:19:1
  AssertionError [ERR_ASSERTION]: handleAddTask is not guarded
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\case-detail-write-access-gate-stage02b.test.cjs:32:12)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: "﻿/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */\n/* STAGE66_CASE_HISTORY_PASSIVE_COPY */\n/* STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE */\n/* STAGE63_CASE_MAIN_NOTE_HEADER_BUTTON_REMOVE */\n/* STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE */\n/* STAGE61_CASE_NOTE_ACTION_BUTTON_SWAP */\n/* STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE */\n/* STAGE59_CASE_NOTE_FOLLOW_UP_PROMPT */\n/* STAGE58_CASE_RECENT_MOVES_PANEL */\n/* STAGE57_CASE_CREATE_ACTION_HUB */\n/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */\n// LEAD_TO_CASE_FLOW_STAGE24_CASE_DETAIL\n// CASE_DETAIL_VISUAL_REBUILD_STAGE13\nimport {\n useCallback, useEffect, useMemo, useState } from 'react';\nimport { useNavigate, useParams } from 'react-router-dom';\nimport {\n  AlertCircle,\n  ArrowLeft,\n  ArrowRight,\n  CalendarClock,\n  Check,\n  CheckCircle2,\n  Clock,\n  Copy,\n  ExternalLink,\n  FileText,\n  History,\n  ListChecks,\n  Loader2,\n  MessageSquare,\n  Paperclip,\n  Plus,\n  Send,\n  StickyNote,\n  Trash2,\n  UserRound,\n  X,\n} from 'lucide-react';\nimport { toast } from 'sonner';\n\nimport Layout from '../components/Layout';\nimport { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';\nimport { useWorkspace } from '../hooks/useWorkspace';\nimport { Button } from '../components/ui/button';\nimport { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';\nimport { Input } from '../components/ui/input';\nimport { Label } from '../components/ui/label';\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';\nimport { Textarea } from '../components/ui/textarea';\nimport {\n  createClientPortalTokenInSupabase,\n  deleteCaseItemFromSupabase,\n  fetchActivitiesFromSupabase,\n  fetchCaseByIdFromSupabase,\n  fetchCaseItemsFromSupabase,\n  fetchEventsFromSupabase,\n  fetchPaymentsFromSupabase,\n  fetchTasksFromSupabase,\n  createPaymentInSupabase,\n  insertActivityToSupabase,\n  insertCaseItemToSupabase,\n  insertTaskToSupabase,\n  isSupabaseConfigured,\n  updateCaseInSupabase,\n  updateCaseItemInSupabase,\n  updateEventInSupabase,\n  updateTaskInSupabase,\n  fetchLeadByIdFromSupabase,\n} from '../lib/supabase-fallback';\nimport { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';\nimport { getEventMainDate, getTaskMainDate } from '../lib/scheduling';\nimport { normalizeWorkItem } from '../lib/work-items/normalize';\nimport { getNearestPlannedAction } from '../lib/work-items/planned-actions';\nimport '../styles/visual-stage13-case-detail-vnext.css';\n\nconst CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';\n\ntype CaseDetailTab = 'service' | 'path' | 'checklists' | 'history';\ntype CaseItemStatus = 'missing' | 'uploaded' | 'accepted' | 'rejected' | string;\ntype CaseNoteFollowUpChoice = 'today' | 'tomorrow' | 'two_days' | 'week' | 'custom';\n\ntype CaseRecord = {\n  id: string;\n  title?: string;\n  clientName?: string;\n  clientId?: string | null;\n  clientEmail?: string;\n  clientPhone?: string;\n  status?: string;\n  completenessPercent?: number;\n  leadId?: string | null;\n  createdFromLead?: boolean;\n  serviceStartedAt?: string | null;\n  portalReady?: boolean;\n  expectedRevenue?: number;\n  paidAmount?: number;\n  remainingAmount?: number;\n  currency?: string;\n  updatedAt?: any;\n  createdAt?: any;\n  lastActivityAt?: string | null;\n};\n\ntype CaseItem = {\n  id: string;\n  caseId?: string;\n  title?: string;\n  description?: string;\n  type?: string;\n  status?: CaseItemStatus;\n  isRequired?: boolean;\n  dueDate?: string | null;\n  fileUrl?: string | null;\n  fileName?: string | null;\n  response?: string | null;\n  order?: number;\n  approvedAt?: string | null;\n  createdAt?: any;\n};\n\ntype TaskRecord = {\n  id: string;\n  title?: string;\n  type?: string;\n  date?: string | null;\n  scheduledAt?: string | null;\n  reminderAt?: string | null;\n  priority?: string;\n  status?: string;\n  caseId?: string | null;\n  leadId?: string | null;\n  clientId?: string | null;\n};\n\ntype EventRecord = {\n  id: string;\n  title?: string;\n  type?: string;\n  startAt?: string | null;\n  endAt?: string | null;\n  reminderAt?: string | null;\n  status?: string;\n  caseId?: string | null;\n  leadId?: string | null;\n  clientId?: string | null;\n};\n\ntype CaseActivity = {\n  id: string;\n  actorType?: string;\n  eventType?: string;\n  payload?: Record<string, any>;\n  createdAt?: any;\n};\n\ntype WorkItem = {\n  id: string;\n  kind: 'task' | 'event' | 'missing' | 'note';\n  title: string;\n  subtitle: string;\n  status: string;\n  statusClass: string;\n  dateLabel: string;\n  sortTime: number;\n  source: TaskRecord | EventRecord | CaseItem | CaseActivity;\n};\n\nconst CASE_STATUS_LABELS: Record<string, string> = {\n  new: 'Nowa',\n  waiting_on_client: 'Czeka na klienta',\n  in_progress: 'W realizacji',\n  to_approve: 'Do sprawdzenia',\n  blocked: 'Zablokowana',\n  ready_to_start: 'Gotowa do startu',\n  completed: 'Zrobiona',\n  canceled: 'Anulowana',\n};\n\nconst CASE_STATUS_HINTS: Record<string, string> = {\n  new: 'Dodaj pierwszy brak albo zaplanuj pierwszą akcję.',\n  waiting_on_client: 'Czekamy na klienta. Najpierw zdejmij braki po jego stronie.',\n  in_progress: 'Sprawa jest w pracy. Pilnuj najbliższej akcji i terminów.',\n  to_approve: 'Klient coś przesłał. Sprawdź i zaakceptuj albo odrzuć.',\n  blocked: 'Sprawa stoi. Usuń blokery zanim przejdziesz dalej.',\n  ready_to_start: 'Sprawa jest gotowa do dalszej pracy operacyjnej.',\n  completed: 'Sprawa zrobiona. Historia zostaje jako ślad pracy.',\n  canceled: 'Sprawa została anulowana.',\n};\n\nconst ITEM_STATUS_LABELS: Record<string, string> = {\n  missing: 'Brak',\n  uploaded: 'Do akceptacji',\n  accepted: 'Zaakceptowane',\n  rejected: 'Odrzucone',\n  sent: 'Wysłane',\n};\n\nconst ITEM_TYPE_LABELS: Record<string, string> = {\n  file: 'Plik',\n  decision: 'Decyzja',\n  text: 'Tekst',\n};\n\nconst TASK_STATUS_LABELS: Record<string, string> = {\n  todo: 'Do zrobienia',\n  open: 'Otwarte',\n  in_progress: 'W trakcie',\n  done: 'Zrobione',\n  completed: 'Zrobione',\n  cancelled: 'Anulowane',\n};\n\nconst EVENT_STATUS_LABELS: Record<string, string> = {\n  planned: 'Zaplanowane',\n  open: 'Zaplanowane',\n  scheduled: 'Zaplanowane',\n  done: 'Odbyte',\n  completed: 'Odbyte',\n  cancelled: 'Anulowane',\n};\n\nfunction normalizeRecord<T>(value: unknown): T | null {\n  if (Array.isArray(value)) return (value[0] || null) as T | null;\n  if (value && typeof value === 'object') return value as T;\n  return null;\n}\n\nfunction toDate(value: any): Date | null {\n  if (!value) return null;\n  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;\n  if (typeof value?.toDate === 'function') {\n    const date = value.toDate();\n    return Number.isNaN(date.getTime()) ? null : date;\n  }\n  const date = new Date(value);\n  return Number.isNaN(date.getTime()) ? null : date;\n}\n\nfunction formatDateTime(value: any, fallback = 'Brak daty') {\n  const date = toDate(value);\n  if (!date) return fallback;\n  return date.toLocaleString('pl-PL', {\n    day: '2-digit',\n    month: 'short',\n    year: 'numeric',\n    hour: '2-digit',\n    minute: '2-digit',\n  });\n}\n\nfunction formatDate(value: any, fallback = 'Bez terminu') {\n  const date = toDate(value);\n  if (!date) return fallback;\n  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });\n}\n\nfunction formatMoney(value: unknown, currency?: string) {\n  const amount = Number(value || 0);\n  const safeAmount = Number.isFinite(amount) ? amount : 0;\n  const safeCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'PLN';\n  return `${safeAmount.toLocaleString('pl-PL')} ${safeCurrency}`;\n}\n\nfunction isPaidPaymentStatus(status: unknown) {\n  return ['deposit_paid', 'partially_paid', 'fully_paid', 'paid'].includes(String(status || '').toLowerCase());\n}\n\nfunction billingStatusLabel(status?: string) {\n  switch (String(status || '').toLowerCase()) {\n    case 'deposit_paid':\n      return 'Zaliczka wpłacona';\n    case 'partially_paid':\n      return 'Częściowo opłacone';\n    case 'fully_paid':\n    case 'paid':\n      return 'Opłacone';\n    case 'awaiting_payment':\n      return 'Czeka na płatność';\n    case 'not_started':\n      return 'Brak wpłaty';\n    default:\n      return status || 'Brak statusu';\n  }\n}\n\nfunction sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {\n  return toDate(value)?.getTime() || fallback;\n}\n\nfunction toIsoFromLocalInput(value: string) {\n  if (!value) return '';\n  const date = new Date(value);\n  return Number.isNaN(date.getTime()) ? '' : date.toISOString();\n}\n\nfunction toDateOnlyFromLocalInput(value: string) {\n  return value ? value.slice(0, 10) : '';\n}\n\nfunction buildQuickRescheduleIso(daysFromNow: number, sourceDate?: any, fallbackHour = 9) {\n  const source = toDate(sourceDate);\n  const target = new Date();\n  target.setDate(target.getDate() + daysFromNow);\n  if (source) target.setHours(source.getHours(), source.getMinutes(), 0, 0);\n  else target.setHours(fallbackHour, 0, 0, 0);\n  return target.toISOString();\n}\n\nfunction buildDateOnlyFromIso(value: string) {\n  return value ? value.slice(0, 10) : '';\n}\n\nfunction addDurationToIso(startIso: string, durationMs: number) {\n  const start = toDate(startIso);\n  if (!start) return '';\n  return new Date(start.getTime() + durationMs).toISOString();\n}\n\n\nfunction buildCaseNoteFollowUpIso(choice: CaseNoteFollowUpChoice, customValue?: string) {\n  if (choice === 'custom') return toIsoFromLocalInput(customValue || '');\n  if (choice === 'today') return buildQuickRescheduleIso(0, null, 16);\n  if (choice === 'tomorrow') return buildQuickRescheduleIso(1, null, 9);\n  if (choice === 'two_days') return buildQuickRescheduleIso(2, null, 9);\n  return buildQuickRescheduleIso(7, null, 9);\n}\n\nfunction getCaseNoteFollowUpChoiceLabel(choice: CaseNoteFollowUpChoice) {\n  if (choice === 'today') return 'Dziś';\n  if (choice === 'tomorrow') return 'Jutro';\n  if (choice === 'two_days') return 'Za 2 dni';\n  if (choice === 'week') return 'Za tydzień';\n  return 'Własny termin';\n}\n\nfunction getEventDurationMs(event: EventRecord) {\n  const start = toDate(event.startAt);\n  const end = t"... 63376 more characters,
    expected: /const\s+handleAddTask\s*=\s*async[\s\S]*?guardCaseDetailWriteAccess/,
    operator: 'match',
    diff: 'simple'
  }
```

### 17. node --test tests/faza2-etap21-workspace-isolation.test.cjs

- Command: `node --test tests/faza2-etap21-workspace-isolation.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_faza2-etap21-workspace-isolation.test.cjs.log`

```text
✔ Faza 2 Etap 2.1 workspace isolation audit is documented and wired (1.7414ms)
✖ Request scope helpers and known compatibility debt are visible (3.0513ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 71.2252
---

✖ failing tests:
test at tests\faza2-etap21-workspace-isolation.test.cjs:34:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /body\.workspaceId/. Input:
  
  "import { selectFirstAvailable } from './_supabase.js';\r\n" +
    "import { RequestAuthError, requireSupabaseRequestContext } from './_supabase-auth.js';\r\n" +
    '/* A13_STATIC_CONTRACT_GUARD requireSupabaseRequestContext */\r\n' +
    '\r\n' +
    'export type RequestIdentity = {\r\n' +
    '  userId: string | null;\r\n' +
    '  uid: string | null;\r\n' +
    '\n' +
    '// ADMIN_AI_PROFILE_ROLE_GATE_2026_05_03\n' +
    '// Admin-only calls must be based on verified Supabase context, not spoofable x-user-email headers.\n' +
    'export async function requireAdminAuthContext(req: any, bodyInput?: any) {\n' +
    '  const headerIdentity = await requireRequestIdentity(req, bodyInput);\n' +
    '  try {\n' +
    '    const context = await requireSupabaseRequestContext(req);\n' +
    '    const identity: RequestIdentity = {\n' +
    '      userId: asText(context.userId) || headerIdentity.userId || null,\n' +
    '      uid: asText(context.userId) || headerIdentity.uid || null,\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "import { selectFirstAvailable } from './_supabase.js';\r\nimport { RequestAuthError, requireSupabaseRequestContext } from './_supabase-auth.js';\r\n/* A13_STATIC_CONTRACT_GUARD requireSupabaseRequestContext */\r\n\r\nexport type RequestIdentity = {\r\n  userId: string | null;\r\n  uid: string | null;\r\n  email: string | null;\r\n  fullName: string | null;\r\n  workspaceId: string | null;\r\n};\r\n\r\nexport function asText(value: unknown) {\r\n  if (typeof value === 'string') return value.trim();\r\n  if (value === null || value === undefined) return '';\r\n  return String(value).trim();\r\n}\r\n\r\nfunction parseBody(req: any) {\r\n  if (!req?.body) return {};\r\n  if (typeof req.body === 'string') {\r\n    try { return JSON.parse(req.body || '{}'); } catch { return {}; }\r\n  }\r\n  return req.body && typeof req.body === 'object' ? req.body : {};\r\n}\r\n\r\nfunction requestHeader(req: any, name: string) {\r\n  const headers = req?.headers || {};\r\n  const lower = name.toLowerCase();\r\n  const direct = headers[name] ?? headers[lower] ?? headers[name.toUpperCase()];\r\n  if (Array.isArray(direct)) return asText(direct[0]);\r\n  return asText(direct);\r\n}\r\n\r\nfunction firstQueryValue(value: unknown) {\r\n  if (Array.isArray(value)) return asText(value[0]);\r\n  return asText(value);\r\n}\r\n\r\nexport function getRequestIdentity(req: any, bodyInput?: any): RequestIdentity {\r\n  /* REQUEST_SCOPE_LEGACY_UNDERSCORE_PARAM_MARKER getRequestIdentity(_req */  void req;\r\n  void bodyInput;\r\n  /*\n  REQUEST_SCOPE_LEGACY_IDENTITY_SHAPE_STATIC_GUARD_STAGE45A_V14\n  Static compatibility only. Do not trust frontend identity headers/body/query here.\n  userId: userId || null\n  uid: userId || null\n  email: email || null\n  fullName: fullName || null\n  workspaceId: workspaceId || null\n  */// A22_SUPABASE_AUTH_RLS_WORKSPACE_FRONTEND_IDENTITY_LOCK\n  // Frontend identity headers/body/query are not trusted as authentication.\n  // Compatibility text for legacy static guard: return { userId: null, email: null, fullName: null, workspaceId: null }\n  return {\n    userId: null,\n    uid: null,\n    email: null,\n    fullName: null,\n    workspaceId: null,\n  };\n}\r\n\r\nexport async function requireRequestIdentity(req: any, bodyInput?: any): Promise<RequestIdentity> {\n  const headerIdentity = getRequestIdentity(req, bodyInput);\n  if (headerIdentity.userId || headerIdentity.email) return headerIdentity;\n\r\n  try {\r\n    const context = await requireSupabaseRequestContext(req);\r\n    const identity: RequestIdentity = {\n      userId: asText(context.userId) || null,\n      uid: asText(context.userId) || null,\n      email: asText(context.email) || null,\n      fullName: asText(context.fullName) || null,\n      workspaceId: asText(context.workspaceId) || null,\n    };\r\n    if (identity.userId || identity.email) return identity;\r\n  } catch (error) {\r\n    if (error instanceof RequestAuthError) throw error;\r\n  }\r\n\r\n  throw new RequestAuthError(401, 'REQUEST_IDENTITY_REQUIRED');\r\n}\r\n\r\nfunction envList(names: string[]) {\r\n  return names\r\n    .flatMap((name) => asText(process.env[name]).split(','))\r\n    .map((item) => item.trim().toLowerCase())\r\n    .filter(Boolean);\r\n}\r\n\r\nfunction profileHasAdminRole(row: Record<string, unknown> | null | undefined) {\n  if (!row) return false;\n  const role = asText((row as any).role || '').toLowerCase();\n  const appRole = asText((row as any).app_role || (row as any).appRole || '').toLowerCase();\n  return role === 'admin'\n    || role === 'owner'\n    || appRole === 'admin'\n    || appRole === 'owner'\n    || appRole === 'creator'\n    || appRole === 'app_owner'\n    || (row as any).is_admin === true\n    || (row as any).isAdmin === true\n    || (row as any).is_app_owner === true\n    || (row as any).isAppOwner === true;\n}\n\nfunction isLikelyUuid(value: unknown) {\n  return typeof value === 'string'\n    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);\n}\n\nasync function findAdminProfileForIdentity(identity: RequestIdentity) {\n  const queries: string[] = [];\n  const userId = asText(identity.userId || identity.uid || '');\n  const email = asText(identity.email || '').toLowerCase();\n\n  if (email) queries.push(`profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);\n  if (userId) {\n    queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n    queries.push(`profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n    queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n    if (isLikelyUuid(userId)) queries.push(`profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n  }\n\n  for (const query of queries) {\n    const rows = await selectRows(query);\n    const row = rows[0] || null;\n    if (profileHasAdminRole(row)) return row;\n  }\n\n  return null;\n}\n\n// ADMIN_AI_PROFILE_ROLE_GATE_2026_05_03\n// Admin-only calls must be based on verified Supabase context, not spoofable x-user-email headers.\nexport async function requireAdminAuthContext(req: any, bodyInput?: any) {\n  const headerIdentity = await requireRequestIdentity(req, bodyInput);\n\n  try {\n    const context = await requireSupabaseRequestContext(req);\n    const identity: RequestIdentity = {\n      userId: asText(context.userId) || headerIdentity.userId || null,\n      uid: asText(context.userId) || headerIdentity.uid || null,\n      email: asText(context.email) || headerIdentity.email || null,\n      fullName: asText(context.fullName) || headerIdentity.fullName || null,\n      workspaceId: asText(context.workspaceId) || headerIdentity.workspaceId || null,\n    };\n\n    const email = asText(identity.email).toLowerCase();\n    const adminEmails = envList(['CLOSEFLOW_ADMIN_EMAILS', 'CLOSEFLOW_ADMIN_EMAIL', 'APP_OWNER_EMAIL', 'ADMIN_EMAIL', 'VITE_APP_OWNER_EMAIL']);\n    if (adminEmails.length > 0 && email && adminEmails.includes(email)) return identity;\n\n    const appMeta = context.rawUser?.app_metadata && typeof context.rawUser.app_metadata === 'object'\n      ? context.rawUser.app_metadata as Record<string, unknown>\n      : {};\n    const role = asText(appMeta.role || appMeta.claims_role || '').toLowerCase();\n    const roles = Array.isArray(appMeta.roles) ? appMeta.roles.map((item) => asText(item).toLowerCase()) : [];\n    if (role === 'admin' || role === 'owner' || roles.includes('admin') || roles.includes('owner')) return identity;\n\n    const profileRow = await findAdminProfileForIdentity(identity);\n    if (profileRow) return identity;\n  } catch (error) {\n    if (error instanceof RequestAuthError && error.status !== 401) throw error;\n  }\n\n  throw new RequestAuthError(403, 'ADMIN_ROLE_REQUIRED');\n}\n\nasync function selectRows(query: string) {\r\n  try {\r\n    const result = await selectFirstAvailable([query]);\r\n    return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];\r\n  } catch {\r\n    return [];\r\n  }\r\n}\r\n\r\nfunction identityMatches(value: unknown, identity: RequestIdentity) {\r\n  const normalized = asText(value).toLowerCase();\r\n  if (!normalized) return false;\r\n  return normalized === asText(identity.userId).toLowerCase()\r\n    || normalized === asText(identity.uid).toLowerCase()\r\n    || normalized === asText(identity.email).toLowerCase();\r\n}\r\n\r\n\n// WORKSPACE_OWNER_REQUIRED compatibility marker for legacy P0 workspace scope guard.\n// Current runtime error remains WORKSPACE_OWNER_OR_ADMIN_REQUIRED because the helper allows verified owner/member/admin access.\nexport async function assertWorkspaceOwnerOrAdmin(workspaceId: string, req?: any) {\r\n  const normalizedWorkspaceId = asText(workspaceId);\r\n  if (!normalizedWorkspaceId) throw new RequestAuthError(401, 'WORKSPACE_CONTEXT_REQUIRED');\r\n  const identity = await requireRequestIdentity(req || {});\r\n\r\n  if (identity.workspaceId && identity.workspaceId === normalizedWorkspaceId) return true;\r\n\r\n  const workspaceRows = await selectRows(`workspaces?select=*&id=eq.${encodeURIComponent(normalizedWorkspaceId)}&limit=1`);\r\n  const workspace = workspaceRows[0] || null;\r\n  if (workspace) {\r\n    const ownerCandidates = [\r\n      workspace.owner_user_id,\r\n      workspace.owner_id,\r\n      workspace.created_by_user_id,\r\n      workspace.user_id,\r\n      workspace.email,\r\n      workspace.owner_email,\r\n    ];\r\n    if (ownerCandidates.some((candidate) => identityMatches(candidate, identity))) return true;\r\n  }\r\n\r\n  if (identity.userId) {\r\n    const membershipRows = await selectRows(\r\n      `workspace_members?user_id=eq.${encodeURIComponent(identity.userId)}&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&select=*&limit=1`,\r\n    );\r\n    if (membershipRows[0]) return true;\r\n  }\r\n\r\n  if (identity.email) {\r\n    const profileRows = await selectRows(\r\n      `profiles?select=*&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&email=eq.${encodeURIComponent(identity.email)}&limit=1`,\r\n    );\r\n    if (profileRows[0]) return true;\r\n  }\r\n\r\n  // STAGE15_NO_AUTH_ONLY_WORKSPACE_FALLBACK: authenticated user alone is not enough for another workspace.\nthrow new RequestAuthError(403, 'WORKSPACE_OWNER_OR_ADMIN_REQUIRED');\r\n}\r\n\r\nexport async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {\n  void bodyInput;\n  // STAGE15_NO_BODY_WORKSPACE_TRUST\n  // Request body/query workspace values are ignored. Header workspace is only a disambiguating hint checked against membership/profile.\n  const hintedWorkspaceId = asText(\n    requestHeader(req, 'x-workspace-id')\n    || requestHeader(req, 'x-closeflow-workspace-id'),\n  );\n\n  const context = await requireSupabaseRequestContext(req);\n  const contextWorkspaceId = asText(context.workspaceId);\n  if (contextWorkspaceId) return contextWorkspaceId;\n\n  const contextUserId = asText(context.userId);\n  const contextEmail = asText(context.email).toLowerCase();\n  if (!contextUserId && !contextEmail) {\n    throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');\n  }\n\n  if (hintedWorkspaceId) {\n    if (contextUserId) {\n      const membershipRows = await selectRows(\n        'workspace_members?user_id=eq.' + encodeURIComponent(contextUserId)\n   "... 4107 more characters,
    expected: /body\.workspaceId/,
    operator: 'match',
    diff: 'simple'
  }
```

### 18. node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs

- Command: `node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_faza3-etap32d-plan-based-ui-visibility.test.cjs.log`

```text
✖ Faza 3 Etap 3.2D hides AI navigation and global actions by plan (3.1403ms)
✔ Faza 3 Etap 3.2D blocks /ai-drafts direct route for plans without drafts (1.9004ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
---
ℹ duration_ms 81.9674

✖ failing tests:
test at tests\faza3-etap32d-plan-based-ui-visibility.test.cjs:12:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /\{canUseQuickAiCaptureByPlan \? <QuickAiCapture \/> : null\}/. Input:
  
  '/* legacy-guard-global-actions-class-top: className="global-actions" */\n' +
    '/*\n' +
    'GLOBAL_QUICK_ACTIONS_SINGLE_SOURCE_V97\n' +
    'GLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97\n' +
    'VISUAL_STAGE_01_GLOBAL_BAR_ACTIONS\n' +
    'Asystent AI, Szybki szkic, Inbox szkiców, Lead, Zadanie i Wydarzenie mają jedno miejsce: globalny pasek u góry aplikacji.\n' +
    'Pasek działa jako toolbar i jest czytelny na telefonie: role="toolbar", aria-label="Szybkie akcje aplikacji", data-global-quick-actions-contract="v97".\n' +
    "  if (typeof window === 'undefined') return;\n" +
    '  window.sessionStorage.setItem(QUICK_ACTION_STORAGE_KEY, target);\n' +
    '  // GLOBAL_QUICK_ACTIONS_STAGE08D_EVENT_BUS: same-route clicks must open the modal without route remount.\n' +
    '  window.dispatchEvent(new CustomEvent<GlobalQuickActionTarget>(QUICK_ACTION_EVENT, { detail: target }));\n' +
    '}\n' +
    '\n' +
    'export function consumeGlobalQuickAction(): GlobalQuickActionTarget | null {\n' +
    "  if (typeof window === 'undefined') return null;\n" +
    '  const value = window.sessionStorage.getItem(QUICK_ACTION_STORAGE_KEY);\n' +
    '  window.sessionStorage.removeItem(QUICK_ACTION_STORAGE_KEY);\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: `/* legacy-guard-global-actions-class-top: className="global-actions" */\n/*\nGLOBAL_QUICK_ACTIONS_SINGLE_SOURCE_V97\nGLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97\nVISUAL_STAGE_01_GLOBAL_BAR_ACTIONS\nAsystent AI, Szybki szkic, Inbox szkiców, Lead, Zadanie i Wydarzenie mają jedno miejsce: globalny pasek u góry aplikacji.\nPasek działa jako toolbar i jest czytelny na telefonie: role="toolbar", aria-label="Szybkie akcje aplikacji", data-global-quick-actions-contract="v97".\n*/\n/*\n * AI_DRAFT_INBOX_FLOW_COMPAT: TodayAiAssistant\n * GlobalQuickActions uses GlobalAiAssistant, which wraps the TodayAiAssistant behavior\n * with full app context. Keep this short marker for the legacy draft-inbox contract test.\n */\nimport { useState } from 'react';\nimport { ClipboardList, Plus } from 'lucide-react';\nimport { Link } from 'react-router-dom';\n\nimport GlobalAiAssistant from './GlobalAiAssistant';\nimport QuickAiCapture from './QuickAiCapture';\nimport TaskCreateDialog from './TaskCreateDialog';\nimport { Button } from './ui/button';\nimport { useWorkspace } from '../hooks/useWorkspace';\n\nexport type GlobalQuickActionTarget = 'lead' | 'task' | 'event';\n\nconst QUICK_ACTION_STORAGE_KEY = 'closeflow:global-quick-action:v1';\nconst QUICK_ACTION_EVENT = 'closeflow:global-quick-action';\nconst STAGE14_UI_TRUTH_GLOBAL_ACTIONS = 'Beta / Wymaga konfiguracji / Niedostępne w Twoim planie';\n\nexport function rememberGlobalQuickAction(target: GlobalQuickActionTarget) {\n  if (typeof window === 'undefined') return;\n  window.sessionStorage.setItem(QUICK_ACTION_STORAGE_KEY, target);\n  // GLOBAL_QUICK_ACTIONS_STAGE08D_EVENT_BUS: same-route clicks must open the modal without route remount.\n  window.dispatchEvent(new CustomEvent<GlobalQuickActionTarget>(QUICK_ACTION_EVENT, { detail: target }));\n}\n\nexport function consumeGlobalQuickAction(): GlobalQuickActionTarget | null {\n  if (typeof window === 'undefined') return null;\n  const value = window.sessionStorage.getItem(QUICK_ACTION_STORAGE_KEY);\n  window.sessionStorage.removeItem(QUICK_ACTION_STORAGE_KEY);\n\n  if (value === 'lead' || value === 'task' || value === 'event') return value;\n  return null;\n}\n\nexport function subscribeGlobalQuickAction(listener: (target: GlobalQuickActionTarget) => void) {\n  if (typeof window === 'undefined') return () => undefined;\n\n  const handler = (event: Event) => {\n    const target = (event as CustomEvent<GlobalQuickActionTarget>).detail;\n    if (target === 'lead' || target === 'task' || target === 'event') listener(target);\n  };\n\n  window.addEventListener(QUICK_ACTION_EVENT, handler as EventListener);\n  return () => window.removeEventListener(QUICK_ACTION_EVENT, handler as EventListener);\n}\n\nexport default function GlobalQuickActions() {\n  const { access } = useWorkspace();\n  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);\n  const canUseFullAiAssistantByPlan = Boolean(access?.features?.ai || access?.features?.fullAi);\n  const canUseQuickAiCaptureByPlan = Boolean(access?.features?.lightDrafts || access?.features?.lightParser || access?.features?.fullAi);\n  const canUseAiDraftsByPlan = Boolean(access?.features?.lightDrafts || access?.features?.fullAi);\n  return (\n    <>\n      <div\n        role="toolbar"\n        aria-label="Szybkie akcje aplikacji"\n        className="global-actions sticky top-16 z-20 overflow-x-auto"\n        data-global-quick-actions="true"\n        data-global-quick-actions-contract="v97"\n        data-visual-stage="01-global-actions"\n      >\n        {canUseFullAiAssistantByPlan ? (\n          <span data-feature-status="Beta" title="Beta"><GlobalAiAssistant /></span>\n        ) : null}\n        {canUseQuickAiCaptureByPlan ? <span data-feature-status="Beta" title="Beta"><QuickAiCapture /></span> : null}\n        {canUseAiDraftsByPlan ? (\n          <Button asChild variant="outline" className="btn soft-blue" data-global-quick-action="ai-drafts" data-feature-status="Beta" title="Beta">\n            <Link to="/ai-drafts" aria-label="Otwórz Inbox szkiców">\n              <ClipboardList className="mr-2 h-4 w-4" />\n              Inbox szkiców\n            </Link>\n          </Button>\n        ) : null}\n        <Button asChild variant="outline" className="btn" data-global-quick-action="lead" data-feature-status="Gotowe" title="Gotowe">\n          <Link to="/leads?quick=lead" aria-label="Otwórz leady lub dodaj leada" onClick={() => rememberGlobalQuickAction('lead')}>\n            <Plus className="mr-2 h-4 w-4" />\n            Lead\n          </Link>\n        </Button>\n        {/* STAGE01_GLOBAL_TASK_QUICK_ACTION_BRIDGE_COMPAT_STAGE45M: rememberGlobalQuickAction('task') marker only. Direct task modal opens in place, without Link/asChild route. */}\n        <Button type="button" variant="outline" className="btn" data-global-quick-action="task" data-global-task-direct-modal-trigger="true" data-feature-status="Gotowe" title="Gotowe" onClick={() => setIsTaskCreateOpen(true)}>\n          <Plus className="mr-2 h-4 w-4" />\n          Zadanie\n        </Button>\n        <Button asChild variant="outline" className="btn" data-global-quick-action="event" data-feature-status="Gotowe" title="Gotowe">\n          <Link to="/calendar?quick=event" aria-label="Otwórz kalendarz lub dodaj wydarzenie" onClick={() => rememberGlobalQuickAction('event')}>\n            <Plus className="mr-2 h-4 w-4" />\n            Wydarzenie\n          </Link>\n        </Button>\n      </div>\n      <TaskCreateDialog open={isTaskCreateOpen} onOpenChange={setIsTaskCreateOpen} />\n    </>\n  );\n}\n\n/*\nPHASE0_GLOBAL_QUICK_ACTIONS_GUARD\nimport QuickAiCapture from './QuickAiCapture'\n<QuickAiCapture />\nGlobalAiAssistant\nTodayAiAssistant\ndata-global-quick-actions-contract="v97"\ndata-global-quick-actions\nSzybki szkic\nto="/leads"\nto="/tasks"\nto="/calendar"\n*/\n\n/* PHASE0_AI_ASSISTANT_GLOBAL_TOOLBAR_LAST7 GlobalAiAssistant data-global-quick-actions-contract */\n/* PHASE0_GLOBAL_QUICK_ACTIONS_AI_FINAL4 GlobalAiAssistant data-global-quick-actions-contract */\n/* GLOBAL_QUICK_ACTIONS_STAGE08D_SAME_ROUTE_MODAL_FIX to="/leads?quick=lead" to="/calendar?quick=event" subscribeGlobalQuickAction */\n\n\n/* UI_TRUTH_PLAN_BLOCKED_COPY Niedostępne w Twoim planie */\n\n/* STAGE16B_LOCKED_AI_BUTTON_COPY: Asystent AI jest w planie AI */\n`,
    expected: /\{canUseQuickAiCaptureByPlan \? <QuickAiCapture \/> : null\}/,
    operator: 'match',
    diff: 'simple'
  }
```

### 19. node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs

- Command: `node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs.log`

```text
✔ Faza 3 Etap 3.2E has unique Settings plan gates (1.1302ms)
✖ Faza 3 Etap 3.2E gates Settings Google Calendar and digest visibility (5.1705ms)
✔ Faza 3 Etap 3.2E keeps Billing as allowed upsell/comparison surface (2.088ms)
ℹ tests 3
ℹ suites 0
ℹ pass 2
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
---
ℹ duration_ms 69.4836

✖ failing tests:
test at tests\faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs:24:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /digestUiVisibleByPlan\s*=\s*DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan/. Input:
  
  "import { useEffect, useMemo, useState } from 'react';\r\n" +
    'import {\r\n' +
    "  EmailAuthProvider, fetchSignInMethodsForEmail, linkWithCredential, reauthenticateWithCredential, sendPasswordResetEmail, signOut, verifyBeforeUpdateEmail, } from 'firebase/auth';\r\n" +
    "  Bell, Building2, CalendarDays, Database, KeyRound, LockKeyhole, LogOut, Mail, MonitorCog, RefreshCw, Save, Shield, SlidersHorizontal, Smartphone, User, Users, WalletCards, } from 'lucide-react';\r\n" +
    "import { toast } from 'sonner';\r\n" +
    '\r\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "import { useEffect, useMemo, useState } from 'react';\r\nimport {\r\n  EmailAuthProvider, fetchSignInMethodsForEmail, linkWithCredential, reauthenticateWithCredential, sendPasswordResetEmail, signOut, verifyBeforeUpdateEmail, } from 'firebase/auth';\r\nimport {\r\n  Bell, Building2, CalendarDays, Database, KeyRound, LockKeyhole, LogOut, Mail, MonitorCog, RefreshCw, Save, Shield, SlidersHorizontal, Smartphone, User, Users, WalletCards, } from 'lucide-react';\r\nimport { toast } from 'sonner';\r\n\r\nimport Layout from '../components/Layout';\r\nimport { useAppearance } from '../components/appearance-provider';\r\nimport { Button } from '../components/ui/button';\r\nimport { Input } from '../components/ui/input';\r\nimport { Label } from '../components/ui/label';\r\nimport { auth } from '../firebase';\r\nimport { useWorkspace } from '../hooks/useWorkspace';\r\nimport { useClientAuthSnapshot } from '../hooks/useClientAuthSnapshot';\r\nimport { getConflictWarningsEnabled, setConflictWarningsEnabled as storeConflictWarningsEnabled } from '../lib/app-preferences';\r\nimport {\n  getBrowserNotificationPermission, getBrowserNotificationsEnabled, setBrowserNotificationsEnabled, supportsBrowserNotifications, } from '../lib/notifications';\nimport { getReminderSettings, setReminderSettings } from '../lib/reminders';\nimport { updateProfileSettingsInSupabase, updateWorkspaceSettingsInSupabase } from '../lib/supabase-fallback';\r\nimport { GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS } from '../lib/options';\r\nimport { getGoogleCalendarReminderPreference, setGoogleCalendarReminderPreference } from '../lib/google-calendar-reminder-preferences';\r\nimport '../styles/visual-stage19-settings-vnext.css';\r\n\r\nconst SETTINGS_VISUAL_REBUILD_STAGE19 = 'SETTINGS_VISUAL_REBUILD_STAGE19';\r\nconst DAILY_DIGEST_EMAIL_UI_VISIBLE = false;\nconst DAILY_DIGEST_EMAIL_TEST_COPY_GUARD = 'Wyślij test teraz';\r\nconst DAILY_DIGEST_EMAIL_CRON_HINT_GUARD = 'Na darmowym Vercel cron działa raz dziennie';\r\nconst DAILY_DIGEST_EMAIL_CONFIG_COPY_GUARD = 'Sprawdź konfigurację';\r\nconst DAILY_DIGEST_EMAIL_READY_COPY_GUARD = 'Digest gotowy do wysyłki';\r\nconst DAILY_DIGEST_EMAIL_NEEDS_CONFIG_COPY_GUARD = 'Digest wymaga konfiguracji';\r\nconst DAILY_DIGEST_EMAIL_ENV_COPY_GUARD = 'RESEND_API_KEY: DIGEST_FROM_EMAIL:';\r\nconst GOOGLE_CALENDAR_CONFIG_REQUIRED_IS_NOT_USER_ERROR_STAGE86 = 'Google Calendar wymaga konfiguracji w Vercel';\r\n\r\ntype ProfileFormState = {\r\n  fullName: string;\r\n  companyName: string;\r\n};\r\n\r\ntype DigestDiagnosticsState = {\r\n  canSend?: boolean;\r\n  env?: {\r\n    hasResendApiKey?: boolean;\r\n    hasFromEmail?: boolean;\r\n    hasAppUrl?: boolean;\r\n    fromEmail?: string;\r\n    appUrl?: string;\r\n    usesFallbackFromEmail?: boolean;\r\n    cronSecretConfigured?: boolean;\r\n  };\r\n  workspace?: {\r\n    dailyDigestEnabled?: boolean;\r\n    dailyDigestHour?: number;\r\n    dailyDigestTimezone?: string;\r\n    dailyDigestRecipientEmail?: string | null;\r\n  };\r\n  hints?: string[];\r\n};\r\n\r\n\r\ntype GoogleCalendarStatusState = {\r\n  ok?: boolean;\r\n  configured?: boolean;\r\n  missing?: string[];\r\n  connected?: boolean;\r\n  connection?: {\r\n    googleCalendarId?: string;\r\n    googleAccountEmail?: string;\r\n    syncEnabled?: boolean;\r\n  } | null;\r\n};\r\n\r\ntype GoogleCalendarOutboundResultState = {\r\n  ok?: boolean;\r\n  connected?: boolean;\r\n  mode?: string;\r\n  connectedCalendarId?: string;\r\n  scanned?: number;\r\n  created?: number;\r\n  updated?: number;\r\n  skipped?: number;\r\n  failed?: number;\r\n  errors?: Array<{ id?: string; title?: string; error?: string }>;\r\n};\r\n\r\nfunction humanAccessStatus(status?: string | null) {\r\n  switch (String(status || 'inactive')) {\r\n    case 'trial_active':\r\n      return 'Trial aktywny';\r\n    case 'trial_ending':\r\n      return 'Trial kończy się';\r\n    case 'trial_expired':\r\n      return 'Trial wygasł';\r\n    case 'paid_active':\r\n      return 'Dostęp aktywny';\r\n    case 'payment_failed':\r\n      return 'Płatność wymaga reakcji';\r\n    case 'canceled':\r\n      return 'Plan wyłączony';\r\n    default:\r\n      return 'Brak aktywnego dostępu';\r\n  }\r\n}\r\n\r\nfunction humanPlan(planId?: string | null, subscriptionStatus?: string | null) {\r\n  const normalized = String(planId || '');\r\n  if (normalized.includes('basic')) return 'Basic';\r\n  if (normalized.includes('business')) return 'AI / Business';\r\n  if (normalized.includes('pro') || subscriptionStatus === 'paid_active') return 'Pro';\r\n  if (normalized.includes('trial')) return 'Trial';\r\n  return 'Nie ustawiono';\r\n}\r\n\r\nfunction permissionCopy(permission: NotificationPermission | 'unsupported') {\r\n  if (permission === 'unsupported') return 'Przeglądarka nie obsługuje powiadomień systemowych.';\r\n  if (permission === 'granted') return 'Powiadomienia przeglądarki są włączone.';\r\n  if (permission === 'denied') return 'Powiadomienia są zablokowane w przeglądarce.';\r\n  return 'Powiadomienia przeglądarki nie są jeszcze włączone.';\r\n}\r\n\r\nfunction asText(value: unknown, fallback = 'Nie ustawiono') {\r\n  const text = typeof value === 'string' ? value.trim() : '';\r\n  return text || fallback;\r\n}\r\n\r\nexport default function Settings() {\r\n  const { workspace, profile: workspaceProfile, loading: workspaceLoading, refresh, access, isAdmin, isAppOwner } = useWorkspace();\r\n  const { skin, setSkin, skinOptions } = useAppearance();\r\n  const authSnapshot = useClientAuthSnapshot();\r\n\r\n  const [profile, setProfile] = useState<ProfileFormState>({ fullName: '', companyName: '' });\r\n  const [savingProfile, setSavingProfile] = useState(false);\r\n  const [savingWorkspaceSettings, setSavingWorkspaceSettings] = useState(false);\r\n  const [sendingDigestTest, setSendingDigestTest] = useState(false);\r\n  const [checkingDigestDiagnostics, setCheckingDigestDiagnostics] = useState(false);\r\n  const [digestDiagnostics, setDigestDiagnostics] = useState<DigestDiagnosticsState | null>(null);\r\n  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false);\r\n  const [conflictWarningsEnabled, setConflictWarningsEnabledState] = useState(true);\r\n  const [emailChangeOpen, setEmailChangeOpen] = useState(false);\r\n  const [emailChangeSubmitting, setEmailChangeSubmitting] = useState(false);\r\n  const [newEmail, setNewEmail] = useState('');\r\n  const [currentPassword, setCurrentPassword] = useState('');\r\n  const [passwordResetSubmitting, setPasswordResetSubmitting] = useState(false);\r\n  const [passwordAuthAvailable, setPasswordAuthAvailable] = useState(false);\r\n  const [setupPasswordOpen, setSetupPasswordOpen] = useState(false);\r\n  const [setupPasswordSubmitting, setSetupPasswordSubmitting] = useState(false);\r\n  const [setupPassword, setSetupPassword] = useState('');\r\n  const [setupPasswordConfirm, setSetupPasswordConfirm] = useState('');\r\n  const [browserNotificationsEnabled, setBrowserNotificationsEnabledState] = useState(true);\n  const [liveNotificationsEnabled, setLiveNotificationsEnabled] = useState(true);\n  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');\n  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(true);\n  const [defaultReminderMinutes, setDefaultReminderMinutes] = useState('30');\n  const [defaultSnoozeMinutes, setDefaultSnoozeMinutes] = useState('15');\n  const [dailyDigestHour, setDailyDigestHour] = useState('7');\r\n  const [dailyDigestTimezone, setDailyDigestTimezone] = useState('Europe/Warsaw');\r\n  const [dailyDigestRecipientEmail, setDailyDigestRecipientEmail] = useState('');\r\n  const [googleCalendarStatus, setGoogleCalendarStatus] = useState<GoogleCalendarStatusState | null>(null);\r\n  const [checkingGoogleCalendar, setCheckingGoogleCalendar] = useState(false);\r\n  const [connectingGoogleCalendar, setConnectingGoogleCalendar] = useState(false);\r\n  const [disconnectingGoogleCalendar, setDisconnectingGoogleCalendar] = useState(false);\r\n  const [syncingGoogleCalendarOutbound, setSyncingGoogleCalendarOutbound] = useState(false);\r\n  const [googleCalendarOutboundResult, setGoogleCalendarOutboundResult] = useState<GoogleCalendarOutboundResultState | null>(null);\r\n  const [googleCalendarReminderMethod, setGoogleCalendarReminderMethod] = useState(() => getGoogleCalendarReminderPreference().method);\r\n  const [googleCalendarReminderMinutes, setGoogleCalendarReminderMinutes] = useState(() => String(getGoogleCalendarReminderPreference().minutesBefore));\r\n\r\nuseEffect(() => {\r\n    setProfile({\r\n      fullName: workspaceProfile?.fullName || auth.currentUser?.displayName || '',\r\n      companyName: workspaceProfile?.companyName || '',\r\n    });\r\n    setConflictWarningsEnabledState(\r\n      typeof workspaceProfile?.planningConflictWarningsEnabled === 'boolean'\r\n        ? workspaceProfile.planningConflictWarningsEnabled\r\n        : getConflictWarningsEnabled(),\r\n    );\r\n    setBrowserNotificationsEnabledState(\r\n      typeof workspaceProfile?.browserNotificationsEnabled === 'boolean'\r\n        ? workspaceProfile.browserNotificationsEnabled\r\n        : getBrowserNotificationsEnabled(),\r\n    );\r\n    setBrowserPermission(getBrowserNotificationPermission());\n    const reminderSettings = getReminderSettings();\n    setLiveNotificationsEnabled(reminderSettings.liveNotificationsEnabled);\n    setDefaultReminderMinutes(String(reminderSettings.defaultReminderMinutes));\n    setDefaultSnoozeMinutes(String(reminderSettings.defaultSnoozeMinutes));\n    setDailyDigestEnabled(typeof workspace?.dailyDigestEnabled === 'boolean' ? workspace.dailyDigestEnabled : true);\n    setDailyDigestHour(String(workspace?.dailyDigestHour ?? 7));\r\n    setDailyDigestTimezone(workspace?.dailyDigestTimezone || workspace?.timezone || 'Europe/Warsaw');\r\n    setDailyDigestRecipientEmail(workspace?.dailyDigestRecipientEmail || workspaceProfile?.email || auth.currentUser?.email || '');\r\n  }, [workspace, workspaceProfile]);\r\n\r\n  useEffect(() => {\r\n    if (!auth.currentUser) return;\r\n\r\n    const fetchAuthMethods = async () => {\r\n      let canUsePassword = auth.currentUser?.providerData?.some((item) => item.providerId === 'password') ?? false;\r\n\r\n      if (auth.currentUser?.email) {\r\n        try {\r\n   "... 51242 more characters,
    expected: /digestUiVisibleByPlan\s*=\s*DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan/,
    operator: 'match',
    diff: 'simple'
  }
```

### 20. node --test tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs

- Command: `node --test tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_faza5-etap51-ai-read-vs-draft-intent.test.cjs.log`

```text
✖ Faza 5 Etap 5.1 AI intent contract exposes read/write separation (1.4311ms)
✖ Faza 5 Etap 5.1 fixtures lock read/search/write examples (0.4992ms)
✔ Faza 5 Etap 5.1 scripts and docs are wired (1.5613ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
---
ℹ todo 0
ℹ duration_ms 69.8061

✖ failing tests:
test at tests\faza5-etap51-ai-read-vs-draft-intent.test.cjs:12:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /READ_ONLY_INTENTS/. Input:
  
  "﻿export type AssistantIntent = 'read' | 'draft' | 'unknown';\n" +
    '\n' +
    'const WRITE_RE = /\\b(zapisz|dodaj|utw[oó]rz|stw[oó]rz|za[lł][oó][zż]|wpisz|przygotuj\\s+szkic|mam\\s+leada)\\b/i;\n' +
    'const READ_RE = /\\b(co|czy|kiedy|na\\s+kiedy|znajd[zź]|poka[zż]|wyszukaj|mam|najbli[zż]szy|najbli[zż]sza|gdzie|ile)\\b/i;\n' +
    'export function detectAssistantIntent(query: string): AssistantIntent {\n' +
    "  const text = String(query || '').trim();\n" +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "﻿export type AssistantIntent = 'read' | 'draft' | 'unknown';\n\nconst WRITE_RE = /\\b(zapisz|dodaj|utw[oó]rz|stw[oó]rz|za[lł][oó][zż]|wpisz|przygotuj\\s+szkic|mam\\s+leada)\\b/i;\nconst READ_RE = /\\b(co|czy|kiedy|na\\s+kiedy|znajd[zź]|poka[zż]|wyszukaj|mam|najbli[zż]szy|najbli[zż]sza|gdzie|ile)\\b/i;\n\nexport function detectAssistantIntent(query: string): AssistantIntent {\n  const text = String(query || '').trim();\n  if (!text) return 'unknown';\n  if (WRITE_RE.test(text)) return 'draft';\n  if (READ_RE.test(text) || text.endsWith('?')) return 'read';\n  return 'read';\n}\n\nexport function isWriteIntent(query: string) {\n  return detectAssistantIntent(query) === 'draft';\n}\r\n",
    expected: /READ_ONLY_INTENTS/,
    operator: 'match',
    diff: 'simple'
  }
test at tests\faza5-etap51-ai-read-vs-draft-intent.test.cjs:22:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /Co mam jutro\?/. Input:
    expected: /Co mam jutro\?/,
```

### 21. node --test tests/request-identity-vercel-api-signature.test.cjs

- Command: `node --test tests/request-identity-vercel-api-signature.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_request-identity-vercel-api-signature.test.cjs.log`

```text
✖ request identity helper supports existing API call sites used by Vercel typecheck (1.8755ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 77.92
---

✖ failing tests:
test at tests\request-identity-vercel-api-signature.test.cjs:12:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /const body = bodyInput && typeof bodyInput === 'object' \? bodyInput : parseBody\(req\)/. Input:
  
  "import { selectFirstAvailable } from './_supabase.js';\r\n" +
    "import { RequestAuthError, requireSupabaseRequestContext } from './_supabase-auth.js';\r\n" +
    '/* A13_STATIC_CONTRACT_GUARD requireSupabaseRequestContext */\r\n' +
    '\r\n' +
    'export type RequestIdentity = {\r\n' +
    '  userId: string | null;\r\n' +
    '  uid: string | null;\r\n' +
    '\n' +
    '// ADMIN_AI_PROFILE_ROLE_GATE_2026_05_03\n' +
    '// Admin-only calls must be based on verified Supabase context, not spoofable x-user-email headers.\n' +
    'export async function requireAdminAuthContext(req: any, bodyInput?: any) {\n' +
    '  const headerIdentity = await requireRequestIdentity(req, bodyInput);\n' +
    '  try {\n' +
    '    const context = await requireSupabaseRequestContext(req);\n' +
    '    const identity: RequestIdentity = {\n' +
    '      userId: asText(context.userId) || headerIdentity.userId || null,\n' +
    '      uid: asText(context.userId) || headerIdentity.uid || null,\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "import { selectFirstAvailable } from './_supabase.js';\r\nimport { RequestAuthError, requireSupabaseRequestContext } from './_supabase-auth.js';\r\n/* A13_STATIC_CONTRACT_GUARD requireSupabaseRequestContext */\r\n\r\nexport type RequestIdentity = {\r\n  userId: string | null;\r\n  uid: string | null;\r\n  email: string | null;\r\n  fullName: string | null;\r\n  workspaceId: string | null;\r\n};\r\n\r\nexport function asText(value: unknown) {\r\n  if (typeof value === 'string') return value.trim();\r\n  if (value === null || value === undefined) return '';\r\n  return String(value).trim();\r\n}\r\n\r\nfunction parseBody(req: any) {\r\n  if (!req?.body) return {};\r\n  if (typeof req.body === 'string') {\r\n    try { return JSON.parse(req.body || '{}'); } catch { return {}; }\r\n  }\r\n  return req.body && typeof req.body === 'object' ? req.body : {};\r\n}\r\n\r\nfunction requestHeader(req: any, name: string) {\r\n  const headers = req?.headers || {};\r\n  const lower = name.toLowerCase();\r\n  const direct = headers[name] ?? headers[lower] ?? headers[name.toUpperCase()];\r\n  if (Array.isArray(direct)) return asText(direct[0]);\r\n  return asText(direct);\r\n}\r\n\r\nfunction firstQueryValue(value: unknown) {\r\n  if (Array.isArray(value)) return asText(value[0]);\r\n  return asText(value);\r\n}\r\n\r\nexport function getRequestIdentity(req: any, bodyInput?: any): RequestIdentity {\r\n  /* REQUEST_SCOPE_LEGACY_UNDERSCORE_PARAM_MARKER getRequestIdentity(_req */  void req;\r\n  void bodyInput;\r\n  /*\n  REQUEST_SCOPE_LEGACY_IDENTITY_SHAPE_STATIC_GUARD_STAGE45A_V14\n  Static compatibility only. Do not trust frontend identity headers/body/query here.\n  userId: userId || null\n  uid: userId || null\n  email: email || null\n  fullName: fullName || null\n  workspaceId: workspaceId || null\n  */// A22_SUPABASE_AUTH_RLS_WORKSPACE_FRONTEND_IDENTITY_LOCK\n  // Frontend identity headers/body/query are not trusted as authentication.\n  // Compatibility text for legacy static guard: return { userId: null, email: null, fullName: null, workspaceId: null }\n  return {\n    userId: null,\n    uid: null,\n    email: null,\n    fullName: null,\n    workspaceId: null,\n  };\n}\r\n\r\nexport async function requireRequestIdentity(req: any, bodyInput?: any): Promise<RequestIdentity> {\n  const headerIdentity = getRequestIdentity(req, bodyInput);\n  if (headerIdentity.userId || headerIdentity.email) return headerIdentity;\n\r\n  try {\r\n    const context = await requireSupabaseRequestContext(req);\r\n    const identity: RequestIdentity = {\n      userId: asText(context.userId) || null,\n      uid: asText(context.userId) || null,\n      email: asText(context.email) || null,\n      fullName: asText(context.fullName) || null,\n      workspaceId: asText(context.workspaceId) || null,\n    };\r\n    if (identity.userId || identity.email) return identity;\r\n  } catch (error) {\r\n    if (error instanceof RequestAuthError) throw error;\r\n  }\r\n\r\n  throw new RequestAuthError(401, 'REQUEST_IDENTITY_REQUIRED');\r\n}\r\n\r\nfunction envList(names: string[]) {\r\n  return names\r\n    .flatMap((name) => asText(process.env[name]).split(','))\r\n    .map((item) => item.trim().toLowerCase())\r\n    .filter(Boolean);\r\n}\r\n\r\nfunction profileHasAdminRole(row: Record<string, unknown> | null | undefined) {\n  if (!row) return false;\n  const role = asText((row as any).role || '').toLowerCase();\n  const appRole = asText((row as any).app_role || (row as any).appRole || '').toLowerCase();\n  return role === 'admin'\n    || role === 'owner'\n    || appRole === 'admin'\n    || appRole === 'owner'\n    || appRole === 'creator'\n    || appRole === 'app_owner'\n    || (row as any).is_admin === true\n    || (row as any).isAdmin === true\n    || (row as any).is_app_owner === true\n    || (row as any).isAppOwner === true;\n}\n\nfunction isLikelyUuid(value: unknown) {\n  return typeof value === 'string'\n    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);\n}\n\nasync function findAdminProfileForIdentity(identity: RequestIdentity) {\n  const queries: string[] = [];\n  const userId = asText(identity.userId || identity.uid || '');\n  const email = asText(identity.email || '').toLowerCase();\n\n  if (email) queries.push(`profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);\n  if (userId) {\n    queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n    queries.push(`profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n    queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n    if (isLikelyUuid(userId)) queries.push(`profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1`);\n  }\n\n  for (const query of queries) {\n    const rows = await selectRows(query);\n    const row = rows[0] || null;\n    if (profileHasAdminRole(row)) return row;\n  }\n\n  return null;\n}\n\n// ADMIN_AI_PROFILE_ROLE_GATE_2026_05_03\n// Admin-only calls must be based on verified Supabase context, not spoofable x-user-email headers.\nexport async function requireAdminAuthContext(req: any, bodyInput?: any) {\n  const headerIdentity = await requireRequestIdentity(req, bodyInput);\n\n  try {\n    const context = await requireSupabaseRequestContext(req);\n    const identity: RequestIdentity = {\n      userId: asText(context.userId) || headerIdentity.userId || null,\n      uid: asText(context.userId) || headerIdentity.uid || null,\n      email: asText(context.email) || headerIdentity.email || null,\n      fullName: asText(context.fullName) || headerIdentity.fullName || null,\n      workspaceId: asText(context.workspaceId) || headerIdentity.workspaceId || null,\n    };\n\n    const email = asText(identity.email).toLowerCase();\n    const adminEmails = envList(['CLOSEFLOW_ADMIN_EMAILS', 'CLOSEFLOW_ADMIN_EMAIL', 'APP_OWNER_EMAIL', 'ADMIN_EMAIL', 'VITE_APP_OWNER_EMAIL']);\n    if (adminEmails.length > 0 && email && adminEmails.includes(email)) return identity;\n\n    const appMeta = context.rawUser?.app_metadata && typeof context.rawUser.app_metadata === 'object'\n      ? context.rawUser.app_metadata as Record<string, unknown>\n      : {};\n    const role = asText(appMeta.role || appMeta.claims_role || '').toLowerCase();\n    const roles = Array.isArray(appMeta.roles) ? appMeta.roles.map((item) => asText(item).toLowerCase()) : [];\n    if (role === 'admin' || role === 'owner' || roles.includes('admin') || roles.includes('owner')) return identity;\n\n    const profileRow = await findAdminProfileForIdentity(identity);\n    if (profileRow) return identity;\n  } catch (error) {\n    if (error instanceof RequestAuthError && error.status !== 401) throw error;\n  }\n\n  throw new RequestAuthError(403, 'ADMIN_ROLE_REQUIRED');\n}\n\nasync function selectRows(query: string) {\r\n  try {\r\n    const result = await selectFirstAvailable([query]);\r\n    return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];\r\n  } catch {\r\n    return [];\r\n  }\r\n}\r\n\r\nfunction identityMatches(value: unknown, identity: RequestIdentity) {\r\n  const normalized = asText(value).toLowerCase();\r\n  if (!normalized) return false;\r\n  return normalized === asText(identity.userId).toLowerCase()\r\n    || normalized === asText(identity.uid).toLowerCase()\r\n    || normalized === asText(identity.email).toLowerCase();\r\n}\r\n\r\n\n// WORKSPACE_OWNER_REQUIRED compatibility marker for legacy P0 workspace scope guard.\n// Current runtime error remains WORKSPACE_OWNER_OR_ADMIN_REQUIRED because the helper allows verified owner/member/admin access.\nexport async function assertWorkspaceOwnerOrAdmin(workspaceId: string, req?: any) {\r\n  const normalizedWorkspaceId = asText(workspaceId);\r\n  if (!normalizedWorkspaceId) throw new RequestAuthError(401, 'WORKSPACE_CONTEXT_REQUIRED');\r\n  const identity = await requireRequestIdentity(req || {});\r\n\r\n  if (identity.workspaceId && identity.workspaceId === normalizedWorkspaceId) return true;\r\n\r\n  const workspaceRows = await selectRows(`workspaces?select=*&id=eq.${encodeURIComponent(normalizedWorkspaceId)}&limit=1`);\r\n  const workspace = workspaceRows[0] || null;\r\n  if (workspace) {\r\n    const ownerCandidates = [\r\n      workspace.owner_user_id,\r\n      workspace.owner_id,\r\n      workspace.created_by_user_id,\r\n      workspace.user_id,\r\n      workspace.email,\r\n      workspace.owner_email,\r\n    ];\r\n    if (ownerCandidates.some((candidate) => identityMatches(candidate, identity))) return true;\r\n  }\r\n\r\n  if (identity.userId) {\r\n    const membershipRows = await selectRows(\r\n      `workspace_members?user_id=eq.${encodeURIComponent(identity.userId)}&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&select=*&limit=1`,\r\n    );\r\n    if (membershipRows[0]) return true;\r\n  }\r\n\r\n  if (identity.email) {\r\n    const profileRows = await selectRows(\r\n      `profiles?select=*&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&email=eq.${encodeURIComponent(identity.email)}&limit=1`,\r\n    );\r\n    if (profileRows[0]) return true;\r\n  }\r\n\r\n  // STAGE15_NO_AUTH_ONLY_WORKSPACE_FALLBACK: authenticated user alone is not enough for another workspace.\nthrow new RequestAuthError(403, 'WORKSPACE_OWNER_OR_ADMIN_REQUIRED');\r\n}\r\n\r\nexport async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {\n  void bodyInput;\n  // STAGE15_NO_BODY_WORKSPACE_TRUST\n  // Request body/query workspace values are ignored. Header workspace is only a disambiguating hint checked against membership/profile.\n  const hintedWorkspaceId = asText(\n    requestHeader(req, 'x-workspace-id')\n    || requestHeader(req, 'x-closeflow-workspace-id'),\n  );\n\n  const context = await requireSupabaseRequestContext(req);\n  const contextWorkspaceId = asText(context.workspaceId);\n  if (contextWorkspaceId) return contextWorkspaceId;\n\n  const contextUserId = asText(context.userId);\n  const contextEmail = asText(context.email).toLowerCase();\n  if (!contextUserId && !contextEmail) {\n    throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');\n  }\n\n  if (hintedWorkspaceId) {\n    if (contextUserId) {\n      const membershipRows = await selectRows(\n        'workspace_members?user_id=eq.' + encodeURIComponent(contextUserId)\n   "... 4107 more characters,
    expected: /const body = bodyInput && typeof bodyInput === 'object' \? body
```

### 22. node --test tests/stage35-ai-assistant-compact-ui.test.cjs

- Command: `node --test tests/stage35-ai-assistant-compact-ui.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_stage35-ai-assistant-compact-ui.test.cjs.log`

```text
✖ Stage35 keeps AI assistant panel compact and useful (1.3419ms)
✔ Stage35 removes noisy assistant helper copy and old examples (0.3584ms)
✖ Stage35 keeps direct-write logic intact (0.3205ms)
✔ Stage35 compact AI assistant test is included in quiet release gate (0.23ms)
ℹ tests 4
ℹ suites 0
ℹ pass 2
ℹ fail 2
ℹ cancelled 0
---
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 78.2484

✖ failing tests:
test at tests\stage35-ai-assistant-compact-ui.test.cjs:20:1
  AssertionError [ERR_ASSERTION]: stage marker: missing STAGE35_AI_ASSISTANT_COMPACT_UI
      at assertIncludes (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\stage35-ai-assistant-compact-ui.test.cjs:13:10)
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\stage35-ai-assistant-compact-ui.test.cjs:23:3)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
test at tests\stage35-ai-assistant-compact-ui.test.cjs:48:1
  AssertionError [ERR_ASSERTION]: direct write parser: missing parseAiDirectWriteCommand(command)
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\stage35-ai-assistant-compact-ui.test.cjs:51:3)
      at Test.processPendingSubtests (node:internal/test_runner/test:787:18)
      at Test.postRun (node:internal/test_runner/test:1247:19)
      at Test.run (node:internal/test_runner/test:1175:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:787:7) {
```

### 23. node --test tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs

- Command: `node --test tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs`
- Exit: `1`
- Duration: `0.2s`
- Full log: `test-results/stage16l-failed-details/tests_stage35c-ai-autospeech-compact-contract-fix.test.cjs.log`

```text
✖ Stage35c repairs autospeech test contract after compact assistant UI (5.1247ms)
✔ Stage35c test is included in release gates (0.5305ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
---
ℹ duration_ms 76.9847

✖ failing tests:
test at tests\stage35c-ai-autospeech-compact-contract-fix.test.cjs:12:1
  AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
  
    assert.ok(assistant.includes('Dodaj leada: Pan Marek, 516 439 989, Facebook'))
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\stage35c-ai-autospeech-compact-contract-fix.test.cjs:19:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
```

### 24. node --test tests/stage94-ai-layer-separation-copy.test.cjs

- Command: `node --test tests/stage94-ai-layer-separation-copy.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_stage94-ai-layer-separation-copy.test.cjs.log`

```text
✖ Etap 9 keeps layered AI copy without promising full external AI by default (2.4456ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 65.6714
---

✖ failing tests:
test at tests\stage94-ai-layer-separation-copy.test.cjs:12:1
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /scope: 'assistant_read_or_draft_only'/. Input:
  
  '// STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1\n' +
    '// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1\n' +
    '// STAGE3_AI_APPLICATION_BRAIN_V1\n' +
    '// AI_DRAFT_CONFIRM_BRIDGE_STAGE4\n' +
    '// Assistant UI. It calls /api/assistant/query through one client and exposes smoke prompts for manual QA.\n' +
    '\n' +
    'import React, { useMemo, useState } from "react";\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '// STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1\n// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1\n// STAGE3_AI_APPLICATION_BRAIN_V1\n// AI_DRAFT_CONFIRM_BRIDGE_STAGE4\n// Assistant UI. It calls /api/assistant/query through one client and exposes smoke prompts for manual QA.\n\nimport React, { useMemo, useState } from "react";\nimport { askAssistantQueryApi, type AssistantQueryClientResult } from "../lib/assistant-query-client";\nimport { assistantDraftToAiLeadDraftInput } from "../lib/ai-draft-assistant-bridge";\nimport { saveAiLeadDraftAsync } from "../lib/ai-drafts";\n\ntype TodayAiAssistantProps = {\n  leads?: unknown[];\n  clients?: unknown[];\n  cases?: unknown[];\n  tasks?: unknown[];\n  events?: unknown[];\n  activities?: unknown[];\n  drafts?: unknown[];\n  compact?: boolean;\n};\n\ntype AssistantResult = AssistantQueryClientResult;\n\nexport const STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1 = true;\n\nconst QUICK_ASSISTANT_SMOKE_PROMPTS = [\n  "Co mam jutro?",\n  "Czy jutro o 17 coś mam?",\n  "Czy w przeciągu 4 godzin mam spotkanie?",\n  "Na kiedy mam najbliższy akt notarialny?",\n  "Znajdź numer do Marka.",\n  "Zapisz zadanie jutro 12 rozgraniczenie.",\n];\n\nfunction getAssistantModeLabel(mode: AssistantResult["mode"], result: AssistantResult | null) {\n  if (mode === "draft") return "Szkic do sprawdzenia";\n  if (mode === "read" && result?.meta?.noData) return "Brak danych w aplikacji";\n  if (mode === "read") return "Odczyt z danych aplikacji";\n  return "Nieznany tryb";\n}\n\nfunction countSnapshotItems(snapshot: Record<string, unknown[]>) {\n  return Object.values(snapshot).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);\n}\n\nexport default function TodayAiAssistant(props: TodayAiAssistantProps) {\n  const [query, setQuery] = useState("");\n  const [loading, setLoading] = useState(false);\n  const [result, setResult] = useState<AssistantResult | null>(null);\n  const [error, setError] = useState<string | null>(null);\n\n  const snapshot = useMemo(\n    () => ({\n      leads: props.leads || [],\n      clients: props.clients || [],\n      cases: props.cases || [],\n      tasks: props.tasks || [],\n      events: props.events || [],\n      activities: props.activities || [],\n      drafts: props.drafts || [],\n    }),\n    [props.leads, props.clients, props.cases, props.tasks, props.events, props.activities, props.drafts],\n  );\n\n  const snapshotItemsCount = useMemo(() => countSnapshotItems(snapshot), [snapshot]);\n  const snapshotPayload = snapshotItemsCount > 0 ? snapshot : undefined;\n\n  async function askAssistant(nextQuery?: string) {\n    const text = (nextQuery ?? query).trim();\n    if (nextQuery !== undefined) setQuery(text);\n    if (!text) {\n      setError("Wpisz pytanie albo komendę.");\n      return;\n    }\n    setLoading(true);\n    setError(null);\n    try {\n      const data = await askAssistantQueryApi({ query: text, timezone: "Europe/Warsaw", snapshot: snapshotPayload });\n\n      if (data.mode === "draft" && data.draft) {\n        const bridgeInput = assistantDraftToAiLeadDraftInput(data.draft);\n        await saveAiLeadDraftAsync(bridgeInput);\n        window.dispatchEvent(new CustomEvent("closeflow:ai-draft-created", { detail: bridgeInput }));\n      }\n\n      setResult(data);\n    } catch (err) {\n      setError(err instanceof Error ? err.message : "Nie udało się zapytać asystenta.");\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <section\n      className="ai-assistant-card"\n      data-stage="STAGE3_AI_APPLICATION_BRAIN_V1"\n      data-stage4="AI_DRAFT_CONFIRM_BRIDGE_STAGE4"\n      data-stage8="STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1"\n      data-stage9="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1"\n    >\n      <div className="ai-assistant-card__header">\n        <div>\n          <strong>Asystent AI</strong>\n          <p>Czyta dane aplikacji. Komendy zapisu tworzą tylko szkice do sprawdzenia.</p>\n          <small data-assistant-snapshot-count={snapshotItemsCount}>Kontekst aplikacji: {snapshotItemsCount} rekordów.</small>\n        </div>\n      </div>\n\n      <div className="ai-assistant-card__smoke" data-assistant-smoke-prompts="STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1">\n        {QUICK_ASSISTANT_SMOKE_PROMPTS.map((prompt) => (\n          <button\n            key={prompt}\n            type="button"\n            data-assistant-smoke-prompt={prompt}\n            onClick={() => void askAssistant(prompt)}\n            disabled={loading}\n          >\n            {prompt}\n          </button>\n        ))}\n      </div>\n\n      <div className="ai-assistant-card__inputRow">\n        <input\n          value={query}\n          onChange={(event) => setQuery(event.target.value)}\n          onKeyDown={(event) => {\n            if (event.key === "Enter" && !event.shiftKey) void askAssistant();\n          }}\n          placeholder="Np. Co mam jutro? / Znajdź numer do Marka / Zapisz zadanie jutro 12 rozgraniczenie"\n          aria-label="Pytanie do asystenta AI"\n        />\n        <button type="button" onClick={() => void askAssistant()} disabled={loading}>\n          {loading ? "Sprawdzam..." : "Zapytaj"}\n        </button>\n      </div>\n      {error ? <p className="ai-assistant-card__error">{error}</p> : null}\n      {result ? (\n        <div className="ai-assistant-card__answer" data-assistant-result-mode={result.mode}>\n          <p>{result.answer}</p>\n          <small data-assistant-mode={result.mode}>{getAssistantModeLabel(result.mode, result)}</small>\n          {result.meta?.dataPolicy === "app_data_only" ? (\n            <small data-assistant-data-policy="app_data_only">Odpowiedź tylko z danych aplikacji.</small>\n          ) : null}\n          {result.meta?.noData ? (\n            <small data-assistant-no-data="true">Brak danych aplikacji do sprawdzenia.</small>\n          ) : null}\n          {result.mode === "draft" ? <strong>Szkic zapisany do sprawdzenia. Finalny rekord nie został utworzony.</strong> : null}\n          {Array.isArray(result.items) && result.items.length ? (\n            <ul>\n              {result.items.slice(0, 5).map((item) => (\n                <li key={`${item.kind}-${item.id}`}>\n                  <span>{item.title}</span>\n                  {item.phone ? <small>tel. {item.phone}</small> : null}\n                  {item.email ? <small>{item.email}</small> : null}\n                  {item.startAt || item.scheduledAt ? <small>{item.startAt || item.scheduledAt}</small> : null}\n                </li>\n              ))}\n            </ul>\n          ) : null}\n        </div>\n      ) : null}\n    </section>\n  );\n}\n\nexport { TodayAiAssistant };\n',
    expected: /scope: 'assistant_read_or_draft_only'/,
    operator: 'match',
    diff: 'simple'
  }
```

### 25. node --test tests/ui-completed-label-consistency.test.cjs

- Command: `node --test tests/ui-completed-label-consistency.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ui-completed-label-consistency.test.cjs.log`

```text
✖ completed action/status wording is consistent in main UI screens (1.9199ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 75.384
---

✖ failing tests:
test at tests\ui-completed-label-consistency.test.cjs:20:1
  AssertionError [ERR_ASSERTION]: src/pages/Today.tsx must use zrobione instead of zakończ copy
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\ui-completed-label-consistency.test.cjs:24:12)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: `﻿/*\nFAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY\nA13_TODAY_SOURCE_GUARD_MARKERS_FOR_EXISTING_TESTS\nTODAY_AI_DRAFTS_TILE_STAGE29\nTODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM\ndata-today-ai-drafts-tile="true"\ndata-today-ai-drafts-compact-tile="true"\nSzkice do zatwierdzenia\ndata-today-ai-drafts-pending-count="true"\nopenTodayTopTileShortcut('ai_drafts')\nOtwórz Szkice AI\nfunction getPendingTodayAiDrafts\ndraft.status === 'draft'\nString(draft.rawText || '').trim()\ngetAiLeadDraftsAsync()\nsetTodayAiDrafts(Array.isArray(drafts) ? drafts : [])\nif (target === 'ai_drafts') {\nwindow.location.assign('/ai-drafts')\nif (target === 'ai_drafts') return 'today-section-ai-drafts';\nif (target === 'ai_drafts') return 'szkice-ai';\ndata-today-tile-card="true"\naria-expanded={!collapsed}\nTODAY_FUNNEL_DEDUP_VALUE_STAGE11\nfunction buildTodayDedupedFunnelSummary\ntodayPipelineClientAmount\ntodayPipelineBuildPersonKey\nMath.max(existing.amount, amount)\n<TodayFunnelDedupValueCard leads={leads} clients={clients} />\n*/\n// TODAY_GLOBAL_QUICK_ACTIONS_DEDUPED_V97\n// STAGE30A_TODAY_GUARD_COMPAT: marker only. Global actions stay in Layout, not rendered locally in Today.\n// VISUAL_STAGE17_TODAY_HTML_HARD_1TO1\n/*\nAI_DRAFTS_IN_TODAY_STAGE04\nSzkice AI w Dziś są tylko do przeglądu i przejścia do centrum szkiców.\nFinalny zapis rekordu nie dzieje się z poziomu Dziś.\n*/\n\n/*\nTODAY_AI_DRAFTS_TILE_STAGE29\nTODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM\nDziś pokazuje mały dolny kafelek Szkice z liczbą niezatwierdzonych szkiców AI. Bez dużej sekcji i bez ingerencji w zwijane listy.\n*/\n\nimport { useState, useEffect, FormEvent, ReactNode, useMemo, useRef } from 'react';\nimport { useWorkspace } from '../hooks/useWorkspace';\nimport { useSupabaseSession } from '../hooks/useSupabaseSession';\nimport Layout from '../components/Layout';\nimport { Card, CardContent } from '../components/ui/card';\nimport { Button } from '../components/ui/button';\nimport { Badge } from '../components/ui/badge';\nimport {\n  Plus,\n  CheckSquare,\n  AlertTriangle,\n  ArrowRight,\n  TrendingUp,\n  Loader2,\n  Bell,\n  Repeat,\n  Clock,\n  ChevronDown,\n  ChevronUp,\n  ListTodo,\n  ShieldAlert,\n  Briefcase,\n} from 'lucide-react';\nimport {\n  format,\n  isPast,\n  addDays,\n  parseISO,\n  isToday,\n  differenceInCalendarDays,\n  startOfDay,\n  endOfDay,\n} from 'date-fns';\nimport { pl } from 'date-fns/locale';\nimport { Link } from 'react-router-dom';\nimport { toast } from 'sonner';\nimport {\n  Dialog,\n  DialogContent,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n  DialogFooter,\n} from '../components/ui/dialog';\nimport { Input } from '../components/ui/input';\nimport { Label } from '../components/ui/label';\nimport { TopicContactPicker } from '../components/topic-contact-picker';\nimport {\n  buildStartEndPair,\n  combineScheduleEntries,\n  createDefaultRecurrence,\n  createDefaultReminder,\n  getTaskDate,\n  getTaskStartAt,\n  toReminderAtIso,\n  toDateTimeLocalValue,\n} from '../lib/scheduling';\nimport {\n  EVENT_TYPES,\n  PRIORITY_OPTIONS,\n  RECURRENCE_OPTIONS,\n  REMINDER_OFFSET_OPTIONS,\n  REMINDER_MODE_OPTIONS,\n  SOURCE_OPTIONS,\n  TASK_TYPES,\n} from '../lib/options';\nimport { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';\nimport { isActiveSalesLead, isLeadMovedToService, isWaitingTooLong } from '../lib/lead-health';\nimport { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';\nimport { buildTopicContactOptions, findTopicContactOption, resolveTopicContactLink, type TopicContactOption } from '../lib/topic-contact';\nimport { requireWorkspaceId } from '../lib/workspace-context';\nimport {\n  deleteEventFromSupabase,\n  deleteTaskFromSupabase,\n  fetchClientsFromSupabase,\n  fetchLeadsFromSupabase,\n  insertEventToSupabase,\n  insertActivityToSupabase,\n  insertLeadToSupabase,\n  insertTaskToSupabase,\n  updateEventInSupabase,\n  updateLeadInSupabase,\n  updateTaskInSupabase,\n} from '../lib/supabase-fallback';\n\nimport { getTodayEntryPriorityReasons } from '../lib/today-v1-final';\nimport { getAiLeadDraftsAsync, type AiLeadDraft } from '../lib/ai-drafts';\nimport { installTodayStage30VisualCleanup } from '../lib/stage30-today-cleanup';\nimport { installTodayStage31TilesInteraction } from '../lib/stage31-today-tiles-interaction';\nimport { installTodayStage32RelationsLoadingPolish } from '../lib/stage32-today-relations-loading-polish';\nimport { normalizeWorkItem } from '../lib/work-items/normalize';\nimport { getNearestPlannedAction } from '../lib/nearest-action';\nimport { buildTodaySections, dedupeTodaySectionEntries } from '../lib/today-sections';\n\nimport '../styles/today-collapsible-masonry.css';\n\nconst TODAY_TILE_STORAGE_KEY = 'closeflow:today:collapsed:v1';\nconst modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';\n\nconst TODAY_QUICK_SNOOZE_OPTIONS = [\n  {\n    key: '1h',\n    label: 'Za 1h',\n    description: 'Odłóż o godzinę.',\n    minutes: 60,\n    days: 0,\n  },\n  {\n    key: 'tomorrow',\n    label: 'Jutro',\n    description: 'Odłóż na jutro rano.',\n    minutes: 0,\n    days: 1,\n  },\n  {\n    key: '2d',\n    label: 'Za 2 dni',\n    description: 'Odłóż o dwa dni.',\n    minutes: 0,\n    days: 2,\n  },\n  {\n    key: 'next_week',\n    label: 'Przyszły tydzień',\n    description: 'Odłóż na przyszły tydzień.',\n    minutes: 0,\n    days: 7,\n  },\n] as const;\n\nfunction resolveTodaySnoozeAt(optionKey: string) {\n  const option = TODAY_QUICK_SNOOZE_OPTIONS.find((entry) => entry.key === optionKey);\n  const now = new Date();\n\n  if (!option) {\n    return now.toISOString();\n  }\n\n  if (option.minutes > 0) {\n    return new Date(now.getTime() + option.minutes * 60 * 1000).toISOString();\n  }\n\n  const target = addDays(now, option.days);\n  target.setHours(9, 0, 0, 0);\n  return target.toISOString();\n}\n\ntype TileCardProps = {\n  key?: string | number;\n  id: string;\n  title: string;\n  subtitle?: string;\n  collapsedMap: Record<string, boolean>;\n  onToggle: (id: string) => void;\n  children?: ReactNode;\n  className?: string;\n  titleClassName?: string;\n  subtitleClassName?: string;\n  headerRight?: ReactNode;\n  bodyClassName?: string;\n};\n\ntype LeadLinkCardProps = {\n  key?: string | number;\n  leadId: string;\n  title: string;\n  subtitle?: string;\n  helperText?: string;\n  className?: string;\n  subtitleClassName?: string;\n  badges?: ReactNode;\n  rightMeta?: ReactNode;\n};\n\n\nfunction shouldOpenWeeklyCalendarTile(id: string, title: string) {\n  const compact = [id, title].join(' ').toLowerCase();\n  return compact.includes('calendar')\n    || compact.includes('kalendarz')\n    || compact.includes('schedule')\n    || compact.includes('najbliższe dni')\n    || compact.includes('najblizsze dni');\n}\n\nfunction openWeeklyCalendarFromToday() {\n  try {\n    window.localStorage.setItem('closeflow:calendar:view:v1', 'week');\n  } catch {\n    // Ignore local storage errors.\n  }\n\n  window.location.assign('/calendar?view=week');\n}\n\n\nfunction shouldOpenWeeklyCalendarFromShortcutText(value: unknown) {\n  const compact = String(value || '')\n    .toLowerCase()\n    .replace(/\\s+/g, ' ')\n    .trim();\n\n  if (!compact) return false;\n\n  const hasCalendarWord =\n    compact.includes('kalendarz') ||\n    compact.includes('calendar') ||\n    compact.includes('termin') ||\n    compact.includes('wydarze') ||\n    compact.includes('najbliższe') ||\n    compact.includes('najblizsze');\n\n  const hasWeekOrDaysWord =\n    compact.includes('tydzień') ||\n    compact.includes('tydzien') ||\n    compact.includes('dni') ||\n    compact.includes('7 dni') ||\n    compact.includes('najbliższe') ||\n    compact.includes('najblizsze');\n\n  return hasCalendarWord && hasWeekOrDaysWord;\n}\n\nfunction findTodayCalendarShortcutElement(target: EventTarget | null) {\n  if (!(target instanceof HTMLElement)) return null;\n\n  const candidates = [\n    target.closest('[data-today-week-calendar-shortcut="true"]'),\n    target.closest('a'),\n    target.closest('button'),\n    target.closest('[role="button"]'),\n    target.closest('.rounded-2xl'),\n    target.closest('.rounded-xl'),\n    target.closest('.group'),\n  ].filter(Boolean) as HTMLElement[];\n\n  return candidates.find((element) => shouldOpenWeeklyCalendarFromShortcutText(element.textContent)) || null;\n}\n\n\ntype TodayTileShortcutTarget = 'urgent' | 'without_action' | 'without_movement' | 'blocked' | 'service_transition' | 'calendar' | 'ai_drafts';\n\nfunction resolveTodayTileShortcutTarget(value: unknown): TodayTileShortcutTarget | null {\n  const compact = String(value || '')\n    .toLowerCase()\n    .replace(/\\s+/g, ' ')\n    .replace(/_/g, ' ')\n    .trim();\n\n  if (!compact) return null;\n\n  if (compact === 'urgent' || compact === 'pilne') return 'urgent';\n  if (compact === 'without action' || compact === 'without actions' || compact === 'bez dzialan' || compact === 'bez zaplanowanej akcji') return 'without_action'; // Brak następnego kroku\n  if (compact === 'without movement' || compact === 'bez ruchu') return 'without_movement';\n  if (compact === 'blocked' || compact === 'zablokowane') return 'blocked';\n  if (compact === 'service transition' || compact === 'start i obsluga' || compact === 'start i obsługa') return 'service_transition';\n  if (compact === 'calendar' || compact === 'kalendarz') return 'calendar';\n  if (compact === 'ai drafts' || compact === 'ai draft' || compact === 'szkice' || compact === 'szkice ai' || compact === 'drafts') return 'ai_drafts';\n\n  if (\n    compact.includes('zablokowane')\n    || compact.includes('zablokowana')\n    || compact.includes('blok')\n    || compact.includes('zatrzymane')\n    || compact.includes('zatrzymana')\n    || compact.includes('sprawy stoj')\n    || compact.includes('sprawa stoi')\n  ) return 'blocked';\n\n  if (\n    compact.includes('start i obsługa')\n    || compact.includes('start i obsluga')\n    || compact.includes('obsługa aktywna')\n    || compact.includes('obsluga aktywna')\n    || compact.includes('gotowe do uruchomienia')\n  ) return 'service_transition';\n\n  if (\n    compact.includes('bez zaplanowanej akcji')\n`... 109449 more characters,
    expected: /zakończ/u,
    operator: 'doesNotMatch',
    diff: 'simple'
  }
```

### 26. node --test tests/ui-copy-and-billing-cleanup.test.cjs

- Command: `node --test tests/ui-copy-and-billing-cleanup.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16l-failed-details/tests_ui-copy-and-billing-cleanup.test.cjs.log`

```text
✔ requested helper copy is removed from target UI files (3.8112ms)
✖ Billing plan page does not expose technical payment diagnostics card (1.5371ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 72.4242
---

✖ failing tests:
test at tests\ui-copy-and-billing-cleanup.test.cjs:37:1
  AssertionError [ERR_ASSERTION]: The input was expected to not match the regular expression /dryRun:\s*true/. Input:
  
  "const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';\n" +
    'const STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [\n' +
    "  { name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },\n" +
    "  { name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' },\n" +
    '] as const;\n' +
    '\n' +
    '/*\n' +
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: "const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';\nconst STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [\n  { name: 'Google Calendar', basic: 'Nie', pro: 'Dostępne', ai: 'Dostępne' },\n  { name: 'Pełny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dostępne' },\n] as const;\n\n/*\nSTAGE16B_BILLING_TRUTH_COPY\nGoogle Calendar sync\nPełny asystent AI\nRaport tygodniowy\n*/\n\nconst BILLING_UI_STRIPE_BLIK_LABEL_GUARD = 'Stripe/BLIK';\nconst BILLING_UI_STRIPE_BLIK_COPY_GUARD = 'BLIK przez Stripe';\nconst BILLING_UI_STRIPE_BLIK_ERROR_UTF8_GUARD = 'Błąd uruchamiania płatności Stripe/BLIK';\nimport { useEffect, useMemo, useState } from 'react';\nimport { format, parseISO } from 'date-fns';\nimport { pl } from 'date-fns/locale';\nimport {\n  AlertTriangle,\n  ArrowRight,\n  BadgeCheck,\n  CalendarClock,\n  Check,\n  CreditCard,\n  Loader2,\n  LockKeyhole,\n  RefreshCw,\n  Shield,\n  Sparkles,\n} from 'lucide-react';\nimport { toast } from 'sonner';\n\nimport Layout from '../components/Layout';\nimport { Button } from '../components/ui/button';\nimport { useWorkspace } from '../hooks/useWorkspace';\nimport {\n  billingActionInSupabase,\n  fetchCasesFromSupabase,\n  fetchClientsFromSupabase,\n  fetchLeadsFromSupabase,\n  fetchPaymentsFromSupabase,\n  createBillingCheckoutSessionInSupabase,\n} from '../lib/supabase-fallback';\nimport '../styles/visual-stage16-billing-vnext.css';\n\ntype BillingPeriod = 'monthly' | 'yearly';\ntype BillingTab = 'plan' | 'settlements';\ntype CheckoutPlanKey = 'basic' | 'pro' | 'ai';\ntype PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';\n\nconst UI_TRUTH_BADGE_LABELS_STAGE14E = ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu'] as const;\n\nconst BILLING_VISUAL_REBUILD_STAGE16 = 'BILLING_VISUAL_REBUILD_STAGE16';\nconst BILLING_STRIPE_BLIK_CONTRACT = 'Stripe';\nconst BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J = 'paid plan appears only after Stripe webhook confirmation';\nconst BILLING_STRIPE_STAGE86_E2E_GATE = 'checkout → webhook → paid_active → access refresh → cancel/resume';\n\ntype PlanCard = {\n  id: string;\n  key: 'free' | 'basic' | 'pro' | 'ai';\n  checkoutKey?: CheckoutPlanKey;\n  name: string;\n  monthlyPrice: number;\n  yearlyPrice: number;\n  description: string;\n  badge?: string;\n  features: string[];\n  availabilityHint?: string;\n};\n\nconst BILLING_PLANS: PlanCard[] = [\n  {\n    id: 'free',\n    key: 'free',\n    name: 'Free',\n    monthlyPrice: 0,\n    yearlyPrice: 0,\n    description: 'Tryb demo i awaryjny po trialu, z limitami Free.',\n    features: [\n      'Podgląd podstawowego workflow',\n      'Dobry etap na pierwsze sprawdzenie aplikacji',\n      'Po zakończeniu triala dane zostają w systemie',\n    ],\n    availabilityHint: 'Dostęp przez trial albo tryb podglądu.',\n  },\n  {\n    id: 'closeflow_basic',\n    key: 'basic',\n    checkoutKey: 'basic',\n    name: 'Basic',\n    monthlyPrice: 19,\n    yearlyPrice: 190,\n    description: 'Najprostszy płatny start dla jednej osoby.',\n    features: [\n      'Leady, klienci i zadania',\n      'Dziś, kalendarz w aplikacji, digest po konfiguracji mail providera i powiadomienia',\n      'Lekki parser tekstu i szkice bez pełnego asystenta AI',\n    ],\n  },\n  {\n    id: 'closeflow_pro',\n    key: 'pro',\n    checkoutKey: 'pro',\n    name: 'Pro',\n    monthlyPrice: 39,\n    yearlyPrice: 390,\n    badge: 'Najlepszy wybór',\n    description: 'Pełny workflow lead -> klient -> sprawa -> rozliczenie.',\n    features: [\n      'Wszystko z Basic',\n      'Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth',\n      'Raport tygodniowy, import CSV i cykliczne przypomnienia po konfiguracji',\n      'Bez pełnego asystenta AI',\n    ],\n  },\n  {\n    id: 'closeflow_ai',\n    key: 'ai',\n    checkoutKey: 'ai',\n    name: 'AI',\n    monthlyPrice: 69,\n    yearlyPrice: 690,\n    badge: 'Beta',\n    description: 'Plan przygotowany pod dodatki AI i większy zakres automatyzacji.',\n    features: [\n      'Wszystko z Pro',\n      'Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)',\n      'AI lokalne/regułowe i szkice do ręcznego zatwierdzenia działają także bez zewnętrznego modelu',\n      'Limity AI: 30/dzień i 300/miesiąc',\n    ],\n    availabilityHint: 'Beta. Wymaga konfiguracji AI w Vercel. Nie obiecujemy funkcji, które nie są jeszcze realnie podpięte.',\n  },\n];\n\nconst ACCESS_COPY: Record<string, { label: string; headline: string; description: string; tone: 'green' | 'amber' | 'red' | 'slate'; cta: string }> = {\n  trial_active: {\n    label: 'Trial aktywny',\n    headline: 'Masz aktywny okres testowy',\n    description: 'Możesz sprawdzić główny workflow aplikacji przed wyborem płatnego planu.',\n    tone: 'amber',\n    cta: 'Przejdź do płatności',\n  },\n  trial_ending: {\n    label: 'Trial kończy się',\n    headline: 'Trial zaraz się skończy',\n    description: 'Dane zostają. Wybierz plan, żeby nie blokować dodawania nowych rekordów.',\n    tone: 'amber',\n    cta: 'Przejdź do płatności',\n  },\n  paid_active: {\n    label: 'Dostęp aktywny',\n    headline: 'Plan jest aktywny',\n    description: 'Masz aktywny dostęp do pracy w aplikacji.',\n    tone: 'green',\n    cta: 'Zarządzaj planem',\n  },\n  trial_expired: {\n    label: 'Trial wygasł',\n    headline: 'Trial się zakończył',\n    description: 'Twoje dane zostają. Aby dodawać nowe leady, zadania i wydarzenia, wybierz plan.',\n    tone: 'red',\n    cta: 'Wznów dostęp',\n  },\n  payment_failed: {\n    label: 'Płatność wymaga reakcji',\n    headline: 'Dostęp wymaga odnowienia',\n    description: 'Dane zostają, ale tworzenie nowych rzeczy może być zablokowane do czasu odnowienia planu.',\n    tone: 'red',\n    cta: 'Wznów dostęp',\n  },\n  canceled: {\n    label: 'Plan wyłączony',\n    headline: 'Plan jest nieaktywny',\n    description: 'Workspace jest w trybie bez aktywnej subskrypcji. Dane zostają dostępne do podglądu.',\n    tone: 'slate',\n    cta: 'Wznów dostęp',\n  },\n  inactive: {\n    label: 'Brak aktywnego dostępu',\n    headline: 'Dostęp nie jest aktywny',\n    description: 'Wybierz plan, żeby odblokować pracę na leadach, zadaniach i wydarzeniach.',\n    tone: 'slate',\n    cta: 'Przejdź do płatności',\n  },\n  free_active: {\n    label: 'Free aktywny',\n    headline: 'Masz aktywny tryb Free',\n    description: 'Tryb Free ma limity: 5 aktywnych leadów, 5 aktywnych zadań/wydarzeń, 3 szkice i brak AI.',\n    tone: 'slate',\n    cta: 'Przejdź do płatności',\n  },\n};\n\nconst LIMIT_ITEMS = [\n  { name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Poranny digest', basic: 'Wymaga konfiguracji', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n  { name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },\n  { name: 'Google Calendar', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n  { name: 'Asystent AI (provider + env)', basic: 'Niedostępne w Twoim planie', pro: 'Niedostępne w Twoim planie', ai: 'Beta' },\n  { name: 'Raport tygodniowy', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },\n];\nconst SETTLEMENT_STATUS_LABELS: Record<string, string> = {\n  awaiting_payment: 'Czeka na płatność',\n  partially_paid: 'Częściowo opłacone',\n  fully_paid: 'Opłacone',\n  commission_pending: 'Prowizja do rozliczenia',\n  paid: 'Zapłacone',\n  not_started: 'Nierozpoczęte',\n  refunded: 'Zwrot',\n  written_off: 'Spisane',\n};\n\nfunction getPlanPrice(plan: PlanCard, period: BillingPeriod) {\n  return period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;\n}\n\nfunction getPlanPeriodLabel(period: BillingPeriod) {\n  return period === 'yearly' ? '/rok' : '/30 dni';\n}\n\nfunction formatMoney(value: unknown) {\n  const amount = Number(value || 0);\n  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';\n}\n\nfunction safeDateLabel(value?: string | null) {\n  if (!value) return 'Nie ustawiono';\n  try {\n    return format(parseISO(value), 'd MMMM yyyy', { locale: pl });\n  } catch {\n    return 'Nie ustawiono';\n  }\n}\n\nfunction getAccessCopy(status?: string | null) {\n  return ACCESS_COPY[String(status || 'inactive')] || ACCESS_COPY.inactive;\n}\n\nfunction getDisplayPlanId(planId?: string | null, subscriptionStatus?: string | null) {\n  const normalized = String(planId || '');\n  if (['closeflow_basic', 'closeflow_basic_yearly', 'closeflow_pro', 'closeflow_pro_yearly', 'closeflow_business', 'closeflow_business_yearly'].includes(normalized)) {\n    return normalized;\n  }\n  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(normalized)) {\n    return 'closeflow_pro';\n  }\n  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';\n  return 'trial_21d';\n}\n\nfunction getCurrentPlanName(displayPlanId: string, isPaidActive: boolean, isTrialActive: boolean) {\n  if (isPaidActive) {\n    const plan = BILLING_PLANS.find((entry) => displayPlanId === entry.id || displayPlanId === `${entry.id}_yearly`);\n    return plan?.name || 'Pro';\n  }\n  if (isTrialActive) return 'Free / trial';\n  return 'Nie ustawiono';\n}\n\nfunction isPlanCurrent(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean) {\n  if (plan.key === 'free') return !isPaidActive && (isTrialActive || displayPlanId === 'free');\n  if (!isPaidActive) return false;\n  return displayPlanId === plan.id || displayPlanId === `${plan.id}_yearly`;\n}\n\nfunction getPlanAvailability(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean): PlanAvailability {\n  if (isPlanCurrent(displayPlanId, plan, isPaidActive, isTrialActive)) return 'current';\n  if (!plan.checkoutKey) return plan.key === 'free' ? 'disabled' : 'soon';\n  return 'available';\n}\n\nfunctio"... 22535 more characters,
    expected: /dryRun:\s*true/,
    operator: 'doesNotMatch',
    diff: 'simple'
  }
```


## Passed during detail run

- brak
