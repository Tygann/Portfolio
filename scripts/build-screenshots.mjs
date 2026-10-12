// Generate smaller delivery assets; keep full-resolution public sources unchanged.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

let originalBytes = 0;
let mobileBytes = 0;
for (const app of ['renfo', 'homestead', 'iwatch']) {
  const directory = join('dist', app, 'screens');
  for (const file of await readdir(directory)) {
    if (!file.endsWith('.webp')) continue;
    const input = join(directory, file);
    originalBytes += (await stat(input)).size;
    for (const width of [360, 720]) {
      const output = input.replace(/\.webp$/, `-${width}w.webp`);
      await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(output);
      if (width === 720) mobileBytes += (await stat(output)).size;
    }
  }
}
console.log(`Screenshot delivery: full-resolution ${originalBytes} bytes; 720px variants ${mobileBytes} bytes.`);
