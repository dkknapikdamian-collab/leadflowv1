const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) {
    console.error('ERROR:', message);
    process.exit(1);
  }
}

assert(exists('firestore.rules'), 'firestore.rules is missing');
assert(exists('storage.rules'), 'storage.rules is missing');
assert(exists('firebase.json'), 'firebase.json is missing');

const firestore = read('firestore.rules');
const storage = read('storage.rules');
const firebaseJson = JSON.parse(read('firebase.json'));
const pkg = JSON.parse(read('package.json'));

assert(pkg.scripts && pkg.scripts['verify:security:firebase-stage03'], 'package.json must include verify:security:firebase-stage03');

assert(!firestore.includes('allow get: if true'), 'Firestore must not contain public allow get');
assert(!firestore.includes('allow read: if true'), 'Firestore must not contain public allow read');
assert(!firestore.includes('allow write: if true'), 'Firestore must not contain public allow write');
assert(!firestore.includes('isValidClientToken'), 'Firestore must not use isValidClientToken');
assert(!firestore.includes('exists(/databases/$(database)/documents/client_portal_tokens'), 'Firestore must not authorize by token document existence');
assert(!firestore.includes('allow read: if isValidClientToken'), 'Firestore must not allow portal reads by legacy token helper');
assert(!firestore.includes('allow read, update: if isValidClientToken'), 'Firestore case items must not be exposed by legacy token helper');
assert(!firestore.includes('allow create: if isValidClientToken'), 'Firestore activities must not be exposed by legacy token helper');
assert(firestore.includes('match /client_portal_tokens/{tokenId}'), 'Firestore must keep explicit client_portal_tokens lockdown block');
assert(firestore.includes('allow get, list: if isCaseOwner(tokenId);'), 'client_portal_tokens must be owner-only');
assert(firestore.includes('match /{document=**}'), 'Firestore must include catch-all deny block');
assert(firestore.includes('allow read, write: if false;'), 'Firestore must include deny-all fallback');

assert(!storage.includes('allow read: if true'), 'Storage must not contain public reads');
assert(!storage.includes('allow write: if true'), 'Storage must not contain public writes');
assert(!storage.includes('allow read, write: if true'), 'Storage must not contain public read/write');
assert(storage.includes('match /cases/{caseId}/{allPaths=**}'), 'Storage must explicitly lock legacy cases path');
assert(storage.includes('Do not authorize by caseId'), 'Storage cases path must document caseId auth ban');
assert(storage.includes('allow read, write: if false;'), 'Storage must include deny rules');
assert(storage.includes('match /{allPaths=**}'), 'Storage must include catch-all deny block');

assert(firebaseJson.firestore && firebaseJson.firestore.rules === 'firestore.rules', 'firebase.json must point Firestore rules to firestore.rules');
assert(firebaseJson.storage && firebaseJson.storage.rules === 'storage.rules', 'firebase.json must point Storage rules to storage.rules');

console.log('OK: Stage 03 Firebase legacy lockdown guard passed.');
