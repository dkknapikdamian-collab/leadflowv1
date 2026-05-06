# STAGE16P - Final QA capture order + Windows-safe collector

Cel:
- naprawić ostatni znany statyczny kontrakt AI: local lead capture ma być widoczne przed remote model call,
- naprawić focused collector na Windows tak, aby build/verify/test-critical nie kończyły się pustym `exit=null`,
- nie robić commita ani pusha.

Zakres:
- `src/components/TodayAiAssistant.tsx`
- `scripts/collect-stage16p-focused-final-qa.cjs`
- `package.json`

Nie zmienia:
- danych,
- billing logiki,
- Google Calendar,
- realnego direct final lead write.
