import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import type { AppSnapshot, ClientPortalToken } from "@/lib/types"

const TOKEN_PREFIX = "cpt_live"

function toBuffer(value: string) {
  return Buffer.from(value, "hex")
}

export function createPortalTokenValue() {
  return `${TOKEN_PREFIX}_${randomBytes(24).toString("base64url")}`
}

export function hashPortalTokenValue(tokenValue: string) {
  return createHash("sha256").update(tokenValue).digest("hex")
}

export function verifyPortalTokenValue(input: {
  presentedToken: string
  storedTokenHash: string
}) {
  const trimmed = input.presentedToken.trim()
  if (!trimmed || !input.storedTokenHash) return false

  // Backward compatibility for legacy snapshots where tokenHash stored the public token value directly.
  if (trimmed === input.storedTokenHash) {
    return true
  }

  const expected = input.storedTokenHash.trim()
  const computed = hashPortalTokenValue(trimmed)

  if (expected.length !== computed.length) return false

  const left = toBuffer(expected)
  const right = toBuffer(computed)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function getPortalTokenPublicValue(token: ClientPortalToken) {
  return token.tokenValue ?? null
}

export function stripPortalTokenPublicValues(snapshot: AppSnapshot): AppSnapshot {
  if (!snapshot.clientPortalTokens?.length) return snapshot

  const nextTokens = snapshot.clientPortalTokens.map((token) => {
    if (!token.tokenValue) return token
    const { tokenValue: _tokenValue, ...rest } = token
    return rest
  })

  return {
    ...snapshot,
    clientPortalTokens: nextTokens,
  }
}
