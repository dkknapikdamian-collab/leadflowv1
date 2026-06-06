# STAGE227A — Sales Funnel Movement View — local run

Data: 2026-06-06 15:35 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Tryb: LOCAL-ONLY, bez commit/push

## SCAN-FIRST EVIDENCE

### Przeczytane pliki repo
- AGENTS.md
- package.json
- src/App.tsx
- src/components/Layout.tsx
- src/lib/supabase-fallback.ts
- src/lib/owner-control/activity-truth.ts
- src/lib/owner-control/contact-cadence-grid.ts
- src/lib/owner-control/lost-lead-rescue.ts
- src/lib/work-items/planned-actions.ts
- src/lib/work-items/normalize.ts
- src/lib/nearest-action.ts
- src/lib/finance/case-finance-source.ts
- tests/stage226-lost-lead-rescue.test.cjs
- scripts/closeflow-release-check-quiet.cjs
- _project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md

### Przeczytane pliki _project
- _project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md
- scripts/closeflow-release-check-quiet.cjs jako release gate kontekst

### Przeczytane pliki Obsidiana
- DO_POTWIERDZENIA lokalnie przez Damiana / AI z dostępem do vaulta.

### Brakujące ścieżki / ograniczenia środowiska
- Brak bezpośredniego dostępu do lokalnego vaulta Obsidiana z poziomu tego środowiska.
- Brak możliwości sklonowania repo w kontenerze przez DNS: `Could not resolve host: github.com`.
- Patch przygotowano na podstawie odczytu plików przez connector GitHub i wgrywanej instrukcji etapu.

### Źródła prawdy
- Repo projektu: kod, testy, guardy, _project.
- Obsidian: dashboard i pamięć operacyjna projektu.
- Roadmapa owner-control: A46 Sales Funnel Movement View.

### Czego nie znaleziono / nie ruszano
- Nie znaleziono istniejącego widoku /funnel.
- Nie ruszano Supabase schema, RLS, Google Calendar timezone, AI Drafts, Owner Digest, Weekly Report.

## Zakres patcha

- Dodano read-only widok `/funnel`.
- Dodano helper `buildSalesFunnelMovementView`.
- Dodano guard Stage227A.
- Dodano runtime test Stage227A.
- Podpięto route i menu Lejek.
- Dodano wpisy do pamięci projektu i manifest Obsidiana.

## Testy do uruchomienia lokalnie

```powershell
node scripts/check-stage227a-sales-funnel-movement-view.cjs
node --test tests/stage227a-sales-funnel-movement-view.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## Status lokalny

PENDING_LOCAL_RUN — skrypt `APPLY_STAGE227A_LOCAL_ONLY.ps1` uruchamia guardy/testy lokalnie i zbiera błędy masowo.
