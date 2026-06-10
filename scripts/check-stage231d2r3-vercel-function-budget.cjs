const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE='STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX';
const apiDir = path.join(root, 'api');
const errors=[];
console.log(STAGE+': start');
if (!fs.existsSync(apiDir)) errors.push('missing api directory');
const apiFiles = fs.existsSync(apiDir) ? fs.readdirSync(apiDir).filter((name)=>/\.(ts|js)$/.test(name)).sort() : [];
console.log('api function files: '+apiFiles.length+' / 12');
for (const name of apiFiles) console.log('- api/'+name);
if (apiFiles.length > 12) errors.push('Vercel Hobby Serverless Function budget exceeded: '+apiFiles.length+' > 12');
if (apiFiles.includes('case-costs.ts')) errors.push('api/case-costs.ts must not exist; case costs must be consolidated into api/cases.ts');
const casesPath=path.join(root,'api/cases.ts');
const fallbackPath=path.join(root,'src/lib/supabase-fallback.ts');
if (!fs.existsSync(casesPath)) errors.push('missing api/cases.ts');
if (!fs.existsSync(fallbackPath)) errors.push('missing src/lib/supabase-fallback.ts');
if (!errors.length) {
  const cases=fs.readFileSync(casesPath,'utf8');
  const fallback=fs.readFileSync(fallbackPath,'utf8');
  if (!cases.includes('handleCaseCostsResourceStage231D2R3')) errors.push('api/cases.ts missing case costs resource handler');
  if (!fallback.includes('/api/cases?resource=costs')) errors.push('supabase-fallback missing consolidated cost API route');
  if (fallback.includes('/api/case-costs')) errors.push('supabase-fallback still references removed /api/case-costs route');
}
if(errors.length){ console.error(STAGE+': FAIL'); for(const e of errors) console.error('- '+e); process.exit(1); }
console.log(STAGE+': PASS');
