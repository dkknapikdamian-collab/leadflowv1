# TODAY LIVE REFRESH LISTENER - Stage 4.4B

## Files

```text
src/pages/TodayStable.tsx
scripts/check-faza4-etap44b-today-live-refresh-listener.cjs
tests/faza4-etap44b-today-live-refresh-listener.test.cjs
```

## Contract

`TodayStable` must subscribe to:

```text
subscribeCloseflowDataMutations
```

and call:

```text
refreshData()
```

for relevant entities:

```text
task
event
lead
case
client
aiDraft
activity
payment
```

## Constraint

No full reload:

```text
window.location.reload()
```

must not be introduced.

## Reason

`Today` is the operational center. It cannot show stale data after task/event/lead mutations.

## Next

```text
FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence
```
