import { NextRequest, NextResponse } from "next/server"
import { getCronSecret } from "@/lib/mail/config"
import { checkSecurityRateLimit, getRequestClientIp } from "@/lib/security/rate-limit"
import { sendEmailWithResend } from "@/lib/mail/resend"
import { buildWorkflowNotificationJobs } from "@/lib/mail/workflow-planner"
import { buildWorkflowEmailTemplate } from "@/lib/mail/workflow-templates"
import {
  insertSystemEmailEvent,
  listAppSnapshotsForPortalLookup,
  listProfilesForUserIds,
  listSystemEmailDedupeKeys,
  upsertAppSnapshotByUserId,
} from "@/lib/supabase/admin"
import type { ActivityLogEntry, AppNotification } from "@/lib/types"
import { createId, nowIso } from "@/lib/utils"

function isAuthorized(request: NextRequest) {
  const expected = getCronSecret()
  const authHeader = request.headers.get("authorization")
  const xSecret = request.headers.get("x-cron-secret")
  const querySecret = request.nextUrl.searchParams.get("key")

  if (authHeader === `Bearer ${expected}`) return true
  if (xSecret === expected) return true
  if (querySecret === expected) return true
  return false
}

function createInAppNotification(input: {
  workspaceId: string
  caseId: string
  caseItemId: string | null
  title: string
  body: string
  at: string
}): AppNotification {
  return {
    id: createId("notif"),
    workspaceId: input.workspaceId,
    caseId: input.caseId,
    caseItemId: input.caseItemId,
    leadId: null,
    contactId: null,
    channel: "in_app",
    status: "sent",
    title: input.title,
    body: input.body,
    scheduledAt: input.at,
    sentAt: input.at,
    readAt: null,
    createdAt: input.at,
    updatedAt: input.at,
  }
}

function createActivity(input: {
  workspaceId: string
  caseId: string
  caseItemId: string | null
  type: ActivityLogEntry["type"]
  payload: Record<string, unknown>
  at: string
}): ActivityLogEntry {
  return {
    id: createId("activity"),
    workspaceId: input.workspaceId,
    actorUserId: null,
    actorContactId: null,
    source: "system",
    type: input.type,
    leadId: null,
    caseId: input.caseId,
    caseItemId: input.caseItemId,
    attachmentId: null,
    approvalId: null,
    notificationId: null,
    payload: input.payload,
    createdAt: input.at,
  }
}

function isReminderKind(kind: string) {
  return kind.includes("reminder") || kind.includes("due_soon") || kind.includes("decision_required")
}

async function handleRequest(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Brak konfiguracji CRON_SECRET." },
      { status: 500 },
    )
  }

  const now = nowIso()
  const callerIp = getRequestClientIp(request)
  const triggerRateLimit = checkSecurityRateLimit("workflow-reminder-trigger", callerIp)
  if (!triggerRateLimit.ok) {
    return NextResponse.json(
      { error: "Za duzo wywolan workflow notifications. Sprobuj ponownie za chwile." },
      { status: 429, headers: { "Retry-After": String(triggerRateLimit.retryAfterSeconds) } },
    )
  }

  const snapshotsResult = await listAppSnapshotsForPortalLookup()
  if (!snapshotsResult.data) {
    return NextResponse.json({ error: "Nie udalo sie pobrac snapshotow." }, { status: 500 })
  }

  const profilesResult = await listProfilesForUserIds(Array.from(new Set(snapshotsResult.data.map((row) => row.userId))))
  if (!profilesResult.data) {
    return NextResponse.json({ error: "Nie udalo sie pobrac profili operatorow." }, { status: 500 })
  }
  const profilesByUserId = new Map(profilesResult.data.map((row) => [row.userId, row]))

  const dedupeResult = await listSystemEmailDedupeKeys()
  const existingDedupeKeys = dedupeResult.data ?? new Set<string>()

  let jobsCount = 0
  const sent: string[] = []
  const failed: Array<{ dedupeKey: string; error: string }> = []
  const updatedUsers: string[] = []

  for (const row of snapshotsResult.data) {
    const profile = profilesByUserId.get(row.userId)
    const jobs = buildWorkflowNotificationJobs({
      snapshot: row.snapshot,
      operatorEmail: profile?.email ?? null,
      operatorDisplayName: profile?.displayName || "Operatorze",
      existingDedupeKeys,
      now,
    })
    jobsCount += jobs.length
    if (jobs.length === 0) continue

    let notifications = [...(row.snapshot.notifications ?? [])]
    let activityLog = [...(row.snapshot.activityLog ?? [])]

    for (const job of jobs) {
      let handled = false
      if (job.shouldCreateInApp) {
        notifications.unshift(
          createInAppNotification({
            workspaceId: row.workspaceId,
            caseId: job.caseId,
            caseItemId: job.caseItemId,
            title: job.title,
            body: job.body,
            at: now,
          }),
        )
        activityLog.unshift(
          createActivity({
            workspaceId: row.workspaceId,
            caseId: job.caseId,
            caseItemId: job.caseItemId,
            type: "notification_sent",
            payload: {
              kind: job.kind,
              channel: "in_app",
              dedupeKey: job.dedupeKey,
              recipientRole: job.recipient.role,
            },
            at: now,
          }),
        )
        if (isReminderKind(job.kind)) {
          activityLog.unshift(
            createActivity({
              workspaceId: row.workspaceId,
              caseId: job.caseId,
              caseItemId: job.caseItemId,
              type: "reminder_sent",
              payload: {
                kind: job.kind,
                channel: "in_app",
                dedupeKey: job.dedupeKey,
              },
              at: now,
            }),
          )
        }
        await insertSystemEmailEvent({
          workspaceId: row.workspaceId,
          userId: row.userId,
          kind: `${job.kind}_in_app`,
          dedupeKey: `${job.dedupeKey}:in-app`,
          recipientEmail: job.recipient.email ?? "in-app-only",
          subject: job.title,
          provider: "in_app",
          providerMessageId: null,
          payload: {
            status: "sent",
            channel: "in_app",
            role: job.recipient.role,
            caseId: job.caseId,
            caseItemId: job.caseItemId,
          },
        })
        handled = true
      }

      if (job.shouldSendEmail && job.recipient.email) {
        const template = buildWorkflowEmailTemplate({
          kind: job.kind,
          title: job.title,
          body: job.body,
          recipientName: job.recipient.displayName,
        })

        const mailResult = await sendEmailWithResend({
          to: job.recipient.email,
          subject: template.subject,
          text: template.text,
          html: template.html,
        })

        if (mailResult.error) {
          failed.push({ dedupeKey: job.dedupeKey, error: mailResult.error })
          await insertSystemEmailEvent({
            workspaceId: row.workspaceId,
            userId: row.userId,
            kind: `${job.kind}_failed`,
            dedupeKey: `${job.dedupeKey}:failed:${Date.now()}`,
            recipientEmail: job.recipient.email,
            subject: template.subject,
            provider: "resend",
            providerMessageId: null,
            payload: {
              status: "failed",
              error: mailResult.error,
              role: job.recipient.role,
              caseId: job.caseId,
              caseItemId: job.caseItemId,
            },
          })
          continue
        }

        await insertSystemEmailEvent({
          workspaceId: row.workspaceId,
          userId: row.userId,
          kind: job.kind,
          dedupeKey: `${job.dedupeKey}:email`,
          recipientEmail: job.recipient.email,
          subject: template.subject,
          provider: "resend",
          providerMessageId: mailResult.data?.id ?? null,
          payload: {
            status: "sent",
            role: job.recipient.role,
            caseId: job.caseId,
            caseItemId: job.caseItemId,
          },
        })
        sent.push(job.dedupeKey)
        handled = true

        activityLog.unshift(
          createActivity({
            workspaceId: row.workspaceId,
            caseId: job.caseId,
            caseItemId: job.caseItemId,
            type: "notification_sent",
            payload: {
              kind: job.kind,
              channel: "email",
              dedupeKey: job.dedupeKey,
              recipientRole: job.recipient.role,
              to: job.recipient.email,
            },
            at: now,
          }),
        )
        if (isReminderKind(job.kind)) {
          activityLog.unshift(
            createActivity({
              workspaceId: row.workspaceId,
              caseId: job.caseId,
              caseItemId: job.caseItemId,
              type: "reminder_sent",
              payload: {
                kind: job.kind,
                channel: "email",
                dedupeKey: job.dedupeKey,
                to: job.recipient.email,
              },
              at: now,
            }),
          )
        }
      }

      if (handled) {
        await insertSystemEmailEvent({
          workspaceId: row.workspaceId,
          userId: row.userId,
          kind: `${job.kind}_marker`,
          dedupeKey: job.dedupeKey,
          recipientEmail: job.recipient.email ?? "marker",
          subject: job.title,
          provider: "workflow",
          providerMessageId: null,
          payload: {
            status: "handled",
            role: job.recipient.role,
            caseId: job.caseId,
            caseItemId: job.caseItemId,
          },
        })
        existingDedupeKeys.add(job.dedupeKey)
      }
    }

    const save = await upsertAppSnapshotByUserId({
      userId: row.userId,
      workspaceId: row.workspaceId,
      snapshot: {
        ...row.snapshot,
        notifications,
        activityLog,
      },
    })
    if (!save.error) {
      updatedUsers.push(row.userId)
    }
  }

  return NextResponse.json({
    ok: true,
    jobs: jobsCount,
    sent,
    failed,
    updatedUsers,
  })
}

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}
