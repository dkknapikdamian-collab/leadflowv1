# CloseFlow - client/case archive cascade with calendar visibility

Status: implemented by CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1

## Decision

Deleting a client archives the client through `clients.archived_at` instead of hard-deleting it. Cases keep their original operational status, but active case lists hide cases whose client is archived.

Deleting a case archives the case through `cases.status = archived` and keeps task/event links. The calendar hides tasks and events whose `clientId` or `caseId` points to an archived parent.

## Restore rule

Restoring a client by clearing `archived_at` makes its cases and linked calendar items visible again, because task/event relations are preserved.

## Guard

Run:

```powershell
npm.cmd run check:closeflow-client-archive-calendar-cascade
```
