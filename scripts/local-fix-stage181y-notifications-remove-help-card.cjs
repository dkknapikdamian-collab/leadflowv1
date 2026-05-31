const fs = require('fs');

const file = 'src/pages/NotificationsCenter.tsx';
let src = fs.readFileSync(file, 'utf8');
const before = src;

// Remove unused Mail import after deleting the help card.
src = src.replace(/,\s*Mail\b/g, '');
src = src.replace(/\bMail,\s*/g, '');

// Remove the whole "Jak działają powiadomienia?" right-rail card.
const helpCardRe = /\n\s*<section className="right-card notifications-right-card"(?:\s+data-notification-rail-card="help")?>\s*<div className="notifications-right-card-head">\s*<Mail className="h-4 w-4" \/>\s*<h2>Jak działają powiadomienia\?<\/h2>\s*<\/div>\s*<p className="notifications-rail-empty">[\s\S]*?<\/p>\s*<\/section>/m;

if (helpCardRe.test(src)) {
  src = src.replace(helpCardRe, '');
} else if (src.includes('Jak działają powiadomienia?')) {
  throw new Error('Found help card text but could not safely remove the full section.');
}

fs.writeFileSync(file, src, 'utf8');

const next = fs.readFileSync(file, 'utf8');

const failures = [];

for (const forbidden of [
  'Jak działają powiadomienia?',
  'Ten widok zbiera terminy',
  '<Mail className="h-4 w-4" />',
]) {
  if (next.includes(forbidden)) failures.push('Still present: ' + forbidden);
}

const lucideImport = next.match(/import\s*\{[\s\S]*?\}\s*from\s*['"]lucide-react['"];?/m)?.[0] || '';
if (/\bMail\b/.test(lucideImport)) {
  failures.push('Mail is still imported from lucide-react.');
}

if (failures.length) {
  console.error('Stage181Y local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('No changes needed. Help card already removed.');
} else {
  console.log('Patched Stage181Y locally.');
}

console.log('OK Stage181Y local: notifications help card removed.');
