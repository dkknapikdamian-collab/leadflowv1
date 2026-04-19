export function getMailFrom() {
  const value = process.env.MAIL_FROM?.trim()
  if (!value) {
    throw new Error("Missing MAIL_FROM")
  }
  return value
}

export function getResendApiKey() {
  const value = process.env.RESEND_API_KEY?.trim()
  if (!value) {
    throw new Error("Missing RESEND_API_KEY")
  }
  return value
}

export function getCronSecret() {
  const value = process.env.CRON_SECRET?.trim() || process.env.SYSTEM_MAILS_CRON_SECRET?.trim()
  if (!value) {
    throw new Error("Missing CRON_SECRET")
  }
  return value
}
