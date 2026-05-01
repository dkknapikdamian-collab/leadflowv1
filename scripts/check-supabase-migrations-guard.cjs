#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const migrationsDir = path.join(repoRoot, 'supabase', 'migrations');

if (!fs.existsSync(migrationsDir)) {
  console.log('MIGRATION_GUARD_OK: no supabase/migrations directory.');
  process.exit(0);
}

const migrationFiles = fs
  .readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
  .map((entry) => entry.name)
  .sort();

const errors = [];
const numbers = [];
const warnings = [];

for (const filename of migrationFiles) {
  const match = filename.match(/^(\d{14}|\d{8}|\d{4}-\d{2}-\d{2})_/);
  if (!match) {
    errors.push(`INVALID_FILENAME_PREFIX: ${filename} (expected YYYYMMDD_*, YYYY-MM-DD_* or YYYYMMDDHHMMSS_*)`);
    continue;
  }

  const normalizedPrefix = match[1].replace(/-/g, '');
  const numericPrefix = Number(normalizedPrefix);
  if (!Number.isFinite(numericPrefix)) {
    errors.push(`INVALID_NUMERIC_PREFIX: ${filename}`);
    continue;
  }
  numbers.push({ filename, numericPrefix, rawPrefix: match[1] });

  const filePath = path.join(migrationsDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');

  const hasDestructiveDrop = /\bDROP\s+(TABLE|SCHEMA|DATABASE)\b/i.test(content);
  if (hasDestructiveDrop) {
    const hasJustification = /(--\s*ALLOW_DESTRUCTIVE_DROP|\/\*\s*ALLOW_DESTRUCTIVE_DROP[\s\S]*?\*\/)/i.test(content);
    if (!hasJustification) {
      errors.push(`DESTRUCTIVE_DROP_WITHOUT_COMMENT: ${filename} (add ALLOW_DESTRUCTIVE_DROP comment)`);
    }
  }

  const likelySecretPatterns = [
    /sk_(live|test)_[a-z0-9]+/i,
    /AIza[0-9A-Za-z\-_]{20,}/,
    /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/,
    /\b(SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY|GEMINI_API_KEY|STRIPE_SECRET_KEY)\b/i,
  ];
  if (likelySecretPatterns.some((pattern) => pattern.test(content))) {
    errors.push(`POSSIBLE_SECRET_IN_MIGRATION: ${filename}`);
  }
}

for (let i = 1; i < numbers.length; i += 1) {
  const prev = numbers[i - 1];
  const next = numbers[i];

  const prevIsStrictTimestamp = /^\d{14}$/.test(prev.rawPrefix);
  const nextIsStrictTimestamp = /^\d{14}$/.test(next.rawPrefix);
  const strictPair = prevIsStrictTimestamp && nextIsStrictTimestamp;

  if (next.numericPrefix === prev.numericPrefix) {
    if (strictPair) {
      errors.push(`DUPLICATE_MIGRATION_PREFIX: ${prev.filename} and ${next.filename}`);
    } else {
      warnings.push(`LEGACY_DUPLICATE_DATE_PREFIX: ${prev.filename} and ${next.filename}`);
    }
  }

  if (next.numericPrefix < prev.numericPrefix) {
    if (strictPair) {
      errors.push(`NON_MONOTONIC_ORDER: ${prev.filename} then ${next.filename}`);
    } else {
      warnings.push(`LEGACY_NON_MONOTONIC_ORDER: ${prev.filename} then ${next.filename}`);
    }
  }
}

if (errors.length > 0) {
  console.error('MIGRATION_GUARD_FAILED');
  for (const error of errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}

for (const warning of warnings) {
  console.warn(`MIGRATION_GUARD_WARNING: ${warning}`);
}

console.log(`MIGRATION_GUARD_OK: checked ${migrationFiles.length} migration file(s).`);
