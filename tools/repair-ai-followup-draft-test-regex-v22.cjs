const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const file = path.join(root, 'tests', 'ai-followup-draft.test.cjs');
let text = fs.readFileSync(file, 'utf8');
const before = text;

const brokenLine = `  assert.doesNotMatch(detail, /from ['"]../components/LeadAiFollowupDraft['"]/);`;
const fixedLine = `  assert.doesNotMatch(detail, /from ['"]\\.\\.\\/components\\/LeadAiFollowupDraft['"]/);`;

if (text.includes(brokenLine)) {
  text = text.replace(brokenLine, fixedLine);
} else {
  const lines = text.split(/\r?\n/);
  let changed = false;
  const next = lines.map((line) => {
    if (line.includes(`assert.doesNotMatch(detail, /from ['"]../components/LeadAiFollowupDraft['"]/);`)) {
      changed = true;
      return fixedLine;
    }
    return line;
  });
  if (changed) text = next.join(text.includes('\r\n') ? '\r\n' : '\n');
}

if (text === before) {
  if (text.includes(`assert.doesNotMatch(detail, /from ['"]\\.\\.\\/components\\/LeadAiFollowupDraft['"]/);`)) {
    console.log('AI followup draft regex already fixed.');
  } else {
    console.error('Could not find broken regex line in tests/ai-followup-draft.test.cjs.');
    console.error('Search manually for: assert.doesNotMatch(detail, /from');
    process.exit(1);
  }
} else {
  fs.writeFileSync(file, text, 'utf8');
  console.log('Fixed invalid regex in tests/ai-followup-draft.test.cjs');
}
