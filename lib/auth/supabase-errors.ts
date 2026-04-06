const HIDDEN_AUTH_ERROR_MARKERS = [
  "already registered",
  "already been registered",
  "already exists",
  "user already registered",
  "email already",
  "already confirmed",
  "user not found",
  "email not found",
  "identity not found",
  "identity already exists",
  "for security purposes",
]

function normalizeError(value: string | null) {
  return value?.trim().toLowerCase() ?? ""
}

export function shouldReturnNeutralEmailActionSuccess(status: number, error: string | null) {
  if (!error) return false
  if (status === 429 || status >= 500) return false

  const normalized = normalizeError(error)
  return HIDDEN_AUTH_ERROR_MARKERS.some((marker) => normalized.includes(marker))
}
