export type SystemMailTemplate =
  | "welcome"
  | "reset-password"
  | "trial-ending"
  | "payment-failed"

export type SendSystemMailInput = {
  to: string
  template: SystemMailTemplate
  variables?: Record<string, string>
}

export async function sendSystemMail(input: SendSystemMailInput): Promise<{ ok: true }> {
  void input
  return { ok: true }
}
