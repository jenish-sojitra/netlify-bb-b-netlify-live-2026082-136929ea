import { createHash, randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

const canary = `bb-b-runtime-log-${randomBytes(32).toString('hex')}`;
const canarySha256 = createHash('sha256').update(canary).digest('hex');

await mkdir('dist/.well-known', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><title>owned B build log fixture</title>\n', 'utf8');
await writeFile('dist/.well-known/bb-b-build-log-proof.json', `${JSON.stringify({
  schemaVersion: 1,
  kind: 'netlify-b-runtime-build-log-proof',
  canarySha256,
})}\n`, 'utf8');
console.log(`BB_B_BUILD_LOG_CANARY=${canary} PHASE=start`);
await setTimeout(12_000);
console.log(`BB_B_BUILD_LOG_CANARY=${canary} PHASE=end`);
