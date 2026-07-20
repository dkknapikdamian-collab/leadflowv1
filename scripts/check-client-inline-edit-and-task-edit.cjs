const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8').replace(/^\uFEFF/, '');
}

function assertIncludes(content, text, message) {
  if (!content.includes(text)) {
    console.error(message);
    process.exit(1);
  }
}

function assertExcludes(content, text, message) {
  if (content.includes(text)) {
    console.error(message);
    process.exit(1);
  }
}

const tasks = read('src/pages/Tasks.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const topicContact = read('src/lib/topic-contact.ts');

assertIncludes(tasks, 'clientId: newTask.clientId || null', 'Tasks add flow does not save clientId');
assertIncludes(tasks, 'clientId: editTask.clientId || payload.clientId || null', 'Tasks edit flow does not preserve clientId');
assertIncludes(tasks, 'Status zadania', 'Tasks edit dialog misses status field');
assertIncludes(tasks, 'selectedEditTaskOption', 'Tasks edit dialog misses relation picker');

assertIncludes(topicContact, 'clientId: option.clientId || null', 'topic-contact resolve does not return clientId');
assertIncludes(topicContact, 'clientId?: string | null', 'topic-contact find option does not accept clientId');
assertIncludes(topicContact, "option.clientId === params.clientId && !option.disabled", 'topic-contact cannot resolve an enabled client relation');

assertIncludes(clientDetail, 'data-client-inline-contact-edit="true"', 'ClientDetail missing inline contact edit panel');
assertIncludes(clientDetail, "contactEditing ? 'Zapisz dane' : 'Edytuj dane'", 'ClientDetail edit action does not use current visible labels');
assertIncludes(clientDetail, '<ClientMultiContactField', 'ClientDetail missing current multi-contact editor');
assertIncludes(clientDetail, 'kind="phone"', 'ClientDetail missing phone multi-contact field');
assertIncludes(clientDetail, 'kind="email"', 'ClientDetail missing email multi-contact field');
assertIncludes(clientDetail, 'const copyValue = async', 'ClientDetail missing clipboard helper');
assertIncludes(clientDetail, "copyValue('Telefon', String(client.phone || ''))", 'ClientDetail phone copy action is not wired');
assertIncludes(clientDetail, "copyValue('E-mail', String(client.email || ''))", 'ClientDetail email copy action is not wired');
assertIncludes(clientDetail, '>Kopiuj</button>', 'ClientDetail copy actions are not visible');

assertExcludes(clientDetail, "{ key: 'contact', label: 'Kontakt' }", 'ClientDetail still exposes duplicated Kontakt tab');
assertExcludes(clientDetail, "setActiveTab('contact')", 'ClientDetail still opens duplicated contact tab');

console.log('OK: client inline edit and task edit guard reconciled with current contact and relation source truth.');
