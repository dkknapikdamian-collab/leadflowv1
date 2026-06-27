export function caseDetailPath(caseId: string) {
  return `/cases/${encodeURIComponent(String(caseId || ''))}`;
}
