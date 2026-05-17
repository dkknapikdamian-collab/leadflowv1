const calendarRenderSmokeEntry = {
  id: 'stage108-calendar-smoke-event-1',
  kind: 'event',
  typeLabel: 'Wydarzenie',
  title: 'Akt jaskiniowiec',
  time: '10:29',
  statusLabel: 'Zaplanowane',
  relationLabel: 'Brak powiązania',
  actions: ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Usuń'],
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderSelectedDayEntryHtml(entry = calendarRenderSmokeEntry) {
  const actionHtml = entry.actions
    .map((action) => `<button type="button" class="cf-selected-day-v9-action">${escapeHtml(action)}</button>`)
    .join('');

  return [
    '<article data-cf-calendar-selected-day-entry-v9="true" class="cf-selected-day-v9-entry-shell">',
    '  <div class="cf-selected-day-v9-main">',
    '    <div class="cf-selected-day-v9-meta">',
    `      <span class="cf-selected-day-v9-type">${escapeHtml(entry.typeLabel)}</span>`,
    `      <span class="cf-selected-day-v9-time">${escapeHtml(entry.time)}</span>`,
    `      <span class="cf-selected-day-v9-status">${escapeHtml(entry.statusLabel)}</span>`,
    '    </div>',
    `    <h4 class="cf-selected-day-v9-entry-title">${escapeHtml(entry.title)}</h4>`,
    `    <div class="cf-selected-day-v9-relation">${escapeHtml(entry.relationLabel)}</div>`,
    '  </div>',
    `  <div class="cf-selected-day-v9-actions">${actionHtml}</div>`,
    '</article>',
  ].join('\n');
}

module.exports = {
  calendarRenderSmokeEntry,
  renderSelectedDayEntryHtml,
};
