import { differenceInCalendarDays, isPast, parseISO, startOfDay } from 'date-fns'

export const LEAD_ACTIVE_SALES_STATUSES = [
  'new',
  'contacted',
  'qualification',
  'proposal_sent',
  'waiting_response',
  'negotiation',
  'accepted',
] as const

const CLOSED_STATUSES = new Set(['won', 'lost', 'moved_to_service', 'archived'])
const WAITING_STATUSES = new Set(['proposal_sent', 'waiting_response', 'negotiation', 'accepted'])

function toDateSafe(value: unknown) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'string') {
    const normalized = value.includes('T') ? value : `${value}T09:00:00`
    const parsed = parseISO(normalized)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof value === 'object' && value && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const converted = (value as { toDate: () => Date }).toDate()
      return Number.isNaN(converted.getTime()) ? null : converted
    } catch {
      return null
    }
  }
  return null
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function isClosedLeadStatus(status?: string) {
  return CLOSED_STATUSES.has(String(status || '').trim())
}

export function isLeadMovedToService(lead: any) {
  const status = asText(lead?.status)
  const leadVisibility = asText(lead?.leadVisibility)
  const salesOutcome = asText(lead?.salesOutcome)
  const linkedCaseId = asText(lead?.linkedCaseId || lead?.caseId)

  return Boolean(
    lead?.movedToService
    || status === 'moved_to_service'
    || leadVisibility === 'archived'
    || salesOutcome === 'moved_to_service'
    || linkedCaseId
    || toDateSafe(lead?.movedToServiceAt)
    || toDateSafe(lead?.caseStartedAt)
    || toDateSafe(lead?.serviceStartedAt),
  )
}

export function isActiveSalesLead(lead: any) {
  const status = String(lead?.status || '').trim()
  return LEAD_ACTIVE_SALES_STATUSES.includes(status as typeof LEAD_ACTIVE_SALES_STATUSES[number]) && !isLeadMovedToService(lead)
}

export function getLeadNextActionDate(lead: any) {
  return toDateSafe(lead?.nextActionAt)
}

export function getLeadLastTouchDate(lead: any) {
  return (
    toDateSafe(lead?.lastContactAt) ||
    toDateSafe(lead?.updatedAt) ||
    toDateSafe(lead?.createdAt)
  )
}

export function hasNextStep(lead: any) {
  return Boolean(getLeadNextActionDate(lead))
}

export function isNextStepOverdue(lead: any) {
  if (isClosedLeadStatus(lead?.status)) return false
  const nextAction = getLeadNextActionDate(lead)
  if (!nextAction) return false
  return isPast(nextAction)
}

export function daysSinceLastTouch(lead: any) {
  const lastTouch = getLeadLastTouchDate(lead)
  if (!lastTouch) return null
  return differenceInCalendarDays(startOfDay(new Date()), startOfDay(lastTouch))
}

export function isWaitingTooLong(lead: any) {
  if (isClosedLeadStatus(lead?.status)) return false
  const status = String(lead?.status || '')
  if (!WAITING_STATUSES.has(status)) return false
  const days = daysSinceLastTouch(lead)
  return days !== null && days >= 3
}

export function isHighValueAtRisk(lead: any) {
  if (isClosedLeadStatus(lead?.status)) return false
  const dealValue = Number(lead?.dealValue || 0)
  if (dealValue < 5000) return false
  const days = daysSinceLastTouch(lead) ?? 0
  return isNextStepOverdue(lead) || !hasNextStep(lead) || days >= 5 || Boolean(lead?.isAtRisk)
}

export function getLeadPriorityScore(lead: any) {
  if (isClosedLeadStatus(lead?.status)) return 0

  let score = 0
  const value = Number(lead?.dealValue || 0)
  const days = daysSinceLastTouch(lead) ?? 0

  if (isNextStepOverdue(lead)) score += 60
  if (!hasNextStep(lead)) score += 45
  if (isWaitingTooLong(lead)) score += 35
  if (Boolean(lead?.isAtRisk)) score += 25

  if (value >= 20000) score += 35
  else if (value >= 10000) score += 25
  else if (value >= 5000) score += 15
  else if (value > 0) score += 5

  if (days >= 10) score += 20
  else if (days >= 5) score += 10
  else if (days >= 3) score += 5

  return score
}

export function buildLeadAlertReason(lead: any) {
  if (isLeadMovedToService(lead)) return 'Temat jest już w obsłudze'
  if (isNextStepOverdue(lead)) return 'Termin najbliższej akcji już minął'
  if (!hasNextStep(lead)) return 'Brak zaplanowanej akcji'
  if (isWaitingTooLong(lead)) return 'Temat czeka za długo bez nowego ruchu'
  if (isHighValueAtRisk(lead)) return 'Wysoka wartość i zbyt mało ruchu'
  if (Boolean(lead?.isAtRisk)) return 'Temat oznaczony jako zagrożony'
  return 'Wymaga uwagi'
}
