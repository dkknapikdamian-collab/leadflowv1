import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { issueClientPortalTokenSnapshot, registerPortalTokenFailureSnapshot } from "../lib/snapshot"
import { validateUploadMeta } from "../lib/storage/upload-policy"

test("portal token lockuje sie po wielu nieudanych probach", () => {
  const base = createInitialSnapshot()
  const withToken = issueClientPortalTokenSnapshot(base, {
    caseId: "case_1",
    tokenHash: "hash_1",
    expiresAt: "2030-01-01T00:00:00.000Z",
  })

  let next = withToken
  for (let i = 0; i < 5; i += 1) {
    next = registerPortalTokenFailureSnapshot(next, "hash_1")
  }

  const token = next.clientPortalTokens.find((entry) => entry.tokenHash === "hash_1")
  assert.ok(token)
  assert.equal(token?.failedAttempts, 5)
  assert.ok(Boolean(token?.lockedUntil))
})

test("upload waliduje zgodnosc MIME i rozszerzenia", () => {
  const invalid = validateUploadMeta({
    fileName: "umowa.pdf",
    mimeType: "image/png",
    fileSizeBytes: 1200,
  })
  const valid = validateUploadMeta({
    fileName: "logo.png",
    mimeType: "image/png",
    fileSizeBytes: 1200,
  })

  assert.equal(invalid.ok, false)
  assert.equal(valid.ok, true)
})
