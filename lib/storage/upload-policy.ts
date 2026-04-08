export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export interface UploadValidationResult {
  ok: boolean
  error?: string
  safeFileName?: string
}

export function sanitizeFileName(name: string) {
  const clean = name
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120)

  return clean || "plik"
}

export function validateUploadMeta(payload: { fileName: string; mimeType: string; fileSizeBytes: number }): UploadValidationResult {
  const safeFileName = sanitizeFileName(payload.fileName)

  if (!payload.fileName.trim()) {
    return { ok: false, error: "Brakuje nazwy pliku." }
  }

  if (!ALLOWED_UPLOAD_MIME_TYPES.has(payload.mimeType)) {
    return { ok: false, error: "Ten typ pliku nie jest dozwolony." }
  }

  if (!Number.isFinite(payload.fileSizeBytes) || payload.fileSizeBytes <= 0) {
    return { ok: false, error: "Plik jest pusty." }
  }

  if (payload.fileSizeBytes > MAX_UPLOAD_SIZE_BYTES) {
    return { ok: false, error: "Plik jest za duzy (limit 10 MB)." }
  }

  return { ok: true, safeFileName }
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
