# STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Dodac prosty dowod release-readiness dla warstwy AI Assistant po naprawie Vercel Hobby limit.

## Co sprawdza evidence

- branch,
- commit,
- working tree,
- api function count <= 12,
- brak fizycznego `api/assistant/query.ts`,
- rewrite `/api/assistant/query` do `/api/system?kind=assistant-query`,
- route `assistant-query` w `api/system.ts`,
- istnienie `src/server/assistant-query-handler.ts`.

## Pliki

- `scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs`
- `tests/stage12-ai-assistant-vercel-release-evidence.test.cjs`
- `docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1_2026-05-06.md`

## Wynik

Skrypt generuje plik:

`docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_LATEST.md`

## Komendy

```powershell
node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs
node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs
node scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs
node --test tests/stage12-ai-assistant-vercel-release-evidence.test.cjs
npm run build
```

## Decyzja

To jest etap dowodu, nie kolejna funkcja. Nie zwieksza liczby Serverless Functions i nie rusza logiki AI.
