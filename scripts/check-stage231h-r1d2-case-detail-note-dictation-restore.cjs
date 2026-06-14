const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(p){ return fs.readFileSync(path.join(root,p),'utf8'); }
function must(condition, message){ if(!condition){ console.error('STAGE231H_R1D2 FAIL:', message); process.exit(1); } }
function exists(p){ return fs.existsSync(path.join(root,p)); }

const src = read('src/pages/CaseDetail.tsx');
const stage = 'STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME';
must(src.includes(stage), 'missing R1D2 runtime marker');
must(src.includes('useRef'), 'missing useRef for SpeechRecognition/autosave refs');
must(src.includes('(window as any).SpeechRecognition') && src.includes('(window as any).webkitSpeechRecognition'), 'missing Web Speech API constructor fallback');
must(src.includes('Dyktuj notatkę'), 'missing visible Dyktuj notatkę label');
must(src.includes('data-stage231h-r1d2-voice-note-button="true"'), 'missing guarded voice note button');
const buttonIndex = src.indexOf('data-stage231h-r1d2-voice-note-button="true"');
const buttonSnippet = src.slice(Math.max(0, buttonIndex - 320), buttonIndex + 520);
must(!/disabled\s*=/.test(buttonSnippet), 'voice note button must not be disabled as final state');
must(!/aria-disabled\s*=\s*["{']true/.test(buttonSnippet), 'voice note button must not be aria-disabled as final state');
must(!buttonSnippet.toLowerCase().includes('wkrótce') && !buttonSnippet.toLowerCase().includes('wkrotce'), 'voice note button must not claim wkrótce');
must(src.includes('caseNoteDictationAutosaveRefStage231H_R1D2'), 'missing autosave debounce ref');
must(/setTimeout\s*\([\s\S]{0,220}2000/.test(src), 'missing autosave after about 2 seconds of silence');
must(src.includes('saveCaseDictatedNoteStage231H_R1D2'), 'missing dictated note save function');
must(/if \(!cleanNote\) return;/.test(src), 'missing empty transcription guard');
must(src.includes('lastSavedCaseNoteDictationStage231H_R1D2'), 'missing duplicate autosave guard');
must(src.includes('insertActivityToSupabase({') && src.includes('caseId,') && src.includes("eventType: 'operator_note'"), 'dictated note must save activity/note with caseId');
must(src.includes("source: STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME"), 'saved note payload must include R1D2 source marker');
must(src.includes('Mikrofon jest zablokowany') && src.includes('Dyktowanie nie jest obsługiwane'), 'missing unsupported/microphone-denied user messages');
must(src.includes('caseNoteDictationRecognitionRefStage231H_R1D2.current?.abort?.()'), 'missing unmount abort cleanup');

const etapas = read('_project/04_ETAPY_ROZWOJU_APLIKACJI.md');
must(etapas.includes(stage), 'central stage file missing R1D2');
must(etapas.includes('PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED'), 'central stage file missing R1G2 PRODUCT_PASS sync');
const testHistory = read('_project/13_TEST_HISTORY.md');
must(testHistory.includes(stage), 'test history missing R1D2');
const guards = read('_project/06_GUARDS_AND_TESTS.md');
must(guards.includes('check-stage231h-r1d2-case-detail-note-dictation-restore.cjs'), 'guards ledger missing R1D2 guard');
must(exists('_project/runs/STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md'), 'missing R1D2 run report');
must(exists('_project/obsidian_updates/2026-06-14_STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.md'), 'missing R1D2 Obsidian payload');
console.log('STAGE231H_R1D2 PASS: CaseDetail note dictation restore is guarded.');
