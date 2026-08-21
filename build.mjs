import { createHash, randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

const canary = `bb-b-runtime-log-${randomBytes(32).toString('hex')}`;
const canarySha256 = createHash('sha256').update(canary).digest('hex');
const bindingNames = ['SITE_ID', 'BUILD_ID', 'DEPLOY_ID', 'COMMIT_REF'];
if (bindingNames.some((name) => typeof process.env[name] !== 'string' || !process.env[name])) {
  throw new Error('B runtime build-log proof is missing deployment coordinates');
}
const evidenceBinding = Object.fromEntries(bindingNames.map((name) => [
  `${name.toLowerCase()}Sha256`, createHash('sha256').update(process.env[name]).digest('hex'),
]));

await mkdir('dist/.well-known', { recursive: true });
await writeFile('dist/index.html', `<!doctype html>
<title>owned B build log fixture</title>
<form name="bb-private-form-12e87924" method="POST" data-netlify="true" action="/form-ok.html">
  <input type="hidden" name="form-name" value="bb-private-form-12e87924">
  <input name="email" type="email">
  <input name="password" type="password">
  <textarea name="message"></textarea>
  <button type="submit">Submit</button>
</form>
`, 'utf8');
await writeFile('dist/form-ok.html', '<!doctype html><title>owned form accepted</title>\n', 'utf8');
await writeFile('dist/.well-known/bb-b-build-log-proof.json', `${JSON.stringify({
  schemaVersion: 1,
  kind: 'netlify-b-runtime-build-log-proof',
  canarySha256,
  evidenceBinding,
})}\n`, 'utf8');
console.log(`BB_B_BUILD_LOG_CANARY=${canary} PHASE=start`);
await setTimeout(12_000);
console.log(`BB_B_BUILD_LOG_CANARY=${canary} PHASE=end`);
