# Cases FileText runtime fix

Data: 2026-04-24

## Problem

The Cases bundle crashed at runtime with:

```text
ReferenceError: FileText is not defined
```

The Cases screen used the FileText icon, but the icon was not imported from lucide-react.

## Fix

Cases.tsx now imports FileText from lucide-react whenever it is used.

## Regression guard

Added tests/cases-filetext-runtime.test.cjs and connected it to both release gates.

## Expected result

- Cases no longer crashes after deploy.
- Today should not fall into the global error screen because of the lazy Cases chunk.
- verify:closeflow:quiet catches this class of missing icon import before push.
