#!/usr/bin/env node
/**
 * A23 Firestore export helper.
 *
 * This script is intentionally safe:
 * - it never deletes Firestore data,
 * - it never writes to Supabase,
 * - it creates a local JSON backup/export shape for the importer.
 *
 * Optional dependency:
 *   npm install --save-dev firebase-admin
 *
 * Required env for real export:
 *   FIREBASE_SERVICE_ACCOUNT_JSON_PATH
 *   or FIREBASE_SERVICE_ACCOUNT_JSON
 *
 * Optional env:
 *   FIRESTORE_EXPORT_OUT=data/firestore-export.json
 *   FIRESTORE_COLLECTIONS=leads,clients,cases,tasks,events,aiDrafts,responseTemplates,activities
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outFile = path.resolve(root, process.env.FIRESTORE_EXPORT_OUT || 'data/firestore-export.json');
const defaultCollections = [
  'leads',
  'clients',
  'cases',
  'tasks',
  'events',
  'aiDrafts',
  'responseTemplates',
  'activities',
];
const collections = String(process.env.FIRESTORE_COLLECTIONS || defaultCollections.join(','))
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function readServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson && rawJson.trim()) {
    return JSON.parse(rawJson);
  }

  const file = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH;
  if (file && file.trim()) {
    return JSON.parse(fs.readFileSync(path.resolve(root, file), 'utf8'));
  }

  return null;
}

async function main() {
  let admin;
  try {
    admin = require('firebase-admin');
  } catch {
    ensureDir(outFile);
    const placeholder = {
      exportedAt: nowIso(),
      mode: 'PLACEHOLDER_NO_FIREBASE_ADMIN',
      warning: 'firebase-admin is not installed. Install it only if you really need Firestore export.',
      collections: Object.fromEntries(collections.map((name) => [name, []])),
      meta: {
        decision: 'CLEAN_START_BY_DEFAULT',
        note: 'A23 default is clean start in Supabase. This file is only a safe placeholder.',
      },
    };
    fs.writeFileSync(outFile, JSON.stringify(placeholder, null, 2), 'utf8');
    console.log('OK: placeholder Firestore export written to ' + path.relative(root, outFile));
    console.log('No Firestore data was read. Install firebase-admin and set service account env only if migration is really needed.');
    return;
  }

  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON_PATH or FIREBASE_SERVICE_ACCOUNT_JSON');
  }

  if (!admin.apps || admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();
  const result = {
    exportedAt: nowIso(),
    mode: 'FIRESTORE_EXPORT',
    collections: {},
    meta: {
      collections,
      deleteFirestore: false,
    },
  };

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    result.collections[collectionName] = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    console.log(collectionName + ': ' + snapshot.size);
  }

  ensureDir(outFile);
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log('OK: Firestore export written to ' + path.relative(root, outFile));
  console.log('Backup created. Nothing was deleted.');
}

main().catch((error) => {
  console.error('Firestore export failed:', error && error.message ? error.message : error);
  process.exit(1);
});
