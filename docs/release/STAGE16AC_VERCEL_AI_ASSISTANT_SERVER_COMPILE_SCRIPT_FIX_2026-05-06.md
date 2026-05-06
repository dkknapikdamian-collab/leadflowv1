# Stage16AB - Vercel AI assistant server compile repair

Zakres naprawy:

- naprawiono uszkodzony nagłówek i importy w src/server/ai-assistant.ts, które lokalny Vite build pomijał, ale Vercel TypeScript/serverless build widział jako błąd składni,
- przywrócono default export handlera aiAssistantHandler,
- utrzymano named export runAssistantQuery dla assistant-query-handler,
- zmieniono server-side importy assistant-context/ai-assistant/assistant-result-schema na jawne .js, zgodne z runtime Vercel ESM,
- nie zmieniono logiki produktu ani UI.

Weryfikacja paczki:

- npm run build
- node --test tests/ai-assistant-global-app-search.test.cjs
- node --test tests/ai-assistant-save-vs-search-rule.test.cjs
- node --test tests/ai-assistant-command-center.test.cjs
- npm run verify:closeflow:quiet
- npm run test:critical

NO_PRODUCT_LOGIC_CHANGE=True
VERCEL_SERVER_COMPILE_REPAIR=True
POWERSHELL_SCRIPT_ASCII_SAFE=True
