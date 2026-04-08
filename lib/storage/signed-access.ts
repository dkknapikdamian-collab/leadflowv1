import { createHmac, timingSafeEqual } from "node:crypto"

export interface SignedAccessDescriptor {
  attachmentId: string
  expiresAt: string
  sig: string
}

function getSigningSecret() {
  return (
    process.env.CLIENT_PORTAL_FILE_SIGNING_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || "dev-local-signing-secret"
  )
}

function buildSigningPayload(attachmentId: string, expiresAt: string, scopeSeed: string) {
  return `${attachmentId}|${expiresAt}|${scopeSeed}`
}

function signPayload(payload: string) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("hex")
}

export function createSignedAttachmentAccess(
  attachmentId: string,
  scopeSeed: string,
  ttlMinutes = 15,
): SignedAccessDescriptor {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
  const sig = signPayload(buildSigningPayload(attachmentId, expiresAt, scopeSeed))
  return { attachmentId, expiresAt, sig }
}

export function verifySignedAttachmentAccess(descriptor: SignedAccessDescriptor, scopeSeed: string): boolean {
  const expiry = Date.parse(descriptor.expiresAt)
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return false

  const expected = signPayload(buildSigningPayload(descriptor.attachmentId, descriptor.expiresAt, scopeSeed))
  const left = Buffer.from(descriptor.sig, "hex")
  const right = Buffer.from(expected, "hex")

  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}
