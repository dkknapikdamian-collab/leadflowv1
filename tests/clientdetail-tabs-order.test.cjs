#!/usr/bin/env node
/*
  Guard: ClientDetail tabs order
  Required order in client detail tabs: Sprawy before Podsumowanie.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'build', '.next', '.git', 'coverage', '.vercel']);
const EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function extractRelevantSnippet(content) {
  const anchors = ['client-detail-tabs', 'Zak\u0142adki klienta', 'CLIENT_TABS', 'clientTabs', 'tabs'];
  for (const anchor of anchors) {
    const idx = content.indexOf(anchor);
    if (idx !== -1) {
      return content.slice(Math.max(0, idx - 2500), Math.min(content.length, idx + 6000));
    }
  }
  return content;
}

function main() {
  const srcDir = path.join(ROOT, 'src');
  const files = walk(srcDir).filter((file) => {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    return (
      /ClientDetail/i.test(rel) ||
      content.includes('client-detail-tabs') ||
      content.includes('Zak\u0142adki klienta') ||
      (content.includes('Podsumowanie') && content.includes('Sprawy') && /client/i.test(rel))
    );
  });

  const hits = [];
  const failures = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('Podsumowanie') || !content.includes('Sprawy')) continue;
    const snippet = extractRelevantSnippet(content);
    const casesIdx = snippet.indexOf('Sprawy');
    const summaryIdx = snippet.indexOf('Podsumowanie');
    if (casesIdx === -1 || summaryIdx === -1) continue;
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    hits.push(rel);
    if (!(casesIdx < summaryIdx)) {
      failures.push(`${rel}: oczekiwano, \u017Ce "Sprawy" b\u0119dzie przed "Podsumowanie" w zak\u0142adkach klienta.`);
    }
  }

  if (!hits.length) {
    throw new Error('Nie znaleziono zak\u0142adek klienta zawieraj\u0105cych etykiety "Sprawy" i "Podsumowanie". Guard nie ma czego sprawdzi\u0107.');
  }

  if (failures.length) {
    console.error('FAIL clientdetail-tabs-order.test.cjs');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`OK clientdetail-tabs-order.test.cjs \u2014 sprawdzono: ${hits.join(', ')}`);
}

try {
  main();
} catch (error) {
  console.error('FAIL clientdetail-tabs-order.test.cjs:', error.message);
  process.exit(1);
}
