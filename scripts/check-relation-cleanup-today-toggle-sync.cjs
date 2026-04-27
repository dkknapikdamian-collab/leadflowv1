const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const today = read('src/pages/Today.tsx');
const topicContact = read('src/lib/topic-contact.ts');
const clientDetail = read('src/pages/ClientDetail.tsx');
const leads = read('src/pages/Leads.tsx');

assert(today.includes('const direct = target.closest(\'[data-today-pipeline-shortcut]\');') || today.includes('const direct = target.closest("[data-today-pipeline-shortcut]");'), 'Today shortcut detector is still too broad');
assert(!today.includes("target.closest('a, button, [role=\"button\"], .rounded-2xl, .rounded-xl')"), 'Today shortcut detector still captures generic rounded cards');
assert(today.includes('next[id] = !wasCollapsed;'), 'Today manual tile click cannot collapse opened tile');
assert(today.includes('caseItem?.isBlocked'), 'Today blocked cases counter is too narrow');
assert(today.includes("status === 'waiting_on_client'"), 'Today blocked cases counter ignores waiting cases');

assert(topicContact.includes('activeCaseClientIds'), 'Topic picker does not hide lead options for clients with active cases');
assert(topicContact.includes('clients.flatMap'), 'Topic picker still creates every client option directly');
assert(topicContact.includes('dedupedOptions'), 'Topic picker does not dedupe options');
assert(topicContact.includes('const caseOptions: TopicContactOption[] = activeCases.map'), 'Topic picker still includes inactive/completed case options');

assert(clientDetail.includes('updateLeadInSupabase'), 'Client edit does not sync linked leads');
assert(clientDetail.includes('Promise.allSettled(linkedLeadUpdates)'), 'Client edit does not safely sync lead copies');

assert(leads.includes('clientId?: string | null;'), 'Lead list CaseRecord does not know clientId');
assert(leads.includes('casesByClientId'), 'Lead list does not link cases by clientId');
assert(leads.includes('resolveLinkedCaseForLead'), 'Lead list does not resolve service cases for leads by clientId');

console.log('OK: relation cleanup, Today toggle and client/lead sync are guarded.');
