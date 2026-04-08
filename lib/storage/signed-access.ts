import { sha256Hex } from "@/lib/client-portal-token"

export interface SignedAccessDescriptor {
  attachmentId: string
  expiresAt: string
  sig: string
}

function getSigningSecret() {
  if (typeof process !== "undefined") {
    const value = process.env.SIGNED_ACCESS_SECRET?.trim()
    if (value) return value
  }
  return "local-signed-access-secret"
}

function buildSigningPayload(attachmentId: string, expiresAt: string, scopeSeed: string) {
  return `v1|${attachmentId}|${expiresAt}|${scopeSeed}|${getSigningSecret()}`
}

export async function createSignedAttachmentAccess(
  attachmentId: string,
  scopeSeed: string,
  ttlMinutes = 15,
): Promise<SignedAccessDescriptor> {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
  const sig = await sha256Hex(buildSigningPayload(attachmentId, expiresAt, scopeSeed))
  return { attachmentId, expiresAt, sig }
}

export async function verifySignedAttachmentAccess(
  descriptor: SignedAccessDescriptor,
  scopeSeed: string,
): Promise<boolean> {
  const expiry = Date.parse(descriptor.expiresAt)
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return false
  const expected = await sha256Hex(buildSigningPayload(descriptor.attachmentId, descriptor.expiresAt, scopeSeed))
  return descriptor.sig === expected
}
