export async function sha256Hex(value: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value)
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes)
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  }

  const nodeCrypto = await import("node:crypto")
  return nodeCrypto.createHash("sha256").update(value).digest("hex")
}

export function generatePortalTokenRaw() {
  const randomPart =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}-${Math.random().toString(36).slice(2, 14)}`

  return `pt_${randomPart.replace(/[^a-zA-Z0-9_-]/g, "")}`
}

export function isPortalTokenActive(token: { expiresAt: string; revokedAt: string; lockedUntil?: string | null }) {
  if (token.revokedAt) return false
  if (token.lockedUntil) {
    const lockedUntil = Date.parse(token.lockedUntil)
    if (Number.isFinite(lockedUntil) && lockedUntil > Date.now()) return false
  }
  const expiry = Date.parse(token.expiresAt)
  if (!Number.isFinite(expiry)) return false
  return expiry > Date.now()
}
