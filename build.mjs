import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

const canary = process.env.BB_B_BUILD_LOG_CANARY;
if (!/^bb-b-build-log-[a-f0-9]{64}$/.test(canary ?? '')) {
  throw new Error('B build-log canary is missing or malformed');
}

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><title>owned B build log fixture</title>\n', 'utf8');
console.log(`BB_B_BUILD_LOG_CANARY=${canary} PHASE=start`);
await setTimeout(12_000);
console.log(`BB_B_BUILD_LOG_CANARY=${canary} PHASE=end`);
