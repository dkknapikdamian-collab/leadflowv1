export function buildRiskLabel(overdueCount: number, staleHours: number) {
  if (overdueCount >= 2 || staleHours >= 120) return "Wysokie"
  if (overdueCount >= 1 || staleHours >= 72) return "Srednie"
  return "Niskie"
}

export function hoursSince(dateIso: string, now = new Date()) {
  const date = new Date(dateIso)
  const diffMs = now.getTime() - date.getTime()
  if (!Number.isFinite(diffMs) || diffMs < 0) return 0
  return Math.floor(diffMs / (1000 * 60 * 60))
}
