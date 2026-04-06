export type PromoValidationInput = {
  code: string
  workspaceId: string
  userId: string
}

export type PromoValidationResult = {
  ok: boolean
  normalizedCode: string
  reason?: string
}

export function validatePromoOrReferral(input: PromoValidationInput): PromoValidationResult {
  const normalizedCode = input.code.trim().toLowerCase()

  if (!normalizedCode) {
    return {
      ok: false,
      normalizedCode,
      reason: "empty-code",
    }
  }

  return {
    ok: true,
    normalizedCode,
  }
}
