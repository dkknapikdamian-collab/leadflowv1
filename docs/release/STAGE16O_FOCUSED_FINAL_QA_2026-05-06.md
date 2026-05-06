# Stage16O focused final QA report - 2026-05-06

- Passed: 3
- Failed: 5

## FAIL: `build`

- Exit: `null`
- Log: `test-results/stage16o-focused-final-qa/build.log`

## FAIL: `verify-closeflow-quiet`

- Exit: `null`
- Log: `test-results/stage16o-focused-final-qa/verify-closeflow-quiet.log`

## FAIL: `test-critical`

- Exit: `null`
- Log: `test-results/stage16o-focused-final-qa/test-critical.log`

## PASS: `ai-assistant-autospeech-and-clear-input`

- Exit: `0`
- Log: `test-results/stage16o-focused-final-qa/ai-assistant-autospeech-and-clear-input.log`

```text
ℹ fail 0
```

## FAIL: `ai-assistant-capture-handoff`

- Exit: `1`
- Log: `test-results/stage16o-focused-final-qa/ai-assistant-capture-handoff.log`

```text
✖ Today assistant saves obvious lead commands into AI drafts without model usage (1.1786ms)
ℹ fail 1
✖ failing tests:
✖ Today assistant saves obvious lead commands into AI drafts without model usage (1.1786ms)
  AssertionError [ERR_ASSERTION]: lead capture must be handled before any remote model call
    actual: false,
    expected: true,
```

## PASS: `ai-assistant-command-center`

- Exit: `0`
- Log: `test-results/stage16o-focused-final-qa/ai-assistant-command-center.log`

```text
ℹ fail 0
```

## PASS: `billing-ui-polish-and-diagnostics`

- Exit: `0`
- Log: `test-results/stage16o-focused-final-qa/billing-ui-polish-and-diagnostics.log`

```text
ℹ fail 0
```

## FAIL: `final-red-gates-collector`

- Exit: `null`
- Log: `test-results/stage16o-focused-final-qa/final-red-gates-collector.log`

