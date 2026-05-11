# CloseFlow Stage11 guard repair12

Status: repair wide-gate failures grouped after repair11.

## Zakres

- Today legacy UTF-8 guard markers for quick snooze and AI drafts.
- Daily digest API compatibility shim at api/daily-digest.ts.
- Stage32 value rail static markers.
- Stage03D optional columns evidence rows generated from api/leads.ts.
- Tasks mutation bus exact import guard compatibility.
- Wide quiet release gate retained.

## Guardy

```powershell
npm.cmd run check:closeflow-case-client-roadmap-repair
npm.cmd run build
npm.cmd run verify:closeflow:quiet:wide
npm.cmd run verify:closeflow:quiet
```
