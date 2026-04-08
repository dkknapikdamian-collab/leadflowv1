export function buildUserScopedStorageKey(baseKey: string, userId: string | null | undefined) {
  const normalizedBaseKey = baseKey.trim() || "ClientPilot"
  const normalizedUserId = userId?.trim()

  if (!normalizedUserId) {
    return `${normalizedBaseKey}:anonymous`
  }

  return `${normalizedBaseKey}:${normalizedUserId}`
}

