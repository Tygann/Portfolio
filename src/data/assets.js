import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Content versions keep existing Worker-compatible asset paths while invalidating caches.
export function assetUrl(name) {
  const bytes = readFileSync(resolve('public', name));
  const version = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return `/${name}?v=${version}`;
}
