const encoder = new TextEncoder();
const toHex = (bytes) => [...bytes].map((value) => value.toString(16).padStart(2, '0')).join('');

export default async () => {
  const random = crypto.getRandomValues(new Uint8Array(32));
  const canary = `bb-b-edge-log-${toHex(random)}`;
  console.log(`BB_B_EDGE_LOG_CANARY=${canary}`);
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(canary));
  return new Response(JSON.stringify({
    schemaVersion: 1,
    kind: 'netlify-b-runtime-edge-log-proof',
    canarySha256: toHex(new Uint8Array(digest)),
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};

export const config = { path: '/bb-edge-log' };
