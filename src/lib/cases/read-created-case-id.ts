export function readCreatedCaseId(result: unknown) {
  const row = (result || {}) as Record<string, any>;
  return String(
    row.id
    || row.caseId
    || row.case_id
    || row.case?.id
    || row.data?.id
    || row.data?.case?.id
    || row.row?.id
    || ''
  ).trim();
}
