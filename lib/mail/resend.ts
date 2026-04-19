import { getMailFrom, getResendApiKey } from "@/lib/mail/config"

export interface SendEmailInput {
  to: string
  subject: string
  text: string
  html: string
}

export async function sendEmailWithResend(input: SendEmailInput) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getMailFrom(),
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as { id?: string; message?: string; error?: string }) : {}

  if (!response.ok) {
    const error = json.message || json.error || "resend-send-error"
    return { data: null, error, status: response.status }
  }

  return {
    data: {
      id: json.id ?? null,
    },
    error: null,
    status: response.status,
  }
}
