# 2026-06-21 — KBL ChatGPT Bridge POC GitHub state

Status: GITHUB_STATE_SAVED / LOCAL_TEST_REQUIRED
Repo: dkknapikdamian-collab/node-red-kabelki
Branch: main
Stage: KBL-CHATGPT-BRIDGE-POC-001

## What changed

The ChatGPT Bridge POC is now represented in GitHub under:

```txt
tools/chatgpt-bridge-poc/
```

The goal is to stop relying on manual local PowerShell patches and keep the application state visible in the repository.

## Files in scope

```txt
tools/chatgpt-bridge-poc/package.json
tools/chatgpt-bridge-poc/server.js
tools/chatgpt-bridge-poc/openapi.yaml
tools/chatgpt-bridge-poc/README.md
tools/chatgpt-bridge-poc/runtime/jobs.json
tools/chatgpt-bridge-poc/smoke-test.js
tools/chatgpt-bridge-poc/env.example.txt
tools/chatgpt-bridge-poc/gitignore-notes.txt
tools/chatgpt-bridge-poc/START_CHATGPT_BRIDGE_POC.ps1
tools/chatgpt-bridge-poc/COPY_SCHEMA.ps1
```

## Technical model

```txt
Custom GPT -> Actions -> ngrok HTTPS -> localhost:8787 -> bridge -> jobs.json -> result JSONL
```

The server accepts local authorization through either:

```txt
X-KABELKI-BRIDGE-KEY
ngrok-skip-browser-warning
```

For the POC, GPT Builder should use custom header `ngrok-skip-browser-warning` with the local bridge value from `.env`.

## Guardrails

- No Hermes production integration.
- No D1/RaportStrony/PDF integration.
- No external actions.
- No publish/send/deploy/push/spend/run-command endpoint.
- Result cannot be `approved`, `final`, `sent`, or `published`.
- Owner review remains required.

## Tests

Automated local smoke file added:

```txt
tools/chatgpt-bridge-poc/smoke-test.js
```

This chat could not execute the repo test on Damian's laptop after pushing to GitHub. Next local test required:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\00_ai_ops_runner\node-red-kabelki\tools\chatgpt-bridge-poc"
npm run smoke
```

## Obsidian

Related Obsidian note created in `obsidian-vault`:

```txt
10_PROJEKTY/Node_RED_Kabelki/99_SYNC/2026-06-21_KBL_CHATGPT_BRIDGE_POC_GITHUB_STATE.md
```

## Risk audit

Main risk is continuing manual patching. From this point, use GitHub source files as the source of truth and pull clean state locally. Local runtime files must stay local.
