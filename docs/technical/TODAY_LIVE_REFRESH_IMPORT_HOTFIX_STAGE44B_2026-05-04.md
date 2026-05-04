# TODAY LIVE REFRESH IMPORT HOTFIX v10

## Correct import rule

`subscribeCloseflowDataMutations` must be imported exactly once from:

```text
../lib/supabase-fallback
```

It must not be imported from:

```text
react
```

## Runtime error fixed

```text
TypeError: subscribeCloseflowDataMutations is not a function
APP_ROUTE_RENDER_FAILED
```

## Why v10 exists

V8 fixed the code direction, but docs failed.  
V9 still failed because duplicate exact imports survived from earlier failed attempts.

V10 uses a hard de-duplication pass before adding the final import.

## Next

```text
FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence
```
