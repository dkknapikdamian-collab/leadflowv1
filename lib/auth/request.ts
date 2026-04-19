import type { NextRequest } from "next/server"

export function getRequestFingerprint(request: NextRequest) {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
}
