import { NextRequest, NextResponse } from "next/server"
import { getCronSecret } from "@/lib/mail/config"
import { sendEmailWithResend } from "@/lib/mail/resend"
import { buildWorkflowEmailTemplate } from "@/lib/mail/templates"
import { checkSecurityRateLimit } from "@/lib/security/rate-limit"
import { listAppSnapshotsForWorkflowNotifications, upsertAppSnapshotByAdmin } from "@/lib/supabase/admin"

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

  const snapshotRows = await listAppSnapshotsForWorkflowNotifications()
  if (!snapshotRows.data) {
    return NextResponse.json({ error: "Nie udalo sie pobrac snapshotow." }, { status: 500 })
  }

  let queued = 0
  let sent = 0
  let failed = 0
  const updatedUsers: string[] = []

  for (const row of snapshotRows.data) {
    const deliveryLog = [...row.snapshot.notificationDeliveryLog]
    let changed = false

    for (const entry of deliveryLog) {
      if (entry.channel !== "email" || entry.status !== "queued") continue
      queued += 1

      const notification = row.snapshot.notifications.find((candidate) => candidate.id === entry.notificationId)
      if (!notification) {
        entry.status = "failed"
        entry.error = "notification-not-found"
        failed += 1
        changed = true
        continue
      }

      if (!entry.recipient || !entry.recipient.includes("@")) {
        entry.status = "failed"
        entry.error = "invalid-recipient"
        failed += 1
        changed = true
        continue
      }

      const template = buildWorkflowEmailTemplate({
        kind: notification.kind,
        recipientLabel: row.snapshot.user.name || "Uzytkowniku",
        title: notification.title,
        message: notification.message,
      })
      const limiter = checkSecurityRateLimit(
        "reminder-trigger",
        `${row.workspaceId}:${notification.relatedCaseId ?? notification.userId}:${notification.kind}`,
      )
      if (!limiter.ok) {
        entry.status = "skipped"
        entry.error = `rate-limited:${limiter.retryAfterSeconds}s`
        changed = true
        continue
      }

      const result = await sendEmailWithResend({
        to: entry.recipient,
        subject: template.subject,
        text: template.text,
        html: template.html,
      })

      if (result.error) {
        entry.status = "failed"
        entry.error = result.error
        failed += 1
        changed = true
        continue
      }

      entry.status = "sent"
      entry.error = ""
      entry.sentAt = new Date().toISOString()
      sent += 1
      changed = true
    }

    if (!changed) continue

    const nextSnapshot = {
      ...row.snapshot,
      notificationDeliveryLog: deliveryLog,
    }
    const save = await upsertAppSnapshotByAdmin({
      userId: row.userId,
      workspaceId: row.workspaceId,
      snapshot: nextSnapshot,
    })
    if (!save.error) {
      updatedUsers.push(row.userId)
    }
  }

  return NextResponse.json({
    ok: true,
    queued,
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
