export type OAuthHashPayload = {
  accessToken: string | null
  refreshToken: string | null
  error: string | null
}

export function parseOAuthHash(hash: string): OAuthHashPayload {
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash
  const params = new URLSearchParams(cleaned)

  return {
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token"),
    error: params.get("error_description") || params.get("error"),
  }
}

export async function postJson<T>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json().catch(() => ({}))) as T & { error?: string; message?: string }

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}
