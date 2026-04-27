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

const tasks = read('src/pages/Tasks.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const topicContact = read('src/lib/topic-contact.ts');

assert(tasks.includes('clientId: newTask.clientId || null'), 'Tasks add flow does not save clientId');
assert(tasks.includes('clientId: editTask.clientId || payload.clientId || null'), 'Tasks edit flow does not save clientId');
assert(tasks.includes('Status zadania'), 'Tasks edit dialog misses status field');
assert(tasks.includes('selectedEditTaskOption'), 'Tasks edit dialog misses relation picker');
assert(topicContact.includes('clientId: option.clientId || null'), 'topic-contact resolve does not return clientId');
assert(topicContact.includes('clientId?: string | null'), 'topic-contact find option does not accept clientId');
assert(clientDetail.includes('data-client-inline-contact-edit="true"'), 'ClientDetail missing inline contact edit panel');
assert(clientDetail.includes("contactEditing ? 'Zapisz' : 'Edytuj'"), 'ClientDetail edit button does not toggle label');
assert(clientDetail.includes('Kopiuj telefon'), 'ClientDetail missing phone copy icon');
assert(clientDetail.includes('Kopiuj email'), 'ClientDetail missing email copy icon');
assert(!clientDetail.includes("{ key: 'contact', label: 'Kontakt' }"), 'ClientDetail still exposes Kontakt tab');
assert(!clientDetail.includes("setActiveTab('contact')"), 'ClientDetail still opens duplicated contact tab');

console.log('OK: task edit and client inline contact are guarded.');
