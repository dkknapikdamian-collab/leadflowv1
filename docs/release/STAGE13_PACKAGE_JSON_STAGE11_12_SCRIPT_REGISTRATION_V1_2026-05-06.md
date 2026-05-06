# STAGE13_PACKAGE_JSON_STAGE11_12_SCRIPT_REGISTRATION_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Dopisac skroty Stage11/Stage12 do `package.json` lokalnie, bez ryzykownej edycji przez GitHub API.

## Zasada

- Odczyt pelnego `package.json` lokalnie.
- Walidacja przez `JSON.parse`.
- Zapis UTF-8 bez BOM.
- Dopiero potem check/test/build/commit/push.

## Dodawane skroty

- `check:stage11-vercel-hobby-function-budget-guard-v1`
- `test:stage11-vercel-hobby-function-budget-guard-v1`
- `audit:stage12-ai-assistant-vercel-release-evidence`
- `test:stage12-ai-assistant-vercel-release-evidence-v1`
- `verify:stage11-stage12-ai-vercel-evidence`

## Kryterium zakonczenia

- `npm.cmd run check:stage13-package-json-stage11-12-script-registration-v1` przechodzi.
- `npm.cmd run test:stage13-package-json-stage11-12-script-registration-v1` przechodzi.
- `npm.cmd run build` przechodzi przed commitem i pushem.
