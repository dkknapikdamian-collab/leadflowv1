const fs = require('fs');

const file = 'src/pages/Templates.tsx';
let src = fs.readFileSync(file, 'utf8');
const before = src;

const phrase = 'Gotowce do spraw, nie szablony odpowiedzi';

if (src.includes(phrase)) {
  const blockRe = /\s*<div[^>]*>\s*Gotowce do spraw, nie szablony odpowiedzi\s*<\/div>/m;

  if (blockRe.test(src)) {
    src = src.replace(blockRe, '');
  } else {
    src = src.replace(phrase, '');
  }

  fs.writeFileSync(file, src, 'utf8');
  console.log('Removed templates badge text locally.');
} else {
  console.log('Text already removed.');
}

const next = fs.readFileSync(file, 'utf8');

if (next.includes(phrase)) {
  console.error('Stage181P failed: phrase still exists.');
  process.exit(1);
}

if (before === next) {
  console.log('No file changes needed.');
}

console.log('OK Stage181P local: templates badge text removed.');
