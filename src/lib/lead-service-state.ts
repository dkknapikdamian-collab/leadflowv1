export const LEAD_IN_SERVICE_STATUSES = new Set([
  'in_service',
  'moved_to_service',
  'pozyskany_do_obslugi',
]);

function normalizeStatus(value: unknown) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function isLeadInServiceStatus(status: unknown) {
  return LEAD_IN_SERVICE_STATUSES.has(normalizeStatus(status));
}

export function resolveLeadServiceBanner(hasCaseLink: boolean, status: unknown) {
  if (hasCaseLink || isLeadInServiceStatus(status)) return 'Ten temat jest ju¿ w obs³udze';
  return 'Rozpocznij obs³ugê';
}
