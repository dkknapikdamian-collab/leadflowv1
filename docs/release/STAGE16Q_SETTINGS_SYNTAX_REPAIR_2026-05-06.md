# Stage16Q - Settings syntax repair

Cel: naprawić build blocker `src/pages/Settings.tsx: Unexpected const` po Stage16M/O/P.

Zakres:
- normalizacja końców linii w `Settings.tsx`,
- czyste przepisanie bloku `settingsSummary` + plan/digest/google-calendar gates w scope komponentu,
- `digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan`,
- `DAILY_DIGEST_EMAIL_UI_VISIBLE = false`,
- brak zmian w billing, AI, workspace scope i danych.

Brak commita i brak pusha.
