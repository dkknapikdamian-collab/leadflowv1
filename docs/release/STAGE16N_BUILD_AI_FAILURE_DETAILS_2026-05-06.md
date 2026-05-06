# STAGE16N - Build + AI failed details

Generated: 2026-05-06T18:49:11.224Z

PASSED=0
FAILED=6

## Failed targets

### 1. build

- Command: `npm.cmd run build`
- Exit: `null`
- Duration: `0.0s`
- Full log: `test-results/stage16n-build-ai-details/build.combined.txt`

Key lines:

```text
No extracted failure lines. Open full log file.
```

### 2. verify-closeflow-quiet

- Command: `npm.cmd run verify:closeflow:quiet`
- Exit: `null`
- Duration: `0.0s`
- Full log: `test-results/stage16n-build-ai-details/verify-closeflow-quiet.combined.txt`

Key lines:

```text
No extracted failure lines. Open full log file.
```

### 3. test-critical

- Command: `npm.cmd run test:critical`
- Exit: `null`
- Duration: `0.0s`
- Full log: `test-results/stage16n-build-ai-details/test-critical.combined.txt`

Key lines:

```text
No extracted failure lines. Open full log file.
```

### 4. ai-assistant-autospeech-and-clear-input

- Command: `C:\Program Files\nodejs\node.exe --test tests/ai-assistant-autospeech-and-clear-input.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16n-build-ai-details/ai-assistant-autospeech-and-clear-input.combined.txt`

Key lines:

```text
✖ Today assistant and quick capture keep speech start support after opening (2.2109ms)
✖ failing tests:
✖ Today assistant and quick capture keep speech start support after opening (2.2109ms)
  AssertionError [ERR_ASSERTION]: quick capture or assistant must keep speech support markers
```

### 5. ai-assistant-capture-handoff

- Command: `C:\Program Files\nodejs\node.exe --test tests/ai-assistant-capture-handoff.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16n-build-ai-details/ai-assistant-capture-handoff.combined.txt`

Key lines:

```text
✖ Today assistant saves obvious lead commands into AI drafts without model usage (0.7298ms)
✖ failing tests:
✖ Today assistant saves obvious lead commands into AI drafts without model usage (0.7298ms)
  AssertionError [ERR_ASSERTION]: model call must still exist for in-scope questions
```

### 6. ai-assistant-command-center

- Command: `C:\Program Files\nodejs\node.exe --test tests/ai-assistant-command-center.test.cjs`
- Exit: `1`
- Duration: `0.1s`
- Full log: `test-results/stage16n-build-ai-details/ai-assistant-command-center.combined.txt`

Key lines:

```text
✖ AI assistant is available from global toolbar for daily plan lead lookup and lead capture intent (2.8285ms)
✖ failing tests:
✖ AI assistant is available from global toolbar for daily plan lead lookup and lead capture intent (2.8285ms)
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /leads=\{context\.leads\}/. Input:
```

## All targets

- FAIL `build` -> `test-results/stage16n-build-ai-details/build.combined.txt`
- FAIL `verify-closeflow-quiet` -> `test-results/stage16n-build-ai-details/verify-closeflow-quiet.combined.txt`
- FAIL `test-critical` -> `test-results/stage16n-build-ai-details/test-critical.combined.txt`
- FAIL `ai-assistant-autospeech-and-clear-input` -> `test-results/stage16n-build-ai-details/ai-assistant-autospeech-and-clear-input.combined.txt`
- FAIL `ai-assistant-capture-handoff` -> `test-results/stage16n-build-ai-details/ai-assistant-capture-handoff.combined.txt`
- FAIL `ai-assistant-command-center` -> `test-results/stage16n-build-ai-details/ai-assistant-command-center.combined.txt`
