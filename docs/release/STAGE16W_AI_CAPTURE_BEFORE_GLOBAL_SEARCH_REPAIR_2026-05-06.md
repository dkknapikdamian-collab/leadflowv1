# Stage16W - AI capture before global search fallback repair

Cel: domknąć ostatni czerwony kontrakt `tests/ai-assistant-save-vs-search-rule.test.cjs`.

Zakres:
- `src/server/ai-assistant.ts`
- zachować global app search jako finalny fallback,
- wymusić kolejność: capture/save intent przed global search fallback,
- nie dodawać finalnego direct-write bez zatwierdzenia.

Komendy po wdrożeniu:
- `npm.cmd run build`
- `node --test tests/ai-assistant-save-vs-search-rule.test.cjs`
- `node --test tests/ai-assistant-global-app-search.test.cjs`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run test:critical`

Bez commita i bez pusha.
