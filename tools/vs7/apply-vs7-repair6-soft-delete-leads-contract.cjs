#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const leadsPath = path.join(root, 'src/pages/Leads.tsx');
if (!fs.existsSync(leadsPath)) {
  throw new Error('Missing src/pages/Leads.tsx');
}

let source = fs.readFileSync(leadsPath, 'utf8');
const before = source;

function removeNamedImport(text, name) {
  return text
    .replace(new RegExp('\\r?\\n\\s*' + name + ',(?=\\r?\\n)', 'g'), '')
    .replace(new RegExp(',\\s*' + name + '(?=\\s*[}])', 'g'), '')
    .replace(new RegExp('([,{])\\s*' + name + '\\s*,', 'g'), '$1');
}

source = removeNamedImport(source, 'deleteLeadFromSupabase');
source = removeNamedImport(source, 'deleteClientFromSupabase');

function replaceFunction(text, names, replacement) {
  for (const name of names) {
    const marker = 'const ' + name + ' = async (candidate: EntityConflictCandidate) => {';
    const start = text.indexOf(marker);
    if (start === -1) continue;
    const braceStart = text.indexOf('{', start);
    if (braceStart === -1) throw new Error('Cannot locate function body for ' + name);

    let depth = 0;
    let endBrace = -1;
    for (let i = braceStart; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === '{') depth += 1;
      if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          endBrace = i;
          break;
        }
      }
    }
    if (endBrace === -1) throw new Error('Cannot parse function body for ' + name);

    let end = endBrace + 1;
    while (end < text.length && /\s/.test(text[end])) end += 1;
    if (text[end] === ';') end += 1;
    return text.slice(0, start) + replacement + text.slice(end);
  }
  return text;
}

const replacement = `const handleArchiveConflictCandidate = async (candidate: EntityConflictCandidate) => {
    const label = candidate.label || (candidate.entityType === 'client' ? 'klienta' : 'leada');
    const confirmed = window.confirm(
      'Przenieść rekord z konfliktu do kosza: ' + label + '? Rekord nie zostanie trwale skasowany i będzie możliwy do przywrócenia.',
    );
    if (!confirmed) return;

    try {
      setLeadSubmitting(true);
      if (candidate.entityType === 'client') {
        await updateClientInSupabase({ id: candidate.id, archivedAt: new Date().toISOString() });
      } else {
        await updateLeadInSupabase({
          id: candidate.id,
          status: 'archived',
          leadVisibility: 'trash',
          salesOutcome: 'archived',
          closedAt: new Date().toISOString(),
        });
      }
      setLeadConflictCandidates((current) => current.filter((item) => !(item.id === candidate.id && item.entityType === candidate.entityType)));
      toast.success('Rekord przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Nie udało się przenieść rekordu do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setLeadSubmitting(false);
    }
  };`;

source = replaceFunction(source, ['handleDeleteConflictCandidate', 'handleArchiveConflictCandidate'], replacement);
source = source.replace(/onDeleteCandidate=\{handleDeleteConflictCandidate\}/g, 'onDeleteCandidate={handleArchiveConflictCandidate}');

if (source.includes('deleteLeadFromSupabase')) {
  throw new Error('deleteLeadFromSupabase still present in src/pages/Leads.tsx');
}
if (source.includes('deleteClientFromSupabase')) {
  throw new Error('deleteClientFromSupabase still present in src/pages/Leads.tsx');
}
if (!source.includes('handleArchiveConflictCandidate')) {
  throw new Error('Missing handleArchiveConflictCandidate in src/pages/Leads.tsx');
}
if (!source.includes("status: 'archived'")) {
  throw new Error('Missing lead archive status in src/pages/Leads.tsx');
}
if (!source.includes("leadVisibility: 'trash'")) {
  throw new Error('Missing lead trash visibility in src/pages/Leads.tsx');
}
if (!source.includes('archivedAt: new Date().toISOString()')) {
  throw new Error('Missing client archive timestamp in src/pages/Leads.tsx');
}

if (source !== before) {
  fs.writeFileSync(leadsPath, source, 'utf8');
}

console.log('CLOSEFLOW_VS7_REPAIR6_SOFT_DELETE_LEADS_CONTRACT_PATCHED');
