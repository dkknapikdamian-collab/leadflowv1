const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const calendarPath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const stage116TestPath = path.join(root, 'tests', 'stage116-dialog-description-accessibility-contract.test.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function normalizeHeaderByTitle(source, title, descriptionAttr, descriptionText) {
  const titleTag = `<DialogTitle>${title}</DialogTitle>`;
  const titleIndex = source.indexOf(titleTag);
  if (titleIndex === -1) {
    throw new Error(`Stage116C cannot find DialogTitle: ${title}`);
  }

  const headerStart = source.lastIndexOf('<DialogHeader', titleIndex);
  if (headerStart === -1) {
    throw new Error(`Stage116C cannot find DialogHeader start for: ${title}`);
  }

  const headerEndTag = '</DialogHeader>';
  const headerEnd = source.indexOf(headerEndTag, titleIndex);
  if (headerEnd === -1) {
    throw new Error(`Stage116C cannot find DialogHeader end for: ${title}`);
  }

  const replacement = `          <DialogHeader>\n            <DialogTitle>${title}</DialogTitle>\n            <DialogDescription className="event-form-vnext-description" data-calendar-modal-description="${descriptionAttr}" data-stage114-calendar-modal-description="${descriptionAttr}">${descriptionText}</DialogDescription>\n          </DialogHeader>`;

  return source.slice(0, headerStart) + replacement + source.slice(headerEnd + headerEndTag.length);
}

let calendar = read(calendarPath);
calendar = normalizeHeaderByTitle(
  calendar,
  'Zaplanuj wydarzenie',
  'create-event',
  'Ustaw termin, powiązanie, przypomnienia i cykliczność wydarzenia w kalendarzu.',
);
calendar = normalizeHeaderByTitle(
  calendar,
  'Dodaj zadanie',
  'create-task',
  'Ustaw termin, priorytet i powiązanie zadania w kalendarzu.',
);
calendar = normalizeHeaderByTitle(
  calendar,
  'Edytuj wpis z kalendarza',
  'edit-entry',
  'Zmień datę, godzinę, relację, przypomnienia albo status wpisu w kalendarzu.',
);

for (const marker of ['data-calendar-modal-description="create-event"', 'data-calendar-modal-description="create-task"', 'data-calendar-modal-description="edit-entry"']) {
  if (!calendar.includes(marker)) {
    throw new Error(`Stage116C missing Calendar marker after patch: ${marker}`);
  }
}

const descriptionCount = (calendar.match(/<DialogDescription\b/g) || []).length;
if (descriptionCount < 3) {
  throw new Error(`Stage116C expected at least three Calendar DialogDescription tags, found ${descriptionCount}`);
}

write(calendarPath, calendar);
console.log('Stage116C normalized Calendar DialogDescription headers for Stage114/Stage116 compatibility.');

if (fs.existsSync(stage116TestPath)) {
  let testSource = read(stage116TestPath);
  testSource = testSource.replace(
    /<DialogDescription>\[\\s\\S\]\*kalendarz\[\\s\\S\]\*<\\\/DialogDescription>/g,
    '<DialogDescription\\b[^>]*>[\\s\\S]*kalendarz[\\s\\S]*<\\/DialogDescription>',
  );
  testSource = testSource.replace(
    /<DialogDescription>\[\\s\\S\]\*<\\\/DialogDescription>/g,
    '<DialogDescription\\b[^>]*>[\\s\\S]*<\\/DialogDescription>',
  );
  if (!/DialogDescription\\b\[\^>\]\*/.test(testSource)) {
    throw new Error('Stage116C failed to make Stage116 guard attribute-aware.');
  }
  write(stage116TestPath, testSource);
  console.log('Stage116C made Stage116 guard attribute-aware without removing description requirement.');
}
