export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function compactSearchText(value: string) {
  return normalizeSearchText(value).replace(/\s+/g, '');
}

export function matchesNormalizedQuery(fields: Array<string | undefined | null>, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const compactQuery = compactSearchText(query);
  const haystack = normalizeSearchText(fields.filter(Boolean).join(' '));
  const compactHaystack = compactSearchText(fields.filter(Boolean).join(' '));

  return haystack.includes(normalizedQuery) || compactHaystack.includes(compactQuery);
}
