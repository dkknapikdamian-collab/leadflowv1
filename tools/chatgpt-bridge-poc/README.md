# Kabelki ChatGPT Bridge POC

Status: POC / local-first / no external execution.

This folder contains a minimal local bridge for Custom GPT Actions.

## Goal

The POC verifies this flow:

```txt
Custom GPT -> Actions -> local bridge -> queued job -> structured result
```

The bridge only exposes job/context/result endpoints. It does not publish, deploy, send mail, push code, spend money, or run operating-system commands.

## Files

```txt
package.json
server.js
openapi.yaml
smoke-test.js
runtime/jobs.json
```

Runtime-only files stay local:

```txt
.env
runtime/results.jsonl
runtime/request-log.jsonl
```

## Local setup

Create a local `.env` file in this folder:

```txt
PORT=8787
KABELKI_BRIDGE_KEY=replace_with_long_random_value
```

Start the bridge:

```powershell
npm start
```

Run the local smoke test:

```powershell
npm run smoke
```

Expose it for a short POC session:

```powershell
ngrok http 8787
```

## GPT Builder setup

In the Custom GPT action editor:

```txt
Authentication: API key
Type: Custom header
Header name: ngrok-skip-browser-warning
Value: KABELKI_BRIDGE_KEY from local .env
```

Paste `openapi.yaml` into the schema field.

The `ngrok-skip-browser-warning` header is used for the free ngrok tunnel and is also accepted by the local bridge as the POC authentication header. The bridge also accepts `X-KABELKI-BRIDGE-KEY` for local PowerShell tests.

## Test phrase

```txt
Wez nastepne zadanie z Kabelki Bridge POC, wykonaj je i zapisz wynik.
```

Expected action order:

```txt
getNextJob -> getJobContext -> submitJobResult
```

## Boundary

This is not Hermes production integration. It is only a bridge proof-of-concept. Hermes/memory/skills/D1/RaportStrony/PDF work comes later after this POC is stable.
