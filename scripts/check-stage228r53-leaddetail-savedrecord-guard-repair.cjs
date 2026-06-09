const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function must(condition, message) {
  if (!condition) throw new Error(message);
}

const lead = read('src/pages/LeadDetail.tsx');
const context = read('src/components/ContextActionDialogs.tsx');

must(lead.includes('savedRecord'), 'LeadDetail must consume savedRecord.');
must(lead.includes('setLinkedTasks') && lead.includes('setLinkedEvents'), 'LeadDetail must locally update linkedTasks/linkedEvents.');
must(lead.includes('loadLead({ silent: true })'), 'LeadDetail must keep background reload silent.');
must(context.includes('savedRecord'), 'ContextActionDialogs must include savedRecord in event detail.');
must(context.includes('handleSaved') && context.includes('savedRecord'), 'ContextActionDialogs handleSaved must accept savedRecord.');

console.log('STAGE228R53_LEADDETAIL_SAVEDRECORD_GUARD_REPAIR PASS');
