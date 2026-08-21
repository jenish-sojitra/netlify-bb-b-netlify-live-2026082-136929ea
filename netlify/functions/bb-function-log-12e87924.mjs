import { createHash, randomBytes } from 'node:crypto';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export const handler = async (event) => {
  if (event?.queryStringParameters?.mode === 'controlled-throw') {
    throw new Error('bb-controlled-public-function-error-12e87924');
  }
  const canary = `bb-b-function-selector-${randomBytes(32).toString('hex')}`;
  console.log(`BB_B_FUNCTION_SELECTOR_CANARY=${canary}`);
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify({
      schemaVersion: 1,
      kind: 'netlify-b-runtime-function-selector-proof',
      canarySha256: sha256(canary),
      evidenceBinding: {
        siteIdSha256: sha256(process.env.SITE_ID ?? ''),
        deployIdSha256: sha256(process.env.DEPLOY_ID ?? ''),
      },
    }),
  };
};
