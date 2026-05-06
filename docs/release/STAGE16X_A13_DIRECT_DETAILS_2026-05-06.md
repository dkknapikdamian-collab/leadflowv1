# Stage16X A13 direct detail report

Generated: 2026-05-06T19:26:16.941Z
Branch: dev-rollout-freeze
HEAD: da48e5d

## Summary

- FAIL a13-direct exit=1 duration=0.1s
- FAIL a13-test-wrapper exit=1 duration=0.3s
- FAIL test-critical-compact exit=1 duration=0.4s

## Failure details

### a13-direct

Command: `C:\Program Files\nodejs\node.exe scripts/check-a13-critical-regressions.cjs`
Exit code: `1`

Key failure lines:

- A13 critical regression guard failed.
- AI drafts confirmation and raw text cleanup: pending/draft status missing

<details><summary>STDOUT</summary>

```text

```

</details>

<details><summary>STDERR</summary>

```text

```

</details>

### a13-test-wrapper

Command: `C:\Program Files\nodejs\node.exe --test tests/a13-critical-regressions.test.cjs`
Exit code: `1`

Key failure lines:

- ✖ A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions (147.7554ms)
- ✖ A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions (147.7554ms)
- AssertionError [ERR_ASSERTION]: A13 critical regression guard failed.
- AI drafts confirmation and raw text cleanup: pending/draft status missing

<details><summary>STDOUT</summary>

```text

```

</details>

<details><summary>STDERR</summary>

```text

```

</details>

### test-critical-compact

Command: `C:\Program Files\nodejs\node.exe scripts/run-tests-compact.cjs --critical`
Exit code: `1`

Key failure lines:

- 1. A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions

<details><summary>STDOUT</summary>

```text

```

</details>

<details><summary>STDERR</summary>

```text

```

</details>
