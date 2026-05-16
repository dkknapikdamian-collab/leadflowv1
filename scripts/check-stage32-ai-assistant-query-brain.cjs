const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const file = path.join(repo, 'src', 'lib', 'ai-assistant.ts');
const body = fs.readFileSync(file, 'utf8');

function expect(text, label = text) {
  if (!body.includes(text)) {
    throw new Error('src/lib/ai-assistant.ts missing ' + label);
  }
  console.log('OK: src/lib/ai-assistant.ts contains ' + label);
}

expect('AI_ASSISTANT_QUERY_BRAIN_STAGE32', 'Stage32 query brain marker');
expect('buildStage32LocalQueryBrainAnswer(input)', 'local query brain preflight');
expect('stage32WantsMostTasksDay', 'most tasks day recognizer');
expect('stage32BuildMostTasksDayAnswer', 'most tasks day answer');
expect('stage32WantsFirstTask', 'first task recognizer');
expect('stage32BuildFirstTaskAnswer', 'first task in range answer');
expect('stage32ResolveDateRange', 'date range resolver');
expect('nast\u0119pnym miesi\u0105cu', 'next month Polish range label');
expect("costGuard: 'local_rules'", 'local rules cost guard');
expect("operatorIntent: 'task_day_with_most_tasks'", 'task day analytics intent');
expect("operatorIntent: 'first_task_in_range'", 'first task analytics intent');
expect("operatorIntent: 'app_map'", 'app map intent');

const askIndex = body.indexOf('export async function askTodayAiAssistant(input: TodayAiAssistantInput)');
const localIndex = body.indexOf('buildStage32LocalQueryBrainAnswer(input)', askIndex);
const fetchIndex = body.indexOf("fetch('/api/system?kind=ai-assistant'", askIndex);
if (askIndex < 0 || localIndex < 0 || fetchIndex < 0 || localIndex > fetchIndex) {
  throw new Error('Stage32 local query brain must run before /api/system fetch');
}
console.log('OK: Stage32 local query brain runs before external/server assistant fetch');

console.log('stage32-ai-assistant-query-brain: PASS');
