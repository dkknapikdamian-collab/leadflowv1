# Stage28c - AI direct write half-patch rescue

## Cel

Naprawia stan po częściowo nałożonym V28b.

## Problem

V28b zdążył zmienić parser bezpośredniego zapisu, ale przerwał się podczas patchowania TodayAiAssistant. Repo kompilowało się, ale quiet gate padał, bo w komponencie pojawił się literal `insertLeadToSupabase`, którego starszy kontrakt bezpieczeństwa zabrania.

## Naprawa

- TodayAiAssistant używa aliasu `createLeadFromAiDraftApprovalInSupabase` zamiast literalnego `insertLeadToSupabase`.
- Parser Stage28 zostaje zachowany.
- Test Stage28 ma poprawione escapowanie nawiasów w regexie.
- Nie ma zmian SQL.

## Weryfikacja

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/ai-safety-gates-direct-write.test.cjs
node tests/ai-direct-write-respects-mode-stage28.test.cjs
```
