import { NextRequest, NextResponse } from "next/server"
import { getCronSecret } from "@/lib/mail/config"
import { sendEmailWithResend } from "@/lib/mail/resend"
import { buildStatusEmailJobs } from "@/lib/mail/status-planner"
import { buildAccountStatusEmailTemplate, formatPolishDate } from "@/lib/mail/templates"
import {
  insertSystemEmailEvent,
  listAccessStatusesForSystemEmails,
  listProfilesForUserIds,
  listSystemEmailDedupeKeys,
} from "@/lib/supabase/admin"

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

  const accessRowsResult = await listAccessStatusesForSystemEmails()
  if (!accessRowsResult.data) {
    return NextResponse.json({ error: "Nie udało się pobrać access_status." }, { status: 500 })
  }

  const profilesResult = await listProfilesForUserIds(accessRowsResult.data.map((row) => row.userId))
  if (!profilesResult.data) {
    return NextResponse.json({ error: "Nie udało się pobrać profili." }, { status: 500 })
  }

  const dedupeResult = await listSystemEmailDedupeKeys()
  const existingDedupeKeys = dedupeResult.data ?? new Set<string>()

  const jobs = buildStatusEmailJobs({
    accessRows: accessRowsResult.data,
    profiles: profilesResult.data,
    existingDedupeKeys,
    now: new Date(),
  })

  const sent: string[] = []
  const skipped: string[] = []
  const failed: Array<{ dedupeKey: string; error: string }> = []

  for (const job of jobs) {
    const template = buildAccountStatusEmailTemplate({
      kind: job.kind,
      displayName: job.displayName,
      planName: job.planName,
      dateLabel: formatPolishDate(job.dateValue),
    })

    const mailResult = await sendEmailWithResend({
      to: job.to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    })

    if (mailResult.error) {
      failed.push({
        dedupeKey: job.dedupeKey,
        error: mailResult.error,
      })
      continue
    }

    const eventResult = await insertSystemEmailEvent({
      workspaceId: job.workspaceId,
      userId: job.userId,
      kind: job.kind,
      dedupeKey: job.dedupeKey,
      recipientEmail: job.to,
      subject: template.subject,
      provider: "resend",
      providerMessageId: mailResult.data?.id ?? null,
      payload: {
        kind: job.kind,
        planName: job.planName,
        dateValue: job.dateValue,
      },
    })

    if (eventResult.error) {
      failed.push({
        dedupeKey: job.dedupeKey,
        error: eventResult.error,
      })
      continue
    }

    sent.push(job.dedupeKey)
  }

  return NextResponse.json({
    ok: true,
    queued: jobs.length,
    sent,
    skipped,
    failed,
  })
}

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}
